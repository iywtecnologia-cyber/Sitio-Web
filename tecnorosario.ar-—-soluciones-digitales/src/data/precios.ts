// Precios de referencia (ARS) que usa el presupuestador.
// Se calculan según el dólar oficial y pueden variar: actualizarlos acá.
export interface Precio {
  id: string;
  servicio: string;
  incluye: string;
  min: number;
  max: number;
}

export const PRECIOS: Precio[] = [
  {
    id: 'automatizacion',
    servicio: 'Automatizaciones para tu negocio',
    incluye: 'Un proceso que se hace solo: planillas, avisos, reportes, integraciones',
    min: 500_000,
    max: 1_000_000,
  },
  {
    id: 'bots-whatsapp',
    servicio: 'Bot de WhatsApp',
    incluye: 'Responde y toma pedidos a toda hora, con menú y derivación a una persona',
    min: 600_000,
    max: 850_000,
  },
  {
    id: 'ciberseguridad',
    servicio: 'Ciberseguridad & Hardening',
    incluye: 'Revisión y auditoría de seguridad para tu negocio, blindaje de datos sensibles e informe de mitigación',
    min: 500_000,
    max: 1_200_000,
  },
  {
    id: 'qa-testing',
    servicio: 'QA & Testing de Software',
    incluye: 'Control de calidad integral, pruebas funcionales (E2E) y testing automatizado para asegurar que tu sistema no falle',
    min: 450_000,
    max: 950_000,
  },
  {
    id: 'software',
    servicio: 'Software a medida',
    incluye: 'Sistema pensado para tu rubro: gestión, turnos, stock, ventas',
    min: 1_000_000,
    max: 2_000_000,
  },
  {
    id: 'asistentes',
    servicio: 'Asistente para tu web o sistema',
    incluye: 'Asistente guiado que responde a tus clientes (con inteligencia artificial, desde $1.500.000)',
    min: 500_000,
    max: 1_200_000,
  },
  {
    id: 'paginas-web',
    servicio: 'Página web',
    incluye: 'Página para tu negocio, con formularios conectados, automatizaciones y asistente',
    min: 650_000,
    max: 1_500_000,
  },
  {
    id: 'robotica-a-medida',
    servicio: 'Robótica a medida & Autonomía',
    incluye: 'Desarrollo de prototipos robóticos, simulación física 3D, navegación autónoma y sensores',
    min: 1_200_000,
    max: 3_500_000,
  }
];

// Abonos mensuales (se suman aparte del pago único).
export interface Abono {
  id: string;
  nombre: string;
  detalle: string;
  // null = se ofrece pero el precio todavía no se publica ("A consultar").
  mensual: number | null;
  // true = se muestra como "Próximamente" y no se puede elegir.
  proximamente?: boolean;
}

export const ABONOS: Abono[] = [
  {
    id: 'tero',
    nombre: 'TERO Security',
    detalle: 'Sistema de ciberseguridad',
    mensual: null,
    proximamente: true,
  },
  {
    id: 'golondrina',
    nombre: 'Golondrina Automatización',
    detalle: 'Una nueva forma de automatizar procesos',
    mensual: null,
    proximamente: true,
  },
  {
    id: 'carancho',
    nombre: 'Carancho Robótica Autónoma',
    detalle: 'Robótica autónoma e inteligencia contextual',
    mensual: null,
    proximamente: true,
  },
  {
    id: 'soporte',
    nombre: 'Soporte y mantenimiento mensual',
    detalle: 'ajustes, monitoreo y soporte de lo que armamos',
    mensual: 150_000,
  },
];

export const pesos = (n: number): string =>
  '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
