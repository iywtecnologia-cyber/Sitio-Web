import React, { useState } from 'react';
import { 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  PhoneCall,
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

  const encodedWhatsAppMessage = encodeURIComponent(formData.mensaje.trim() || DEFAULT_MESSAGE);
  const encodedEmailSubject = encodeURIComponent("Consulta sobre solución digital - tecnoros.ar");
  const encodedEmailBody = encodeURIComponent(formData.mensaje.trim() || DEFAULT_MESSAGE);

  // Link directo para abrir cliente de correo (Gmail, Outlook, etc.)
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

  const handleSendFormWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetNumber = getRandomWhatsAppNumber();
    const nameStr = formData.nombre.trim() ? `• *Nombre o Negocio:* ${formData.nombre.trim()}\n` : '';
    const emailStr = formData.email.trim() ? `• *Email de contacto:* ${formData.email.trim()}\n` : '';
    const msgStr = formData.mensaje.trim() || DEFAULT_MESSAGE;
    
    const formattedText = `Hola equipo de tecnoros.ar,\n\n${nameStr}${emailStr}• *Problema a resolver:* ${msgStr}`;
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(formattedText)}`;
    window.open(waUrl, '_blank');
  };

  const handleSendFormEmail = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const senderName = formData.nombre.trim() || 'Negocio';
    const senderEmail = formData.email.trim() || 'No especificado';
    const messageText = formData.mensaje.trim() || DEFAULT_MESSAGE;

    const subject = `Consulta de ${senderName} - tecnoros.ar`;
    const bodyText = `Hola equipo de tecnoros.ar,\n\nNombre / Empresa: ${senderName}\nEmail de contacto: ${senderEmail}\n\nProblema a resolver:\n${messageText}`;
    
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <section id="contacto" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
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

        {/* Botones de Acción Inmediata (WhatsApp & E-mail) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-stretch">
          
          {/* Botón WhatsApp */}
          <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/20 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-5 h-12">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Chat directo</span>
                </div>
              </div>

              <span className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider block">
                Atención Inmediata
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-3">
                Hablar por WhatsApp
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 sm:min-h-[44px]">
                Iniciá una conversación al instante con el mensaje listo para enviarnos tu consulta sobre tu negocio.
              </p>

              {/* Vista previa del mensaje */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-emerald-300/90 mb-6 italic text-center flex items-center justify-center min-h-[68px]">
                "{DEFAULT_MESSAGE}..."
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenDirectWhatsApp}
              className="w-full inline-flex items-center justify-center gap-1 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 mr-1" />
              <span>Abrir chat de WhatsApp</span>
              <ArrowRight className="w-4 h-4 translate-y-[2px] -ml-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Botón E-mail */}
          <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/20 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-5 h-12">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
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

              <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider block">
                Propuestas & Consultas
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-3">
                Hablar por E-mail
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 sm:min-h-[44px]">
                Redactá tu mensaje o abrí tu aplicación de correo predeterminada con la consulta pre-cargada.
              </p>

              {/* Vista previa del mensaje */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-cyan-300/90 mb-6 italic text-center flex items-center justify-center min-h-[68px]">
                "{DEFAULT_MESSAGE}..."
              </div>
            </div>

            <a
              href={mailtoUrl}
              className="w-full inline-flex items-center justify-center gap-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <Mail className="w-4 h-4 mr-1" />
              <span>Enviar consulta por E-mail</span>
              <ArrowRight className="w-4 h-4 translate-y-[2px] -ml-0.5 group-hover:translate-x-1 transition-transform" />
            </a>
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
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl">
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
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Tu Nombre o Negocio
                </label>
                <input
                  type="text"
                  placeholder="Ej. Distribuidora Santa Fe / Carlos"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Tu E-mail de Contacto
                </label>
                <input
                  type="email"
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
                  title="Abre tu correo con tu nombre, email y consulta pre-cargados"
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
