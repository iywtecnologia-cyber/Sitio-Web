import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCheck, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'bot',
    text: '¡Hola! 👋 Soy el Asistente Inteligente de TecnoRosario.AR. Estoy conectado a nuestro catálogo, base de datos operativa y módulo de AFIP. ¿En qué te puedo asesorar hoy?',
    timestamp: '14:20',
    quickReplies: [
      '¿Cuánto cuesta un software a medida?',
      '¿Emiten Factura A oficial AFIP?',
      'Consultar estado de envío TR-LOG-8910',
      'Agendar una demo técnica'
    ]
  }
];

export const SimulatorWhatsAppBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateBotReply = (userQuery: string): { text: string; quickReplies?: string[] } => {
    const q = userQuery.toLowerCase();

    if (q.includes('cuesta') || q.includes('precio') || q.includes('presupuesto') || q.includes('cotiz')) {
      return {
        text: 'Nuestros desarrollos a medida parten desde los $850.000 ARS (o USD 750) según la complejidad y módulos requeridos (panel web, backend, base de datos y pasarelas). Podés probar nuestro cotizador interactivo más abajo en esta misma web para calcular el valor exacto con IVA y retenciones en tiempo real.',
        quickReplies: ['Ir al cotizador en pantalla', '¿Cuánto demora el desarrollo?']
      };
    }

    if (q.includes('afip') || q.includes('factura') || q.includes('cae') || q.includes('fiscal')) {
      return {
        text: '¡Exacto! Somos empresa argentina registrada y emitimos Factura A y B con CAE oficial mediante Web Services AFIP v2. Además integramos emisión fiscal automática en los sistemas que desarrollamos para que factures en 1.8 segundos.',
        quickReplies: ['Ver panel demo de facturación', '¿Cómo es el esquema de cobro?']
      };
    }

    if (q.includes('envio') || q.includes('8910') || q.includes('log') || q.includes('seguimiento') || q.includes('camion')) {
      return {
        text: 'Consultando satélite... 🚚 El envío TR-LOG-8910 (Molinos del Paraná) está actualmente sobre Circunvalación Norte Km 14 a 74 Km/h, con temperatura de carga a 18.4°C. Su llegada estimada a San Lorenzo es a las 14:45 hs (en 28 min).',
        quickReplies: ['Ver monitor logístico en vivo', '¿Monitorean sensores IoT?']
      };
    }

    if (q.includes('demo') || q.includes('agendar') || q.includes('llamada') || q.includes('reunion') || q.includes('contacto')) {
      return {
        text: 'Excelente. Podés dejar tus datos en el formulario de contacto al pie de la página o contactarnos directamente por WhatsApp al +54 9 341 555-0192. Un ingeniero de software de nuestro equipo te contactará en menos de 2 horas hábiles.',
        quickReplies: ['Completar formulario de contacto', '¿Dónde están sus oficinas?']
      };
    }

    if (q.includes('oficina') || q.includes('rosario') || q.includes('ubicacion')) {
      return {
        text: 'Nuestras oficinas centrales están en Av. Pellegrini 1840, Rosario, Santa Fe, con base técnica en el Polo Tecnológico Rosario (Zona Sur). ¡Estás invitado a tomar un café y charlar sobre tu proyecto!',
        quickReplies: ['¿Cuánto cuesta un software a medida?', 'Agendar una demo técnica']
      };
    }

    // Default intelligent response
    return {
      text: `Entendido tu consulta: "${userQuery}". Como agente de IA entrenado en TecnoRosario.AR, puedo coordinar con nuestro equipo técnico, emitir cotizaciones preliminares o consultar bases de datos operativas en tiempo real. ¿Querés que agendemos un llamado con un ingeniero?`,
      quickReplies: ['Agendar una demo técnica', '¿Cuánto cuesta un software a medida?', '¿Emiten Factura A oficial AFIP?']
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const time = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate smart bot response delay
    setTimeout(() => {
      const replyData = generateBotReply(text);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: replyData.text,
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: replyData.quickReplies
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
    setIsTyping(false);
  };

  return (
    <div className="bg-[#0B101E] rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Simulator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
            SISTEMA DEMO 02 · AGENTE DE IA & WHATSAPP CRM COGNITIVO
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Asistente Conversacional para Atención 24/7 y Ventas
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Interactuá con nuestro bot: hacele preguntas sobre precios, normativas AFIP o pedile el estado de un envío simulado.
          </p>
        </div>

        <button
          onClick={resetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reiniciar Chat</span>
        </button>
      </div>

      {/* WhatsApp Frame Simulation */}
      <div className="mt-6 max-w-xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Header */}
        <div className="bg-slate-900/95 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>TecnoRosario Bot Oficial</span>
                <span className="text-[10px] text-cyan-400 font-mono">IA v2.4</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <span>● En línea · Responde al instante</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            Rosario, AR
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070A12]/60 bg-dots-pattern">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isBot
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-tr-sm font-medium'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`mt-1 text-[10px] font-mono flex items-center justify-end gap-1 ${
                      isBot ? 'text-slate-400' : 'text-cyan-100'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isBot && <CheckCheck className="w-3.5 h-3.5 text-cyan-100" />}
                  </div>
                </div>

                {/* Quick replies */}
                {isBot && msg.quickReplies && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(reply)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 rounded-lg transition-colors text-left"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono py-1 px-3 bg-slate-900/70 border border-slate-800 rounded-xl w-fit">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>TecnoRosario está escribiendo respuesta...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Escribí un mensaje de prueba (ej: ¿Cómo trabajan?)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
