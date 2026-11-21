// Un asistente para cada funcionalidad de tecnoros.ar.
// La idea: quien entra a la web no tiene que aprender a usarla; habla con el asistente de lo que
// quiere hacer y el asistente se lo muestra (lo lleva a la parte justa y la resalta) o lo hace.
//
// Por debajo hay una sola Golondrina: entiende las frases, ejecuta las acciones de cada asistente
// y aprende por repetición y contexto lo que suele hacer cada visitante, para sugerírselo.
import { Golondrina, normalizar, type Accion, type Parametros } from '../golondrina';
import { SERVICES } from '../components/ServicesSection';
import { PRODUCTOS } from '../components/ProductosPropios';
import { PROJECTS_DATA } from '../components/PortfolioSection';
import { COMBOS, ahorro } from '../data/combos';
import { SERVICIOS_SOFTWARE } from '../data/precios';
import { FOUNDERS, URL_ORGANIGRAMA } from '../data/equipo';
import { VENTAS_EMAIL, gmailPara, soporteWhatsappLink, whatsappLink } from '../data/contact';
import { abrirSoporte, irA } from '../rutas';
import { escribir, esperar, tocar, volarA } from './manos';
import { cerrarAsistentes } from './eventos';

export interface Enlace {
  texto: string;
  /** Se usa una sola vez: al tocarlo, desaparecen los botones de esa respuesta. */
  unaVez?: boolean;
  href?: string;
  /** Acción interna en vez de link. */
  alHacer?: () => void;
}

export interface Asistente {
  id: string;
  nombre: string;
  emoji: string;
  /** Color de acento. */
  color: string;
  /** Degradé del avatar (clases Tailwind). */
  degrade: string;
  /** Qué hace, en una línea. */
  rol: string;
  saludo: string;
  /** Páginas donde este asistente es "el de acá". */
  paginas: string[];
}

/** Dibujito de cada asistente: es una foto de su personaje 3D, así coincide con los que giran. */
export const imagenDe = (id: string) => `/asistentes/${id}.png`;

export const ASISTENTES: Asistente[] = [
  {
    id: 'servicios',
    nombre: 'Servicios',
    emoji: '🧩',
    color: 'cyan',
    degrade: 'from-cyan-400 to-sky-500',
    rol: 'Te digo qué servicio te sirve según lo que querés resolver',
    saludo: 'Contame qué querés resolver en tu negocio («vender por internet», «que el WhatsApp responda solo», «ordenar mis clientes») y te muestro el servicio que te sirve.',
    paginas: ['/servicios'],
  },
  {
    id: 'presupuesto',
    nombre: 'Presupuesto',
    emoji: '💰',
    color: 'emerald',
    degrade: 'from-emerald-400 to-teal-500',
    rol: 'Te calculo cuánto sale lo que necesitás',
    saludo: 'Decime qué necesitás («una tienda online y un bot de WhatsApp») y te calculo cuánto sale. También te muestro el combo que más te conviene.',
    paginas: ['/presupuesto'],
  },
  {
    id: 'productos',
    nombre: 'Productos',
    emoji: '🕊️',
    color: 'violet',
    degrade: 'from-violet-400 to-fuchsia-500',
    rol: 'Te muestro y te hago probar nuestros productos',
    saludo: 'Te muestro Golondrina, Golondrina Personal, Mostrador, CHAJÁ y TERO Security. Preguntame qué hace cada uno o pedime «probar Golondrina».',
    paginas: ['/productos'],
  },
  {
    id: 'robot',
    nombre: 'Diseñá tu robot',
    emoji: '🤖',
    color: 'amber',
    degrade: 'from-amber-400 to-orange-500',
    rol: 'Te guío para armar tu robot en 3D',
    saludo: 'Te ayudo a diseñar tu robot: contame para qué lo querés («que lleve cajas», «que limpie») y te llevo al diseñador con eso en mente.',
    paginas: ['/robotica'],
  },
  {
    id: 'proyectos',
    nombre: 'Proyectos',
    emoji: '📁',
    color: 'sky',
    degrade: 'from-sky-400 to-blue-500',
    rol: 'Te muestro sistemas que ya hicimos',
    saludo: 'Te muestro sistemas que ya están funcionando. Decime tu rubro («consultorio», «comercio») y te enseño el más parecido.',
    paginas: ['/proyectos'],
  },
  {
    id: 'equipo',
    nombre: 'Equipo',
    emoji: '👥',
    color: 'pink',
    degrade: 'from-pink-400 to-rose-500',
    rol: 'Te cuento quiénes somos y cómo trabajamos',
    saludo: 'Te cuento quiénes somos, de dónde y cómo trabajamos. Pedime «ver el organigrama» o «quiénes son los fundadores».',
    paginas: ['/nosotros'],
  },
  {
    id: 'contacto',
    nombre: 'Contacto',
    emoji: '✉️',
    color: 'teal',
    degrade: 'from-teal-400 to-cyan-500',
    rol: 'Te armo el mensaje para ventas',
    saludo: 'Contame en una frase qué necesitás y te dejo el mensaje listo para mandarlo por WhatsApp o e-mail.',
    paginas: ['/contacto'],
  },
  {
    id: 'soporte',
    nombre: 'Soporte técnico',
    emoji: '🎧',
    color: 'lime',
    degrade: 'from-lime-400 to-emerald-500',
    rol: '¿Ya sos cliente y algo no anda? Te ayudo',
    saludo: '¿Algo no anda? Contame qué pasa («no me llegan los avisos», «no puedo entrar») y te paso con soporte con el mensaje listo.',
    paginas: [],
  },
];

