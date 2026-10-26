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

const EJEMPLOS = ['Avisame cuando me entre un e-mail de un nuevo cliente', 'Recordame que tengo que llevar a mi perro a vacunarse'];
const EJEMPLO = EJEMPLOS[0];

type Reconocedor = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null; onerror: (() => void) | null;
  start: () => void; stop: () => void;
};

// Lo que la persona pide se convierte en una regla con "cuándo te aviso" y cómo te llega.
type Regla = { texto: string; cuando: string; aviso: string; app?: string };

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const interpretar = (t: string): Regla => {
  const x = t.toLowerCase();
  const hora = x.match(/a las (\d{1,2})(?::(\d{2}))?/);
  const hh = hora ? `${hora[1]}:${hora[2] ?? '00'}` : '9:00';
  const dia = DIAS.find((d) => x.includes(d) || x.includes(d.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
  const cuandoFecha = x.includes('hoy') ? `Hoy a las ${hh}` : dia ? `El ${dia} a las ${hh}` : `Mañana a las ${hh}`;
  const limpio = t.replace(/^(recordame|acordame|avisame|avísame)\s+(que\s+)?/i, '').replace(/^\w/, (c) => c.toUpperCase());

  if (/(e-?mail|correo|\bmail)/.test(x)) {
    return { texto: t, app: 'mail', cuando: 'Apenas te entre ese mail', aviso: '📧 Te entró un mail de un cliente nuevo. ¿Querés que te lo lea?' };
  }
  if (/(cobro|pago|transferencia|plata)/.test(x)) {
    return { texto: t, app: 'pagos', cuando: 'Apenas entre el cobro', aviso: '💰 Entró un cobro nuevo en Mercado Pago.' };
  }
  if (/(pedido|venta|compra)/.test(x)) {
    return { texto: t, app: 'ventas', cuando: 'Apenas entre un pedido', aviso: '🛍️ Tenés un pedido nuevo en tu tienda.' };
  }
  if (/(reuni[oó]n|calendario|agenda)/.test(x)) {
    return { texto: t, app: 'calendario', cuando: '15 minutos antes de cada reunión', aviso: '📅 En 15 minutos tenés una reunión.' };
  }
  if (/(record|acord|turno|vacun|llevar|pagar|comprar|llamar)/.test(x)) {
    return { texto: t, cuando: cuandoFecha, aviso: `⏰ Recordatorio: ${limpio.replace(/^Tengo que/i, 'Tenés que')}` };
  }
  return { texto: t, cuando: 'Cuando pase lo que pediste', aviso: `🔔 ${limpio}` };
};

export const GolondrinaPersonalDemo: React.FC = () => {
  const [permisos, setPermisos] = useState<Record<string, boolean>>({});
  const [texto, setTexto] = useState('');
  const [transcripcion, setTranscripcion] = useState('');
  const [escuchando, setEscuchando] = useState(false);
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const avisoRef = useRef<number | null>(null);
  const recRef = useRef<Reconocedor | null>(null);
  const simRef = useRef<number | null>(null);

  useEffect(() => () => {
    recRef.current?.stop();
    if (avisoRef.current) window.clearTimeout(avisoRef.current);
    if (simRef.current) window.clearInterval(simRef.current);
  }, []);

  const alternar = (id: string) => setPermisos((p) => ({ ...p, [id]: !p[id] }));

  const agregarRegla = (t: string) => {
    const limpio = t.trim();
    if (!limpio) return;
    setReglas((r) => [interpretar(limpio), ...r].slice(0, 4));
    setTexto('');
    // Un segundo después se muestra cómo le va a llegar el aviso
    setMostrarAviso(false);
    if (avisoRef.current) window.clearTimeout(avisoRef.current);
    avisoRef.current = window.setTimeout(() => setMostrarAviso(true), 1000);
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
              placeholder="Ej: avisame cuando me entre un e-mail de un nuevo cliente"
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

          <div className="mt-2 flex flex-wrap gap-1.5">
            {EJEMPLOS.map((ej) => (
              <button
                key={ej}
                type="button"
                onClick={() => agregarRegla(ej)}
                className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-[11px] text-slate-300 hover:border-emerald-500/50 cursor-pointer text-left"
              >
                {ej}
              </button>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 min-h-[64px]" aria-live="polite">
            <p className="text-[11px] font-mono text-cyan-300 mb-1">TRANSCRIPCIÓN EN VIVO</p>
            <p className="text-sm text-slate-200">{transcripcion || (escuchando ? 'Escuchando…' : 'Tocá el micrófono y hablá: lo que digas aparece acá escrito.')}</p>
          </div>

          <div className="mt-3 flex-1">
            <p className="text-[11px] font-mono text-slate-400 mb-2">LO QUE GOLONDRINA VA A HACER</p>
            {reglas.length === 0 ? (
              <p className="text-sm text-slate-500">Todavía nada. Escribilo o decilo.</p>
            ) : (
              <ul className="space-y-2">
                {reglas.map((r, i) => {
                  const falta = r.app && !permisos[r.app] ? APPS.find((a) => a.id === r.app)?.nombre : null;
                  return (
                    <li key={i} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="flex items-start gap-2 text-sm text-emerald-200"><Bell className="w-4 h-4 mt-0.5 shrink-0" />{r.texto}</span>
                      <span className="block mt-1 pl-6 text-sm text-cyan-300">🕒 Te aviso: {r.cuando}</span>
                      {falta && <span className="block mt-0.5 pl-6 text-xs text-amber-300">Para esto, conectá {falta} en el paso 1.</span>}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Así te va a llegar: vista del aviso en el celular */}
            {reglas.length > 0 && mostrarAviso && (
              <div className="mt-3" aria-live="polite">
                <p className="text-[11px] font-mono text-slate-400 mb-1.5">ASÍ TE VA A LLEGAR {permisos.whatsapp ? 'POR WHATSAPP' : 'AL CELULAR'}</p>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/95 text-slate-900 shadow-xl animate-[aparecer_0.4s_ease-out]">
                  <GolondrinaLogo className="w-8 h-9 shrink-0" />
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                      <span>Golondrina{permisos.whatsapp ? ' · WhatsApp' : ''}</span>
                      <span>{reglas[0].cuando.startsWith('Apenas') || reglas[0].cuando.startsWith('15') ? 'ahora' : reglas[0].cuando.replace(/^El |^Mañana a las |^Hoy a las /, '')}</span>
                    </span>
                    <span className="block text-sm font-medium leading-snug">{reglas[0].aviso}</span>
                  </span>
                </div>
              </div>
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
