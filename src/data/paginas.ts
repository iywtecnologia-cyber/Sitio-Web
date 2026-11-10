import type { Ruta } from '../rutas';

// Fuente única de título y descripción de cada página. La usa App.tsx al navegar y
// scripts/generar-paginas.ts al compilar, para que cada ruta tenga su propio HTML con
// sus metadatos (Google y las vistas previas de WhatsApp no ejecutan el JavaScript).

// Dominio definitivo: sin www, que es a donde redirige el sitio. canonical, og:url,
// robots.txt y sitemap.xml tienen que usar este mismo.
export const SITIO = 'https://tecnoros.ar';

export const TITULO_INICIO = 'tecnoros.ar | Automatización | Ciberseguridad | Robótica | Electrónica | Machine Learning';
export const DESCRIPCION_INICIO = 'Automatización inteligente, ciberseguridad, robótica a medida, electrónica y machine learning para empresas y la agroindustria. Diagnóstico gratuito.';

export const META_PAGINAS: Record<Exclude<Ruta, '/'>, { titulo: string; descripcion: string }> = {
  '/servicios': { titulo: 'Servicios', descripcion: 'Automatizaciones, ciberseguridad, e-commerce, apps, CRM, bots de WhatsApp y robótica. Mirá qué hacemos y cómo trabajamos.' },
  '/productos': { titulo: 'Productos propios', descripcion: 'Golondrina, CHAJÁ y TERO: nuestros sistemas y equipos propios. Probá las demos y miralos en 3D.' },
  '/robotica': { titulo: 'Diseñá tu robot', descripcion: 'Armá tu robot a medida y probalo en 3D. Primero programamos el cerebro; si funciona, fabricamos el cuerpo.' },
  '/proyectos': { titulo: 'Proyectos', descripcion: 'Sistemas reales que hicimos y que ya están funcionando en negocios.' },
  '/presupuesto': { titulo: 'Presupuesto', descripcion: 'Calculá cuánto cuesta lo que necesitás, con precios de referencia y combos.' },
  '/tecnologias': { titulo: 'Tecnologías', descripcion: 'Las tecnologías con las que trabajamos.' },
  '/nosotros': { titulo: 'Nosotros', descripcion: 'Nacimos en Rosario y trabajamos en remoto con gente de distintos lugares del mundo: ciberseguridad, QA, automatización, electrónica y machine learning.' },
  '/contacto': { titulo: 'Contacto', descripcion: 'Contanos qué necesitás por WhatsApp o e-mail. El diagnóstico es sin costo.' },
  '/encuentros': { titulo: 'Encuentros', descripcion: 'Nuestra historia en fotos: cómo empezamos, el equipo y las jornadas y eventos a los que vamos.' },
  '/blog': { titulo: 'Blog', descripcion: 'Notas cortas y prácticas para tu negocio: automatización, ciberseguridad y más.' },
};

export const tituloDe = (ruta: Ruta) => (ruta === '/' ? TITULO_INICIO : `${META_PAGINAS[ruta].titulo} · tecnoros.ar`);
export const descripcionDe = (ruta: Ruta) => (ruta === '/' ? DESCRIPCION_INICIO : META_PAGINAS[ruta].descripcion);
export const urlDe = (ruta: Ruta) => SITIO + ruta;

export const TITULO_NO_ENCONTRADA = 'Página no encontrada · tecnoros.ar';