/**
 * Cuando tocás un botón del menú que necesita un dato, el asistente no completa nada solo:
 * te pregunta y espera tu respuesta. `prefijo` deja empezada la frase en la caja de texto.
 */
export const PREGUNTA_DE: Record<string, { pregunta: string; parametro: string; prefijo?: string }> = {
  'servicio-para': { parametro: 'necesidad', pregunta: '¿Para qué querés el servicio? Contame con tus palabras qué querés resolver en tu negocio.' },
  'calcular-presupuesto': { parametro: 'pedido', pregunta: '¿De qué querés saber cuánto sale? Contame qué necesitás y te lo calculo.' },
  'recomendar-combo': { parametro: 'pedido', pregunta: '¿Para qué lo querés? Contame qué querés lograr y te digo qué combo te conviene.' },
  'explicar-producto': { parametro: 'producto', pregunta: '¿De qué producto querés saber? Elegí uno o escribime cuál.' },
  'probar-producto': { parametro: 'producto', pregunta: '¿Qué producto querés probar? Elegí uno.' },
  'disenar-robot': { parametro: 'uso', pregunta: 'Completá la frase: «Quiero un robot que…»', prefijo: 'Quiero un robot que ' },
  'escribir-ventas': { parametro: 'mensaje', pregunta: 'Escribí acá abajo tu mensaje para el equipo de ventas y te lo dejo listo para mandar por Gmail.' },
  'pedir-soporte': { parametro: 'problema', pregunta: '¿Qué es lo que no anda? Contame qué pasa y te paso con soporte.' },
};

/** Sugerencias que aparecen como botones cuando el asistente pregunta (el texto es lo que «decís» al tocarlo). */
export const SUGERENCIAS_DE: Record<string, string[]> = {
  'servicio-para': ['Vender por internet', 'Que el WhatsApp responda solo', 'Ordenar mis clientes', 'Automatizar tareas a mano', 'Una página web', 'Cuidar mi información', 'Una app para el celular', 'No sé, quiero un diagnóstico'],
  'calcular-presupuesto': ['Una tienda online', 'Un bot de WhatsApp', 'Una página web', 'Automatizar tareas', 'Un CRM para mis clientes'],
  'pedir-soporte': ['No me llegan los avisos', 'No puedo entrar', 'Algo se ve mal', 'Otra cosa'],
};

/** Pedirle algo a otro asistente (por ejemplo, desde Servicios: «¿Cuánto sale?» lo responde Presupuesto). */
export const EVENTO_PEDIR = 'pedir-a-asistente';
export const pedirA = (asistente: string, accion: string, parametros: Record<string, string>, titulo: string) =>
  window.dispatchEvent(new CustomEvent(EVENTO_PEDIR, { detail: { asistente, accion, parametros, titulo } }));

/** Una sola Golondrina para todos: así aprende también el recorrido entre funciones. */
export const golondrina = new Golondrina({
  app: 'tecnoros-asistentes',
  acciones: [],
  minRepeticiones: 2,
  // Si la frase no coincide con ninguna acción, la toma la función principal del asistente
  // con el que se está hablando: cada asistente entiende "lo suyo" dicho de cualquier forma.
  interpretar: async (texto, acciones, ctx) => {
    const t = normalizar(texto);
    const principal: Record<string, [string, string]> = {
      servicios: ['servicio-para', 'necesidad'],
      presupuesto: [/combo/.test(t) ? 'recomendar-combo' : /mand|envi|contrat/.test(t) ? 'enviar-presupuesto' : 'calcular-presupuesto', 'pedido'],
      productos: [/prob|demo|3d|mostra/.test(t) ? 'probar-producto' : 'explicar-producto', 'producto'],
      robot: ['disenar-robot', 'uso'],
      proyectos: ['ver-proyectos', 'rubro'],
      equipo: [/organigrama|completo|todos/.test(t) ? 'ver-organigrama' : 'quienes-somos', 'pregunta'],
      contacto: ['escribir-ventas', 'mensaje'],
      soporte: ['pedir-soporte', 'problema'],
    };
    const elegido = principal[ctx.seccion];
    if (!elegido || !acciones.some((a) => a.id === elegido[0])) return null;
    return { accion: elegido[0], parametros: { [elegido[1]]: texto } };
  },
});

