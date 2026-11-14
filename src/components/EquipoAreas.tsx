import React, { useState } from 'react';
import { ChevronDown, FileText, Linkedin, X } from 'lucide-react';
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

// Cada área es un recuadro del mismo tamaño con su nombre y cuántas personas tiene. El recuadro no se
// clickea: al pasar el puntero muestra quiénes son, y el botón "Ver quiénes" lo despliega (en celu).
// Mientras el puntero está adentro, la lista queda abierta aunque te desplaces; al salir vuelve sola al número.
const TarjetaArea: React.FC<{ area: Area }> = ({ area }) => {
  const [encima, setEncima] = useState(false);
  const [fija, setFija] = useState(false);
  const abierta = encima || fija;
  const n = area.integrantes.length;
  const idLista = `equipo-${area.id}`;
  return (
    <section
      aria-label={area.nombre}
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => { setEncima(false); setFija(false); }}
      className={`relative h-60 rounded-2xl border-2 bg-slate-900/60 overflow-hidden transition-colors ${abierta ? 'border-cyan-400/70' : 'border-slate-600'}`}
    >
      {abierta ? (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-slate-700/70">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-300 truncate">{area.nombre}</span>
            {fija && (
              <button type="button" onClick={() => { setFija(false); setEncima(false); }} aria-label={`Cerrar ${area.nombre}`} className="shrink-0 p-1 rounded-md text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <ul
            id={idLista}
            onScroll={() => setFija(true)}
            onTouchMove={() => setFija(true)}
            onWheel={() => setFija(true)}
            className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-1.5 p-2"
          >
            {area.integrantes.map((f) => {
              const contenido = (
                <>
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white leading-tight group-hover:text-cyan-200 truncate" title={f.name}>{nombreCorto(f.name, f.corto)}</span>
                    <span className="block text-[11px] text-slate-400 leading-tight mt-0.5 truncate" title={f.badge}>{f.badge}</span>
                  </span>
                  {f.linkedin && <Linkedin className="w-4 h-4 text-[#4DA3FF] shrink-0" />}
                </>
              );
              const clases = 'flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 transition-colors min-w-0 group';
              return (
                <li key={f.name} className="min-w-0">
                  {f.linkedin ? (
                    <a href={f.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => setFija(true)} title={`LinkedIn de ${f.name}`} className={`${clases} hover:border-[#0A66C2]/60`}>
                      {contenido}
                    </a>
                  ) : (
                    <div className={clases}>{contenido}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-5">
          <span className="text-xs font-mono uppercase tracking-[0.14em] text-cyan-300 leading-relaxed">{area.nombre}</span>
          <span className="text-4xl font-extrabold text-white tabular-nums leading-none">{n}</span>
          <span className="text-sm text-slate-400 -mt-1">{n === 1 ? 'integrante' : 'integrantes'}</span>
          <button
            type="button"
            onClick={() => setFija(true)}
            aria-expanded={false}
            aria-controls={idLista}
            className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-500/50 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
          >
            Ver quiénes <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};

export const EquipoAreas: React.FC = () => (
  <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <p className="text-sm text-slate-400">
        <span className="text-white font-semibold">{AREAS.reduce((t, a) => t + a.integrantes.length, 0)} personas</span> en {AREAS.length} áreas. Pasá el puntero por un área (o tocá "Ver quiénes") para conocer a su gente.
      </p>
      <a
        href="/organigrama-tecnoros.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:text-cyan-200"
      >
        <FileText className="w-4 h-4" /> Ver organigrama
      </a>
    </div>
    {/* Grilla: todas las áreas a la vista y del mismo tamaño. */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {AREAS.map((area) => (
        <TarjetaArea key={area.id} area={area} />
      ))}
    </div>
  </>
);
