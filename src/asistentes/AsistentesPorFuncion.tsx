// Interfaz de los asistentes por función: un botón fijo abajo a la izquierda, un "hub" para elegir
// con quién hablar y el chat de cada asistente. Golondrina (sin su propio botón) entiende lo que
// se escribe, ejecuta la acción del asistente y aprende qué hace cada visitante para sugerírselo.
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Send, X } from 'lucide-react';
import type { Sugerencia } from '../golondrina';
import { irA, navegar, useRuta } from '../rutas';
import { ASISTENTES, EVENTO_PEDIR, PREGUNTA_DE, SUGERENCIAS_DE, accionesDeAsistentes, golondrina, imagenDe, type Asistente, type Enlace } from './funciones';

import { EVENTO_ABRIR_ASISTENTE, EV_ALTERNAR, EV_CERRAR, EV_MENSAJE, EV_ESTADO, EV_REPETIR, type Repetir, abrirAsistente, abrirChatMarcio, dice, gesto, registrarHecho } from './eventos';

export { EVENTO_ABRIR_ASISTENTE, abrirAsistente };

// El escenario 3D se descarga sólo en el inicio (usa three.js).
const Escenario3D = lazy(() => import('./Escenario3D'));

/** Resumen corto de una respuesta, para el globito y la lista de lo que hicieron. */
const resumen = (t: string) => t.replace(/\*\*/g, '').split('\n')[0].slice(0, 90);

interface Mensaje {
  de: 'yo' | 'asistente';
  texto: string;
  enlaces?: Enlace[];
}

/** **negrita** → <b>negrita</b> */
const conNegritas = (t: string) =>
  t.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => (parte.startsWith('**') ? <b key={i} className="text-white">{parte.slice(2, -2)}</b> : <React.Fragment key={i}>{parte}</React.Fragment>));

// El dibujito es la foto del mismo personaje 3D que gira en el inicio (así coinciden).
const Avatar: React.FC<{ a: Asistente; tam?: string }> = ({ a, tam = 'w-10 h-10' }) => (
  <img src={imagenDe(a.id)} alt="" aria-hidden="true" loading="lazy" className={`${tam.replace(/text-\S+/g, '')} shrink-0 object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,.55)]`} />
);

