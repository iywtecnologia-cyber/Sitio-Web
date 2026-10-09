// Datos de contacto compartidos por las secciones que abren WhatsApp.
export const WHATSAPP_NUMBERS = ['5493413130336', '5491125079568'];

// Reparte las consultas entre los dos números de ventas.
export const whatsappLink = (message: string): string => {
  const number = WHATSAPP_NUMBERS[Math.floor(Math.random() * WHATSAPP_NUMBERS.length)];
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
