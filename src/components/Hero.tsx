import React from 'react';
import { ArrowRight, MousePointerClick, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

const BENEFITS = [
  { icon: Clock, text: 'Menos tareas a mano' },
  { icon: MessageCircle, text: 'Clientes atendidos al instante' },
  { icon: ShieldCheck, text: 'Tu información protegida' },
];

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative flex items-center pt-28 pb-14 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-violet-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="max-w-3xl lg:max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm font-mono text-cyan-300 mb-5">
            Soluciones digitales a tu medida · Rosario
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Tu negocio crece{' '}
            <span className="animate-text-light-sweep">con vos</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Automatizamos las tareas que te roban horas, protegemos tu información y creamos el software que tu negocio necesita.{' '}
            <strong className="text-white font-semibold">Probalo acá mismo, antes de decidir.</strong>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => scrollTo('demos')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <MousePointerClick className="w-4 h-4" />
              <span>Probá una demo gratis</span>
            </button>

            <button
              onClick={() => scrollTo('contacto')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-slate-900/90 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer group"
            >
              <span>Pedí tu diagnóstico sin costo</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
