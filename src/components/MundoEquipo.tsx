import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoGraticule10, geoOrthographic, geoPath, geoDistance, type GeoPermissibleObjects } from 'd3-geo';
import { Linkedin, MapPin } from 'lucide-react';
import { AREAS_EQUIPO, FOUNDERS, type Founder, type Ubicacion } from '../data/equipo';

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
    <PersonaConCompu emoji={f.emoji ?? '🙂'} className={className} />
  );

// Personita con la compu enfrente (como 👨‍💻 / 👩‍💻), dibujada a mano para que no traiga el fondo verde del emoji.
const PersonaConCompu: React.FC<{ emoji: string; className?: string }> = ({ emoji, className = '' }) => {
  if (!emoji.includes('💻')) {
    return <span aria-hidden="true" className={`flex items-center justify-center ${className}`}>{emoji}</span>;
  }
  const mujer = emoji.startsWith('👩');
  const pelo = mujer ? '#7C4A2D' : '#3B2A1E';
  const remera = mujer ? '#A78BFA' : '#22D3EE';
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      {/* pelo largo atrás (ella) */}
      {mujer && <path d="M18 24c0-11 6-17 14-17s14 6 14 17v14H18z" fill={pelo} />}
      {/* cuerpo */}
      <path d="M14 52c0-10 8-16 18-16s18 6 18 16z" fill={remera} />
      {/* cuello y cabeza */}
      <rect x="28.5" y="30" width="7" height="7" rx="2" fill="#F2C29B" />
      <circle cx="32" cy="22" r="10" fill="#F6CBA5" />
      {/* pelo de arriba */}
      <path d={mujer ? 'M21.5 21c1-8 6-11.5 10.5-11.5S41.5 13 42.5 21c-4-1-8-4-10-7-2 3-6 6-11 7z' : 'M22 20c0-7 4.5-10.5 10-10.5S42 13 42 20c-3-2-6.5-4-10-4s-7 2-10 4z'} fill={pelo} />
      {/* ojos */}
      <circle cx="28.3" cy="23" r="1.3" fill="#1E293B" />
      <circle cx="35.7" cy="23" r="1.3" fill="#1E293B" />
      <path d="M29.5 27.2c1.6 1.3 3.4 1.3 5 0" stroke="#B45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* la compu enfrente: tapa vista de atrás con el logo, y la base */}
      <path d="M13 37h38l-3 17H16z" fill="#CBD5E1" />
      <path d="M13 37h38l-.6 3.4H13.6z" fill="#E2E8F0" />
      <circle cx="32" cy="46" r="2.6" fill="#22D3EE" />
      <rect x="7" y="54" width="50" height="4" rx="2" fill="#94A3B8" />
    </svg>
  );
};

const Persona: React.FC<{ f: Founder }> = ({ f }) => {
  const contenido = (
    <>
      <Avatar f={f} className="w-10 h-10 text-3xl shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white leading-tight">{f.name}</span>
        <span className="block text-xs text-cyan-300 leading-tight mt-0.5">{nombreArea(f.area)} · {f.badge}</span>
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

  // Gira siempre, despacito. Solo se frena mientras lo arrastrás o tenés el mouse/dedo sobre un nombre.
  useEffect(() => {
    if (!visible || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  }, [visible]);

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
    arrastre.current = null;
  };

  const mirarA = (u: Ubicacion) => {
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
                <g
                  key={p.lugar}
                  data-punto
                  transform={`translate(${xy[0]},${xy[1]})`}
                  // Al pasar el mouse o tocar un nombre, el globo se queda quieto para poder hacer clic en su LinkedIn.
                  onPointerEnter={() => (tocado.current = true)}
                  onPointerLeave={() => (tocado.current = false)}
                  onPointerDown={() => (tocado.current = true)}
                >
                  <circle r={18} fill="#00D2F3" opacity={0.18} className="motion-safe:animate-ping" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
                  <circle r={activo ? 9 : 7} fill="#00D2F3" stroke="#fff" strokeWidth={2} className="cursor-pointer" onClick={() => elegir(p)} />
                  {/* Al lado del punto: cada persona (emoji o foto, nombre y área, con link a LinkedIn) y el lugar. */}
                  <foreignObject x={xy[0] > TAM - 200 ? -200 : 12} y={-12 - p.gente.length * 17} width={188} height={p.gente.length * 38 + 20}>
                    {/* Los muñequitos de antes (👨‍💻 👩‍💻), sueltos sobre el globo, sin cajita de fondo. */}
                    <div className="px-1 py-0.5 text-white [text-shadow:0_1px_3px_rgba(0,0,0,.9)]">
                      {p.gente.map((f) => {
                        const fila = (
                          <span className="flex items-center gap-1.5">
                            <Avatar f={f} className="w-8 h-8 text-[26px] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,.7)]" />
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
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500">Arrastralo para girarlo · tocá un nombre (en el globo o en la lista) para ir a su LinkedIn</p>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.14em] text-cyan-300">De dónde somos</span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">El equipo en el mapa</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-400">Tocá a alguien (en el globo o en la lista) para ir a su LinkedIn.</p>
          {/* Cada lugar aparece una sola vez, con su gente debajo. */}
          <div className="mt-5 space-y-4">
            {puntos.map((p) => (
              <div key={p.lugar} onMouseEnter={() => mirarA(p)}>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" /> {p.lugar}
                </p>
                <ul className="mt-2 grid gap-2">
                  {p.gente.map((f) => (
                    <li key={f.name}>
                      <Persona f={f} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Muy pronto vas a ver al resto del equipo, desde todo LATAM.</p>
        </div>
      </div>
    </div>
  );
};
