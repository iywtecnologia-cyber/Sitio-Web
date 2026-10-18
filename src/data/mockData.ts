import {
  ServiceItem,
  POSProduct,
  LogisticsShipment,
  ModuleOption,
  OfficialInvoice,
  SuccessCase,
  Testimonial,
  FaqItem,
} from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'custom-software',
    title: 'Sistemas Web & Cloud a Medida',
    category: 'Desarrollo de Software',
    tagline: 'Plataformas reactivas de alto rendimiento diseñadas para escalar sin fricción.',
    description: 'Diseñamos y programamos aplicaciones web completas (SPA, PWA y paneles SaaS) con React 19, TypeScript y arquitecturas de microservicios con soporte multi-sucursal y tiempo real.',
    icon: 'Layers',
    deliverables: [
      'Arquitectura desacoplada y escalable',
      'Compatibilidad Offline PWA y móvil nativo',
      'Monitoreo de latencia y SLA 99.9%'
    ],
    featuredTech: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
    estimatedDelivery: '3 a 6 semanas'
  },
  {
    id: 'pos-stock',
    title: 'ERP, Control de Stock & Facturación AFIP',
    category: 'Gestión Comercial',
    tagline: 'Control integral de inventario, cajas registradoras y emisión fiscal homologada.',
    description: 'Sistemas diseñados para el polo comercial e industrial del Litoral. Facturación electrónica automática con WSFE AFIP (Facturas A, B, C, MiPyMEs), remitos electrónicos y trazabilidad de lotes.',
    icon: 'ReceiptText',
    deliverables: [
      'Conexión nativa con Web Services AFIP v2.0',
      'Alertas de quiebre de stock por WhatsApp',
      'Integración con lectores de código y balanzas'
    ],
    featuredTech: ['Node.js', 'AFIP SDK', 'Redis', 'WebSockets', 'Drizzle ORM'],
    estimatedDelivery: '4 a 8 semanas'
  },
  {
    id: 'ai-automation',
    title: 'Automatizaciones & Agentes de IA',
    category: 'Inteligencia Aplicada',
    tagline: 'Elimina tareas repetitivas y automatiza la atención 24/7 con modelos cognitivos.',
    description: 'Conectamos tus canales de WhatsApp, Telegram, correo y CRM con agentes de lenguaje natural que entienden jerga local, responden cotizaciones al instante y agendan citas operativas.',
    icon: 'Cpu',
    deliverables: [
      'Chatbots WhatsApp con IA entrenados en tu catálogo',
      'Extracción automática de datos desde PDFs de remitos',
      'Disparadores automáticos por eventos y webhooks'
    ],
    featuredTech: ['Gemini API', 'WhatsApp Cloud API', 'Python', 'Vector DB', 'LangChain'],
    estimatedDelivery: '2 a 4 semanas'
  },
  {
    id: 'logistics-iot',
    title: 'Plataformas Logísticas & Telemetría IoT',
    category: 'Infraestructura & Operaciones',
    tagline: 'Monitoreo de flotas, trazabilidad de cargas y despacho inteligente en Gran Rosario.',
    description: 'Rastreo geográfico en tiempo real de camiones y repartos urbanos. Control de sensores de temperatura para cadenas de frío agroalimentarias y firmas digitales de recepción.',
    icon: 'Compass',
    deliverables: [
      'Geocercas dinámicas sobre Circunvalación y puertos',
      'App de chofer offline con escaneo de remitos',
      'Dashboard en vivo para torre de control'
    ],
    featuredTech: ['WebSockets', 'Leaflet / Maps', 'PWA Offline', 'TimescaleDB', 'MQTT'],
    estimatedDelivery: '5 a 9 semanas'
  }
];

