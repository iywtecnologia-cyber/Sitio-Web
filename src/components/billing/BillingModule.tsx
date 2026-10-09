import React from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

export const BillingModule: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="facturacion" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Presupuestos & Facturación</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Al ser desarrollo a medida,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              no tenemos un precio fijo
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Cada negocio tiene particularidades únicas. El costo depende del análisis del problema y de la implementación de la solución necesaria.
          </p>
        </div>

        {/* Única Tarjeta: Presupuesto personalizado a la medida de tu empresa */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 border border-cyan-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Presupuesto personalizado a la medida de tu empresa</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              ¿Querés evaluar cuánto costaría la solución para tu negocio?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Contanos qué problema necesitás resolver y te orientamos sin costo en el diseño técnico y presupuesto estimado.
            </p>
          </div>

          <button
            onClick={scrollToContact}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Ir a Contacto y Solicitar Presupuesto</span>
            <ArrowRight className="w-4 h-4 translate-y-[2px]" />
          </button>
        </div>

      </div>
    </section>
  );
};
