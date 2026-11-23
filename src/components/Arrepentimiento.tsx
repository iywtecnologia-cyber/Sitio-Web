import React, { useEffect, useRef, useState } from 'react';
import { Mail, MessageCircle, RotateCcw, X } from 'lucide-react';
import { SOPORTE_EMAIL, whatsappLink, mailtoLink } from '../data/contact';
import {
  emailValido, MENSAJE_EMAIL_INVALIDO, limpiarNombre, nombreValido, MENSAJE_NOMBRE_INVALIDO, limpiarComentario,
  limpiarTelefono, telefonoValido, MENSAJE_TELEFONO, hoyISO, fechaNoFutura, type TipoTelefono,
} from '../validacion';
import { SERVICES } from './ServicesSection';

// Todo lo que ofrecemos, para elegir el servicio contratado de una lista.
const SERVICIOS_CONTRATABLES = [
  ...SERVICES.map((s) => s.title.split(':')[0]),
  'Golondrina Automatización',
  'Golondrina Personal',
  'CHAJÁ',
  'Mostrador (chatbot con IA)',
  'Abono de soporte mensual',
  'Combo',
  'Otro',
];

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  // El e-mail se marca como inválido recién al salir del campo: mientras escribe, "juan@" es normal.
  const [emailTocado, setEmailTocado] = useState(false);
  const [tipoTel, setTipoTel] = useState<TipoTelefono>('nacional');
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const tocar = (k: string) => () => setTocados((t) => ({ ...t, [k]: true }));
  const dialogo = useRef<HTMLDivElement>(null);
  const primerCampo = useRef<HTMLInputElement>(null);
  // Quién abrió el modal, para devolverle el foco al cerrar (si no, quien navega con teclado
  // o lector de pantalla vuelve al principio de la página).
  const disparador = useRef<HTMLElement | null>(null);
  const abierto = tipo !== null;

  useEffect(() => {
    const leer = () => {
      const nuevo = HASHES[window.location.hash] ?? null;
      // Se guarda sólo al abrir: cambiar entre "Me arrepentí" y "Dar de baja" también cambia el hash.
      setTipo((previo) => {
        if (!previo && nuevo) {
          const activo = document.activeElement;
          disparador.current = activo instanceof HTMLElement && activo !== document.body ? activo : null;
        }
        return nuevo;
      });
    };
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

  // Al abrir, el foco entra al primer campo. Al cerrar, vuelve a quien lo abrió.
  useEffect(() => {
    if (!abierto) return;
    primerCampo.current?.focus();
    return () => {
      const d = disparador.current;
      if (d && d.isConnected) d.focus();
      disparador.current = null;
    };
  }, [abierto]);

  // Tab y Shift+Tab no salen del modal mientras está abierto (aria-modal solo no lo impide).
  const atraparTab = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogo.current) return;
    const enfocables = Array.from(dialogo.current.querySelectorAll<HTMLElement>(ENFOCABLES));
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  };

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
    `e-mail: ${datos.email}`,
    `Teléfono (${tipoTel}): ${datos.telefono}`,
    `Servicio contratado: ${datos.servicio}`,
    `Fecha de contratación: ${datos.fecha}`,
    datos.comentario ? `Comentario: ${datos.comentario}` : '',
    '',
    'Espero el código de trámite.',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  // Antes alcanzaba con que el e-mail tuviera "@" y el aviso era siempre el mismo genérico;
  // ahora se dice exactamente qué falta o qué está mal.
  const emailMal = datos.email.trim() !== '' && !emailValido(datos.email);
  const errorEmail = emailTocado && emailMal ? MENSAJE_EMAIL_INVALIDO : '';
  const nombreMal = datos.nombre.trim() !== '' && !nombreValido(datos.nombre);
  const telMal = datos.telefono.trim() !== '' && !telefonoValido(datos.telefono, tipoTel);
  const fechaMal = !fechaNoFutura(datos.fecha);
  const faltan = [!datos.nombre.trim() && 'nombre', !datos.email.trim() && 'e-mail', !datos.servicio.trim() && 'servicio contratado'].filter(Boolean) as string[];
  const completo = faltan.length === 0 && !emailMal && !nombreMal && !telMal && !fechaMal;
  const aviso = faltan.length
    ? `Para enviar, completá: ${faltan.join(', ').replace(/, ([^,]*)$/, ' y $1')}.`
    : nombreMal ? MENSAJE_NOMBRE_INVALIDO
    : emailMal ? 'Revisá el e-mail para poder enviar.'
    : telMal ? MENSAJE_TELEFONO(tipoTel)
    : fechaMal ? 'La fecha de contratación no puede ser posterior a hoy.'
    : '';
  const mailto = mailtoLink(SOPORTE_EMAIL, asunto, cuerpo);

  const campo = 'w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none px-3 py-2.5 text-sm text-white placeholder:text-slate-500';
  // Cada campo deja escribir solo lo que corresponde (sin caracteres raros).
  const limpiar: Partial<Record<keyof typeof datos, (v: string) => string>> = {
    nombre: limpiarNombre,
    telefono: (v) => limpiarTelefono(v, tipoTel),
    comentario: limpiarComentario,
    email: (v) => v.replace(/\s/g, ''),
  };
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setDatos({ ...datos, [k]: (limpiar[k] ?? ((v: string) => v))(e.target.value) });
  const malCampo = (mal: boolean) => (mal ? campo.replace('border-slate-700', 'border-rose-500') : campo);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={cerrar}>
      <div
        ref={dialogo}
        onKeyDown={atraparTab}
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

        <form method="post" noValidate className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={(e) => e.preventDefault()}>
          <label className="sm:col-span-2 text-xs text-slate-400">Nombre o empresa *
            <input ref={primerCampo} className={`${malCampo(!!tocados.nombre && nombreMal)} mt-1`} value={datos.nombre} onChange={set('nombre')} onBlur={tocar('nombre')} autoComplete="name" required />
            {tocados.nombre && nombreMal && <span className="block mt-1 text-xs text-rose-300">{MENSAJE_NOMBRE_INVALIDO}</span>}
          </label>
          <label className="text-xs text-slate-400">Email *
            <input
              className={`${errorEmail ? campo.replace('border-slate-700', 'border-rose-500') : campo} mt-1`}
              type="email"
              value={datos.email}
              onChange={set('email')}
              onBlur={() => setEmailTocado(true)}
              autoComplete="email"
              required
              aria-invalid={errorEmail ? true : undefined}
              aria-describedby={errorEmail ? 'arrep-email-error' : undefined}
            />
            {errorEmail && <span id="arrep-email-error" className="block mt-1 text-xs text-rose-300">{errorEmail}</span>}
          </label>
          <div className="text-xs text-slate-400">
            <span className="flex items-center justify-between gap-2">
              <label htmlFor="arrep-tel">Teléfono</label>
              {/* Nacional o internacional: cambia qué números acepta */}
              <span className="inline-flex rounded-md border border-slate-700 overflow-hidden" role="group" aria-label="Tipo de teléfono">
                {(['nacional', 'internacional'] as TipoTelefono[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tipoTel === t}
                    onClick={() => {
                      setTipoTel(t);
                      setDatos((d) => ({ ...d, telefono: limpiarTelefono(t === 'internacional' && !d.telefono.startsWith('+') ? `+${d.telefono}` : d.telefono, t) }));
                    }}
                    className={`px-1.5 py-0.5 text-[10px] cursor-pointer ${tipoTel === t ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-300'}`}
                  >
                    {t === 'nacional' ? 'Nacional' : 'Internacional'}
                  </button>
                ))}
              </span>
            </span>
            <input
              id="arrep-tel"
              className={`${malCampo(!!tocados.telefono && telMal)} mt-1`}
              type="tel"
              inputMode="tel"
              value={datos.telefono}
              onChange={set('telefono')}
              onBlur={tocar('telefono')}
              placeholder={tipoTel === 'nacional' ? '341 313 0336' : '+34 600 123 456'}
              autoComplete="tel"
            />
            {tocados.telefono && telMal && <span className="block mt-1 text-xs text-rose-300">{MENSAJE_TELEFONO(tipoTel)}</span>}
          </div>
          <label className="text-xs text-slate-400">Servicio contratado *
            <select className={`${campo} mt-1`} value={datos.servicio} onChange={set('servicio')} required>
              <option value="">Elegí el servicio</option>
              {SERVICIOS_CONTRATABLES.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
            </select>
          </label>
          <label className="text-xs text-slate-400">Fecha de contratación
            <input className={`${malCampo(fechaMal)} mt-1`} type="date" max={hoyISO()} value={datos.fecha} onChange={set('fecha')} />
            {fechaMal && <span className="block mt-1 text-xs text-rose-300">No puede ser posterior a hoy.</span>}
          </label>
          <label className="sm:col-span-2 text-xs text-slate-400">Comentario (opcional, solo palabras)
            <textarea className={`${campo} mt-1 min-h-[70px]`} value={datos.comentario} onChange={set('comentario')} />
          </label>

          <div className="sm:col-span-2 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={completo ? mailto : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!completo}
              onClick={(e) => (completo ? setEnviado(true) : e.preventDefault())}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm ${completo ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <Mail className="w-4 h-4" /> Enviar por e-mail
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
          {!completo && <p className="sm:col-span-2 text-xs text-slate-400" aria-live="polite">{aviso}</p>}
          {completo && (
            <p className="sm:col-span-2 text-xs text-slate-400">
              ¿No se abrió Gmail? Escribí directo a {SOPORTE_EMAIL}.
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
