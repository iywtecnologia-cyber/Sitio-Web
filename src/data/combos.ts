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
    nombre: 'Arranque digital',
    para: 'Para que te encuentren y te respondan al instante.',
    incluye: ['Página web', 'Bot de WhatsApp', 'Diagnóstico gratuito'],
    separado: 1_250_000,
    desde: 1_050_000,
  },
  {
    id: 'negocio-automatico',
    nombre: 'Negocio en automático',
    para: 'Para dejar de hacer a mano lo de todos los días.',
    incluye: ['Automatización', 'Bot de WhatsApp', 'Asistente para tu web o sistema', 'Diagnóstico gratuito'],
    separado: 1_600_000,
    desde: 1_350_000,
    destacado: true,
  },
  {
    id: 'sistema-seguro',
    nombre: 'Sistema propio y seguro',
    para: 'Tu sistema a medida, revisado contra ataques desde el día uno.',
    incluye: ['Software a medida', 'Ciberseguridad', 'Diagnóstico gratuito'],
    separado: 1_500_000,
    desde: 1_250_000,
  },
  {
    id: 'planta-conectada',
    nombre: 'Planta conectada',
    para: 'Para enterarte por WhatsApp si algo falla en tu planta.',
    incluye: ['Equipo Golondrina (hardware)', 'Puesta en marcha', 'Automatización de avisos', 'Diagnóstico gratuito'],
    separado: 848_000,
    desde: 720_000,
    mensual: 'Abono de Golondrina aparte: desde $80.000 por mes',
  },
];

export const ahorro = (c: Combo) => Math.round(((c.separado - c.desde) / c.separado) * 100);
