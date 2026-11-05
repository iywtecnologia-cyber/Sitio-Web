import process from 'node:process';
import { GoogleGenAI, ThinkingLevel, Type, type Content } from '@google/genai';
import { DOMINIOS_PERMITIDOS, IDS_TEMAS, promptSistema } from './promptSistema';

// Única pieza que habla con Gemini. Corre SOLO en el servidor: la key nunca llega al navegador.

// Principal y respaldo. Si el principal está saturado (503) o sin cupo (429), se prueba el siguiente.
// Elegidos porque en la prueba respondieron rápido; gemini-3.8-flash estaba saturado y con 5 pedidos/min gratis.
export const MODELOS = (process.env.GEMINI_MODELO || 'gemini-3.5-flash,gemini-3.5-flash-lite')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
export const MODELO = MODELOS.join(' → ');

// Errores que justifican probar otro modelo: saturado, sin cupo, o modelo dado de baja.
const ESTADOS_REINTENTABLES = new Set([404, 429, 500, 503]);

export const LIMITES = {
  pregunta: 500,       // caracteres de la pregunta
  turnos: 10,          // mensajes de historial que se mandan como contexto
  textoTurno: 600,     // caracteres por mensaje de historial
  respuesta: 1200,     // caracteres de la respuesta que se acepta del modelo
  tiempoMs: 9000,      // se corta la llamada si Gemini tarda más
};

export interface Turno {
  de: 'bot' | 'persona';
  texto: string;
}

export interface RespuestaIA {
  texto: string;
  /** Uno de los ids de TEMAS, o undefined si es fuera de tema. */
  temaId?: string;
}

let cliente: GoogleGenAI | null = null;
const gemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Falta GEMINI_API_KEY en el entorno');
  cliente ??= new GoogleGenAI({ apiKey });
  return cliente;
};

// El prompt se arma una vez por proceso: depende de datos que sólo cambian con un deploy.
let prompt: string | null = null;

// "idioma" va primero a propósito: obliga al modelo a decidir en qué idioma escribió la persona
// ANTES de redactar. Sin esto, con todo el prompt en español, contestaba en español a preguntas en inglés.
const ESQUEMA = {
  type: Type.OBJECT,
  properties: {
    idioma: { type: Type.STRING },
    texto: { type: Type.STRING },
    temaId: { type: Type.STRING, enum: [...IDS_TEMAS, 'ninguno'] },
  },
  required: ['idioma', 'texto', 'temaId'],
  propertyOrdering: ['idioma', 'texto', 'temaId'],
};

// El modelo puede equivocarse aunque el prompt se lo prohíba: estos filtros no dependen de él.
// Cuenta como link: todo lo que tenga http(s)://, o algo con forma de dominio y una terminación
// de las usuales. Así "Node.js" o "p.ej." no se confunden con links.
const RE_CON_ESQUEMA = /\bhttps?:\/\/([^\s/?#)]+)[^\s)]*/gi;
const RE_DOMINIO = /\b((?:[a-z0-9-]+\.)+(?:com|net|org|ar|io|app|dev|co|me|ly|info|xyz|site|online|store|shop|link|gl|be|to|ru|cn)(?:\.ar)?)\b(\/[^\s)]*)?/gi;

const permitido = (dominio: string) => DOMINIOS_PERMITIDOS.includes(dominio.toLowerCase().replace(/^.*@/, ''));

const limpiarLinks = (texto: string): string =>
  texto
    .replace(RE_CON_ESQUEMA, (url, dominio: string) => (permitido(dominio) ? url : '[link quitado]'))
    // Si viene justo después de "://" ya lo revisó el paso anterior y quedó porque estaba permitido.
    .replace(RE_DOMINIO, (url, dominio: string, _ruta, pos: number, todo: string) =>
      todo.slice(Math.max(0, pos - 3), pos) === '://' || permitido(dominio) ? url : '[link quitado]'
    );

// La UI muestra texto plano: si se cuela markdown, se lo saca para que no aparezcan asteriscos.
const sinMarkdown = (texto: string): string =>
  texto
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|\s)[*_](\S.*?\S)[*_](?=\s|$)/g, '$1$2')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '');

const recortar = (t: string, max: number) => (t.length > max ? t.slice(0, max) : t);

export const historialSeguro = (historial: unknown): Turno[] =>
  (Array.isArray(historial) ? historial : [])
    .filter((t): t is Turno => !!t && (t.de === 'bot' || t.de === 'persona') && typeof t.texto === 'string')
    .slice(-LIMITES.turnos)
    .map((t) => ({ de: t.de, texto: recortar(t.texto, LIMITES.textoTurno) }));

export const preguntarAGemini = async (pregunta: string, historial: Turno[] = []): Promise<RespuestaIA> => {
  prompt ??= promptSistema();

  const contents: Content[] = [
    ...historial.map((t) => ({ role: t.de === 'bot' ? 'model' : 'user', parts: [{ text: t.texto }] })),
    { role: 'user', parts: [{ text: recortar(pregunta, LIMITES.pregunta) }] },
  ];
  // Gemini exige que la conversación empiece con el usuario: el saludo inicial del bot se descarta.
  while (contents.length > 1 && contents[0].role === 'model') contents.shift();

  // Un solo corte para todos los intentos: el visitante no espera más de LIMITES.tiempoMs en total.
  const corte = new AbortController();
  const timer = setTimeout(() => corte.abort(), LIMITES.tiempoMs);
  try {
    let r: Awaited<ReturnType<GoogleGenAI['models']['generateContent']>> | undefined;
    let ultimoError: unknown;
    for (const model of MODELOS) {
      try {
        r = await gemini().models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: prompt,
            temperature: 0.3,
            maxOutputTokens: 600,
            responseMimeType: 'application/json',
            responseSchema: ESQUEMA,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            abortSignal: corte.signal,
          },
        });
        break;
      } catch (e) {
        ultimoError = e;
        const estado = (e as { status?: number }).status;
        if (corte.signal.aborted || !estado || !ESTADOS_REINTENTABLES.has(estado)) throw e;
      }
    }
    if (!r) throw ultimoError;

    const crudo = r.text;
    if (!crudo) throw new Error(`Respuesta vacía (${r.candidates?.[0]?.finishReason ?? 'sin motivo'})`);
    const datos = JSON.parse(crudo) as { texto?: unknown; temaId?: unknown };
    if (typeof datos.texto !== 'string' || !datos.texto.trim()) throw new Error('JSON sin texto');

    const temaId = typeof datos.temaId === 'string' && IDS_TEMAS.includes(datos.temaId) ? datos.temaId : undefined;
    return { texto: recortar(limpiarLinks(sinMarkdown(datos.texto.trim())), LIMITES.respuesta), temaId };
  } finally {
    clearTimeout(timer);
  }
};
