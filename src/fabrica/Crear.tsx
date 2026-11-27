// /crear · Fábrica de sistemas: la persona cuenta su proceso, se arma la primera versión de su
// sistema y la prueba y la ajusta en vivo, hablando. (Etapa 1: entrevista + generación + vista previa.)
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, Check, GitBranch, ImagePlus, Loader2, RotateCcw, Send, Sparkles, Wand2 } from 'lucide-react';
import { CON_IA, cambiar, entrevistar, generar, type Mensaje, type Turno } from './api';
import { validar, type Spec } from './spec';
import { whatsappLink } from '../data/contact';
import GuiaTunel from './GuiaTunel';

interface Sesion {
  historial: Mensaje[];
  versiones: { spec: Spec; nota: string }[];
}

const CLAVE = 'fabrica-sesion';
const leer = (): Sesion => {
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as Sesion | null;
    if (s && Array.isArray(s.historial) && Array.isArray(s.versiones) && s.versiones.every((v) => !validar(v.spec).length)) return s;
  } catch {
    /* sesión rota: empieza de cero */
  }
  return { historial: [], versiones: [] };
};

const EJEMPLOS = ['Cambiá el color a verde', 'Agregá el campo CUIT a los clientes', 'Sacá el campo notas', 'Que se llame Taller Rivas'];

