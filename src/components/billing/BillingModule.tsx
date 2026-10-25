import React, { useMemo, useState } from 'react';
import { 
  Calculator, 
  Check, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Workflow, 
  Wrench, 
  Bot, 
  Palette, 
  Cpu, 
  HardDrive, 
  Layers, 
  Info,
  DollarSign
} from 'lucide-react';
import { 
  DISPOSITIVOS_HARDWARE, 
  SERVICIOS_SOFTWARE, 
  ABONOS, 
  OPCION_FILAMENTO_HARDWARE, 
  pesos, 
  dolares,
  Precio 
} from '../../data/precios';
import { whatsappLink, gmailLink } from '../../data/contact';

// Presupuestador: separa con total claridad la compra de DISPOSITIVOS FÍSICOS (Hardware pago único),
// DESARROLLO DE SOFTWARE y los ABONOS MENSUALES (servicios recurrentes opcionales de nube y soporte).
export const BillingModule: React.FC = () => {
  const [hardwareElegidos, setHardwareElegidos] = useState<string[]>([]);
  const [softwareElegidos, setSoftwareElegidos] = useState<string[]>([]);
  const [abonosElegidos, setAbonosElegidos] = useState<string[]>([]);
  const [filamentoPersonalizado, setFilamentoPersonalizado] = useState(false);
  const [cantidadChaja, setCantidadChaja] = useState(1);
  const [cantidadVoz, setCantidadVoz] = useState(0);
  const [planVoz, setPlanVoz] = useState<'esencial' | 'profesional' | 'industrial'>('profesional');
  const planesVoz = { esencial: { usd: 9, alertas: 500 }, profesional: { usd: 19, alertas: 2000 }, industrial: { usd: 39, alertas: 5000 } };
  const chajaSeleccionado = hardwareElegidos.includes('dispositivo-chaja');
  const precioVoz = planesVoz[planVoz];
  const vozMensualUsd = cantidadVoz * precioVoz.usd;

  // Toggle selection
  const alternarHardware = (id: string) => {
    setHardwareElegidos((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // Si se deselecciona todo el hardware, se resetea la opción de filamento
      if (next.length === 0) setFilamentoPersonalizado(false);
      if (id === 'dispositivo-chaja' && !next.includes(id)) setCantidadVoz(0);
      return next;
    });
  };

  const alternarSoftware = (id: string) => {
    setSoftwareElegidos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const alternarAbono = (id: string) => {
    setAbonosElegidos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const seleccionHardware = DISPOSITIVOS_HARDWARE.filter((h) => hardwareElegidos.includes(h.id));
  const seleccionSoftware = SERVICIOS_SOFTWARE.filter((s) => softwareElegidos.includes(s.id));
  const seleccionAbonos = ABONOS.filter((a) => abonosElegidos.includes(a.id));

  const tieneHardware = seleccionHardware.length > 0;
  const aplicarFilamento = tieneHardware && filamentoPersonalizado;

  // Totales
  const totalUsdHardware = seleccionHardware.reduce((acc, h) => acc + (h.precioUsd ?? 0) * (h.id === 'dispositivo-chaja' ? cantidadChaja : 1), 0);
  const totalArsHardware = seleccionHardware.reduce((acc, h) => acc + h.min * (h.id === 'dispositivo-chaja' ? cantidadChaja : 1), 0);

  const totalSoftware = useMemo(() => {
    return seleccionSoftware.reduce(
      (t, p) => ({ min: t.min + p.min, max: t.max + p.max }),
      { min: 0, max: 0 }
    );
  }, [seleccionSoftware]);

  const totalPagoUnicoArs = useMemo(() => {
    const min = totalArsHardware + totalSoftware.min + (aplicarFilamento ? OPCION_FILAMENTO_HARDWARE.min : 0);
    const max = totalArsHardware + totalSoftware.max + (aplicarFilamento ? OPCION_FILAMENTO_HARDWARE.max : 0);
    return { min, max };
  }, [totalArsHardware, totalSoftware, aplicarFilamento]);

  const mensualTotal = seleccionAbonos.reduce((t, a) => t + (a.mensual ?? 0), 0);

  // Mensaje para WhatsApp y Mail
  const itemsMensaje: string[] = [];

  if (seleccionHardware.length > 0) {
    itemsMensaje.push('📦 DISPOSITIVOS FÍSICOS (Hardware único):');
    seleccionHardware.forEach((h) => {
      const unidades = h.id === 'dispositivo-chaja' ? cantidadChaja : 1;
      itemsMensaje.push(`  • ${h.servicio} (${unidades} unidad/es): ${h.id === 'dispositivo-chaja' ? 'Precio del equipo a confirmar' : `${h.precioUsd ? dolares(h.precioUsd * unidades) : ''} (~${pesos(h.min * unidades)})`}`);
    });
    if (aplicarFilamento) {
      itemsMensaje.push(`  • Carcasa en color a medida: +${pesos(OPCION_FILAMENTO_HARDWARE.min)} (~${dolares(OPCION_FILAMENTO_HARDWARE.usd)})`);
    } else {
      itemsMensaje.push(`  • Carcasa: Color Negro Mate industrial de serie (incluido)`);
    }
  }

  if (cantidadVoz > 0 && chajaSeleccionado) {
    itemsMensaje.push(`🔊 CHAJÁ Voz Inteligente: ${cantidadVoz} licencia/s (${planVoz}, hasta ${precioVoz.alertas} alertas mensuales por equipo): USD ${vozMensualUsd}/mes. Requiere activación y servicio Azure configurado.`);
  }

  if (seleccionSoftware.length > 0) {
    itemsMensaje.push('💻 SOFTWARE & AUTOMATIZACIONES (Pago único):');
    seleccionSoftware.forEach((s) => {
      itemsMensaje.push(`  • ${s.servicio} (${pesos(s.min)} a ${pesos(s.max)})`);
    });
  }

  if (seleccionAbonos.length > 0) {
    itemsMensaje.push('🔄 ABONOS MENSUALES (Cloud/Soporte recurrente):');
    seleccionAbonos.forEach((a) => {
      itemsMensaje.push(`  • ${a.nombre}: ${a.mensual ? `${pesos(a.mensual)}/mes` : 'A consultar'}`);
    });
  }

  const resumenInversion: string[] = [];
  if (totalUsdHardware > 0) {
    resumenInversion.push(`Hardware: ${dolares(totalUsdHardware)}`);
  }
  if (totalPagoUnicoArs.max > 0) {
    resumenInversion.push(`Total inicial estimado: ${pesos(totalPagoUnicoArs.min)} a ${pesos(totalPagoUnicoArs.max)}`);
  }
  if (vozMensualUsd > 0) resumenInversion.push(`Voz CHAJÁ: USD ${vozMensualUsd}/mes (${cantidadVoz} equipo/s)`);
  if (mensualTotal > 0) {
    resumenInversion.push(`Abono recurrente: ${pesos(mensualTotal)}/mes`);
  }

  const mensaje = [
    'Hola tecnoros.ar, coticé en el presupuestador web y me interesa:',
    '',
    ...itemsMensaje,
    '',
    '📊 RESUMEN ESTIMADO:',
    ...resumenInversion,
    '',
    'Quiero solicitar el diagnóstico inicial y recibir un presupuesto formal.',
  ].join('\n');

  const tieneSeleccion = seleccionHardware.length > 0 || seleccionSoftware.length > 0 || seleccionAbonos.length > 0;

  return (
    <section id="facturacion" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-full lg:max-w-6xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Presupuestador Transparente</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Calculá cuánto{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              invertirías en tu solución
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Diferenciamos con total claridad la compra de <strong className="text-white">dispositivos físicos de hardware</strong>, el <strong className="text-white">desarrollo de software a medida</strong> y los <strong className="text-white">abonos mensuales opcionales</strong> de soporte o telemetría.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8 items-start">
          {/* Columna Izquierda: Opciones estructuradas */}
          <div className="space-y-8">
            
            {/* SECCIÓN 1: DISPOSITIVOS FÍSICOS (HARDWARE PAGO ÚNICO) */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-cyan-500/30 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>Dispositivos Físicos · Fabricación Propia</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    1. Compra de Aparatos Hardware (Pago Único)
                  </h3>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  Equipos reales plug & play
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                Aparatos electrónicos físicos diseñados e integrados por nuestro equipo. Vienen con firmware embebido autónomo y carcasa técnica impresa en 3D en <strong className="text-white">Negro Mate industrial</strong> de serie. <strong className="text-cyan-300">No requieren abono mensual para funcionar de forma local</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DISPOSITIVOS_HARDWARE.map((h) => {
                  const activo = hardwareElegidos.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => alternarHardware(h.id)}
                      aria-pressed={activo}
                      className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        activo
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
                              activo ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-500'
                            }`}
                          >
                            {activo && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                          </span>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {h.id === 'dispositivo-chaja' ? 'A consultar' : h.precioUsd ? dolares(h.precioUsd) : ''}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base mt-2.5 leading-snug">{h.servicio}</h4>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{h.incluye}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Referencia ARS:</span>
                        <span className="text-sm font-extrabold text-cyan-300">
                          {h.id === 'dispositivo-chaja' ? 'A consultar' : `~${pesos(h.min)}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {chajaSeleccionado && (
                <div className="mt-5 p-4 rounded-2xl border border-cyan-500/40 bg-slate-950/70 space-y-4">
                  <h4 className="font-bold text-white">CHAJÁ · Equipos y voz opcional por dispositivo</h4>
                  <label className="block text-sm text-slate-300">Cantidad de CHAJÁ a comprar
                    <input aria-label="Cantidad de equipos CHAJÁ" type="number" min={1} max={100} value={cantidadChaja} onChange={e => { const n = Math.max(1, Math.min(100, Number(e.target.value) || 1)); setCantidadChaja(n); setCantidadVoz(v => Math.min(v,n)); }} className="block mt-2 w-24 bg-slate-900 border border-slate-600 rounded-lg p-2 text-white" />
                  </label>
                  <label className="block text-sm text-slate-300">¿En cuántos CHAJÁ querés activar voz hablada? (0 = sin voz)
                    <input aria-label="Licencias de voz CHAJÁ" type="number" min={0} max={cantidadChaja} value={cantidadVoz} onChange={e => setCantidadVoz(Math.max(0,Math.min(cantidadChaja,Number(e.target.value)||0)))} className="block mt-2 w-24 bg-slate-900 border border-slate-600 rounded-lg p-2 text-white" />
                  </label>
                  {cantidadVoz > 0 && <label className="block text-sm text-slate-300">Plan por equipo
                    <select aria-label="Plan de voz CHAJÁ" value={planVoz} onChange={e => setPlanVoz(e.target.value as typeof planVoz)} className="block mt-2 w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white">
                      <option value="esencial">Esencial · 500 alertas/mes · USD 9/equipo/mes</option>
                      <option value="profesional">Profesional · 2.000 alertas/mes · USD 19/equipo/mes</option>
                      <option value="industrial">Industrial · 5.000 alertas/mes · USD 39/equipo/mes</option>
                    </select>
                  </label>}
                  <p className="text-sm font-semibold text-cyan-300">Voz: USD {vozMensualUsd}/mes · {cantidadVoz} licencia/s independientes</p>
                  <p className="text-xs text-slate-400">Servicio opcional, no incluido en el hardware. Precios comerciales orientativos; activación y disponibilidad sujetas a configuración de Azure AI Speech. La campanilla local no necesita suscripción. El límite se mide por equipo; no se comparte entre dispositivos.</p>
                </div>
              )}

              {/* Opción de Filamento de Color: SOLO se muestra si se seleccionó al menos un dispositivo físico */}
              {tieneHardware && (
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-400/50 shadow-lg shadow-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm sm:text-base">
                          Personalización de Color de Filamento 3D
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                          Exclusivo para Hardware
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-snug">
                        De serie se imprimen en <strong className="text-white">Negro Mate industrial</strong> (sin cargo extra). Si preferís la carcasa con el color o identidad de tu marca, sumás una bobina técnica dedicada.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFilamentoPersonalizado(!filamentoPersonalizado)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      filamentoPersonalizado
                        ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${filamentoPersonalizado ? 'bg-slate-950 border-slate-950 text-cyan-400' : 'border-slate-500'}`}>
                      {filamentoPersonalizado && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span>{filamentoPersonalizado ? 'Color a medida incluido' : `+ Color a medida (${pesos(OPCION_FILAMENTO_HARDWARE.min)})`}</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECCIÓN 2: SOFTWARE & AUTOMATIZACIONES (PAGO ÚNICO) */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase tracking-wider font-bold mb-1">
                <Workflow className="w-4 h-4" />
                <span>Desarrollo de Software & Robótica · Implementación</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                2. Software, Automatizaciones & Plataformas (Pago Único)
              </h3>
              <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                Desarrollo e ingeniería a medida para tu empresa. Antes de comenzar relevamos las necesidades y te entregamos un prototipo funcional sin costo de diagnóstico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SERVICIOS_SOFTWARE.map((s) => {
                  const activo = softwareElegidos.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => alternarSoftware(s.id)}
                      aria-pressed={activo}
                      className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                        activo
                          ? 'bg-violet-950/40 border-violet-400/80 shadow-lg shadow-violet-500/10'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                          activo ? 'bg-violet-400 border-violet-400 text-slate-950' : 'border-slate-500'
                        }`}
                      >
                        {activo && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="block font-bold text-white text-sm sm:text-base">{s.servicio}</span>
                          {s.badge && (
                            <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <span className="block mt-1 text-xs sm:text-sm text-slate-400 leading-snug">{s.incluye}</span>
                        <span className="block mt-2.5 text-xs sm:text-sm font-semibold text-violet-300">
                          {pesos(s.min)} a {pesos(s.max)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 3: ABONOS MENSUALES (SERVICIO RECURRENTE OPCIONAL) */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-dashed border-slate-700 shadow-xl">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-bold mb-1">
                <HardDrive className="w-4 h-4" />
                <span>Servicios de Nube & Monitoreo · Opcional Recurrente</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                3. Abonos Mensuales de Nube & Soporte
              </h3>
              
              <div className="p-3.5 mb-5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                <span>
                  <strong className="text-white">Aclaración importante:</strong> Los abonos mensuales son servicios de software en la nube, actualizaciones de firmas y soporte continuo. <strong className="text-white">NO son los aparatos físicos</strong>. Podés comprar un dispositivo físico sin contratar abono, o sumar el abono para delegar el monitoreo.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ABONOS.map((a) => {
                  const activo = abonosElegidos.includes(a.id);
                  const Icono = a.id === 'tero' ? ShieldCheck : a.id === 'golondrina' ? Workflow : a.id === 'carancho' ? Bot : Wrench;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => !a.proximamente && alternarAbono(a.id)}
                      disabled={a.proximamente}
                      aria-pressed={activo}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        activo ? 'bg-sky-950/40 border-sky-400 shadow-md shadow-sky-500/10' : 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                      } ${a.proximamente ? 'opacity-65 cursor-default' : ''}`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span
                          className={`mt-0.5 sm:mt-0 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                            activo ? 'bg-sky-400 border-sky-400 text-slate-950' : 'border-slate-500'
                          }`}
                        >
                          {activo && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </span>
                        <Icono className="hidden sm:block w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm sm:text-base">{a.nombre}</span>
                            {a.esServicioParaHardware && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                Servicio Cloud para Hardware
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{a.detalle}</p>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 pl-8 sm:pl-0">
                        <span className="text-sm font-extrabold text-sky-300 whitespace-nowrap">
                          {a.proximamente ? 'Próximamente' : a.mensual === null ? 'A consultar' : `desde ${pesos(a.mensual)}/mes`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Columna Derecha: Ticket de Inversión Fijo */}
          <div className="lg:sticky lg:top-28 p-6 rounded-3xl bg-gradient-to-br from-[#0B1220] via-slate-900 to-cyan-950/50 border border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Ticket de Presupuesto</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                tecnoros.ar
              </span>
            </div>

            {!tieneSeleccion ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                <Calculator className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>Marcá los dispositivos físicos, software o abonos que te interesen para ver el desglose en tiempo real.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Desglose Hardware */}
                {seleccionHardware.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Hardware Físico (Pago Único)</span>
                    </div>
                    {seleccionHardware.map((h) => (
                      <div key={h.id} className="flex justify-between items-baseline gap-2 text-xs text-slate-300">
                        <span className="truncate">{h.servicio.replace(' (Hardware Appliance)', '').replace(' (Hardware Riel DIN)', '')}</span>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-white font-mono">{h.precioUsd ? dolares(h.precioUsd * (h.id === 'dispositivo-chaja' ? cantidadChaja : 1)) : ''}</span>
                          <span className="block text-[10px] text-slate-400">(~{pesos(h.min * (h.id === 'dispositivo-chaja' ? cantidadChaja : 1))})</span>
                        </div>
                      </div>
                    ))}
                    {aplicarFilamento && (
                      <div className="flex justify-between items-baseline gap-2 text-xs text-cyan-300 pl-2 border-l-2 border-cyan-400">
                        <span>🎨 Color de Carcasa a Medida</span>
                        <span className="font-mono text-white">+{pesos(OPCION_FILAMENTO_HARDWARE.min)}</span>
                      </div>
                    )}
                  </div>
                )}

                {cantidadVoz > 0 && chajaSeleccionado && <div className="text-xs text-cyan-300 border-t border-slate-700 pt-2">CHAJÁ Voz Inteligente · {cantidadVoz} licencia/s · USD {vozMensualUsd}/mes ({planVoz})</div>}

                {/* Desglose Software */}
                {seleccionSoftware.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-violet-400 font-bold flex items-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5" />
                      <span>Software & Automatización (Pago Único)</span>
                    </div>
                    {seleccionSoftware.map((s) => (
                      <div key={s.id} className="flex justify-between items-baseline gap-2 text-xs text-slate-300">
                        <span className="truncate">{s.servicio}</span>
                        <span className="text-slate-400 shrink-0 text-[11px]">desde {pesos(s.min)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desglose Abonos */}
                {seleccionAbonos.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Abonos Cloud & Soporte (Mensual)</span>
                    </div>
                    {seleccionAbonos.map((a) => (
                      <div key={a.id} className="flex justify-between items-baseline gap-2 text-xs text-slate-300">
                        <span className="truncate">{a.nombre}</span>
                        <span className="text-sky-300 shrink-0 font-medium">
                          {a.mensual ? `${pesos(a.mensual)}/mes` : 'A consultar'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totales Resumen */}
                <div className="mt-4 pt-4 border-t-2 border-slate-700/80 space-y-2">
                  {(seleccionHardware.length > 0 || seleccionSoftware.length > 0) && (
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Inversión Inicial Estimada (Pago Único):</div>
                      <div className="text-2xl font-black text-white">
                        {pesos(totalPagoUnicoArs.min)}
                        {totalPagoUnicoArs.min !== totalPagoUnicoArs.max && (
                          <span className="text-slate-400 text-base font-semibold"> a {pesos(totalPagoUnicoArs.max)}</span>
                        )}
                      </div>
                      {totalUsdHardware > 0 && (
                        <div className="text-xs text-cyan-300 font-mono mt-0.5 font-semibold">
                          (Incluye {dolares(totalUsdHardware)} en dispositivos físicos de hardware)
                        </div>
                      )}
                    </div>
                  )}

                  {mensualTotal > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Abono Recurrente de Servicio:</div>
                      <div className="text-lg font-bold text-sky-300">
                        +{pesos(mensualTotal)} <span className="text-xs font-normal text-slate-400">/ mes</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2.5">
              <a
                href={whatsappLink(tieneSeleccion ? mensaje : 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Pedir presupuesto formal por WhatsApp
              </a>
              <a
                href={gmailLink('Presupuesto de ingeniería - tecnoros.ar', tieneSeleccion ? mensaje : 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:border-cyan-400 text-slate-200 font-semibold text-sm transition-colors cursor-pointer hover:bg-slate-800/50"
              >
                <Mail className="w-4 h-4" />
                Pedir por e-mail
              </a>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              Cotización orientativa. El diagnóstico técnico inicial es 100% gratuito. Para confirmar disponibilidad de componentes y plazo de entrega, coordinamos un presupuesto cerrado por escrito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
