// Cliente de la fábrica: habla con el Worker (Claude) y, si no está configurado o falla,
// sigue en modo local (entrevista guiada + plantillas) para que nadie se quede sin su sistema.
import { aplicarParche, validar, type OpParche, type Spec } from './spec';
import { PREGUNTAS, armarDesdeRespuestas, cambioLocal } from './local';

const BASE = (import.meta.env.VITE_FABRICA_API as string | undefined)?.replace(/\/+$/, '') ?? '';
export const CON_IA = Boolean(BASE);

export interface Mensaje {
  de: 'analista' | 'persona';
  texto: string;
}

export interface Resumen {
  entidades: string[];
  roles: string[];
  flujos: string[];
  dolores: string[];
}

export interface Turno {
  pregunta: string;
  opciones?: string[];
  ayuda?: string;
  resumen: Resumen;
  listo: boolean;
}

async function llamar<T>(ruta: string, cuerpo: unknown): Promise<T> {
  const r = await fetch(`${BASE}${ruta}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.error ?? `Error ${r.status}`);
  return r.json() as Promise<T>;
}

// ── Modo local ──
const respuestasLocales = (historial: Mensaje[]) => {
  const r: Record<string, string> = {};
  let i = 0;
  for (const m of historial) if (m.de === 'persona' && i < PREGUNTAS.length) r[PREGUNTAS.at(i++)!.id] = m.texto;
  return r;
};

function resumenLocal(r: Record<string, string>): Resumen {
  if (!r.repite) return { entidades: [], roles: [], flujos: [], dolores: [] };
  const spec = armarDesdeRespuestas(r);
  return {
    entidades: spec.entidades.map((e) => `${e.icono ?? ''} ${e.plural}: ${e.campos.map((c) => c.etiqueta.toLowerCase()).join(', ')}`.trim()),
    roles: spec.roles.map((x) => x.nombre),
    flujos: spec.entidades.filter((e) => e.flujo).map((e) => `${e.nombre}: ${e.flujo!.estados.join(' → ')}`),
    dolores: spec.automatizaciones.map((a) => `${a.cuando}: ${a.accion.toLowerCase()}`),
  };
}

/** Próxima pregunta del analista (o «listo» cuando ya tiene lo necesario). */
export async function entrevistar(historial: Mensaje[]): Promise<Turno> {
  if (CON_IA) {
    try {
      return await llamar<Turno>('/api/fabrica/entrevista', { historial });
    } catch (e) {
      console.warn('[fabrica] IA no disponible, sigo en modo local:', e);
    }
  }
  const r = respuestasLocales(historial);
  const n = Object.keys(r).length;
  const p = PREGUNTAS.at(n);
  return {
    pregunta: p ? p.texto : '¡Listo! Ya tengo lo necesario para armar tu primera versión.',
    opciones: p?.opciones,
    ayuda: p?.ayuda,
    resumen: resumenLocal(r),
    listo: !p,
  };
}

/** Genera la primera versión del sistema a partir de la entrevista. */
export async function generar(historial: Mensaje[]): Promise<Spec> {
  if (CON_IA) {
    try {
      const { spec } = await llamar<{ spec: Spec }>('/api/fabrica/generar', { historial });
      if (!validar(spec).length) return spec;
    } catch (e) {
      console.warn('[fabrica] generación con IA falló, uso la plantilla:', e);
    }
  }
  return armarDesdeRespuestas(respuestasLocales(historial));
}

/** Aplica un pedido de cambio en lenguaje natural. */
export async function cambiar(spec: Spec, pedido: string): Promise<{ spec: Spec; explicacion: string; parche: OpParche[] } | { error: string }> {
  // Los cambios simples se resuelven al instante, sin esperar a la IA.
  const local = cambioLocal(spec, pedido);
  if (local) {
    try {
      return { spec: aplicarParche(spec, local.parche), explicacion: local.explicacion, parche: local.parche };
    } catch {
      /* si el parche local no aplica, que lo intente la IA */
    }
  }
  if (CON_IA) {
    try {
      const { parche, explicacion } = await llamar<{ parche: OpParche[]; explicacion: string }>('/api/fabrica/cambiar', { spec, pedido });
      return { spec: aplicarParche(spec, parche), explicacion, parche };
    } catch (e) {
      return { error: `No pude aplicar ese cambio: ${e instanceof Error ? e.message : 'error inesperado'}` };
    }
  }
  return {
    error: 'Ese cambio necesita la IA, que todavía no está conectada en esta vista previa. Por ahora probá con: «cambiá el color a verde», «agregá el campo patente a las órdenes de trabajo», «sacá el campo notas» o «que se llame Taller Rivas».',
  };
}

// ── Cambios con aprobación, proyecto guardado y pagos ──
export interface Cambio {
  id: string;
  pedido: string;
  explicacion: string;
  estado: 'aprobado' | 'descartado' | 'deshecho';
  de: 'dueno' | 'golondrina';
  fecha: string;
  version: number | null;
  parche: OpParche[];
}

export interface Proyecto {
  id: string;
  clave: string;
  claveDev: string;
}

export interface Precios {
  alta: number;
  abono: number;
  activo: boolean; // hay pasarela configurada en el servidor
  prueba: boolean; // la pasarela está en modo prueba (no cobra de verdad)
}

export const PRECIOS_BASE: Precios = { alta: 500_000, abono: 150_000, activo: false, prueba: true };

export async function precios(): Promise<Precios> {
  if (!CON_IA) return PRECIOS_BASE;
  try {
    const r = await fetch(`${BASE}/api/fabrica/precios`);
    if (r.ok) return { ...PRECIOS_BASE, ...((await r.json()) as Partial<Precios>) };
  } catch {
    /* sin servidor: se muestran los precios base y el pago online queda apagado */
  }
  return PRECIOS_BASE;
}

/** Guarda la versión actual en el servidor (crea el proyecto la primera vez). */
export async function guardar(proyecto: Proyecto | undefined, spec: Spec, nota: string, historial: Mensaje[], cambios: Cambio[]): Promise<Proyecto | null> {
  if (!CON_IA) return null;
  try {
    const r = await llamar<Proyecto>('/api/fabrica/proyectos', { ...(proyecto ? { id: proyecto.id, clave: proyecto.clave } : {}), spec, nota, historial, cambios });
    return { id: r.id, clave: r.clave, claveDev: r.claveDev };
  } catch (e) {
    console.warn('[fabrica] no se pudo guardar el proyecto:', e);
    return null;
  }
}

export interface ProyectoVisto {
  rol: 'dueno' | 'dev';
  proyecto: { id: string; nombre: string; estado: string; abono: string | null };
  versiones: { numero: number; nota: string; spec: Spec }[];
  cambios: Cambio[];
}

export const ver = (id: string, clave: string) => llamar<ProyectoVisto>('/api/fabrica/proyectos/ver', { id, clave });

/** Pide el link de pago (alta o abono). El precio lo pone el servidor, nunca el navegador. */
export const linkDePago = (tipo: 'alta' | 'abono', p: Proyecto, email: string) =>
  llamar<{ url: string; prueba: boolean }>(tipo === 'alta' ? '/api/fabrica/pagos' : '/api/fabrica/abono', { id: p.id, clave: p.clave, email });
