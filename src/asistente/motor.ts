import { INTENCIONES, TEMAS, temaPorId, type IntencionId, type Patron, type Tema } from './temas';
import { SERVICIOS_SOFTWARE, pesos } from '../data/precios';

// Motor de respuestas del asistente: clasifica lo que escribe la persona y arma la respuesta.
// No usa IA ni llama a ningún servicio: todo pasa en el navegador y nada sale de la máquina.

export interface Contexto {
  /** Último tema del que se habló, para entender mensajes cortos como "¿y cuánto sale?". */
  temaPrevio?: string;
}

export interface Respuesta {
  texto: string;
  /** Si viene, se muestran los botones de WhatsApp / e-mail / "Ver en la web". */
  tema?: Tema;
  /** Chips de seguimiento para que la charla pueda continuar. */
  sugerencias: Tema[];
  /** Mostrar la grilla completa de temas. */
  opciones: boolean;
  confianza: 'alta' | 'media' | 'baja';
  /** Tema que queda como contexto para el próximo mensaje. */
  temaContexto?: string;
}

// Los acentos se sacan con el rango escapado, no con los caracteres combinantes literales:
// escritos literales se rompen si el archivo se re-guarda con otra codificación.
export const normalizar = (t: string): string =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // La ñ ya quedó como "n" al sacar los acentos, así que acá sólo sobreviven letras y números.
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const coincide = (p: Patron, conBordes: string, palabras: string[]): boolean => {
  if (p.tipo === 'frase') return conBordes.includes(` ${p.valor} `);
  if (p.tipo === 'exacto') return palabras.includes(p.valor);
  return palabras.some((w) => w.startsWith(p.valor));
};

interface Puntaje {
  tema: Tema;
  /** Suma de los pesos que coincidieron. */
  total: number;
  /** Peso de la señal más fuerte: evita que varias palabras genéricas simulen un match. */
  mejorPeso: number;
}

// Un tema cuenta como candidato real sólo si tuvo al menos una señal específica.
const PESO_MINIMO_SENAL = 3;
const TOTAL_MINIMO = 4;

const puntuar = (texto: string): Puntaje[] => {
  const conBordes = ` ${texto} `;
  const palabras = texto.split(' ').filter(Boolean);
  return TEMAS.map((tema) => {
    let total = 0;
    let mejorPeso = 0;
    for (const p of tema.patrones) {
      if (!coincide(p, conBordes, palabras)) continue;
      total += p.peso;
      if (p.peso > mejorPeso) mejorPeso = p.peso;
    }
    return { tema, total, mejorPeso };
  })
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total || b.mejorPeso - a.mejorPeso);
};

const detectarIntencion = (texto: string): IntencionId | undefined => {
  const conBordes = ` ${texto} `;
  const palabras = texto.split(' ').filter(Boolean);
  let mejor: IntencionId | undefined;
  let mejorPeso = 0;
  for (const i of INTENCIONES) {
    for (const p of i.patrones) {
      if (coincide(p, conBordes, palabras) && p.peso > mejorPeso) {
        mejor = i.id;
        mejorPeso = p.peso;
      }
    }
  }
  return mejor;
};

// "¿sos un bot?" pregunta por el asistente, no por el servicio de bots de WhatsApp.
// Son frases enteras y muy puntuales, así que se contestan antes de buscar tema.
const preguntaPorElAsistente = (texto: string): boolean => {
  const conBordes = ` ${texto} `;
  const palabras = texto.split(' ').filter(Boolean);
  const i = INTENCIONES.find((x) => x.id === 'quien-sos')!;
  return i.patrones.some((p) => coincide(p, conBordes, palabras));
};

// 'precio' y 'plazos' no son temas en sí: califican a otro tema.
// "¿cuánto sale una tienda online?" es ecommerce + precio, no una pregunta genérica de precios.
const MODIFICADORES = new Set(['precio', 'plazos']);

/** True si el tema califica a otro en vez de valer por sí mismo ('precio', 'plazos'). */
export const esModificador = (temaId: string): boolean => MODIFICADORES.has(temaId);

const esCandidato = (p: Puntaje) => p.mejorPeso >= PESO_MINIMO_SENAL && p.total >= TOTAL_MINIMO;

const chips = (tema: Tema): Tema[] =>
  (tema.relacionados ?? []).map(temaPorId).filter((t): t is Tema => Boolean(t));

// Arma la frase de precio de un servicio a partir del presupuestador, para no repetir números a mano.
const frasePrecio = (tema: Tema): string | null => {
  const p = SERVICIOS_SOFTWARE.find((s) => s.id === tema.precioId);
  if (!p) return null;
  if (p.consultar || (p.min === 0 && p.max === 0)) {
    return `El precio de ${p.servicio.toLowerCase()} lo pasamos después del diagnóstico: cambia mucho según el caso y preferimos no publicar un rango que te confunda. El diagnóstico es gratis.`;
  }
  const rango = p.min === p.max ? `en ${pesos(p.min)}` : `entre ${pesos(p.min)} y ${pesos(p.max)}`;
  return `Como referencia, ${p.servicio.toLowerCase()} está ${rango}. Es un rango estimado: el número final sale del diagnóstico, que es gratuito. En Presupuesto podés marcar servicios y ver el total.`;
};

