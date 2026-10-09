import React, { useState } from 'react';
import { 
  ClipboardList, 
  Layers, 
  UserCheck, 
  Code2, 
  Rocket, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Briefcase,
  Laptop
} from 'lucide-react';

interface Step {
  number: string;
  title: string;
  shortDesc: string;
  details: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Análisis de Requerimientos',
    shortDesc: 'Diagnóstico a fondo del negocio',
    details: 'Llegamos al núcleo de cada problema. Relevamos detalladamente tus procesos operativos y necesidades técnicas para diseñar la arquitectura exacta que tu empresa necesita.',
    icon: ClipboardList,
    badge: 'Diagnóstico',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30'
  },
  {
    number: '02',
    title: 'Prototipo de la Solución',
    shortDesc: 'Modelado y diseño funcional',
    details: 'Diseñamos un prototipo de la solución para que puedas visualizar la dinámica del sistema, la experiencia de usuario y las automatizaciones antes de escribir una sola línea de código.',
    icon: Layers,
    badge: 'Prototipado',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/30'
  },
  {
    number: '03',
    title: 'Evaluación con el Cliente',
    shortDesc: 'Revisión y alineación mutua',
    details: 'Lo evaluamos y testeamos en conjunto con vos. Ajustamos detalles, validamos que resuelva el problema real y, cuando estás 100% de acuerdo, damos inicio al desarrollo formal.',
    icon: UserCheck,
    badge: 'Validación',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30'
  },
  {
    number: '04',
    title: 'Desarrollo & Testing Continuo',
    shortDesc: 'Desarrollo con QA continuo',
    details: 'Programamos la solución aplicando testing continuo en cada etapa. Aseguramos la calidad funcional del software y auditamos la ciberseguridad desde la primera línea.',
    icon: Code2,
    badge: 'QA Continuo',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30'
  },
  {
    number: '05',
    title: 'Implementación & Puesta en Producción',
    shortDesc: 'Lanzamiento en vivo',
    details: 'Desplegamos el sistema en infraestructura cloud segura y de alta disponibilidad. Configuramos accesos, capacitamos a tu equipo y dejamos la plataforma 100% operativa.',
    icon: Rocket,
    badge: 'Producción',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30'
  },
  {
    number: '06',
    title: 'Soporte Continuo & Mejora Evolutiva',
    shortDesc: 'Acompañamiento y soporte técnico activo',
    details: 'Te brindamos soporte continuo post-lanzamiento, monitoreo de estabilidad en producción y propuestas de mejora permanente para que tu sistema evolucione a la par de tu negocio.',
    icon: TrendingUp,
    badge: 'Soporte Continuo',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/30'
  }
];

