import React, { useState } from 'react';
import { Layers, ShieldCheck, ChevronDown } from 'lucide-react';
import { RAZONES, SERVICIOS } from './inicio/Inicio';
import { irA } from '../rutas';

// ¿Qué ofrecemos? / ¿Qué nos diferencia?: van en Servicios (antes estaban en Nosotros).
// Se abre una a la vez; cada servicio lleva directo a su tarjeta, resaltada.
export const PreguntasClave: React.FC = () => {
  const [abierta, setAbierta] = useState<'ofrecemos' | 'diferencia' | null>(null);
  // Al abrir una, la página baja hasta esa parte para que se vea entera.
  const toggle = (cual: 'ofrecemos' | 'diferencia') =>
    setAbierta((v) => {
      const nueva = v === cual ? null : cual;
      if (nueva) window.setTimeout(() => document.getElementById(`pregunta-${nueva}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return nueva;
    });
  return (
    <div className="mb-10 sm:mb-12">
      {/* Las dos preguntas como desplegables: se abre una a la vez. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div id="pregunta-ofrecemos" className={`scroll-mt-24 rounded-2xl bg-slate-900/60 border transition-colors ${abierta === 'ofrecemos' ? 'border-cyan-500/40' : 'border-slate-800/90'}`}>
          <button type="button" onClick={() => toggle('ofrecemos')} aria-expanded={abierta === 'ofrecemos'} className="w-full text-left cursor-pointer p-5 sm:p-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-5 h-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg sm:text-xl font-bold text-white">¿Qué ofrecemos?</span>
              <span className="block text-sm text-slate-400">Servicios a medida y productos propios</span>
            </span>
            <ChevronDown className={`w-5 h-5 text-cyan-300 shrink-0 transition-transform ${abierta === 'ofrecemos' ? 'rotate-180' : ''}`} />
          </button>
          {abierta === 'ofrecemos' && <div className="px-5 sm:px-6 pb-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICIOS.map(({ icon: Icon, titulo, ir }) => (
                <li key={titulo}>
                  <a
                    href={`/servicios#${ir}`}
                    onClick={(e) => { e.preventDefault(); irA(ir, true, 'center'); }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 text-sm text-slate-200 transition-colors">
                    <Icon className="w-4 h-4 text-cyan-300 shrink-0" /> {titulo}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-300">
              Y productos propios: <a href="/productos" className="text-cyan-300 underline underline-offset-4">Golondrina, CHAJÁ y TERO Security</a>.
            </p>
          </div>}
        </div>

        <div id="pregunta-diferencia" className={`scroll-mt-24 rounded-2xl bg-slate-900/60 border transition-colors ${abierta === 'diferencia' ? 'border-violet-500/40' : 'border-slate-800/90'}`}>
          <button type="button" onClick={() => toggle('diferencia')} aria-expanded={abierta === 'diferencia'} className="w-full text-left cursor-pointer p-5 sm:p-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg sm:text-xl font-bold text-white">¿Qué nos diferencia?</span>
              <span className="block text-sm text-slate-400">Por qué trabajar con nosotros</span>
            </span>
            <ChevronDown className={`w-5 h-5 text-violet-300 shrink-0 transition-transform ${abierta === 'diferencia' ? 'rotate-180' : ''}`} />
          </button>
          {abierta === 'diferencia' && <ul className="px-5 sm:px-6 pb-6 space-y-3">
            {RAZONES.map(({ icon: Icon, titulo, linea }) => (
              <li key={titulo} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{titulo}</span>
                  <span className="block text-sm text-slate-400 leading-snug">{linea}</span>
                </span>
              </li>
            ))}
          </ul>}
        </div>
      </div>
    </div>
  );
};
