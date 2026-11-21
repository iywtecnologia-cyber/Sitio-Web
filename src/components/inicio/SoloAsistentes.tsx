// Web manejada por asistentes: no hay menú ni páginas para recorrer.
// Arriba: el logo y Soporte técnico. Al entrar se ven los asistentes 3D (con el chat) y solo quedan a la vista: Diseñá tu robot,
// los videos de los productos, Cómo trabajamos, TERO (próximamente), las fotos y el mapa.
// Todo lo demás (servicios, presupuesto, productos, proyectos, equipo, contacto, soporte) lo
// manejan los asistentes: te preguntan y te abren la pantalla justa cuando hace falta.
import React, { Suspense, lazy } from 'react';
import { propsVideo } from '../../videos';
import { ArrowLeft, ArrowRight, Headphones, Menu, PlayCircle, Unlock } from 'lucide-react';
import { EVENTO_SECCIONES } from './ListaSecciones';
import { TecnorosLogo } from '../TecnorosLogo';
import { BotonesRedes } from '../Redes';
import { abrirSoporte, irA, navegar, useRuta } from '../../rutas';
import { abrirAsistente } from '../../asistentes/eventos';
import { HowWeWorkSection } from '../HowWeWorkSection';
import { MundoEquipo } from '../MundoEquipo';
import { CartelProximamente } from '../ProductosPropios';

const RobotStudioSection = lazy(() => import('../robotics/RobotStudioSection').then((m) => ({ default: m.RobotStudioSection })));

/** Cabecera mínima: el logo y Soporte técnico (para clientes). */
export const CabeceraSimple: React.FC = () => {
  const ruta = useRuta();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#070A12]/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="w-full max-w-[1300px] mx-auto px-2 min-[400px]:px-3 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-1.5 min-[400px]:gap-3">
        <div className="flex items-center gap-1 min-[400px]:gap-1.5 sm:gap-2 min-w-0">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_SECCIONES))}
          aria-label="Ver secciones"
          className="lg:hidden p-1.5 min-[400px]:p-2 rounded-xl text-slate-200 border border-slate-700 hover:border-cyan-400 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navegar('/');
          }}
          className="flex items-center gap-1.5 min-[400px]:gap-2.5 sm:gap-3 min-w-0"
        >
          <TecnorosLogo className="w-7 h-7 min-[400px]:w-9 min-[400px]:h-9 sm:w-11 sm:h-11 shrink-0 drop-shadow-[0_0_14px_rgba(0,210,243,0.4)]" />
          <span className="text-[15px] min-[400px]:text-lg sm:text-2xl font-black tracking-tight text-white leading-none">
            tecnoros<span className="text-[#00D2F3]">.ar</span>
          </span>
        </a>
        </div>
        <div className="flex items-center gap-1 min-[400px]:gap-1.5 sm:gap-2 shrink-0">
          {ruta !== '/' && (
            <button
              type="button"
              onClick={() => {
                // «Volver al inicio» lleva al principio: «De Rosario para todo el mundo».
                navegar('/');
              }}
              aria-label="Volver al inicio"
              className="hidden sm:inline-flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver al inicio</span>
            </button>
          )}
          {/* Sin permanencia, a la izquierda de Soporte técnico */}
          {/* En celus angostos el texto va en dos renglones para que siempre se lea «Sin permanencia». */}
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-sm font-semibold">
            <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />{' '}
            <span className="whitespace-nowrap max-[399px]:whitespace-normal max-[399px]:w-[4.6rem] max-[399px]:text-[10.5px] max-[399px]:leading-[1.1] max-[399px]:text-center">Sin permanencia</span>
          </span>
          {/* Lo que estaba antes en Contacto → Soporte técnico: abre el panel de soporte para clientes */}
          <button
            type="button"
            onClick={abrirSoporte}
            aria-label="Soporte técnico"
            className="inline-flex items-center gap-1.5 px-2 min-[400px]:px-2.5 sm:px-4 py-2 rounded-xl border border-emerald-400/50 bg-emerald-400/10 text-emerald-300 text-sm font-bold hover:bg-emerald-400/20 cursor-pointer"
          >
            <Headphones className="w-4 h-4" /> <span className="hidden sm:inline">Soporte técnico</span>
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
        <button type="button" onClick={abrirSoporte} className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 py-1 cursor-pointer">
          Soporte técnico
        </button>
        <a href="/contrato-de-servicios.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Contrato de servicios</a>
        <a href="/politica-de-privacidad.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Política de privacidad</a>
      </div>
      {/* Todo el pie centrado sobre el mismo eje: links, Instagram/LinkedIn y © */}
      <div className="self-center">
        <BotonesRedes />
      </div>
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
      <Titulo etiqueta="Videos" titulo="Nuestros productos funcionando" texto="Recorridos reales con datos ficticios." />
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VIDEOS.map((v) => (
          <li key={v.src} className="rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800">
            <video src={v.src} poster={v.poster} {...propsVideo} className="w-full aspect-[16/10] bg-slate-950 block">
              Tu navegador no puede reproducir el video.
            </video>
            <div className="p-4">
              <p className="flex items-center gap-1.5 font-bold text-white"><PlayCircle className="w-4 h-4 text-cyan-400" /> {v.titulo}</p>
              <p className="mt-1 text-sm text-slate-400">{v.linea}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="button"
          // Lleva al formulario de contacto (no al asistente).
          onClick={() => irA('consulta-directa', false, 'start')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          Contactanos por tu necesidad o software a medida <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-3 text-sm text-emerald-300 font-semibold">El diagnóstico inicial es gratuito.</p>
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
    <section id="mapa-equipo" className="scroll-mt-24 py-14 sm:py-20 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Titulo etiqueta="Desde dónde trabajamos" titulo="Nacimos en Rosario, trabajamos para todo el mundo" />
        <MundoEquipo />
      </div>
    </section>
  </>
);