export const INITIAL_POS_PRODUCTS: POSProduct[] = [
  {
    id: 'prod-1',
    code: '779123456781',
    name: 'Aceite de Girasol Refinado 5L (Litoral Agro)',
    category: 'Agroindustria',
    price: 18500,
    stock: 42,
    minStock: 10,
    unit: 'bidón'
  },
  {
    id: 'prod-2',
    code: '779123456782',
    name: 'Pack Rodamientos Blindados SKF 6204-2RS',
    category: 'Ferretería Industrial',
    price: 34200,
    stock: 18,
    minStock: 5,
    unit: 'pack x4'
  },
  {
    id: 'prod-3',
    code: '779123456783',
    name: 'Licencia Anual Sistema Cloud TecnoRosario',
    category: 'Servicios Digitales',
    price: 145000,
    stock: 999,
    minStock: 1,
    unit: 'licencia'
  },
  {
    id: 'prod-4',
    code: '779123456784',
    name: 'Bolsa Polietileno Alta Densidad 50kg (Pack x100)',
    category: 'Packaging',
    price: 28900,
    stock: 65,
    minStock: 15,
    unit: 'bulto'
  },
  {
    id: 'prod-5',
    code: '779123456785',
    name: 'Módulo IoT Sensor Temperatura & Humedad RS-485',
    category: 'Hardware & IoT',
    price: 89000,
    stock: 12,
    minStock: 4,
    unit: 'unidad'
  }
];

export const INITIAL_SHIPMENTS: LogisticsShipment[] = [
  {
    id: 'ship-1',
    trackingCode: 'TR-LOG-8910',
    client: 'Molinos del Paraná S.A.',
    origin: 'Parque Industrial Alvear',
    destination: 'Terminal Portuaria San Martín (Muelle 2)',
    status: 'En Circunvalación',
    progressPercentage: 68,
    eta: '14:45 hs (En 28 min)',
    driver: 'Esteban Carrizo',
    vehicle: 'Mercedes-Benz Actros (AF-912-RO)',
    telemetry: {
      speedKmH: 74,
      cargoTempC: 18.4,
      batteryPct: 94,
      lastCheckpoint: 'Km 14 Acceso Norte'
    }
  },
  {
    id: 'ship-2',
    trackingCode: 'TR-LOG-8911',
    client: 'Distribuidora Litoral San Lorenzo',
    origin: 'Centro Logístico Fisherton',
    destination: 'Av. San Martín 1420, San Lorenzo',
    status: 'En Reparto Final',
    progressPercentage: 92,
    eta: '14:25 hs (En 8 min)',
    driver: 'Mariana Benítez',
    vehicle: 'Iveco Daily Furgón (AE-403-TL)',
    telemetry: {
      speedKmH: 38,
      cargoTempC: 19.8,
      batteryPct: 88,
      lastCheckpoint: 'Rotonda Urquiza'
    }
  },
  {
    id: 'ship-3',
    trackingCode: 'TR-LOG-8912',
    client: 'Cooperativa Agropecuaria Rosario',
    origin: 'Polo Tecnológico Zona Sur',
    destination: 'Galpón Central Villa Gobernador Gálvez',
    status: 'Preparación',
    progressPercentage: 15,
    eta: '16:10 hs (En 1h 50m)',
    driver: 'Luciano Rossi',
    vehicle: 'Ford Cargo 1722 (AD-833-PP)',
    telemetry: {
      speedKmH: 0,
      cargoTempC: 16.5,
      batteryPct: 100,
      lastCheckpoint: 'Depósito Alvear Andén 3'
    }
  }
];

export const BILLING_MODULES: ModuleOption[] = [
  {
    id: 'mod-core-pwa',
    name: 'Frontend Web React 19 + PWA Responsive',
    category: 'core',
    description: 'Interfaz ultrarrápida, instalable en teléfonos y tablets, con diseño personalizado y soporte offline.',
    priceArs: 850000,
    priceUsd: 750,
    daysEstimate: 14,
    includedByDefault: true
  },
  {
    id: 'mod-backend-api',
    name: 'Backend API REST & Base de Datos PostgreSQL',
    category: 'backend',
    description: 'Servidor seguro Node.js, roles de usuarios (RBAC), auditoría de cambios y backups automáticos diarios.',
    priceArs: 720000,
    priceUsd: 640,
    daysEstimate: 12,
    includedByDefault: true
  },
  {
    id: 'mod-afip-wsfe',
    name: 'Integración Oficial AFIP Factura Electrónica',
    category: 'fiscal',
    description: 'Emisión automática de Facturas A, B, Notas de Crédito, consulta de CUIT y sincronización con CAE.',
    priceArs: 480000,
    priceUsd: 420,
    daysEstimate: 8
  },
  {
    id: 'mod-payments',
    name: 'Pasarela de Cobros (Mercado Pago, MODO & CBU)',
    category: 'fiscal',
    description: 'Cobro por QR dinámico, links de pago y conciliación bancaria con acreditación instantánea.',
    priceArs: 360000,
    priceUsd: 320,
    daysEstimate: 6
  },
  {
    id: 'mod-ai-agent',
    name: 'Agente IA WhatsApp / CRM Conversacional',
    category: 'ai',
    description: 'Bot con inteligencia artificial entrenado con tu lista de precios y políticas para atender 24/7.',
    priceArs: 590000,
    priceUsd: 520,
    daysEstimate: 10
  },
  {
    id: 'mod-stock-pos',
    name: 'Módulo TPV Punto de Venta & Código de Barras',
    category: 'backend',
    description: 'Caja rápida, soporte de impresoras térmicas ESC/POS y trazabilidad de números de serie.',
    priceArs: 440000,
    priceUsd: 390,
    daysEstimate: 7
  },
  {
    id: 'mod-cloud-server',
    name: 'Despliegue Cloud en Servidor Dedicado + SSL',
    category: 'infra',
    description: 'Configuración en nube de alta velocidad con dominio .com.ar, certificado SSL clase bancaria y CDN.',
    priceArs: 240000,
    priceUsd: 210,
    daysEstimate: 3
  }
];

