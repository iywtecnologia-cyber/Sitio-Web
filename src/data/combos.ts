// Combos de servicios con precio "desde". Los precios salen de sumar el mínimo de cada
// servicio (src/data/precios.ts) y aplicar un descuento por contratarlos juntos.
// El precio final se confirma en el diagnóstico gratuito, igual que el resto de los servicios.

export interface Combo {
  id: string;
  nombre: string;
  para: string; // para quién es, en una línea
  incluye: string[];
  separado: number; // suma de los mínimos de cada servicio por separado
  desde: number; // precio del combo
  mensual?: string; // abono aparte, si corresponde
  destacado?: boolean;
}

export const COMBOS: Combo[] = [
  {
    id: 'arranque-digital',
    nombre: 'Vendé online',
    para: 'Tu tienda abierta las 24 horas y un WhatsApp que responde solo.',
    incluye: ['Diagnóstico gratuito', 'E-commerce', 'Bot de WhatsApp'],
    separado: 1_250_000,
    desde: 1_050_000,
  },
  {
    id: 'negocio-automatico',
    nombre: 'Negocio en automático',
    para: 'Para dejar de hacer a mano lo de todos los días.',
    incluye: ['Diagnóstico gratuito', 'Automatizaciones', 'Bot de WhatsApp', 'Asistente animado'],
    separado: 1_600_000,
    desde: 1_350_000,
    destacado: true,
  },
  {
    id: 'sistema-seguro',
    nombre: 'Clientes en orden y seguros',
    para: 'Todos tus clientes en un CRM, protegido desde el día uno.',
    incluye: ['Diagnóstico gratuito', 'CRM', 'Ciberseguridad'],
    separado: 1_500_000,
    desde: 1_250_000,
  },
  {
    id: 'planta-conectada',
    nombre: 'Planta conectada',
    para: 'Para enterarte por WhatsApp si algo falla en tu planta.',
    incluye: ['Diagnóstico gratuito', 'Equipo Golondrina', 'Puesta en marcha', 'Automatización de avisos'],
    separado: 1_028_000,
    desde: 870_000,
    mensual: 'Abono de Golondrina aparte: desde $80.000 por mes',
  },
];

export const ahorro = (c: Combo) => Math.round(((c.separado - c.desde) / c.separado) * 100);