export const AsistentesPorFuncion: React.FC = () => {
  const ruta = useRuta();
  const [abierto, setAbierto] = useState<null | 'hub' | string>(null);
  const abiertoRef = useRef<null | string>(null);
  abiertoRef.current = abierto;
  const [chats, setChats] = useState<Record<string, Mensaje[]>>({});
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [sugeridas, setSugeridas] = useState<Sugerencia[]>([]);
  const enlaces = useRef<Enlace[]>([]);
  const entrada = useRef<HTMLInputElement>(null);
  const preguntarRef = useRef<(q: string) => void>(() => {});
  const ultimo = useRef<string | null>(null);
  // Lo que el asistente le preguntó a la persona y está esperando que responda (por asistente).
  const [esperando, setEsperando] = useState<Record<string, { accion: string; parametro: string }>>({});
  const lista = useRef<HTMLDivElement>(null);

  // Las acciones se definen una vez; los botones que ofrecen se juntan en `enlaces` para la respuesta.
  useEffect(() => {
    golondrina.definirAcciones(accionesDeAsistentes((e) => enlaces.current.push(e)));
  }, []);

  const asistente = ASISTENTES.find((a) => a.id === abierto) ?? null;
  const deLaPagina = ASISTENTES.find((a) => a.paginas.includes(ruta));
  // Cuándo hizo algo un asistente por última vez (si te lleva él a otra sección, no se cambia de asistente).
  const ultimaAccion = useRef(0);
  const rutaEsperada = useRef<string | null>(null);

  /** Cambiar de asistente: te lleva a su sección y el chat queda abierto con él. */
  const cambiarA = (id: string) => {
    ultimo.current = id === 'soporte' ? ultimo.current : id;
    setAbierto(id);
    const pagina = ASISTENTES.find((a) => a.id === id)?.paginas[0];
    if (pagina && pagina !== window.location.pathname) {
      rutaEsperada.current = pagina;
      navegar(pagina as Parameters<typeof navegar>[0]);
    }
  };

  // Si vos te vas a otra sección con el chat abierto, se cambia al asistente de esa sección.
  useEffect(() => {
    if (rutaEsperada.current === ruta) {
      rutaEsperada.current = null;
      return;
    }
    if (!deLaPagina) return;
    // Si te llevó el asistente (hace un instante), sigue el mismo asistente.
    if (Date.now() - ultimaAccion.current < 2500) return;
    setAbierto((v) => (v && v !== deLaPagina.id ? deLaPagina.id : v));
    if (abiertoRef.current) ultimo.current = deLaPagina.id === 'soporte' ? ultimo.current : deLaPagina.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta]);

  const actualizarSugerencias = useCallback((contexto: string) => {
    golondrina.contexto(contexto, { pagina: ruta });
    setSugeridas(golondrina.sugerencias(true).filter((s) => s.confianza >= 0.25).slice(0, 3));
  }, [ruta]);

  useEffect(() => {
    if (abierto) actualizarSugerencias(abierto === 'hub' ? 'inicio-asistentes' : abierto);
  }, [abierto, actualizarSugerencias]);

  useEffect(() => {
    // Al reabrir vuelve al último asistente con el que hablaste (no al menú), o al de la página.
    const auto = () => ultimo.current ?? ASISTENTES.find((a) => a.paginas.includes(window.location.pathname))?.id ?? 'hub';
    const abrir = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      setAbierto(!d || d === 'auto' ? auto() : d);
    };
    const cerrar = () => setAbierto(null);
    const alternar = () => setAbierto((v) => (v ? null : auto()));
    window.addEventListener(EVENTO_ABRIR_ASISTENTE, abrir);
    window.addEventListener(EV_CERRAR, cerrar);
    window.addEventListener(EV_ALTERNAR, alternar);
    return () => {
      window.removeEventListener(EVENTO_ABRIR_ASISTENTE, abrir);
      window.removeEventListener(EV_CERRAR, cerrar);
      window.removeEventListener(EV_ALTERNAR, alternar);
    };
  }, []);


  // Marcio y el botón de abajo se enteran si el chat está abierto.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(EV_ESTADO, { detail: !!abierto }));
  }, [abierto]);

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
  // Al abrir (o cambiar de asistente) se ve el final de la charla, no el principio.
  useEffect(() => {
    if (!abierto || abierto === 'hub') return;
    const t = window.setTimeout(() => {
      const el = lista.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 30);
    return () => window.clearTimeout(t);
  }, [abierto]);

  const preguntar = async (q: string) => {
    if (!asistente || !q.trim() || pensando) return;
    const id = asistente.id;
    setTexto('');
    const pendiente = esperando[id];
    if (pendiente) setEsperando((e) => ({ ...e, [id]: undefined as never }));
    const tq = q.toLowerCase();
    if (/cotiz/.test(tq) && /robot/.test(tq)) {
      void ejecutar('cotizar-robot', {}, 'asistente', q, 'robot');
      return;
    }
    if (pendiente) {
      void ejecutar(pendiente.accion, { [pendiente.parametro]: q }, 'asistente', q, id);
      return;
    }
    agregar(id, { de: 'yo', texto: q });
    ultimaAccion.current = Date.now();
    setPensando(true);
    enlaces.current = [];
    golondrina.contexto(id, { pagina: ruta });
    const r = await golondrina.responder(q);
    const propios = enlaces.current;
    enlaces.current = [];
    const textoR = r?.texto ?? 'No te entendí. Probá con una de las opciones de abajo, o preguntale a Marcio, que sabe de todo un poco.';
    agregar(id, {
      de: 'asistente',
      texto: textoR,
      enlaces: [
        ...propios,
        ...(r?.botones ?? []).map((b) => ({ texto: b.texto, alHacer: b.alHacer })),
        ...(r ? [] : [{ texto: 'Preguntarle a Marcio', alHacer: () => { setAbierto(null); abrirChatMarcio(q); } }]),
      ],
    });
    gesto(id, 'salto');
    dice(id, resumen(textoR));
    if (r) registrarHecho(id, `· «${q.slice(0, 50)}» → ${resumen(textoR)}`, { pregunta: q, titulo: q });
    setPensando(false);
    actualizarSugerencias(id);
  };

  /** Ejecutar una acción tocándola (menú o sugerencia de Golondrina). */
  const ejecutar = async (accionId: string, parametros: Record<string, string>, via: 'asistente' | 'golondrina', titulo: string, destino?: string) => {
    const id = destino ?? asistente?.id;
    if (!id) return;
    if (abierto !== id) setAbierto(id);
    setEsperando((e) => (e[id] ? { ...e, [id]: undefined as never } : e));
    ultimaAccion.current = Date.now();
    // Si te lleva a otra parte y cerrás el chat, al reabrirlo seguís con este asistente.
    ultimo.current = id === 'soporte' ? null : id;
    agregar(id, { de: 'yo', texto: titulo });
    enlaces.current = [];
    golondrina.contexto(id, { pagina: ruta });
    const respuesta = await golondrina.ejecutar(accionId, parametros, via);
    const propios = enlaces.current;
    enlaces.current = [];
    agregar(id, { de: 'asistente', texto: respuesta, enlaces: propios });
    gesto(id, 'saludo');
    dice(id, resumen(respuesta));
    registrarHecho(id, `· ${titulo} → ${resumen(respuesta)}`, { accion: accionId, parametros, titulo });
    actualizarSugerencias(id);
  };

  /** Los botones «de una sola vez» (mandar a ventas) desaparecen después de usarlos. */
  const usado = (indice: number) => {
    if (!asistente) return;
    const id = asistente.id;
    setChats((c) => {
      const lista = [...(c[id] ?? [])];
      if (lista[indice]) lista[indice] = { ...lista[indice], enlaces: [] };
      return { ...c, [id]: lista };
    });
  };

  /** Botón del menú: si necesita un dato, el asistente pregunta y espera (no completa nada solo). */
  const tocarMenu = (accionId: string, titulo: string) => {
    if (!asistente) return;
    const q = PREGUNTA_DE[accionId];
    if (!q) {
      void ejecutar(accionId, {}, 'asistente', titulo);
      return;
    }
    const id = asistente.id;
    agregar(id, { de: 'yo', texto: titulo }, { de: 'asistente', texto: q.pregunta });
    setEsperando((e) => ({ ...e, [id]: { accion: accionId, parametro: q.parametro } }));
    // Algunas acciones sin dato ya muestran opciones (productos): las ejecuto para que aparezcan los botones.
    if (accionId === 'explicar-producto' || accionId === 'probar-producto' || accionId === 'recomendar-combo') {
      enlaces.current = [];
      void golondrina.ejecutar(accionId, {}, 'asistente').then((respuesta) => {
        const propios = enlaces.current;
        enlaces.current = [];
        setChats((c) => {
          const lista = [...(c[id] ?? [])];
          const ultimo = lista[lista.length - 1];
          // En combos, además de preguntar, muestra el detalle de cada uno (qué incluye y desde cuánto).
          if (ultimo) lista[lista.length - 1] = { ...ultimo, ...(accionId === 'recomendar-combo' && respuesta ? { texto: respuesta } : {}), enlaces: propios };
          return { ...c, [id]: lista };
        });
      });
    }
    // Sugerencias para tocar (lo que tocás es tu respuesta).
    const sug = SUGERENCIAS_DE[accionId];
    if (sug) {
      setChats((c) => {
        const lista = [...(c[id] ?? [])];
        const ult = lista[lista.length - 1];
        if (ult) lista[lista.length - 1] = { ...ult, enlaces: sug.map((t) => ({ texto: t, unaVez: true, alHacer: () => void ejecutar(accionId, { [q.parametro]: t }, 'asistente', t, id) })) };
        return { ...c, [id]: lista };
      });
    }
    if (accionId === 'disenar-robot') irA('robot-creacion', true);
    setTexto(q.prefijo ?? '');
    // En el celu no se abre el teclado solo: la persona toca la caja cuando quiere escribir.
    if (window.matchMedia('(pointer: fine)').matches) window.setTimeout(() => entrada.current?.focus(), 50);
  };

  // Mensajes que llegan de afuera (por ejemplo, «Ver en la web» desde la ventana de un servicio).
  const agregarRef = useRef<(id: string, ...m: Mensaje[]) => void>(() => {});
  agregarRef.current = agregar;
  useEffect(() => {
    const llega = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; texto: string; enlaces: Enlace[] }>).detail;
      setAbierto(d.id);
      agregarRef.current(d.id, { de: 'asistente', texto: d.texto, enlaces: d.enlaces });
    };
    window.addEventListener(EV_MENSAJE, llega);
    return () => window.removeEventListener(EV_MENSAJE, llega);
  }, []);

  preguntarRef.current = (q: string) => void preguntar(q);
  // Golondrina: la persona aceptó repetir una tarea → el mismo asistente la vuelve a hacer.
  useEffect(() => {
    const repetir = (e: Event) => {
      const { id, r } = (e as CustomEvent<{ id: string; r: Repetir }>).detail;
      if (r.accion) void ejecutarRef.current(r.accion, r.parametros ?? {}, 'golondrina', r.titulo, id);
      else if (r.pregunta) {
        setAbierto(id);
        window.setTimeout(() => preguntarRef.current(r.pregunta!), 50);
      }
    };
    window.addEventListener(EV_REPETIR, repetir);
    return () => window.removeEventListener(EV_REPETIR, repetir);
  }, []);

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
    return accionesDeAsistentes(() => {}).filter((a) => a.menu && a.secciones?.includes(asistente.id));
  }, [asistente]);



  return (
    <>
      {abierto && (
        <div
          role="dialog"
          data-panel-asistente
          aria-label={asistente ? `Asistente de ${asistente.nombre}` : 'Asistentes'}
          className={`fixed z-[72] inset-x-2 bottom-2 h-[80dvh] sm:inset-x-auto sm:left-5 lg:left-[16rem] sm:bottom-6 sm:top-24 sm:h-auto sm:w-[400px] flex flex-col rounded-3xl bg-[#0B1120]/95 backdrop-blur border border-slate-700 shadow-2xl shadow-black/60 overflow-hidden`}
        >
          {/* Cabecera */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
            {asistente ? (
              <>
                <button type="button" onClick={() => { ultimo.current = null; setAbierto('hub'); }} aria-label="Ver todos los asistentes" className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
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
                <p className="text-xs text-slate-400">Elegí con quién hablar: cada asistente sabe de una parte de la web.</p>
              </div>
            )}
            <button type="button" onClick={() => setAbierto(null)} aria-label="Cerrar" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {asistente && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800 overflow-x-auto no-scrollbar" aria-label="Otros asistentes">
              {ASISTENTES.filter((a) => a.id !== asistente.id).map((a, i) => (
                <button key={a.id} type="button" onClick={() => cambiarA(a.id)} title={`Asistente de ${a.nombre}`} className="shrink-0 cursor-pointer">
                  <span className="asistente-avatar-vivo inline-block" style={{ animationDelay: `${i * 0.25}s` }}>
                    <Avatar a={a} tam="w-7 h-7 text-sm" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {!asistente ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
                              <a key={j} href={e.href} target="_blank" rel="noopener noreferrer" onClick={() => e.unaVez && usado(i)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300">
                                {e.texto} <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <button key={j} type="button" onClick={() => { e.alHacer?.(); if (e.unaVez) usado(i); }} className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 cursor-pointer">
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
              <div className={`px-3 pt-2 flex flex-wrap gap-1.5 ${asistente.id === 'contacto' ? 'pb-8' : ''}`}>
                {menu.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => tocarMenu(a.id, a.menu ?? a.titulo)}
                    className="px-2.5 py-1 rounded-full border border-slate-600 text-[11px] font-semibold text-slate-200 hover:border-cyan-400 hover:text-white cursor-pointer"
                  >
                    {a.menu ?? a.titulo}
                  </button>
                ))}
              </div>
              {asistente.id !== 'contacto' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void preguntar(texto);
                }}
                className="flex gap-2 p-3"
              >
                <label htmlFor="asistente-funcion-texto" className="sr-only">Mensaje para el asistente</label>
                <input
                  ref={entrada}
                  id="asistente-funcion-texto"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  // Cuando el asistente te preguntó algo, la caja se ilumina y te dice qué escribir.
                  placeholder={asistente && esperando[asistente.id] ? (asistente.id === 'contacto' ? 'Escribí tu mensaje para ventas…' : 'Escribí tu respuesta acá…') : 'Escribile con tus palabras…'}
                  className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-900 border ${asistente && esperando[asistente.id] ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700'} text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400`}
                />
                <button type="submit" aria-label="Enviar" disabled={pensando} className="px-3 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-50 cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

/** Escenario 3D con los asistentes girando alrededor del logo de tecnoros (es lo primero que se ve en la web). */
export const EscenarioAsistentes: React.FC<{ alto?: string }> = ({ alto }) => (
  <Suspense fallback={<div className={`${alto ?? 'h-[420px] sm:h-[480px]'} rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse`} />}>
    <Escenario3D alto={alto} />
  </Suspense>
);