export const INITIAL_INVOICES: OfficialInvoice[] = [
  {
    id: 'inv-101',
    invoiceType: 'A',
    puntoVenta: '0004',
    numero: '00001923',
    fechaEmision: '2026-10-01',
    fechaVencimientoPago: '2026-10-15',
    emisor: {
      razonSocial: 'TECNOROSARIO AR S.R.L.',
      cuit: '30-71829402-8',
      domicilio: 'Pellegrini 1840 Piso 4, Rosario (2000), Santa Fe',
      condicionIva: 'IVA Responsable Inscripto',
      iibb: '21-9304918-2',
      inicioActividades: '15/03/2021'
    },
    receptor: {
      razonSocial: 'LOGÍSTICA DEL LITORAL S.A.',
      cuit: '30-68934521-4',
      domicilio: 'Av. Circunvalación Km 8, Rosario, Santa Fe',
      condicionIva: 'IVA Responsable Inscripto'
    },
    items: [
      {
        id: 'it-1',
        description: 'Desarrollo e Implementación Módulo Telemetría de Flota v3.2',
        quantity: 1,
        unitPrice: 1950000,
        vatRate: 21,
        total: 1950000
      }
    ],
    subtotalNeto: 1950000,
    iva21: 409500,
    percepcionIibb: 68250,
    total: 2427750,
    cae: '74401928374619',
    vencimientoCae: '2026-10-11',
    estadoCobro: 'Cobrada'
  },
  {
    id: 'inv-102',
    invoiceType: 'A',
    puntoVenta: '0004',
    numero: '00001924',
    fechaEmision: '2026-10-03',
    fechaVencimientoPago: '2026-10-18',
    emisor: {
      razonSocial: 'TECNOROSARIO AR S.R.L.',
      cuit: '30-71829402-8',
      domicilio: 'Pellegrini 1840 Piso 4, Rosario (2000), Santa Fe',
      condicionIva: 'IVA Responsable Inscripto',
      iibb: '21-9304918-2',
      inicioActividades: '15/03/2021'
    },
    receptor: {
      razonSocial: 'AGROVILLA SEMILLAS S.H.',
      cuit: '33-70891244-9',
      domicilio: 'Ruta 33 Km 748, Casilda, Santa Fe',
      condicionIva: 'IVA Responsable Inscripto'
    },
    items: [
      {
        id: 'it-2',
        description: 'Abono Mensual Servidor Cloud & Soporte Técnico 24/7 (Octubre)',
        quantity: 1,
        unitPrice: 420000,
        vatRate: 21,
        total: 420000
      }
    ],
    subtotalNeto: 420000,
    iva21: 88200,
    percepcionIibb: 14700,
    total: 522900,
    cae: '74402019485721',
    vencimientoCae: '2026-10-13',
    estadoCobro: 'Pendiente'
  },
  {
    id: 'inv-103',
    invoiceType: 'B',
    puntoVenta: '0004',
    numero: '00001925',
    fechaEmision: '2026-10-04',
    fechaVencimientoPago: '2026-10-04',
    emisor: {
      razonSocial: 'TECNOROSARIO AR S.R.L.',
      cuit: '30-71829402-8',
      domicilio: 'Pellegrini 1840 Piso 4, Rosario (2000), Santa Fe',
      condicionIva: 'IVA Responsable Inscripto',
      iibb: '21-9304918-2',
      inicioActividades: '15/03/2021'
    },
    receptor: {
      razonSocial: 'Dr. Gonzalo Valenzuela',
      cuit: '20-33984712-3',
      domicilio: 'Bv. Oroño 750, Rosario, Santa Fe',
      condicionIva: 'Consumidor Final'
    },
    items: [
      {
        id: 'it-3',
        description: 'Licencia Software de Gestión de Turnos Médicos Sanatorio',
        quantity: 1,
        unitPrice: 280000,
        vatRate: 21,
        total: 280000
      }
    ],
    subtotalNeto: 280000,
    iva21: 58800,
    percepcionIibb: 0,
    total: 338800,
    cae: '74402188492013',
    vencimientoCae: '2026-10-14',
    estadoCobro: 'Cobrada'
  }
];

