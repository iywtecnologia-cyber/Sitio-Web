import React from 'react';
import { Users, Sparkles, ShieldCheck, MapPin, Layers } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre-nosotros" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Sobre Nosotros · tecnoros.ar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quiénes somos y qué hacemos
          </h2>
        </div>

        {/* Tarjeta Principal: Historia / Presentación */}
        <div className="relative p-7 sm:p-9 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-sm mb-8 overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Rosario, Santa Fe, Argentina</span>
          </div>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Somos dos rosarinos <strong className="text-white font-semibold">Manuel Angiulli</strong> <span className="text-cyan-300 font-mono text-sm">(Técnico Superior en Seguridad Informática y QA)</span> y <strong className="text-white font-semibold">María Sofía Genta</strong> <span className="text-cyan-300 font-mono text-sm">(Técnica Superior en Análisis Funcional de Sistemas Informáticos y QA)</span> que nos conocimos en septiembre de 2026 siendo voluntarios en los Juegos Suramericanos 2026 en la ciudad de Rosario y ahí decidimos asociarnos para emprender juntos.
          </p>
        </div>

        {/* Grilla con las dos preguntas con diseño moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta: ¿Qué ofrecemos? */}
          <div className="p-7 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 group relative flex flex-col justify-between">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
                ¿Qué ofrecemos?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Desarrollamos automatizaciones a medida para diferentes tipos de negocios y, al mismo tiempo, impulsamos proyectos tecnológicos propios que hoy están en plena fase de creación.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono text-cyan-400/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automatizaciones & Proyectos Propios</span>
            </div>
          </div>

          {/* Tarjeta: ¿Qué nos diferencia? */}
          <div className="p-7 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-violet-500/40 transition-all duration-300 group relative flex flex-col justify-between">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
                ¿Qué nos diferencia?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Sabemos llegar al núcleo de cada problema. Analizamos a fondo los requerimientos de cada cliente para diseñar la solución adecuada, y aplicamos ciberseguridad en todo lo que desarrollamos.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono text-violet-400/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Análisis Funcional & Ciberseguridad</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
