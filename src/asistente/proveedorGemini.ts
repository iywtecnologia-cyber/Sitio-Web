import { registrarProveedorIA, type ProveedorIA } from './index';
import { respuestaDeTema } from './motor';
import { temaPorId } from './temas';

// Proveedor de IA del asistente: le pregunta a nuestro servidor (/api/asistente),
// que es el que tiene la key de Gemini. Desde acá nunca se habla con Google directo.

const proveedorGemini: ProveedorIA = {
  disponible: () => true,
  responder: async (pregunta, historial) => {
    const r = await fetch('/api/asistente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta, historial }),
    });
    // 4xx/5xx (sin key, límite de uso, Gemini caído…): null hace que se use la respuesta local.
    if (!r.ok || !r.headers.get('content-type')?.includes('application/json')) return null;
    const { texto, temaId } = (await r.json()) as { texto?: string; temaId?: string };
    if (!texto) return null;
    const tema = temaId ? temaPorId(temaId) : undefined;
    return {
      texto,
      tema,
      // Los chips de seguimiento salen del catálogo local, no de la IA.
      sugerencias: tema ? respuestaDeTema(tema).sugerencias : [],
      opciones: !tema,
      confianza: 'media',
      temaContexto: tema?.id,
    };
  },
};

// Se activa en desarrollo, o en producción sólo si se compila con VITE_ASISTENTE_IA=true
// (hace falta el servidor desplegado; el static site actual no tiene /api).
export const activarIASiCorresponde = (): void => {
  if (import.meta.env.DEV || import.meta.env.VITE_ASISTENTE_IA === 'true') registrarProveedorIA(proveedorGemini);
};
