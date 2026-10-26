import { irA } from './rutas';
import { SERVICES } from './components/ServicesSection';
import { PROJECTS_DATA } from './components/PortfolioSection';

// Temas del formulario de contacto: cubre todas las secciones de la web.
// Cuando alguien toca "Consultar por…" en cualquier parte, el formulario se abre
// con ese tema elegido y el mensaje ya escrito sobre eso (la persona lo puede cambiar).

export interface Tema {
  id: string;
  grupo: string;
  etiqueta: string;
  mensaje: string;
}

// Se arma al usarlo (no al cargar el archivo) para no depender del orden de carga de los componentes.
export const temas = (): Tema[] => [
  ...SERVICES.map((s) => ({
    id: `servicio-${s.id}`,
    grupo: 'Servicios',
    etiqueta: s.title,
    mensaje: `Hola, quiero consultar por el servicio "${s.title}". Les cuento qué necesito: `,
  })),
  { id: 'producto-golondrina', grupo: 'Productos', etiqueta: 'Golondrina Automatización', mensaje: 'Hola, quiero consultar por Golondrina Automatización para mi negocio. Les cuento qué máquinas o procesos tengo: ' },
  { id: 'producto-golondrina-personal', grupo: 'Productos', etiqueta: 'Golondrina Personal', mensaje: 'Hola, quiero consultar por Golondrina Personal. Me gustaría que me avise de: ' },
  { id: 'producto-chaja', grupo: 'Productos', etiqueta: 'CHAJÁ', mensaje: 'Hola, quiero consultar por CHAJÁ para mi planta o comercio. Les cuento cómo trabajamos: ' },
  { id: 'producto-tero', grupo: 'Productos', etiqueta: 'TERO Security (novedades)', mensaje: 'Hola, quiero que me mantengan informado sobre el lanzamiento de TERO Security.' },
  ...PROJECTS_DATA.map((p) => ({
    id: `proyecto-${p.id}`,
    grupo: 'Proyectos',
    etiqueta: p.title,
    mensaje: `Hola, vi el proyecto "${p.title}" y quiero algo parecido para mi negocio. Les cuento: `,
  })),
  { id: 'robotica', grupo: 'Robótica', etiqueta: 'Un robot a medida', mensaje: 'Hola, quiero consultar por un robot a medida. La tarea que necesito resolver es: ' },
  { id: 'jar', grupo: 'Robótica', etiqueta: 'Challenge JAR 2026', mensaje: 'Hola, vi que están desarrollando un robot para el Challenge JAR 2026 y quiero saber más.' },
  { id: 'diagnostico', grupo: 'Otros', etiqueta: 'Diagnóstico sin costo', mensaje: 'Hola, quiero agendar el diagnóstico sin costo. Mi negocio es… y lo que quiero resolver es: ' },
  { id: 'proyecto-nuevo', grupo: 'Otros', etiqueta: 'Empezar un proyecto', mensaje: 'Hola, quiero empezar un proyecto con ustedes. La idea es: ' },
  { id: 'presupuesto', grupo: 'Otros', etiqueta: 'Un presupuesto', mensaje: 'Hola, quiero pedir un presupuesto. Lo que necesito es: ' },
  { id: 'otro', grupo: 'Otros', etiqueta: 'Otra consulta', mensaje: 'Hola, quiero hacerles una consulta: ' },
];

export const temaPorId = (id: string) => temas().find((t) => t.id === id);

let pendiente: string | null = null;
export const EVENTO_TEMA = 'tema-consulta';

// El formulario lo lee al aparecer (si venía de otra página) o por el evento (si ya estaba abierto).
export const tomarTemaPendiente = () => {
  const t = pendiente;
  pendiente = null;
  return t;
};

export const consultarPor = (temaId: string) => {
  pendiente = temaId;
  window.dispatchEvent(new CustomEvent(EVENTO_TEMA, { detail: temaId }));
  irA('consulta-directa');
};
