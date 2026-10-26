import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  MessageCircle, 
  Send, 
  Copy, 
  Check, 
  Sparkles,
  CornerRightDown,
  Linkedin
} from 'lucide-react';
import { CONTACT_EMAIL, VENTAS_EMAIL, SOPORTE_EMAIL } from '../data/contact';
import { BotonesRedes } from './Redes';
import { temas, temaPorId, tomarTemaPendiente, EVENTO_TEMA } from '../consulta';

const DEFAULT_MESSAGE = "Hola, queremos contarles del problema que tenemos en nuestro negocio para que nos puedan orientar en una solución";
const WHATSAPP_NUMBERS = [
  "5493413130336",
  "5491125079568"
];

// Función para seleccionar al azar uno de los dos números
const getRandomWhatsAppNumber = (): string => {
  const randomIndex = Math.floor(Math.random() * WHATSAPP_NUMBERS.length);
  return WHATSAPP_NUMBERS[randomIndex];
};

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: DEFAULT_MESSAGE,
  });
  const [tema, setTema] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Elegir un tema reescribe el mensaje con el texto de ese tema (después se puede editar).
  const elegirTema = (id: string) => {
    setTema(id);
    const t = temaPorId(id);
    setFormData((f) => ({ ...f, mensaje: t ? t.mensaje : DEFAULT_MESSAGE }));
  };

  // Si se llegó desde un botón "Consultar por…", el tema ya viene elegido.
  useEffect(() => {
    const inicial = tomarTemaPendiente();
    if (inicial) elegirTema(inicial);
    const onTema = (e: Event) => {
      tomarTemaPendiente();
      elegirTema((e as CustomEvent<string>).detail);
    };
    window.addEventListener(EVENTO_TEMA, onTema);
    return () => window.removeEventListener(EVENTO_TEMA, onTema);
  }, []);

  const grupos = temas().reduce<Record<string, ReturnType<typeof temas>>>((acc, t) => {
    (acc[t.grupo] ||= []).push(t);
    return acc;
  }, {});
  const [sentSuccess, setSentSuccess] = useState(false);

  // El e-mail se redacta en Gmail web, en una pestaña nueva del mismo navegador
  // que está usando la persona (mailto: abriría el programa de correo del sistema).
  const gmailUrl = (subject: string, body: string) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // El navegador a veces autocompleta el campo de nombre con el e-mail.
  // Si pasa, lo usamos como e-mail y no lo mostramos como nombre del negocio.
  const camposLimpios = () => {
    const nombre = formData.nombre.trim();
    const email = formData.email.trim();
    if (nombre.includes('@')) {
      return { nombre: '', email: email || nombre };
    }
    return { nombre, email };
  };

  const handleSendFormWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetNumber = getRandomWhatsAppNumber();
    const { nombre, email } = camposLimpios();
    const nameStr = nombre ? `• *Nombre o Negocio:* ${nombre}\n` : '';
    const emailStr = email ? `• *Email de contacto:* ${email}\n` : '';
    const msgStr = formData.mensaje.trim() || DEFAULT_MESSAGE;
    
    const formattedText = `Hola equipo de tecnoros.ar,\n\n${nameStr}${emailStr}• *Consulta:* ${msgStr}`;
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(formattedText)}`;
    window.open(waUrl, '_blank');
  };

  const handleSendFormEmail = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const { nombre, email } = camposLimpios();
    const messageText = formData.mensaje.trim() || DEFAULT_MESSAGE;

    // Solo se incluyen los datos que la persona completó.
    const etiquetaTema = temaPorId(tema)?.etiqueta;
    const subject = `${etiquetaTema ? `Consulta: ${etiquetaTema}` : 'Consulta desde la web'}${nombre ? ` - ${nombre}` : ''} - tecnoros.ar`;
    const datos = [nombre && `Nombre / Empresa: ${nombre}`, email && `Email de contacto: ${email}`].filter(Boolean).join('\n');
    const bodyText = `Hola equipo de tecnoros.ar,\n\n${datos ? `${datos}\n\n` : ''}${messageText}`;

    window.open(gmailUrl(subject, bodyText), '_blank', 'noopener');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <section id="contacto" className="scroll-mt-12 sm:scroll-mt-16 py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="max-w-full lg:max-w-6xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Canales de Contacto Directo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ¿Tenés un problema en tu negocio?{' '}
            <span className="inline-flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                Hablemos
              </span>
              <CornerRightDown className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 stroke-[2.5] animate-bounce drop-shadow-[0_0_12px_rgba(0,210,243,0.8)] inline-block ml-1 translate-y-1.5 sm:translate-y-2" />
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl sm:max-w-3xl">
            Escribinos directamente para contarnos qué situación querés resolver. Te orientamos sin costo en el diseño y arquitectura de la solución adecuada.
          </p>
        </div>

        {/* Formulario integrado en pantalla para redactar y enviar */}
        <div id="consulta-directa" className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl scroll-mt-24 sm:scroll-mt-28">
          <div className="max-w-2xl mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              Dejanos tu consulta directa
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Elegí el tema y el mensaje se escribe solo. Cambialo como quieras y elegí cómo enviarlo.
            </p>
          </div>

          <form onSubmit={handleSendFormEmail} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contacto-nombre" className="block text-xs font-mono text-slate-300 mb-2">
                  Tu Nombre o Negocio
                </label>
                <input
                  id="contacto-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="organization"
                  placeholder="Ej. Distribuidora Santa Fe / Carlos"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contacto-email" className="block text-xs font-mono text-slate-300 mb-2">
                  Tu E-mail de Contacto
                </label>
                <input
                  id="contacto-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@negocio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contacto-tema" className="block text-xs font-mono text-slate-300 mb-2">
                ¿Sobre qué querés consultar?
              </label>
              <select
                id="contacto-tema"
                value={tema}
                onChange={(e) => elegirTema(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="">Elegí un tema (opcional)</option>
                {Object.entries(grupos).map(([grupo, lista]) => (
                  <optgroup key={grupo} label={grupo}>
                    {lista.map((t) => (
                      <option key={t.id} value={t.id}>{t.etiqueta}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="contacto-mensaje" className="block text-xs font-mono text-slate-300">
                  Tu mensaje
                </label>
              </div>
              <textarea
                id="contacto-mensaje"
                name="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                placeholder="Contanos qué situación o proceso necesitás resolver en tu negocio..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSendFormWhatsApp}
                  className="px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Abre WhatsApp con tu nombre, email y consulta pre-cargados"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendFormEmail}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Abre Gmail en una pestaña nueva con tu nombre, email y consulta pre-cargados"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Enviar por E-mail</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-slate-400">
              <span>O escribinos a</span>
              {[
                { etiqueta: 'Ventas', email: VENTAS_EMAIL },
                { etiqueta: 'Soporte', email: SOPORTE_EMAIL },
              ].map(({ etiqueta, email }) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => handleCopyEmail(email)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 font-mono text-slate-300 transition-colors cursor-pointer"
                  title={`Copiar email de ${etiqueta.toLowerCase()}`}
                >
                  {copiedEmail === email ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-sans text-slate-400">{etiqueta}:</span>
                      <span>{email}</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            {sentSuccess && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>¡Se abrió Gmail en una pestaña nueva con tu mensaje listo para enviar a {CONTACT_EMAIL}!</span>
              </div>
            )}
          </form>
        </div>

        {/* Redes de tecnoros.ar */}
        <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left">
            <h4 className="text-base font-bold text-white">Seguinos en redes</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Novedades, proyectos y el avance de nuestro robot para el JAR</p>
          </div>
          <BotonesRedes />
        </div>

      </div>
    </section>
  );
};