export const Crear: React.FC = () => {
  const [sesion, setSesion] = useState<Sesion>(leer);
  const [turno, setTurno] = useState<Turno | null>(null);
  const [texto, setTexto] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [pedido, setPedido] = useState('');
  const [nota, setNota] = useState<{ ok: boolean; texto: string } | null>(null);
  const [modo, setModo] = useState<'nuevo' | 'repo'>('nuevo');
  const iframe = useRef<HTMLIFrameElement>(null);
  const chat = useRef<HTMLDivElement>(null);

  const spec = sesion.versiones.at(-1)?.spec ?? null;

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(sesion)); } catch { /* sin almacenamiento */ }
  }, [sesion]);

  // Primera pregunta (o la que corresponda si vuelve a una sesión empezada).
  useEffect(() => {
    if (!spec && !turno) void entrevistar(sesion.historial).then(setTurno);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chat.current?.scrollTo({ top: chat.current.scrollHeight, behavior: 'smooth' });
  }, [sesion.historial, turno]);

  // La vista previa recibe cada versión nueva al instante.
  const mandar = (s: Spec) => iframe.current?.contentWindow?.postMessage({ tipo: 'fabrica:spec', spec: s }, window.location.origin);
  useEffect(() => {
    const oir = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.tipo === 'fabrica:lista' && spec) mandar(spec);
    };
    window.addEventListener('message', oir);
    return () => window.removeEventListener('message', oir);
  }, [spec]);
  useEffect(() => {
    if (spec) mandar(spec);
  }, [spec]);

  const responder = async (respuesta: string) => {
    const r = respuesta.trim();
    if (!r || ocupado || !turno) return;
    const historial: Mensaje[] = [...sesion.historial, { de: 'analista', texto: turno.pregunta }, { de: 'persona', texto: r }];
    setSesion((s) => ({ ...s, historial }));
    setTexto('');
    setOcupado(true);
    setTurno(await entrevistar(historial));
    setOcupado(false);
  };

  const armar = async () => {
    setOcupado(true);
    const s = await generar(sesion.historial);
    setSesion((x) => ({ ...x, versiones: [{ spec: s, nota: 'Primera versión' }] }));
    setOcupado(false);
    setNota({ ok: true, texto: '¡Listo! Probalo: cargá datos, avanzá estados o pedile cosas a Golondrina (abajo a la derecha).' });
  };

  const pedirCambio = async (t: string) => {
    if (!spec || !t.trim() || ocupado) return;
    setOcupado(true);
    const r = await cambiar(spec, t.trim());
    setOcupado(false);
    if ('error' in r) {
      setNota({ ok: false, texto: r.error });
      return;
    }
    setSesion((x) => ({ ...x, versiones: [...x.versiones, { spec: r.spec, nota: r.explicacion }] }));
    setNota({ ok: true, texto: r.explicacion });
    setPedido('');
  };

  const deshacer = () => setSesion((x) => (x.versiones.length > 1 ? { ...x, versiones: x.versiones.slice(0, -1) } : x));
  const empezarDeNuevo = () => {
    setSesion({ historial: [], versiones: [] });
    setTurno(null);
    setNota(null);
    void entrevistar([]).then(setTurno);
  };

  const subirLogo = (f: File | undefined) => {
    if (!f || !spec) return;
    if (f.size > 300_000) {
      setNota({ ok: false, texto: 'El logo tiene que pesar menos de 300 KB.' });
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const nueva = { ...spec, marca: { ...spec.marca, logo: String(lector.result) } };
      if (validar(nueva).length) {
        setNota({ ok: false, texto: 'Ese archivo no es una imagen PNG, JPG, SVG o WEBP.' });
        return;
      }
      setSesion((x) => ({ ...x, versiones: [...x.versiones, { spec: nueva, nota: 'Subiste el logo' }] }));
      setNota({ ok: true, texto: 'Logo puesto.' });
    };
    lector.readAsDataURL(f);
  };

  const quiero = () => {
    if (!spec) return;
    const resumen = `${spec.negocio.nombre} (${spec.negocio.rubro}): ${spec.entidades.map((e) => e.plural).join(', ')}; ${spec.roles.length} roles; ${sesion.versiones.length} versiones.`;
    window.open(whatsappLink(`Hola tecnoros.ar, armé mi sistema en la fábrica y lo quiero: ${resumen}`), '_blank', 'noopener');
  };

  return (
    <section className="pt-24 sm:pt-28 pb-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" /> Fábrica de sistemas
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Contanos tu negocio y <span className="text-cyan-300">probá tu sistema hoy</span></h1>
        <p className="mt-3 text-slate-300 max-w-3xl">No hace falta saber de software: te preguntamos como un analista, armamos la primera versión y la ajustás hablando. Sale con Golondrina adentro para usarlo por chat.</p>

        <div className="mt-6 inline-flex rounded-xl border border-slate-700 overflow-hidden" role="tablist">
          <button type="button" role="tab" aria-selected={modo === 'nuevo'} onClick={() => setModo('nuevo')} className={`px-4 py-2 text-sm font-bold cursor-pointer ${modo === 'nuevo' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300'}`}>Quiero un sistema nuevo</button>
          <button type="button" role="tab" aria-selected={modo === 'repo'} onClick={() => setModo('repo')} className={`px-4 py-2 text-sm font-bold cursor-pointer ${modo === 'repo' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300'}`}>Ya tengo un sistema</button>
        </div>
        {!CON_IA && <p className="mt-3 text-xs text-amber-300">Vista previa sin IA conectada: la entrevista es guiada y los cambios entienden pedidos simples.</p>}

        {modo === 'repo' ? (
          <>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 max-w-3xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><GitBranch className="w-5 h-5 text-cyan-300" /> Análisis de tu sistema actual</h2>
            <p className="mt-2 text-slate-300">Pegás la dirección del repositorio, lo levantamos en un entorno aislado, te mostramos cómo funciona y te entregamos qué hace hoy, qué le falta para tu rubro y qué conviene agregar primero.</p>
            <p className="mt-3 text-sm text-amber-300">El análisis automático sale en la próxima etapa. Mientras tanto, escribinos con el repositorio o con el link de tu túnel (abajo te explicamos cómo sacarlo) y lo analizamos con vos.</p>
            <a href={whatsappLink('Hola tecnoros.ar, quiero que analicen mi sistema actual. El repositorio es: ')} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold">Pedir el análisis <ArrowRight className="w-4 h-4" /></a>
          </div>
          <GuiaTunel />
          </>
        ) : !spec ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col min-h-[460px]">
              <div ref={chat} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[60vh]">
                {sesion.historial.map((m, i) => (
                  <div key={i} className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] ${m.de === 'analista' ? 'bg-slate-800 text-slate-100' : 'ml-auto bg-cyan-400 text-slate-950'}`}>{m.texto}</div>
                ))}
                {turno && (
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-100 text-[15px]">
                    <span className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold mb-1"><Bot className="w-3.5 h-3.5" /> Analista</span>
                    {turno.pregunta}
                    {turno.ayuda && <span className="block mt-1 text-xs text-slate-400">{turno.ayuda}</span>}
                  </div>
                )}
                {ocupado && <Loader2 className="w-5 h-5 text-cyan-300 animate-spin" aria-label="Pensando" />}
              </div>
              {turno && !turno.listo && (
                <div className="border-t border-slate-800 p-3">
                  {turno.opciones && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {turno.opciones.map((o) => <button key={o} type="button" disabled={ocupado} onClick={() => void responder(o)} className="px-3 py-1.5 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-cyan-400 cursor-pointer">{o}</button>)}
                    </div>
                  )}
                  <form onSubmit={(e) => { e.preventDefault(); void responder(texto); }} className="flex gap-2">
                    <input value={texto} onChange={(e) => setTexto(e.target.value.slice(0, 400))} placeholder="Contalo con tus palabras…" className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white" aria-label="Tu respuesta" />
                    <button type="submit" disabled={ocupado || !texto.trim()} className="px-4 rounded-xl bg-cyan-400 text-slate-950 font-bold disabled:opacity-50 cursor-pointer" aria-label="Enviar"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              )}
              {turno?.listo && (
                <div className="border-t border-slate-800 p-4">
                  <button type="button" onClick={() => void armar()} disabled={ocupado} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold cursor-pointer disabled:opacity-60">
                    {ocupado ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />} Armar mi primera versión
                  </button>
                </div>
              )}
            </div>
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-sm font-bold text-white">Lo que voy entendiendo</h2>
              <p className="text-xs text-slate-400 mt-1">Si algo no está bien, decímelo en la próxima respuesta.</p>
              {[['Lo que registrás', turno?.resumen.entidades], ['Quiénes lo usan', turno?.resumen.roles], ['Cómo avanza', turno?.resumen.flujos], ['Lo que se automatiza', turno?.resumen.dolores]].map(([t, items]) => (
                <div key={String(t)} className="mt-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300">{String(t)}</h3>
                  {(items as string[] | undefined)?.length ? (
                    <ul className="mt-1.5 space-y-1 text-sm text-slate-200">{(items as string[]).map((x) => <li key={x} className="flex gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{x}</li>)}</ul>
                  ) : <p className="mt-1 text-sm text-slate-500">Todavía nada.</p>}
                </div>
              ))}
            </aside>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-slate-700 overflow-hidden bg-white">
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-100 text-slate-600 text-xs">
                <span>Vista previa · versión {sesion.versiones.length} · {spec.negocio.nombre}</span>
                <span>Datos de ejemplo</span>
              </div>
              <iframe ref={iframe} title={`Vista previa de ${spec.negocio.nombre}`} src="/vista-sistema.html" className="w-full h-[68vh] min-h-[520px] block" />
            </div>
            <aside className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-sm font-bold text-white">Pedí un cambio</h2>
                <form onSubmit={(e) => { e.preventDefault(); void pedirCambio(pedido); }} className="mt-2">
                  <textarea value={pedido} onChange={(e) => setPedido(e.target.value.slice(0, 400))} placeholder="Ej.: agregá el campo patente a las órdenes de trabajo" className="w-full min-h-[84px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm" />
                  <button type="submit" disabled={ocupado || !pedido.trim()} className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold disabled:opacity-50 cursor-pointer">
                    {ocupado ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Aplicar
                  </button>
                </form>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {EJEMPLOS.map((e) => <button key={e} type="button" onClick={() => setPedido(e)} className="px-2 py-1 rounded-full border border-slate-700 text-xs text-slate-300 hover:border-cyan-400 cursor-pointer">{e}</button>)}
                </div>
                {nota && <p role="status" className={`mt-3 text-sm ${nota.ok ? 'text-emerald-300' : 'text-amber-300'}`}>{nota.texto}</p>}
                <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <ImagePlus className="w-4 h-4 text-cyan-300" /> Subir mi logo
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(e) => subirLogo(e.target.files?.[0])} />
                </label>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-sm font-bold text-white">Versiones</h2>
                <ol className="mt-2 space-y-1 text-sm text-slate-300 max-h-40 overflow-y-auto">
                  {sesion.versiones.map((v, i) => <li key={i}><span className="text-slate-500">{i + 1}.</span> {v.nota}</li>)}
                </ol>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={deshacer} disabled={sesion.versiones.length < 2} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-200 disabled:opacity-40 cursor-pointer"><RotateCcw className="w-4 h-4" /> Deshacer</button>
                  <button type="button" onClick={empezarDeNuevo} className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 cursor-pointer">Empezar de nuevo</button>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <h2 className="text-sm font-bold text-white">¿Te sirve así?</h2>
                <p className="mt-1 text-sm text-slate-300">Lo publicamos con tu dominio, alojamiento y mantenimiento. El pago online sale en la próxima etapa; por ahora lo coordinamos por WhatsApp.</p>
                <button type="button" onClick={quiero} className="mt-3 w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-extrabold cursor-pointer">Quiero este sistema</button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default Crear;
