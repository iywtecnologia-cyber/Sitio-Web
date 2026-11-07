import React, { useEffect, useMemo, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, MapPin, Rocket, Users, X, CalendarDays } from 'lucide-react';
import { FOTOS_ENCUENTROS, TIPOS_ENCUENTRO, type TipoEncuentro } from '../../data/encuentros';

const fechaLinda = (f?: string) => {
  if (!f) return '';
  const [a, m, d] = f.split('-').map(Number);
  const fecha = new Date(a, (m || 1) - 1, d || 1, 12);
  return fecha.toLocaleDateString('es-AR', d ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' });
};

const ICONO: Record<TipoEncuentro, React.ElementType> = { comienzos: Rocket, equipo: Users, jornadas: CalendarDays };

// Encuentros: fotos de cómo empezamos, del equipo y de las jornadas. Las fotos se cargan en src/data/encuentros.ts.
export const Encuentros: React.FC = () => {
  const [filtro, setFiltro] = useState<TipoEncuentro | 'todas'>('todas');
  const [abierta, setAbierta] = useState<number | null>(null);

  const fotos = useMemo(() => (filtro === 'todas' ? FOTOS_ENCUENTROS : FOTOS_ENCUENTROS.filter((f) => f.tipo === filtro)), [filtro]);
  const tipos = TIPOS_ENCUENTRO.filter((t) => FOTOS_ENCUENTROS.some((f) => f.tipo === t.id));

  // Vista ampliada: Esc cierra, flechas pasan de foto.
  useEffect(() => {
    if (abierta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(null);
      if (e.key === 'ArrowRight') setAbierta((i) => (i === null ? i : (i + 1) % fotos.length));
      if (e.key === 'ArrowLeft') setAbierta((i) => (i === null ? i : (i - 1 + fotos.length) % fotos.length));
    };
    window.addEventListener('keydown', tecla);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
    };
  }, [abierta, fotos.length]);

  const actual = abierta !== null ? fotos[abierta] : null;

  return (
    <section id="encuentros" className="scroll-mt-24 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">Encuentros</span>
        <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Nuestra historia en fotos</h2>
        <p className="mt-2 max-w-2xl text-base text-slate-400">
          Somos un equipo remoto, pero cada tanto nos encontramos. Acá van los comienzos, el equipo y las jornadas y eventos a los que vamos.
        </p>

        {FOTOS_ENCUENTROS.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 sm:p-10 text-center">
            <Camera className="w-10 h-10 mx-auto text-cyan-300" />
            <p className="mt-4 text-lg font-bold text-white">Muy pronto, las primeras fotos</p>
            <p className="mt-1 text-slate-400">Estamos juntando las fotos de cómo empezamos y de las jornadas a las que fuimos.</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {TIPOS_ENCUENTRO.map((t) => {
                const Icono = ICONO[t.id];
                return (
                  <li key={t.id} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-300">
                    <Icono className="w-4 h-4 text-cyan-300" /> {t.nombre}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <>
            {tipos.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar fotos">
                {[{ id: 'todas' as const, nombre: 'Todas' }, ...tipos].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={filtro === t.id}
                    onClick={() => setFiltro(t.id)}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                      filtro === t.id ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-semibold' : 'border-slate-700 text-slate-300 hover:border-cyan-500/60'
                    }`}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
            )}
            <ul className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4">
              {fotos.map((f, i) => (
                <li key={f.src} className="break-inside-avoid mb-4">
                  <button
                    type="button"
                    onClick={() => setAbierta(i)}
                    className="group block w-full text-left rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-colors"
                  >
                    <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]" />
                    <span className="block p-4">
                      <span className="block font-semibold text-white">{f.titulo}</span>
                      {(f.fecha || f.lugar) && (
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          {f.lugar && <MapPin className="w-3.5 h-3.5 text-cyan-400" />}
                          {[f.lugar, fechaLinda(f.fecha)].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {actual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={actual.titulo}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setAbierta(null)}
        >
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={actual.src} alt={actual.alt} className="mx-auto max-h-[78vh] w-auto rounded-xl" />
            <figcaption className="mt-3 text-center text-white">
              <span className="font-semibold">{actual.titulo}</span>
              <span className="block text-sm text-slate-400">{[actual.lugar, fechaLinda(actual.fecha)].filter(Boolean).join(' · ')}</span>
            </figcaption>
          </figure>
          <button type="button" aria-label="Cerrar" onClick={() => setAbierta(null)} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          {fotos.length > 1 && (
            <>
              <button type="button" aria-label="Foto anterior" onClick={(e) => { e.stopPropagation(); setAbierta((abierta! - 1 + fotos.length) % fotos.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" aria-label="Foto siguiente" onClick={(e) => { e.stopPropagation(); setAbierta((abierta! + 1) % fotos.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
};
