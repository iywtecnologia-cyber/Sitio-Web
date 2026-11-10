// Validación compartida por los formularios que abren WhatsApp o el correo.
// Ninguno pasa por el navegador (los botones de WhatsApp no son submit), así que la regla
// tiene que ser propia y la misma para todos los botones: antes "E-mail" validaba y
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
