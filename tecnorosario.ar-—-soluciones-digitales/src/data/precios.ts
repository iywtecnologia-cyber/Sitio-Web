// Precios de referencia para el presupuestador.
// Hardware físico cotizado en USD con conversión de referencia en ARS (tipo de cambio ref: ~$1.200/USD).
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
}

export const DISPOSITIVOS_HARDWARE: Precio[] = [
  {
    id: 'dispositivo-tero',
    servicio: 'Dispositivo Físico TERO Security (Hardware Appliance)',
    incluye: 'Compra única del aparato físico (250 USD): Microprocesador criptográfico, 4 puertos Ethernet blindados, almacenamiento flash local y firmware IDS/IPS. Fabricado en filamento Negro Mate industrial de serie.',
    min: 300_000,
    max: 300_000,
    precioUsd: 250,
    tipo: 'hardware',
    badge: 'Dispositivo Físico · 250 USD',
    notaHardware: 'Equipo físico plug & play. No requiere abono obligatorio para operar de forma local autónoma.',
  },
  {
    id: 'dispositivo-golondrina',
    servicio: 'Controlador Físico Golondrina (Hardware Riel DIN)',
    incluye: 'Compra única del aparato físico (190 USD): Controlador para tablero eléctrico en Riel DIN, 8 salidas a relé industrial, bus RS-485 Modbus, entradas 4-20mA y pantalla OLED de diagnóstico. Fabricado en filamento Negro Mate de serie.',
    min: 228_000,
    max: 228_000,
    precioUsd: 190,
    tipo: 'hardware',
    badge: 'Dispositivo Físico · 190 USD',
    notaHardware: 'Equipo físico para montaje en tablero. Funciona de manera local e independiente.',
  },
];

export const SERVICIOS_SOFTWARE: Precio[] = [
  {
    id: 'automatizacion',
    servicio: 'Automatizaciones para tu negocio',
    incluye: 'Un proceso que se hace solo: planillas, avisos automáticos, reportes e integración de sistemas',
    min: 500_000,
    max: 1_000_000,
    tipo: 'software',
  },
  {
    id: 'bots-whatsapp',
    servicio: 'Bot de WhatsApp Empresarial',
    incluye: 'Atención 24/7, toma de pedidos, asignación de turnos y derivación inteligente a operadores humanos',
    min: 600_000,
    max: 850_000,
    tipo: 'software',
  },
  {
    id: 'ciberseguridad',
    servicio: 'Ciberseguridad & Hardening de Software',
    incluye: 'Auditoría integral, blindaje de servidores y base de datos, mitigación de vulnerabilidades e informe pericial',
    min: 500_000,
    max: 1_200_000,
    tipo: 'software',
  },
  {
    id: 'qa-testing',
    servicio: 'QA & Testing Integral de Software',
    incluye: 'Pruebas funcionales E2E, control de regresiones y automatización de tests para asegurar cero fallas',
    min: 450_000,
    max: 950_000,
    tipo: 'software',
  },
  {
    id: 'software',
    servicio: 'Software y Plataforma a Medida',
    incluye: 'Sistema adaptado a tu modelo de negocio: gestión comercial, logística, stock o ERP modular',
    min: 1_000_000,
    max: 2_000_000,
    tipo: 'software',
  },
  {
    id: 'asistentes',
    servicio: 'Asistente para tu Web o Sistema',
    incluye: 'Asistente guiado interactivo para tus clientes (opcional con modelos de IA avanzada)',
    min: 500_000,
    max: 1_200_000,
    tipo: 'software',
  },
  {
    id: 'paginas-web',
    servicio: 'Página Web de Alto Rendimiento',
    incluye: 'Diseño moderno responsivo, formularios conectados, optimización SEO y asistente integrado',
    min: 650_000,
    max: 1_500_000,
    tipo: 'software',
  },
  {
    id: 'robotica-a-medida',
    servicio: 'Robótica a Medida & Simulación ROS 2',
    incluye: 'Diseño mecatrónico personalizado, gemelo digital 3D en Gazebo, cinemática y navegación autónoma',
    min: 1_200_000,
    max: 3_500_000,
    tipo: 'software',
    badge: 'Robótica ROS 2',
  },
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
}

export const ABONOS: Abono[] = [
  {
    id: 'tero',
    nombre: 'Abono Cloud TERO Security (Monitoreo & Reglas Continuas)',
    detalle: 'Servicio mensual opcional para el dispositivo TERO: actualización remota de firmas de amenazas cibernéticas, telemetría centralizada en la nube y alertas de intrusión en tiempo real. (No incluye el aparato físico).',
    mensual: 85_000,
    esServicioParaHardware: true,
  },
  {
    id: 'golondrina',
    nombre: 'Abono Cloud Golondrina (Telemetría IoT & Servidor Remoto)',
    detalle: 'Servicio mensual opcional para el controlador Golondrina: servidor en la nube para acceso remoto desde smartphone/web, registro histórico de sensores y alertas por WhatsApp. (No incluye el aparato físico).',
    mensual: 65_000,
    esServicioParaHardware: true,
  },
  {
    id: 'soporte',
    nombre: 'Abono Soporte y Mantenimiento de Software',
    detalle: 'Monitoreo preventivo de servidores, copias de seguridad automáticas y horas mensuales de evolución técnica.',
    mensual: 150_000,
  },
  {
    id: 'carancho',
    nombre: 'Carancho Robótica Autónoma (Cloud Fleet Manager)',
    detalle: 'Gestor de flotas robóticas autónomas en tiempo real (En fase de I+D).',
    mensual: null,
    proximamente: true,
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
