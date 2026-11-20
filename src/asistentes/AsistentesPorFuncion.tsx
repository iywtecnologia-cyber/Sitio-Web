// Interfaz de los asistentes por función: un botón fijo abajo a la izquierda, un "hub" para elegir
// con quién hablar y el chat de cada asistente. Golondrina (sin su propio botón) entiende lo que
// se escribe, ejecuta la acción del asistente y aprende qué hace cada visitante para sugerírselo.
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Send, Sparkles, X } from 'lucide-react';
import type { Sugerencia } from '../golondrina';
import { useRuta } from '../rutas';
import { TecnorosLogo } from '../components/TecnorosLogo';
import { ASISTENTES, EVENTO_PEDIR, accionesDeAsistentes, golondrina, type Asistente, type Enlace } from './funciones';

import { EVENTO_ABRIR_ASISTENTE, abrirAsistente, dice, gesto, registrarHecho } from './eventos';

export { EVENTO_ABRIR_ASISTENTE, abrirAsistente };

// El escenario 3D se descarga sólo en el inicio (usa three.js).
const Escenario3D = lazy(() => import('./Escenario3D'));

/** Resumen corto de una respuesta, para el globito y la lista de lo que hicieron. */
const resumen = (t: string) => t.replace(/\*\*/g, '').split('\n')[0].slice(0, 90);

/** Lanzador con vida: el logo de tecnoros en el centro y los asistentes girando alrededor, todo el tiempo. */
const MiniOrbita: React.FC<{ resaltado?: string }> = ({ resaltado }) => {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const t0 = performance.now();
    const cuadro = (ahora: number) => {
      const t = (ahora - t0) / 1000;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const a = t * 0.9 + (i / ASISTENTES.length) * Math.PI * 2;
        const x = Math.cos(a) * 30;
        const y = Math.sin(a) * 12;
        const prof = (Math.sin(a) + 1) / 2;
        el.style.transform = `translate(${x}px, ${y}px) scale(${0.7 + prof * 0.45})`;
        el.style.zIndex = String(Math.round(prof * 10));
        el.style.opacity = String(0.55 + prof * 0.45);
      });
      raf = requestAnimationFrame(cuadro);
    };
    raf = requestAnimationFrame(cuadro);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span className="relative w-[84px] h-12 flex items-center justify-center" aria-hidden="true">
      {ASISTENTES.map((a, i) => (
        <span
          key={a.id}
          ref={(el) => { refs.current[i] = el; }}
          className={`absolute w-6 h-6 flex items-center justify-center drop-shadow-[0_2px_3px_rgba(0,0,0,.6)] ${a.id === resaltado ? 'text-[19px]' : 'text-[15px]'}`}
          style={{ transform: `translate(${Math.cos((i / ASISTENTES.length) * Math.PI * 2) * 30}px, ${Math.sin((i / ASISTENTES.length) * Math.PI * 2) * 12}px)` }}
        >
          {a.emoji}
        </span>
      ))}
      <TecnorosLogo className="relative z-[5] w-6 h-7 drop-shadow-[0_0_8px_rgba(0,210,243,.6)]" />
    </span>
  );
};

interface Mensaje {
  de: 'yo' | 'asistente';
  texto: string;
  enlaces?: Enlace[];
}

/** **negrita** → <b>negrita</b> */
const conNegritas = (t: string) =>
  t.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => (parte.startsWith('**') ? <b key={i} className="text-white">{parte.slice(2, -2)}</b> : <React.Fragment key={i}>{parte}</React.Fragment>));

const Avatar: React.FC<{ a: Asistente; tam?: string }> = ({ a, tam = 'w-10 h-10 text-xl' }) => (
  <span className={`${tam} shrink-0 flex items-center justify-center drop-shadow-[0_3px_4px_rgba(0,0,0,.55)] !text-[1.6em]`} aria-hidden="true">
    {a.emoji}
  </span>
);

