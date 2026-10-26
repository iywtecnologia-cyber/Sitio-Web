import React from 'react';
import {
  ArrowRight, Target, Globe, ExternalLink, Flag, Instagram, Linkedin, Workflow, Bot, ShieldCheck, Code2, Cpu, MessageCircle, Mail, Layers, Boxes, FolderKanban, Calculator, Users, ChevronRight,
} from 'lucide-react';
import { GolondrinaLogo, TeroLogo } from '../LogosProductos';
import { FOUNDERS } from '../AboutSection';
import { irA, navegar } from '../../rutas';
import { elegirEquipo3D, type Equipo3D } from '../../equipo3d';
import { whatsappLink, gmailLink, VENTAS_EMAIL, REDES } from '../../data/contact';
import type { Ruta } from '../../rutas';

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
      <h1 className="text-[2rem] sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
        Todo para tu negocio que <span className="whitespace-nowrap">crece <span className="animate-text-light-sweep">con vos</span></span>
      </h1>
      <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-xl">
        Somos un equipo de Rosario: automatizamos tareas, cuidamos tu información y creamos el software y los robots que tu negocio necesita.
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

/* ── JAR 2026: bien visible en celular y compu ─────────────────────────── */
export const JarDestacado: React.FC = () => (
  <section id="jar-2026" className="scroll-mt-24 px-5 sm:px-8 lg:px-12">
    <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl border border-violet-400/50 bg-gradient-to-br from-violet-950/70 via-slate-900 to-cyan-950/50 p-5 sm:p-8 lg:p-10 shadow-2xl shadow-violet-900/30">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
        <span className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-violet-500/20 border border-violet-400/50 items-center justify-center text-violet-200 shrink-0">
          <Flag className="w-7 h-7 sm:w-8 sm:h-8" />
        </span>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-400/50 text-xs sm:text-sm font-semibold text-violet-200">
            <span aria-hidden="true">🏁</span> Rumbo al Challenge JAR 2026
          </span>
          <span className="block mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-violet-300">Rosario · 3 al 6 de noviembre</span>
          <h2 className="mt-1.5 text-xl sm:text-3xl font-extrabold text-white leading-tight">
            Estamos desarrollando nuestro robot autónomo para participar
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
            Lo estamos diseñando y programando en Rosario. Seguí el avance en nuestras redes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <a
            href="https://airclub-udesa.github.io/jar_site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-400 text-slate-950 font-bold hover:bg-violet-300"
          >
            Sobre el torneo <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={REDES.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-950/60 border border-violet-400/40 text-violet-100 font-semibold hover:border-violet-300"
          >
            <Instagram className="w-4 h-4" /> Seguí el avance
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ── 2. Qué hacemos ────────────────────────────────────────────────────── */
const SERVICIOS_CORTOS: { icon: React.ElementType; titulo: string; linea: string; ir: string }[] = [
  { icon: Target, titulo: 'Diagnóstico gratuito', linea: 'Entendemos tu problema antes de programar.', ir: 'servicio-analisis-qa' },
  { icon: Workflow, titulo: 'Automatización', linea: 'Lo que hacés a mano, que se haga solo.', ir: 'servicio-automatizacion' },
  { icon: ShieldCheck, titulo: 'Ciberseguridad', linea: 'Tus datos y tus equipos, protegidos.', ir: 'servicio-ciberseguridad' },
  { icon: Code2, titulo: 'Software', linea: 'Sistemas a medida para tu negocio.', ir: 'servicio-software' },
  { icon: Globe, titulo: 'Páginas web', linea: 'Webs que trabajan por vos.', ir: 'servicio-paginas-web' },
  { icon: Bot, titulo: 'Asistentes', linea: 'Un asistente en tu web o sistema.', ir: 'servicio-asistentes' },
  { icon: MessageCircle, titulo: 'Bots de WhatsApp', linea: 'Tu WhatsApp responde solo, a toda hora.', ir: 'servicio-bots-whatsapp' },
  { icon: Cpu, titulo: 'Robótica', linea: 'Tu robot primero en 3D, después real.', ir: 'robotica-3d' },
];

export const QueHacemos: React.FC = () => (
  <section id="que-hacemos" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Qué hacemos" titulo="Lo que ofrecemos" bajada="Tocá lo que te interese para ver el detalle." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {SERVICIOS_CORTOS.map(({ icon: Icon, titulo, linea, ir }) => (
          <button
            key={titulo}
            type="button"
            onClick={() => irA(ir, true)}
            className="flex flex-col items-start justify-start text-left p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer group"
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
const PRODUCTOS_CORTOS: { logo: React.ElementType; nombre: string; linea: string; boton: string; ir: string; equipo?: Equipo3D; estado: string; color: string }[] = [
  { logo: GolondrinaLogo, nombre: 'Golondrina Automatización', linea: 'Vigila tus máquinas y te avisa por WhatsApp si algo falla. Lo resolvés con 1 clic.', boton: 'Verlo en 3D', ir: 'hardware-studio-3d', equipo: 'golondrina', estado: 'Disponible', color: 'emerald' },
  { logo: GolondrinaLogo, nombre: 'Golondrina Personal', linea: 'Le decís qué avisarte, por voz o texto. Sin aprender nada.', boton: 'Probar la demo', ir: 'golondrina-personal-demo', estado: 'Disponible', color: 'emerald' },
  { logo: Cpu, nombre: 'CHAJÁ', linea: 'Un equipo chiquito que cuida tu red y tus equipos, y te avisa si algo cambia.', boton: 'Verlo en 3D', ir: 'hardware-studio-3d', equipo: 'colibri', estado: 'A demanda', color: 'cyan' },
  { logo: TeroLogo, nombre: 'TERO Security', linea: 'Ciberseguridad para pymes, en desarrollo.', boton: 'Mantenete informado', ir: 'producto-software-ciberseguridad', estado: 'Próximamente', color: 'violet' },
];

const CHIP: Record<string, string> = {
  emerald: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  cyan: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  violet: 'text-violet-300 border-violet-500/40 bg-violet-500/10',
};

export const ProductosInicio: React.FC = () => (
  <section id="productos-inicio" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Productos propios" titulo="Nuestros productos" bajada="Deslizá para ver cada uno y probalo." />
    </div>
    {/* En celular se desliza de costado; en compu se ven los cuatro */}
    <div className="max-w-7xl mx-auto lg:px-12">
      <ul className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory px-5 sm:px-8 lg:px-0 pb-3 no-scrollbar">
        {PRODUCTOS_CORTOS.map(({ logo: Logo, nombre, linea, boton, ir, equipo, estado, color }) => (
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
                onClick={() => { if (equipo) elegirEquipo3D(equipo); irA(ir, true); }}
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

// "María Sofía Genta" → "Sofía Genta", "Esteban José Menin" → "Esteban Menin"
const nombreCorto = (n: string) => {
  const p = n.split(' ');
  if (p.length <= 2) return n;
  return n.startsWith('María') ? `${p[1]} ${p[2]}` : `${p[0]} ${p[p.length - 1]}`;
};

/* ── 4. Quiénes somos ────────────────────────────────────────────────── */
export const EquipoCorto: React.FC = () => (
  <section id="equipo" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo
        chip="Quiénes somos"
        titulo="Un equipo de Rosario"
        bajada="Ciberseguridad, QA, automatización, electrónica y machine learning, en un mismo equipo."
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FOUNDERS.map((f) => (
          <li key={f.name} className="min-w-0">
            <a
              href={f.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title={`LinkedIn de ${f.name}`}
              className="h-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-[#0A66C2]/60 transition-colors min-w-0 group"
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700 flex items-center justify-center text-xs sm:text-sm font-bold text-white shrink-0">
                {f.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white leading-tight group-hover:text-cyan-200">{f.name}</span>
                <span className="block text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">{f.badge}</span>
              </span>
              <Linkedin className="w-4 h-4 text-[#4DA3FF] shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ── 5. ¿Querés saber más? ─────────────────────────────────────────────── */
const SECCIONES: { icon: React.ElementType; titulo: string; linea: string; ruta: Ruta }[] = [
  { icon: Layers, titulo: 'Servicios', linea: 'Todo lo que hacemos y cómo trabajamos', ruta: '/servicios' },
  { icon: Boxes, titulo: 'Productos y demos', linea: 'Simuladores, equipos en 3D y precios', ruta: '/productos' },
  { icon: Bot, titulo: 'Diseñá tu robot', linea: 'Armalo y probalo en 3D, en la pantalla', ruta: '/robotica' },
  { icon: FolderKanban, titulo: 'Proyectos', linea: 'Sistemas que ya están funcionando', ruta: '/proyectos' },
  { icon: Calculator, titulo: 'Presupuesto', linea: 'Calculá cuánto cuesta lo que necesitás', ruta: '/presupuesto' },
  { icon: Users, titulo: 'Nosotros', linea: 'Nuestra historia y el equipo', ruta: '/nosotros' },
];

export const SaberMas: React.FC = () => (
  <section id="saber-mas" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="¿Querés saber más?" titulo="Elegí qué te interesa" />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECCIONES.map(({ icon: Icon, titulo, linea, ruta }) => (
          <li key={ruta}>
            <a
              href={ruta}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-colors group"
            >
              <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-white">{titulo}</span>
                <span className="block text-xs sm:text-sm text-slate-400">{linea}</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-300 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ── 6. Contacto rápido ───────────────────────────────────────────────── */
export const ContactoRapido: React.FC = () => (
  <section id="contacto-rapido" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-3xl mx-auto px-5 text-center">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">Contacto</span>
      <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white">Contanos qué necesitás</h2>
      <p className="mt-2 text-sm sm:text-base text-slate-400">El diagnóstico es sin costo. Te respondemos en el día.</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappLink('Hola tecnoros.ar, quiero consultar por una solución para mi negocio.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-bold"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <a
          href={`mailto:${VENTAS_EMAIL}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
        >
          <Mail className="w-4 h-4 text-cyan-300" /> {VENTAS_EMAIL}
        </a>
      </div>
      <a href="/contacto" className="mt-4 inline-block text-sm text-cyan-300 underline underline-offset-4">Prefiero personalizar mi mensaje en el formulario</a>
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
          className="w-full sm:w-96 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-bold"
        >
          <MessageCircle className="w-4 h-4" /> Enviar por WhatsApp
        </a>
        <a
          href="/contacto"
          className="w-full sm:w-96 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
        >
          Completar el formulario personalizado
        </a>
      </div>
    </div>
  </section>
);
