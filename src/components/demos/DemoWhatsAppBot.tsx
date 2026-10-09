import React, { useEffect, useRef, useState } from 'react';
import { Bot, CheckCheck, RefreshCw, Send } from 'lucide-react';
import { whatsappLink } from '../../data/contact';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  time: string;
  options?: string[];
  showContact?: boolean;
}

const now = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const MAIN_OPTIONS = [
  '¿Qué pueden automatizar en mi negocio?',
  '¿Cuánto cuesta?',
  '¿Cuánto tarda?',
  'Quiero un diagnóstico gratis',
];

const firstMessage = (): Message => ({
  id: 'start',
  from: 'bot',
  text: '¡Hola! 👋 Soy un asistente de ejemplo. Así podría atender el WhatsApp de tu negocio, a cualquier hora. Tocá una pregunta o escribí la tuya:',
  time: now(),
  options: MAIN_OPTIONS,
});

const reply = (question: string): Omit<Message, 'id' | 'time' | 'from'> => {
  const q = question.toLowerCase();

  if (q.includes('diagn') || q.includes('contact') || q.includes('hablar') || q.includes('llamar')) {
    return {
      text: '¡Genial! Tocá el botón de abajo y nos escribís por WhatsApp. Te responde una persona del equipo, no un bot 😉',
      showContact: true,
    };
  }
  if (q.includes('cuesta') || q.includes('precio') || q.includes('presupuesto') || q.includes('sale')) {
    return {
      text: 'Como cada negocio es distinto, no tenemos un precio fijo. Primero hacemos un diagnóstico sin costo para entender qué necesitás, y con eso te pasamos un presupuesto claro.',
      options: ['Quiero un diagnóstico gratis', '¿Cuánto tarda?'],
    };
  }
  if (q.includes('tarda') || q.includes('tiempo') || q.includes('cuándo') || q.includes('cuando')) {
    return {
      text: 'Depende del proyecto. Antes de programar te mostramos un prototipo para que lo veas y lo apruebes. El plazo exacto te lo decimos junto con el presupuesto.',
      options: ['¿Cuánto cuesta?', 'Quiero un diagnóstico gratis'],
    };
  }
  if (q.includes('automatiz') || q.includes('qué hacen') || q.includes('que hacen') || q.includes('sirve')) {
    return {
      text: 'Por ejemplo: responder las preguntas de siempre por WhatsApp, tomar pedidos y cargarlos solos en tu planilla o sistema, recordarles los turnos a tus clientes o avisarte cuando te queda poco stock. Contanos qué hacés todos los días a mano y te decimos qué se puede automatizar.',
      options: ['Quiero un diagnóstico gratis', '¿Cuánto cuesta?'],
    };
  }
  return {
    text: 'Este es un bot de demostración, por eso mis respuestas son limitadas. Un asistente real se arma con la información de tu negocio: tus horarios, precios, productos y la forma en que hablás con tus clientes.',
    options: MAIN_OPTIONS,
  };
};

export const DemoWhatsAppBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => [firstMessage()]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: 'user', text: clean, time: now() }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, from: 'bot', time: now(), ...reply(clean) }]);
      setTyping(false);
    }, 650);
  };

  const reset = () => {
    setMessages([firstMessage()]);
    setInput('');
    setTyping(false);
  };

  const lastBot = [...messages].reverse().find((m) => m.from === 'bot');

  return (
    <div className="max-w-xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">Asistente de tu negocio</div>
            <div className="text-[11px] text-emerald-400 font-mono">en línea · demo</div>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reiniciar
        </button>
      </div>

      <div ref={threadRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070A12]/60 bg-dots-pattern">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.from === 'bot' ? 'items-start' : 'items-end'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.from === 'bot'
                  ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                  : 'bg-cyan-600 text-white rounded-tr-sm'
              }`}
            >
              <p>{m.text}</p>
              <div className={`mt-1 text-[10px] font-mono flex items-center justify-end gap-1 ${m.from === 'bot' ? 'text-slate-500' : 'text-cyan-100'}`}>
                {m.time}
                {m.from === 'user' && <CheckCheck className="w-3.5 h-3.5" />}
              </div>
            </div>

            {m.showContact && (
              <a
                href={whatsappLink('Hola tecnoros.ar, probé el bot de la web y quiero un diagnóstico gratis para mi negocio')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors"
              >
                Escribir por WhatsApp
              </a>
            )}

            {m === lastBot && m.options && !typing && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                {m.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => send(opt)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg transition-colors text-left"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="text-xs text-slate-400 font-mono py-1.5 px-3 bg-slate-900/70 border border-slate-800 rounded-xl w-fit">
            escribiendo…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <label htmlFor="demo-bot-input" className="sr-only">Escribí un mensaje</label>
        <input
          id="demo-bot-input"
          type="text"
          placeholder="Escribí una pregunta…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="p-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
