import React, { useEffect, useRef, useState } from 'react';
import { irA as irASeccion } from '../rutas';
import { X, Send, MessageCircle, ArrowRight, Mail } from 'lucide-react';
import { TecnorosContactIcon } from './TecnorosContactIcon';
import { Marcianito } from './Marcianito';
import { whatsappLink, gmailLink } from '../data/contact';

// Asistente guiado de tecnoros.ar: responde con textos preparados (sin IA ni servicios externos),
// no guarda nada y deriva a WhatsApp con el mensaje armado según el tema.

interface Tema {
  id: string;
  boton: string;
  palabras: string[];
  respuesta: string;
  seccion?: string;
  whatsapp: string;
}

const TEMAS: Tema[] = [
  {
    id: 'automatizacion',
    boton: 'Automatizaciones',
    palabras: ['automatiz', 'planilla', 'excel', 'proceso', 'tarea', 'recordatorio', 'reporte', 'n8n', 'carga', 'manual'],
    respuesta:
      'Conectamos tus planillas, sistemas y procesos para que las tareas repetitivas se hagan solas: datos que se cargan solos, recordatorios automáticos y reportes sin hacerlos a mano.',
    seccion: 'servicio-automatizacion',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por automatizaciones para mi negocio.',
  },
  {
    id: 'bots',
    boton: 'Bots de WhatsApp',
    palabras: ['bot', 'whatsapp', 'wpp', 'whats', 'mensaje', 'pedido', 'responder', 'atencion'],
    respuesta:
      'Armamos bots de WhatsApp que responden las consultas de siempre, toman pedidos y turnos a toda hora, y te pasan el chat cuando hace falta una persona.',
    seccion: 'servicio-bots-whatsapp',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por un bot de WhatsApp.',
  },
  {
    id: 'ciberseguridad',
    boton: 'Ciberseguridad',
    palabras: ['segur', 'ciber', 'hacke', 'virus', 'contrasena', 'clave', 'proteg', 'riesgo', 'datos'],
    respuesta:
      'Revisamos tus sistemas y te decimos qué riesgos tienen, ordenamos quién accede a qué y protegemos los datos de tu negocio y de tus clientes.',
    seccion: 'servicio-ciberseguridad',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por ciberseguridad para mi negocio.',
  },
  {
    id: 'software',
    boton: 'Software a medida',
    palabras: ['software', 'sistema', 'turno', 'stock', 'venta', 'caja', 'cliente', 'agenda', 'gestion', 'app', 'aplicacion', 'medida'],
    respuesta:
      'Desarrollamos un sistema distinto para cada rubro: turnos, ventas, stock, clientes o lo que necesites. Antes de empezar relevamos cómo trabajás y te mostramos un prototipo.',
    seccion: 'servicio-software',
    whatsapp: 'Hola tecnoros.ar, quiero consultar por un sistema a medida.',
  },
  {
    id: 'asistentes',
    boton: 'Asistente para tu web',
    palabras: ['asistente', 'chat', 'chatbot', 'ia', 'inteligencia'],
    respuesta:
      '¡Como yo! 😄 Sumamos un asistente a la web o al sistema que ya tenés, para responder a tus clientes a toda hora sin cambiar nada de lo que usás.',
    seccion: 'servicio-asistentes',
    whatsapp: 'Hola tecnoros.ar, quiero un asistente para mi web o sistema.',
  },
  {
    id: 'paginas-web',
    boton: 'Páginas web',
    palabras: ['pagina', 'web', 'sitio', 'landing', 'tienda', 'dominio'],
    respuesta:
      'Creamos la página de tu negocio y la hacemos trabajar: formularios que cargan los datos solos, avisos automáticos y un asistente para tus clientes. Se ve bien en compu y celular.',
    seccion: 'servicio-paginas-web',
    whatsapp: 'Hola tecnoros.ar, quiero una página web para mi negocio.',
  },
  {
    id: 'precio',
    boton: '¿Cuánto cuesta?',
    palabras: ['precio', 'cuesta', 'cuanto', 'costo', 'presupuesto', 'valor', 'cobran', 'sale', 'gratis', 'diagnostico'],
    respuesta:
      'Depende de lo que necesites. En la sección Presupuestador podés marcar los servicios y ver un rango estimado. El diagnóstico es 100% gratuito y después te pasamos un presupuesto cerrado.',
    seccion: 'facturacion',
    whatsapp: 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.',
  },
  {
    id: 'proyectos',
    boton: 'Ver proyectos',
    palabras: ['proyecto', 'ejemplo', 'trabajo', 'hicieron', 'portfolio', 'demo', 'caso'],
    respuesta:
      'Mirá nuestro desarrollo para consultorios: agenda odontológica con fichas de pacientes, obra social, adjuntos y contacto directo en un clic. Podés probarla en vivo ingresando a: agendaodontologica-9is7.onrender.com.',
    seccion: 'proyectos',
    whatsapp: 'Hola tecnoros.ar, vi sus proyectos y quiero hacer una consulta.',
  },
  {
    id: 'persona',
    boton: 'Hablar con una persona',
    palabras: ['persona', 'humano', 'hablar', 'contacto', 'telefono', 'llamar', 'mail', 'email', 'correo'],
    respuesta: '¡Claro! Escribinos por WhatsApp o por e-mail y te responde una persona del equipo. Tu consulta no molesta 😉',
    seccion: 'contacto',
    whatsapp: 'Hola tecnoros.ar, quiero hacerles una consulta.',
  },
];