/** El asistente vuela hasta lo que te quiere mostrar. */
const mostrar = (asistente: string, destino: string | HTMLElement | null | Promise<HTMLElement | null>, texto: string) => {
  const a = ASISTENTES.find((x) => x.id === asistente)!;
  void Promise.resolve(destino).then((d) => {
    if (d) void volarA(d, { emoji: a.emoji, degrade: a.degrade, imagen: imagenDe(a.id) }, texto);
  });
};
/** Busca un elemento por su texto dentro de un contenedor. */
const porTexto = (selector: string, texto: string) => esperar(() => [...document.querySelectorAll(selector)].find((e) => normalizar(e.textContent ?? '').includes(normalizar(texto))) ?? null);

/** Diagnóstico gratis: se cierra el chat y te lleva directo a esa pantalla. */
export const irAlDiagnostico = () => {
  cerrarAsistentes();
  irA('servicio-analisis-qa', true, 'center');
};

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;
const contiene = (t: string, ...palabras: string[]) => palabras.some((p) => t.includes(p));

// ─── Qué servicio corresponde a cada necesidad ──────────────────────────────
const NECESIDADES: [string[], string][] = [
  [['tienda', 'vender online', 'vender por internet', 'e commerce', 'ecommerce', 'carrito', 'catalogo'], 'ecommerce'],
  [['whatsapp', 'responda solo', 'mensajes', 'bot'], 'bots-whatsapp'],
  [['turno', 'automat', 'planilla', 'a mano', 'tareas', 'administrativ', 'excel'], 'automatizacion'],
  [['clientes', 'crm', 'seguimiento', 'ventas en orden', 'ordenar'], 'crm'],
  [['segur', 'hacke', 'virus', 'contrasen', 'datos', 'proteg'], 'ciberseguridad'],
  [['pagina', 'web', 'sitio', 'landing'], 'paginas-web'],
  [['app', 'aplicacion', 'celular', 'android', 'iphone'], 'aplicaciones-moviles'],
  [['logo', 'identidad', 'colores'], 'identidad-marca'],
  [['marca', 'estrategia', 'posicion'], 'estrategia-marca'],
  [['anuncio', 'publicidad', 'ads', 'instagram', 'facebook', 'google'], 'campanas-ads'],
  [['robot', 'brazo', 'maquina'], 'robotica-a-medida'],
  [['asistente', 'personaje', 'animado', 'mascota'], 'asistentes'],
  [['sistema', 'software', 'programa', 'medida'], 'software-a-medida'],
  [['diagnost', 'no se', 'no sé', 'asesor', 'que me conviene'], 'analisis-qa'],
];

export const serviciosDe = (frase: string) => {
  // Cada clave tiene que estar al principio de una palabra («app» no cuenta dentro de «whatsapp»).
  const t = ` ${normalizar(frase)} `;
  const ids: string[] = [];
  NECESIDADES.forEach(([claves, id]) => {
    if (claves.some((c) => t.includes(` ${normalizar(c)}`)) && !ids.includes(id)) ids.push(id);
  });
  return ids;
};

// Los ids de precios no siempre coinciden con los de las tarjetas de servicio.
const ID_PRECIO: Record<string, string> = { 'analisis-qa': 'diagnostico', 'paginas-web': 'paginas-web', 'software-a-medida': 'automatizacion' };

// Qué servicios (ids de precios) trae cada combo, para recomendarlo cuando piden esas cosas juntas.
const SERVICIOS_DE_COMBO: Record<string, string[]> = {
  'arranque-digital': ['diagnostico', 'ecommerce', 'bots-whatsapp'],
  'negocio-automatico': ['diagnostico', 'automatizacion', 'bots-whatsapp', 'asistentes'],
  'sistema-seguro': ['diagnostico', 'crm', 'ciberseguridad'],
};

