// Combos de servicios con precio "desde". Los precios salen de sumar el mínimo de cada
// servicio (src/data/precios.ts) y aplicar un descuento por contratarlos juntos.
// El precio final se confirma en el diagnóstico inicial gratuito, igual que el resto de los servicios.

export interface Combo {
  id: string;
  nombre: string;
  para: string; // para quién es, en una línea
  /** El empujón: para que el cliente se vea en la situación ("Si buscás…", "Si querés…", "Si necesitás…"). */
  siTe: string;
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
    siTe: 'Si querés vender también mientras dormís y dejar de contestar los mismos mensajes todo el día, este es para vos.',
    incluye: ['Diagnóstico inicial gratuito', 'E-commerce', 'Bot de WhatsApp'],
    separado: 1_250_000,
    desde: 1_050_000,
  },
  {
    id: 'negocio-automatico',
    nombre: 'Negocio en automático',
    para: 'Para dejar de hacer a mano lo de todos los días.',
    siTe: 'Si necesitás recuperar horas de tu semana porque cargás turnos, pedidos o planillas a mano, empezá por acá.',
    incluye: ['Diagnóstico inicial gratuito', 'Automatizaciones', 'Bot de WhatsApp'],
    // Automatizaciones 500.000 + Bot de WhatsApp 600.000 (mínimos de precios.ts)
    separado: 1_100_000,
    desde: 935_000,
    destacado: true,
  },
  {
    id: 'sistema-seguro',
    nombre: 'Clientes en orden y seguros',
    para: 'Todos tus clientes en un CRM, protegido desde el día uno.',
    siTe: 'Si buscás tener a tus clientes ordenados y dormir tranquilo sabiendo que esos datos están protegidos, es este.',
    incluye: ['Diagnóstico inicial gratuito', 'CRM', 'Ciberseguridad'],
    separado: 1_500_000,
    desde: 1_250_000,
  },
  {
    id: 'planta-conectada',
    nombre: 'Planta conectada',
    para: 'Golondrina, y si querés, con los sensores de hardware instalados: te enterás por WhatsApp si algo falla en tu planta.',
    siTe: 'Si necesitás enterarte apenas una máquina falla, aunque no estés en la planta, este combo te avisa al toque.',
    incluye: ['Diagnóstico inicial gratuito', 'Equipo Golondrina (automatización de avisos)', 'CHAJÁ (cuida tu red y tus equipos)', 'Puesta en marcha e instalación de sensores', 'Automatizaciones', 'Bot de WhatsApp para los avisos'],
    // Golondrina 228.000 + CHAJÁ 280.000 + puesta en marcha 300.000 + Automatizaciones 500.000 + Bot de WhatsApp 600.000.
    // Es el combo más completo (y el más caro).
    separado: 1_908_000,
    desde: 1_600_000,
    mensual: 'Abono de Golondrina aparte: desde $80.000 por mes',
  },
];

export const ahorro = (c: Combo) => Math.round(((c.separado - c.desde) / c.separado) * 100);
