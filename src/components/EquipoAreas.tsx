import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileText, Linkedin } from 'lucide-react';
import { FOUNDERS, equipoPorArea } from '../data/equipo';

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

// Cada área es un recuadro del mismo tamaño con su nombre y cuántas personas tiene. Al pasar el puntero
// (o tocar "Ver quiénes" en el celu) se despliega la lista completa encima, sin tener que deslizar;
// al sacar el puntero (o tocar afuera) vuelve sola al número.
const TarjetaArea: React.FC<{ area: Area }> = ({ area }) => {
  const [encima, setEncima] = useState(false);
  const [fija, setFija] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const abierta = encima || fija;
  const n = area.integrantes.length;
  const idLista = `equipo-${area.id}`;
  useEffect(() => {
    if (!fija) return;
    const fuera = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setFija(false);
    };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [fija]);
  return (
    <section
      ref={ref}
      aria-label={area.nombre}
      // Sólo con mouse: en el celu el toque dispara "entrar/salir" falsos que la cerraban al instante.
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setEncima(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setEncima(false); setFija(false); } }}
      className={`relative h-60 ${abierta ? 'z-30' : ''}`}
    >
      <div className="h-full rounded-2xl border-2 border-slate-600 bg-slate-900/60 flex flex-col items-center justify-center text-center gap-3 p-5">
        <span className="text-xs font-mono uppercase tracking-[0.14em] text-cyan-300 leading-relaxed">{area.nombre}</span>
        <span className="text-4xl font-extrabold text-white tabular-nums leading-none">{n}</span>
        <span className="text-sm text-slate-400 -mt-1">{n === 1 ? 'integrante' : 'integrantes'}</span>
        <button
          type="button"
          onClick={() => setFija(true)}
          aria-expanded={abierta}
          aria-controls={idLista}
          className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-500/50 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
        >
          Ver quiénes <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      {abierta && (
        <div className="absolute inset-x-0 top-0 min-h-full rounded-2xl border-2 border-cyan-400/70 bg-[#0B1220] shadow-2xl shadow-black/60 flex flex-col">
          <div className="flex items-center justify-between gap-2 px-3 pt-2 pb-1.5 border-b border-slate-700/70">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-300 truncate">{area.nombre}</span>
            <span className="text-xs text-slate-400 shrink-0">{n}</span>
          </div>
          <ul id={idLista} className="flex flex-col gap-1 p-1.5">
            {area.integrantes.map((f) => {
              const contenido = (
                <>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white leading-tight group-hover:text-cyan-200" title={f.name}>{nombreCorto(f.name, f.corto)}</span>
                    <span className="block text-[11px] text-slate-400 leading-tight">{f.badge}</span>
                  </span>
                  {f.linkedin && <Linkedin className="w-4 h-4 text-[#4DA3FF] shrink-0" />}
                </>
              );
              const clases = 'flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-950/60 border border-slate-800 transition-colors min-w-0 group';
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
        </div>
      )}
    </section>
  );
};

export const EquipoAreas: React.FC = () => {
  // "Ver organigrama" aparece sólo mientras el usuario pasa por la sección del equipo.
  const grilla = useRef<HTMLDivElement>(null);
  const [aLaVista, setALaVista] = useState(false);
  useEffect(() => {
    // Se muestra desde que aparece la línea de "Quiénes somos" (el comienzo de la sección del equipo)
    // hasta que llega "Qué hacemos" (cuando la sección del equipo ya se fue para arriba).
    const seccion = grilla.current?.closest('section') ?? grilla.current;
    if (!seccion) return;
    const revisar = () => {
      const r = seccion.getBoundingClientRect();
      const alto = window.innerHeight;
      // Arranca apenas se ve la línea de "Quiénes somos" (el comienzo de la sección) y se va cuando
      // "Qué hacemos" ya ocupa la parte de abajo de la pantalla.
      const t = r.top + (parseFloat(getComputedStyle(seccion).paddingTop) || 0);
      setALaVista(t < alto && r.bottom > alto * 0.75);
    };
    revisar();
    window.addEventListener('scroll', revisar, { passive: true });
    window.addEventListener('resize', revisar);
    return () => {
      window.removeEventListener('scroll', revisar);
      window.removeEventListener('resize', revisar);
    };
  }, []);
  return (
    <>
      <p className="text-sm text-slate-400 mb-4">
        <span className="text-white font-semibold">{FOUNDERS.length} personas en {AREAS.length} áreas</span>, repartidas y trabajando remotamente desde todo LATAM.
      </p>
      {/* Grilla: todas las áreas a la vista y del mismo tamaño. */}
      <div ref={grilla} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AREAS.map((area) => (
          <TarjetaArea key={area.id} area={area} />
        ))}
      </div>
      <a
        href="/organigrama-tecnoros.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={!aLaVista}
        tabIndex={aLaVista ? 0 : -1}
        className={`fixed z-[60] left-4 bottom-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1220] border border-cyan-400/60 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:border-cyan-300 shadow-2xl shadow-black/60 transition-all duration-300 ${aLaVista ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <FileText className="w-4 h-4" /> Ver organigrama
      </a>
    </>
  );
};
