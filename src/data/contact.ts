// Datos de contacto compartidos por las secciones que abren WhatsApp.
export const WHATSAPP_NUMBERS = ['5493413130336', '5491125079568'];

// Reparte las consultas entre los dos números de ventas.
export const whatsappLink = (message: string): string => {
  const number = WHATSAPP_NUMBERS[Math.floor(Math.random() * WHATSAPP_NUMBERS.length)];
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

// Casillas del dominio (Cloudflare Email Routing las reenvía al Gmail).
// Redes de tecnoros.ar
export const REDES = {
  linkedin: 'https://www.linkedin.com/in/tecnoros-ar-794698445/',
  instagram: 'https://www.instagram.com/tecnoros_ar/',
};

export const VENTAS_EMAIL = 'ventas@tecnoros.ar';
export const SOPORTE_EMAIL = 'soporte@tecnoros.ar';

// Soporte para quienes ya son clientes: va aparte de ventas.
// Por ahora usa los mismos números; si hay un número exclusivo de soporte, va acá.
export const SOPORTE_WHATSAPP = WHATSAPP_NUMBERS[0];
export const soporteWhatsappLink = (mensaje = 'Hola tecnoros.ar, soy cliente y necesito soporte técnico.'): string =>
  `https://wa.me/${SOPORTE_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
// Consultas y presupuestos van a ventas.
export const CONTACT_EMAIL = VENTAS_EMAIL;

// El e-mail abre primero el programa de correo de la persona (mailto:): antes todo iba a Gmail web
// y no le servía a quien usa Outlook, Apple Mail o el correo del celular. Como en una compu sin
// programa de correo el mailto: no hace nada, siempre se ofrece Gmail web al lado como respaldo.
export const mailtoLink = (para: string, asunto: string, cuerpo: string): string =>
  `mailto:${para}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

// Redacción de Gmail web en una pestaña nueva, con asunto y texto cargados.
export const gmailPara = (para: string, asunto: string, cuerpo: string): string =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(para)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

export const gmailLink = (subject: string, body: string): string => gmailPara(CONTACT_EMAIL, subject, body);
export const ventasMailto = (subject: string, body: string): string => mailtoLink(CONTACT_EMAIL, subject, body);
