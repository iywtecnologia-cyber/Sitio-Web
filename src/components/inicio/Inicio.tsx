import React from 'react';
import {
  ArrowRight, Workflow, Bot, ShieldCheck, Code2, Cpu, Search, Box, Rocket, Wrench, MessageCircle,
} from 'lucide-react';
import { GolondrinaLogo, TeroLogo } from '../LogosProductos';
import { FOUNDERS } from '../AboutSection';
import { irA, navegar } from '../../rutas';
import { whatsappLink } from '../../data/contact';

// Inicio corto: cada bloque dice una sola cosa y tiene un botón que lleva al detalle.
// Lo pesado (simuladores, 3D, presupuestador, tecnologías) vive en su propia página.

const Titulo: React.FC<{ chip: string; titulo: string; bajada?: string }> = ({ chip, titulo, bajada }) => (
  <div className="mb-6 sm:mb-8">
    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">{chip}</span>
    <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{titulo}</h2>
    {bajada && <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">{bajada}</p>}
  </div>
);

const VerMas: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 cursor-pointer group"
  >
    {children}
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </button>
);

/* ── 1. Hero ───────────────────────────────────────────────────────────── */
export const HeroCorto: React.FC = () => (
  <section id="inicio" className="relative pt-28 pb-12 sm:pt-36 sm:pb-20 overflow-hidden">
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-violet-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />
    <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
      <span className="inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-5">
        Rosario · Soluciones a tu medida
      </span>
      <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
        Todo para tu negocio
        <br />
        que crece <span className="animate-text-light-sweep">con vos</span>
      </h1>
      <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-xl">
        Automatizamos lo que te roba horas, cuidamos tu información y hacemos el software que te falta.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => navegar('/presupuesto')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-xl shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          Pedí presupuesto <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => irA('productos-inicio')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-white bg-slate-900/90 border border-slate-700 hover:border-slate-500 rounded-xl cursor-pointer"
        >
          Ver demos <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
      <a href="#arrepentimiento" className="mt-6 inline-block text-xs text-slate-400 hover:text-cyan-300 underline underline-offset-4">
        Botón de arrepentimiento
      </a>
    </div>
  </section>
);

/* ── 2. Qué hacemos ────────────────────────────────────────────────────── */
const SERVICIOS_CORTOS = [
  { icon: Workflow, titulo: 'Automatización', linea: 'Lo que hacés a mano, que se haga solo.', ir: 'servicio-automatizacion' },
  { icon: Bot, titulo: 'Robótica', linea: 'Tu robot primero en 3D, después real.', ir: 'robotica-3d' },
  { icon: ShieldCheck, titulo: 'Ciberseguridad', linea: 'Tus datos y tus equipos, protegidos.', ir: 'servicio-ciberseguridad' },
  { icon: Code2, titulo: 'Software', linea: 'Sistemas, webs y bots a tu medida.', ir: 'servicio-software' },
];

export const QueHacemos: React.FC = () => (
  <section id="que-hacemos" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Qué hacemos" titulo="Cuatro cosas, bien hechas" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {SERVICIOS_CORTOS.map(({ icon: Icon, titulo, linea, ir }) => (
          <button
            key={titulo}
            type="button"
            onClick={() => irA(ir, true)}
            className="text-left p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer group"
          >
            <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3">
              <Icon className="w-5 h-5" />
            </span>
            <span className="block font-bold text-white">{titulo}</span>
            <span className="block mt-1 text-xs sm:text-sm text-slate-400 leading-snug">{linea}</span>
          </button>
        ))}
      </div>
      <VerMas onClick={() => navegar('/servicios')}>Ver todos los servicios</VerMas>
    </div>
  </section>
);

/* ── 3. Productos (carrusel en celular) ────────────────────────────────── */
const PRODUCTOS_CORTOS: { logo: React.ElementType; nombre: string; linea: string; boton: string; ir: string; estado: string; color: string }[] = [
  { logo: GolondrinaLogo, nombre: 'Golondrina', linea: 'Mira tu planta y te avisa por WhatsApp. Lo resolvés con 1 clic.', boton: 'Probar el simulador', ir: 'aplicaciones-golondrina', estado: 'Disponible', color: 'emerald' },
  { logo: GolondrinaLogo, nombre: 'Golondrina Personal', linea: 'Le decís qué avisarte, por voz o texto. Sin aprender nada.', boton: 'Probar la demo', ir: 'golondrina-personal-demo', estado: 'Disponible', color: 'emerald' },
  { logo: Cpu, nombre: 'CHAJÁ', linea: 'Un equipo chiquito que cuida tu empresa y te avisa con 1 clic.', boton: 'Verlo en 3D', ir: 'hardware-studio-3d', estado: 'A demanda', color: 'cyan' },
  { logo: TeroLogo, nombre: 'TERO Security', linea: 'Ciberseguridad para pymes, en desarrollo.', boton: 'Avisame cuando salga', ir: 'producto-software-ciberseguridad', estado: 'Próximamente', color: 'violet' },
];

