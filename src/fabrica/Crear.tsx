// /crear · Fábrica de sistemas: la persona cuenta su proceso, se arma la primera versión de su
// sistema y la prueba y la ajusta en vivo, hablando. (Etapa 1: entrevista + generación + vista previa.)
import React, { useEffect, useRef, useState } from 'react';
import { Bot, Check, Code2, Copy, ImagePlus, Loader2, RotateCcw, Send, Sparkles, User, Wand2 } from 'lucide-react';
import { CON_IA, cambiar, entrevistar, generar, guardar, ver, type Cambio, type Mensaje, type Proyecto, type ProyectoVisto, type Turno } from './api';
import { validar, type OpParche, type Spec } from './spec';
import { Cambios, Parche } from './Cambios';
import Comprar from './Comprar';

interface Sesion {
  historial: Mensaje[];
  versiones: { spec: Spec; nota: string }[];
  cambios: Cambio[];
  proyecto?: Proyecto;
}

interface Pendiente {
  pedido: string;
  explicacion: string;
  parche: OpParche[];
  spec: Spec;
  de: Cambio['de'];
}

const hoy = () => new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const nuevoId = () => Math.random().toString(36).slice(2, 10);

/** Link de invitado: #p=<id>&dev=<clave>. Va en el fragmento para que no viaje a ningún servidor al abrirlo. */
const invitado = () => {
  const h = new URLSearchParams(window.location.hash.slice(1));
  const id = h.get('p') ?? '';
  const clave = h.get('dev') ?? '';
  return /^[a-z0-9]{12}$/.test(id) && /^[a-f0-9]{40}$/.test(clave) ? { id, clave } : null;
};

const CLAVE = 'fabrica-sesion';
const leer = (): Sesion => {
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as Sesion | null;
    if (s && Array.isArray(s.historial) && Array.isArray(s.versiones) && s.versiones.every((v) => !validar(v.spec).length)) return { ...s, cambios: Array.isArray(s.cambios) ? s.cambios : [] };
  } catch {
    /* sesión rota: empieza de cero */
  }
  return { historial: [], versiones: [], cambios: [] };
};

const EJEMPLOS = ['Cambiá el color a verde', 'Agregá el campo CUIT a los clientes', 'Sacá el campo notas', 'Que se llame Taller Rivas'];

