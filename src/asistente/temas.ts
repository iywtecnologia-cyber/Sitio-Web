// Base de conocimiento del asistente (Marcio).
// Separada del componente para poder probarla y para que el día que entre la IA
// sea el mismo catálogo el que le pasemos como contexto.
//
// Cada tema tiene patrones con peso: cuanto más específica es la palabra, más pesa.
//  - exacto:  la palabra tiene que ser una palabra entera del mensaje.
//             Se usa para las cortas y ambiguas ('ia', 'app', 'web', 'bot'),
//             porque como pedazo de texto aparecen dentro de otras ('d-ia-gnóstico').
//  - prefijo: alcanza con que una palabra del mensaje empiece así
//             ('automatiz' cubre automatizar, automatización, automatizado…).
//  - frase:   varias palabras seguidas ('vender online', 'página web').

export type TipoPatron = 'exacto' | 'prefijo' | 'frase';

export interface Patron {
  tipo: TipoPatron;
  valor: string;
  peso: number;
}

export const ex = (valor: string, peso = 3): Patron => ({ tipo: 'exacto', valor, peso });
export const pre = (valor: string, peso = 3): Patron => ({ tipo: 'prefijo', valor, peso });
export const fr = (valor: string, peso = 4): Patron => ({ tipo: 'frase', valor, peso });

export interface Tema {
  id: string;
  /** Texto del botón en la grilla de opciones. */
  boton: string;
  /** Si es false no aparece en la grilla, pero sigue siendo matcheable al escribir. */
  enGrilla?: boolean;
  patrones: Patron[];
  respuesta: string;
  /** Id de un elemento de la web para el botón "Ver en la web". */
  seccion?: string;
  /** Mensaje con el que se abre WhatsApp / el e-mail. */
  whatsapp: string;
  /** Id en SERVICIOS_SOFTWARE, para poder contestar el precio de este tema. */
  precioId?: string;
  /** Temas relacionados que se ofrecen como chips después de responder. */
  relacionados?: string[];
}

