// Pruebas del Worker sin red: Claude y D1 simulados. Correr con `npm test`.
import worker, { type Env } from './src/index';
import { armarDesdeRespuestas } from '../src/fabrica/local';
import { aplicarParche, validar } from '../src/fabrica/spec';

let fallas = 0;
const ok = (cond: unknown, nombre: string) => {
  console.log(`${cond ? '✓' : '✗'} ${nombre}`);
  if (!cond) fallas++;
};

// ── D1 en memoria (solo lo que usa el Worker) ──
const tablas: Record<string, Record<string, unknown>[]> = { proyectos: [], versiones: [], entrevistas: [], usos: [] };
const DB = {
  prepare(sql: string) {
    let args: unknown[] = [];
    const st = {
      bind: (...a: unknown[]) => ((args = a), st),
      async first<T>() {
        if (sql.startsWith('INSERT INTO usos')) {
          const u = tablas.usos.find((x) => x.ip === args[0] && x.dia === args[1]);
          if (u) (u.llamadas as number)++;
          else tablas.usos.push({ ip: args[0], dia: args[1], llamadas: 1 });
          return { llamadas: (tablas.usos.find((x) => x.ip === args[0])!.llamadas) } as T;
        }
        if (sql.startsWith('SELECT COALESCE')) return { n: Math.max(0, ...tablas.versiones.filter((v) => v.proyecto === args[0]).map((v) => v.numero as number)) } as T;
        if (sql.startsWith('SELECT id, nombre')) return (tablas.proyectos.find((p) => p.id === args[0]) ?? null) as T;
        return null as T;
      },
      async run() {
        if (sql.startsWith('INSERT INTO proyectos')) {
          const p = tablas.proyectos.find((x) => x.id === args[0]);
          if (p) Object.assign(p, { nombre: args[1], rubro: args[2] });
          else tablas.proyectos.push({ id: args[0], nombre: args[1], rubro: args[2], estado: 'borrador' });
        }
        if (sql.startsWith('INSERT INTO versiones')) tablas.versiones.push({ proyecto: args[0], numero: args[1], nota: args[2], spec: args[3] });
        return { success: true };
      },
      async all<T>() {
        return { results: tablas.versiones.filter((v) => v.proyecto === args[0]) as T[] };
      },
    };
    return st;
  },
};

const env = { DB, ANTHROPIC_API_KEY: 'prueba', MODELO: 'claude-sonnet-5-5', ORIGENES: 'https://tecnoros.ar', LIMITE_DIARIO: '4' } as unknown as Env;

// ── Claude simulado: responde según la herramienta pedida ──
const specValida = armarDesdeRespuestas({ negocio: 'Panadería Sol', repite: 'Tomar pedidos', datos: 'cliente, detalle, total', color: 'Naranja' });
let generarLlamadas = 0;
const pedidosAClaude: { tool: string; mensajes: number }[] = [];
globalThis.fetch = (async (_url: string, init: RequestInit) => {
  const cuerpo = JSON.parse(String(init.body));
  const tool = cuerpo.tool_choice.name as string;
  pedidosAClaude.push({ tool, mensajes: cuerpo.messages.length });
  let input: unknown;
  if (tool === 'responder') input = { pregunta: '¿Qué datos anotás de cada pedido?', opciones: [], listo: false, resumen: { entidades: ['Pedidos'], roles: ['Dueño'], flujos: [], dolores: [] } };
  if (tool === 'entregar_spec') input = generarLlamadas++ === 0 ? { ...specValida, marca: { colorPrimario: 'naranja' } } : specValida;
  if (tool === 'proponer_parche') input = { explicacion: 'Agrego el campo seña.', parche: [{ op: 'add', path: '/entidades/pedido/campos/-', value: { id: 'sena', etiqueta: 'Seña', tipo: 'dinero' } }] };
  return new Response(JSON.stringify({ content: [{ type: 'tool_use', name: tool, input }] }), { status: 200 });
}) as typeof fetch;

const pedir = (ruta: string, cuerpo?: unknown, origen = 'https://tecnoros.ar') =>
  worker.fetch(new Request(`https://fabrica.tecnoros.ar${ruta}`, { method: cuerpo === undefined ? 'GET' : 'POST', headers: { Origin: origen, 'Content-Type': 'application/json' }, body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo) }), env);

// 1) Spec local y parches
ok(validar(specValida).length === 0, 'la plantilla local genera una spec válida');
const conCampo = aplicarParche(specValida, [{ op: 'add', path: '/entidades/cliente/campos/-', value: { id: 'cuit', etiqueta: 'CUIT', tipo: 'texto' } }]);
ok(conCampo.entidades.find((e) => e.id === 'cliente')!.campos.some((c) => c.id === 'cuit'), 'aplicarParche entiende rutas por id');
let rechazado = false;
try { aplicarParche(specValida, [{ op: 'replace', path: '/marca/colorPrimario', value: 'rojo' }]); } catch { rechazado = true; }
ok(rechazado, 'un parche que deja la spec inválida se rechaza');

// 2) Endpoints
const r1 = await pedir('/api/fabrica/entrevista', { historial: [{ de: 'persona', texto: 'Hola' }] });
ok(r1.status === 200 && (await r1.json()).pregunta, 'entrevista devuelve la próxima pregunta');
const r2 = await pedir('/api/fabrica/generar', { historial: [{ de: 'persona', texto: 'Panadería' }] });
const g = await r2.json();
ok(r2.status === 200 && validar(g.spec).length === 0, 'generar corrige una spec inválida y devuelve una válida');
ok(generarLlamadas === 2, 'generar reintenta una vez con los problemas');
const r3 = await pedir('/api/fabrica/cambiar', { spec: specValida, pedido: 'agregá la seña' });
ok((await r3.json()).parche?.length === 1, 'cambiar devuelve un parche aplicable');
const r4 = await pedir('/api/fabrica/proyectos', { spec: specValida, nota: 'Primera versión' });
const { id, numero } = await r4.json();
ok(typeof id === 'string' && numero === 1, 'guardar proyecto crea la versión 1');
const r5 = await pedir(`/api/fabrica/proyectos/${id}`);
ok((await r5.json()).versiones?.length === 1, 'leer proyecto devuelve sus versiones');
const r6 = await pedir('/api/fabrica/entrevista', { historial: [] }, 'https://otro-sitio.com');
ok(r6.status === 403, 'otro origen queda bloqueado');
const r7 = await pedir('/api/fabrica/entrevista', { historial: [] });
ok(r7.status === 429, 'el tope diario por IP corta el uso');
ok(pedidosAClaude.every((p) => p.mensajes >= 1), 'cada llamada a Claude lleva la conversación');

console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
