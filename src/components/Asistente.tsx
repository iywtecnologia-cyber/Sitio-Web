import React, { useEffect, useRef, useState } from 'react';
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
    palabras: ['asistente', 'chat', 'web', 'pagina', 'sitio', 'chatbot', 'ia', 'inteligencia'],
    respuesta:
      '¡Como yo! 😄 Sumamos un asistente a la web o al sistema que ya tenés, para responder a tus clientes a toda hora sin cambiar nada de lo que usás.',
    seccion: 'servicio-asistentes',
    whatsapp: 'Hola tecnoros.ar, quiero un asistente para mi web o sistema.',
  },
  {
    id: 'precio',
    boton: '¿Cuánto cuesta?',
    palabras: ['precio', 'cuesta', 'cuanto', 'costo', 'presupuesto', 'valor', 'cobran', 'sale', 'gratis', 'diagnostico'],
    respuesta:
      'Cada solución es a medida, así que no tenemos un precio fijo. El diagnóstico es 100% gratuito: nos contás tu caso y te pasamos un presupuesto sin compromiso.',
    seccion: 'contacto',
    whatsapp: 'Hola tecnoros.ar, quiero pedir el diagnóstico gratuito y un presupuesto.',
  },
  {
    id: 'proyectos',
    boton: 'Ver proyectos',
    palabras: ['proyecto', 'ejemplo', 'trabajo', 'hicieron', 'portfolio', 'demo', 'caso'],
    respuesta:
      'Mirá algunos sistemas que desarrollamos: agendas de turnos, control de ingresos y egresos, punto de venta, fichas de pacientes y dashboards de finanzas.',
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
  '¡Hola! 👋 Soy Marcio, la mascota de tecnoros.ar. Contame qué necesitás o elegí una opción:';

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

export const Asistente: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  // El marcianito aparece saludando unos segundos después de entrar, hasta que se abre el chat o se cierra.
  const [teaser, setTeaser] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setTeaser(true), 2500);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (abierto) setTeaser(false);
  }, [abierto]);
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const verOpciones = () =>
    setMensajes((m) => [...m, { id: siguienteId++, de: 'bot', texto: '¿Sobre qué más te puedo contar?', opciones: true }]);

  return (
    <>
      {abierto && (
        <div
          role="dialog"
          aria-label="Asistente de tecnoros.ar"
          className="fixed z-50 bottom-24 sm:bottom-28 right-3 left-3 sm:left-auto sm:right-6 sm:w-[380px] max-h-[min(600px,calc(100vh-8rem))] flex flex-col rounded-2xl bg-[#0B1120] border border-slate-700/80 shadow-2xl shadow-black/60 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
            <Marcianito className="w-11 h-11 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Marcio · Mascota de tecnoros.ar</div>
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
      )}

      {teaser && !abierto && (
        <div className="fixed z-50 bottom-24 sm:bottom-28 right-4 sm:right-6 flex items-end gap-1 animate-[marci-entra_0.5s_ease-out] motion-reduce:animate-none">
          <style>{'@keyframes marci-entra{from{opacity:0;transform:translateY(16px) scale(.9)}to{opacity:1;transform:none}}'}</style>
          <div className="relative mb-12 max-w-[200px] rounded-2xl rounded-br-md bg-white text-slate-900 px-3.5 py-2.5 shadow-xl text-sm font-semibold">
            <button
              type="button"
              onClick={() => setTeaser(false)}
              aria-label="Cerrar saludo"
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 text-slate-200 border border-slate-600 flex items-center justify-center hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => setAbierto(true)} className="text-left cursor-pointer">
              ¡Hola! 👋 Soy Marcio, la mascota de tecnoros.ar. ¿Te ayudo?
            </button>
          </div>
          <button type="button" onClick={() => setAbierto(true)} aria-label="Abrir asistente" className="cursor-pointer">
            <Marcianito className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente de tecnoros.ar'}
        title="Asistente de tecnoros.ar"
        className="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 rounded-2xl bg-[#0B1220]/95 hover:bg-[#0E172A] border border-cyan-500/40 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center backdrop-blur-md cursor-pointer"
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
