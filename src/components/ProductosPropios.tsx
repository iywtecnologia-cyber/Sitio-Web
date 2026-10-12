import React, { useEffect, useRef, useState } from 'react';
import { FlaskConical, BellRing, PlayCircle } from 'lucide-react';
import { whatsappLink } from '../data/contact';
import { TeroLogo, CalandriaLogo } from './LogosProductos';

// Productos propios en desarrollo. Cuando tengan nombre y detalles definidos,
// se actualizan acá.
export const PRODUCTOS = [
  {
    id: 'software-ciberseguridad',
    icon: TeroLogo,
    title: 'TERO Security',
    resumen: 'Vigila la seguridad de tu empresa todos los días: detecta fallas y ataques, y responde.',
  },
  {
    id: 'calandria-automatizacion',
    icon: CalandriaLogo,
    title: 'Calandria Automatización',
    resumen: 'Aprende las tareas que repetís todos los días, te propone hacerlas y vos aprobás con un botón.',
  },
];

// Videos de Calandria funcionando dentro de dos sistemas a medida (datos ficticios).
const VIDEOS_CALANDRIA = [
  { src: '/calandria/calandria-kiosco.mp4', poster: '/calandria/calandria-kiosco.jpg', titulo: 'En un kiosco', detalle: 'Carga el pedido semanal que aprendió, baja el precio de lo que vence, arma el pedido a proveedores y los recordatorios de fiado.' },
  { src: '/calandria/calandria-salon-de-eventos.mp4', poster: '/calandria/calandria-salon-de-eventos.jpg', titulo: 'En un salón de eventos', detalle: 'Avisa los saldos pendientes, arma las tareas de la semana, carga los gastos fijos y cierra los eventos realizados.' },
];

const PALABRA = 'PRÓXIMAMENTE';
const SIGNOS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789#%&*';

// Efecto "decodificando": las letras se mezclan y se van acomodando hasta formar la palabra.
// Se dispara cada vez que cambia `disparo`.
const useDecodificar = (disparo: number) => {
  const [texto, setTexto] = useState(PALABRA);

  useEffect(() => {
    if (disparo === 0) return;
    const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducir) {
      setTexto(PALABRA);
      return;
    }
    let paso = 0;
    const total = 22;
    const id = window.setInterval(() => {
      paso += 1;
      const fijas = Math.floor((paso / total) * PALABRA.length);
      setTexto(
        PALABRA.split('')
          .map((letra, i) => (i < fijas ? letra : SIGNOS[Math.floor(Math.random() * SIGNOS.length)]))
          .join('')
      );
      if (paso >= total) {
        window.clearInterval(id);
        setTexto(PALABRA);
      }
    }, 45);
    return () => window.clearInterval(id);
  }, [disparo]);

  return texto;
};

// Cartel interactivo: se decodifica al aparecer en pantalla y cada vez que lo tocás o pasás el mouse.
const CartelProximamente: React.FC = () => {
  const [disparo, setDisparo] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  const texto = useDecodificar(disparo);
  const otraVez = () => setDisparo((n) => n + 1);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          otraVez();
          obs.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={otraVez}
      onMouseEnter={otraVez}
      aria-label="Próximamente. Estamos en fase de creación"
      className="group mb-6 w-full relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 via-slate-950 to-cyan-950/40 px-6 py-8 sm:py-10 text-center cursor-pointer hover:border-cyan-400/60 transition-colors"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <span aria-hidden="true" className="relative inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-violet-300">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full bg-violet-400 opacity-75 animate-ping motion-reduce:animate-none" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-violet-400" />
        </span>
        EN EL LABORATORIO
      </span>
      <span aria-hidden="true" className="relative block mt-3 font-mono text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.18em] sm:tracking-[0.25em] text-white group-hover:text-cyan-200 transition-colors">
        {texto}
      </span>
      <span aria-hidden="true" className="relative block mt-4 text-base sm:text-lg text-slate-300">
        Estamos en fase de creación<span className="inline-block w-[0.6ch] animate-pulse motion-reduce:animate-none">_</span>
      </span>
      <span aria-hidden="true" className="relative block mx-auto mt-5 h-1.5 w-48 sm:w-64 rounded-full bg-slate-800 overflow-hidden">
        <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-[creando_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <style>{'@keyframes creando{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}'}</style>
    </button>
  );
};

export const ProductosPropios: React.FC = () => (
  <section id="productos" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
    <div className="absolute -top-10 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300 mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>En nuestro laboratorio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Nuestros{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            productos propios
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
          Además de desarrollar a medida, estamos construyendo soluciones propias. Todavía están en proceso, pero podés anotarte para conocerlas antes que nadie.
        </p>
      </div>

      <CartelProximamente />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRODUCTOS.map(({ id, icon: Icon, title, resumen }) => (
          <div key={id} id={`producto-${id}`} className="scroll-mt-28 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex items-center gap-5">
            <Icon className="w-16 h-[74px] sm:w-20 sm:h-[92px] shrink-0 drop-shadow-[0_0_18px_rgba(34,211,238,0.25)]" />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{resumen}</p>
            </div>
          </div>
        ))}
      </div>


      <div id="calandria-en-accion" className="scroll-mt-28 mt-10 sm:mt-12">
        <div className="flex items-center gap-3 mb-2">
          <CalandriaLogo className="w-8 h-9 shrink-0" />
          <h3 className="text-xl sm:text-2xl font-bold text-white">Mirá a Calandria trabajando</h3>
        </div>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mb-6">
          Calandria propone las tareas que se repiten y vos las aprobás con un botón. Todo queda en un registro sellado, sin datos de tus clientes, y se ve cuánto tiempo te ahorró.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEOS_CALANDRIA.map((v) => (
            <figure key={v.src} className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <video controls playsInline preload="none" poster={v.poster} className="w-full aspect-video bg-black">
                <source src={v.src} type="video/mp4" />
              </video>
              <figcaption className="p-4 sm:p-5">
                <div className="flex items-center gap-2 text-white font-bold">
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  {v.titulo}
                </div>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{v.detalle}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Demo con datos ficticios. Calandria funciona dentro de los sistemas que desarrollamos a medida.</p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <a
          href={whatsappLink('Hola tecnoros.ar, quiero enterarme cuando lancen sus productos propios')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
        >
          <BellRing className="w-4 h-4" />
          Quiero ser de los primeros
        </a>
        <span className="text-sm text-slate-400">Te avisamos por WhatsApp cuando estén listos.</span>
      </div>
    </div>
  </section>
);
