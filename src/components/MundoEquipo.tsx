import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoGraticule10, geoOrthographic, geoPath, geoDistance, type GeoPermissibleObjects } from 'd3-geo';
import { FileText, Linkedin, MapPin } from 'lucide-react';
import { AREAS_EQUIPO, FOUNDERS, type Founder, type Ubicacion, URL_ORGANIGRAMA } from '../data/equipo';

const nombreArea = (id: string) => AREAS_EQUIPO.find((a) => a.id === id)?.nombre ?? '';

// Mapamundi interactivo del equipo: un globo que gira solo, se arrastra con el mouse o el dedo,
// y muestra de dónde es cada persona. Tocando un punto se ve quiénes son, con su LinkedIn.
// Por ahora están los co-founders; para sumar a alguien, se le carga `ubicacion` en data/equipo.ts.

type Punto = Ubicacion & { gente: Founder[] };

const TAM = 420;

const Avatar: React.FC<{ f: Founder; className?: string }> = ({ f, className = '' }) =>
  f.foto ? (
    <img src={f.foto} alt="" className={`rounded-full object-cover ${className}`} />
  ) : (
    <span aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      {f.emoji ?? '🙂'}
    </span>
  );

const Persona: React.FC<{ f: Founder }> = ({ f }) => {
  const contenido = (
    <>
      <Avatar f={f} className="w-10 h-10 text-3xl shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white leading-tight">{f.name}</span>
        <span className="block text-xs text-cyan-300 leading-tight mt-0.5">{nombreArea(f.area)} · {f.badge}</span>
        {f.ubicacion && (
          <span className="flex items-center gap-1 text-xs text-slate-400 leading-tight mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" /> {f.ubicacion.lugar}
          </span>
        )}
      </span>
      {f.linkedin && <Linkedin className="w-4 h-4 text-[#4DA3FF] shrink-0" />}
    </>
  );
  const clases = 'flex items-center gap-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800';
  return f.linkedin ? (
    <a href={f.linkedin} target="_blank" rel="noopener noreferrer" title={`LinkedIn de ${f.name}`} className={`${clases} hover:border-[#0A66C2]/70`}>
      {contenido}
    </a>
  ) : (
    <div className={clases}>{contenido}</div>
  );
};

