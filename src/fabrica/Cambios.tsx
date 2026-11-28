// Historial de cambios del sistema. La misma lista se ve de dos maneras:
// quien lo pide lee qué cambió en palabras; el programador ve además el detalle técnico (el parche).
import React from 'react';
import { Check, Code2, MessageSquare, RotateCcw, X } from 'lucide-react';
import type { Cambio } from './api';
import type { OpParche } from './spec';

const VERBO: Record<OpParche['op'], string> = { add: 'agrega', replace: 'cambia', remove: 'quita' };
const valor = (v: unknown) => {
  if (v === undefined) return '';
  const t = typeof v === 'string' ? v : JSON.stringify(v);
  return t.length > 160 ? `${t.slice(0, 160)}…` : t;
};

export const Parche: React.FC<{ parche: OpParche[] }> = ({ parche }) =>
  parche.length ? (
    <ul className="mt-2 space-y-1 rounded-lg bg-slate-950 border border-slate-800 p-2 font-mono text-[12px] leading-relaxed">
      {parche.map((o, i) => (
        <li key={i} className="break-all">
          <span className={o.op === 'remove' ? 'text-rose-300' : o.op === 'add' ? 'text-emerald-300' : 'text-amber-300'}>{VERBO[o.op]}</span>{' '}
          <span className="text-cyan-200">{o.path}</span>
          {o.op !== 'remove' && <span className="text-slate-400"> → {valor(o.value)}</span>}
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-2 text-xs text-slate-500">Sin detalle técnico (por ejemplo, la carga del logo).</p>
  );

const ESTADO: Record<Cambio['estado'], { texto: string; clase: string; icono: React.ReactNode }> = {
  aprobado: { texto: 'Aprobado y aplicado', clase: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10', icono: <Check className="w-3.5 h-3.5" /> },
  descartado: { texto: 'Descartado', clase: 'text-slate-300 border-slate-600 bg-slate-800/60', icono: <X className="w-3.5 h-3.5" /> },
  deshecho: { texto: 'Deshecho', clase: 'text-amber-300 border-amber-500/40 bg-amber-500/10', icono: <RotateCcw className="w-3.5 h-3.5" /> },
};

export const Cambios: React.FC<{ cambios: Cambio[]; tecnico: boolean }> = ({ cambios, tecnico }) => (
  <div>
    {cambios.length === 0 ? (
      <p className="mt-2 text-sm text-slate-500">Todavía no se pidió ningún cambio.</p>
    ) : (
      <ol className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
        {[...cambios].reverse().map((c) => (
          <li key={c.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ESTADO[c.estado].clase}`}>{ESTADO[c.estado].icono} {ESTADO[c.estado].texto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400"><MessageSquare className="w-3 h-3" /> {c.de === 'golondrina' ? 'Pedido a Golondrina' : 'Pedido desde la página'}</span>
              {c.version && <span className="text-[11px] text-slate-500">versión {c.version}</span>}
              <span className="text-[11px] text-slate-500 ml-auto">{c.fecha}</span>
            </div>
            <p className="mt-1.5 text-sm text-white">«{c.pedido}»</p>
            <p className="text-sm text-slate-300">{c.explicacion}</p>
            {tecnico && (
              <div className="mt-2">
                <p className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-cyan-300"><Code2 className="w-3.5 h-3.5" /> Implementación</p>
                <Parche parche={c.parche} />
              </div>
            )}
          </li>
        ))}
      </ol>
    )}
  </div>
);

export default Cambios;
