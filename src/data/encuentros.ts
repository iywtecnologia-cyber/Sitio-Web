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
];
