// «Golondrina 100% configurable»: es lo primero con lo que se encuentra el cliente al entrar.
// Cerrada muestra solo el botón; al tocarla aparece todo lo que se puede configurar.
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import { GolondrinaLogo } from '../components/LogosProductos';
import { AUTOMATIZABLE, AVISOS, RUBROS, alPedirConfig, guardarConfig, useConfigGolondrina, type ConfigGolondrina } from './configGolondrina';

const chip = (on: boolean) =>
  `px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${on ? 'bg-emerald-400/15 border-emerald-400 text-emerald-100' : 'border-slate-700 text-slate-300 hover:border-cyan-500/60'}`;

export const GolondrinaConfigurable: React.FC = () => {
  const guardada = useConfigGolondrina();
  const [abierta, setAbierta] = useState(false);
  const [c, setC] = useState<ConfigGolondrina>(guardada);
  const caja = useRef<HTMLDivElement>(null);

  // Desde el escenario («⚙️ Configurar») se abre esta misma tarjeta.
  useEffect(() => alPedirConfig(() => {
    setC(guardada);
    setAbierta(true);
    setTimeout(() => caja.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }), [guardada]);

  const alternar = (k: 'automatizar' | 'avisos', id: string) =>
    setC((v) => {
      const lista = v[k] ?? [];
      return { ...v, [k]: lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id] };
    });

  return (
    <div ref={caja} id="golondrina-config" className="scroll-mt-24 rounded-2xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-emerald-500/10 shadow-lg shadow-cyan-500/10">
      <button
        type="button"
        aria-expanded={abierta}
        aria-controls="golondrina-config-opciones"
        onClick={() => { setC(guardada); setAbierta((a) => !a); }}
        className="w-full flex items-center gap-3 p-3 sm:p-4 text-left cursor-pointer"
      >
        <GolondrinaLogo className="w-9 h-10 sm:w-10 sm:h-11 shrink-0" />
        <span className="flex-1 min-w-0">
          <span className="block text-base sm:text-lg font-extrabold text-white leading-tight">
            Golondrina <span className="text-cyan-300">100% configurable</span>
          </span>
          <span className="block text-xs sm:text-sm text-slate-300">
            {guardada.configurada ? '✓ Ya la configuraste a tu medida. Tocá para cambiarla.' : 'Tocá para configurarla antes de empezar: elegís qué hace y qué querés automatizar.'}
          </span>
        </span>
        <span className={`shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold ${guardada.configurada ? 'border border-cyan-400/50 text-cyan-200' : 'bg-cyan-400 text-slate-950 motion-safe:animate-pulse'}`}>
          <Settings2 className="w-4 h-4" /> <span className="hidden min-[400px]:inline">{guardada.configurada ? 'Cambiar' : 'Configurar'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${abierta ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {abierta && (
        <div id="golondrina-config-opciones" data-sin-asistente className="px-3 sm:px-4 pb-4 border-t border-slate-800/80 pt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-white">1. ¿De qué rubro es tu negocio?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {RUBROS.map((r) => (
                <button key={r} type="button" aria-pressed={c.rubro === r} onClick={() => setC((v) => ({ ...v, rubro: r }))} className={chip(c.rubro === r)}>{r}</button>
              ))}
            </div>
            <p className="mt-4 text-sm font-bold text-white">2. ¿Qué hace Golondrina mientras navegás?</p>
            <div className="mt-2 space-y-1.5 text-sm text-slate-300">
              {([
                ['registrar', 'Anotar lo que hacen los asistentes'],
                ['repetir', 'Preguntarme si quiero repetir una tarea'],
                ['destino', 'Mostrarme adónde me llevó cada asistente'],
              ] as const).map(([k, t]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-cyan-400 w-4 h-4" checked={c[k]} onChange={(e) => setC((v) => ({ ...v, [k]: e.target.checked }))} />
                  {t}
                </label>
              ))}
            </div>
            <p className="mt-4 text-sm font-bold text-white">3. ¿Cómo querés que te avise?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {AVISOS.map(([id, t]) => {
                const on = (c.avisos ?? []).includes(id);
                return <button key={id} type="button" aria-pressed={on} onClick={() => alternar('avisos', id)} className={chip(on)}>{t}</button>;
              })}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white">4. ¿Qué te gustaría automatizar?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {AUTOMATIZABLE.map(([id, e, t]) => {
                const on = c.automatizar.includes(id);
                return (
                  <button key={id} type="button" aria-pressed={on} onClick={() => alternar('automatizar', id)} className={chip(on)}>
                    <span aria-hidden="true">{e}</span> {t.replace(/\.$/, '')}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">🔒 Se guarda solo en tu navegador. Lo podés cambiar cuando quieras.</p>
            <button
              type="button"
              onClick={() => {
                guardarConfig({ ...c, configurada: true });
                setAbierta(false);
              }}
              className="mt-3 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-sm font-bold hover:bg-cyan-300 cursor-pointer"
            >
              {guardada.configurada ? 'Guardar cambios' : 'Guardar y empezar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
