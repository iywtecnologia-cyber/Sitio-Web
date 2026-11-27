// Worker de la fábrica de sistemas (Cloudflare). Endpoints que usa tecnoros.ar/crear:
//   POST /api/fabrica/entrevista  { historial }        → próxima pregunta + resumen
//   POST /api/fabrica/generar     { historial }        → { spec } (primera versión)
//   POST /api/fabrica/cambiar     { spec, pedido }     → { parche, explicacion }
//   POST /api/fabrica/proyectos   { nombre, spec, nota, historial?, contacto? } → { id, numero }
//   GET  /api/fabrica/proyectos/:id                    → { proyecto, versiones }
import { usarHerramienta, type MensajeClaude } from './claude';
import { ANALISTA, EDITOR, GENERADOR } from './prompts';
import { ESQUEMA_SPEC, aplicarParche, validar, type OpParche, type Spec } from '../../src/fabrica/spec';

export interface Env {
  DB: D1Database;
  ANTHROPIC_API_KEY: string;
  TURNSTILE_SECRET?: string;
  MODELO: string;
  ORIGENES: string;
  LIMITE_DIARIO: string;
}

interface Mensaje {
  de: 'analista' | 'persona';
  texto: string;
}

const MAX_MENSAJES = 40;
const MAX_TEXTO = 600;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origen = req.headers.get('Origin') ?? '';
    const permitido = env.ORIGENES.split(',').map((x) => x.trim()).includes(origen);
    const cors: Record<string, string> = permitido
      ? { 'Access-Control-Allow-Origin': origen, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
      : {};
    const json = (datos: unknown, status = 200) => new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors } });
    if (req.method === 'OPTIONS') return new Response(null, { status: permitido ? 204 : 403, headers: cors });
    if (origen && !permitido) return json({ error: 'Origen no permitido' }, 403);

    const url = new URL(req.url);
    try {
      if (req.method === 'GET' && url.pathname.startsWith('/api/fabrica/proyectos/')) {
        return json(await leerProyecto(env, url.pathname.split('/').at(-1)!));
      }
      if (req.method !== 'POST') return json({ error: 'No encontrado' }, 404);
      const cuerpo = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!cuerpo) return json({ error: 'Pedido inválido' }, 400);

      // Tope de uso por IP y por día (la IA se paga por uso).
      const ip = req.headers.get('CF-Connecting-IP') ?? 'local';
      if (!(await sumarUso(env, ip))) return json({ error: 'Llegaste al límite de hoy. Escribinos y lo seguimos con vos.' }, 429);

      switch (url.pathname) {
        case '/api/fabrica/entrevista':
          return json(await entrevista(env, historialValido(cuerpo.historial)));
        case '/api/fabrica/generar':
          return json({ spec: await generarSpec(env, historialValido(cuerpo.historial)) });
        case '/api/fabrica/cambiar':
          return json(await proponerCambio(env, cuerpo.spec as Spec, String(cuerpo.pedido ?? '').slice(0, MAX_TEXTO)));
        case '/api/fabrica/proyectos':
          return json(await guardarProyecto(env, cuerpo));
        default:
          return json({ error: 'No encontrado' }, 404);
      }
    } catch (e) {
      console.error(e);
      return json({ error: e instanceof Error ? e.message : 'Error inesperado' }, 500);
    }
  },
};

// ── Validación de entrada ──
function historialValido(h: unknown): Mensaje[] {
  if (!Array.isArray(h)) throw new Error('Falta el historial.');
  return h.slice(-MAX_MENSAJES).map((m) => {
    const x = m as Partial<Mensaje>;
    if ((x.de !== 'analista' && x.de !== 'persona') || typeof x.texto !== 'string') throw new Error('Historial inválido.');
    return { de: x.de, texto: x.texto.slice(0, MAX_TEXTO) };
  });
}

const aClaude = (h: Mensaje[]): MensajeClaude[] => {
  // La conversación se le pasa como un único texto: queda claro qué dijo cada uno y que son datos.
  const t = h.map((m) => `${m.de === 'analista' ? 'Analista' : 'Dueño'}: ${m.texto}`).join('\n');
  return [{ role: 'user', content: `<entrevista>\n${t || '(todavía no empezó)'}\n</entrevista>` }];
};

async function sumarUso(env: Env, ip: string): Promise<boolean> {
  const dia = new Date().toISOString().slice(0, 10);
  const r = await env.DB.prepare(
    'INSERT INTO usos (ip, dia, llamadas) VALUES (?1, ?2, 1) ON CONFLICT(ip, dia) DO UPDATE SET llamadas = llamadas + 1 RETURNING llamadas',
  ).bind(ip, dia).first<{ llamadas: number }>();
  return (r?.llamadas ?? 0) <= Number(env.LIMITE_DIARIO || 80);
}

