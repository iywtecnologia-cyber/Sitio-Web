import React from 'react';
import { Users, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

import { FOUNDERS } from '../data/equipo';
import { EquipoAreas } from './EquipoAreas';

// Se re-exportan para no cambiar los imports que ya existen.
export { FOUNDERS, AREAS_EQUIPO, equipoPorArea } from '../data/equipo';
export type { AreaEquipo, Founder } from '../data/equipo';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre-nosotros" className="py-5 sm:py-6 bg-transparent border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-400 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span><span className="text-slate-200">Equipo · tecnoros</span>.ar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quiénes somos y qué hacemos
          </h1>
        </div>

        {/* Tarjeta Principal: Historia / Presentación */}
        <div className="relative p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-sm mb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Nacimos en Rosario · equipo remoto en todo LATAM</span>
          </div>

          <p id="nacimos-en-rosario" className="scroll-mt-28 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Nacimos en Rosario: los fundadores nos conocimos en 2026 como voluntarios en los <strong className="text-white">Juegos Suramericanos</strong> y decidimos emprender juntos. Sumamos <strong className="text-white">seguridad informática, análisis funcional, QA, automatización, electrónica y machine learning</strong> para resolver problemas reales de negocios. Desde entonces se fue sumando gente de todo LATAM, y hoy somos <strong className="text-white">{FOUNDERS.length} personas</strong> trabajando en remoto: desarrollo backend, frontend y full stack, DevOps, QA, diseño UX/UI, diseño gráfico, ventas, electrónica y robótica, operaciones, recursos humanos, administración y asesoría legal en tecnología.
          </p>

          {/* Nuestra historia en fotos: link a Encuentros */}
          <a href="/nosotros#encuentros" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline">
            Mirá nuestra historia en fotos: comienzos, equipo y jornadas <ArrowRight className="w-4 h-4" />
          </a>

          {/* En el mismo bloque: los fundadores, «Ver organigrama completo» y el mundo */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <EquipoAreas />
          </div>
        </div>

        {/* Al final: ¿Te interesa sumarte? */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
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
      </div>
    </section>
  );
};