export const Crear: React.FC = () => {
  const [sesion, setSesion] = useState<Sesion>(leer);
  const [turno, setTurno] = useState<Turno | null>(null);
  const [texto, setTexto] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [pedido, setPedido] = useState('');
  const [nota, setNota] = useState<{ ok: boolean; texto: string } | null>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const chat = useRef<HTMLDivElement>(null);

  const [pendiente, setPendiente] = useState<Pendiente | null>(null);
  const [tecnico, setTecnico] = useState(false);
  const [lector, setLector] = useState<ProyectoVisto | null>(null);
  const [errorLector, setErrorLector] = useState('');
  const [compra, setCompra] = useState<{ estado: string; abono: string | null }>({ estado: 'borrador', abono: null });
  const [avisoPago, setAvisoPago] = useState('');
  const [copiado, setCopiado] = useState(false);
  const esInvitado = useRef(invitado());

  // El programador invitado ve la última versión guardada, solo lectura.
  const spec = lector ? lector.versiones.at(-1)?.spec ?? null : sesion.versiones.at(-1)?.spec ?? null;
  // Mientras hay un cambio sin aprobar, la vista previa muestra cómo quedaría.
  const specVista = !lector && pendiente ? pendiente.spec : spec;
  const cambios = lector ? lector.cambios : sesion.cambios;
  const soloLectura = Boolean(lector);

  useEffect(() => {
    const inv = esInvitado.current;
    if (!inv) return;
    setTecnico(true);
    ver(inv.id, inv.clave).then(setLector).catch(() => setErrorLector('No pudimos abrir ese sistema: el link no es válido o venció.'));
  }, []);

  // Vuelta de Mercado Pago: lo que vale es lo que confirma el servidor, no la dirección.
  useEffect(() => {
    const pago = new URLSearchParams(window.location.search).get('pago');
    const pr = sesion.proyecto;
    if (!pr) return;
    ver(pr.id, pr.clave).then((v) => {
      setCompra({ estado: v.proyecto.estado, abono: v.proyecto.abono });
      if (pago) setAvisoPago(v.proyecto.estado !== 'borrador' ? '¡Pago confirmado! Ya estamos publicando tu sistema.' : pago === 'error' ? 'El pago no se completó. Podés intentarlo de nuevo.' : 'Mercado Pago todavía está procesando el pago. Apenas se confirme lo vas a ver acá.');
    }).catch(() => { if (pago) setAvisoPago('No pudimos confirmar el pago todavía. Recargá la página en unos minutos.'); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(sesion)); } catch { /* sin almacenamiento */ }
  }, [sesion]);

  // Primera pregunta (o la que corresponda si vuelve a una sesión empezada).
  useEffect(() => {
    if (!spec && !turno && !esInvitado.current) void entrevistar(sesion.historial).then(setTurno);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chat.current?.scrollTo({ top: chat.current.scrollHeight, behavior: 'smooth' });
  }, [sesion.historial, turno]);

  // La vista previa recibe cada versión nueva al instante.
  const mandar = (s: Spec) => iframe.current?.contentWindow?.postMessage({ tipo: 'fabrica:spec', spec: s }, window.location.origin);
  useEffect(() => {
    const oir = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframe.current?.contentWindow) return;
      if (e.data?.tipo === 'fabrica:lista' && specVista) mandar(specVista);
      // Cambio pedido a Golondrina desde adentro del sistema: queda propuesto, a la espera de aprobación.
      if (e.data?.tipo === 'fabrica:pedido' && typeof e.data.texto === 'string') void pedirCambio(e.data.texto, 'golondrina');
    };
    window.addEventListener('message', oir);
    return () => window.removeEventListener('message', oir);
  }); // sin dependencias: siempre usa el estado actual
  useEffect(() => {
    if (specVista) mandar(specVista);
  }, [specVista]);

  /** Guarda en el servidor (si hay) y recuerda las claves del proyecto. */
  const sincronizar = async (x: Sesion, nota: string): Promise<Proyecto | null> => {
    const s = x.versiones.at(-1)?.spec;
    if (!s) return null;
    const pr = await guardar(x.proyecto, s, nota, x.historial, x.cambios);
    if (pr) setSesion((y) => ({ ...y, proyecto: pr }));
    return pr;
  };

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
    const nueva: Sesion = { ...sesion, versiones: [{ spec: s, nota: 'Primera versión' }], cambios: [], proyecto: undefined };
    setSesion(nueva);
    void sincronizar(nueva, 'Primera versión');
    setOcupado(false);
    setNota({ ok: true, texto: '¡Listo! Probalo: cargá datos, avanzá estados o pedile cosas a Golondrina (abajo a la derecha).' });
  };

  // Un pedido no cambia el sistema: arma una propuesta que se ve al instante y espera aprobación.
  const pedirCambio = async (t: string, de: Cambio['de'] = 'dueno') => {
    if (!spec || !t.trim() || ocupado || soloLectura) return;
    if (pendiente) {
      setNota({ ok: false, texto: 'Primero aprobá o descartá el cambio que está en la vista previa.' });
      return;
    }
    setOcupado(true);
    const r = await cambiar(spec, t.trim());
    setOcupado(false);
    if ('error' in r) {
      setNota({ ok: false, texto: r.error });
      return;
    }
    setPendiente({ pedido: t.trim(), explicacion: r.explicacion, parche: r.parche, spec: r.spec, de });
    setNota(null);
    setPedido('');
  };

  const resolver = (aprobar: boolean) => {
    if (!pendiente) return;
    const cambio: Cambio = { id: nuevoId(), pedido: pendiente.pedido, explicacion: pendiente.explicacion, parche: pendiente.parche, de: pendiente.de, fecha: hoy(), estado: aprobar ? 'aprobado' : 'descartado', version: aprobar ? sesion.versiones.length + 1 : null };
    const nueva: Sesion = { ...sesion, versiones: aprobar ? [...sesion.versiones, { spec: pendiente.spec, nota: pendiente.explicacion }] : sesion.versiones, cambios: [...sesion.cambios, cambio] };
    setSesion(nueva);
    setPendiente(null);
    setNota({ ok: aprobar, texto: aprobar ? `Aplicado: ${pendiente.explicacion}` : 'Cambio descartado: el sistema quedó como estaba.' });
    if (aprobar) void sincronizar(nueva, pendiente.explicacion);
  };

  const deshacer = () => {
    if (sesion.versiones.length < 2 || pendiente) return;
    const n = sesion.versiones.length;
    const nueva: Sesion = { ...sesion, versiones: sesion.versiones.slice(0, -1), cambios: sesion.cambios.map((c) => (c.version === n && c.estado === 'aprobado' ? { ...c, estado: 'deshecho' as const } : c)) };
    setSesion(nueva);
    void sincronizar(nueva, `Se deshizo la versión ${n}`);
  };
  const empezarDeNuevo = () => {
    setSesion({ historial: [], versiones: [], cambios: [] });
    setPendiente(null);
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
      const con: Sesion = { ...sesion, versiones: [...sesion.versiones, { spec: nueva, nota: 'Subiste el logo' }], cambios: [...sesion.cambios, { id: nuevoId(), pedido: 'Subir mi logo', explicacion: 'Se cargó el logo del negocio.', parche: [], de: 'dueno', fecha: hoy(), estado: 'aprobado', version: sesion.versiones.length + 1 }] };
      setSesion(con);
      void sincronizar(con, 'Subiste el logo');
      setNota({ ok: true, texto: 'Logo puesto.' });
    };
    lector.readAsDataURL(f);
  };

  const resumen = spec ? `${spec.negocio.nombre} (${spec.negocio.rubro}): ${spec.entidades.map((e) => e.plural).join(', ')}; ${spec.roles.length} roles; versión ${sesion.versiones.length}.` : '';
  const linkDev = sesion.proyecto ? `${window.location.origin}/crear#p=${sesion.proyecto.id}&dev=${sesion.proyecto.claveDev}` : '';
  const copiarLink = () => {
    navigator.clipboard?.writeText(linkDev).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1600); }).catch(() => {});
  };

  return (
    <section className="pt-24 sm:pt-28 pb-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" /> Fábrica de sistemas
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Contanos tu negocio y <span className="text-cyan-300">probá tu sistema hoy</span></h1>
        <p className="mt-3 text-slate-300 max-w-3xl">No hace falta saber de software: te preguntamos como un analista, armamos la primera versión y la ajustás hablando. Sale con Golondrina adentro para usarlo por chat.</p>

        {!CON_IA && <p className="mt-3 text-xs text-amber-300">Vista previa sin IA conectada: la entrevista es guiada y los cambios entienden pedidos simples.</p>}

        {avisoPago && <p role="status" className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{avisoPago}</p>}
        {esInvitado.current && !lector ? (
          <p role="status" className="mt-6 text-slate-300">{errorLector || 'Abriendo el sistema…'}</p>
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
                <span>Vista previa · versión {lector ? lector.versiones.at(-1)?.numero : sesion.versiones.length} · {spec.negocio.nombre}</span>
                <span>{soloLectura ? 'Vista del programador · solo lectura' : 'Datos de ejemplo'}</span>
              </div>
              {pendiente && !soloLectura && (
                <div role="alert" className="border-b border-amber-300 bg-amber-50 px-3 py-3 text-slate-900">
                  <p className="text-sm font-bold">Cambio propuesto: así quedaría. ¿Lo aprobás?</p>
                  <p className="text-sm">«{pendiente.pedido}» — {pendiente.explicacion} <span className="text-slate-500">({pendiente.de === 'golondrina' ? 'pedido a Golondrina' : 'pedido desde la página'})</span></p>
                  {tecnico && <div className="mt-1 [&_ul]:mt-1"><Parche parche={pendiente.parche} /></div>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => resolver(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white cursor-pointer"><Check className="w-4 h-4" /> Aprobar y aplicar</button>
                    <button type="button" onClick={() => resolver(false)} className="rounded-lg border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 cursor-pointer">Descartar</button>
                  </div>
                </div>
              )}
              <iframe ref={iframe} title={`Vista previa de ${spec.negocio.nombre}`} src="/vista-sistema.html" className="w-full h-[68vh] min-h-[520px] block" />
            </div>
            <aside className="grid gap-4 lg:grid-cols-3">
              {!soloLectura && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-sm font-bold text-white">Pedí un cambio</h2>
                <p className="mt-1 text-xs text-slate-400">Escribilo acá o pedíselo a Golondrina adentro del sistema («pedir cambio…»). Lo ves al instante y se aplica cuando lo aprobás.</p>
                <form onSubmit={(e) => { e.preventDefault(); void pedirCambio(pedido); }} className="mt-2">
                  <textarea value={pedido} onChange={(e) => setPedido(e.target.value.slice(0, 400))} placeholder="Ej.: agregá el campo patente a las órdenes de trabajo" className="w-full min-h-[84px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm" />
                  <button type="submit" disabled={ocupado || !pedido.trim() || Boolean(pendiente)} className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold disabled:opacity-50 cursor-pointer">
                    {ocupado ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Ver cómo queda
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
              )}
              <div className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-4 ${soloLectura ? 'lg:col-span-3' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-white">Cambios</h2>
                  {!soloLectura && (
                    <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs" role="group" aria-label="Cómo ver los cambios">
                      <button type="button" aria-pressed={!tecnico} onClick={() => setTecnico(false)} className={`inline-flex items-center gap-1 px-2.5 py-1 font-semibold cursor-pointer ${!tecnico ? 'bg-cyan-400 text-slate-950' : 'text-slate-300'}`}><User className="w-3.5 h-3.5" /> Quien lo pide</button>
                      <button type="button" aria-pressed={tecnico} onClick={() => setTecnico(true)} className={`inline-flex items-center gap-1 px-2.5 py-1 font-semibold cursor-pointer ${tecnico ? 'bg-cyan-400 text-slate-950' : 'text-slate-300'}`}><Code2 className="w-3.5 h-3.5" /> Programador</button>
                    </div>
                  )}
                </div>
                <Cambios cambios={cambios} tecnico={tecnico} />
                {tecnico && !soloLectura && (
                  <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-300">
                    <p className="font-bold text-white">Invitá a tu programador</p>
                    {linkDev ? (
                      <>
                        <p className="mt-1">Con este link ve el sistema, cada cambio y su implementación. No puede modificar, aprobar ni pagar.</p>
                        <div className="mt-2 flex gap-2">
                          <input readOnly value={linkDev} onFocus={(e) => e.currentTarget.select()} aria-label="Link para el programador" className="min-w-0 flex-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[11px] text-cyan-100" />
                          <button type="button" onClick={copiarLink} className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 font-semibold text-slate-100 cursor-pointer">{copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} {copiado ? 'Copiado' : 'Copiar'}</button>
                        </div>
                      </>
                    ) : (
                      <p className="mt-1">El link para compartir se genera cuando el sistema queda guardado en nuestro servidor, que en esta vista previa todavía no está conectado. Mientras tanto, acá mismo ves lo que va a ver tu programador.</p>
                    )}
                  </div>
                )}
                {!soloLectura && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 mr-auto">Versión {sesion.versiones.length}</span>
                    <button type="button" onClick={deshacer} disabled={sesion.versiones.length < 2 || Boolean(pendiente)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-200 disabled:opacity-40 cursor-pointer"><RotateCcw className="w-4 h-4" /> Deshacer</button>
                    <button type="button" onClick={empezarDeNuevo} className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 cursor-pointer">Empezar de nuevo</button>
                  </div>
                )}
                {soloLectura && <p className="mt-3 text-xs text-slate-400">Estás viendo este sistema como programador invitado. Los cambios los pide y los aprueba su dueño; Golondrina está disponible adentro de la vista previa para recorrerlo.</p>}
              </div>
              {!soloLectura && (
                <Comprar nombre={spec.negocio.nombre} resumen={resumen} estado={compra.estado} abono={compra.abono} asegurarProyecto={() => (sesion.proyecto ? Promise.resolve(sesion.proyecto) : sincronizar(sesion, 'Antes de comprar'))} />
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default Crear;