export const TEMAS: Tema[] = [
  {
    id: 'automatizacion',
    boton: 'Automatizaciones',
    enGrilla: true,
    patrones: [
      pre('automatiz', 4), fr('tareas repetitivas', 4), fr('carga de datos', 4),
      fr('a mano', 3), fr('copiar y pegar', 4), fr('todos los dias lo mismo', 4),
      pre('planilla', 3), ex('excel', 3), ex('n8n', 4), ex('zapier', 4), ex('make', 2),
      pre('integra', 2), pre('sincroniz', 3), pre('recordatorio', 2), pre('reporte', 2),
      pre('factur', 2), pre('remito', 3), pre('stock', 2), pre('inventario', 2),
      pre('repetitiv', 3), ex('proceso', 2), ex('procesos', 2), ex('tarea', 1), ex('tareas', 1),
    ],
    respuesta:
      'Conectamos tus planillas, sistemas y procesos para que las tareas repetitivas se hagan solas: datos que se cargan solos, recordatorios automáticos y reportes sin armarlos a mano.',
    seccion: 'servicio-automatizacion',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por automatizaciones para mi negocio.',
    precioId: 'automatizacion',
    relacionados: ['bots', 'crm', 'precio'],
  },
  {
    id: 'bots',
    boton: 'Bots de WhatsApp',
    enGrilla: true,
    patrones: [
      ex('bot', 4), ex('bots', 4), pre('chatbot', 4), pre('whatsapp', 4), ex('wpp', 4),
      pre('whats', 3), fr('responder mensajes', 4), fr('tomar pedidos', 4),
      fr('atencion al cliente', 3), fr('fuera de horario', 3), fr('las 24 horas', 3),
      pre('mensaj', 1), pre('pedido', 2), pre('respond', 2), pre('atencion', 1),
      pre('turno', 2), pre('reserva', 2), pre('consulta', 1),
    ],
    respuesta:
      'Armamos bots de WhatsApp que responden las consultas de siempre, toman pedidos y turnos a toda hora, y te pasan el chat a una persona cuando hace falta.',
    seccion: 'servicio-bots-whatsapp',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por un bot de WhatsApp.',
    precioId: 'bots-whatsapp',
    relacionados: ['automatizacion', 'crm', 'precio'],
  },
  {
    id: 'ciberseguridad',
    boton: 'Ciberseguridad',
    enGrilla: true,
    patrones: [
      pre('ciberseg', 5), pre('segur', 3), ex('ciber', 4), pre('hacke', 4), pre('vulnerab', 4),
      pre('ransom', 5), pre('phishing', 5), ex('virus', 3), pre('malware', 4),
      fr('me entraron', 4), fr('robo de datos', 4), fr('perdi informacion', 4),
      fr('copia de seguridad', 4), ex('backup', 3), pre('backups', 3),
      pre('contrasena', 3), pre('clave', 2), pre('proteg', 2), pre('riesgo', 2),
      pre('auditor', 3), pre('pentest', 5), pre('firewall', 4), ex('datos', 1),
      ex('tero', 4),
    ],
    respuesta:
      'Revisamos tus sistemas y equipos, te decimos qué riesgos tienen con un informe claro, ordenamos quién accede a qué y protegemos los datos de tu negocio y de tus clientes.',
    seccion: 'servicio-ciberseguridad',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por ciberseguridad para mi negocio.',
    precioId: 'ciberseguridad',
    relacionados: ['productos', 'diagnostico', 'precio'],
  },
  {
    id: 'ecommerce',
    boton: 'Tienda online',
    enGrilla: true,
    patrones: [
      pre('ecommerce', 5), fr('e commerce', 5), pre('tienda', 4), fr('vender online', 5),
      fr('venta online', 5), fr('ventas online', 5), fr('vender por internet', 5),
      pre('carrito', 4), pre('catalogo', 3), ex('shop', 3), pre('checkout', 4),
      pre('mercadopago', 4), fr('medios de pago', 4), fr('cobrar con tarjeta', 4),
      pre('tiendanube', 4), pre('shopify', 4), pre('woocommerce', 4), pre('envio', 2),
    ],
    respuesta:
      'Armamos tu tienda online: catálogo, carrito y cobros, conectada con tu stock y con tu WhatsApp para que no se te pase ningún pedido.',
    seccion: 'servicio-ecommerce',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por una tienda online.',
    precioId: 'ecommerce',
    relacionados: ['web', 'marketing', 'precio'],
  },
  {
    id: 'web',
    boton: 'Página web',
    enGrilla: true,
    patrones: [
      fr('pagina web', 5), fr('paginas web', 5), fr('sitio web', 5), fr('pagina de internet', 5),
      pre('landing', 5), fr('una web', 4), ex('web', 2), ex('website', 4),
      fr('presencia online', 4), fr('no tengo web', 5), fr('renovar la web', 5),
      fr('rediseno', 4), pre('wordpress', 3), ex('dominio', 3), pre('hosting', 3),
      ex('seo', 3), pre('posicionamiento', 3),
    ],
    respuesta:
      'Hacemos tu web desde cero: una página rápida, que se ve bien en el celular, pensada para que te encuentren en Google y para que el visitante termine escribiéndote. Si además querés vender, se arma como tienda online.',
    seccion: 'servicio-paginas-web',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por una página web para mi negocio.',
    precioId: 'ecommerce',
    relacionados: ['ecommerce', 'marketing', 'identidad'],
  },
  {
    id: 'apps',
    boton: 'Aplicación móvil',
    enGrilla: true,
    patrones: [
      ex('app', 4), ex('apps', 4), pre('aplicacion', 4), fr('app movil', 5),
      fr('aplicacion movil', 5), fr('para el celular', 4), ex('android', 4), ex('ios', 4),
      pre('iphone', 3), pre('celular', 2), ex('movil', 2), pre('playstore', 4),
      fr('play store', 4), fr('app store', 4),
    ],
    respuesta:
      'Hacemos aplicaciones móviles a medida de tu negocio, para Android y iPhone: para tus clientes o para tu propio equipo en la calle.',
    seccion: 'servicio-aplicaciones-moviles',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por una aplicación móvil.',
    precioId: 'aplicaciones-moviles',
    relacionados: ['crm', 'web', 'precio'],
  },
  {
    id: 'crm',
    boton: 'CRM y clientes',
    enGrilla: true,
    patrones: [
      // "mis clientes" aparece en cualquier frase de cualquier rubro: pesa poco a propósito.
      ex('crm', 5), fr('base de clientes', 4), fr('mis clientes', 2), fr('seguimiento de clientes', 5),
      fr('cartera de clientes', 5), fr('historial del cliente', 5), fr('no se a quien', 4),
      pre('seguimiento', 3), pre('agenda', 2), pre('turno', 2), pre('ficha', 2),
      pre('cliente', 1), pre('vendedor', 2), pre('embudo', 4), ex('pipeline', 4),
      pre('cobranza', 3), pre('presupuestos', 1),
    ],
    respuesta:
      'Armamos un CRM con todos tus clientes, ventas y seguimientos en un solo lugar: quién te escribió, en qué quedaron, qué hay que hacer hoy y qué se está por cerrar.',
    seccion: 'servicio-crm',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por un CRM para mi negocio.',
    precioId: 'crm',
    relacionados: ['automatizacion', 'apps', 'precio'],
  },
  {
    id: 'asistentes',
    boton: 'Asistentes animados',
    enGrilla: true,
    patrones: [
      pre('asistente', 4), ex('ia', 3), fr('inteligencia artificial', 4), pre('inteligencia', 2),
      fr('como vos', 4), fr('un personaje', 4), pre('personaje', 3), pre('mascota', 3),
      pre('avatar', 3), pre('animacion', 2), pre('ilustrad', 3), ex('marcio', 5),
      ex('chat', 1), fr('marcianito', 5),
    ],
    respuesta:
      '¡Como yo! 😄 Creamos un personaje ilustrado y animado para tu web o tu sistema: saluda, guía a tus clientes, responde lo de siempre y los pasa con una persona cuando hace falta.',
    seccion: 'servicio-asistentes',
    whatsapp: 'Hola tecnoros.ar, quiero un asistente para mi web o sistema.',
    precioId: 'asistentes',
    relacionados: ['bots', 'identidad', 'precio'],
  },
  {
    id: 'robotica',
    boton: 'Robótica',
    enGrilla: true,
    patrones: [
      pre('robot', 5), pre('robotic', 5), ex('brazo', 3), fr('brazo robotico', 5),
      pre('automata', 4), ex('jar', 4), fr('challenge jar', 5), ex('ros', 3),
      pre('servo', 3), pre('actuador', 4), fr('impresion 3d', 4), ex('3d', 1),
      pre('mecaniz', 3), pre('prototip', 3),
    ],
    respuesta:
      'Diseñamos robots chicos a medida: primero el cerebro y la simulación en 3D para que lo veas funcionando, y si es viable cotizamos aparte la fabricación del cuerpo físico. En la sección Robótica podés armar uno y girarlo.',
    seccion: 'robotica-3d',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por un robot a medida.',
    precioId: 'robotica-a-medida',
    relacionados: ['productos', 'proyectos', 'precio'],
  },
  {
    id: 'productos',
    boton: 'Golondrina, CHAJÁ y TERO',
    enGrilla: true,
    patrones: [
      pre('golondrina', 5), ex('chaja', 5), fr('micro hub', 4), pre('sensor', 3),
      ex('plc', 4), ex('modbus', 5), ex('rs485', 5), fr('riel din', 5), pre('tablero', 3),
      pre('silo', 4), fr('cadena de frio', 5), ex('oee', 4), pre('planta', 2),
      pre('maquina', 2), pre('industrial', 2), pre('telemetr', 4), pre('monitore', 3),
      ex('temperatura', 3), pre('alerta', 2), ex('camara', 2), fr('edge ai', 5),
    ],
    respuesta:
      'Tenemos tres productos propios: Golondrina (controlador de riel DIN + nube, para monitorear y automatizar máquinas, silos o cadena de frío), CHAJÁ (micro-hub industrial con Edge AI y ciberseguridad) y TERO Security (appliance de ciberseguridad, todavía en desarrollo).',
    seccion: 'productos',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por sus productos propios (Golondrina, CHAJÁ o TERO).',
    relacionados: ['ciberseguridad', 'automatizacion', 'precio'],
  },
  {
    id: 'marketing',
    boton: 'Campañas y marketing',
    enGrilla: true,
    patrones: [
      pre('campana', 4), pre('publicidad', 4), pre('publicitar', 4), ex('ads', 5),
      fr('google ads', 5), fr('meta ads', 5), pre('instagram', 3), pre('facebook', 3),
      ex('meta', 2), ex('tiktok', 3), pre('marketing', 4), pre('pauta', 4),
      fr('redes sociales', 4), ex('redes', 2), pre('estrategia', 2), pre('anunci', 3),
      fr('mas clientes', 3), fr('conseguir clientes', 4),
    ],
    respuesta:
      'Armamos y gestionamos campañas en Meta (Instagram y Facebook) y Google Ads, con el análisis y la estrategia de tu marca detrás, y te pasamos informes de resultados.',
    seccion: 'servicio-campanas-ads',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por campañas y estrategia de marca.',
    precioId: 'campanas-ads',
    relacionados: ['identidad', 'web', 'precio'],
  },
  {
    id: 'identidad',
    boton: 'Identidad visual',
    enGrilla: true,
    patrones: [
      pre('identidad', 4), ex('logo', 5), pre('logotipo', 5), pre('isologo', 5),
      pre('tipografi', 4), fr('manual de marca', 5), fr('paleta de colores', 5),
      pre('branding', 5), pre('rebrand', 5), ex('marca', 2), ex('colores', 2),
      ex('color', 1), pre('disen', 2),
    ],
    respuesta:
      'Hacemos la identidad visual de tu marca: logo, colores, tipografías y un manual para que todo lo que publiques se vea igual y se reconozca.',
    seccion: 'servicio-identidad-marca',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por la identidad visual de mi marca.',
    precioId: 'identidad-marca',
    relacionados: ['marketing', 'web', 'precio'],
  },
  {
    id: 'proyectos',
    boton: 'Ver proyectos',
    enGrilla: true,
    patrones: [
      pre('proyecto', 4), pre('ejemplo', 4), pre('portfolio', 5), ex('demo', 4), pre('demos', 4),
      fr('ya hicieron', 5), fr('trabajos anteriores', 5), fr('casos de exito', 5),
      pre('referencia', 3), pre('hicieron', 3), ex('caso', 2), ex('casos', 2),
      ex('trabajo', 1), ex('trabajos', 2), fr('puedo ver', 3),
    ],
    respuesta:
      'Mirá nuestros desarrollos en la sección Proyectos: agenda odontológica con fichas de pacientes y obra social, sistema de kiosco, control de ingresos y gastos y salón de eventos. La agenda la podés probar en vivo acá: https://agendaodontologica-9is7.onrender.com',
    seccion: 'proyectos',
    whatsapp: 'Hola tecnoros.ar, vi sus proyectos y quiero hacer una consulta.',
    relacionados: ['diagnostico', 'precio', 'persona'],
  },
  {
    id: 'nosotros',
    boton: 'Quiénes somos',
    enGrilla: false,
    patrones: [
      fr('quienes son', 5), fr('quien es', 4), fr('quienes somos', 5), pre('equipo', 3),
      fr('donde estan', 5), fr('de donde son', 5), pre('rosario', 4), pre('empresa', 2),
      pre('experiencia', 3), pre('fundador', 4), pre('tecnolog', 2), ex('stack', 4),
      fr('que tecnologias', 5),
    ],
    respuesta:
      'Nacimos en Rosario, Santa Fe, y hoy somos un equipo remoto con gente de distintos lugares del mundo. Trabajamos automatización, ciberseguridad, robótica, electrónica y machine learning. En Nosotros está el equipo y en Tecnologías, con qué trabajamos.',
    seccion: 'sobre-nosotros',
    whatsapp: 'Hola tecnoros.ar, quiero saber más sobre ustedes y su equipo.',
    relacionados: ['proyectos', 'diagnostico', 'persona'],
  },
  {
    id: 'diagnostico',
    boton: 'Diagnóstico gratis',
    enGrilla: true,
    patrones: [
      pre('diagnostic', 5), ex('gratis', 4), pre('gratuit', 4), fr('sin cargo', 4),
      fr('sin compromiso', 4), fr('por donde empiezo', 5), fr('como empezamos', 5),
      fr('primera reunion', 5), fr('no se que necesito', 5), fr('me ayudan', 3),
      fr('necesito ayuda', 4), fr('necesito una mano', 4), fr('no se por donde', 5),
      fr('me pueden ayudar', 4), fr('que me recomiendan', 5), fr('no entiendo nada', 4),
      pre('asesor', 3), pre('reunion', 3),
    ],
    respuesta:
      'El diagnóstico es 100% gratuito y sin compromiso: nos contás qué te está costando, miramos cómo trabajás hoy y te decimos cómo lo resolveríamos y qué saldría. Si no te cierra, no pasa nada.',
    seccion: 'servicio-analisis-qa',
    whatsapp: 'Hola tecnoros.ar, quiero agendar el diagnóstico gratuito.',
    relacionados: ['precio', 'proyectos', 'persona'],
  },
  {
    id: 'precio',
    boton: '¿Cuánto cuesta?',
    enGrilla: true,
    patrones: [
      pre('precio', 4), pre('cuest', 4), pre('cobran', 4), pre('presupuest', 4),
      fr('cuanto sale', 5), fr('cuanto vale', 5), fr('que valor', 4), fr('lista de precios', 5),
      fr('forma de pago', 4), fr('en cuotas', 4), pre('financia', 4), ex('cuanto', 2),
      ex('costo', 3), ex('valor', 2), ex('sale', 1), ex('tarifa', 3), ex('plata', 2),
      pre('barato', 3), pre('caro', 3), ex('arancel', 3),
    ],
    respuesta:
      'Depende de lo que necesites. En la sección Presupuesto podés marcar los servicios que te interesan y ver un rango estimado al instante, y también están los combos. El diagnóstico es gratuito y después te pasamos un presupuesto cerrado, sin sorpresas.',
    seccion: 'facturacion',
    whatsapp: 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.',
    relacionados: ['diagnostico', 'persona'],
  },
  {
    id: 'plazos',
    boton: '¿Cuánto tarda?',
    enGrilla: false,
    patrones: [
      fr('cuanto tarda', 5), fr('cuanto demora', 5), fr('cuanto tiempo', 5), pre('plazo', 4),
      fr('para cuando', 5), fr('en cuanto tiempo', 5), pre('demor', 3), pre('tarda', 3),
      fr('es urgente', 4), pre('entrega', 2), fr('cuando estaria', 5),
    ],
    respuesta:
      'Depende del tamaño del proyecto. Una automatización o un bot suelen salir en semanas; una tienda, una app o un CRM llevan más. En el diagnóstico te damos un plazo concreto con etapas, así ves resultados antes de que esté todo terminado.',
    seccion: 'como-trabajamos',
    whatsapp: 'Hola tecnoros.ar, quiero saber en cuánto tiempo estaría listo mi proyecto.',
    relacionados: ['diagnostico', 'precio', 'persona'],
  },
  {
    id: 'soporte',
    boton: 'Soporte y mantenimiento',
    enGrilla: false,
    patrones: [
      pre('soporte', 4), pre('mantenimiento', 4), fr('despues de entregar', 5),
      fr('si se rompe', 5), pre('garantia', 4), pre('actualiza', 3), ex('abono', 4),
      pre('mensual', 3), pre('suscripcion', 3), fr('hay que pagar todos los meses', 5),
      fr('quiero dar de baja', 5), ex('baja', 2),
    ],
    respuesta:
      'Después de entregar te acompañamos: hay un abono opcional de soporte y mantenimiento con copias de seguridad, monitoreo y horas para mejoras. No es obligatorio, y si no lo querés el sistema igual queda funcionando y es tuyo.',
    seccion: 'facturacion',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por el soporte y mantenimiento.',
    relacionados: ['precio', 'persona'],
  },
  {
    id: 'persona',
    boton: 'Hablar con una persona',
    enGrilla: true,
    patrones: [
      ex('persona', 4), ex('humano', 5), fr('hablar con alguien', 5), fr('con una persona', 5),
      fr('no sos una persona', 4), pre('telefono', 4), pre('llamar', 4), pre('llamada', 4),
      ex('mail', 3), ex('email', 3), fr('e mail', 3), pre('correo', 3), pre('contacto', 3),
      pre('comunicar', 3), pre('atiende', 3), pre('horario', 2), pre('ubicac', 3),
      fr('donde los encuentro', 5),
    ],
    respuesta:
      '¡Claro! Escribinos por WhatsApp o por e-mail y te responde una persona del equipo. Tu consulta no molesta 😉',
    seccion: 'contacto',
    whatsapp: 'Hola tecnoros.ar, quiero hacerles una consulta.',
    relacionados: ['diagnostico'],
  },
];

