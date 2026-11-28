// Pagos de la fábrica con Mercado Pago: alta (pago único, Checkout Pro) y abono mensual (suscripción).
// Con credenciales de prueba todo corre en el entorno de pruebas de Mercado Pago: no se cobra nada real.
// El estado «pagado» solo lo pone el aviso (webhook) después de consultarle el pago a Mercado Pago:
// nunca se confía en lo que diga el navegador al volver del pago.
import type { Env } from './index';

const MP = 'https://api.mercadopago.com';
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

export const precios = (env: Env) => ({ alta: Number(env.PRECIO_ALTA || 500000), abono: Number(env.PRECIO_ABONO || 150000) });

async function mp<T>(env: Env, ruta: string, cuerpo?: unknown, idem?: string): Promise<T> {
  if (!env.MP_ACCESS_TOKEN) throw new Error('El pago online todavía no está configurado.');
  const r = await fetch(`${MP}${ruta}`, {
    method: cuerpo ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json', ...(idem ? { 'X-Idempotency-Key': idem } : {}) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  }).catch(() => null);
  if (!r) throw new Error('No pudimos conectar con Mercado Pago. Probá de nuevo en un rato o pagá por transferencia.');
  if (!r.ok) throw new Error(`Mercado Pago no aceptó el pedido (código ${r.status}). Probá de nuevo o pagá por transferencia.`);
  return r.json() as Promise<T>;
}

const emailValido = (e: unknown) => {
  const s = String(e ?? '').trim().toLowerCase();
  if (!EMAIL.test(s)) throw new Error('Poné un e-mail válido para el comprobante.');
  return s;
};

interface Proyecto { id: string; nombre: string; estado: string; abono: string | null }

/** Link de pago del alta (pago único). */
export async function crearPagoAlta(env: Env, p: Proyecto, email: unknown) {
  if (p.estado !== 'borrador') throw new Error('Este sistema ya tiene el alta paga.');
  const correo = emailValido(email);
  const sitio = env.SITIO || 'https://www.tecnoros.ar';
  const api = env.API || 'https://fabrica.tecnoros.ar';
  const volver = (r: string) => `${sitio}/crear?pago=${r}`;
  const pref = await mp<{ id: string; init_point: string; sandbox_init_point?: string }>(env, '/checkout/preferences', {
    items: [{ id: 'alta', title: `Alta del sistema «${p.nombre}» · tecnoros.ar`, quantity: 1, currency_id: 'ARS', unit_price: precios(env).alta }],
    payer: { email: correo },
    external_reference: `alta:${p.id}`,
    back_urls: { success: volver('ok'), pending: volver('pendiente'), failure: volver('error') },
    auto_return: 'approved',
    notification_url: `${api}/api/fabrica/pagos/aviso`,
    statement_descriptor: 'TECNOROS',
  }, `alta-${p.id}-${precios(env).alta}`);
  await env.DB.prepare('UPDATE proyectos SET email = ?2 WHERE id = ?1').bind(p.id, correo).run();
  const prueba = env.MP_MODO !== 'produccion';
  return { url: prueba ? pref.sandbox_init_point ?? pref.init_point : pref.init_point, prueba };
}

/** Link para autorizar el abono mensual (alojamiento, dominio y mantenimiento). */
export async function crearAbono(env: Env, p: Proyecto, email: unknown) {
  if (p.estado === 'borrador') throw new Error('Primero hay que pagar el alta.');
  if (p.abono === 'activo') throw new Error('El abono ya está activo.');
  const correo = emailValido(email);
  const sitio = env.SITIO || 'https://www.tecnoros.ar';
  const pre = await mp<{ id: string; init_point: string; sandbox_init_point?: string }>(env, '/preapproval', {
    reason: `Abono mensual del sistema «${p.nombre}» · tecnoros.ar`,
    external_reference: `abono:${p.id}`,
    payer_email: correo,
    back_url: `${sitio}/crear?pago=abono`,
    auto_recurring: { frequency: 1, frequency_type: 'months', transaction_amount: precios(env).abono, currency_id: 'ARS' },
    status: 'pending',
  });
  const prueba = env.MP_MODO !== 'produccion';
  return { url: prueba ? pre.sandbox_init_point ?? pre.init_point : pre.init_point, prueba };
}

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const igual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

/** Firma del aviso (x-signature: ts=…,v1=…). Si hay secreto configurado, es obligatoria. */
async function firmaValida(env: Env, req: Request, dataId: string): Promise<boolean> {
  if (!env.MP_WEBHOOK_SECRET) return true;
  const partes = Object.fromEntries((req.headers.get('x-signature') ?? '').split(',').map((x) => x.trim().split('=') as [string, string]));
  if (!partes.ts || !partes.v1) return false;
  const manifiesto = `id:${dataId.toLowerCase()};request-id:${req.headers.get('x-request-id') ?? ''};ts:${partes.ts};`;
  const clave = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.MP_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return igual(hex(await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(manifiesto))), partes.v1);
}

/** Aviso de Mercado Pago. Siempre se le vuelve a preguntar a Mercado Pago el estado real. */
export async function recibirAviso(env: Env, req: Request): Promise<{ ok: boolean; estado?: string }> {
  const url = new URL(req.url);
  const cuerpo = (await req.json().catch(() => ({}))) as { type?: string; data?: { id?: string | number } };
  const tipo = cuerpo.type ?? url.searchParams.get('type') ?? url.searchParams.get('topic') ?? '';
  const dataId = String(cuerpo.data?.id ?? url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? '');
  if (!/^[A-Za-z0-9]{1,40}$/.test(dataId)) return { ok: false };
  if (!(await firmaValida(env, req, dataId))) return { ok: false, estado: 'firma inválida' };

  if (tipo === 'payment') {
    const pago = await mp<{ id: number; status: string; external_reference?: string; transaction_amount: number; currency_id: string }>(env, `/v1/payments/${dataId}`);
    const m = /^alta:([a-z0-9]{12})$/.exec(pago.external_reference ?? '');
    if (!m) return { ok: true, estado: 'ajeno' };
    await env.DB.prepare(
      "INSERT INTO pagos (mp_id, proyecto, tipo, estado, monto) VALUES (?1, ?2, 'alta', ?3, ?4) ON CONFLICT(mp_id) DO UPDATE SET estado = ?3, actualizado = datetime('now')",
    ).bind(String(pago.id), m[1], pago.status, pago.transaction_amount).run();
    // Solo cuenta si está aprobado, en pesos y por el monto completo del alta.
    if (pago.status === 'approved' && pago.currency_id === 'ARS' && pago.transaction_amount >= precios(env).alta) {
      await env.DB.prepare("UPDATE proyectos SET estado = 'pagado', actualizado = datetime('now') WHERE id = ?1 AND estado = 'borrador'").bind(m[1]).run();
    }
    return { ok: true, estado: pago.status };
  }
  if (tipo === 'subscription_preapproval') {
    const pre = await mp<{ id: string; status: string; external_reference?: string }>(env, `/preapproval/${dataId}`);
    const m = /^abono:([a-z0-9]{12})$/.exec(pre.external_reference ?? '');
    if (!m) return { ok: true, estado: 'ajeno' };
    const abono = pre.status === 'authorized' ? 'activo' : pre.status === 'paused' ? 'pausado' : pre.status === 'cancelled' ? 'cancelado' : 'pendiente';
    await env.DB.prepare("UPDATE proyectos SET abono = ?2, actualizado = datetime('now') WHERE id = ?1").bind(m[1], abono).run();
    return { ok: true, estado: abono };
  }
  return { ok: true, estado: 'ignorado' };
}
