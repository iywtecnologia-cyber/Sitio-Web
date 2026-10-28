// Precios de referencia para el presupuestador.
// Precios en pesos argentinos. Solo TERO Security se cotiza en dólares.
// Los abonos mensuales son servicios recurrentes opcionales y NO incluyen el aparato físico.

export interface Precio {
  id: string;
  servicio: string;
  incluye: string;
  min: number;
  max: number;
  precioUsd?: number;
  tipo: 'hardware' | 'software';
  badge?: string;
  notaHardware?: string;
  consultar?: boolean;
}

export const DISPOSITIVOS_HARDWARE: Precio[] = [
  {
    id: 'dispositivo-chaja',
    servicio: 'CHAJÁ Micro-Hub · Edge AI y Ciberseguridad',
    incluye: 'Micro-Hub industrial. Alertas visuales. Voz hablada neuronal opcional por cada equipo, con suscripción separada. Precio del hardware a confirmar en presupuesto formal.',
    min: 0, max: 0, precioUsd: 0, tipo: 'hardware',
    badge: 'Precio del equipo a consultar',
    notaHardware: 'No incluye voz hablada. El precio del hardware se confirma luego del diagnóstico técnico.',
  },
  {
    id: 'dispositivo-tero',
    servicio: 'TERO Security · Próximamente (Hardware Appliance)',
    incluye: 'Producto en investigación y desarrollo. Todavía no disponible para compra o instalación. Consultá por novedades.',
    min: 360_000,
    max: 360_000,
    precioUsd: 300,
    tipo: 'hardware',
    badge: 'Próximamente · No disponible para compra',
    notaHardware: 'TERO Security no está disponible para venta. Las especificaciones y precios son preliminares.',
  },
  {
    id: 'dispositivo-golondrina',
    servicio: 'Controlador Físico Golondrina (Hardware Riel DIN)',
    incluye: 'Compra única del aparato físico ($228.000): Controlador para tablero eléctrico en Riel DIN, 8 salidas a relé industrial, bus RS-485 Modbus, entradas 4-20mA y pantalla OLED de diagnóstico. Fabricado en filamento Negro Mate de serie.',
    min: 228_000,
    max: 228_000,
    precioUsd: 190,
    tipo: 'hardware',
    badge: 'Dispositivo Físico · $228.000',
    notaHardware: 'Equipo físico para montaje en tablero. Funciona de manera local e independiente.',
  },
];

// Mismos servicios y orden que la remera y la web.
// consultar: el precio se pasa después del diagnóstico (todavía no hay rango publicado).
export const SERVICIOS_SOFTWARE: Precio[] = [
  { id: 'diagnostico', servicio: 'Diagnóstico inicial gratuito', incluye: 'Analizamos tu problema y te decimos cómo lo resolveríamos, sin compromiso', min: 0, max: 0, tipo: 'software' },
  { id: 'automatizacion', servicio: 'Automatizaciones', incluye: 'Turnos y reservas, consultas comerciales, tareas administrativas, integración de sistemas y asistentes web', min: 500_000, max: 1_000_000, tipo: 'software' },
  { id: 'ciberseguridad', servicio: 'Ciberseguridad', incluye: 'Revisamos tus sistemas y equipos, cerramos los puntos débiles y te damos un informe', min: 500_000, max: 1_200_000, tipo: 'software' },
  { id: 'ecommerce', servicio: 'E-commerce', incluye: 'Tu tienda online con catálogo, carrito y cobros, conectada con tu stock', min: 650_000, max: 1_500_000, tipo: 'software' },
  { id: 'aplicaciones-moviles', servicio: 'Aplicaciones móviles', incluye: 'Una app a medida de tu negocio para tus clientes o tu equipo', min: 0, max: 0, consultar: true, tipo: 'software' },
  { id: 'crm', servicio: 'CRM', incluye: 'Tus clientes, ventas y seguimientos en un solo lugar', min: 1_000_000, max: 2_000_000, tipo: 'software' },
  { id: 'bots-whatsapp', servicio: 'Bots de WhatsApp', incluye: 'Tu WhatsApp responde solo: pedidos, turnos y consultas, y te pasa a una persona cuando hace falta', min: 600_000, max: 850_000, tipo: 'software' },
  { id: 'asistentes', servicio: 'Asistentes ilustrados y animados', incluye: 'Un personaje dibujado y animado para tu web que guía a tus clientes', min: 500_000, max: 1_200_000, tipo: 'software' },
  { id: 'robotica-a-medida', servicio: 'Robótica a medida', incluye: 'Robots de tamaño chico: primero el cerebro y la simulación 3D; el cuerpo físico, si es viable', min: 1_200_000, max: 3_500_000, tipo: 'software', badge: 'Robots chicos' },
  { id: 'campanas-ads', servicio: 'Campañas en Meta y Google Ads', incluye: 'Campañas en Instagram, Facebook y Google, con informes de resultados', min: 0, max: 0, consultar: true, tipo: 'software' },
  { id: 'estrategia-marca', servicio: 'Estrategia y análisis de marca', incluye: 'Análisis de tu marca y un plan para redes, web y campañas', min: 0, max: 0, consultar: true, tipo: 'software' },
  { id: 'identidad-marca', servicio: 'Identidad de marca', incluye: 'Logo, colores, tipografías y manual de marca', min: 0, max: 0, consultar: true, tipo: 'software' },
];

