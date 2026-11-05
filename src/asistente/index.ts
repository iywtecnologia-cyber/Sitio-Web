import { responderLocal, type Contexto, type Respuesta } from './motor';

export { normalizar, responderLocal, respuestaDeTema, esModificador } from './motor';
export type { Contexto, Respuesta } from './motor';
export { TEMAS, temaPorId, temasDeGrilla } from './temas';
export type { Tema } from './temas';

// ─────────────────────────────────────────────────────────────────────────────
// Asistente híbrido.
//
// Hoy el asistente responde 100% con la base de conocimiento local (sin IA, sin
// red, sin API key). Esta es la única puerta por la que entraría una IA más
// adelante, y entra como AYUDA, no como reemplazo:
//
//   1. Siempre se calcula primero la respuesta local.
//   2. Si la respuesta local es de confianza alta, se usa esa: es instantánea,
//      gratis y no puede inventar nada.
//   3. Sólo si la local no entendió y hay un proveedor registrado, se le pregunta
//      a la IA. Si tarda, falla o devuelve vacío, se cae a la local.
//
// IMPORTANTE para cuando llegue ese momento: este sitio es estático, así que la
// API key NO puede vivir en el navegador (quedaría en el bundle y cualquiera la
// usaría). El proveedor tiene que pegarle a un endpoint propio (por ejemplo
// /api/asistente en un web service de Render) que guarde la key del lado del
// servidor y de paso limite el uso por IP.
//
// Para activarlo no hace falta tocar el componente ni el motor: se escribe un
// proveedor y se lo registra una vez al arrancar la app.
//
//   registrarProveedorIA({
//     disponible: () => true,
//     responder: async (pregunta, historial) => {
//       const r = await fetch('/api/asistente', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ pregunta, historial }),
//       });
//       if (!r.ok) return null;
//       const { texto, temaId } = await r.json();
//       return { texto, tema: temaPorId(temaId), sugerencias: [], opciones: false, confianza: 'media' };
//     },
//   });
// ─────────────────────────────────────────────────────────────────────────────

export interface Turno {
  de: 'bot' | 'persona';
  texto: string;
}

export interface ProveedorIA {
  disponible: () => boolean;
  responder: (pregunta: string, historial: Turno[]) => Promise<Respuesta | null>;
}

let proveedor: ProveedorIA | null = null;

export const registrarProveedorIA = (p: ProveedorIA | null): void => {
  proveedor = p;
};

export const hayProveedorIA = (): boolean => Boolean(proveedor?.disponible());

/** Si la IA no contesta en este tiempo, se usa la respuesta local. */
// Un poco más que el corte del servidor (9 s), para que llegue su error y no se pisen.
const TIEMPO_LIMITE_MS = 10000;

const conLimite = async (p: Promise<Respuesta | null>): Promise<Respuesta | null> => {
  let id: number | undefined;
  try {
    return await Promise.race([
      p,
      new Promise<null>((resolve) => {
        id = window.setTimeout(() => resolve(null), TIEMPO_LIMITE_MS);
      }),
    ]);
  } finally {
    if (id !== undefined) window.clearTimeout(id);
  }
};

export const responder = async (
  pregunta: string,
  ctx: Contexto = {},
  historial: Turno[] = []
): Promise<Respuesta> => {
  const local = responderLocal(pregunta, ctx);
  if (local.confianza === 'alta' || !proveedor?.disponible()) return local;

  try {
    const remota = await conLimite(proveedor.responder(pregunta, historial));
    // La IA nunca pisa una respuesta local buena, y si vuelve vacía no se muestra nada raro.
    return remota && remota.texto.trim() ? { ...remota, temaContexto: remota.temaContexto ?? local.temaContexto } : local;
  } catch {
    return local;
  }
};
