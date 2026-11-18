import React from 'react';
import { FileText, Linkedin } from 'lucide-react';
import { FOUNDERS, equipoPorArea, URL_ORGANIGRAMA } from '../data/equipo';
import { MundoEquipo } from './MundoEquipo';

// Equipo: se usa igual en el inicio y en Nosotros.

const AREAS = equipoPorArea();

// En la web se muestran sólo los fundadores; el resto del equipo está en el organigrama completo (PDF).
export const EquipoAreas: React.FC = () => {
  const fundadores = AREAS.find((a) => a.id === 'cofundadores')?.integrantes ?? [];
  return (
    <>
      <p className="text-sm text-slate-400 mb-4">
        <span className="text-white font-semibold">{FOUNDERS.length} personas en {AREAS.length} áreas</span>, repartidas y trabajando remotamente desde todo LATAM.
      </p>
      <div className="rounded-2xl border-2 border-slate-600 bg-slate-900/60 p-4 sm:p-5">
        <span className="block text-xs font-mono uppercase tracking-[0.14em] text-cyan-300">Fundadores</span>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fundadores.map((f) => {
            const contenido = (
              <>
                <span className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-white leading-tight group-hover:text-cyan-200">{f.name}</span>
                  <span className="block text-sm text-slate-400 leading-tight mt-0.5">{f.role} · {f.badge}</span>
                </span>
                {f.linkedin && <Linkedin className="w-5 h-5 text-[#4DA3FF] shrink-0" />}
              </>
            );
            const clases = 'flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 transition-colors group';
            return (
              <li key={f.name}>
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
      </div>
      <div className="mt-5 flex justify-center">
        <a
          href={URL_ORGANIGRAMA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 text-sm sm:text-base font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <FileText className="w-5 h-5" /> Ver organigrama completo
        </a>
      </div>
      {/* Debajo del equipo: de dónde es cada uno, en un globo que se puede girar. */}
      <MundoEquipo />
    </>
  );
};
