import React, { useEffect, useRef, useState } from 'react';
import { irA as irASeccion } from '../rutas';
import { X, Send, MessageCircle, ArrowRight, Mail } from 'lucide-react';
import { TecnorosContactIcon } from './TecnorosContactIcon';
import { Marcianito } from './Marcianito';
import { whatsappLink, gmailLink, ventasMailto } from '../data/contact';
import { responder, respuestaDeTema, esModificador, temasDeGrilla, hayProveedorIA, type Respuesta, type Tema, type Turno } from '../asistente';

// Asistente guiado de tecnoros.ar. La inteligencia vive en src/asistente:
// hoy responde con la base de conocimiento local (sin IA ni servicios externos) y
// ese módulo es el único lugar donde se enchufaría una IA más adelante.
// Acá sólo queda la pantalla: no guarda nada y deriva a WhatsApp o e-mail.

const SALUDO =
  '¡Hola! 👋 Soy Marcio, el asistente de tecnoros.ar. Contame qué querés resolver en tu negocio, o elegí una opción:';

interface Mensaje {
  id: number;
  de: 'bot' | 'persona';
  texto: string;
  tema?: Tema;
  sugerencias?: Tema[];
  opciones?: boolean;
  /** Se calculan una sola vez al crear el mensaje: whatsappLink reparte al azar
   *  entre los dos números de ventas y no queremos que cambie en cada re-render. */
  enlaces?: { wa: string; mail: string; gmail: string };
}

let siguienteId = 1;

// mail: programa de correo de la persona (mailto:); gmail: respaldo para quien no tiene uno configurado.
const enlacesDe = (tema: Tema) => ({
  wa: whatsappLink(tema.whatsapp),
  mail: ventasMailto('Consulta desde la web - tecnoros.ar', tema.whatsapp),
  gmail: gmailLink('Consulta desde la web - tecnoros.ar', tema.whatsapp),
});

const mensajeDeRespuesta = (r: Respuesta): Mensaje => ({
  id: siguienteId++,
  de: 'bot',
  texto: r.texto,
  tema: r.tema,
  sugerencias: r.sugerencias,
  opciones: r.opciones,
  enlaces: r.tema ? enlacesDe(r.tema) : undefined,
});

// Las respuestas pueden traer saltos de línea y alguna URL (la demo de la agenda, por ejemplo).
// El de split lleva /g; para preguntar "¿esto es una URL?" va uno sin /g aparte,
// porque un regex global arrastra lastIndex entre llamadas a test() y alterna el resultado.
const RE_URL = /(https?:\/\/[^\s]+)/g;
const ES_URL = /^https?:\/\//;