// Lista completa combinada para compatibilidad
export const PRECIOS: Precio[] = [
  ...DISPOSITIVOS_HARDWARE,
  ...SERVICIOS_SOFTWARE,
];

// Abonos mensuales (servicios recurrentes en la nube / soporte opcionales).
// Se aclara explícitamente que son suscripciones de servicio y NO son los aparatos físicos.
export interface Abono {
  id: string;
  nombre: string;
  detalle: string;
  mensual: number | null;
  proximamente?: boolean;
  esServicioParaHardware?: boolean;
  mensualUsd?: number;
}

export const ABONOS: Abono[] = [
  {
    id: 'tero',
    nombre: 'TERO Security (Ciberseguridad IDS/IPS & Reglas Continuas)',
    detalle: 'Ciberseguridad para la red de tu empresa. (Próximamente).',
    mensual: 300_000,
    mensualUsd: 250,
    proximamente: true,
    esServicioParaHardware: true,
  },
  {
    id: 'golondrina',
    nombre: 'Golondrina Automatización • Software Cloud & Alertas Contextuales',
    detalle: 'Monitoreo en la nube y avisos por WhatsApp de lo que pasa en tu planta.',
    mensual: 80_000,
    esServicioParaHardware: true,
  },
  {
    id: 'soporte',
    nombre: 'Abono Soporte y Mantenimiento de Software',
    detalle: 'Copias de seguridad, monitoreo y horas para mejoras.',
    mensual: 150_000,
  },
  {
    id: 'carancho',
    nombre: 'Robótica a medida (robots de tamaño chico)',
    detalle: 'Desarrollamos el cerebro del robot y lo probás en 3D. Si es viable, cotizamos aparte la fabricación del cuerpo físico.',
    mensual: null,
  },
];

export const pesos = (n: number): string =>
  '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });

export const dolares = (n: number): string =>
  'USD ' + n.toLocaleString('en-US');

// Opcional de filamento que SOLO se muestra si se selecciona al menos un dispositivo físico (TERO o Golondrina)
export interface OpcionFilamento {
  id: string;
  servicio: string;
  incluye: string;
  min: number;
  max: number;
  usd: number;
}

export const OPCION_FILAMENTO_HARDWARE: OpcionFilamento = {
  id: 'filamento-personalizado',
  servicio: 'Color de Filamento Personalizado para la Carcasa',
  incluye: 'Bobina técnica dedicada (PETG / ABS industrial) en el color exacto de tu identidad de marca. De serie se entregan en Negro Mate industrial sin cargo extra.',
  min: 22_000,
  max: 28_000,
  usd: 18,
};
