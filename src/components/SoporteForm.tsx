import React, { useState } from 'react';
import { LifeBuoy, Mail, MessageCircle, Send } from 'lucide-react';
import { SOPORTE_EMAIL, SOPORTE_WHATSAPP } from '../data/contact';

// Soporte técnico para quienes ya son clientes. Mismo formato que el formulario de ventas,
// pero los mensajes van a soporte (WhatsApp de soporte o soporte@tecnoros.ar).

const SISTEMAS = [
  'Página web',
  'Sistema a medida',
  'E-commerce',
  'Bot de WhatsApp',
  'Automatización',
  'CRM',
  'App móvil',
  'Golondrina',
  'CHAJÁ',
  'Otro',
];

const campo =
  'w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors';

export const SoporteForm: React.FC = () => {
  const [datos, setDatos] = useState({ nombre: '', email: '', sistema: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const texto = () => {
    const detalle = [
      datos.nombre.trim() && `• Nombre o negocio: ${datos.nombre.trim()}`,
      datos.email.trim() && `• E-mail: ${datos.email.trim()}`,
      datos.sistema && `• Sistema o servicio: ${datos.sistema}`,
      `• Qué pasa: ${datos.mensaje.trim() || '(contanos qué pasa)'}`,
    ].filter(Boolean);
    return ['Hola tecnoros.ar, soy cliente y necesito soporte técnico.', '', ...detalle].join('\n');
  };

  const porWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://wa.me/${SOPORTE_WHATSAPP}?text=${encodeURIComponent(texto())}`, '_blank', 'noopener');
  };

  const porEmail = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const asunto = `Soporte${datos.sistema ? `: ${datos.sistema}` : ''}${datos.nombre.trim() ? ` - ${datos.nombre.trim()}` : ''} - tecnoros.ar`;
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SOPORTE_EMAIL)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto())}`,
      '_blank',
      'noopener'
    );
    setEnviado(true);
    window.setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div id="soporte" className="mt-8 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-emerald-500/30 shadow-2xl scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-2xl mb-6 flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
          <LifeBuoy className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Soporte técnico</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            ¿Ya sos cliente y algo no anda o necesitás un cambio? Contanos qué pasa y elegí cómo enviarlo. Las consultas nuevas van por el formulario de ventas, arriba.
          </p>
        </div>
      </div>

      <form onSubmit={porEmail} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="soporte-nombre" className="block text-xs font-mono text-slate-300 mb-2">Tu Nombre o Negocio</label>
            <input id="soporte-nombre" type="text" autoComplete="organization" placeholder="Ej. Kiosco Central / Ana" value={datos.nombre} onChange={set('nombre')} className={campo} />
          </div>
          <div>
            <label htmlFor="soporte-email" className="block text-xs font-mono text-slate-300 mb-2">Tu E-mail de Contacto</label>
            <input id="soporte-email" type="email" autoComplete="email" placeholder="nombre@negocio.com" value={datos.email} onChange={set('email')} className={campo} />
          </div>
        </div>

        <div>
          <label htmlFor="soporte-sistema" className="block text-xs font-mono text-slate-300 mb-2">¿Con qué necesitás ayuda?</label>
          <select id="soporte-sistema" value={datos.sistema} onChange={set('sistema')} className={`${campo} cursor-pointer`}>
            <option value="">Elegí el sistema o servicio (opcional)</option>
            {SISTEMAS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="soporte-mensaje" className="block text-xs font-mono text-slate-300 mb-2">¿Qué pasa?</label>
          <textarea
            id="soporte-mensaje"
            rows={4}
            value={datos.mensaje}
            onChange={set('mensaje')}
            placeholder="Qué estabas haciendo, qué esperabas que pase y qué pasó. Si podés, mandá una captura después."
            className={`${campo} leading-relaxed`}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={porWhatsApp}
            className="px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
            <span>Enviar a soporte por WhatsApp</span>
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span>Enviar a soporte por E-mail</span>
          </button>
        </div>

        <p className="flex flex-wrap items-center justify-end gap-2 text-xs text-slate-400">
          <span>O escribí directo a</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 font-mono text-slate-300">
            <Mail className="w-3.5 h-3.5 text-emerald-400" /> {SOPORTE_EMAIL}
          </span>
        </p>

        {enviado && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            Se abrió Gmail en una pestaña nueva con tu mensaje listo para enviar a {SOPORTE_EMAIL}.
          </div>
        )}
      </form>
    </div>
  );
};