const DEMO_DE: Record<string, { id: string; demo: string; nombre: string }> = {
  golondrina: { id: 'golondrina-automatizacion', demo: 'aplicaciones-golondrina', nombre: 'Golondrina Automatización' },
  personal: { id: 'golondrina-personal', demo: 'golondrina-personal-demo', nombre: 'Golondrina Personal' },
  mostrador: { id: 'mostrador-chatbot', demo: 'mostrador-demo', nombre: 'Mostrador' },
  chaja: { id: 'colibri-micro-hub', demo: 'hardware-studio-3d', nombre: 'CHAJÁ' },
  tero: { id: 'software-ciberseguridad', demo: 'tero-proximamente', nombre: 'TERO Security' },
};
const productoDe = (frase: string) => {
  const t = normalizar(frase);
  if (contiene(t, 'personal', 'recordatorio', 'avisame')) return DEMO_DE.personal;
  if (contiene(t, 'golondrina', 'maquina', 'planta', 'heladera', 'frio', 'sensor')) return DEMO_DE.golondrina;
  if (contiene(t, 'mostrador', 'chatbot', 'chat')) return DEMO_DE.mostrador;
  if (contiene(t, 'chaja', 'red', 'micro')) return DEMO_DE.chaja;
  if (contiene(t, 'tero', 'ciber', 'seguridad')) return DEMO_DE.tero;
  return null;
};

/**
 * Acciones de cada asistente. `ofrecer` agrega botones o links debajo de la respuesta
 * (por ejemplo «Mandar por WhatsApp»), que la persona toca cuando quiere.
 */