/** Respuesta de un tema elegido con un botón: no hay nada que clasificar, ya sabemos cuál es. */
export const respuestaDeTema = (tema: Tema): Respuesta => ({
  texto: tema.respuesta,
  tema,
  sugerencias: chips(tema),
  opciones: false,
  confianza: 'alta',
  temaContexto: tema.id,
});

const sinEntender = (candidatos: Tema[]): Respuesta => ({
  texto: candidatos.length
    ? 'No me quedó claro 🙂 ¿Te referís a alguno de estos?'
    : 'No estoy seguro de haberte entendido 🙂. Elegí una opción de acá abajo, o escribinos por WhatsApp o e-mail y te responde una persona del equipo.',
  tema: candidatos.length ? undefined : temaPorId('persona'),
  sugerencias: candidatos,
  opciones: candidatos.length === 0,
  confianza: 'baja',
});

/**
 * Responde con la base de conocimiento local. Es síncrona y siempre devuelve algo.
 * Si algún día entra una IA, esta función sigue siendo el piso al que se cae todo.
 */
export const responderLocal = (pregunta: string, ctx: Contexto = {}): Respuesta => {
  const texto = normalizar(pregunta);
  if (!texto) return sinEntender([]);

  if (preguntaPorElAsistente(texto)) {
    return {
      texto: INTENCIONES.find((x) => x.id === 'quien-sos')!.respuesta,
      tema: temaPorId('persona'),
      sugerencias: [],
      opciones: true,
      confianza: 'alta',
      temaContexto: ctx.temaPrevio,
    };
  }

  const puntajes = puntuar(texto);
  const candidatos = puntajes.filter(esCandidato);
  const intencion = detectarIntencion(texto);
  const previo = ctx.temaPrevio ? temaPorId(ctx.temaPrevio) : undefined;

  // Separo lo que es servicio de lo que sólo califica (precio / plazos).
  const servicios = candidatos.filter((c) => !MODIFICADORES.has(c.tema.id));
  const modificador = candidatos.find((c) => MODIFICADORES.has(c.tema.id));

  // 1. Servicio + "cuánto sale" → una sola respuesta que contesta las dos cosas.
  if (servicios.length && modificador?.tema.id === 'precio') {
    const tema = servicios[0].tema;
    const precio = frasePrecio(tema);
    return {
      texto: precio ? `${tema.respuesta}\n\n${precio}` : `${tema.respuesta}\n\n${temaPorId('precio')!.respuesta}`,
      tema,
      sugerencias: [temaPorId('diagnostico')!, temaPorId('precio')!],
      opciones: false,
      confianza: 'alta',
      temaContexto: tema.id,
    };
  }

  // 2. "¿y cuánto sale?" / "¿cuánto tarda?" sueltos, arrastrando de qué se estaba hablando.
  if (!servicios.length && modificador && previo && !MODIFICADORES.has(previo.id)) {
    if (modificador.tema.id === 'precio') {
      const precio = frasePrecio(previo);
      if (precio) {
        return {
          texto: `Hablando de ${previo.boton.toLowerCase()}: ${precio}`,
          tema: previo,
          sugerencias: [temaPorId('diagnostico')!, temaPorId('persona')!],
          opciones: false,
          confianza: 'alta',
          temaContexto: previo.id,
        };
      }
    }
    const m = modificador.tema;
    return {
      texto: m.respuesta,
      tema: m,
      sugerencias: chips(m),
      opciones: false,
      confianza: 'alta',
      temaContexto: previo.id,
    };
  }

  // 3. Dos temas igual de probables: antes de contestar cualquiera, pregunto.
  if (servicios.length >= 2 && servicios[1].total >= servicios[0].total * 0.8) {
    return sinEntender([servicios[0].tema, servicios[1].tema]);
  }

  // 4. Un tema claro.
  const ganador = servicios[0] ?? modificador;
  if (ganador) {
    const tema = ganador.tema;
    return {
      texto: tema.respuesta,
      tema,
      sugerencias: chips(tema),
      opciones: false,
      confianza: 'alta',
      temaContexto: tema.id,
    };
  }

  // 5. Sin tema, pero es un saludo / gracias / "¿sos un bot?" / "sí".
  if (intencion) {
    const i = INTENCIONES.find((x) => x.id === intencion)!;
    if (intencion === 'afirmacion' && previo) {
      return {
        texto: `Genial. Para ${previo.boton.toLowerCase()} lo más práctico es el diagnóstico gratuito: nos contás tu caso y te decimos cómo lo resolveríamos y qué saldría. También podés escribirnos directo por acá:`,
        tema: previo,
        sugerencias: [temaPorId('diagnostico')!, temaPorId('persona')!],
        opciones: false,
        confianza: 'alta',
        temaContexto: previo.id,
      };
    }
    if (i.respuesta) {
      return {
        texto: i.respuesta,
        tema: intencion === 'quien-sos' ? temaPorId('persona') : undefined,
        sugerencias: [],
        opciones: intencion !== 'despedida',
        confianza: 'alta',
        temaContexto: ctx.temaPrevio,
      };
    }
  }

  // 6. Hubo señales flojas: las ofrezco como opciones en vez de inventar una respuesta.
  return sinEntender(puntajes.slice(0, 3).map((p) => p.tema));
};
