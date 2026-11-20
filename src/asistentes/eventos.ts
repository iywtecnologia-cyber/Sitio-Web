// Señales entre el chat, el escenario 3D y el lanzador: así los asistentes reaccionan en todos lados
// (hacen un gesto, dicen algo en un globito) y queda registro de lo que hicieron.

export const EVENTO_ABRIR_ASISTENTE = 'abrir-asistente';
export const abrirAsistente = (id: string) => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_ASISTENTE, { detail: id }));

export type Gesto = 'salto' | 'vuelta' | 'saludo';

export const EV_GESTO = 'asistente-gesto';
export const EV_DICE = 'asistente-dice';
export const EV_HIZO = 'asistente-hizo';

export const gesto = (id: string, tipo: Gesto = 'salto') => window.dispatchEvent(new CustomEvent(EV_GESTO, { detail: { id, tipo } }));
export const dice = (id: string, texto: string) => window.dispatchEvent(new CustomEvent(EV_DICE, { detail: { id, texto } }));

export interface Hecho {
  id: string;
  texto: string;
  hora: string;
}

/** Lo que hicieron los asistentes en esta visita (el escenario lo muestra como lista). */
export const hechos: Hecho[] = [];
export const registrarHecho = (id: string, texto: string) => {
  const d = new Date();
  hechos.unshift({ id, texto, hora: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
  hechos.splice(12);
  window.dispatchEvent(new CustomEvent(EV_HIZO));
};