export const MundoEquipo: React.FC = () => {
  // Lugares con su gente (si dos personas son de la misma ciudad, van en el mismo punto).
  const puntos = useMemo<Punto[]>(() => {
    const m = new Map<string, Punto>();
    FOUNDERS.forEach((f) => {
      if (!f.ubicacion) return;
      const p = m.get(f.ubicacion.lugar) ?? { ...f.ubicacion, gente: [] };
      p.gente.push(f);
      m.set(f.ubicacion.lugar, p);
    });
    return [...m.values()];
  }, []);

  const gente = useMemo(() => FOUNDERS.filter((f) => f.ubicacion), []);

  const [tierra, setTierra] = useState<GeoPermissibleObjects | null>(null);
  // Arranca mirando a Rosario (Sudamérica al frente).
  const [rot, setRot] = useState<[number, number]>([60, 20]);
  const [elegido, setElegido] = useState<Punto | null>(null);
  const tocado = useRef(false);
  const arrastre = useRef<{ x: number; y: number; r: [number, number] } | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // El mapa (continentes) se descarga recién cuando el globo está por aparecer en pantalla.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || tierra) return;
    let vivo = true;
    Promise.all([import('topojson-client'), import('world-atlas/land-110m.json')]).then(([topo, mundo]) => {
      if (!vivo) return;
      const datos = (mundo as { default?: unknown }).default ?? mundo;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTierra(topo.feature(datos as any, (datos as any).objects.land) as unknown as GeoPermissibleObjects);
    });
    return () => { vivo = false; };
  }, [visible, tierra]);

  // Gira solo, despacito, hasta que la persona lo agarra o elige un punto.
  useEffect(() => {
    if (!visible || elegido || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    let antes = performance.now();
    const paso = (t: number) => {
      const dt = t - antes;
      antes = t;
      if (!arrastre.current && !tocado.current) setRot(([l, f]) => [l + dt * 0.006, f]);
      id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [visible, elegido]);

  const proyeccion = useMemo(() => geoOrthographic().scale(TAM / 2 - 6).translate([TAM / 2, TAM / 2]).rotate([rot[0], rot[1]]).clipAngle(90), [rot]);
  const camino = useMemo(() => geoPath(proyeccion), [proyeccion]);
  const centro: [number, number] = [-rot[0], -rot[1]];

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[data-punto]')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastre.current = { x: e.clientX, y: e.clientY, r: rot };
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const a = arrastre.current;
    if (!a) return;
    const k = 180 / (e.currentTarget.getBoundingClientRect().width || TAM);
    setRot([a.r[0] + (e.clientX - a.x) * k, Math.max(-80, Math.min(80, a.r[1] - (e.clientY - a.y) * k))]);
  };
  const soltar = () => {
    if (arrastre.current) tocado.current = true;
    arrastre.current = null;
  };

  const mirarA = (u: Ubicacion) => {
    tocado.current = true;
    setRot([-u.lon, -u.lat * 0.6]);
  };
  const elegir = (p: Punto) => {
    setElegido(p);
    mirarA(p);
  };

  return (
    <div ref={caja} className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-center">
        <div className="relative mx-auto w-full max-w-[420px] aspect-square">
          <svg
            viewBox={`0 0 ${TAM} ${TAM}`}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={soltar}
            onPointerCancel={soltar}
            role="img"
            aria-label="Mapamundi con los lugares donde está el equipo. Arrastralo para girarlo."
          >
            <defs>
              <radialGradient id="mar" cx="40%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#12304a" />
                <stop offset="100%" stopColor="#081322" />
              </radialGradient>
            </defs>
            <circle cx={TAM / 2} cy={TAM / 2} r={TAM / 2 - 6} fill="url(#mar)" stroke="#00D2F3" strokeOpacity={0.35} strokeWidth={1.5} />
            <path d={camino(geoGraticule10()) ?? ''} fill="none" stroke="#1e3a5f" strokeWidth={0.6} />
            {tierra && <path d={camino(tierra) ?? ''} fill="#1b4b5f" stroke="#2dd4bf" strokeOpacity={0.35} strokeWidth={0.6} />}
            {puntos.map((p) => {
              // Sólo se dibuja si está del lado que se ve del globo.
              if (geoDistance([p.lon, p.lat], centro) > Math.PI / 2 - 0.05) return null;
              const xy = proyeccion([p.lon, p.lat]);
              if (!xy) return null;
              const activo = elegido?.lugar === p.lugar;
              return (
                <g key={p.lugar} data-punto transform={`translate(${xy[0]},${xy[1]})`}>
                  <circle r={18} fill="#00D2F3" opacity={0.18} className="motion-safe:animate-ping" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
                  <circle r={activo ? 9 : 7} fill="#00D2F3" stroke="#fff" strokeWidth={2} className="cursor-pointer" onClick={() => elegir(p)} />
                  {/* Al lado del punto: cada persona (emoji o foto, nombre y área, con link a LinkedIn) y el lugar. */}
                  <foreignObject x={xy[0] > TAM - 200 ? -200 : 12} y={-12 - p.gente.length * 17} width={188} height={p.gente.length * 34 + 26}>
                    <div className="rounded-lg bg-[#0B1220]/85 border border-cyan-400/40 px-2 py-1.5 text-white shadow-lg">
                      {p.gente.map((f) => {
                        const fila = (
                          <span className="flex items-center gap-1.5">
                            <Avatar f={f} className="w-6 h-6 text-lg shrink-0" />
                            <span className="min-w-0">
                              <span className="block text-[11px] font-bold leading-tight truncate">{f.name}</span>
                              <span className="block text-[9px] text-cyan-300 leading-tight truncate">{nombreArea(f.area)}</span>
                            </span>
                          </span>
                        );
                        return f.linkedin ? (
                          <a key={f.name} href={f.linkedin} target="_blank" rel="noopener noreferrer" title={`LinkedIn de ${f.name}`} className="block py-0.5 hover:text-cyan-200">{fila}</a>
                        ) : (
                          <span key={f.name} className="block py-0.5">{fila}</span>
                        );
                      })}
                      <span className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-300"><MapPin className="w-2.5 h-2.5 shrink-0" /> {p.lugar}</span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500">Arrastralo para girarlo · tocá un nombre para ir a su LinkedIn</p>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.14em] text-cyan-300">De dónde somos</span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">El equipo en el mapa</h3>
            </div>
            <a
              href={URL_ORGANIGRAMA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/60 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:border-cyan-300"
            >
              <FileText className="w-4 h-4" /> Ver equipo completo
            </a>
          </div>
          <p className="mt-2 text-sm text-slate-400">Tocá a alguien (en el globo o en la lista) para ir a su LinkedIn.</p>
          <ul className="mt-5 grid gap-2">
            {gente.map((f) => (
              <li key={f.name} onMouseEnter={() => f.ubicacion && mirarA(f.ubicacion)}>
                <Persona f={f} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">Muy pronto vas a ver al resto del equipo, desde todo LATAM.</p>
        </div>
      </div>
    </div>
  );
};