export function accionesDeAsistentes(ofrecer: (e: Enlace) => void): Accion[] {
  const de = (asistente: string, a: Omit<Accion, 'secciones'>): Accion => ({ ...a, secciones: [asistente, 'inicio-asistentes'] });
  let ultimoPresupuesto: { items: string[]; min: number; max: number } | null = null;

  return [
    // ───────── Servicios ─────────
    de('servicios', {
      id: 'servicio-para',
      grupo: 'Servicios',
      menu: '¿Qué servicio me sirve?',
      titulo: 'Ver el servicio para {necesidad}',
      ejemplo: 'quiero vender por internet',
      frases: ['quiero {necesidad}', 'necesito {necesidad}', 'me sirve para {necesidad}', 'busco {necesidad}', 'qué servicio para {necesidad}'],
      parametros: [{ nombre: 'necesidad', libre: true, completo: true, memorizable: false }],
      descubrible: true,
      ejecutar: (p: Parametros) => {
        const ids = serviciosDe(p['necesidad'] ?? '');
        const items = ids.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean) as typeof SERVICES;
        if (!items.length) {
          ofrecer({ texto: 'Pedir diagnóstico gratis', alHacer: irAlDiagnostico });
          return 'No me quedó claro qué necesitás. Contámelo con otras palabras, o empezá por el diagnóstico inicial gratuito: miramos tu negocio y te decimos qué conviene.';
        }
        irA(`servicio-${items[0].id}`, false, 'center');
        mostrar('servicios', `servicio-${items[0].id}`, '¡Este te sirve!');
        items.slice(1, 3).forEach((s) => ofrecer({ texto: `Ver ${s.title}`, alHacer: () => irA(`servicio-${s.id}`, true, 'center') }));
        ofrecer({ texto: '¿Cuánto sale?', alHacer: () => pedirA('presupuesto', 'calcular-presupuesto', { pedido: p['necesidad'] ?? '' }, `¿Cuánto sale? (${items.map((s) => s.title.split(':')[0]).join(', ')})`) });
        return `Para eso te sirve **${items[0].title}**: ${items[0].description}\nTe lo marqué en la página.` + (items.length > 1 ? `\nTambién puede servirte: ${items.slice(1, 3).map((s) => s.title).join(' y ')}.` : '');
      },
    }),
    de('servicios', {
      id: 'ver-servicios',
      grupo: 'Servicios',
      menu: 'Ver todos los servicios',
      titulo: 'Ver todos los servicios',
      frases: ['ver servicios', 'qué hacen', 'todos los servicios', 'qué ofrecen'],
      ejecutar: () => {
        SERVICES.forEach((s) =>
          ofrecer({
            texto: s.title.split(':')[0],
            alHacer: () => {
              irA(`servicio-${s.id}`, true, 'center');
              mostrar('servicios', `servicio-${s.id}`, s.title.split(':')[0]);
            },
          }),
        );
        return 'Estos son todos nuestros servicios. Tocá el que quieras y te llevo a ver de qué se trata.';
      },
    }),

    // ───────── Presupuesto ─────────
    de('presupuesto', {
      id: 'calcular-presupuesto',
      grupo: 'Presupuesto',
      menu: 'Calcular cuánto sale',
      titulo: 'Calcular presupuesto',
      ejemplo: 'cuánto sale una tienda online y un bot de whatsapp',
      frases: ['cuánto sale {pedido}', 'cuanto cuesta {pedido}', 'presupuesto de {pedido}', 'precio de {pedido}', 'calcular {pedido}', 'cotizar {pedido}'],
      parametros: [{ nombre: 'pedido', libre: true, completo: true, memorizable: false }],
      descubrible: true,
      ejecutar: (p: Parametros) => {
        const ids = serviciosDe(p['pedido'] ?? '').map((id) => ID_PRECIO[id] ?? id);
        const precios = ids.map((id) => SERVICIOS_SOFTWARE.find((s) => s.id === id)).filter(Boolean) as typeof SERVICIOS_SOFTWARE;
        if (!precios.length) {
          irA('facturacion');
          return 'Decime qué querés hacer («una tienda online», «automatizar los turnos») y te digo cuánto sale. Mientras, te dejé el presupuestador abierto.';
        }
        const min = precios.reduce((t, s) => t + s.min, 0);
        const max = precios.reduce((t, s) => t + s.max, 0);
        ultimoPresupuesto = { items: precios.map((s) => s.servicio), min, max };
        const combo = precios.length > 1 ? COMBOS.find((c) => precios.every((s) => (SERVICIOS_DE_COMBO[c.id] ?? []).includes(s.id))) : undefined;
        irA('facturacion');
        // Marca en el presupuestador cada servicio, a la vista, y después señala el combo si conviene.
        void (async () => {
          for (const s of precios) {
            const boton = await esperar(`[data-servicio="${s.id}"]`);
            if (boton && boton.getAttribute('aria-pressed') !== 'true') await tocar(boton);
          }
          if (combo) {
            irA('combos');
            mostrar('presupuesto', porTexto('#combos h3', combo.nombre).then((h) => h?.closest('li, article, div[class*="rounded"]') as HTMLElement | null), `Ahorrás ${ahorro(combo)}%`);
          } else mostrar('presupuesto', esperar('[data-servicio][aria-pressed="true"]'), 'Te lo marqué');
        })();
        const msg = `Hola tecnoros.ar, quiero presupuesto de: ${ultimoPresupuesto.items.join(', ')} (referencia ${pesos(min)} a ${pesos(max)}).`;
        ofrecer({ texto: 'Pedir presupuesto por WhatsApp', href: whatsappLink(msg), unaVez: true });
        ofrecer({ texto: 'Por e-mail', href: gmailPara(VENTAS_EMAIL, 'Presupuesto - tecnoros.ar', msg), unaVez: true });
        return (
          precios.map((s) => `• ${s.servicio}: ${s.max ? `${pesos(s.min)} a ${pesos(s.max)}` : 'gratis'}`).join('\n') +
          `\nTotal de referencia: ${pesos(min)} a ${pesos(max)}.` +
          (combo ? `\n💡 Te conviene el combo **${combo.nombre}**: desde ${pesos(combo.desde)} (ahorrás ${ahorro(combo)}%). Te lo marqué.` : '') +
          '\nEl precio final se confirma en el diagnóstico inicial gratuito.'
        );
      },
    }),
    de('presupuesto', {
      id: 'recomendar-combo',
      grupo: 'Presupuesto',
      menu: '¿Qué combo me conviene?',
      titulo: 'Recomendar combo',
      ejemplo: 'qué combo me conviene para vender online',
      frases: ['qué combo {pedido}', 'combo para {pedido}', 'ver combos', 'combos'],
      parametros: [{ nombre: 'pedido', libre: true, completo: true, memorizable: false }],
      ejecutar: (p: Parametros) => {
        const t = normalizar(p['pedido'] ?? '');
        const combo =
          contiene(t, 'vender', 'tienda', 'online') ? COMBOS[0]
          : contiene(t, 'automat', 'turno', 'a mano') ? COMBOS[1]
          : contiene(t, 'cliente', 'crm', 'segur') ? COMBOS[2]
          : contiene(t, 'planta', 'maquina', 'sensor', 'golondrina') ? COMBOS[3]
          : null;
        if (!combo) {
          COMBOS.forEach((c) =>
            ofrecer({
              texto: `${c.nombre} · desde ${pesos(c.desde)}`,
              alHacer: () => {
                irA('combos');
                mostrar('presupuesto', porTexto('#combos h3', c.nombre).then((h) => h?.closest('li, article, div[class*="rounded"]') as HTMLElement | null), c.nombre);
              },
            }),
          );
          return t
            ? 'No me quedó claro para qué. Te sugiero estos combos: tocá uno para verlo, o contame qué querés lograr.'
            : 'Te sugiero estos combos: tocá uno para verlo. Si me contás para qué lo querés, te digo cuál te conviene más.';
        }
        irA('combos');
        if (combo) mostrar('presupuesto', porTexto('#combos h3', combo.nombre).then((h) => h?.closest('li, article, div[class*="rounded"]') as HTMLElement | null), `¡Este te conviene!`);
        return `Te conviene **${combo.nombre}**: ${combo.para}\nIncluye ${combo.incluye.join(', ')}. Desde ${pesos(combo.desde)} (ahorrás ${ahorro(combo)}%).`;
      },
    }),
    de('presupuesto', {
      id: 'enviar-presupuesto',
      grupo: 'Presupuesto',
      menu: 'Mandar mi presupuesto',
      titulo: 'Mandar presupuesto a ventas',
      frases: ['mandar presupuesto', 'enviar presupuesto', 'quiero contratar', 'pedir presupuesto formal'],
      ejecutar: () => {
        const msg = ultimoPresupuesto
          ? `Hola tecnoros.ar, quiero presupuesto de: ${ultimoPresupuesto.items.join(', ')} (referencia ${pesos(ultimoPresupuesto.min)} a ${pesos(ultimoPresupuesto.max)}).`
          : 'Hola tecnoros.ar, quiero pedir un presupuesto.';
        ofrecer({ texto: 'Mandar por WhatsApp', href: whatsappLink(msg), unaVez: true });
        ofrecer({ texto: 'Mandar por e-mail', href: gmailPara(VENTAS_EMAIL, 'Presupuesto - tecnoros.ar', msg), unaVez: true });
        return `Te dejé el mensaje listo: «${msg}». Tocá cómo querés mandarlo.`;
      },
    }),

    // ───────── Productos ─────────
    de('productos', {
      id: 'explicar-producto',
      grupo: 'Productos',
      menu: '¿Qué hace cada producto?',
      titulo: 'Qué es {producto}',
      ejemplo: 'qué hace golondrina',
      frases: ['qué es {producto}', 'qué hace {producto}', 'para qué sirve {producto}', 'contame de {producto}', 'cuánto sale {producto}'],
      parametros: [{ nombre: 'producto', libre: true, completo: true, memorizable: false }],
      descubrible: true,
      ejecutar: (p: Parametros) => {
        const prod = productoDe(p['producto'] ?? '');
        if (!prod) {
          Object.values(DEMO_DE).forEach((x) => ofrecer({ texto: x.nombre, alHacer: () => pedirA('productos', 'explicar-producto', { producto: x.nombre }, `¿Qué es ${x.nombre}?`) }));
          return 'Tenemos estos productos. ¿De cuál te cuento?';
        }
        const info = PRODUCTOS.find((x) => x.id === prod.id);
        irA(`producto-${prod.id}`, false, 'center');
        mostrar('productos', `producto-${prod.id}`, prod.nombre);
        ofrecer({ texto: `Probar ${prod.nombre}`, alHacer: () => pedirA('productos', 'probar-producto', { producto: prod.nombre }, `Probar ${prod.nombre}`) });
        return `**${prod.nombre}**: ${[info?.queEs, info?.queHace].filter(Boolean).join(' ')}\nTe lo marqué en la página.`;
      },
    }),
    de('productos', {
      id: 'probar-producto',
      grupo: 'Productos',
      menu: 'Probar una demo',
      titulo: 'Probar {producto}',
      ejemplo: 'probar golondrina',
      frases: ['probar {producto}', 'quiero probar {producto}', 'demo de {producto}', 'ver en 3d {producto}', 'mostrame {producto}'],
      parametros: [{ nombre: 'producto', libre: true, completo: true, memorizable: false }],
      descubrible: true,
      ejecutar: (p: Parametros) => {
        const prod = productoDe(p['producto'] ?? '');
        if (!prod) {
          Object.values(DEMO_DE).forEach((x) => ofrecer({ texto: x.nombre, alHacer: () => pedirA('productos', 'probar-producto', { producto: x.nombre }, `Probar ${x.nombre}`) }));
          return '¿Qué producto querés probar? Elegí uno.';
        }
        irA(prod.demo);
        if (prod === DEMO_DE.golondrina) {
          // La prueba la hace el asistente: aprieta "Simular corte de luz" y se ve llegar la alerta.
          void (async () => {
            const boton = await porTexto('#aplicaciones-golondrina button, button', 'Simular Corte de Luz');
            if (boton) {
              mostrar('productos', boton, 'Mirá: lo aprieto yo');
              await new Promise((ok) => setTimeout(ok, 1200));
              await tocar(boton);
            }
          })();
          return 'Te llevé al simulador de Golondrina y aprieto «Simular corte de luz»: mirá cómo llega la alerta por WhatsApp y se resuelve con 1 clic. Es una simulación.';
        }
        mostrar('productos', prod.demo, `Probá ${prod.nombre}`);
        return `Te llevé a la demo de ${prod.nombre}. Es una simulación: no se conecta a nada real.`;
      },
    }),

    // ───────── Robot ─────────
    de('robot', {
      id: 'disenar-robot',
      grupo: 'Robot',
      menu: 'Diseñar mi robot',
      titulo: 'Diseñar robot para {uso}',
      ejemplo: 'quiero un robot que lleve cajas',
      frases: ['robot para {uso}', 'quiero un robot {uso}', 'diseñar robot {uso}', 'robot que {uso}', 'diseñar mi robot'],
      parametros: [{ nombre: 'uso', libre: true, completo: true, memorizable: false }],
      descubrible: true,
      ejecutar: (p: Parametros) => {
        irA('robot-creacion', true);
        mostrar('robot', 'robot-creacion', 'Acá lo armás');
        const t = normalizar(p['uso'] ?? '');
        const consejo = contiene(t, 'caja', 'llev', 'carga')
          ? 'Para llevar cajas, elegí ruedas y una bandeja arriba.'
          : contiene(t, 'limpi')
          ? 'Para limpiar, conviene un modelo bajo con ruedas.'
          : contiene(t, 'brazo', 'agarr', 'mover')
          ? 'Para agarrar cosas, sumale un brazo.'
          : 'Elegí el modelo, los colores y probalo en 3D.';
        return `Te llevé al panel de creación del robot. ${consejo}\nPrimero programamos el cerebro y lo probás en 3D; si funciona, fabricamos el cuerpo.`;
      },
    }),

    de('robot', {
      id: 'cotizar-robot',
      grupo: 'Robot',
      titulo: 'Cotizar mi robot',
      frases: ['cotizar mi robot', 'cotizar robot', 'cotizar un robot', 'precio del robot', 'cuánto sale un robot', 'cuanto sale el robot'],
      ejecutar: () => {
        irA('robotica-3d');
        void (async () => {
          const boton = await porTexto('#robotica-3d button, button', 'Cotizar mi robot');
          if (boton) {
            boton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            mostrar('robot', boton, 'Cotizalo acá');
          }
        })();
        return 'Te llevé a la cotización del diseñador de robots: armalo como lo querés y tocá «Cotizar mi robot».';
      },
    }),

    // ───────── Proyectos ─────────
    de('proyectos', {
      id: 'ver-proyectos',
      grupo: 'Proyectos',
      menu: 'Ver proyectos',
      titulo: 'Ver proyectos de {rubro}',
      ejemplo: 'tienen algo para consultorios',
      frases: ['proyectos de {rubro}', 'tienen algo para {rubro}', 'ver proyectos', 'qué hicieron', 'ejemplos'],
      parametros: [{ nombre: 'rubro', libre: true, completo: true, memorizable: false }],
      ejecutar: (p: Parametros) => {
        const verProyecto = (id: string) => {
          irA('proyectos');
          window.setTimeout(() => window.dispatchEvent(new CustomEvent('seleccionar-proyecto', { detail: id })), 300);
          mostrar('proyectos', 'proyectos', 'Este es');
        };
        // Los dos que mostramos: Mostrador (chatbot) y la Agenda del consultorio.
        const verMostrador = () => {
          irA('mostrador-demo', true, 'center');
          mostrar('proyectos', 'mostrador-demo', 'Mostrador');
        };
        const t = normalizar(p['rubro'] ?? '');
        if (contiene(t, 'mostrador', 'chat', 'atencion', 'comercio', 'local', 'tienda')) {
          ofrecer({ texto: 'Ver Mostrador', alHacer: verMostrador });
          return 'Para eso mirá **Mostrador**: un chatbot con IA que atiende a tus clientes 24/7. Tocalo para verlo.';
        }
        const hit = t ? PROJECTS_DATA.find((x) => normalizar(`${x.category} ${x.title}`).split(' ').some((w) => w.length > 4 && t.includes(w))) : undefined;
        if (hit) {
          ofrecer({ texto: `Ver ${hit.title.split(':')[0]}`, alHacer: () => verProyecto(hit.id) });
          return `Tenemos **${hit.title}** (${hit.category}). Tocalo para verlo.`;
        }
        ofrecer({ texto: 'Ver Mostrador', alHacer: verMostrador });
        PROJECTS_DATA.forEach((x) => ofrecer({ texto: `Ver ${x.title.split(':')[0].replace('Agenda Odontológica', 'Agenda de consultorio')}`, alHacer: () => verProyecto(x.id) }));
        return (
          'Estos son nuestros proyectos funcionando:\n' +
          '• **Mostrador**: un chatbot con IA que atiende a los clientes de tu negocio 24/7 con tu información (precios, horarios, productos).\n' +
          '• **Agenda de consultorio**: la ficha de cada paciente con obra social, adjuntos y contacto directo por WhatsApp, llamada o correo.\n' +
          'Elegí cuál querés ver.'
        ) + (t ? '\nPara tu rubro todavía no tenemos uno publicado: lo armamos a medida.' : '');
      },
    }),

    // ───────── Equipo ─────────
    de('equipo', {
      id: 'quienes-somos',
      grupo: 'Equipo',
      menu: '¿Quiénes son?',
      titulo: 'Quiénes somos',
      frases: ['quiénes son', 'quienes somos', 'fundadores', 'quién está detrás', 'de dónde son'],
      ejecutar: () => {
        irA('sobre-nosotros');
        mostrar('equipo', porTexto('#sobre-nosotros span', 'Fundadores').then((e) => (e?.parentElement as HTMLElement | null) ?? null), 'Los fundadores');
        const f = FOUNDERS.filter((x) => x.area === 'cofundadores');
        f.forEach((x) => x.linkedin && ofrecer({ texto: `LinkedIn de ${x.name}`, href: x.linkedin }));
        return `Nacimos en Rosario y hoy somos ${FOUNDERS.length} personas trabajando en remoto desde todo LATAM.\nNos fundaron ${f.map((x) => x.name).join(' y ')}.`;
      },
    }),
    de('equipo', {
      id: 'ver-organigrama',
      grupo: 'Equipo',
      menu: 'Ver el organigrama',
      titulo: 'Ver organigrama',
      frases: ['organigrama', 'ver organigrama', 'equipo completo', 'todo el equipo'],
      ejecutar: () => {
        ofrecer({ texto: 'Abrir organigrama completo', href: URL_ORGANIGRAMA });
        return `Somos ${FOUNDERS.length} personas en distintas áreas. Abrí el organigrama completo acá abajo.`;
      },
    }),

    // ───────── Contacto ─────────
    de('contacto', {
      id: 'escribir-ventas',
      grupo: 'Contacto',
      menu: 'Escribirle a ventas',
      titulo: 'Escribir a ventas',
      ejemplo: 'quiero una web para mi panadería',
      frases: ['escribir {mensaje}', 'contactar {mensaje}', 'hablar con alguien', 'mensaje {mensaje}', 'consulta {mensaje}'],
      parametros: [{ nombre: 'mensaje', libre: true, completo: true, memorizable: false }],
      ejecutar: (p: Parametros) => {
        const texto = (p['mensaje'] ?? '').trim();
        const msg = `Hola tecnoros.ar, ${texto && !/^(hablar con alguien|contactar|escribir|escribirle a ventas)$/i.test(texto) ? texto : 'quiero hacer una consulta.'}`;
        // Directo al e-mail de ventas: al tocarlo se abre Gmail con el mensaje para el equipo de ventas.
        ofrecer({ texto: `✉️ ${VENTAS_EMAIL} · abrir Gmail`, href: gmailPara(VENTAS_EMAIL, 'Consulta desde la web - tecnoros.ar', msg), unaVez: true });
        return texto
          ? `Listo, tu mensaje para ventas: «${msg}». Tocá el botón y se abre Gmail para mandárselo a **${VENTAS_EMAIL}**; te responde una persona del equipo.`
          : `Escribile al equipo de ventas a **${VENTAS_EMAIL}**. Tocá el botón y se abre Gmail para mandarle tu mensaje; te responde una persona del equipo.`;
      },
    }),

    // ───────── Soporte ─────────
    de('soporte', {
      id: 'pedir-soporte',
      grupo: 'Soporte',
      menu: 'Algo no anda',
      titulo: 'Pedir soporte',
      ejemplo: 'no me llegan los avisos',
      frases: ['no anda {problema}', 'no funciona {problema}', 'no me llegan {problema}', 'no puedo {problema}', 'tengo un problema {problema}', 'soporte {problema}', 'ayuda con {problema}'],
      parametros: [{ nombre: 'problema', libre: true, completo: true, memorizable: false }],
      ejecutar: (p: Parametros) => {
        const problema = (p['problema'] ?? '').trim();
        const msg = `Hola tecnoros.ar, soy cliente y necesito soporte técnico${problema ? `: ${problema}` : '.'}`;
        ofrecer({ texto: 'WhatsApp de soporte', href: soporteWhatsappLink(msg) });
        ofrecer({ texto: 'Ver opciones de soporte', alHacer: () => { abrirSoporte(); mostrar('soporte', esperar('#panel-soporte'), 'Elegí cómo'); } });
        return 'Te dejé el mensaje listo para soporte técnico. Si podés, sumá una captura de lo que ves: así lo resolvemos más rápido.';
      },
    }),
  ];
}
