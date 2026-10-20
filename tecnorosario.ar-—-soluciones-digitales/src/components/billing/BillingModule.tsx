import React, { useMemo, useState } from 'react';
import { Calculator, Check, Mail, MessageCircle, ShieldCheck, Sparkles, Workflow, Wrench } from 'lucide-react';
import { PRECIOS, ABONOS, pesos } from '../../data/precios';
import { whatsappLink, gmailLink } from '../../data/contact';

// Presupuestador: el visitante marca los servicios que le interesan y ve un rango estimado.
// Después puede mandar la selección por WhatsApp o e-mail para pedir el presupuesto cerrado.
export const BillingModule: React.FC = () => {
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [abonosElegidos, setAbonosElegidos] = useState<string[]>([]);
  const abonos = ABONOS.filter((a) => abonosElegidos.includes(a.id));
  const mensualTotal = abonos.reduce((t, a) => t + (a.mensual ?? 0), 0);
  const precioAbono = (a: { mensual: number | null }) => (a.mensual === null ? 'a consultar' : `desde ${pesos(a.mensual)}/mes`);
  const soporte = abonos.length > 0;
  const alternarAbono = (id: string) =>
    setAbonosElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const alternar = (id: string) =>
    setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const seleccion = PRECIOS.filter((p) => elegidos.includes(p.id));
  const total = useMemo(
    () => seleccion.reduce((t, p) => ({ min: t.min + p.min, max: t.max + p.max }), { min: 0, max: 0 }),
    [seleccion]
  );

  const mensaje = [
    'Hola tecnoros.ar, usé el presupuestador de la web y me interesa:',
    ...seleccion.map((p) => `- ${p.servicio} (${pesos(p.min)} a ${pesos(p.max)})`),
    ...abonos.map((a) => `- ${a.nombre} (abono mensual, ${a.mensual === null ? 'precio a consultar' : `desde ${pesos(a.mensual)} por mes`})`),
    `Estimado: ${pesos(total.min)} a ${pesos(total.max)}.`,
    'Quiero pedir el diagnóstico gratuito y un presupuesto cerrado.',
  ].join('\n');

  return (
    <section id="facturacion" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-full lg:max-w-6xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Presupuestador</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Calculá cuánto{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              invertirías en tu solución
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl sm:max-w-3xl">
            Marcá lo que te interesa y te mostramos un rango estimado. El diagnóstico es 100% gratuito y antes de empezar te pasamos un presupuesto cerrado por escrito.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Servicios para elegir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRECIOS.map((p) => {
              const activo = elegidos.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => alternar(p.id)}
                  aria-pressed={activo}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    activo
                      ? 'bg-cyan-950/40 border-cyan-400/70 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                      activo ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-500'
                    }`}
                  >
                    {activo && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-white">{p.servicio}</span>
                    <span className="block mt-1 text-sm text-slate-400 leading-snug">{p.incluye}</span>
                    <span className="block mt-2 text-sm font-semibold text-cyan-300">
                      {pesos(p.min)} a {pesos(p.max)}
                    </span>
                  </span>
                </button>
              );
            })}
            {ABONOS.map((a) => {
              const activo = abonosElegidos.includes(a.id);
              const Icono = a.id === 'tero' ? ShieldCheck : a.id === 'golondrina' ? Workflow : Wrench;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => !a.proximamente && alternarAbono(a.id)}
                  disabled={a.proximamente}
                  aria-pressed={activo}
                  className={`sm:col-span-2 text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-wrap items-center gap-x-3 gap-y-1 ${
                    activo ? 'bg-violet-950/40 border-violet-400/70' : 'bg-slate-900/50 border-slate-800 border-dashed hover:border-slate-600'
                  } ${a.proximamente ? 'opacity-70 cursor-default' : ''}`}
                >
                  <span
                    className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                      activo ? 'bg-violet-400 border-violet-400 text-slate-950' : 'border-slate-500'
                    }`}
                  >
                    {activo && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </span>
                  <Icono className="hidden sm:block w-4 h-4 text-violet-300 shrink-0" />
                  <span className="flex-1 min-w-0 text-sm text-slate-300">
                    <b className="text-white">{a.nombre}</b> · {a.detalle}
                  </span>
                  <span className="basis-full sm:basis-auto pl-8 sm:pl-0 text-sm font-semibold text-violet-300 whitespace-nowrap">{a.proximamente ? 'Próximamente' : a.mensual === null ? 'Abono mensual · a consultar' : `desde ${pesos(a.mensual)}/mes`}</span>
                </button>
              );
            })}
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-28 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Tu estimado</span>
            </div>
            {seleccion.length === 0 && !soporte ? (
              <p className="mt-3 text-slate-300">Elegí uno o más servicios para ver el rango estimado.</p>
            ) : (
              <>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                  {seleccion.map((p) => (
                    <li key={p.id} className="flex justify-between gap-3">
                      <span>{p.servicio}</span>
                      <span className="text-slate-400 whitespace-nowrap">desde {pesos(p.min)}</span>
                    </li>
                  ))}
                  {abonos.map((a) => (
                    <li key={a.id} className="flex justify-between gap-3">
                      <span>{a.nombre}</span>
                      <span className="text-slate-400 whitespace-nowrap">{precioAbono(a)}</span>
                    </li>
                  ))}
                </ul>
                {seleccion.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/70">
                    <div className="text-xs text-slate-400">Inversión estimada</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                      {pesos(total.min)}
                      <span className="text-slate-400 text-lg font-semibold"> a </span>
                      {pesos(total.max)}
                    </div>
                    {mensualTotal > 0 && <div className="mt-1 text-sm text-violet-300">+ desde {pesos(mensualTotal)} por mes</div>}
                  </div>
                )}
              </>
            )}

            <div className="mt-5 grid grid-cols-1 gap-2.5">
              <a
                href={whatsappLink(seleccion.length || soporte ? mensaje : 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Pedir presupuesto por WhatsApp
              </a>
              <a
                href={gmailLink('Presupuesto desde la web - tecnoros.ar', seleccion.length || soporte ? mensaje : 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-600 hover:border-cyan-400/60 text-slate-200 font-semibold text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Pedir por e-mail
              </a>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
              Precios de referencia en pesos. Los valores están calculados según el dólar oficial al mes de octubre y pueden variar. Los costos de terceros (WhatsApp Business API, inteligencia artificial, hosting) se cobran aparte según el uso. El diagnóstico es gratis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
