import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle, RotateCcw, X } from 'lucide-react';
import { SOPORTE_EMAIL, whatsappLink } from '../data/contact';

// Botón de arrepentimiento (Ley 24.240 art. 34 y Res. 424/2020) y botón de baja (Res. 316/2018).
// Se abre desde cualquier link a "#arrepentimiento" o "#baja". No pide registrarse:
// arma el pedido y lo envía a soporte@ por email o WhatsApp; tecnoros.ar responde con un
// código de trámite dentro de las 24 horas.
type Tipo = 'arrepentimiento' | 'baja';

const HASHES: Record<string, Tipo> = { '#arrepentimiento': 'arrepentimiento', '#baja': 'baja' };

export const abrirArrepentimiento = (tipo: Tipo = 'arrepentimiento') => {
  window.location.hash = tipo;
};

export const Arrepentimiento: React.FC = () => {
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '', servicio: '', fecha: '', comentario: '' });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const leer = () => setTipo(HASHES[window.location.hash] ?? null);
    leer();
    window.addEventListener('hashchange', leer);
    return () => window.removeEventListener('hashchange', leer);
  }, []);

  useEffect(() => {
    if (!tipo) return;
    setEnviado(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [tipo]);

  const cerrar = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setTipo(null);
  };

  if (!tipo) return null;

  const titulo = tipo === 'arrepentimiento' ? 'Botón de arrepentimiento' : 'Botón de baja';
  const asunto = `${titulo} - ${datos.nombre || 'Solicitud'}`;
  const cuerpo = [
    tipo === 'arrepentimiento'
      ? 'Hola tecnoros.ar, quiero ejercer mi derecho de arrepentimiento (art. 34, Ley 24.240) y revocar la contratación.'
      : 'Hola tecnoros.ar, quiero dar de baja el servicio contratado.',
    '',
    `Nombre o empresa: ${datos.nombre}`,
    `Email: ${datos.email}`,
    `Teléfono: ${datos.telefono}`,
    `Servicio contratado: ${datos.servicio}`,
    `Fecha de contratación: ${datos.fecha}`,
    datos.comentario ? `Comentario: ${datos.comentario}` : '',
    '',
    'Espero el código de trámite.',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  const completo = datos.nombre.trim() && datos.email.includes('@') && datos.servicio.trim();
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SOPORTE_EMAIL)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  const mailto = `mailto:${SOPORTE_EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  const campo = 'w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none px-3 py-2.5 text-sm text-white placeholder:text-slate-500';
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDatos({ ...datos, [k]: e.target.value });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={cerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="arrep-titulo"
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-7 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="arrep-titulo" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white">
            <RotateCcw className="w-5 h-5 text-cyan-400 shrink-0" />
            {titulo}
          </h2>
          <button type="button" onClick={cerrar} aria-label="Cerrar" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div role="tablist" aria-label="Tipo de pedido" className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {(['arrepentimiento', 'baja'] as Tipo[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tipo === t}
              type="button"
              onClick={() => abrirArrepentimiento(t)}
              className={`py-2 rounded-lg border font-semibold cursor-pointer ${tipo === t ? 'bg-cyan-400 text-slate-950 border-cyan-400' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}
            >
              {t === 'arrepentimiento' ? 'Me arrepentí' : 'Dar de baja'}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-300 leading-relaxed">
          {tipo === 'arrepentimiento'
            ? 'Si contrataste un servicio a distancia (web, WhatsApp o email), podés arrepentirte dentro de los 10 días corridos, sin costo y sin dar explicaciones. Te devolvemos lo pagado por el mismo medio.'
            : 'Podés dar de baja un abono mensual cuando quieras, sin penalidad. Se cancela el próximo cobro y seguís con acceso hasta el final del período ya pagado.'}{' '}
          No hace falta registrarte. <b className="text-white">Te enviamos un código de trámite dentro de las 24 horas.</b>
        </p>

        <form className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={(e) => e.preventDefault()}>
          <label className="sm:col-span-2 text-xs text-slate-400">Nombre o empresa *
            <input className={`${campo} mt-1`} value={datos.nombre} onChange={set('nombre')} autoComplete="name" required />
          </label>
          <label className="text-xs text-slate-400">Email *
            <input className={`${campo} mt-1`} type="email" value={datos.email} onChange={set('email')} autoComplete="email" required />
          </label>
          <label className="text-xs text-slate-400">Teléfono
            <input className={`${campo} mt-1`} type="tel" value={datos.telefono} onChange={set('telefono')} autoComplete="tel" />
          </label>
          <label className="text-xs text-slate-400">Servicio contratado *
            <input className={`${campo} mt-1`} value={datos.servicio} onChange={set('servicio')} placeholder="Ej: soporte mensual" required />
          </label>
          <label className="text-xs text-slate-400">Fecha de contratación
            <input className={`${campo} mt-1`} type="date" value={datos.fecha} onChange={set('fecha')} />
          </label>
          <label className="sm:col-span-2 text-xs text-slate-400">Comentario (opcional)
            <textarea className={`${campo} mt-1 min-h-[70px]`} value={datos.comentario} onChange={set('comentario')} />
          </label>

          <div className="sm:col-span-2 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={completo ? gmail : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!completo}
              onClick={(e) => (completo ? setEnviado(true) : e.preventDefault())}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm ${completo ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <Mail className="w-4 h-4" /> Enviar por email
            </a>
            <a
              href={completo ? whatsappLink(`${asunto}\n\n${cuerpo}`) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!completo}
              onClick={(e) => (completo ? setEnviado(true) : e.preventDefault())}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border ${completo ? 'border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 cursor-pointer' : 'border-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <MessageCircle className="w-4 h-4" /> Enviar por WhatsApp
            </a>
          </div>
          {!completo && <p className="sm:col-span-2 text-xs text-slate-500">Completá nombre, email y servicio para enviar.</p>}
          {completo && (
            <p className="sm:col-span-2 text-xs text-slate-400">
              ¿No usás Gmail? <a href={mailto} className="text-cyan-300 underline">Abrí tu programa de correo</a> o escribí directo a {SOPORTE_EMAIL}.
            </p>
          )}
          {enviado && (
            <p role="status" className="sm:col-span-2 text-sm text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-3">
              Se abrió tu mensaje listo para enviar. Cuando lo mandes, te respondemos con el código de trámite dentro de las 24 horas.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
