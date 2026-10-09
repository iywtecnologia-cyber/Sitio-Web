import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative flex items-center pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-18 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-violet-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        


        {/* Main Headline */}
        <div className="max-w-3xl lg:max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Soluciones digitales y software a medida para{' '}
            <span className="animate-text-light-sweep">
              empresas que no se detienen
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl sm:max-w-3xl leading-relaxed">
            En <strong>tecnoros<span className="text-cyan-400">.ar</span></strong> desarrollamos sistemas web robustos, ciberseguridad y automatizaciones diseñadas para resolver problemas reales de negocio.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => scrollTo('proyectos')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <span>Ver Nuestros Proyectos</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform translate-y-[2px]" />
            </button>

            <button
              onClick={() => scrollTo('facturacion')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900/90 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer group"
            >
              <span>Presupuestos & Cotización</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform translate-y-[2px]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
