// Interfaz de los asistentes por función: un botón fijo abajo a la izquierda, un "hub" para elegir
// con quién hablar y el chat de cada asistente. Golondrina (sin su propio botón) entiende lo que
// se escribe, ejecuta la acción del asistente y aprende qué hace cada visitante para sugerírselo.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Send, Sparkles, X } from 'lucide-react';
import type { Sugerencia } from '../golondrina';
import { useRuta } from '../rutas';
import { ASISTENTES, EVENTO_PEDIR, accionesDeAsistentes, golondrina, type Asistente, type Enlace } from './funciones';

export const EVENTO_ABRIR_ASISTENTE = 'abrir-asistente';
export const abrirAsistente = (id: string) => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_ASISTENTE, { detail: id }));

interface Mensaje {
  de: 'yo' | 'asistente';
  texto: string;
  enlaces?: Enlace[];
}

/** **negrita** → <b>negrita</b> */
const conNegritas = (t: string) =>
  t.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => (parte.startsWith('**') ? <b key={i} className="text-white">{parte.slice(2, -2)}</b> : <React.Fragment key={i}>{parte}</React.Fragment>));

const Avatar: React.FC<{ a: Asistente; tam?: string }> = ({ a, tam = 'w-10 h-10 text-xl' }) => (
  <span className={`${tam} shrink-0 rounded-2xl bg-gradient-to-br ${a.degrade} flex items-center justify-center shadow-lg`} aria-hidden="true">
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
    agregar(id, {
      de: 'asistente',
      texto: r?.texto ?? 'No te entendí. Probá con una de las opciones de abajo.',
      enlaces: [...propios, ...(r?.botones ?? []).map((b) => ({ texto: b.texto, alHacer: b.alHacer }))],
    });
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
      {/* Botón fijo: muestra el asistente de la página en la que estás */}
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(deLaPagina?.id ?? 'hub')}
          className="fixed z-[62] left-3 sm:left-5 bottom-5 inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-[#0B1120] border border-cyan-400/50 shadow-2xl shadow-black/50 hover:border-cyan-300 cursor-pointer"
          aria-label={deLaPagina ? `Abrir el asistente de ${deLaPagina.nombre}` : 'Abrir los asistentes'}
        >
          {deLaPagina ? (
            <Avatar a={deLaPagina} tam="w-9 h-9 text-lg" />
          ) : (
            <span className="flex -space-x-2">
              {ASISTENTES.slice(0, 3).map((a) => <Avatar key={a.id} a={a} tam="w-8 h-8 text-base ring-2 ring-[#0B1120]" />)}
            </span>
          )}
          <span className="text-left leading-tight">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-cyan-300">Asistentes</span>
            <span className="block text-xs sm:text-sm font-bold text-white">{deLaPagina ? deLaPagina.nombre : '¿Qué querés hacer?'}</span>
          </span>
        </button>
      )}

      {abierto && (
        <div
          role="dialog"
          data-panel-asistente
          aria-label={asistente ? `Asistente de ${asistente.nombre}` : 'Asistentes'}
          className="fixed z-[72] left-2 right-2 sm:left-5 sm:right-auto bottom-3 sm:bottom-5 sm:w-[400px] h-[min(600px,calc(100dvh-6rem))] flex flex-col rounded-3xl bg-[#0B1120] border border-slate-700 shadow-2xl shadow-black/60 overflow-hidden"
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

/** Bloque del inicio que presenta la idea: un asistente para cada cosa. */
export const AsistentesInicio: React.FC = () => (
  <section id="asistentes" className="py-12 sm:py-16 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
        <Sparkles className="w-3.5 h-3.5" /> NUEVO
      </span>
      <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">No tenés que aprender a usar la web</h2>
      <p className="mt-2 text-base sm:text-lg text-slate-300 max-w-3xl">Hay un asistente para cada cosa que podés hacer acá. Elegí uno, contale con tus palabras qué necesitás y te lo muestra o lo hace por vos.</p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ASISTENTES.map((a) => (
          <button key={a.id} type="button" onClick={() => abrirAsistente(a.id)} className="text-left p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 cursor-pointer transition-colors">
            <Avatar a={a} tam="w-11 h-11 text-2xl" />
            <span className="mt-3 block text-base font-bold text-white">{a.nombre}</span>
            <span className="mt-1 block text-xs sm:text-sm text-slate-400 leading-snug">{a.rol}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);
