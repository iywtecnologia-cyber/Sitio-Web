import React, { useEffect, useRef, useState } from 'react';
import { Check, Mic, MicOff, Send, MessageCircle, Mail, CalendarDays, Wallet, ShoppingBag, Bell } from 'lucide-react';
import { GolondrinaLogo } from '../LogosProductos';
import { whatsappLink } from '../../data/contact';

// Demo de Golondrina Personal: al iniciar, Golondrina encuentra tus aplicaciones y vos le das
// permiso con un clic, escribiendo o hablando (con transcriptor al lado). Todo es simulado en la web:
// no se conecta a ninguna cuenta real ni guarda lo que decís.
type App = { id: string; nombre: string; que: string; icon: React.ElementType };

const APPS: App[] = [
  { id: 'whatsapp', nombre: 'WhatsApp', que: 'Avisarte por mensaje', icon: MessageCircle },
  { id: 'mail', nombre: 'Mail', que: 'Avisos de facturas y turnos que reenviés', icon: Mail },
  { id: 'calendario', nombre: 'Calendario', que: 'Recordarte reuniones y vencimientos', icon: CalendarDays },
  { id: 'pagos', nombre: 'Mercado Pago', que: 'Avisarte cuando entra un cobro', icon: Wallet },
  { id: 'ventas', nombre: 'Tu tienda online', que: 'Avisarte de pedidos nuevos', icon: ShoppingBag },
];

const EJEMPLO = 'Avisame por WhatsApp cuando entre un cobro de más de 50 mil pesos';

type Reconocedor = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null; onerror: (() => void) | null;
  start: () => void; stop: () => void;
};

