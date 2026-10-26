// Qué equipo se muestra en el visor 3D de /productos cuando se llega desde otro botón
// (por ejemplo "Verlo en 3D" en el inicio). Se guarda acá porque la página puede no estar abierta todavía.
export type Equipo3D = 'golondrina' | 'colibri';
let pendiente: Equipo3D | null = null;
export const EVENTO_EQUIPO_3D = 'ver-equipo-3d';

export const elegirEquipo3D = (equipo: Equipo3D) => {
  pendiente = equipo;
  window.dispatchEvent(new CustomEvent(EVENTO_EQUIPO_3D, { detail: equipo }));
};

export const tomarEquipo3D = () => {
  const e = pendiente;
  pendiente = null;
  return e;
};