export const HowWeWorkSection: React.FC = () => {
  const [highlightedStep, setHighlightedStep] = useState<string | null>(null);

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStep = (stepNumber: string) => {
    const el = document.getElementById(`paso-${stepNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedStep(stepNumber);
      setTimeout(() => setHighlightedStep(null), 2500);
    }
  };

  return (
    <section id="como-trabajamos" className="py-14 sm:py-16 md:py-20 bg-[#090D18] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>Nuestra Metodología</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Cómo trabajamos:{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              del problema a la solución en producción
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Un proceso transparente, predecible y orientado a resultados. Construimos soluciones sólidas validando cada decisión directamente con vos.
          </p>
        </div>

        {/* Animación del Workflow: De problema a solución en producción */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          {/* Luces sutiles detrás del flujo */}
          <div className="absolute top-0 left-1/4 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-2.5">
              {/* Punto con efecto de que se prende y se apaga */}
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-beacon-blink inline-block" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                Del problema a la implementación de la solución
              </span>
            </div>
          </div>

          {/* Versión Desktop: 6 Nodos interactivos con riel continuo y cápsula sobre la línea */}
          <div className="hidden lg:grid grid-cols-6 gap-0 relative z-10 pt-2">
            {/* Riel continuo horizontal conectando el centro de todos los nodos */}
            <div className="absolute top-[28px] left-[8.333%] right-[8.333%] h-[2px] -translate-y-1/2 bg-slate-800 z-0 overflow-hidden pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 opacity-60" />
            </div>

            {/* Iconos de trabajo (portafolio y computadora) montados directamente sobre la línea con alta visibilidad y proporciones balanceadas */}
            <div className="absolute top-[28px] z-10 pointer-events-none animate-work-travel hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060B16] border border-cyan-400/90 shadow-[0_0_14px_rgba(0,210,243,0.6)] backdrop-blur-md">
              <Briefcase className="w-4 h-4 text-amber-300 fill-amber-400/30 stroke-[2] shrink-0" />
              <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
              <Laptop className="w-4 h-4 text-cyan-300 fill-cyan-400/30 stroke-[2] shrink-0" />
            </div>

            {[
              { step: '01', title: 'Análisis', status: 'Requerimientos', icon: ClipboardList },
              { step: '02', title: 'Prototipo', status: 'Diseño Funcional', icon: Layers },
              { step: '03', title: 'Evaluación', status: 'Validación Cliente', icon: UserCheck },
              { step: '04', title: 'Desarrollo', status: 'Testing & QA', icon: Code2 },
              { step: '05', title: 'Producción', status: 'Lanzamiento en Vivo', icon: Rocket },
              { step: '06', title: 'Soporte', status: 'Mejora Continua', icon: TrendingUp },
            ].map((node, index) => {
              const NodeIcon = node.icon;
              return (
                <button
                  key={index}
                  onClick={() => scrollToStep(node.step)}
                  className="flex flex-col items-center relative group cursor-pointer focus:outline-none px-1"
                  title={`Ver detalle de la fase ${node.step}: ${node.title}`}
                >
                  {/* Nodo circular con glow, z-20 y fondo sólido para evitar cualquier colapso visual */}
                  <div className="w-10 h-10 rounded-xl bg-[#090D18] border border-cyan-500/40 group-hover:border-cyan-300 group-hover:scale-115 group-hover:bg-cyan-950/70 flex items-center justify-center text-cyan-400 group-hover:text-cyan-200 transition-all duration-200 shadow-lg shadow-cyan-500/15 relative z-20">
                    <NodeIcon className="w-5 h-5" />
                  </div>

                  {/* Etiquetas del paso */}
                  <div className="text-center mt-3 max-w-full">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                      {node.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 whitespace-nowrap">
                      {node.status}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Versión Mobile / Tablet interactiva con scroll suave */}
          <div className="flex lg:hidden items-center gap-3 overflow-x-auto pb-2 no-scrollbar relative z-10">
            {[
              { step: '01', title: '1. Análisis', status: 'Requerimientos', icon: ClipboardList },
              { step: '02', title: '2. Prototipo', status: 'Diseño Funcional', icon: Layers },
              { step: '03', title: '3. Evaluación', status: 'Validación Cliente', icon: UserCheck },
              { step: '04', title: '4. Desarrollo', status: 'Testing & QA', icon: Code2 },
              { step: '05', title: '5. Producción', status: 'Lanzamiento', icon: Rocket },
              { step: '06', title: '6. Soporte', status: 'Mejora Continua', icon: TrendingUp },
            ].map((node, index) => {
              const NodeIcon = node.icon;
              return (
                <React.Fragment key={index}>
                  <button
                    onClick={() => scrollToStep(node.step)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 shrink-0 cursor-pointer transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <NodeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white whitespace-nowrap">{node.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">{node.status}</div>
                    </div>
                  </button>
                  {index < 5 && (
                    <span className="text-cyan-400 font-mono text-xs shrink-0 animate-pulse">
                      ➔
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Grilla de los 6 Pasos del Proceso */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isHighlighted = highlightedStep === step.number;
            return (
              <div
                id={`paso-${step.number}`}
                key={step.number}
                className={`p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border transition-all duration-300 group flex flex-col justify-between relative overflow-hidden ${
                  isHighlighted 
                    ? 'border-cyan-400 ring-2 ring-cyan-400/80 shadow-2xl shadow-cyan-500/30 scale-[1.02]' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Borde superior sutil con gradiente */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                <div>
                  {/* Fila superior: Número + Badge + Icono */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                        {step.number}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border tracking-wider ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs font-mono text-slate-400 mb-4">
                    {step.shortDesc}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.details}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-medium shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Etapa garantizada
                  </span>
                  <span className="text-slate-500 font-mono text-[11px] shrink-0">
                    Fase {step.number}/06
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen del Flujo de Trabajo en Banner */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Garantía de Satisfacción, Soporte Continuo y Transparencia</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              No avanzamos al desarrollo hasta que el prototipo esté completamente validado por vos, y te brindamos soporte continuo en producción para responder consultas, monitorear la plataforma y acompañar el crecimiento de tu empresa.
            </p>
          </div>

          <button
            onClick={scrollToContact}
            className="inline-flex items-center justify-center gap-1 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shrink-0 leading-none group"
          >
            <span>Iniciar Proyecto con Nosotros</span>
            <ArrowRight className="w-4 h-4 text-slate-950 shrink-0 group-hover:translate-x-1 transition-transform self-center translate-y-[2px] -ml-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