export const AsistentesPorFuncion: React.FC = () => {
  const ruta = useRuta();
  const [abierto, setAbierto] = useState<null | 'hub' | string>(null);
  const [chats, setChats] = useState<Record<string, Mensaje[]>>({});
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [sugeridas, setSugeridas] = useState<Sugerencia[]>([]);
  const enlaces = useRef<Enlace[]>([]);
  const lista = useRef<HTMLDivElement>(null);

  // Las acciones se definen una vez; los botones que ofrecen se juntan en `enlaces` para la respuesta.
  useEffect(() => {
    golondrina.definirAcciones(accionesDeAsistentes((e) => enlaces.current.push(e)));
  }, []);

  const asistente = ASISTENTES.find((a) => a.id === abierto) ?? null;
  const deLaPagina = ASISTENTES.find((a) => a.paginas.includes(ruta));

  const actualizarSugerencias = useCallback((contexto: string) => {
    golondrina.contexto(contexto, { pagina: ruta });
    setSugeridas(golondrina.sugerencias(true).filter((s) => s.confianza >= 0.25).slice(0, 3));
  }, [ruta]);

  useEffect(() => {
    if (abierto) actualizarSugerencias(abierto === 'hub' ? 'inicio-asistentes' : abierto);
  }, [abierto, actualizarSugerencias]);

  useEffect(() => {
    const abrir = (e: Event) => setAbierto((e as CustomEvent<string>).detail || 'hub');
    window.addEventListener(EVENTO_ABRIR_ASISTENTE, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_ASISTENTE, abrir);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(null);
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [abierto]);

  const chat: Mensaje[] = asistente ? chats[asistente.id] ?? [{ de: 'asistente', texto: asistente.saludo }] : [];
  const agregar = (id: string, ...m: Mensaje[]) =>
    setChats((c) => ({ ...c, [id]: [...(c[id] ?? [{ de: 'asistente', texto: ASISTENTES.find((a) => a.id === id)!.saludo }]), ...m] }));

  // Arriba queda la pregunta: la respuesta se lee desde el principio.
  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const preguntas = el.querySelectorAll('[data-yo]');
    const ultima = preguntas[preguntas.length - 1] as HTMLElement | undefined;
    el.scrollTo({ top: ultima ? ultima.offsetTop - 8 : 0, behavior: 'smooth' });
  }, [chat.length]);

  const preguntar = async (q: string) => {
    if (!asistente || !q.trim() || pensando) return;
    const id = asistente.id;
    setTexto('');
    agregar(id, { de: 'yo', texto: q });
    setPensando(true);
    enlaces.current = [];
    golondrina.contexto(id, { pagina: ruta });
    const r = await golondrina.responder(q);
    const propios = enlaces.current;
    enlaces.current = [];
    const textoR = r?.texto ?? 'No te entendí. Probá con una de las opciones de abajo.';
    agregar(id, {
      de: 'asistente',
      texto: textoR,
      enlaces: [...propios, ...(r?.botones ?? []).map((b) => ({ texto: b.texto, alHacer: b.alHacer }))],
    });
    gesto(id, 'salto');
    dice(id, resumen(textoR));
    if (r) registrarHecho(id, `· «${q.slice(0, 50)}» → ${resumen(textoR)}`);
    setPensando(false);
    actualizarSugerencias(id);
  };

  /** Ejecutar una acción tocándola (menú o sugerencia de Golondrina). */
  const ejecutar = async (accionId: string, parametros: Record<string, string>, via: 'asistente' | 'golondrina', titulo: string, destino?: string) => {
    const id = destino ?? asistente?.id;
    if (!id) return;
    if (abierto !== id) setAbierto(id);
    agregar(id, { de: 'yo', texto: titulo });
    enlaces.current = [];
    golondrina.contexto(id, { pagina: ruta });
    const respuesta = await golondrina.ejecutar(accionId, parametros, via);
    const propios = enlaces.current;
    enlaces.current = [];
    agregar(id, { de: 'asistente', texto: respuesta, enlaces: propios });
    gesto(id, 'saludo');
    dice(id, resumen(respuesta));
    registrarHecho(id, `· ${titulo} → ${resumen(respuesta)}`);
    actualizarSugerencias(id);
  };

  // Un asistente le pasa la posta a otro (ej. Servicios → Presupuesto).
  const ejecutarRef = useRef(ejecutar);
  ejecutarRef.current = ejecutar;
  useEffect(() => {
    const pedir = (e: Event) => {
      const d = (e as CustomEvent<{ asistente: string; accion: string; parametros: Record<string, string>; titulo: string }>).detail;
      void ejecutarRef.current(d.accion, d.parametros, 'asistente', d.titulo, d.asistente);
    };
    window.addEventListener(EVENTO_PEDIR, pedir);
    return () => window.removeEventListener(EVENTO_PEDIR, pedir);
  }, []);

  // Menú de cada asistente: lo que tiene parámetro libre deja escrito el ejemplo; lo demás se hace al tocar.
  const menu = useMemo(() => {
    if (!asistente) return [];
    return accionesDeAsistentes(() => {}).filter((a) => a.secciones?.includes(asistente.id));
  }, [asistente]);

  const asistenteDeAccion = (accionId: string) => accionesDeAsistentes(() => {}).find((a) => a.id === accionId)?.secciones?.[0];

  const Sugerencias = ({ enHub }: { enHub?: boolean }) =>
    sugeridas.length ? (
      <div className={`flex flex-wrap gap-1.5 ${enHub ? '' : 'px-3 pt-2'}`}>
        {sugeridas.map((s) => (
          <button
            key={s.clave}
            type="button"
            title={s.mensaje}
            onClick={() => void ejecutar(s.accion, s.parametros, 'golondrina', s.boton, asistenteDeAccion(s.accion))}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-400/25 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> {s.boton}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      {/* Lanzador fijo: los asistentes giran alrededor del logo todo el tiempo (también con el chat abierto) */}
      <button
        type="button"
        onClick={() => setAbierto((v) => (v ? null : deLaPagina?.id ?? 'hub'))}
        className={`fixed z-[62] left-3 sm:left-5 bottom-4 sm:bottom-5 items-center gap-1.5 pl-1 pr-3.5 py-1 rounded-2xl bg-[#0B1120] border border-cyan-400/50 shadow-2xl shadow-black/50 hover:border-cyan-300 cursor-pointer ${abierto ? 'hidden sm:inline-flex' : 'inline-flex'}`}
        aria-expanded={!!abierto}
        aria-label={abierto ? 'Cerrar los asistentes' : deLaPagina ? `Abrir el asistente de ${deLaPagina.nombre}` : 'Abrir los asistentes'}
      >
        <MiniOrbita resaltado={asistente?.id ?? deLaPagina?.id} />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-cyan-300">Asistentes</span>
          <span className="block text-xs sm:text-sm font-bold text-white">{asistente ? asistente.nombre : deLaPagina ? deLaPagina.nombre : '¿Qué querés hacer?'}</span>
        </span>
      </button>

      {abierto && (
        <div
          role="dialog"
          data-panel-asistente
          aria-label={asistente ? `Asistente de ${asistente.nombre}` : 'Asistentes'}
          className="fixed z-[72] inset-x-2 bottom-2 h-[62dvh] sm:inset-x-auto sm:left-5 sm:bottom-24 sm:top-24 sm:h-auto sm:w-[400px] flex flex-col rounded-3xl bg-[#0B1120]/95 backdrop-blur border border-slate-700 shadow-2xl shadow-black/60 overflow-hidden"
        >
          {/* Cabecera */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
            {asistente ? (
              <>
                <button type="button" onClick={() => setAbierto('hub')} aria-label="Ver todos los asistentes" className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="asistente-avatar-vivo"><Avatar a={asistente} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">Asistente de {asistente.nombre}</p>
                  <p className="text-xs text-slate-400 truncate">{asistente.rol}</p>
                </div>
              </>
            ) : (
              <div className="flex-1">
                <p className="text-sm font-bold text-white">¿Qué querés hacer?</p>
                <p className="text-xs text-slate-400">Elegí con quién hablar: cada uno sabe de una parte de la web.</p>
              </div>
            )}
            <button type="button" onClick={() => setAbierto(null)} aria-label="Cerrar" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {asistente && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800 overflow-x-auto no-scrollbar" aria-label="Otros asistentes">
              {ASISTENTES.filter((a) => a.id !== asistente.id).map((a, i) => (
                <button key={a.id} type="button" onClick={() => setAbierto(a.id)} title={`Asistente de ${a.nombre}`} className="shrink-0 cursor-pointer">
                  <span className="asistente-avatar-vivo inline-block" style={{ animationDelay: `${i * 0.25}s` }}>
                    <Avatar a={a} tam="w-7 h-7 text-sm" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {!asistente ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {sugeridas.length > 0 && (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-300"><Sparkles className="w-3.5 h-3.5" /> Golondrina aprendió lo que solés hacer</p>
                  <div className="mt-2"><Sugerencias enHub /></div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {ASISTENTES.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAbierto(a.id)}
                    className={`text-left p-3 rounded-2xl border bg-slate-900/70 hover:bg-slate-800/80 cursor-pointer ${a.id === deLaPagina?.id ? 'border-cyan-400/60' : 'border-slate-800'}`}
                  >
                    <Avatar a={a} tam="w-9 h-9 text-lg" />
                    <span className="mt-2 block text-sm font-bold text-white leading-tight">{a.nombre}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400 leading-snug">{a.rol}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div ref={lista} className="relative flex-1 overflow-y-auto p-3 space-y-2.5">
                {chat.map((m, i) => (
                  <div key={i} data-yo={m.de === 'yo' ? '' : undefined} className={`flex ${m.de === 'yo' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line leading-snug ${m.de === 'yo' ? 'bg-cyan-500 text-slate-950 font-semibold rounded-br-md' : 'bg-slate-800/80 text-slate-200 rounded-bl-md'}`}>
                      {m.de === 'asistente' ? conNegritas(m.texto) : m.texto}
                      {m.enlaces && m.enlaces.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.enlaces.map((e, j) =>
                            e.href ? (
                              <a key={j} href={e.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300">
                                {e.texto} <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <button key={j} type="button" onClick={e.alHacer} className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 cursor-pointer">
                                {e.texto}
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {pensando && (
                  <div className="flex items-center gap-1 px-3 py-2.5 w-fit rounded-2xl bg-slate-800/80" aria-label="Escribiendo">
                    {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                )}
              </div>
              <Sugerencias />
              <div className="px-3 pt-2 flex flex-wrap gap-1.5">
                {menu.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => (a.parametros?.some((p) => p.libre) && a.ejemplo ? setTexto(a.ejemplo) : void ejecutar(a.id, {}, 'asistente', a.menu ?? a.titulo))}
                    className="px-2.5 py-1 rounded-full border border-slate-600 text-[11px] font-semibold text-slate-200 hover:border-cyan-400 hover:text-white cursor-pointer"
                  >
                    {a.menu ?? a.titulo}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void preguntar(texto);
                }}
                className="flex gap-2 p-3"
              >
                <label htmlFor="asistente-funcion-texto" className="sr-only">Mensaje para el asistente</label>
                <input
                  id="asistente-funcion-texto"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escribile con tus palabras…"
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button type="submit" aria-label="Enviar" disabled={pensando} className="px-3 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-50 cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

/** Bloque del inicio: el escenario 3D con los asistentes girando alrededor del logo de tecnoros. */
export const AsistentesInicio: React.FC = () => (
  <section id="asistentes" className="py-12 sm:py-16 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
        <Sparkles className="w-3.5 h-3.5" /> NUEVO
      </span>
      <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">No tenés que aprender a usar la web</h2>
      <p className="mt-2 text-base sm:text-lg text-slate-300 max-w-3xl">
        Hay un asistente para cada cosa que podés hacer acá, y giran siempre alrededor de tecnoros, coordinados por Golondrina, que aprende de lo que hacés. Tocá uno, contale con tus palabras qué necesitás y te lo muestra o lo hace por vos.
      </p>
      <div className="mt-6">
        <Suspense fallback={<div className="h-[420px] sm:h-[480px] rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />}>
          <Escenario3D />
        </Suspense>
      </div>
    </div>
  </section>
);
