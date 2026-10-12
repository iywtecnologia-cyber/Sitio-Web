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
    min: 350_000,
    max: 500_000,
  },
  {
    id: 'asistentes',
    servicio: 'Asistente para tu web o sistema',
    incluye: 'Asistente guiado que responde a tus clientes, por escrito o hablándole (con inteligencia artificial se cotiza aparte)',
    min: 450_000,
    max: 600_000,
  },
  {
    id: 'bots-whatsapp',
    servicio: 'Bot de WhatsApp',
    incluye: 'Responde y toma pedidos a toda hora, con menú y derivación a una persona',
    min: 250_000,
    max: 600_000,
  },
  {
    id: 'paginas-web',
    servicio: 'Página web',
    incluye: 'Página para tu negocio, con formularios conectados, automatizaciones y asistente',
    min: 650_000,
    max: 900_000,
  },
  {
    id: 'ciberseguridad',
    servicio: 'Ciberseguridad',
    incluye: 'Revisión de seguridad de tu negocio con informe y recomendaciones',
    min: 500_000,
    max: 1_200_000,
  },
  {
    id: 'software',
    servicio: 'Software a medida',
    incluye: 'Sistema pensado para tu rubro: gestión, turnos, stock, ventas',
    min: 2_500_000,
    max: 4_000_000,
  },
  {
    id: 'calandria-modulo',
    servicio: 'Calandria como módulo',
    incluye: 'Sumamos Calandria a un sistema que ya tenés: la C, propuestas con un botón, registro sellado y asistente',
    min: 350_000,
    max: 600_000,
  },
  {
    id: 'calandria-sistema',
    servicio: 'Calandria como sistema nuevo',
    incluye: 'Sistema completo para tu rubro con Calandria adentro, en la compu y el celular, listo para usar',
    min: 900_000,
    max: 1_500_000,
  },
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
    detalle: 'nuestro software de ciberseguridad: revisa y vigila tu negocio, con avisos e informes',
    mensual: null,
    proximamente: true,
  },
  {
    id: 'calandria-modulo',
    nombre: 'Calandria (módulo)',
    detalle: 'registro sellado, ajustes de las propuestas y soporte',
    mensual: 30_000,
  },
  {
    id: 'calandria-sistema',
    nombre: 'Calandria (sistema)',
    detalle: 'servidor, base de datos, actualizaciones y soporte',
    mensual: 50_000,
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
