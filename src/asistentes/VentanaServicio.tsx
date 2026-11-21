// Ventana con la información de un servicio: se abre al elegirlo (desde el asistente o la lista),
// así se ve completo en el centro de la pantalla sin importar dónde esté su tarjeta en la página.
import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, MessageCircle, X } from 'lucide-react';
import { irA } from '../rutas';
import { esperar } from './manos';
import { SERVICES } from '../components/ServicesSection';
import { SERVICIOS_SOFTWARE } from '../data/precios';
import { whatsappLink } from '../data/contact';
import { ID_PRECIO, pedirA } from './funciones';
import { EV_VER_SERVICIO, mensajeDeAsistente } from './eventos';

/** Lleva a la tarjeta del servicio, la ilumina un rato y el asistente de Servicios ofrece «Volver». */
const verEnLaWeb = (id: string, nombre: string) => {
  irA(`servicio-${id}`, false, 'center');
  void esperar(`#servicio-${id}`).then((el) => {
    if (!el) return;
    el.classList.add('asistente-senalado');
    window.setTimeout(() => el.classList.remove('asistente-senalado'), 4000);
  });
  mensajeDeAsistente('servicios', `Te marqué **${nombre}** en la página.`, [
    { texto: '← Volver a los servicios', alHacer: () => pedirA('servicios', 'ver-servicios', {}, 'Ver todos los servicios') },
  ]);
};


const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

export const VentanaServicio: React.FC = () => {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const abrir = (e: Event) => setId((e as CustomEvent<string>).detail);
    window.addEventListener(EV_VER_SERVICIO, abrir);
    return () => window.removeEventListener(EV_VER_SERVICIO, abrir);
  }, []);
  useEffect(() => {
    if (!id) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setId(null);
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [id]);

  const s = SERVICES.find((x) => x.id === id);
  if (!s) return null;
  const Icon = s.icon;
  const precio = SERVICIOS_SOFTWARE.find((p) => p.id === (ID_PRECIO[s.id] ?? s.id));
  const nombre = s.title.split(':')[0];

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={nombre}>
      <button type="button" aria-label="Cerrar" onClick={() => setId(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-3xl bg-[#0B1120] border border-cyan-500/40 shadow-2xl shadow-black/60 p-5 sm:p-6">
        <button type="button" onClick={() => setId(null)} aria-label="Cerrar" className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pr-8">
          <span className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
            <Icon className="w-6 h-6" />
          </span>
          <div>
            <span className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${s.badgeColor}`}>{s.badge}</span>
            <h2 className="mt-1 text-xl font-extrabold text-white leading-tight">{s.title}</h2>
          </div>
        </div>
        <p className="mt-4 text-base text-slate-300">{s.description}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {s.bullets.map((b) => (
            <li key={b} className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">{b}</li>
          ))}
        </ul>
        {precio && (
          <p className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300">
            Precio de referencia: <b className="text-white">{precio.max ? `${pesos(precio.min)} a ${pesos(precio.max)}` : 'gratis'}</b>
            {/* En el diagnóstico (que es gratis) no tiene sentido decir que el precio se confirma en el diagnóstico. */}
            {s.id !== 'analisis-qa' && '. El precio final se confirma en el diagnóstico inicial gratuito.'}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setId(null);
              pedirA('presupuesto', 'calcular-presupuesto', { pedido: nombre }, `¿Cuánto sale ${nombre}?`);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-sm font-bold hover:bg-cyan-300 cursor-pointer"
          >
            ¿Cuánto sale? <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={whatsappLink(`Hola tecnoros.ar, quiero consultar por ${nombre}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold hover:border-cyan-500/50"
          >
            <MessageCircle className="w-4 h-4" /> Consultar
          </a>
          <button
            type="button"
            onClick={() => {
              setId(null);
              verEnLaWeb(s.id, nombre);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold hover:border-cyan-500/50 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Ver en la web
          </button>
        </div>
      </div>
    </div>
  );
};
