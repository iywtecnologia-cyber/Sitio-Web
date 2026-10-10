import React, { useEffect, useState } from 'react';
import { ShieldCheck, FlaskConical, Workflow, BellRing, Lock, Sparkles, RotateCcw, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../data/contact';

// Productos propios en desarrollo. Cuando tengan nombre y detalles definidos,
// se actualizan acá. La "pista" es lo único que se adelanta.
export const PRODUCTOS = [
  {
    id: 'software-ciberseguridad',
    icon: ShieldCheck,
    title: 'Software propio de ciberseguridad',
    pista: 'Va a cuidar tu negocio incluso mientras dormís.',
    mensaje: 'Hola tecnoros.ar, quiero enterarme cuando lancen su software propio de ciberseguridad',
  },
  {
    id: 'plataforma-automatizacion',
    icon: Workflow,
    title: 'Plataforma integral de automatización',
    pista: 'Todo tu negocio conectado, sin pasar datos a mano.',
    mensaje: 'Hola tecnoros.ar, quiero enterarme cuando lancen su plataforma integral de automatización',
  },
];

const PALABRA = 'PRÓXIMAMENTE';
const SIGNOS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789#%&*';

// Efecto "decodificando": las letras se mezclan y se van acomodando hasta formar la palabra.
const useDecodificar = (activo: boolean) => {
  const [texto, setTexto] = useState(PALABRA);

  useEffect(() => {
    if (!activo) return;
    const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducir) {
      setTexto(PALABRA);
      return;
    }
    let paso = 0;
    const total = 18;
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
  }, [activo]);

  return texto;
};

const cara: React.CSSProperties = {
  gridArea: '1 / 1',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

const TarjetaProximamente: React.FC<(typeof PRODUCTOS)[number]> = ({ id, icon: Icon, title, pista, mensaje }) => {
  const [girada, setGirada] = useState(false);
  const texto = useDecodificar(girada);

  return (
    <div id={`producto-${id}`} className="scroll-mt-28 rounded-2xl" style={{ perspective: '1200px' }}>
      <div
        className="grid transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transformStyle: 'preserve-3d', transform: girada ? 'rotateY(180deg)' : 'none' }}
      >
        {/* Frente */}
        <div
          style={cara}
          aria-hidden={girada}
          className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex flex-col gap-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
              <Icon className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/40 bg-violet-950/40 text-[11px] font-mono font-semibold tracking-widest text-violet-200">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-violet-400 opacity-75 animate-ping motion-reduce:animate-none" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-violet-400" />
              </span>
              PRÓXIMAMENTE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={() => setGirada(true)}
            tabIndex={girada ? -1 : 0}
            className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 text-sm font-semibold transition-colors cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Descubrí una pista
          </button>
        </div>

        {/* Dorso */}
        <div
          style={{ ...cara, transform: 'rotateY(180deg)' }}
          aria-hidden={!girada}
          className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-violet-950/60 via-slate-950 to-cyan-950/40 border border-violet-500/40 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-violet-300">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-mono tracking-widest">ACCESO ANTICIPADO</span>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white" aria-label="Próximamente">
            {texto}
          </p>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">{pista}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <a
              href={whatsappLink(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={girada ? 0 : -1}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 text-sm font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Avisame cuando salga
            </a>
            <button
              type="button"
              onClick={() => setGirada(false)}
              tabIndex={girada ? 0 : -1}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
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
        {PRODUCTOS.map((p) => (
          <TarjetaProximamente key={p.id} {...p} />
        ))}
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
