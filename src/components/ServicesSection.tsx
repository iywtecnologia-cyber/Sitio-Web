import React from 'react';
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
  MessageCircle
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
    id: 'automatizacion',
    icon: Workflow,
    badge: 'Automatizaciones',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    title: 'Automatizaciones para tu negocio',
    description: 'Dejá de hacer a mano lo que se puede hacer solo. Conectamos tus planillas, sistemas y procesos para que trabajen juntos y vos ganes horas cada día.',
    bullets: [
      'Los datos se cargan solos en tu planilla o sistema',
      'Recordatorios automáticos de turnos, pagos y vencimientos',
      'Reportes que se arman solos, sin hacerlos a mano'
    ]
  },
  {
    id: 'bots-whatsapp',
    icon: MessageCircle,
    badge: 'Bots de WhatsApp',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    title: 'Bots de WhatsApp',
    description: 'Tu WhatsApp responde solo, a toda hora, aunque no estés. Atiende las consultas de siempre y te pasa la conversación cuando hace falta una persona.',
    bullets: [
      'Responde las consultas frecuentes al instante',
      'Toma pedidos y turnos por WhatsApp',
      'Te deriva el chat cuando hace falta una persona'
    ]
  },
  {
    id: 'ciberseguridad',
    icon: ShieldCheck,
    badge: 'Ciberseguridad',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
    title: 'Ciberseguridad para tu negocio',
    description: 'Protegemos los datos de tu negocio y de tus clientes. Todo lo que desarrollamos sale revisado y pensado para que nadie entre donde no debe.',
    bullets: [
      'Revisamos tus sistemas y te decimos qué riesgos tienen',
      'Cada persona accede solo a lo que necesita',
      'Los datos de tus clientes, protegidos y cifrados'
    ]
  },
  {
    id: 'software',
    icon: Code2,
    badge: 'Desarrollo a Medida',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
    title: 'Sistemas a medida para tu negocio',
    description: 'Si las planillas y las agendas en papel ya no te alcanzan, armamos el sistema justo para cómo trabajás vos.',
    bullets: [
      'Un sistema distinto para cada rubro: turnos, ventas, stock o lo que necesites',
      'Un panel para ver cómo va tu negocio, al momento',
      'Lo usás desde la compu o el celular, estés donde estés'
    ]
  },
  {
    id: 'analisis-qa',
    icon: Target,
    badge: 'Análisis & Calidad',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    title: 'Entendemos tu problema antes de programar',
    description: 'Primero relevamos cómo trabajás, después construimos exactamente lo que necesitás, y lo probamos a fondo antes de entregártelo.',
    bullets: [
      'Te mostramos un prototipo antes de empezar',
      'Probamos todo antes de que lo uses',
      'Hablás directo con los fundadores, sin intermediarios'
    ]
  }
];

export const ServicesSection: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="py-14 sm:py-16 md:py-20 bg-[#090D18] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera con la frase solicitada */}
        <div className="max-w-3xl mb-10 sm:mb-12">
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
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Nos tomamos el tiempo de entender cómo trabajás y armamos la solución justa para vos: ni más, ni menos.
          </p>
        </div>

        {/* Grilla de Servicios Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            // Con una cantidad impar de servicios, el último ocupa todo el ancho.
            const isLastOdd = SERVICES.length % 2 === 1 && index === SERVICES.length - 1;
            return (
              <div
                key={service.id}
                id={`servicio-${service.id}`}
                className={`p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden scroll-mt-28 ${isLastOdd ? 'md:col-span-2' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded border tracking-wider ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    {service.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    100% Personalizado
                  </span>
                  <button
                    onClick={scrollToContact}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer group/btn"
                  >
                    <span>Consultar por este servicio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:translate-x-1 transition-transform translate-y-[2px]" />
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
              Coordinemos una charla de diagnóstico sin costo: nos contás tu caso y te decimos cómo lo resolveríamos.
            </p>
          </div>
          <button
            onClick={scrollToContact}
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
