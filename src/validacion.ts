// Validación compartida por los formularios que abren WhatsApp o el correo.
// Ninguno pasa por el navegador (los botones de WhatsApp no son submit), así que la regla
// tiene que ser propia y la misma para todos los botones: antes "e-mail" validaba y
// "WhatsApp" no, y se abría el canal con el mensaje vacío.

// No pretende ser RFC 5322: alcanza con frenar los errores de tipeo típicos ("juan@gmail", "juan.gmail.com").
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailValido = (email: string) => PATRON_EMAIL.test(email.trim());

export const MENSAJE_EMAIL_INVALIDO = 'Ingresá un e-mail válido, por ejemplo nombre@negocio.com.';

// Lleva el foco al primer campo con error para que quien usa teclado o lector de pantalla
// sepa qué corregir, y lo centra por si quedó tapado.
export const enfocarPrimero = (ids: string[]) => {
  const el = ids.map((id) => document.getElementById(id)).find(Boolean);
  if (!el) return;
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// ─── Validaciones de los formularios (contacto, arrepentimiento y baja) ─────────────────────

/** Nombre o negocio: palabras o frases; se permiten números (ej. «Kiosco 24»), pero no caracteres raros. */
export const limpiarNombre = (v: string) => v.replace(/[^\p{L}\p{N} .,'&/-]/gu, '');
export const nombreValido = (v: string) => /\p{L}/u.test(v) && /^[\p{L}\p{N}][\p{L}\p{N} .,'&/-]*$/u.test(v.trim());
export const MENSAJE_NOMBRE_INVALIDO = 'Escribí tu nombre o el de tu negocio con palabras (podés sumar números).';

/** Comentarios: solo palabras y signos de puntuación comunes (sin números ni caracteres raros). */
export const limpiarComentario = (v: string) => v.replace(/[^\p{L} .,;:¡!¿?()'"\n-]/gu, '');

/** Teléfono: nacional (10 dígitos, con código de área sin 0 ni 15) o internacional (+ y de 8 a 15 dígitos). */
export type TipoTelefono = 'nacional' | 'internacional';
export const limpiarTelefono = (v: string, tipo: TipoTelefono) =>
  tipo === 'internacional' ? v.replace(/[^\d +-]/g, '').replace(/(?!^)\+/g, '') : v.replace(/[^\d -]/g, '');
export const telefonoValido = (v: string, tipo: TipoTelefono) => {
  const digitos = v.replace(/\D/g, '');
  return tipo === 'internacional' ? v.trim().startsWith('+') && digitos.length >= 8 && digitos.length <= 15 : digitos.length === 10;
};
export const MENSAJE_TELEFONO = (tipo: TipoTelefono) =>
  tipo === 'internacional' ? 'Ingresá el número con + y código de país, por ejemplo +34 600 123 456.' : 'Ingresá 10 números: código de área sin 0 y el número sin 15, por ejemplo 341 313 0336.';

/** E-mail o celular (el formulario de contacto acepta cualquiera de los dos). */
export const contactoValido = (v: string) => {
  const t = v.trim();
  if (t.includes('@')) return emailValido(t);
  const digitos = t.replace(/\D/g, '');
  return /^[+\d][\d\s()-]*$/.test(t) && digitos.length >= 8 && digitos.length <= 15;
};
export const MENSAJE_CONTACTO_INVALIDO = 'Dejanos un e-mail válido (nombre@negocio.com) o tu celular (solo números).';

/** Fecha (AAAA-MM-DD) que no sea posterior a hoy. */
export const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const fechaNoFutura = (v: string) => !v || v <= hoyISO();
