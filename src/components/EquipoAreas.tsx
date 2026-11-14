import React, { useState } from 'react';
import { ChevronDown, Linkedin } from 'lucide-react';
import { equipoPorArea } from '../data/equipo';

// Equipo por área, en grilla: se usa igual en el inicio y en Nosotros.

// "María Sofía Genta" → "Sofía Genta", "Esteban José Menin" → "Esteban Menin"
const nombreCorto = (n: string, corto?: string) => {
  if (corto) return corto;
  const p = n.split(' ');
  if (p.length <= 2) return n;
  return n.startsWith('María') ? `${p[1]} ${p[2]}` : `${p[0]} ${p[p.length - 1]}`;
};

type Area = ReturnType<typeof equipoPorArea>[number];
const AREAS = equipoPorArea();

// Cada área es un "combo" con su nombre y cuántas personas tiene. Se ven todas juntas en una grilla
// (sin deslizar) y al tocar una se despliega quiénes son.
const TarjetaArea: React.FC<{ area: Area; abierta: boolean; onToggle: () => void }> = ({ area, abierta, onToggle }) => {
  const idLista = `equipo-${area.id}`;
  return (
    <section aria-label={area.nombre} className={`rounded-2xl border transition-colors ${abierta ? 'bg-slate-900/80 border-cyan-500/40' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierta}
        aria-controls={idLista}
        className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-mono uppercase tracking-[0.14em] text-cyan-300">{area.nombre}</span>
          <span className="block mt-1 text-sm text-slate-400">
            <span className="text-white font-bold text-lg tabular-nums">{area.integrantes.length}</span> {area.integrantes.length === 1 ? 'integrante' : 'integrantes'}
          </span>
        </span>
        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
          {abierta ? 'Ocultar' : 'Ver quiénes'}
          <ChevronDown className={`w-4 h-4 transition-transform ${abierta ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {abierta && (
        <ul id={idLista} className="flex flex-col gap-1.5 px-3 pb-3">
          {area.integrantes.map((f) => {
            const contenido = (
              <>
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                  {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white leading-tight group-hover:text-cyan-200" title={f.name}>{nombreCorto(f.name, f.corto)}</span>
                  <span className="block text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">{f.badge}</span>
                </span>
                {f.linkedin && <Linkedin className="w-4 h-4 text-[#4DA3FF] shrink-0" />}
              </>
            );
            const clases = 'flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 transition-colors min-w-0 group';
            return (
              <li key={f.name} className="min-w-0">
                {f.linkedin ? (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" title={`LinkedIn de ${f.name}`} className={`${clases} hover:border-[#0A66C2]/60`}>
                    {contenido}
                  </a>
                ) : (
                  <div className={clases}>{contenido}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export const EquipoAreas: React.FC = () => {
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());
  const todasAbiertas = abiertas.size === AREAS.length;
  const toggle = (id: string) =>
    setAbiertas((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-slate-400">
          <span className="text-white font-semibold">{AREAS.reduce((t, a) => t + a.integrantes.length, 0)} personas</span> en {AREAS.length} áreas. Tocá un área para ver quiénes son.
        </p>
        <button
          type="button"
          onClick={() => setAbiertas(todasAbiertas ? new Set() : new Set(AREAS.map((a) => a.id)))}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-4 cursor-pointer"
        >
          {todasAbiertas ? 'Cerrar todas' : 'Ver todo el equipo'}
        </button>
      </div>
      {/* Grilla: todas las áreas a la vista. Cada columna es independiente, así abrir una no estira a las otras. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
        {AREAS.map((area) => (
          <TarjetaArea key={area.id} area={area} abierta={abiertas.has(area.id)} onToggle={() => toggle(area.id)} />
        ))}
      </div>
    </>
  );
};
