import React, { useEffect, useState } from 'react';
import { 
  Activity,
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Search,
  ShieldCheck,
  Sparkles, 
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';

export interface ProjectStep {
  numero: string;
  titulo: string;
  descripcion: string;
  icon: React.ElementType;
  badgeClass: string;
  cardClass: string;
}

export interface ProjectCase {
  id: string;
  category: string;
  title: string;
  highlightNumber: string;
  highlightText: string;
  icon: React.ElementType;
  badgeColor: string;
  demoUrl?: string;
  pasos: ProjectStep[];
  // Video demo con datos ficticios (public/proyectos)
  video?: { src: string; poster: string };
}

export const PROJECTS_DATA: ProjectCase[] = [
  {
    id: 'agenda-odontologica',
    category: 'Consultorios & Gestión de Pacientes',
    title: 'Agenda Odontológica: Ficha y Gestión Integral',
    highlightNumber: 'Todo en un lugar',
    highlightText: 'Ficha, obra social, adjuntos y contacto directo del paciente',
    icon: Activity,
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    demoUrl: 'https://agendaodontologica-9is7.onrender.com',
    video: { src: '/proyectos/demo-agenda-consultorio.mp4', poster: '/proyectos/demo-agenda-consultorio.jpg' },
    pasos: [
      {
        numero: '1',
        titulo: 'Situación inicial & Dolor',
        descripcion: 'Un consultorio odontológico necesitaba una ficha por paciente que centralizara la obra social, los datos de contacto y el seguimiento de llamados, en vez de tenerlo repartido entre agenda y WhatsApp.',
        icon: AlertCircle,
        badgeClass: 'text-rose-400',
        cardClass: 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
      },
      {
        numero: '2',
        titulo: 'El Análisis de fondo',
        descripcion: 'El foco estaba en el acceso rápido: desde la ficha del paciente, poder llamarlo, escribirle por WhatsApp o mandarle un correo sin buscar el número en otro lado.',
        icon: Search,
        badgeClass: 'text-amber-400',
        cardClass: 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
      },
      {
        numero: '3',
        titulo: 'Solución implementada',
        descripcion: 'Desarrollé un sistema de gestión integral de contactos con obra social, recordatorios de llamadas, adjuntos y accesos directos a WhatsApp, correo y compartir.',
        icon: Cpu,
        badgeClass: 'text-cyan-400',
        cardClass: 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
      },
      {
        numero: '4',
        titulo: 'Validación y pruebas rigurosas',
        descripcion: 'Probado cargando pacientes con distintas obras sociales y adjuntos para confirmar que la ficha y los accesos directos funcionan correctamente en cada caso.',
        icon: ShieldCheck,
        badgeClass: 'text-sky-400',
        cardClass: 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
      },
      {
        numero: '5',
        titulo: 'El Resultado tangible',
        descripcion: 'Toda la información de cada paciente —obra social, contacto y adjuntos— accesible desde una sola ficha, con contacto directo en un clic.',
        icon: CheckCircle2,
        badgeClass: 'text-emerald-400',
        cardClass: 'bg-gradient-to-b from-slate-950/80 to-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
      }
    ]
  }
];

export const PortfolioSection: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);

  // El menú de arriba puede elegir un proyecto directamente.
  useEffect(() => {
    const onSeleccionar = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (PROJECTS_DATA.some((p) => p.id === id)) setSelectedProjectId(id);
    };
    window.addEventListener('seleccionar-proyecto', onSeleccionar);
    return () => window.removeEventListener('seleccionar-proyecto', onSeleccionar);
  }, []);

  const activeProject = PROJECTS_DATA.find(p => p.id === selectedProjectId) || PROJECTS_DATA[0];
  const ActiveIcon = activeProject.icon;

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="proyectos" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/4 -right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="max-w-full lg:max-w-6xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Casos de Estudio & Proyectos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Nuestros Proyectos{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              y Soluciones Desarrolladas
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Sistemas que desarrollamos para reemplazar tareas manuales, procesos desordenados y planillas sueltas por sistemas web intuitivos, rápidos y testeados a fondo.
          </p>
        </div>

        {/* Selector de Proyectos (Si hay más de uno) */}
        {PROJECTS_DATA.length > 1 && (
          <div className="flex flex-wrap items-center gap-2.5 mb-8" role="group" aria-label="Elegí un proyecto">
            {PROJECTS_DATA.map((p) => {
              const Icon = p.icon;
              const isSelected = p.id === selectedProjectId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{p.category}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tarjeta Detallada del Proyecto */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-md">
          
          {/* Header del Caso */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <ActiveIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border tracking-wider ${activeProject.badgeColor}`}>
                    {activeProject.category}
                  </span>
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Probar sistema online</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeProject.title}
                </h3>
              </div>
            </div>

            {/* Highlight Métrica */}
            <div className="px-5 py-3.5 rounded-xl bg-slate-950/90 border border-slate-800 shrink-0 md:text-right">
              <div className="text-base sm:text-lg font-black text-cyan-400 font-mono">
                {activeProject.highlightNumber}
              </div>
              <div className="text-xs text-slate-300">
                {activeProject.highlightText}
              </div>
            </div>
          </div>

          {/* Video demo con datos ficticios */}
          {activeProject.video && (
            <figure className="mt-8">
              <video
                key={activeProject.video.src}
                src={activeProject.video.src}
                poster={activeProject.video.poster}
                controls
                preload="none"
                playsInline
                className="w-full max-w-5xl mx-auto block aspect-[16/10] rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-cyan-500/10"
              >
                Tu navegador no puede reproducir el video.
              </video>
              <figcaption className="mt-2 text-center text-[11px] text-slate-500">Recorrido con datos ficticios · Voz: Piper (OpenSLR 61, CC BY-SA 4.0)</figcaption>
            </figure>
          )}

          {/* Los 5 Pasos del Caso de Estudio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {activeProject.pasos.map((paso) => {
              const PasoIcon = paso.icon;
              return (
                <div
                  key={paso.numero}
                  className={`p-6 rounded-2xl border flex flex-col justify-between transition-colors ${paso.cardClass} ${
                    paso.numero === '5' ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className={`flex items-center gap-2 text-xs font-mono mb-3 ${paso.badgeClass}`}>
                      <PasoIcon className="w-4 h-4 shrink-0" />
                      <span className="font-bold uppercase tracking-wider">
                        {paso.numero}. {paso.titulo}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {paso.descripcion}
                    </p>

                    {paso.numero === '5' && activeProject.demoUrl && (
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-emerald-300/80">Disponible en vivo:</span>
                        <a
                          href={activeProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 underline underline-offset-4 group"
                        >
                          <span>Abrir sistema en el navegador</span>
                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer del Caso: Botones de demo en vivo y consulta */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Desarrollado y probado bajo altos estándares de estabilidad y rapidez</span>
            </div>

            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Consultar por una solución como esta</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform translate-y-[2px]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
