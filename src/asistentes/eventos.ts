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

/** Cerrar el chat de asistentes (por ejemplo, cuando te lleva a una pantalla completa). */
export const EV_CERRAR = 'cerrar-asistentes';
export const cerrarAsistentes = () => window.dispatchEvent(new CustomEvent(EV_CERRAR));

/** Marcio y el botón de abajo abren/cierran el chat de asistentes ('auto' = el de la página o el menú). */
export const EV_ALTERNAR = 'alternar-asistentes';
export const alternarAsistentes = () => window.dispatchEvent(new CustomEvent(EV_ALTERNAR));
/** El chat de asistentes avisa si está abierto (para esconder a Marcio y cambiar el botón). */
export const EV_ESTADO = 'asistentes-estado';
/** Abrir el chat propio de Marcio (preguntas generales), opcionalmente con una pregunta escrita. */
export const EV_CHAT_MARCIO = 'abrir-chat-marcio';
export const abrirChatMarcio = (pregunta = '') => window.dispatchEvent(new CustomEvent(EV_CHAT_MARCIO, { detail: pregunta }));

/** Abrir la ventana con la información de un servicio. */
export const EV_VER_SERVICIO = 'ver-servicio';
export const verServicio = (id: string) => window.dispatchEvent(new CustomEvent(EV_VER_SERVICIO, { detail: id }));

/** Un asistente dice algo en su chat (y se abre), con botones opcionales. */
export const EV_MENSAJE = 'asistente-mensaje';
export const mensajeDeAsistente = (id: string, texto: string, enlaces: { texto: string; alHacer?: () => void; href?: string }[] = []) =>
  window.dispatchEvent(new CustomEvent(EV_MENSAJE, { detail: { id, texto, enlaces } }));
