import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Database, 
  Code2, 
  CheckCircle2, 
  Terminal
} from 'lucide-react';

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'data-cloud' | 'qa-security';
  description: string;
  badge: string;
  badgeColor: string;
}

const TECH_STACK: TechItem[] = [
  // Frontend
  {
    name: 'React 19 & TypeScript',
    category: 'frontend',
    description: 'Interfaces web ultra rápidas y componentes modulares de alto rendimiento.',
    badge: 'Core UI',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    description: 'Diseño responsive de alto rendimiento, micro-interacciones fluidas y componentes accesibles.',
    badge: 'Estilos & UX',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/30',
  },
  {
    name: 'Vite',
    category: 'frontend',
    description: 'Empaquetado instantáneo, optimización de carga para máxima velocidad de respuesta.',
    badge: 'Build Tooling',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
  },

  // Backend & Automatizaciones
  {
    name: 'WhatsApp Business API & Webhooks',
    category: 'backend',
    description: 'Bots conversacionales inteligentes para pedidos, presupuestos, soporte y alertas automáticas en tiempo real.',
    badge: 'Mensajería 24/7',
    badgeColor: 'border-green-500/40 text-green-300 bg-green-950/30',
  },

  // Bases de Datos & Cloud
  {
    name: 'PostgreSQL',
    category: 'data-cloud',
    description: 'Persistencia relacional estricta para catálogos y gestión operativa de datos.',
    badge: 'ACID Database',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/30',
  },
  {
    name: 'Render',
    category: 'data-cloud',
    description: 'Infraestructura cloud con despliegues automatizados (CI/CD) y alta disponibilidad.',
    badge: 'Cloud Host',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
  },

  // Seguridad & QA
  {
    name: 'Auditorías de Ciberseguridad & Hardening',
    category: 'qa-security',
    description: 'Mitigación activa de vulnerabilidades OWASP Top 10, validación de permisos RBAC y cifrado integral de datos sensibles.',
    badge: 'Ciberseguridad',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
  },
  {
    name: 'QA Testing Automatizado (Playwright)',
    category: 'qa-security',
    description: 'Pruebas funcionales de punta a punta (E2E) y verificación continua para garantizar la estabilidad del software.',
    badge: 'Garantía QA',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/30',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todo el Stack', icon: Layers },
  { id: 'frontend', label: 'Frontend', icon: Code2 },
  { id: 'backend', label: 'Automatizaciones', icon: Terminal },
  { id: 'data-cloud', label: 'Bases de Datos & Cloud', icon: Database },
  { id: 'qa-security', label: 'Seguridad & QA', icon: ShieldCheck },
] as const;

export const StackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredTechs = activeTab === 'all' 
    ? TECH_STACK 
    : TECH_STACK.filter(t => t.category === activeTab);

  return (
    <section id="stack" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Tecnologías & Estándares</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Nuestro Stack{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                Tecnológico
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Herramientas probadas en producción que garantizan velocidad de carga, escalabilidad y seguridad informática.
            </p>
          </div>

          {/* Badge de garantía */}
          <div className="px-5 py-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="text-white font-semibold">100% Código Propio & Auditable</div>
              <div className="text-slate-400 font-mono">Sin dependencias innecesarias</div>
            </div>
          </div>
        </div>

        {/* Filtros de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                {isSelected && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-[10px] text-cyan-300 font-mono">
                    {filteredTechs.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grilla de Tecnologías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTechs.map((tech) => (
            <div
              key={tech.name}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {tech.name}
                  </h3>
                  <span className={`text-[8px] sm:text-[8.5px] font-mono uppercase px-1.5 py-0.5 rounded border tracking-tight sm:tracking-normal whitespace-nowrap shrink-0 mt-0.5 ${tech.badgeColor}`}>
                    {tech.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
