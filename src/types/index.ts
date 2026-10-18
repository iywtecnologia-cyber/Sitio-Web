export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  icon: string;
  deliverables: string[];
  featuredTech: string[];
  estimatedDelivery: string;
}

export interface POSProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
}

export interface POSCartItem {
  product: POSProduct;
  quantity: number;
}

export interface POSTicket {
  ticketNumber: string;
  date: string;
  items: POSCartItem[];
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  cuitEmisor: string;
  caeSimulado: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  actionPayload?: {
    type: 'quote' | 'status' | 'booking';
    data: any;
  };
}

export interface LogisticsShipment {
  id: string;
  trackingCode: string;
  client: string;
  destination: string;
  origin: string;
  status: 'Preparación' | 'En Circunvalación' | 'En Reparto Final' | 'Entregado';
  progressPercentage: number;
  eta: string;
  driver: string;
  vehicle: string;
  telemetry: {
    speedKmH: number;
    cargoTempC: number;
    batteryPct: number;
    lastCheckpoint: string;
  };
}

export interface ModuleOption {
  id: string;
  name: string;
  category: 'core' | 'backend' | 'ai' | 'fiscal' | 'infra';
  description: string;
  priceArs: number;
  priceUsd: number;
  daysEstimate: number;
  includedByDefault?: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // e.g. 21
  total: number;
}

export interface OfficialInvoice {
  id: string;
  invoiceType: 'A' | 'B';
  puntoVenta: string; // "0004"
  numero: string; // "00001842"
  fechaEmision: string;
  fechaVencimientoPago: string;
  emisor: {
    razonSocial: string;
    cuit: string;
    domicilio: string;
    condicionIva: string;
    iibb: string;
    inicioActividades: string;
  };
  receptor: {
    razonSocial: string;
    cuit: string;
    domicilio: string;
    condicionIva: string;
  };
  items: InvoiceItem[];
  subtotalNeto: number;
  iva21: number;
  percepcionIibb: number;
  total: number;
  cae: string;
  vencimientoCae: string;
  estadoCobro: 'Cobrada' | 'Pendiente' | 'En Gestión';
}

export interface SuccessCase {
  id: string;
  client: string;
  industry: string;
  location: string;
  metricHighlight: string;
  metricLabel: string;
  summary: string;
  achievements: string[];
  techStack: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  city: string;
  avatarText: string;
  quote: string;
  serviceCategory: string;
  date: string;
  metric: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'desarrollo' | 'facturacion' | 'soporte' | 'seguridad';
}
