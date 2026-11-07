import React from 'react';
import { Users, Sparkles, ShieldCheck, MapPin, Layers, Linkedin, ExternalLink, Cpu, ArrowRight } from 'lucide-react';

// Áreas del equipo, en el orden en que se muestran.
export const AREAS_EQUIPO = [
  { id: 'cofundadores', nombre: 'Co-founders' },
  { id: 'ciberseguridad', nombre: 'Ciberseguridad' },
  { id: 'qa', nombre: 'QA y análisis funcional' },
  { id: 'backend', nombre: 'Backend' },
  { id: 'fullstack', nombre: 'Full Stack' },
  { id: 'frontend', nombre: 'Frontend' },
  { id: 'electronica', nombre: 'Electrónica y robótica' },
  { id: 'diseno', nombre: 'Diseño UX/UI' },
  { id: 'operaciones', nombre: 'Operaciones, RR. HH. y Administración' },
] as const;

export type AreaEquipo = (typeof AREAS_EQUIPO)[number]['id'];

interface Founder {
  name: string;
  area: AreaEquipo;
  role: string;
  specialty: string;
  badge: string;
  /** Opcional: sin LinkedIn la ficha se muestra igual, sin los links. */
  linkedin?: string;
  /** Opcional: nombre para las fichas angostas de la landing, cuando sacar el primero y el último no alcanza. */
  corto?: string;
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Manuel A.',
    area: 'cofundadores',
    role: 'Co-Fundador',
    specialty: 'Técnico Superior en Seguridad Informática & QA',
    badge: 'Ciberseguridad & QA',
    linkedin: 'https://www.linkedin.com/in/manuel-angiulli/',
  },
  {
    name: 'María Sofía Genta',
    area: 'cofundadores',
    role: 'Co-Fundadora',
    specialty: 'Técnica Superior en Análisis Funcional de Sistemas Informáticos & QA',
    badge: 'Análisis Funcional & QA',
    linkedin: 'https://www.linkedin.com/in/mariiasof%C3%ADagenta/',
  },
  {
    name: 'Esteban José Menin',
    area: 'electronica',
    role: 'Se sumó al equipo',
    specialty: 'Bachiller en Electrónica & Machine Learning',
    badge: 'Electrónica & Machine Learning',
    linkedin: 'https://www.linkedin.com/in/esteban-menin-31928a259/',
  },
  {
    name: 'Sebastián Gabriel Sosa',
    area: 'electronica',
    role: 'Se sumó al equipo',
    specialty: 'Técnico Electrónico',
    badge: 'Electrónica & Desarrollo',
    linkedin: 'https://www.linkedin.com/in/sebastinsosa/',
  },
  {
    name: 'Ulises Pan',
    area: 'fullstack',
    role: 'Se sumó al equipo',
    specialty: 'Desarrollador Full Stack',
    badge: 'Full Stack Developer',
    linkedin: 'https://www.linkedin.com/in/ulises-pan',
  },
  {
    name: 'Iván Pieretto',
    area: 'backend',
    role: 'Se sumó al equipo',
    specialty: 'Backend Developer',
    badge: 'Backend Developer',
    linkedin: 'https://www.linkedin.com/in/ivanpieretto',
  },
  {
    name: 'Mariano Candalaft',
    area: 'backend',
    role: 'Se sumó al equipo',
    specialty: 'Backend Developer',
    badge: 'Backend Developer',
    linkedin: 'https://www.linkedin.com/in/mariano-candalaft-347052220',
  },
  {
    name: 'Santiago Senn',
    area: 'operaciones',
    role: 'Se sumó al equipo',
    specialty: 'Operations Manager',
    badge: 'Operations Manager',
    linkedin: 'https://www.linkedin.com/in/santiago-senn-67310b329',
  },
  {
    name: 'Jordi Sanchez Correa',
    area: 'operaciones',
    role: 'Se sumó al equipo',
    specialty: 'Recursos Humanos (RRHH)',
    badge: 'Recursos Humanos',
    corto: 'Jordi Sanchez Correa',
    linkedin: 'https://www.linkedin.com/in/jordi-sanchez-correa/',
  },
  {
    name: 'Cindy Otto',
    area: 'operaciones',
    role: 'Se sumó al equipo',
    specialty: 'Recursos Humanos (RRHH)',
    badge: 'Recursos Humanos',
    linkedin: 'https://www.linkedin.com/in/cindy-ailyn-otto-75a701371',
  },
  {
    name: 'Nicolas Oriti Tizio',
    area: 'backend',
    role: 'Se sumó al equipo',
    specialty: 'Líder Backend Developer',
    badge: 'Backend Lead',
    corto: 'Nicolas Oriti',
    linkedin: 'https://www.linkedin.com/in/nicolas-oriti-tizio',
  },
  {
    name: 'Agustín Albónico',
    area: 'backend',
    role: 'Se sumó al equipo',
    specialty: 'Backend Developer',
    badge: 'Backend Developer',
    linkedin: 'https://www.linkedin.com/in/agustinalbonico/',
  },
  {
    name: 'Abel Alarcon',
    area: 'backend',
    role: 'Se sumó al equipo',
    specialty: 'Backend Developer',
    badge: 'Backend Developer',
    linkedin: 'https://www.linkedin.com/in/abelalarc%C3%B3n/',
  },
  {
    name: 'Matias Aguero',
    area: 'backend',
    role: 'Se sumó al equipo',
    specialty: 'Backend Developer (Full Stack)',
    badge: 'Backend Developer',
    linkedin: 'https://www.linkedin.com/in/matias-aguero-ventrice',
  },
  {
    name: 'Lucas Caño',
    area: 'frontend',
    role: 'Se sumó al equipo',
    specialty: 'Frontend Developer',
    badge: 'Frontend Developer',
    linkedin: 'https://www.linkedin.com/in/lucas-ca%C3%B1o-0a5406223',
  },
  {
    name: 'Ignacio Ibaigorria',
    area: 'frontend',
    role: 'Se sumó al equipo',
    specialty: 'Full Stack Developer (foco en frontend)',
    badge: 'Frontend Developer',
    linkedin: 'https://linkedin.com/in/ignacio-ibaigorria',
  },
  {
    name: 'Rodrigo Pinto',
    area: 'fullstack',
    role: 'Se sumó al equipo',
    specialty: 'Desarrollador Full Stack',
    badge: 'Full Stack Developer',
    linkedin: 'https://www.linkedin.com/in/rodrigopinto30/',
  },
  {
    name: 'Miguel Pistan',
    area: 'qa',
    role: 'Se sumó al equipo',
    specialty: 'Tester QA manual',
    badge: 'QA Analyst',
    linkedin: 'https://www.linkedin.com/in/miguel-pistan/',
  },
  {
    name: 'Ayelén Tolay',
    area: 'qa',
    role: 'Se sumó al equipo',
    specialty: 'Analista QA Tester',
    badge: 'QA Analyst',
    linkedin: 'https://www.linkedin.com/in/ayelen-tolay',
  },
  {
    name: 'Fernando Barrionuevo',
    area: 'qa',
    role: 'Se sumó al equipo',
    specialty: 'QA Manual',
    badge: 'QA Analyst',
    linkedin: 'https://www.linkedin.com/in/fernandobarrionuevoqa',
  },
  {
    name: 'Pamela Calafate',
    area: 'qa',
    role: 'Se sumó al equipo',
    specialty: 'QA manual y automation · Abogada',
    badge: 'QA Analyst · Abogada',
    linkedin: 'https://www.linkedin.com/in/pamelacalafate/',
  },
  {
    // Pidió que le avisemos qué rol le ponemos: este es el que ella/él mismo propuso, a confirmar.
    name: 'Leandro José Luis Trapine',
    area: 'qa',
    role: 'Se sumó al equipo',
    specialty: 'QA & Technology Consultant · Lawyer · Legal Tech',
    badge: 'QA Analyst · Lawyer · Legal Tech',
    corto: 'Leandro Trapine',
    linkedin: 'https://www.linkedin.com/in/leandro-trapine-66216b1b6',
  },
  {
    name: 'Santiago Pereira',
    area: 'fullstack',
    role: 'Se sumó al equipo',
    specialty: 'Desarrollador Full Stack',
    badge: 'Full Stack Developer',
    linkedin: 'https://www.linkedin.com/in/santiago-pereira-994229244/',
  },
  {
    name: 'Manuel Alexandro Legra Crespo',
    area: 'frontend',
    role: 'Se sumó al equipo',
    specialty: 'Frontend Developer',
    badge: 'Frontend Developer',
    corto: 'Manuel Legra Crespo',
    linkedin: 'https://www.linkedin.com/in/manuel-alexandro-legra-crespo-0769bb410/',
  },
  {
    name: 'Celina Jara',
    area: 'operaciones',
    role: 'Se sumó al equipo',
    specialty: 'Administración',
    badge: 'Administración',
    linkedin: 'https://www.linkedin.com/in/celina-jara-23b03373/',
  },
  {
    name: 'Daniel Hernández Anaya',
    area: 'qa',
    role: 'Se sumó al equipo',
    specialty: 'QA',
    badge: 'QA Analyst',
    corto: 'Daniel Hernández Anaya',
    linkedin: 'https://www.linkedin.com/in/daniel-hernandez-anaya/',
  },
  {
    name: 'Lucas Greco',
    area: 'fullstack',
    role: 'Se sumó al equipo',
    specialty: 'Desarrollador Full Stack',
    badge: 'Full Stack Developer',
    linkedin: 'https://www.linkedin.com/in/lucasggreco/',
  },
  {
    name: 'Oliver Dos Anjos',
    area: 'fullstack',
    role: 'Se sumó al equipo',
    specialty: 'Desarrollador Full Stack',
    badge: 'Full Stack Developer',
    corto: 'Oliver Dos Anjos',
    linkedin: 'https://www.linkedin.com/in/oliverdosanjos-dev/',
  },
  {
    name: 'Victoria Cavagnaro',
    area: 'diseno',
    role: 'Se sumó al equipo',
    specialty: 'Diseñadora UX/UI · Diseñadora Industrial',
    badge: 'UX/UI Designer · Diseño Industrial',
    linkedin: 'https://www.linkedin.com/in/victoria-cavagnaro/',
  },
  {
    name: 'Lucila Gabriele',
    area: 'diseno',
    role: 'Se sumó al equipo',
    specialty: 'Diseño UX/UI & Diseño web',
    badge: 'UX/UI Designer · Diseño Web',
    linkedin: 'https://www.linkedin.com/in/lucilagabriele/',
  },
  {
    name: 'Jonathan Javier Guglielmo',
    area: 'diseno',
    role: 'Se sumó al equipo',
    specialty: 'Diseñador UX/UI',
    badge: 'UX/UI Designer',
    corto: 'Jonathan Guglielmo',
    linkedin: 'https://www.linkedin.com/in/jonathan-javier-guglielmo-2a491517a/',
  },
];

// El equipo agrupado por área. Dentro de cada área, primero quien la lidera y después en el orden de la lista.
export const equipoPorArea = () =>
  AREAS_EQUIPO.map((a) => ({
    ...a,
    integrantes: FOUNDERS.filter((f) => f.area === a.id).sort((x, y) => Number(/l[ií]der|\blead\b/i.test(y.badge)) - Number(/l[ií]der|\blead\b/i.test(x.badge))),
  })).filter((a) => a.integrantes.length > 0);

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

        {/* El equipo, ordenado por área. Las grillas se acomodan solas a cuántos somos. */}
        <div className="mb-10 space-y-8">
          {equipoPorArea().map((area) => (
            <div key={area.id}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-mono uppercase tracking-[0.14em] text-cyan-300">
                {area.nombre}
                <span className="text-slate-500 normal-case tracking-normal">· {area.integrantes.length}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {area.integrantes.map((founder) => (
                <div
                  key={founder.name}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {founder.role}
                      </span>
                      {founder.linkedin && (
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 hover:bg-slate-700 transition-all cursor-pointer"
                          title={`Ver perfil de LinkedIn de ${founder.name}`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {founder.name}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {founder.specialty}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{founder.badge}</span>
                    {founder.linkedin && (
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                ))}
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
