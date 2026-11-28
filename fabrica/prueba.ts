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
type Fila = Record<string, unknown>;
const tablas: Record<string, Fila[]> = { proyectos: [], versiones: [], entrevistas: [], usos: [], pagos: [] };
const DB = {
  prepare(sql: string) {
    let args: unknown[] = [];
    const proyecto = () => tablas.proyectos.find((p) => p.id === args[0]);
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
        if (sql.startsWith('SELECT id, nombre')) return (proyecto() ?? null) as T;
        return null as T;
      },
      async run() {
        if (sql.startsWith('INSERT INTO proyectos')) tablas.proyectos.push({ id: args[0], nombre: args[1], rubro: args[2], estado: 'borrador', abono: null, clave: args[4], clave_dev: args[5], cambios: args[6] });
        if (sql.startsWith('UPDATE proyectos SET nombre')) Object.assign(proyecto()!, { nombre: args[1], rubro: args[2], cambios: args[3] ?? proyecto()!.cambios });
        if (sql.startsWith('UPDATE proyectos SET email')) proyecto()!.email = args[1];
        if (sql.startsWith("UPDATE proyectos SET estado = 'pagado'")) { const p = proyecto(); if (p && p.estado === 'borrador') p.estado = 'pagado'; }
        if (sql.startsWith('UPDATE proyectos SET abono')) proyecto()!.abono = args[1];
        if (sql.startsWith('INSERT INTO pagos')) {
          const g = tablas.pagos.find((x) => x.mp_id === args[0]);
          if (g) g.estado = args[2];
          else tablas.pagos.push({ mp_id: args[0], proyecto: args[1], estado: args[2], monto: args[3] });
        }
        if (sql.startsWith('INSERT INTO versiones')) tablas.versiones.push({ proyecto: args[0], numero: args[1], nota: args[2], spec: args[3] });
        return { success: true };
      },
      async all<T>() {
        return { results: tablas.versiones.filter((v) => v.proyecto === args[0]).reverse() as T[] };
      },
    };
    return st;
  },
};

const env = { DB, ANTHROPIC_API_KEY: 'prueba', MODELO: 'claude-sonnet-5-5', ORIGENES: 'https://tecnoros.ar', LIMITE_DIARIO: '14', MP_ACCESS_TOKEN: 'TEST-123', MP_WEBHOOK_SECRET: 'secreto', PRECIO_ALTA: '500000', PRECIO_ABONO: '150000' } as unknown as Env;