const SALUDO =
  '¡Hola! 👋 Soy el asistente de tecnoros.ar. Contame qué necesitás o elegí una opción:';

interface Mensaje {
  id: number;
  de: 'bot' | 'persona';
  texto: string;
  tema?: Tema;
  opciones?: boolean;
}

const normalizar = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const buscarTema = (texto: string): Tema | undefined => {
  const t = normalizar(texto);
  let mejor: Tema | undefined;
  let puntos = 0;
  for (const tema of TEMAS) {
    const p = tema.palabras.filter((w) => t.includes(w)).length;
    if (p > puntos) {
      mejor = tema;
      puntos = p;
    }
  }
  return mejor;
};

let siguienteId = 1;

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
  const [marcioOculto, setMarcioOculto] = useState(false);
  const [ocultoPor3D, setOcultoPor3D] = useState(false);
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
      if (typeof ce.detail === 'boolean' && window.innerWidth < 640) {
        setOcultoPor3D(ce.detail);
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
  // El globo va del lado donde hay más lugar.
  const globoALaDerecha = pos !== null && pos.x < window.innerWidth / 2;
  const [texto, setTexto] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { id: siguienteId++, de: 'bot', texto: SALUDO, opciones: true },
  ]);
  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensajes, abierto]);

  useEffect(() => {
    if (!abierto) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto]);

  const responder = (pregunta: string, tema?: Tema) => {
    const encontrado = tema ?? buscarTema(pregunta);
    const respuesta: Mensaje = encontrado
      ? { id: siguienteId++, de: 'bot', texto: encontrado.respuesta, tema: encontrado }
      : {
          id: siguienteId++,
          de: 'bot',
          texto: 'No estoy seguro de haberte entendido 🙂. Elegí una opción o escribinos por WhatsApp o e-mail y te responde una persona.',
          tema: TEMAS.find((t) => t.id === 'persona'),
          opciones: true,
        };
    setMensajes((m) => [...m, { id: siguienteId++, de: 'persona', texto: pregunta }, respuesta]);
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    setTexto('');
    responder(t);
  };

  const irA = (id: string) => {
    setAbierto(false);
    irASeccion(id);
  };

  const verOpciones = () =>
    setMensajes((m) => [...m, { id: siguienteId++, de: 'bot', texto: '¿Sobre qué más te puedo contar?', opciones: true }]);

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
      `}</style>
      {abierto && (
        <div
          role="dialog"
          aria-label="Asistente de tecnoros.ar"
          className="fixed z-[70] bottom-24 sm:bottom-28 right-3 left-3 sm:left-auto sm:right-6 sm:w-[380px]"
        >
          {/* Marcio sale del chat dando vueltas y queda afuera, al costado; cada clic hace un truco */}
          <button
            type="button"
            ref={(el) => {
              delChat.ref.current = el;
            }}
            {...delChat.handlers}
            aria-label="Asistente de tecnoros.ar. Tocalo para que haga un truco o arrastralo"
            className={`${delChat.pos ? 'fixed' : 'absolute -top-[5.75rem] right-2 sm:right-auto sm:top-4 sm:-left-28 motion-safe:animate-[marcio-sale_0.9s_ease-out]'} z-[60] cursor-grab active:cursor-grabbing select-none touch-none`}
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
          <div className="relative max-h-[calc(100dvh-17rem)] sm:max-h-[min(600px,calc(100dvh-13rem))] flex flex-col rounded-2xl bg-[#0B1120] border border-slate-700/80 shadow-2xl shadow-black/60 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
            <TecnorosContactIcon className="w-9 h-9 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Asistente</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Respuestas al instante
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar asistente"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={listaRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            {mensajes.map((m) => (
              <div key={m.id} className={m.de === 'persona' ? 'flex justify-end' : 'flex flex-col items-start gap-2'}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.de === 'persona'
                      ? 'bg-cyan-400 text-slate-950 rounded-br-md'
                      : 'bg-slate-800/80 text-slate-100 rounded-bl-md'
                  }`}
                >
                  {m.texto}
                </div>

                {m.tema && (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={whatsappLink(m.tema.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={gmailLink('Consulta desde la web - tecnoros.ar', m.tema.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      E-mail
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

                {m.opciones && (
                  <div className="flex flex-wrap gap-2">
                    {TEMAS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => responder(t.boton, t)}
                        className="px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {t.boton}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

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
              placeholder="Escribí tu pregunta…"
              autoComplete="off"
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              aria-label="Enviar pregunta"
              className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="px-4 pb-2.5 text-[11px] text-slate-500">Asistente automático · no guardamos tus mensajes</div>
          </div>
        </div>
      )}

      {!abierto && !marcioOculto && !ocultoPor3D && (
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
        onClick={() => setAbierto((a) => !a)}
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
