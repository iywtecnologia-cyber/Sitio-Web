import React, { useMemo, useState } from 'react';
import { CalendarCheck, MessageCircle, RefreshCw } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  minutes: number;
}

interface Booking {
  id: string;
  name: string;
  service: string;
  start: number; // minutos desde las 9:00
  minutes: number;
  mine?: boolean;
}

const SERVICES: Service[] = [
  { id: 'consulta', name: 'Consulta', minutes: 30 },
  { id: 'control', name: 'Control', minutes: 15 },
  { id: 'tratamiento', name: 'Tratamiento', minutes: 60 },
];

const DAY_START = 9 * 60;
const DAY_LENGTH = 4 * 60; // de 9:00 a 13:00
const STEP = 15;

const INITIAL_BOOKINGS: Booking[] = [
  { id: 'b1', name: 'Laura G.', service: 'Tratamiento', start: 30, minutes: 60 },
  { id: 'b2', name: 'Diego R.', service: 'Consulta', start: 150, minutes: 30 },
  { id: 'b3', name: 'Ana P.', service: 'Control', start: 210, minutes: 15 },
];

const fmt = (offset: number) => {
  const total = DAY_START + offset;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
};

const overlaps = (start: number, minutes: number, bookings: Booking[]) =>
  bookings.some((b) => start < b.start + b.minutes && b.start < start + minutes);

export const DemoTurnos: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [serviceId, setServiceId] = useState<string>(SERVICES[0].id);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId)!;

  const slots = useMemo(() => {
    const list: { start: number; free: boolean }[] = [];
    for (let start = 0; start + service.minutes <= DAY_LENGTH; start += STEP) {
      list.push({ start, free: !overlaps(start, service.minutes, bookings) });
    }
    return list;
  }, [service, bookings]);

  const book = (start: number) => {
    const booking: Booking = {
      id: `m-${Date.now()}`,
      name: 'Vos',
      service: service.name,
      start,
      minutes: service.minutes,
      mine: true,
    };
    setBookings((prev) => [...prev, booking]);
    setConfirmed(booking);
  };

  const reset = () => {
    setBookings(INITIAL_BOOKINGS);
    setConfirmed(null);
  };

  const sorted = [...bookings].sort((a, b) => a.start - b.start);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Elegir servicio y horario */}
      <div className="lg:col-span-7 rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">1. Elegí qué necesitás</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setServiceId(s.id)}
              aria-pressed={s.id === serviceId}
              className={`px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                s.id === serviceId
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              {s.name} <span className="text-slate-400 font-normal">· {s.minutes} min</span>
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">2. Elegí un horario libre</div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {slots.map(({ start, free }) => (
            <button
              key={start}
              onClick={() => book(start)}
              disabled={!free}
              title={free ? `Reservar a las ${fmt(start)}` : 'Se superpone con otro turno'}
              className={`py-2.5 rounded-lg border text-sm font-mono tabular-nums transition-colors ${
                free
                  ? 'bg-slate-900 border-slate-700 text-white hover:bg-cyan-500/15 hover:border-cyan-500'
                  : 'bg-slate-950 border-slate-900 text-slate-600 line-through cursor-not-allowed'
              }`}
            >
              {fmt(start)}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Los horarios tachados se superponen con otro turno. El sistema los bloquea solo, según lo que dura cada servicio.
        </p>
      </div>

      {/* Agenda del día */}
      <div className="lg:col-span-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <CalendarCheck className="w-4 h-4 text-cyan-400" />
            Agenda de hoy
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>

        <ul className="space-y-2 flex-1">
          {sorted.map((b) => (
            <li
              key={b.id}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-sm ${
                b.mine ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <span className="font-mono tabular-nums text-cyan-300 shrink-0">
                {fmt(b.start)}–{fmt(b.start + b.minutes)}
              </span>
              <span className="text-slate-200 truncate text-right">
                {b.name} · <span className="text-slate-400">{b.service}</span>
              </span>
            </li>
          ))}
        </ul>

        {confirmed && (
          <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 p-3.5" role="status">
            <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
              <MessageCircle className="w-4 h-4" />
              Mensaje que le llega al cliente
            </div>
            <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">
              "¡Hola! Tu turno de {confirmed.service.toLowerCase()} quedó confirmado para hoy a las {fmt(confirmed.start)}. Te mandamos un recordatorio el día anterior. Respondé 1 para confirmar o 2 para cancelar."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
