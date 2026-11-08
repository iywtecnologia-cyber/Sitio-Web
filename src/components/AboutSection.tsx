import React from 'react';
import { Users, Sparkles, ShieldCheck, MapPin, Layers, ExternalLink, ArrowRight } from 'lucide-react';

import { FOUNDERS } from '../data/equipo';
import { EquipoAreas } from './EquipoAreas';

// Se re-exportan para no cambiar los imports que ya existen.
export { FOUNDERS, AREAS_EQUIPO, equipoPorArea } from '../data/equipo';
export type { AreaEquipo, Founder } from '../data/equipo';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre-nosotros" className="py-14 sm:py-16 md:py-20 bg-transparent border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Users className="w-3.5 h-3.5" />
            <span><span className="text-slate-200">Equipo · tecnoros</span>.ar</span>
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
            <span>Nacimos en Rosario · equipo remoto en distintos lugares del mundo</span>
          </div>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Nacimos en Rosario: los fundadores nos conocimos en 2026 como voluntarios en los <strong className="text-white">Juegos Suramericanos</strong> y decidimos emprender juntos. Sumamos <strong className="text-white">ciberseguridad, QA, automatización, electrónica y machine learning</strong> para resolver problemas reales de negocios. Desde entonces se fue sumando gente de distintos lugares del mundo, y hoy somos <strong className="text-white">{FOUNDERS.length} personas</strong> trabajando en remoto: desarrollo backend, frontend y full stack, QA, diseño UX/UI, electrónica y robótica, operaciones, recursos humanos, administración y asesoría legal en tecnología.
          </p>
        </div>

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm sm:text-base text-slate-300">¿Te interesa sumarte al equipo?</p>
          <a
            href="https://docs.google.com/forms/d/14fCeZQQUTWNRL49S7M3b43FPkncQ5XzUzvOhABXoVTg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-slate-600 hover:bg-slate-800"
          >
            Trabajá con nosotros <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <a href="/encuentros" className="mb-10 -mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          Mirá nuestra historia en fotos: comienzos, equipo y jornadas <ArrowRight className="w-4 h-4" />
        </a>

        {/* El equipo: las mismas tarjetas por área que en el inicio. */}
        <div className="mb-12">
          <EquipoAreas />
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
                Hacemos automatizaciones a medida y tenemos productos propios de ciberseguridad, robótica e inteligencia artificial.
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
                Entendemos cada problema a fondo y lo resolvemos sin intermediarios.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono text-violet-400/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Análisis Funcional, Electrónica & Ciberseguridad</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