const TextoDelBot: React.FC<{ texto: string }> = ({ texto }) => (
  <>
    {texto.split('\n').map((linea, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className="block h-2" aria-hidden="true" />}
        {linea.split(RE_URL).map((parte, j) => {
          if (!ES_URL.test(parte)) return parte;
          // Un punto o paréntesis final es puntuación de la frase, no parte del link.
          const limpia = parte.replace(/[.,;:)\]]+$/, '');
          return (
            <React.Fragment key={j}>
              <a
                href={limpia}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-300 underline decoration-cyan-400/50 hover:decoration-cyan-300 break-all"
              >
                {limpia.replace(/^https?:\/\//, '')}
              </a>
              {parte.slice(limpia.length)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    ))}
  </>
);

// Arrastrar con el mouse o el dedo a cualquier parte de la pantalla.
// Si se mueve menos de 6px cuenta como clic.
// Cuando se suelta, después de 5 segundos de inactividad, Marcio regresa a su origen.
const useArrastre = (alTocar: () => void) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  // Mientras lo tenés apretado, Marcio se "levanta" para que se note que lo agarraste.
  const [agarrado, setAgarrado] = useState(false);
  const [retornando, setRetornando] = useState(false);
  const retornoTimer = useRef<number | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const arrastre = useRef<{ dx: number; dy: number; x0: number; y0: number; movio: boolean } | null>(null);

  const cancelarRetorno = () => {
    if (retornoTimer.current) {
      window.clearTimeout(retornoTimer.current);
      retornoTimer.current = null;
    }
  };

  const limitar = (x: number, y: number) => {
    const el = ref.current;
    const w = el?.offsetWidth ?? 120;
    const h = el?.offsetHeight ?? 120;
    return {
      x: Math.min(Math.max(x, 4), window.innerWidth - w - 4),
      y: Math.min(Math.max(y, 48), window.innerHeight - h - 4),
    };
  };

  useEffect(() => {
    const ajustar = () => setPos((p) => (p ? limitar(p.x, p.y) : p));
    window.addEventListener('resize', ajustar);
    return () => {
      window.removeEventListener('resize', ajustar);
      cancelarRetorno();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      cancelarRetorno();
      setRetornando(false);
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      arrastre.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, movio: false };
      e.currentTarget.setPointerCapture(e.pointerId);
      setAgarrado(true);
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const a = arrastre.current;
      if (!a) return;
      if (!a.movio && Math.hypot(e.clientX - a.x0, e.clientY - a.y0) < 6) return;
      a.movio = true;
      setPos(limitar(e.clientX - a.dx, e.clientY - a.dy));
    },
    onPointerUp: () => {
      const a = arrastre.current;
      arrastre.current = null;
      setAgarrado(false);
      if (a && !a.movio) {
        alTocar();
        return;
      }
      if (a && a.movio) {
        // Al moverse, tras unos segundos de descanso Marcio regresa automáticamente a su lugar de origen
        cancelarRetorno();
        retornoTimer.current = window.setTimeout(() => {
          setRetornando(true);
          retornoTimer.current = window.setTimeout(() => {
            setPos(null);
            setRetornando(false);
          }, 850);
        }, 5000);
      }
    },
    onPointerCancel: () => {
      arrastre.current = null;
      setAgarrado(false);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alTocar();
      }
    },
  };
  return { pos, setPos, ref, handlers, agarrado, retornando };
};

export const Asistente: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  // Marcio asoma desde el costado de la pantalla unos segundos después de entrar.
  const [marcioVisible, setMarcioVisible] = useState(false);
  // Si la persona cierra el chat o el globo, Marcio no vuelve a aparecer solo (en esta visita):
  // vuelve únicamente si ella toca el botón del asistente.
  const [marcioOculto, setMarcioOcultoEstado] = useState(() => {
    try { return sessionStorage.getItem('marcio_oculto') === '1'; } catch { return false; }
  });
  const setMarcioOculto = (v: boolean) => {
    setMarcioOcultoEstado(v);
    try { if (v) sessionStorage.setItem('marcio_oculto', '1'); } catch { /* sin almacenamiento: queda oculto en esta pantalla */ }
  };
  const cerrarChat = () => {
    setAbierto(false);
    setMarcioOculto(true);
  };
  const [ocultoPor3D, setOcultoPor3D] = useState(false);
  const [ocultoPorDemo, setOcultoPorDemo] = useState(false);
  const [truco, setTruco] = useState<{ nombre: string; n: number }>({ nombre: '', n: 0 });
  const [frase, setFrase] = useState('¡Hola! 👋 ¿Te ayudo? Podés arrastrarme');

  // Detección automática: Cuando el usuario está personalizando el robot o producto (sección 3D activa),
  // Marcio se oculta automáticamente para dejar despejada toda la vista y los controles.
  useEffect(() => {
    // En celular, mientras un visor 3D está en pantalla, Marcio se corre para que el dedo
    // tenga lugar para girar el equipo o seguir bajando sin tocarlo.
    let observer: { disconnect: () => void } | null = null;
    const revisar = () => {
      if (window.innerWidth >= 640) { setOcultoPor3D(false); return; }
      const visores = document.querySelectorAll('#hardware-studio-3d canvas, #robotica-3d canvas');
      const h = window.innerHeight;
      const enPantalla = Array.from(visores).some((c) => {
        const r = (c.parentElement ?? c).getBoundingClientRect();
        return r.height > 0 && r.bottom > h * 0.15 && r.top < h * 0.85;
      });
      setOcultoPor3D(enPantalla);
    };
    window.addEventListener('scroll', revisar, { passive: true });
    window.addEventListener('resize', revisar);
    observer = { disconnect: () => { window.removeEventListener('scroll', revisar); window.removeEventListener('resize', revisar); } };

    const handleCustomizing = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      if (typeof ce.detail === 'boolean') {
        setOcultoPorDemo(ce.detail && window.innerWidth < 640);
      }
    };
    window.addEventListener('customizando-3d', handleCustomizing);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('customizando-3d', handleCustomizing);
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setMarcioVisible(true), 2500);
    return () => window.clearTimeout(id);
  }, []);
  const TRUCOS = ['marcio-giro', 'marcio-voltereta', 'marcio-salto', 'marcio-flip'];
  const FRASES = ['¡Wiii! 🚀', '¡Circuito encendido! ⚡', '¡Otra vez! 😄', '¿Charlamos? Tocá acá 💬', 'Arrastrame a donde quieras 👆'];
  const hacerTruco = () => {
    setTruco((t) => ({ nombre: TRUCOS[t.n % TRUCOS.length], n: t.n + 1 }));
    setFrase((f) => {
      const otras = FRASES.filter((x) => x !== f);
      return otras[Math.floor(Math.random() * otras.length)];
    });
  };
  // Marcio se puede arrastrar (mouse o dedo), tanto el del costado como el que sale del chat.
  const lateral = useArrastre(hacerTruco);
  const delChat = useArrastre(hacerTruco);
  const pos = lateral.pos;
  const contRef = lateral.ref;
  useEffect(() => {
    if (!abierto) delChat.setPos(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  // Marcio y su globo se corren cuando quedarían encima de un formulario o de un botón que
  // convierte (marcados con data-sin-asistente): tapaban el campo de nombre en /contacto en el
  // celular y el botón "Pedir presupuesto formal" en escritorio.
  // Se calcula con la zona fija donde asoma Marcio y no con su caja: mientras está oculto no existe.
  // Si la persona lo arrastró a otro lado, lo puso ahí a propósito y no se toca.
  const [ocultoPorFormulario, setOcultoPorFormulario] = useState(false);
  useEffect(() => {
    if (pos) {
      setOcultoPorFormulario(false);
      return;
    }
    let cuadro = 0;
    // El ticket del presupuesto crece (con animación) al marcar servicios sin que haya scroll:
    // por eso además de scroll/resize se observa el tamaño de cada zona marcada y del body (cambio de página).
    const observador = new ResizeObserver(() => revisar());
    observador.observe(document.body);
    const revisar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        const ancho = window.innerWidth;
        const alto = window.innerHeight;
        // Mismas medidas que el contenedor de abajo: right-0, bottom-36 (sm: bottom-44), globo de 180 px + Marcio.
        const abajo = alto - (ancho >= 640 ? 176 : 144);
        const zona = { izq: ancho - 330, der: ancho, arriba: abajo - 160, abajo };
        const tapa = Array.from(document.querySelectorAll('[data-sin-asistente]')).some((el) => {
          observador.observe(el); // observar dos veces el mismo elemento no hace nada
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.left < zona.der && r.right > zona.izq && r.top < zona.abajo && r.bottom > zona.arriba;
        });
        setOcultoPorFormulario(tapa);
      });
    };
    revisar();
    const eventos = ['scroll', 'resize', 'popstate', 'cambio-de-ruta'];
    eventos.forEach((ev) => window.addEventListener(ev, revisar, { passive: true }));
    return () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      eventos.forEach((ev) => window.removeEventListener(ev, revisar));
    };
  }, [pos]);
  // El globo va del lado donde hay más lugar.
  const globoALaDerecha = pos !== null && pos.x < window.innerWidth / 2;
  const [texto, setTexto] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { id: siguienteId++, de: 'bot', texto: SALUDO, opciones: true },
  ]);
  // Mientras Marcio "piensa" se muestran los tres puntitos y el campo queda bloqueado,
  // así no se encolan preguntas ni llegan respuestas fuera de orden.
  const [pensando, setPensando] = useState(false);
  // De qué se habló último: deja entender mensajes cortos como "¿y cuánto sale?".
  const temaPrevio = useRef<string | undefined>(undefined);
  // En el celular, cuando aparece el teclado el chat sube y se achica para quedar entero arriba del teclado
  // (si no, el campo de texto queda tapado). visualViewport dice cuánto lugar deja el teclado.
  const [teclado, setTeclado] = useState<{ abajo: number; alto: number } | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!abierto || !vv) return;
    const medir = () => {
      const tapado = window.innerHeight - vv.height - vv.offsetTop;
      setTeclado(tapado > 120 ? { abajo: tapado + 8, alto: vv.height - 16 } : null);
    };
    medir();
    vv.addEventListener('resize', medir);
    vv.addEventListener('scroll', medir);
    return () => {
      vv.removeEventListener('resize', medir);
      vv.removeEventListener('scroll', medir);
      setTeclado(null);
    };
  }, [abierto]);
  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cuando llega la respuesta, la lista se acomoda para que arriba quede la pregunta y debajo
  // el comienzo de la respuesta: así se lee desde el principio, sin tener que subir.
  // Mientras escribís o Marcio piensa, se muestra lo último (tu mensaje y los tres puntitos).
  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    // Recién abierto (todavía sin preguntas): arriba, para que se lea "Hola, soy Marcio" desde el principio.
    if (!mensajes.some((m) => m.de === 'persona')) {
      lista.scrollTo({ top: 0 });
      return;
    }
    const ultimo = mensajes[mensajes.length - 1];
    const pregunta = mensajes[mensajes.length - 2];
    if (!pensando && ultimo?.de === 'bot' && pregunta?.de === 'persona') {
      const el = lista.querySelector<HTMLElement>(`[data-mensaje="${pregunta.id}"]`);
      if (el) {
        const top = el.getBoundingClientRect().top - lista.getBoundingClientRect().top + lista.scrollTop - 12;
        lista.scrollTo({ top, behavior: 'smooth' });
        return;
      }
    }
    lista.scrollTo({ top: lista.scrollHeight, behavior: 'smooth' });
  }, [mensajes, abierto, pensando]);

  useEffect(() => {
    // Al terminar de responder el foco vuelve al campo, así se puede seguir escribiendo.
    if (!abierto || pensando) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarChat();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, pensando]);

  // Una pausa corta antes de contestar: instantáneo se siente a máquina y se lee peor.
  const PAUSA_MS = 450;

  const preguntar = async (pregunta: string, tema?: Tema) => {
    if (pensando) return;
    // El id se pide en orden de aparición: primero el mensaje de la persona, después la respuesta.
    const mio: Mensaje = { id: siguienteId++, de: 'persona', texto: pregunta };
    const historial: Turno[] = [...mensajes, mio].map((m) => ({ de: m.de, texto: m.texto }));
    setMensajes((m) => [...m, mio]);
    setPensando(true);
    try {
      // Si el tema vino de un botón no hay nada que adivinar y se contesta directo.
      // La excepción es "¿Cuánto cuesta?" / "¿Cuánto tarda?": esos califican al tema
      // anterior, así que pasan por el motor para que responda sobre ESE servicio.
      const directo = tema && !(esModificador(tema.id) && temaPrevio.current);
      const [r] = await Promise.all([
        directo ? Promise.resolve(respuestaDeTema(tema!)) : responder(pregunta, { temaPrevio: temaPrevio.current }, historial),
        new Promise((listo) => window.setTimeout(listo, PAUSA_MS)),
      ]);
      temaPrevio.current = r.temaContexto;
      setMensajes((m) => [...m, mensajeDeRespuesta(r)]);
    } finally {
      setPensando(false);
    }
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t || pensando) return;
    setTexto('');
    void preguntar(t);
  };

  const irA = (id: string) => {
    cerrarChat();
    irASeccion(id);
  };

  const verOpciones = () => {
    temaPrevio.current = undefined;
    setMensajes((m) => [...m, { id: siguienteId++, de: 'bot', texto: '¿Sobre qué más te puedo contar?', opciones: true }]);
  };

  // Lo último que dijo Marcio, para que el lector de pantalla anuncie sólo eso
  // y no relea toda la conversación cada vez que llega un mensaje.
  const ultimoDelBot = [...mensajes].reverse().find((m) => m.de === 'bot');

  return (
    <>
      <style>{`
            @keyframes marcio-giro { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes marcio-voltereta { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-40px) rotate(-180deg); } 100% { transform: translateY(0) rotate(-360deg); } }
            @keyframes marcio-salto { 0%,100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-36px) scale(1.05, .95); } 60% { transform: translateY(0) scale(1.1, .9); } }
            @keyframes marcio-flip { 0% { transform: scaleX(1); } 25% { transform: scaleX(0) rotate(10deg); } 50% { transform: scaleX(-1); } 75% { transform: scaleX(0) rotate(-10deg); } 100% { transform: scaleX(1); } }
            @keyframes marcio-sale { 0% { transform: translate(60px, 40px) scale(.3) rotate(0deg); opacity: 0; } 60% { opacity: 1; } 100% { transform: translate(0,0) scale(1) rotate(720deg); opacity: 1; } }
            @keyframes marcio-globo { from { transform: translate(-50%, 8px) scale(.6); opacity: 0; } to { transform: translate(-50%, 0) scale(1); opacity: 1; } }
            @keyframes marcio-flota { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(4deg); } }
            @keyframes marcio-puntito { 0%,60%,100% { transform: translateY(0); opacity: .45; } 30% { transform: translateY(-4px); opacity: 1; } }
      `}</style>
      {abierto && (
        <div
          role="dialog"
          aria-label="Asistente de tecnoros.ar"
          className="fixed z-[70] bottom-24 sm:bottom-28 right-3 left-3 sm:left-auto sm:right-6 sm:w-[380px]"
          style={teclado ? { bottom: teclado.abajo } : undefined}
        >
          {/* Marcio sale del chat dando vueltas y queda afuera, al costado; cada clic hace un truco */}
          <button
            type="button"
            ref={(el) => {
              delChat.ref.current = el;
            }}
            {...delChat.handlers}
            aria-label="Asistente de tecnoros.ar. Tocalo para que haga un truco o arrastralo"
            className={`${teclado ? 'hidden' : ''} ${delChat.pos ? 'fixed' : 'absolute -top-[5.75rem] right-2 sm:right-auto sm:top-4 sm:-left-28 motion-safe:animate-[marcio-sale_0.9s_ease-out]'} z-[60] cursor-grab active:cursor-grabbing select-none touch-none`}
            style={delChat.pos ? { left: delChat.pos.x, top: delChat.pos.y } : undefined}
          >
            {delChat.agarrado && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-11 whitespace-nowrap rounded-2xl rounded-b-md bg-white text-slate-900 px-3 py-1.5 text-sm font-bold shadow-xl motion-safe:animate-[marcio-globo_0.25s_ease-out]"
              >
                ¡Wiii, me llevás! 🚀
              </span>
            )}
            <span
              className={`block transition-transform duration-200 ease-out ${delChat.agarrado ? 'scale-[1.18] -rotate-12 drop-shadow-[0_22px_22px_rgba(34,211,238,0.45)]' : 'motion-safe:animate-[marcio-flota_3.5s_ease-in-out_infinite]'}`}
            >
              <span
                key={truco.n}
                className="block motion-reduce:!animate-none"
                style={truco.nombre ? { animation: `${truco.nombre} 0.9s ease-in-out` } : undefined}
              >
                <Marcianito className="w-[4.5rem] h-[5.25rem] sm:w-24 sm:h-28 drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)]" />
              </span>
            </span>
          </button>
          <div
            style={teclado ? { maxHeight: teclado.alto } : undefined}
            className="assistant-panel-enter relative max-h-[calc(100dvh-18.5rem)] sm:max-h-[min(600px,calc(100dvh-13rem))] flex flex-col rounded-2xl bg-[#0B1120] border border-slate-700/80 shadow-2xl shadow-black/60 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
            <TecnorosContactIcon className="assistant-avatar-breathe w-9 h-9 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Asistente</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Respuestas al instante
              </div>
            </div>
            <button
              type="button"
              onClick={cerrarChat}
              aria-label="Cerrar asistente"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={listaRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {mensajes.map((m) => (
              <div key={m.id} data-mensaje={m.id} className={`assistant-message-enter ${m.de === 'persona' ? 'flex justify-end' : 'flex flex-col items-start gap-2'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.de === 'persona'
                      ? 'bg-cyan-400 text-slate-950 rounded-br-md'
                      : 'bg-slate-800/80 text-slate-100 rounded-bl-md'
                  }`}
                >
                  {m.de === 'bot' ? <TextoDelBot texto={m.texto} /> : m.texto}
                </div>

                {m.tema && m.enlaces && (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={m.enlaces.wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={m.enlaces.mail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      E-mail
                    </a>
                    <a
                      href={m.enlaces.gmail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-600 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Gmail
                    </a>
                    {m.tema.seccion && m.tema.id !== 'persona' && (
                      <button
                        type="button"
                        onClick={() => irA(m.tema!.seccion!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-600 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Ver en la web
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {!m.opciones && (
                      <button
                        type="button"
                        onClick={verOpciones}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        Otras opciones
                      </button>
                    )}
                  </div>
                )}

                {/* Temas relacionados: para que la charla pueda seguir sin tener que escribir. */}
                {!!m.sugerencias?.length && (
                  <div className="flex flex-wrap gap-2">
                    {m.sugerencias.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        disabled={pensando}
                        onClick={() => void preguntar(t.boton, t)}
                        className="px-3 py-1.5 rounded-full border border-slate-600 bg-slate-800/60 hover:border-cyan-400 hover:text-white text-slate-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                      >
                        {t.boton}
                      </button>
                    ))}
                  </div>
                )}

                {m.opciones && (
                  <div className="flex flex-wrap gap-2">
                    {temasDeGrilla().map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        disabled={pensando}
                        onClick={() => void preguntar(t.boton, t)}
                        className="px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                      >
                        {t.boton}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {pensando && (
              <div className="flex items-center gap-1.5 px-3.5 py-3 w-fit rounded-2xl rounded-bl-md bg-slate-800/80" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 motion-safe:animate-[marcio-puntito_1.2s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Región para lectores de pantalla: anuncia sólo la última respuesta. */}
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {pensando ? 'Marcio está escribiendo…' : (ultimoDelBot?.texto ?? '')}
          </p>

          <form onSubmit={enviar} className="flex items-center gap-2 px-3 py-3 border-t border-slate-800">
            <label htmlFor="asistente-texto" className="sr-only">
              Escribí tu pregunta
            </label>
            <input
              ref={inputRef}
              id="asistente-texto"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={pensando ? 'Marcio está escribiendo…' : 'Escribí tu pregunta…'}
              autoComplete="off"
              disabled={pensando}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Enviar pregunta"
              disabled={pensando || !texto.trim()}
              className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="px-4 pb-2.5 text-xs sm:text-[11px] text-slate-500">
            {hayProveedorIA()
              ? 'Asistente automático · algunas respuestas usan IA de Google · no compartas datos personales'
              : 'Asistente automático · no guardamos tus mensajes'}
          </div>
          </div>
        </div>
      )}

      {!abierto && !marcioOculto && !ocultoPor3D && !ocultoPorDemo && !ocultoPorFormulario && (
        <div
          ref={(el) => {
            contRef.current = el;
          }}
          className={`fixed z-[70] flex items-end gap-2 ${globoALaDerecha ? 'flex-row-reverse' : ''} ${
            lateral.retornando ? 'transition-all duration-700 ease-out' : ''
          } ${
            pos ? '' : `right-0 bottom-36 sm:bottom-44 transition-transform duration-700 ease-out motion-reduce:transition-none ${marcioVisible ? 'translate-x-0' : 'translate-x-[110%]'}`
          }`}
          style={pos ? { left: pos.x, top: pos.y } : undefined}
          aria-hidden={!marcioVisible}
        >
          <div className={`relative mb-16 max-w-[180px] transition-opacity ${lateral.agarrado || lateral.retornando ? 'opacity-0' : ''} rounded-2xl ${globoALaDerecha ? 'rounded-bl-md' : 'rounded-br-md'} bg-white text-slate-900 px-3.5 py-2.5 shadow-xl text-sm font-semibold`}>
            <button
              type="button"
              onClick={() => setMarcioOculto(true)}
              aria-label="Ocultar asistente"
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 text-slate-200 border border-slate-600 flex items-center justify-center hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => setAbierto(true)} className="text-left cursor-pointer">
              {frase}
              <span className="block mt-1 text-xs font-bold text-cyan-700">Abrir chat →</span>
            </button>
          </div>
          <button
            type="button"
            {...lateral.handlers}
            aria-label="Asistente de tecnoros.ar. Tocalo para que haga un truco o arrastralo"
            className={`relative ${pos ? 'px-1' : 'pr-2 sm:pr-4'} cursor-grab active:cursor-grabbing select-none touch-none`}
          >
            {lateral.agarrado && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-11 whitespace-nowrap rounded-2xl rounded-b-md bg-white text-slate-900 px-3 py-1.5 text-sm font-bold shadow-xl motion-safe:animate-[marcio-globo_0.25s_ease-out]"
              >
                ¡Wiii, me llevás! 🚀
              </span>
            )}
            {lateral.retornando && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-11 whitespace-nowrap rounded-2xl rounded-b-md bg-cyan-400 text-slate-950 px-3 py-1.5 text-xs font-black shadow-xl motion-safe:animate-[marcio-globo_0.25s_ease-out]"
              >
                ¡Volviendo a mi base! 🛸
              </span>
            )}
            <span
              className={`block transition-transform duration-200 ease-out ${lateral.agarrado ? 'scale-[1.18] -rotate-12 drop-shadow-[0_22px_22px_rgba(34,211,238,0.45)]' : 'motion-safe:animate-[marcio-flota_3.5s_ease-in-out_infinite]'}`}
            >
              <span
                key={truco.n}
                className="block motion-reduce:!animate-none"
                style={truco.nombre ? { animation: `${truco.nombre} 0.9s ease-in-out` } : undefined}
              >
                <Marcianito className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)]" />
              </span>
            </span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => (abierto ? cerrarChat() : setAbierto(true))}
        aria-expanded={abierto}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente de tecnoros.ar'}
        title="Asistente de tecnoros.ar"
        className="fixed bottom-6 right-6 z-[65] p-2.5 sm:p-3 rounded-2xl bg-[#0B1220]/95 hover:bg-[#0E172A] border border-cyan-500/40 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center backdrop-blur-md cursor-pointer"
      >
        {!abierto && (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-1 motion-reduce:animate-none" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute -top-1 -right-1" />
          </>
        )}
        {abierto ? (
          <X className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 p-1.5" />
        ) : (
          <TecnorosContactIcon className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_12px_rgba(0,210,243,0.45)] group-hover:scale-105 transition-transform" />
        )}
      </button>
    </>
  );
};
