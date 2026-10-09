import React, { useState } from 'react';
import { 
  Calendar, 
  Wallet, 
  Store, 
  UserCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface ProjectCase {
  id: string;
  category: string;
  title: string;
  highlightNumber: string;
  highlightText: string;
  icon: React.ElementType;
  badgeColor: string;
  problema: string;
  solucion: string;
  resultado: string;
}

const PROJECTS_DATA: ProjectCase[] = [
  {
    id: 'estetica-laser',
    category: 'Gestión de Turnos',
    title: 'Agenda Médica & Turnos',
    highlightNumber: '0 turnos pisados',
    highlightText: 'Detección automática de solapamientos',
    icon: Calendar,
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    problema: 'Coordinación manual en agendas genéricas que provocaba horarios superpuestos por diferencias de duración entre tratamientos.',
    solucion: 'Sistema web a medida con bloqueo automático de solapamientos, duraciones por tratamiento, impresión de agenda y confirmación por WhatsApp en 1 clic.',
    resultado: 'Agenda diaria 100% clara, sin turnos pisados y confirmaciones inmediatas a clientes.'
  },
  {
    id: 'ingresos-egresos',
    category: 'Control de Ingresos y Egresos',
    title: 'Control de Ingresos y Egresos',
    highlightNumber: 'Seguimiento en $ARS',
    highlightText: 'Control de señas y saldos por cobrar',
    icon: Wallet,
    badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-950/30',
    problema: 'Anotaciones sueltas y descontrol sobre fechas reservadas, qué señas se cobraron y qué saldos quedaban pendientes por cobrar.',
    solucion: 'Plataforma con calendario operativo, registro de señas abonadas, cálculo automático de saldos en $ARS y alertas de cobro.',
    resultado: 'Visualización instantánea de cada evento, cobros al día y cero desfasajes de dinero.'
  },
  {
    id: 'don-ramon',
    category: 'Punto de Venta & Stock',
    title: 'Gestión integral de comercio',
    highlightNumber: 'Tiempo real',
    highlightText: 'Stock sincronizado en caja y depósito',
    icon: Store,
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    problema: 'Ventas lentas en mostrador, stock desfasado y dificultad para controlar productos por vencer y el arqueo de caja diario.',
    solucion: 'Punto de venta web (POS) ultrarrápido con sincronización en tiempo real entre mostrador y depósito, liquidación y control de vencimientos.',
    resultado: 'Ventas ágiles desde el navegador sin instalar software, caja cuadrada al centavo y stock siempre al día.'
  },
  {
    id: 'consultorio-marie',
    category: 'Gestión de Pacientes',
    title: 'Agenda odontológica y fichas',
    highlightNumber: 'Todo en un lugar',
    highlightText: 'Ficha médica, obra social y contacto directo',
    icon: UserCheck,
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/30',
    problema: 'Fichas de pacientes, obras sociales y seguimiento de llamados dispersos entre cuadernos de papel y chats de WhatsApp.',
    solucion: 'Ficha digital centralizada por paciente con historial, obra social, adjuntos y botones de contacto directo a WhatsApp y correo.',
    resultado: 'Acceso inmediato al expediente completo y comunicación con el paciente en un solo clic.'
  },
  {
    id: 'control-financiero',
    category: 'Flujo de Caja & Rentabilidad',
    title: 'Dashboard de Finanzas y Rentabilidad',
    highlightNumber: 'Dashboard en vivo',
    highlightText: 'Ingresos y gastos categorizados al día',
    icon: TrendingUp,
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
    problema: 'Dificultad para visualizar ganancias reales y fuga de gastos al depender de planillas complejas o anotaciones manuales.',
    solucion: 'Dashboard financiero interactivo con categorización ágil de gastos, métricas en vivo y exportación instantánea de reportes.',
    resultado: 'Claridad total del flujo de fondos diario y toma de decisiones con números exactos.'
  }
];

export const PortfolioSection: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);

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
        <div className="max-w-3xl mb-8 sm:mb-10">
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
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Casos reales donde reemplazamos tareas manuales, agendas desordenadas y planillas sueltas por sistemas web intuitivos, rápidos y testeados a fondo.
          </p>
        </div>

        {/* Selector de Proyectos (Pestañas horizontales limpias, sin nombres de clientes) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {PROJECTS_DATA.map((p) => {
            const Icon = p.icon;
            const isSelected = p.id === selectedProjectId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{p.category}</span>
              </button>
            );
          })}
        </div>

        {/* Tarjeta Detallada del Proyecto Seleccionado */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-md">
          
          {/* Header del Caso */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <ActiveIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border tracking-wider ${activeProject.badgeColor}`}>
                    {activeProject.category}
                  </span>
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

          {/* Los 3 Bloques Resumidos del Caso: Problema, Solución y Resultado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            
            {/* 1. El Problema */}
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-3">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-bold uppercase tracking-wider">1. El Problema</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeProject.problema}
                </p>
              </div>
            </div>

            {/* 2. Solución Desarrollada */}
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold uppercase tracking-wider">2. Solución Desarrollada</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeProject.solucion}
                </p>
              </div>
            </div>

            {/* 3. Resultado Tangible */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950/80 to-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold uppercase tracking-wider">3. Resultado Tangible</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {activeProject.resultado}
                </p>
              </div>
            </div>

          </div>

          {/* Footer del Caso: Botón de consulta específico con flecha alineada */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Desarrollado y probado bajo altos estándares de estabilidad y rapidez</span>
            </div>

            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
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