export const GolondrinaPersonalDemo: React.FC = () => {
  const [permisos, setPermisos] = useState<Record<string, boolean>>({});
  const [texto, setTexto] = useState('');
  const [transcripcion, setTranscripcion] = useState('');
  const [escuchando, setEscuchando] = useState(false);
  const [reglas, setReglas] = useState<string[]>([]);
  const recRef = useRef<Reconocedor | null>(null);
  const simRef = useRef<number | null>(null);

  useEffect(() => () => {
    recRef.current?.stop();
    if (simRef.current) window.clearInterval(simRef.current);
  }, []);

  const alternar = (id: string) => setPermisos((p) => ({ ...p, [id]: !p[id] }));

  const agregarRegla = (t: string) => {
    const limpio = t.trim();
    if (!limpio) return;
    setReglas((r) => [limpio, ...r].slice(0, 4));
    setTexto('');
  };

  // Voz: usa el reconocimiento del navegador si existe (Chrome, Edge); si no, muestra una transcripción de ejemplo.
  const simular = () => {
    let i = 0;
    setEscuchando(true);
    simRef.current = window.setInterval(() => {
      i += 2;
      setTranscripcion(EJEMPLO.slice(0, i));
      if (i >= EJEMPLO.length) {
        if (simRef.current) window.clearInterval(simRef.current);
        setEscuchando(false);
        agregarRegla(EJEMPLO);
      }
    }, 45);
  };

  const hablar = () => {
    if (escuchando) {
      recRef.current?.stop();
      if (simRef.current) window.clearInterval(simRef.current);
      setEscuchando(false);
      return;
    }
    setTranscripcion('');
    setEscuchando(true);
    const W = window as unknown as { SpeechRecognition?: new () => Reconocedor; webkitSpeechRecognition?: new () => Reconocedor };
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (Ctor) {
      try {
        const rec = new Ctor();
        rec.lang = 'es-AR';
        rec.interimResults = true;
        rec.continuous = false;
        let final = '';
        rec.onresult = (e) => {
          final = Array.from(e.results).map((r) => r[0].transcript).join(' ');
          setTranscripcion(final);
        };
        rec.onend = () => { setEscuchando(false); if (final) agregarRegla(final); };
        // Sin permiso de micrófono o sin conexión: se muestra la transcripción de ejemplo
        rec.onerror = () => { recRef.current = null; rec.onend = null; simular(); };
        recRef.current = rec;
        rec.start();
        // Si en 7 segundos no llegó nada (micrófono sin sonido), se muestra la transcripción de ejemplo
        window.setTimeout(() => {
          if (!final && recRef.current === rec) { rec.onend = null; rec.stop(); recRef.current = null; simular(); }
        }, 7000);
        return;
      } catch {
        // sigue con la demostración simulada
      }
    }
    simular();
  };

  const cantidad = Object.values(permisos).filter(Boolean).length;

  return (
    <div id="golondrina-personal-demo" className="scroll-mt-28 mb-12 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30">
      <div className="flex items-center gap-3 mb-5">
        <GolondrinaLogo className="w-11 h-12 shrink-0" />
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Golondrina Personal: así de fácil</h3>
          <p className="text-sm text-slate-300">Con una G no tenés que aprender nada: elegís qué aplicaciones conectar con un clic y le decís qué avisarte, escribiendo o hablando.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Aplicaciones encontradas */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <p className="text-xs font-mono font-bold text-emerald-300 mb-3">1 · ¿QUÉ APLICACIONES QUERÉS CONECTAR?</p>
          <ul className="space-y-2">
            {APPS.map(({ id, nombre, que, icon: Icon }) => {
              const ok = !!permisos[id];
              return (
                <li key={id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-300 shrink-0"><Icon className="w-4 h-4" /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-white">{nombre}</span>
                    <span className="block text-xs text-slate-400">{que}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => alternar(id)}
                    aria-pressed={ok}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors shrink-0 ${ok ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/50'}`}
                  >
                    {ok ? <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" />Conectada</span> : 'Conectar'}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-slate-400">{cantidad === 0 ? 'Nada conectado todavía: no ve nada.' : `Conectaste ${cantidad} de ${APPS.length}. Las podés desconectar cuando quieras.`}</p>
        </div>

        {/* 2. Pedidos por texto o voz, con transcriptor */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
          <p className="text-xs font-mono font-bold text-emerald-300 mb-3">2 · DECIME QUÉ QUERÉS QUE TE AVISE</p>
          <div className="flex gap-2">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarRegla(texto)}
              placeholder="Ej: avisame si un cliente no pagó en 7 días"
              aria-label="Escribí qué querés que te avise"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
            />
            <button type="button" onClick={() => agregarRegla(texto)} aria-label="Agregar" className="px-3 rounded-xl bg-emerald-500 text-slate-950 cursor-pointer"><Send className="w-4 h-4" /></button>
            <button
              type="button"
              onClick={hablar}
              aria-pressed={escuchando}
              aria-label={escuchando ? 'Dejar de escuchar' : 'Decirlo por voz'}
              className={`px-3 rounded-xl border cursor-pointer ${escuchando ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-slate-800 text-cyan-300 border-slate-700'}`}
            >
              {escuchando ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 min-h-[64px]" aria-live="polite">
            <p className="text-[11px] font-mono text-cyan-300 mb-1">TRANSCRIPCIÓN EN VIVO</p>
            <p className="text-sm text-slate-200">{transcripcion || (escuchando ? 'Escuchando…' : 'Tocá el micrófono y hablá: lo que digas aparece acá escrito.')}</p>
          </div>

          <div className="mt-3 flex-1">
            <p className="text-[11px] font-mono text-slate-400 mb-2">LO QUE GOLONDRINA VA A HACER</p>
            {reglas.length === 0 ? (
              <p className="text-xs text-slate-500">Todavía nada. Escribilo o decilo.</p>
            ) : (
              <ul className="space-y-1.5">
                {reglas.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-200"><Bell className="w-4 h-4 mt-0.5 shrink-0" />{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-400">Es una demostración: no se conecta a tus cuentas. La voz la transcribe tu navegador y esta web no guarda nada. Se integra a un sistema que ya usás o se instala como sistema nuevo.</p>
        <a
          href={whatsappLink('Hola tecnoros.ar, quiero Golondrina Personal: que aprenda mi contexto y me avise donde yo le dé permiso.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-bold text-sm"
        >
          Quiero mi Golondrina Personal
        </a>
      </div>
    </div>
  );
};