export const SUCCESS_CASES: SuccessCase[] = [
  {
    id: 'distribuidora-litoral',
    client: 'Distribuidora Litoral Mayorista',
    industry: 'Alimentos y Bebidas',
    location: 'Rosario & Gran Rosario',
    metricHighlight: '+310%',
    metricLabel: 'Velocidad en preparación de pedidos',
    summary: 'Migración integral desde planillas manuales a un sistema web PWA con lectores de código de barras inalámbricos y facturación automática.',
    achievements: [
      'Reducción de errores de despacho del 14% a menos del 0.2%',
      'Emisión de Facturas Electrónicas AFIP en menos de 1.8 segundos por cliente',
      'Sincronización de stock en tiempo real entre el galpón de Alvear y los locales de venta'
    ],
    techStack: ['React PWA', 'Node.js', 'PostgreSQL', 'WebSockets', 'AFIP WSFE'],
    testimonial: {
      quote: 'Antes tardábamos hasta 25 minutos en armar un pedido grande y facturarlo. Con el sistema de TecnoRosario el personal escanea los bultos en segundos y el cliente se va con su factura en mano.',
      author: 'Martín Barrenechea',
      role: 'Gerente de Logística y Operaciones'
    }
  },
  {
    id: 'salud-rosario',
    client: 'Red de Consultorios Médicos Oroño',
    industry: 'Salud & Prestaciones Privadas',
    location: 'Centro de Rosario',
    metricHighlight: '-48%',
    metricLabel: 'Reducción en ausentismo a turnos',
    summary: 'Implementación de un asistente virtual inteligente por WhatsApp que gestiona recordatorios, reprogramaciones automáticas y cobro de copagos.',
    achievements: [
      'Más de 4.800 pacientes atendidos por mes sin intervención de secretaría',
      'Integración con historia clínica digital y firma de consentimiento',
      'Cobro anticipado con botón QR de Mercado Pago con acreditación instantánea'
    ],
    techStack: ['Gemini IA', 'WhatsApp Cloud API', 'Express', 'React', 'Mercado Pago'],
    testimonial: {
      quote: 'El bot responde como una persona real, comprende las dudas de los pacientes sobre obras sociales y redujo a la mitad los turnos perdidos. Es la mejor inversión tecnológica que hicimos.',
      author: 'Dra. Silvina Moriconi',
      role: 'Directora Médica Asociada'
    }
  },
  {
    id: 'agro-parana',
    client: 'Agroservicios San Lorenzo',
    industry: 'Agroindustria & Granos',
    location: 'Puerto General San Martín',
    metricHighlight: '100%',
    metricLabel: 'Trazabilidad de cartas de porte y cupos',
    summary: 'Plataforma de despacho de camiones con lectura de patentes, geocercas en acceso portuario y conexión directa con el sistema de AFIP/SENASA.',
    achievements: [
      'Cero multas por demoras en playa de camiones durante la cosecha gruesa',
      'Monitoreo en vivo de más de 80 unidades de transporte diarias',
      'Acceso móvil para choferes sin requerir instalación de apps complejas'
    ],
    techStack: ['TypeScript', 'PWA Offline', 'Geocoding', 'Redis Pub/Sub', 'TimescaleDB'],
    testimonial: {
      quote: 'En plena época de cosecha, cada minuto que un camión espera en la cola cuesta dinero. TecnoRosario nos dio una solución sólida que nunca se cae, incluso con mala señal en la ruta.',
      author: 'Ing. Lucas Vignati',
      role: 'Jefe de Logística Portuaria'
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    author: 'Ignacio Fontanarrosa',
    role: 'CEO & Co-Founder',
    company: 'Norte Industrial S.A.',
    city: 'Rosario, Santa Fe',
    avatarText: 'IF',
    quote: 'Lo que distingue a TecnoRosario es que no te venden humo: te muestran el sistema funcionando antes de que pongas un peso. Su módulo de facturación nos resolvió el dolor de cabeza de AFIP.',
    serviceCategory: 'ERP & Facturación AFIP',
    date: 'Hace 3 semanas',
    metric: 'Facturación en 1.5s'
  },
  {
    id: 't-2',
    author: 'Valeria Cingolani',
    role: 'Gerente Comercial',
    company: 'Distribuidora Santa Fe Sur',
    city: 'Granadero Baigorria, Santa Fe',
    avatarText: 'VC',
    quote: 'Nuestros vendedores en la calle ahora toman los pedidos desde el celular, ven el stock exacto en el depósito y emiten la nota de pedido al instante. Aumentamos las ventas un 35% en el primer trimestre.',
    serviceCategory: 'App Web Móvil PWA',
    date: 'Hace 1 mes',
    metric: '+35% ventas en ruta'
  },
  {
    id: 't-3',
    author: 'Federico Balbi',
    role: 'Director de Operaciones',
    company: 'TransLogística Litoral',
    city: 'San Lorenzo, Santa Fe',
    avatarText: 'FB',
    quote: 'El soporte técnico es impecable. Cuando tuvimos que adaptar los remitos electrónicos por una nueva resolución de AFIP, lo tuvieron listo en 48 horas sin interrumpir los despachos.',
    serviceCategory: 'Soporte Cloud & AFIP',
    date: 'Hace 2 meses',
    metric: 'SLA 99.98% uptime'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'facturacion',
    question: '¿Emiten Factura A oficial y cómo es el esquema de cobro?',
    answer: 'Sí, somos una empresa argentina constituida con CUIT y emitimos Factura A oficial con CAE autorizado por AFIP. Nuestro esquema habitual es de 40% de anticipo al firmar y validar la arquitectura, 30% a la entrega del prototipo funcional interactivo, y 30% final al desplegar en producción y brindar la capacitación de tu equipo.'
  },
  {
    id: 'faq-2',
    category: 'desarrollo',
    question: '¿Qué significa que el portafolio tiene sistemas que se pueden probar en vivo?',
    answer: 'En TecnoRosario creemos en la transparencia total. En lugar de mostrar capturas estáticas o videos editados, en esta misma web podés probar directamente micro-aplicaciones funcionales de nuestros sistemas (Punto de Venta con código de barras, Chatbot con IA y Monitor de Logística) con datos reales simulados para que compruebes la velocidad, usabilidad y calidad del código.'
  },
  {
    id: 'faq-3',
    category: 'desarrollo',
    question: '¿El código fuente y la base de datos pertenecen a mi empresa?',
    answer: 'Totalmente. Todo el desarrollo a medida que realizamos se entrega con código fuente bajo tu propiedad (repositorio GitHub / GitLab privado a tu nombre), sin suscripciones forzosas de "caja negra" que te aten de por vida.'
  },
  {
    id: 'faq-4',
    category: 'soporte',
    question: '¿Qué mantenimiento y soporte brindan luego de la puesta en marcha?',
    answer: 'Todos nuestros proyectos incluyen 30 días de garantía y soporte técnico prioritario sin cargo para ajustes post-lanzamiento. Además ofrecemos planes de mantenimiento mensual que cubren monitoreo de servidores, backups diarios, actualizaciones de seguridad y soporte inmediato ante cambios de normativas AFIP.'
  },
  {
    id: 'faq-5',
    category: 'facturacion',
    question: '¿Podemos integrar el nuevo sistema con nuestro software actual?',
    answer: 'Sí. Desarrollamos APIs y conectores a medida para sincronizar con sistemas existentes (Tango, SAP, Bejerman, Mercado Libre, Tiendanube, WooCommerce o bases de datos SQL heredadas) para que la transición sea fluida sin perder historial de clientes.'
  }
];