export const temaPorId = (id: string): Tema | undefined => TEMAS.find((t) => t.id === id);

export const temasDeGrilla = (): Tema[] => TEMAS.filter((t) => t.enGrilla);

// ── Intenciones ───────────────────────────────────────────────────────────────
// Son transversales: no reemplazan al tema, lo modifican. "¿cuánto sale una tienda
// online?" es el tema 'ecommerce' con la intención 'precio', y la respuesta junta las dos.

export type IntencionId = 'saludo' | 'gracias' | 'despedida' | 'afirmacion' | 'negacion' | 'quien-sos';

export interface Intencion {
  id: IntencionId;
  patrones: Patron[];
  /** Si es true, se contesta sola sin arrastrar el tema anterior. */
  respuesta: string;
}

export const INTENCIONES: Intencion[] = [
  {
    id: 'saludo',
    patrones: [ex('hola', 5), ex('holis', 5), ex('buenas', 5), fr('buen dia', 5), fr('buenas tardes', 5), fr('buenas noches', 5), ex('hey', 4), ex('que tal', 4)],
    respuesta: '¡Hola! 👋 Contame qué necesitás resolver en tu negocio, o elegí una opción de acá abajo.',
  },
  {
    id: 'gracias',
    patrones: [pre('gracias', 5), fr('muchas gracias', 5), ex('genial', 4), pre('barbaro', 4), ex('joya', 4), ex('perfecto', 3), ex('buenisimo', 4)],
    respuesta: '¡De nada! 😄 Si querés seguir, puedo contarte de otro tema o pasarte con una persona del equipo.',
  },
  {
    id: 'despedida',
    patrones: [ex('chau', 5), ex('adios', 5), fr('hasta luego', 5), fr('nos vemos', 4), ex('saludos', 3)],
    respuesta: '¡Hasta luego! Cuando quieras volvés a abrir el chat, o nos escribís por WhatsApp. 🛸',
  },
  {
    id: 'quien-sos',
    patrones: [fr('quien sos', 5), fr('sos un bot', 5), fr('sos humano', 5), fr('eres un bot', 5), fr('sos real', 4), fr('como te llamas', 5), fr('quien eres', 5)],
    respuesta:
      'Soy Marcio, el asistente automático de tecnoros.ar. No soy una persona: respondo con información preparada del sitio. Si querés hablar con alguien del equipo, te paso por WhatsApp o e-mail.',
  },
  {
    id: 'afirmacion',
    patrones: [ex('si', 5), ex('sip', 5), ex('dale', 5), ex('claro', 4), ex('obvio', 4), ex('ok', 4), fr('me interesa', 4), fr('contame mas', 5), ex('bueno', 3)],
    respuesta: '',
  },
  {
    id: 'negacion',
    patrones: [ex('no', 5), ex('nop', 5), fr('no gracias', 5), fr('por ahora no', 5), fr('otra cosa', 4)],
    respuesta: 'Sin problema. ¿Sobre qué otro tema te puedo contar?',
  },
];
