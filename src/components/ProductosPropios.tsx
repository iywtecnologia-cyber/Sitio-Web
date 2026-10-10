import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, FlaskConical, Workflow, BellRing } from 'lucide-react';
import { whatsappLink } from '../data/contact';

// Productos propios en desarrollo. Cuando tengan nombre y detalles definidos,
// se actualizan acá.
export const PRODUCTOS = [
  {
    id: 'software-ciberseguridad',
    icon: ShieldCheck,
    title: 'Software propio de ciberseguridad',
  },
  {
    id: 'plataforma-automatizacion',
    icon: Workflow,
    title: 'Plataforma integral de automatización',
  },
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
      className="group mt-6 w-full relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 via-slate-950 to-cyan-950/40 px-6 py-8 sm:py-10 text-center cursor-pointer hover:border-cyan-400/60 transition-colors"
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
          Estamos creando{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            nuestros propios productos
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
          Además de desarrollar a medida, estamos construyendo soluciones propias. Todavía están en proceso, pero podés anotarte para conocerlas antes que nadie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRODUCTOS.map(({ id, icon: Icon, title }) => (
          <div key={id} id={`producto-${id}`} className="scroll-mt-28 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          </div>
        ))}
      </div>

      <CartelProximamente />

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
