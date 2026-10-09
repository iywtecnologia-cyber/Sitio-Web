import React, { useState } from 'react';
import { CalendarClock, MessageCircle, MousePointerClick, ShoppingCart, ArrowRight } from 'lucide-react';
import { DemoWhatsAppBot } from './DemoWhatsAppBot';
import { DemoTurnos } from './DemoTurnos';
import { DemoPuntoDeVenta } from './DemoPuntoDeVenta';
import { whatsappLink } from '../../data/contact';

const DEMOS = [
  {
    id: 'bot',
    label: 'Bot de WhatsApp',
    icon: MessageCircle,
    title: 'Tu WhatsApp responde solo, las 24 horas',
    pitch: 'Contesta las preguntas de siempre, toma pedidos y te pasa a una persona cuando hace falta.',
    Component: DemoWhatsAppBot,
  },
  {
    id: 'turnos',
    label: 'Turnos online',
    icon: CalendarClock,
    title: 'Turnos sin superposiciones ni llamados',
    pitch: 'Tus clientes reservan solos, el sistema bloquea los horarios ocupados y les confirma por WhatsApp.',
    Component: DemoTurnos,
  },
  {
    id: 'pos',
    label: 'Ventas y stock',
    icon: ShoppingCart,
    title: 'Cobrás y el stock se actualiza solo',
    pitch: 'Cada venta descuenta del stock y te avisa antes de que te quedes sin mercadería.',
    Component: DemoPuntoDeVenta,
  },
];

export const DemoSection: React.FC = () => {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const active = DEMOS.find((d) => d.id === activeId)!;
  const ActiveDemo = active.Component;

  return (
    <section id="demos" className="py-14 sm:py-16 md:py-20 bg-[#090D18] border-t border-slate-800/50 relative overflow-hidden">
      <div className="absolute top-10 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Demos interactivas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Probalo vos mismo,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              ahora
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Estos son ejemplos de lo que hacemos. Tocá, probá y imaginalo con los datos de tu negocio.
          </p>
        </div>

        {/* Pestañas */}
        <div role="tablist" aria-label="Elegí una demo" className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
          {DEMOS.map((d) => {
            const Icon = d.icon;
            const selected = d.id === activeId;
            return (
              <button
                key={d.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(d.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                  selected
                    ? 'bg-cyan-500/10 border-cyan-500/60 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${selected ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span className="font-semibold text-sm sm:text-base">{d.label}</span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="rounded-2xl bg-[#0B101E] border border-slate-800 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">{active.title}</h3>
            <p className="mt-1.5 text-sm sm:text-base text-slate-300">{active.pitch}</p>
          </div>
          <ActiveDemo key={active.id} />
        </div>

        {/* Llamado a la acción */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">¿Te imaginás esto en tu negocio?</h3>
            <p className="mt-1 text-sm text-slate-300">
              Contanos qué hacés a mano todos los días y te mostramos cómo quedaría. El diagnóstico es sin costo.
            </p>
          </div>
          <a
            href={whatsappLink(`Hola tecnoros.ar, probé la demo de "${active.label}" en la web y quiero algo así para mi negocio`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0"
          >
            Quiero algo así
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