// ── Claude simulado: responde según la herramienta pedida ──
const specValida = armarDesdeRespuestas({ negocio: 'Panadería Sol', repite: 'Tomar pedidos', datos: 'cliente, detalle, total', color: 'Naranja' });
let generarLlamadas = 0;
const pedidosAClaude: { tool: string; mensajes: number }[] = [];
// Mercado Pago simulado: lo que «cobró» cada pago, según su id.
const pagosMP: Record<string, { status: string; external_reference: string; transaction_amount: number; currency_id: string }> = {};
const pedidosAMP: { ruta: string; cuerpo: Record<string, unknown> | null; auth: string }[] = [];
globalThis.fetch = (async (_url: string, init: RequestInit) => {
  if (String(_url).startsWith('https://api.mercadopago.com')) {
    const ruta = String(_url).replace('https://api.mercadopago.com', '');
    pedidosAMP.push({ ruta, cuerpo: init.body ? JSON.parse(String(init.body)) : null, auth: String((init.headers as Record<string, string>).Authorization) });
    if (ruta === '/checkout/preferences') return new Response(JSON.stringify({ id: 'pref1', init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref1', sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref1' }));
    if (ruta === '/preapproval') return new Response(JSON.stringify({ id: 'pre1', init_point: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=pre1' }));
    if (ruta.startsWith('/v1/payments/')) { const g = pagosMP[ruta.split('/').at(-1)!]; return g ? new Response(JSON.stringify({ id: Number(ruta.split('/').at(-1)), ...g })) : new Response('{}', { status: 404 }); }
    if (ruta.startsWith('/preapproval/')) return new Response(JSON.stringify({ id: 'pre1', status: 'authorized', external_reference: `abono:${tablas.proyectos[0].id}` }));
    return new Response('{}', { status: 404 });
  }
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
const { id, numero, clave, claveDev } = await r4.json();
ok(typeof id === 'string' && numero === 1 && clave.length >= 32 && claveDev !== clave, 'guardar proyecto crea la versión 1 y entrega las dos claves');
const cambio = { id: 'c1', pedido: 'agregá el CUIT', explicacion: 'Agrego CUIT', estado: 'aprobado', de: 'golondrina', fecha: '2026-11-27', version: 2, parche: [{ op: 'add', path: '/entidades/cliente/campos/-', value: { id: 'cuit', etiqueta: 'CUIT', tipo: 'texto' } }] };
const r4b = await pedir('/api/fabrica/proyectos', { id, clave, spec: conCampo, nota: 'Agrego CUIT', cambios: [cambio] });
ok((await r4b.json()).numero === 2, 'el dueño guarda una versión nueva con su clave');
const r4c = await pedir('/api/fabrica/proyectos', { id, clave: claveDev, spec: conCampo, nota: 'intento' });
ok(r4c.status === 500 && tablas.versiones.length === 2, 'con la clave del programador no se puede guardar');
const r5 = await pedir('/api/fabrica/proyectos/ver', { id, clave: claveDev });
const visto = await r5.json();
ok(visto.rol === 'dev' && visto.versiones?.length === 2 && visto.cambios?.[0]?.parche?.length === 1 && !('clave' in visto.proyecto), 'el programador invitado ve versiones y parches, sin claves');
const r5b = await pedir('/api/fabrica/proyectos/ver', { id, clave: 'x'.repeat(40) });
ok(r5b.status === 500, 'sin la clave correcta no se puede leer el proyecto');

// 3) Pagos (Mercado Pago simulado)
const p1 = await pedir('/api/fabrica/pagos', { id, clave: claveDev, email: 'ana@ejemplo.com' });
ok(p1.status === 500 && pedidosAMP.length === 0, 'el programador invitado no puede iniciar un pago');
const p2 = await pedir('/api/fabrica/pagos', { id, clave, email: 'ana@ejemplo.com' });
const pago = await p2.json();
const pref = pedidosAMP[0]?.cuerpo as { items: { unit_price: number }[]; external_reference: string } | undefined;
ok(pago.url?.startsWith('https://sandbox.mercadopago.com.ar/') && pago.prueba === true, 'el pago del alta devuelve el link del entorno de pruebas');
ok(pref?.items[0].unit_price === 500000 && pref.external_reference === `alta:${id}` && pedidosAMP[0].auth === 'Bearer TEST-123', 'la preferencia lleva el precio del servidor y la referencia del proyecto');
const p3 = await pedir('/api/fabrica/pagos', { id, clave, email: 'no-es-mail' });
ok(p3.status === 500, 'sin e-mail válido no se crea el pago');

const firmar = async (dataId: string, ts: string, reqId: string) => {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode('secreto'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const f = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(`id:${dataId};request-id:${reqId};ts:${ts};`));
  return [...new Uint8Array(f)].map((x) => x.toString(16).padStart(2, '0')).join('');
};
const aviso = async (tipo: string, dataId: string, firma?: string) =>
  worker.fetch(new Request('https://fabrica.tecnoros.ar/api/fabrica/pagos/aviso', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-request-id': 'r1', 'x-signature': `ts=1700000000,v1=${firma ?? (await firmar(dataId, '1700000000', 'r1'))}` }, body: JSON.stringify({ type: tipo, data: { id: dataId } }) }), env);
const estado = () => tablas.proyectos.find((p) => p.id === id)!.estado;

pagosMP['111'] = { status: 'approved', external_reference: `alta:${id}`, transaction_amount: 500000, currency_id: 'ARS' };
const a1 = await aviso('payment', '111', 'firma-trucha');
ok(a1.status === 400 && estado() === 'borrador', 'un aviso con firma inválida se rechaza');
pagosMP['222'] = { status: 'approved', external_reference: `alta:${id}`, transaction_amount: 10, currency_id: 'ARS' };
await aviso('payment', '222');
ok(estado() === 'borrador', 'un pago aprobado por menos del precio no activa el sistema');
pagosMP['333'] = { status: 'pending', external_reference: `alta:${id}`, transaction_amount: 500000, currency_id: 'ARS' };
await aviso('payment', '333');
ok(estado() === 'borrador', 'un pago pendiente no activa el sistema');
const a4 = await aviso('payment', '111');
ok(a4.status === 200 && estado() === 'pagado', 'el aviso firmado de un pago aprobado marca el sistema como pagado');
await aviso('payment', '111');
ok(tablas.pagos.filter((g) => g.mp_id === '111').length === 1, 'el mismo aviso repetido no duplica el pago');
const a5 = await worker.fetch(new Request('https://fabrica.tecnoros.ar/api/fabrica/pagos/aviso', { method: 'POST', headers: { Origin: 'https://tecnoros.ar', 'Content-Type': 'application/json' }, body: '{}' }), env);
ok(a5.status === 404, 'el aviso no se puede llamar desde un navegador');
const p4 = await pedir('/api/fabrica/pagos', { id, clave, email: 'ana@ejemplo.com' });
ok(p4.status === 500, 'no se puede pagar el alta dos veces');
const p5 = await pedir('/api/fabrica/abono', { id, clave, email: 'ana@ejemplo.com' });
const abonoMP = pedidosAMP.find((x) => x.ruta === '/preapproval')?.cuerpo as { auto_recurring: { transaction_amount: number; frequency_type: string } } | undefined;
ok((await p5.json()).url && abonoMP?.auto_recurring.transaction_amount === 150000 && abonoMP.auto_recurring.frequency_type === 'months', 'el abono mensual se crea por el precio del servidor');
await aviso('subscription_preapproval', 'pre1');
ok(tablas.proyectos[0].abono === 'activo', 'el aviso de la suscripción autorizada activa el abono');
const r6 = await pedir('/api/fabrica/entrevista', { historial: [] }, 'https://otro-sitio.com');
ok(r6.status === 403, 'otro origen queda bloqueado');
const r7 = await pedir('/api/fabrica/entrevista', { historial: [] });
for (let i = 0; i < 3; i++) await pedir('/api/fabrica/entrevista', { historial: [] });
const r8 = await pedir('/api/fabrica/entrevista', { historial: [] });
ok(r8.status === 429, 'el tope diario por IP corta el uso');
ok(pedidosAClaude.every((p) => p.mensajes >= 1), 'cada llamada a Claude lleva la conversación');

console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