// ── IA ──
const RESPONDER = {
  name: 'responder',
  description: 'La próxima pregunta para el dueño y lo que se entendió hasta ahora.',
  input_schema: {
    type: 'object',
    required: ['pregunta', 'resumen', 'listo'],
    properties: {
      pregunta: { type: 'string' },
      opciones: { type: 'array', items: { type: 'string' }, maxItems: 5 },
      ayuda: { type: 'string', description: 'Un ejemplo corto de respuesta' },
      listo: { type: 'boolean' },
      resumen: {
        type: 'object',
        required: ['entidades', 'roles', 'flujos', 'dolores'],
        properties: {
          entidades: { type: 'array', items: { type: 'string' } },
          roles: { type: 'array', items: { type: 'string' } },
          flujos: { type: 'array', items: { type: 'string' } },
          dolores: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
};

const entrevista = (env: Env, h: Mensaje[]) => usarHerramienta(env, ANALISTA, aClaude(h), RESPONDER, 900);

async function generarSpec(env: Env, h: Mensaje[]): Promise<Spec> {
  const herramienta = { name: 'entregar_spec', description: 'La spec completa del sistema.', input_schema: ESQUEMA_SPEC as unknown as Record<string, unknown> };
  const mensajes = aClaude(h);
  for (let intento = 0; intento < 2; intento++) {
    const spec = await usarHerramienta<Spec>(env, GENERADOR, mensajes, herramienta, 8000);
    const problemas = validar(spec);
    if (!problemas.length) return spec;
    // Se le devuelven los problemas para que corrija (una vez).
    mensajes.push({ role: 'assistant', content: JSON.stringify(spec) }, { role: 'user', content: `La spec tiene estos problemas, corregilos: ${problemas.join(' ')}` });
  }
  throw new Error('No se pudo generar una spec válida.');
}

async function proponerCambio(env: Env, spec: Spec, pedido: string) {
  if (validar(spec).length) throw new Error('La spec recibida no es válida.');
  if (!pedido.trim()) throw new Error('Falta el pedido.');
  const herramienta = {
    name: 'proponer_parche',
    description: 'El parche JSON que aplica el cambio pedido, y una frase que lo explica.',
    input_schema: {
      type: 'object',
      required: ['explicacion', 'parche'],
      properties: {
        explicacion: { type: 'string' },
        parche: { type: 'array', items: { type: 'object', required: ['op', 'path'], properties: { op: { enum: ['add', 'replace', 'remove'] }, path: { type: 'string' }, value: {} } } },
      },
    },
  };
  // El logo (imagen en base64) no hace falta para editar: se saca para no gastar tokens.
  const { logo, ...marca } = spec.marca;
  void logo;
  const liviana = { ...spec, marca };
  const mensajes: MensajeClaude[] = [{ role: 'user', content: `<spec>\n${JSON.stringify(liviana)}\n</spec>\n<pedido>${pedido}</pedido>` }];
  for (let intento = 0; intento < 2; intento++) {
    const r = await usarHerramienta<{ explicacion: string; parche: OpParche[] }>(env, EDITOR, mensajes, herramienta, 2500);
    try {
      aplicarParche(spec, r.parche);
      return r;
    } catch (e) {
      mensajes.push({ role: 'assistant', content: JSON.stringify(r) }, { role: 'user', content: `Ese parche no se puede aplicar: ${e instanceof Error ? e.message : e}. Corregilo.` });
    }
  }
  throw new Error('No pude armar ese cambio. Probá decirlo de otra forma.');
}

// ── Proyectos ──
async function guardarProyecto(env: Env, c: Record<string, unknown>) {
  const spec = c.spec as Spec;
  const problemas = validar(spec);
  if (problemas.length) throw new Error(problemas.join(' '));
  const id = typeof c.id === 'string' && /^[a-z0-9]{12}$/.test(c.id) ? c.id : crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  await env.DB.prepare(
    "INSERT INTO proyectos (id, nombre, rubro, contacto) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(id) DO UPDATE SET nombre = ?2, rubro = ?3, actualizado = datetime('now')",
  ).bind(id, spec.negocio.nombre, spec.negocio.rubro, typeof c.contacto === 'string' ? c.contacto.slice(0, 120) : null).run();
  const ultima = await env.DB.prepare('SELECT COALESCE(MAX(numero), 0) AS n FROM versiones WHERE proyecto = ?1').bind(id).first<{ n: number }>();
  const numero = (ultima?.n ?? 0) + 1;
  await env.DB.prepare('INSERT INTO versiones (proyecto, numero, nota, spec) VALUES (?1, ?2, ?3, ?4)').bind(id, numero, String(c.nota ?? '').slice(0, 200), JSON.stringify(spec)).run();
  if (Array.isArray(c.historial)) {
    await env.DB.prepare('INSERT INTO entrevistas (proyecto, historial) VALUES (?1, ?2) ON CONFLICT(proyecto) DO UPDATE SET historial = ?2').bind(id, JSON.stringify(historialValido(c.historial))).run();
  }
  return { id, numero };
}

async function leerProyecto(env: Env, id: string) {
  if (!/^[a-z0-9]{12}$/.test(id)) throw new Error('Id inválido');
  const proyecto = await env.DB.prepare('SELECT id, nombre, rubro, estado, creado, actualizado FROM proyectos WHERE id = ?1').bind(id).first();
  if (!proyecto) throw new Error('No existe ese proyecto');
  const { results } = await env.DB.prepare('SELECT numero, nota, creada, spec FROM versiones WHERE proyecto = ?1 ORDER BY numero').bind(id).all<{ spec: string }>();
  return { proyecto, versiones: results.map((v) => ({ ...v, spec: JSON.parse(v.spec) })) };
}
