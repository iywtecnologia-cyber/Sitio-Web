import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { COMBOS, ahorro } from '../../data/combos';
import { pesos } from '../../data/precios';
import { consultarPor } from '../../consulta';

// Combos de servicios con precio "desde" y cuánto ahorrás frente a contratarlos por separado.
export const Combos: React.FC = () => (
  <section id="combos" className="scroll-mt-24 py-14 sm:py-20 border-t border-slate-800/50">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">Combos</span>
      <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Juntos te salen menos</h2>
      <p className="mt-2 text-base sm:text-lg text-slate-400 max-w-2xl">Elegí un combo y te lo armamos a medida. El precio final lo confirmamos en el diagnóstico gratuito.</p>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMBOS.map((c) => (
          <li
            key={c.id}
            className={`relative flex flex-col p-5 rounded-2xl border ${
              c.destacado ? 'bg-gradient-to-b from-cyan-950/50 to-slate-950 border-cyan-400/70 ring-1 ring-cyan-400/30' : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            {c.destacado && (
              <span className="absolute -top-3 left-5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[11px] font-bold">
                <Sparkles className="w-3 h-3" /> Recomendado para empezar
              </span>
            )}
            <h3 className="text-lg font-extrabold text-white">{c.nombre}</h3>
            <p className="mt-1 text-sm text-slate-400">{c.para}</p>
            <ul className="mt-4 space-y-1.5 flex-1">
              {c.incluye.map((i) =>
                i === 'Diagnóstico gratuito' ? (
                  <li key={i} className="flex items-center gap-2 px-2.5 py-1.5 -mx-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-sm font-bold text-emerald-200">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" /> {i}
                  </li>
                ) : (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {i}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="block text-xs text-slate-500 line-through">Por separado {pesos(c.separado)}</span>
              <span className="block text-sm text-slate-400">Desde</span>
              <span className="block text-2xl font-black text-white">{pesos(c.desde)}</span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                Ahorrás {ahorro(c)}%
              </span>
              {c.mensual && <span className="block mt-2 text-xs text-slate-400">{c.mensual}</span>}
            </div>
            <button
              type="button"
              onClick={() => consultarPor(`combo-${c.id}`)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-sm font-bold hover:bg-cyan-400/20 cursor-pointer"
            >
              Quiero este combo <ArrowRight className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">Precios en pesos argentinos, de referencia. El abono mensual de soporte es opcional.</p>
    </div>
  </section>
);
