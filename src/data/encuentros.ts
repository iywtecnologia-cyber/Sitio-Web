// Fotos de la sección "Encuentros": cómo empezamos, el equipo y las jornadas a las que vamos.
//
// Para sumar una foto:
//  1. Guardarla en public/encuentros/ (mejor en .webp o .jpg, de unos 1600 px de ancho como mucho).
//  2. Agregar una línea acá abajo. La más nueva puede ir primero.
//
// Importante: solo fotos con permiso de las personas que aparecen.

export type TipoEncuentro = 'comienzos' | 'equipo' | 'jornadas';

export interface FotoEncuentro {
  /** Ruta dentro de public/, por ejemplo '/encuentros/suramericanos-2026.webp'. */
  src: string;
  /** Qué se ve, para quien no puede ver la imagen. */
  alt: string;
  titulo: string;
  tipo: TipoEncuentro;
  /** Fecha en formato AAAA-MM-DD o solo AAAA-MM. Opcional. */
  fecha?: string;
  lugar?: string;
}

export const TIPOS_ENCUENTRO: { id: TipoEncuentro; nombre: string }[] = [
  { id: 'comienzos', nombre: 'Comienzos' },
  { id: 'equipo', nombre: 'Equipo' },
  { id: 'jornadas', nombre: 'Jornadas y eventos' },
];

export const FOTOS_ENCUENTROS: FotoEncuentro[] = [
  // Ejemplo:
  // {
  //   src: '/encuentros/suramericanos-2026.webp',
  //   alt: 'Manuel y Sofía con la remera de voluntarios en los Juegos Suramericanos',
  //   titulo: 'Donde nos conocimos',
  //   tipo: 'comienzos',
  //   fecha: '2026-09',
  //   lugar: 'Rosario',
  // },
     {
    src: '/public/assets/equipo.webp',
    alt: 'Los fundadores de tecnoros.ar junto a Capibara, la mascota donde todo empezó',
    titulo: 'Los fundadores con capibara, quien fue la mascota protagonista donde todo esto se origino',
    tipo: 'comienzos',
    },
  {
    src: '/public/assets/manu.webp',
    alt: 'Voluntarios de tecnoros.ar en los Juegos Suramericanos',
    titulo: 'Voluntariado - XIII Juegos Suramericanos',
    tipo: 'jornadas',
    lugar: 'Rosario, Santa Fe · 12 al 26 de septiembre de 2026',
  },
  {
    src: '/public/assets/sofi.jpg',
    alt: 'Equipo de tecnoros.ar en el Foro Rosario Emprende 2026',
    titulo: 'Foro Rosario Emprende 2026',
    tipo: 'jornadas',
    fecha: '2026-10-27',
    lugar: 'Terminal Fluvial de Rosario, Santa Fe',
  },
   {
    src: '/public/assets/challenge.webp',
    alt: 'Equipo de tecnoros.ar en el Challenge JAR 2026',
    titulo: 'Challenge JAR 2026 · organizado por AIR Club UdeSa',
    tipo: 'jornadas',
    fecha: '2026-11-05',
    lugar: 'Rosario',
  },

  {
    src: '/public/assets/trabajo.webp',
    alt: 'El equipo de tecnoros.ar trabajando juntos durante una jornada',
    titulo: 'Un día trabajando juntos',
    tipo: 'equipo',
  },
  
];

