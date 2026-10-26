import React from 'react';
import { Users, Sparkles, ShieldCheck, MapPin, Layers, Linkedin, ExternalLink, Cpu } from 'lucide-react';

interface Founder {
  name: string;
  role: string;
  specialty: string;
  badge: string;
  linkedin: string;
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Manuel A.',
    role: 'Co-Fundador',
    specialty: 'Técnico Superior en Seguridad Informática & QA',
    badge: 'Ciberseguridad & QA',
    linkedin: 'https://www.linkedin.com/in/manuel-angiulli/',
  },
  {
    name: 'María Sofía Genta',
    role: 'Co-Fundadora',
    specialty: 'Técnica Superior en Análisis Funcional de Sistemas Informáticos & QA',
    badge: 'Análisis Funcional & QA',
    linkedin: 'https://www.linkedin.com/in/mariiasof%C3%ADagenta/',
  },
  {
    name: 'Esteban José Menin',
    role: 'Se sumó al equipo',
    specialty: 'Bachiller en Electrónica & Machine Learning',
    badge: 'Electrónica & Machine Learning',
    linkedin: 'https://www.linkedin.com/in/esteban-menin-31928a259/',
  },
  {
    name: 'Sebastián Gabriel Sosa',
    role: 'Se sumó al equipo',
    specialty: 'Técnico Electrónico',
    badge: 'Electrónica & Desarrollo',
    linkedin: 'https://www.linkedin.com/in/sebastinsosa/',
  },
];

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
            <span>Equipo Fundador · tecnoros.ar</span>
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
            Somos rosarinos que nos conocimos en septiembre de 2026 siendo voluntarios en los <strong className="text-white">Juegos Suramericanos 2026</strong> en la ciudad de Rosario y ahí decidimos asociarnos para emprender juntos. Unimos nuestras disciplinas en <strong className="text-white">ciberseguridad</strong>, <strong className="text-white">QA</strong>, <strong className="text-white">análisis funcional</strong>, <strong className="text-white">automatización de procesos</strong>, <strong className="text-white">electrónica</strong> y <strong className="text-white">machine learning</strong> para construir software, hardware y soluciones que transforman negocios y resuelven desafíos reales. Más tarde se sumaron <strong className="text-white">Esteban José Menin</strong>, en electrónica y machine learning, y <strong className="text-white">Sebastián Gabriel Sosa</strong>, técnico electrónico, para reforzar el área de electrónica y robótica.
          </p>
        </div>

        {/* Fichas de los Fundadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.name}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {founder.role}
                  </span>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 hover:bg-slate-700 transition-all cursor-pointer"
                    title={`Ver perfil de LinkedIn de ${founder.name}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {founder.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {founder.specialty}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{founder.badge}</span>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
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
                Desarrollamos automatizaciones a medida para diferentes tipos de negocios y, al mismo tiempo, impulsamos proyectos tecnológicos propios en ciberseguridad, robótica autónoma e inteligencia artificial aplicada.
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
                Sabemos llegar al núcleo de cada problema. Analizamos a fondo los requerimientos de cada cliente para diseñar la solución adecuada, combinando ingeniería de software, electrónica y seguridad informática sin intermediarios.
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
