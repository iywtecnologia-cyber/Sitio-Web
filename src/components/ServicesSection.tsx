import React from 'react';
import { irA } from '../rutas';
import { consultarPor } from '../consulta';
import { 
  Workflow, 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Cpu, 
  Lock, 
  Layers,
  MessageCircle,
  Bot,
  Globe,
  ShoppingCart,
  Megaphone,
  Compass,
  Smartphone,
  Contact,
  Palette,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  bullets: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'analisis-qa',
    icon: Target,
    badge: 'Gratis',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    title: 'Diagnóstico inicial gratuito',
    description: 'Te escuchamos y te decimos qué conviene hacer. Sin costo.',
    bullets: [
      'Sin compromiso',
      'Te mostramos un prototipo antes de empezar'
    ]
  },
  {
    id: 'automatizacion',
    icon: Workflow,
    badge: 'Automatizaciones',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    title: 'Automatizaciones',
    description: 'Lo que hacés a mano, que se haga solo.',
    bullets: [
      'Turnos y reservas',
      'Consultas comerciales',
      'Tareas administrativas',
      'Integración de sistemas',
      'Asistentes web'
    ]
  },
  {
    id: 'ciberseguridad',
    icon: ShieldCheck,
    badge: 'Ciberseguridad',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
    title: 'Ciberseguridad',
    description: 'Protegemos los datos de tu negocio y de tus clientes.',
    bullets: [
      'Revisión de riesgos',
      'Accesos ordenados y seguros'
    ]
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    badge: 'E-commerce',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    title: 'E-commerce',
    description: 'Tu tienda online para vender las 24 horas.',
    bullets: [
      'Catálogo y cobros online',
      'Avisos de pedidos al instante'
    ]
  },
  {
    id: 'aplicaciones-moviles',
    icon: Smartphone,
    badge: 'Apps',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/30',
    title: 'Aplicaciones móviles',
    description: 'Tu negocio en el celular de tus clientes.',
    bullets: [
      'Pedidos, turnos o reservas',
      'Avisos al celular'
    ]
  },
  {
    id: 'crm',
    icon: Contact,
    badge: 'CRM',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    title: 'CRM: tus clientes en un solo lugar',
    description: 'Que no se te pase ningún cliente ni ninguna venta.',
    bullets: [
      'Ficha e historial de cada cliente',
      'Recordatorios de seguimiento'
    ]
  },
  {
    id: 'bots-whatsapp',
    icon: MessageCircle,
    badge: 'WhatsApp',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    title: 'Bots de WhatsApp',
    description: 'Tu WhatsApp responde solo, a toda hora.',
    bullets: [
      'Consultas, pedidos y turnos',
      'Te pasa con una persona cuando hace falta'
    ]
  },
  {
    id: 'asistentes',
    icon: Bot,
    badge: 'Asistentes',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
    title: 'Asistentes ilustrados y con animación digital',
    description: 'Un personaje propio que guía a tus clientes en tu web. Como Marcio.',
    bullets: [
      'Dibujado a medida de tu marca',
      'Animado: saluda y se mueve'
    ]
  },
  {
    id: 'robotica-a-medida',
    icon: Cpu,
    badge: 'Robótica',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    title: 'Robótica: cerebro digital y cuerpo físico',
    description: 'Primero el cerebro del robot en 3D; si funciona, el cuerpo.',
    bullets: [
      'Robots de tamaño chico',
      'Lo probás antes de fabricarlo'
    ]
  },
  {
    id: 'campanas-ads',
    icon: Megaphone,
    badge: 'Campañas',
    badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-950/30',
    title: 'Campañas en Meta y Google Ads',
    description: 'Que te encuentren los clientes que buscás.',
    bullets: [
      'Instagram, Facebook y Google',
      'Informes claros de resultados'
    ]
  },
  {
    id: 'estrategia-marca',
    icon: Compass,
    badge: 'Estrategia',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/30',
    title: 'Estrategia y análisis de marca',
    description: 'Qué decir, a quién y cómo, para que tu marca venda más.',
    bullets: [
      'Análisis de tu marca y tu competencia',
      'Plan para redes, web y campañas'
    ]
  },
  {
    id: 'identidad-marca',
    icon: Palette,
    badge: 'Identidad',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    title: 'Identidad de marca',
    description: 'Cómo se ve tu marca: logo, colores y tipografías.',
    bullets: [
      'Logo y paleta de colores',
      'Manual para usarla siempre igual'
    ]
  }
];

export const ServicesSection: React.FC = () => {

  return (
    <section id="servicios" className="py-14 sm:py-16 md:py-20 bg-transparent border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera con la frase solicitada */}
        <div className="max-w-full lg:max-w-6xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Servicios</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Qué podemos hacer{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              por tu negocio
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl sm:max-w-3xl">
            Entendemos cómo trabajás y armamos lo justo para vos.
          </p>
        </div>

        {/* Grilla de servicios: nombre, para qué sirve en una línea y poco más */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={`servicio-${service.id}`}
                className="scroll-mt-28 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/85 to-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{service.title}</h3>
                </div>
                <p className="mt-3 text-base text-slate-300">{service.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5 flex-1 content-start">
                  {service.bullets.map((b) => (
                    <li key={b} className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">{b}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.id === 'robotica-a-medida' && (
                    <button type="button" onClick={() => irA('robotica-3d')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-sm font-semibold cursor-pointer hover:bg-cyan-400/20">
                      Diseñá tu robot <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button type="button" onClick={() => consultarPor(`servicio-${service.id}`)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold cursor-pointer hover:border-cyan-500/50">
                    Consultar <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner Inferior: Compromiso de Calidad Directa */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">
              ¿Tenés un cuello de botella o proyecto en mente?
            </h4>
            <p className="text-sm text-slate-300">
              Contanos tu caso y te decimos cómo lo resolveríamos. Sin costo.
            </p>
          </div>
          <button
            onClick={() => consultarPor('diagnostico')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shrink-0 group"
          >
            <span>Agendar Diagnóstico Gratuito</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform translate-y-[2px]" />
          </button>
        </div>

      </div>
    </section>
  );
};
