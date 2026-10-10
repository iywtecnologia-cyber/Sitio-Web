import React, { useState } from 'react';
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

const DEFAULT_MESSAGE = "Hola, queremos contarles del problema que tenemos en nuestro negocio para que nos puedan orientar en una solución";
const CONTACT_EMAIL = "tecnorosar@gmail.com";
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
    mensaje: '',
  });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const encodedWhatsAppMessage = encodeURIComponent(DEFAULT_MESSAGE);
  const encodedEmailSubject = encodeURIComponent("Consulta sobre solución digital - tecnoros.ar");
  const encodedEmailBody = encodeURIComponent(DEFAULT_MESSAGE);

  // El e-mail se redacta en Gmail web, en una pestaña nueva del mismo navegador
  // (mailto: abre el programa de correo del sistema, que puede ser otro navegador o app).
  const gmailUrl = (subject: string, body: string) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const EMAIL_SUBJECT = 'Consulta sobre solución digital - tecnoros.ar';

  // Alternativa para quien usa otro correo: abre la app de correo del sistema.
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodedEmailSubject}&body=${encodedEmailBody}`;

  const handleOpenDirectWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetNumber = getRandomWhatsAppNumber();
    const waUrl = `https://wa.me/${targetNumber}?text=${encodedWhatsAppMessage}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
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
    
    const formattedText = `Hola equipo de tecnoros.ar,\n\n${nameStr}${emailStr}• *Problema a resolver:* ${msgStr}`;
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(formattedText)}`;
    window.open(waUrl, '_blank');
  };

  const handleSendFormEmail = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const { nombre, email } = camposLimpios();
    const senderName = nombre || 'Negocio';
    const senderEmail = email || 'No especificado';
    const messageText = formData.mensaje.trim() || DEFAULT_MESSAGE;

    const subject = `Consulta de ${senderName} - tecnoros.ar`;
    const bodyText = `Hola equipo de tecnoros.ar,\n\nNombre / Empresa: ${senderName}\nEmail de contacto: ${senderEmail}\n\nProblema a resolver:\n${messageText}`;

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
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Canales de Contacto Directo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ¿Tenés un problema en tu negocio?{' '}
            <span className="inline-flex items-center gap-2 align-baseline">
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                Hablemos
              </span>
              {/* Flecha que dobla hacia abajo: bajada para alinearse armónicamente con las tarjetas inferiores */}
              <CornerRightDown className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 stroke-[2.5] animate-bounce drop-shadow-[0_0_12px_rgba(0,210,243,0.8)] inline-block ml-1 translate-y-3.5 sm:translate-y-4" />
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Escribinos directamente para contarnos qué situación querés resolver. Te orientamos sin costo en el diseño y arquitectura de la solución adecuada.
          </p>
        </div>

        {/* Mensaje listo para enviar + elegir canal */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/20 border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider block mb-3">
            Tu mensaje, listo para enviar
          </span>
          <blockquote className="p-5 sm:p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 text-base sm:text-xl text-white leading-relaxed">
            "{DEFAULT_MESSAGE}"
          </blockquote>

          <p className="mt-6 mb-3 text-sm text-slate-300">Elegí cómo querés enviarlo:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleOpenDirectWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Por WhatsApp</span>
            </button>
            <a
              href={gmailUrl(EMAIL_SUBJECT, DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Por E-mail</span>
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <a href={mailtoUrl} className="underline underline-offset-2 hover:text-slate-200 transition-colors">
              ¿Usás otro correo? Abrilo con tu app
            </a>
            <span className="text-slate-600">·</span>
            <span>o escribinos a</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 font-mono text-slate-300 transition-colors cursor-pointer"
              title="Copiar email"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{CONTACT_EMAIL}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sección de Conexión en LinkedIn */}
        <div className="mb-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>Perfiles en LinkedIn</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Fundadores
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Si querés conocer más de nosotros
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Entrada LinkedIn Manuel Angiulli */}
            <a
              href="https://www.linkedin.com/in/manuel-angiulli/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10 text-slate-300 hover:text-cyan-300 transition-all text-xs font-mono group shadow-sm cursor-pointer"
              title="Perfil de LinkedIn de Manuel Angiulli"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform shrink-0" />
              <span>LinkedIn Manuel Angiulli</span>
            </a>

            {/* Entrada LinkedIn M. Sofía Genta */}
            <a
              href="https://www.linkedin.com/in/mariiasof%C3%ADagenta/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10 text-slate-300 hover:text-cyan-300 transition-all text-xs font-mono group shadow-sm cursor-pointer"
              title="Perfil de LinkedIn de M. Sofía Genta"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform shrink-0" />
              <span>LinkedIn M. Sofía Genta</span>
            </a>
          </div>
        </div>

        {/* Formulario integrado en pantalla para redactar y enviar */}
        <div id="consulta-directa" className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl scroll-mt-24 sm:scroll-mt-28">
          <div className="max-w-2xl mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              Dejanos tu consulta directa
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Podés completar los campos a continuación o ajustar el mensaje antes de enviarlo.
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-slate-300">
                  Mensaje / Problema a Resolver
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

            {sentSuccess && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>¡Se abrió tu gestor de correo con el mensaje listo para enviar a {CONTACT_EMAIL}!</span>
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};
