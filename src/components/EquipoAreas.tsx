import React from 'react';
import { Linkedin } from 'lucide-react';
import { equipoPorArea } from '../data/equipo';
import { Carrusel } from './inicio/Carrusel';

// Tarjetas del equipo por área, en carrusel. Se usan igual en el inicio y en Nosotros.

// "María Sofía Genta" → "Sofía Genta", "Esteban José Menin" → "Esteban Menin"
const nombreCorto = (n: string, corto?: string) => {
  if (corto) return corto;
  const p = n.split(' ');
  if (p.length <= 2) return n;
  return n.startsWith('María') ? `${p[1]} ${p[2]}` : `${p[0]} ${p[p.length - 1]}`;
};

type Area = ReturnType<typeof equipoPorArea>[number];
const AREAS = equipoPorArea();

const TarjetaArea: React.FC<{ area: Area; className?: string }> = ({ area, className = '' }) => (
    <section aria-label={area.nombre} className={`flex flex-col p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800 ${className}`}>
      <h3 className="mb-2.5 flex items-baseline justify-between gap-2 text-xs font-mono uppercase tracking-[0.14em] text-cyan-300">
        <span>{area.nombre}</span>
        <span className="text-slate-500">{area.integrantes.length}</span>
      </h3>
      <ul className="flex flex-col gap-1.5">
        {area.integrantes.map((f) => {
          const contenido = (
            <>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <span className="min-w-0 flex-1">
                {/* Nombre corto: así cada ficha entra en una línea y quedan parejas */}
                <span className="block text-sm font-semibold text-white leading-tight group-hover:text-cyan-200" title={f.name}>{nombreCorto(f.name, f.corto)}</span>
                <span className="block text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">{f.badge}</span>
              </span>
              {f.linkedin && <Linkedin className="w-4 h-4 text-[#4DA3FF] shrink-0" />}
            </>
          );
          const clases = 'h-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-slate-900/70 border border-slate-800 transition-colors min-w-0 group';
          // Sin LinkedIn la ficha no es un link: un <a> sin destino confunde al teclado y al lector de pantalla.
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
    </section>
);

export const EquipoAreas: React.FC = () => (
  <>
    <Carrusel etiqueta="Áreas del equipo" anchoItem="w-[86%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]">
      {AREAS.map((area) => (
        <TarjetaArea key={area.id} area={area} className="h-full" />
      ))}
    </Carrusel>
    <p className="mt-3 text-xs text-slate-500">{AREAS.reduce((t, a) => t + a.integrantes.length, 0)} personas en {AREAS.length} áreas · deslizá o usá las flechas</p>
  </>
);
