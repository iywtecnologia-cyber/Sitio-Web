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
import { CONTACT_EMAIL, VENTAS_EMAIL, gmailPara, mailtoLink } from '../data/contact';
import { temas, temaPorId, tomarTemaPendiente, EVENTO_TEMA } from '../consulta';
import { emailValido, enfocarPrimero, MENSAJE_EMAIL_INVALIDO } from '../validacion';

// Palabras que ayudan a elegir el tema solo, mientras la persona escribe
const PALABRAS_TEMA: [string, string[]][] = [
  ['servicio-ecommerce', ['tienda', 'vender online', 'e-commerce', 'ecommerce', 'carrito']],
  ['servicio-aplicaciones-moviles', ['app', 'aplicación', 'aplicacion', 'celular']],
  ['servicio-crm', ['crm', 'seguimiento de clientes', 'base de clientes']],
  ['servicio-bots-whatsapp', ['whatsapp', 'bot']],
  ['servicio-asistentes', ['asistente', 'personaje', 'mascota']],
  ['servicio-campanas-ads', ['campaña', 'campana', 'publicidad', 'anuncio', 'ads', 'instagram', 'facebook', 'google']],
  ['servicio-identidad-marca', ['logo', 'identidad', 'colores de la marca']],
  ['servicio-estrategia-marca', ['marca', 'estrategia', 'posicionamiento']],
  ['servicio-ciberseguridad', ['segur', 'hacke', 'virus', 'contraseña', 'ataque']],
  ['servicio-robotica-a-medida', ['robot']],
  ['servicio-automatizacion', ['automat', 'turno', 'reserva', 'planilla', 'excel', 'formulario', 'reporte', 'factura', 'carga de datos', 'integr']],
  ['diagnostico', ['diagnóstico', 'diagnostico', 'no sé qué', 'no se que']],
  ['producto-golondrina', ['golondrina', 'máquina', 'maquina', 'planta', 'cámara de frío', 'camara de frio', 'sensor']],
  ['producto-chaja', ['chajá', 'chaja']],
  ['producto-tero', ['tero']],
  ['presupuesto', ['presupuesto', 'precio', 'cuánto cuesta', 'cuanto cuesta', 'cotiz']],
];

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
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Elegir un tema reescribe el mensaje con el texto de ese tema (después se puede editar).
  // Si la persona escribe sin elegir tema, lo elegimos solos según lo que escribe
  const [temaAuto, setTemaAuto] = useState(false);
  const escribirMensaje = (texto: string) => {
    setFormData((f) => ({ ...f, mensaje: texto }));
    if (tema && !temaAuto) return; // eligió un tema a mano: no lo tocamos
    const t = texto.toLowerCase();
    const hallado = PALABRAS_TEMA.find(([, palabras]) => palabras.some((p) => t.includes(p)));
    if (hallado) {
      setTema(hallado[0]);
      setTemaAuto(true);
    }
  };

  const elegirTema = (id: string) => {
    setTemaAuto(false);
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
  // Después de enviar queda el aviso con el respaldo de Gmail (por si no hay programa de correo).
  const [gmailRespaldo, setGmailRespaldo] = useState<string | null>(null);

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

  // El mensaje es obligatorio; nombre y e-mail no (por WhatsApp ya llega el número),
  // pero si escribe un e-mail tiene que ser válido para poder responderle.
  const [errores, setErrores] = useState<{ nombre?: string; email?: string; mensaje?: string }>({});
  const validar = () => {
    const { nombre, email } = camposLimpios();
    const nuevos: typeof errores = {};
    if (!nombre) nuevos.nombre = 'Escribí tu nombre o el de tu negocio.';
    if (email && !emailValido(email)) nuevos.email = MENSAJE_EMAIL_INVALIDO;
    if (!formData.mensaje.trim()) nuevos.mensaje = 'Contanos qué necesitás para poder enviar la consulta.';
    setErrores(nuevos);
    enfocarPrimero([nuevos.nombre && 'contacto-nombre', nuevos.email && 'contacto-email', nuevos.mensaje && 'contacto-mensaje'].filter(Boolean) as string[]);
    return Object.keys(nuevos).length === 0;
  };

  const handleSendFormWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validar()) return;
    const targetNumber = getRandomWhatsAppNumber();
    const { nombre, email } = camposLimpios();
    const nameStr = nombre ? `• *Nombre o Negocio:* ${nombre}\n` : '';
    const emailStr = email ? `• *e-mail de contacto:* ${email}\n` : '';
    const msgStr = formData.mensaje.trim() || DEFAULT_MESSAGE;
    
    const formattedText = `Hola equipo de tecnoros.ar,\n\n${nameStr}${emailStr}• *Consulta:* ${msgStr}`;
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(formattedText)}`;
    window.open(waUrl, '_blank');
  };

  const handleSendFormEmail = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!validar()) return;
    const { nombre, email } = camposLimpios();
    const messageText = formData.mensaje.trim() || DEFAULT_MESSAGE;

    // Solo se incluyen los datos que la persona completó.
    const etiquetaTema = temaPorId(tema)?.etiqueta;
    const subject = `${etiquetaTema ? `Consulta: ${etiquetaTema}` : 'Consulta desde la web'}${nombre ? ` - ${nombre}` : ''} - tecnoros.ar`;
    const datos = [nombre && `Nombre / Empresa: ${nombre}`, email && `e-mail de contacto: ${email}`].filter(Boolean).join('\n');
    const bodyText = `Hola equipo de tecnoros.ar,\n\n${datos ? `${datos}\n\n` : ''}${messageText}`;

    window.open(mailtoLink(CONTACT_EMAIL, subject, bodyText), '_blank', 'noopener');
    setGmailRespaldo(gmailPara(CONTACT_EMAIL, subject, bodyText));
  };

  return (
    <section id="contacto" className="scroll-mt-12 sm:scroll-mt-16 py-5 sm:py-6 bg-transparent border-t border-slate-800/50 relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="max-w-full lg:max-w-6xl mb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-400 mb-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>Canales de Contacto Directo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            ¿Tenés un problema en tu negocio?{' '}
            <span className="inline-flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                Hablemos
              </span>
              <CornerRightDown className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 stroke-[2.5] animate-bounce drop-shadow-[0_0_12px_rgba(0,210,243,0.8)] inline-block ml-1 translate-y-1.5 sm:translate-y-2" />
            </span>
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-300 leading-snug max-w-2xl sm:max-w-3xl">
            Escribinos directamente para contarnos qué situación querés resolver.<br />Te orientamos sin costo en el diseño y arquitectura de la solución adecuada.
          </p>
        </div>

        {/* Formulario integrado en pantalla para redactar y enviar */}
        <div id="consulta-directa" className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl scroll-mt-24 sm:scroll-mt-28">
          <div className="max-w-2xl mb-3">
            <h3 className="text-lg font-bold text-white mb-0.5">
              Dejanos tu consulta directa
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Elegí el tema y el mensaje se escribe solo. Cambialo como quieras y elegí cómo enviarlo.
            </p>
          </div>

          {/* method="post" + noValidate: el envío es sólo por JS (validar() en cada botón). Con GET,
              si el JS fallara, nombre, e-mail y mensaje quedarían en la URL, el historial y los logs. */}
          <form method="post" noValidate onSubmit={handleSendFormEmail} className="space-y-5" data-sin-asistente>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contacto-nombre" className="block text-xs font-mono text-slate-300 mb-2">
                  Tu Nombre o Negocio <span className="text-rose-300">*</span>
                </label>
                <input
                  id="contacto-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="organization"
                  placeholder="Ej. Distribuidora Santa Fe / Carlos"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre: e.target.value });
                    if (errores.nombre) setErrores((er) => ({ ...er, nombre: undefined }));
                  }}
                  required
                  aria-invalid={errores.nombre ? true : undefined}
                  aria-describedby={errores.nombre ? 'contacto-nombre-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/90 border ${errores.nombre ? 'border-rose-500' : 'border-slate-800'} text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors`}
                />
                {errores.nombre && <p id="contacto-nombre-error" className="mt-1.5 text-xs text-rose-300">{errores.nombre}</p>}
              </div>

              <div>
                <label htmlFor="contacto-email" className="block text-xs font-mono text-slate-300 mb-2">
                  Tu e-mail de Contacto
                </label>
                <input
                  id="contacto-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@negocio.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errores.email) setErrores((er) => ({ ...er, email: undefined }));
                  }}
                  aria-invalid={errores.email ? true : undefined}
                  aria-describedby={errores.email ? 'contacto-email-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/90 border ${errores.email ? 'border-rose-500' : 'border-slate-800'} text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors`}
                />
                {errores.email && <p id="contacto-email-error" className="mt-1.5 text-xs text-rose-300">{errores.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contacto-tema" className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 mb-2">
                ¿Sobre qué querés consultar?
                {temaAuto && <span className="font-sans px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">Lo elegimos según tu mensaje</span>}
              </label>
              {/* Elegir el motivo con botones (más rápido que un desplegable largo): primero el tipo y después el tema. */}
              <div id="contacto-tema" role="group" aria-label="Motivo de la consulta" className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(grupos).map((g) => {
                    const activo = grupoAbierto === g || temaPorId(tema)?.grupo === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrupoAbierto((v) => (v === g ? null : g))}
                        aria-expanded={grupoAbierto === g}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${activo ? 'bg-cyan-400 text-slate-950 border-cyan-400' : 'bg-slate-950/80 border-slate-700 text-slate-200 hover:border-cyan-500/60'}`}
                      >
                        {g === 'Otros' ? 'Otras consultas' : g}
                      </button>
                    );
                  })}
                </div>
                {grupoAbierto && (
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    {grupos[grupoAbierto].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          elegirTema(t.id);
                          setGrupoAbierto(null);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${tema === t.id ? 'bg-cyan-400/15 border-cyan-400 text-cyan-200' : 'border-slate-700 text-slate-300 hover:border-cyan-500/60 hover:text-white'}`}
                      >
                        {t.etiqueta}
                      </button>
                    ))}
                  </div>
                )}
                {tema && !grupoAbierto && (
                  <p className="text-xs text-slate-400">
                    Elegiste: <b className="text-cyan-200">{temaPorId(tema)?.etiqueta}</b>{' '}
                    <button type="button" onClick={() => { setTema(''); setTemaAuto(false); }} className="ml-1 underline underline-offset-2 hover:text-white cursor-pointer">cambiar</button>
                  </p>
                )}
              </div>
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
                onChange={(e) => {
                  escribirMensaje(e.target.value);
                  if (errores.mensaje) setErrores((er) => ({ ...er, mensaje: undefined }));
                }}
                placeholder="Contanos qué situación o proceso necesitás resolver en tu negocio..."
                aria-invalid={errores.mensaje ? true : undefined}
                aria-describedby={errores.mensaje ? 'contacto-mensaje-error' : undefined}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/90 border ${errores.mensaje ? 'border-rose-500' : 'border-slate-800'} text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed`}
                required
              />
              {errores.mensaje && <p id="contacto-mensaje-error" className="mt-1.5 text-xs text-rose-300">{errores.mensaje}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSendFormWhatsApp}
                  className="px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Abre WhatsApp con tu nombre, e-mail y consulta pre-cargados"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendFormEmail}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Abre Gmail con tu nombre, e-mail y consulta pre-cargados"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Enviar por e-mail</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-slate-400">
              <span>O escribile directo a ventas:</span>
              <a
                href={mailtoLink(VENTAS_EMAIL, 'Consulta para ventas - tecnoros.ar', '')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 font-mono text-slate-300 hover:text-white transition-colors"
                title="Escribir un e-mail a ventas"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{VENTAS_EMAIL}</span>
              </a>
            </div>

          </form>
        </div>


      </div>
    </section>
  );
};
