// Web manejada por asistentes: no hay menú ni páginas para recorrer.
// Arriba: el logo y Soporte técnico. Al entrar se ven los asistentes 3D (con el chat) y solo quedan a la vista: Diseñá tu robot,
// los videos de los productos, Cómo trabajamos, TERO (próximamente), las fotos y el mapa.
// Todo lo demás (servicios, presupuesto, productos, proyectos, equipo, contacto, soporte) lo
// manejan los asistentes: te preguntan y te abren la pantalla justa cuando hace falta.
import React, { Suspense, lazy } from 'react';
import { ArrowLeft, Headphones, PlayCircle } from 'lucide-react';
import { TecnorosLogo } from '../TecnorosLogo';
import { BotonesRedes } from '../Redes';
import { abrirSoporte, navegar, useRuta } from '../../rutas';
import { abrirAsistente } from '../../asistentes/eventos';
import { HowWeWorkSection } from '../HowWeWorkSection';
import { Encuentros } from '../extra/Encuentros';
import { MundoEquipo } from '../MundoEquipo';
import { CartelProximamente } from '../ProductosPropios';

const RobotStudioSection = lazy(() => import('../robotics/RobotStudioSection').then((m) => ({ default: m.RobotStudioSection })));

/** Cabecera mínima: el logo y Soporte técnico (para clientes). */
export const CabeceraSimple: React.FC = () => {
  const ruta = useRuta();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#070A12]/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navegar('/');
          }}
          className="flex items-center gap-2.5 sm:gap-3"
        >
          <TecnorosLogo className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_0_14px_rgba(0,210,243,0.4)]" />
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
            tecnoros<span className="text-[#00D2F3]">.ar</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          {ruta !== '/' && (
            <button
              type="button"
              onClick={() => navegar('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a los asistentes
            </button>
          )}
          {/* Lo que estaba antes en Contacto → Soporte técnico: abre el panel de soporte para clientes */}
          <button
            type="button"
            onClick={abrirSoporte}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-emerald-400/50 bg-emerald-400/10 text-emerald-300 text-sm font-bold hover:bg-emerald-400/20 cursor-pointer"
          >
            <Headphones className="w-4 h-4" /> Soporte técnico
          </button>
        </div>
      </div>
    </header>
  );
};

/** Pie: solo lo obligatorio (arrepentimiento, contrato, privacidad) y las redes. */
export const PieSimple: React.FC = () => (
  <footer className="bg-[#05070D]/85 border-t border-slate-800/80 text-slate-400 text-xs pt-10 pb-28 sm:pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px]">
        <a href="#arrepentimiento" className="inline-flex items-center px-3 py-1.5 rounded-lg border border-cyan-500/50 text-cyan-300 font-semibold hover:bg-cyan-500/10">
          Botón de arrepentimiento
        </a>
        <button type="button" onClick={() => abrirAsistente('soporte')} className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 py-1 cursor-pointer">
          Soporte técnico
        </button>
        <a href="/contrato-de-servicios.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Contrato de servicios</a>
        <a href="/politica-de-privacidad.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Política de privacidad</a>
      </div>
      <BotonesRedes />
      <span className="font-mono text-slate-500 text-center">
        © {new Date().getFullYear()} tecnoros<span className="text-cyan-400">.ar</span> · Todos los derechos reservados
      </span>
    </div>
  </footer>
);

const VIDEOS = [
  { src: '/proyectos/demo-mostrador.mp4', poster: '/proyectos/demo-mostrador.jpg', titulo: 'Mostrador', linea: 'Chatbot con IA que atiende a tus clientes 24/7.' },
  { src: '/proyectos/demo-agenda-consultorio-1min.mp4', poster: '/proyectos/demo-agenda-consultorio.jpg', titulo: 'Agenda de consultorio', linea: 'Fichas, obra social y contacto directo con cada paciente.' },
];

const Titulo: React.FC<{ etiqueta: string; titulo: string; texto?: string }> = ({ etiqueta, titulo, texto }) => (
  <div className="mb-6">
    <span className="text-xs sm:text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">{etiqueta}</span>
    <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{titulo}</h2>
    {texto && <p className="mt-2 max-w-2xl text-base text-slate-400">{texto}</p>}
  </div>
);

/** Videos de los productos (con datos ficticios). */
export const VideosProductos: React.FC = () => (
  <section id="videos-productos" className="scroll-mt-24 py-14 sm:py-20 border-t border-slate-800/50">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo etiqueta="Videos" titulo="Nuestros productos funcionando" texto="Recorridos reales con datos ficticios. Si querés uno para tu negocio, decíselo a un asistente." />
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VIDEOS.map((v) => (
          <li key={v.src} className="rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800">
            <video src={v.src} poster={v.poster} controls preload="none" playsInline className="w-full aspect-[16/10] bg-slate-950 block">
              Tu navegador no puede reproducir el video.
            </video>
            <div className="p-4">
              <p className="flex items-center gap-1.5 font-bold text-white"><PlayCircle className="w-4 h-4 text-cyan-400" /> {v.titulo}</p>
              <p className="mt-1 text-sm text-slate-400">{v.linea}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/** El inicio: asistentes arriba (HeroCorto) y debajo solo lo que queda a la vista. */
export const InicioSoloAsistentes: React.FC = () => (
  <>
    <Suspense fallback={<div className="h-[60vh]" />}>
      <RobotStudioSection />
    </Suspense>
    <VideosProductos />
    <HowWeWorkSection />
    <section className="py-14 sm:py-16 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div id="tero-inicio" className="scroll-mt-24">
          <CartelProximamente />
        </div>
      </div>
    </section>
    <div className="border-t border-slate-800/50">
      <Encuentros />
    </div>
    <section id="mapa-equipo" className="scroll-mt-24 py-14 sm:py-20 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Titulo etiqueta="Desde dónde trabajamos" titulo="Nacimos en Rosario, trabajamos para todo el mundo" />
        <MundoEquipo />
      </div>
    </section>
  </>
);
