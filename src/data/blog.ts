// Notas del blog: cortas, prácticas y en lenguaje simple.
export interface Nota {
  id: string;
  titulo: string;
  resumen: string;
  fecha: string; // AAAA-MM-DD
  tema: string;
  parrafos: string[];
  puntos?: string[];
}

export const NOTAS: Nota[] = [
  {
    id: 'tareas-para-automatizar',
    titulo: '5 tareas de tu negocio que podés automatizar hoy',
    resumen: 'Las tareas repetidas son las primeras que conviene dejar de hacer a mano.',
    fecha: '2026-10-27',
    tema: 'Automatizaciones',
    parrafos: [
      'Si algo lo hacés igual todos los días, probablemente se pueda hacer solo. Estas son las cinco tareas que más tiempo ahorran:',
    ],
    puntos: [
      'Recordatorios de turnos y reservas por WhatsApp o e-mail.',
      'Respuestas a las preguntas de siempre: horarios, precios, dónde están.',
      'Pasar los datos de un formulario a tu planilla o sistema, sin copiar y pegar.',
      'Armar reportes de ventas o de stock que hoy hacés a mano.',
      'Hacer seguimiento de presupuestos que mandaste y nadie respondió.',
    ],
  },
  {
    id: 'cuidar-whatsapp-y-cuentas',
    titulo: 'Cómo cuidar el WhatsApp y las cuentas de tu negocio',
    resumen: 'Cinco pasos simples para que nadie se quede con tus cuentas.',
    fecha: '2026-10-27',
    tema: 'Ciberseguridad',
    parrafos: [
      'La mayoría de los robos de cuentas pasan por descuidos chicos. Con estos pasos cerrás las puertas más comunes:',
    ],
    puntos: [
      'Activá la verificación en dos pasos en WhatsApp, el mail y las redes.',
      'Usá una contraseña distinta para cada cuenta (un gestor de contraseñas ayuda).',
      'Nunca compartas los códigos que te llegan por SMS o WhatsApp, aunque te los pida "el banco".',
      'Revisá cada tanto los dispositivos vinculados y cerrá los que no reconozcas.',
      'Hacé copias de seguridad de tus chats y de tus datos importantes.',
    ],
  },
  {
    id: 'que-es-un-crm',
    titulo: '¿Qué es un CRM y cuándo lo necesitás?',
    resumen: 'Un lugar para tener a todos tus clientes en orden.',
    fecha: '2026-10-27',
    tema: 'CRM',
    parrafos: [
      'Un CRM es un sistema donde guardás todo lo de cada cliente: sus datos, lo que te consultó, lo que compró y qué quedó pendiente.',
      'Te conviene tener uno si te pasa alguna de estas cosas:',
    ],
    puntos: [
      'Se te olvida responder o volver a llamar a alguien.',
      'La información de los clientes está repartida entre WhatsApp, planillas y papeles.',
      'Más de una persona atiende y no saben qué le dijo el otro al cliente.',
    ],
  },
];