const CHIP: Record<string, string> = {
  emerald: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  cyan: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  violet: 'text-violet-300 border-violet-500/40 bg-violet-500/10',
};

export const ProductosInicio: React.FC = () => (
  <section id="productos-inicio" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Productos propios" titulo="Probalos acá mismo" bajada="Deslizá para ver cada uno." />
    </div>
    {/* En celular se desliza de costado; en compu se ven los cuatro */}
    <div className="max-w-7xl mx-auto lg:px-12">
      <ul className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory px-5 sm:px-8 lg:px-0 pb-3 no-scrollbar">
        {PRODUCTOS_CORTOS.map(({ logo: Logo, nombre, linea, boton, ir, estado, color }) => (
          <li key={nombre} className="snap-start shrink-0 w-[80%] sm:w-[45%] lg:w-auto">
            <div className="h-full p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-300">
                  <Logo className="w-7 h-7" />
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${CHIP[color]}`}>{estado}</span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-white">{nombre}</h3>
              <p className="mt-1 text-sm text-slate-400 leading-snug flex-1">{linea}</p>
              <button
                type="button"
                onClick={() => irA(ir, true)}
                className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-sm font-bold hover:bg-cyan-400/20 cursor-pointer"
              >
                {boton} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 sm:px-8 lg:px-0">
        <VerMas onClick={() => navegar('/productos')}>Ver precios y todos los detalles</VerMas>
      </div>
    </div>
  </section>
);

/* ── 5. Cómo trabajamos ───────────────────────────────────────────────── */
const PASOS = [
  { icon: Search, titulo: 'Diagnóstico', linea: 'Sin costo' },
  { icon: Box, titulo: 'Prototipo', linea: 'Lo ves antes de pagar' },
  { icon: Wrench, titulo: 'Desarrollo', linea: 'Probado a fondo' },
  { icon: Rocket, titulo: 'Puesta en marcha', linea: 'Y soporte después' },
];

export const ComoTrabajamosCorto: React.FC = () => (
  <section id="como-trabajamos" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Cómo trabajamos" titulo="De tu problema a la solución, en 4 pasos" />
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {PASOS.map(({ icon: Icon, titulo, linea }, i) => (
          <li key={titulo} className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-slate-500">0{i + 1}</span>
            </div>
            <span className="block mt-3 font-bold text-white">{titulo}</span>
            <span className="block text-xs sm:text-sm text-slate-400">{linea}</span>
          </li>
        ))}
      </ol>
      <VerMas onClick={() => irA('proceso-completo')}>Ver el proceso completo</VerMas>
    </div>
  </section>
);

/* ── 6. Equipo ────────────────────────────────────────────────────────── */
export const EquipoCorto: React.FC = () => (
  <section id="equipo" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Equipo" titulo="Somos de Rosario" />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FOUNDERS.map((f) => (
          <li key={f.name} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-white truncate">{f.name}</span>
              <span className="block text-xs text-slate-400 truncate">{f.badge}</span>
            </span>
          </li>
        ))}
      </ul>
      <VerMas onClick={() => navegar('/nosotros')}>Conocé nuestra historia</VerMas>
    </div>
  </section>
);

/* ── Cierre de cada página interna ────────────────────────────────────── */
export const CierrePagina: React.FC = () => (
  <section className="py-12 sm:py-16 border-t border-slate-800/50">
    <div className="max-w-3xl mx-auto px-5 text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">¿Lo querés para tu negocio?</h2>
      <p className="mt-2 text-sm sm:text-base text-slate-400">Contanos qué necesitás y te respondemos en el día.</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappLink('Hola tecnoros.ar, quiero consultar por una solución para mi negocio.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-bold"
        >
          <MessageCircle className="w-4 h-4" /> Escribinos por WhatsApp
        </a>
        <button
          type="button"
          onClick={() => irA('contacto')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold cursor-pointer"
        >
          Otras formas de contacto
        </button>
      </div>
    </div>
  </section>
);

