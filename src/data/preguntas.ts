// Preguntas frecuentes. Solo cosas que ya están dichas en la web, el contrato o la política de privacidad.
export interface Pregunta {
  p: string;
  r: string;
}

export const PREGUNTAS: Pregunta[] = [
  {
    p: '¿Cuánto cuesta?',
    r: 'Depende de lo que necesites. En la página Presupuesto ves los precios de referencia de cada servicio y los combos. El precio final te lo damos por escrito después del diagnóstico gratuito.',
  },
  {
    p: '¿El diagnóstico tiene costo?',
    r: 'No. Nos contás tu problema, lo analizamos y te decimos cómo lo resolveríamos, sin compromiso.',
  },
  {
    p: '¿Puedo ver cómo va a quedar antes de pagar todo?',
    r: 'Sí. Primero armamos un prototipo y no avanzamos con el desarrollo hasta que lo apruebes vos.',
  },
  {
    p: '¿Cuánto tarda?',
    r: 'Depende del proyecto. En el diagnóstico te damos un plazo estimado para tu caso.',
  },
  {
    p: '¿Necesito saber de tecnología?',
    r: 'No. Te explicamos todo en simple y lo dejamos andando. Vos solo nos contás cómo trabajás.',
  },
  {
    p: '¿Qué pasa después de la entrega?',
    r: 'Te podés quedar con un abono de soporte y mantenimiento: copias de seguridad, monitoreo y horas para mejoras. Es opcional.',
  },
  {
    p: '¿Los abonos mensuales incluyen el equipo físico?',
    r: 'No. Los equipos (como el controlador Golondrina) se compran una vez. El abono es el servicio: la nube, los avisos y el soporte.',
  },
  {
    p: '¿Mis datos están seguros?',
    r: 'Sí. Somos un equipo de ciberseguridad y cuidamos tus datos según la Ley 25.326 de Protección de Datos Personales. Los detalles están en la política de privacidad.',
  },
  {
    p: '¿Las demos de la web se conectan a máquinas reales?',
    r: 'No. Son simulaciones para que veas cómo funciona. Una instalación real necesita una evaluación técnica y de seguridad antes.',
  },
  {
    p: '¿Trabajan solo en Rosario?',
    r: 'Somos de Rosario. Mucho del trabajo se puede hacer a distancia; consultanos por tu ciudad.',
  },
  {
    p: '¿Puedo arrepentirme de una contratación?',
    r: 'Sí. Tenés el botón de arrepentimiento al pie de cada página. Las condiciones están en el contrato de servicios.',
  },
];
