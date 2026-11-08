import React from 'react';
import { Carrusel } from './Carrusel';
import {
  ArrowRight, BookOpen, Target, Globe, Globe2, Palette, ShoppingCart, Megaphone, Compass, Search, Eye, MapPin, Package, KeyRound, CreditCard, Smile, Headset, Unlock, Smartphone, Contact, ExternalLink, Flag, Instagram, Linkedin, Workflow, Bot, ShieldCheck, Code2, Cpu, MessageCircle, Mail, Layers, Lock, Boxes, FolderKanban, Calculator, ChevronRight, Camera,
} from 'lucide-react';
import { GolondrinaLogo, TeroLogo } from '../LogosProductos';
import { TecnorosLogo } from '../TecnorosLogo';
import { EquipoAreas } from '../EquipoAreas';
import { irA, navegar } from '../../rutas';
import { elegirEquipo3D, type Equipo3D } from '../../equipo3d';
import { whatsappLink, gmailLink, VENTAS_EMAIL } from '../../data/contact';
import type { Ruta } from '../../rutas';

// Inicio corto: cada bloque dice una sola cosa y tiene un botón que lleva al detalle.
// Lo pesado (simuladores, 3D, presupuestador, tecnologías) vive en su propia página.

const Titulo: React.FC<{ chip: string; titulo: string; bajada?: React.ReactNode }> = ({ chip, titulo, bajada }) => (
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
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-5">
        De Rosario para todo el mundo <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
      </span>
      <h1 className="text-[2rem] sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
        Todo para tu negocio que <span className="whitespace-nowrap">crece <span className="animate-text-light-sweep">con vos</span></span>
      </h1>
      <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-xl">
        Somos una agencia remota nacida en Rosario, con equipo en distintos lugares del mundo. Automatizamos tareas, cuidamos tu información y creamos el software y los robots que tu negocio necesita.
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
      {/* El botón de arrepentimiento es obligatorio a la vista en la primera pantalla (Res. 424/2020) */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
          <Unlock className="w-3.5 h-3.5" /> Sin permanencia
        </span>
        <a href="#arrepentimiento" className="text-slate-400 hover:text-cyan-300 underline underline-offset-4">
          Botón de arrepentimiento
        </a>
      </div>
    </div>
  </section>
);

/* ── JAR 2026: participación (evento finalizado) ───────────────────────── */
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
            <span aria-hidden="true">🏁</span> Challenge JAR 2026
          </span>
          <span className="block mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-violet-300">Rosario · 3 al 6 de noviembre de 2026</span>
          <h2 className="mt-1.5 text-xl sm:text-3xl font-extrabold text-white leading-tight">
            Participamos con nuestro robot autónomo
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
            Lo diseñamos y programamos en Rosario y terminamos 7°. Ya estamos pensando en la próxima edición.
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
            href="https://www.instagram.com/p/DfXMB7vG_RP/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-950/60 border border-violet-400/40 text-violet-100 font-semibold hover:border-violet-300"
          >
            <Instagram className="w-4 h-4" /> Ver el recorrido
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ── 2. Qué hacemos ────────────────────────────────────────────────────── */
// Todos los servicios en una sola fila deslizable. Primero los siete de la remera, en el mismo orden.
// La descripción aparece al pasar el mouse o tocar la tarjeta (en celular se ve siempre, porque no hay "pasar el mouse").
const SERVICIOS: { icon: React.ElementType; titulo: string; linea: string; ir: string }[] = [
  { icon: Search, titulo: 'Diagnóstico gratuito', linea: 'Miramos tu negocio y te decimos qué conviene hacer primero. Sin costo.', ir: 'servicio-analisis-qa' },
  { icon: Workflow, titulo: 'Automatizaciones', linea: 'Turnos, consultas y tareas administrativas: lo que hacés a mano, que se haga solo.', ir: 'servicio-automatizacion' },
  { icon: MessageCircle, titulo: 'Bots de WhatsApp', linea: 'Responde consultas y toma pedidos a toda hora, con el tono de tu negocio.', ir: 'servicio-bots-whatsapp' },
  { icon: Lock, titulo: 'Ciberseguridad', linea: 'Protegemos tus datos, cuentas y equipos antes de que pase algo.', ir: 'servicio-ciberseguridad' },
  { icon: Code2, titulo: 'Software a medida', linea: 'Sistemas hechos para cómo trabajás vos, no al revés.', ir: 'servicio-software-a-medida' },
  { icon: Bot, titulo: 'Asistentes', linea: 'Un personaje animado que recibe y guía a tus clientes en tu web.', ir: 'servicio-asistentes' },
  { icon: Globe, titulo: 'Páginas web', linea: 'Tu web rápida, clara y pensada para que te escriban.', ir: 'servicio-paginas-web' },
  { icon: ShoppingCart, titulo: 'E-commerce', linea: 'Tu tienda online con pagos y stock, abierta las 24 horas.', ir: 'servicio-ecommerce' },
  { icon: Smartphone, titulo: 'Apps móviles', linea: 'Tu negocio en el celular de tus clientes.', ir: 'servicio-aplicaciones-moviles' },
  { icon: Contact, titulo: 'CRM', linea: 'Todos tus clientes, consultas y ventas en un solo lugar.', ir: 'servicio-crm' },
  { icon: Cpu, titulo: 'Robótica', linea: 'Cerebro digital y cuerpo físico para las tareas repetitivas.', ir: 'servicio-robotica-a-medida' },
  { icon: Megaphone, titulo: 'Campañas en Meta y Google Ads', linea: 'Anuncios que llegan a quien ya está buscando lo que vendés.', ir: 'servicio-campanas-ads' },
  { icon: Compass, titulo: 'Estrategia de marca', linea: 'Qué decir, a quién y cómo, para que te elijan.', ir: 'servicio-estrategia-marca' },
  { icon: Palette, titulo: 'Identidad visual', linea: 'Logo, colores y estilo para que te reconozcan al toque.', ir: 'servicio-identidad-marca' },
];

// Con mouse, la descripción aparece al pasar por encima o al enfocar con el teclado; sin mouse (celu) se ve siempre.
const OCULTA_HASTA_INTERACTUAR =
  'transition-all duration-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0';

export const QueHacemos: React.FC = () => (
  <section id="que-hacemos" className="py-12 sm:py-16 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      {/* Mismo look que la remera: fondo negro, íconos con línea celeste y "con vos" resaltado. */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black px-4 py-7 sm:px-8 sm:py-9">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 px-1">
            <TecnorosLogo className="w-8 h-9 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">Qué hacemos</span>
            <span className="ml-auto hidden sm:block text-xs text-slate-500">Pasá el mouse por una tarjeta para ver de qué se trata</span>
          </div>

          <div className="mt-5">
            <Carrusel etiqueta="Servicios" anchoItem="w-[78%] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]">
              {SERVICIOS.map(({ icon: Icon, titulo, linea, ir }) => (
                <button
                  key={titulo}
                  type="button"
                  onClick={() => irA(ir, true)}
                  className="group h-full w-full text-left p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400/60 focus-visible:border-cyan-400/60 focus:outline-none transition-colors cursor-pointer flex flex-col"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shrink-0 transition-all group-hover:bg-cyan-400/10 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white leading-tight">{titulo}</span>
                  </span>
                  <span className={`mt-3 block text-sm text-slate-400 leading-snug min-h-[2.6rem] ${OCULTA_HASTA_INTERACTUAR}`}>{linea}</span>
                  <span className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 ${OCULTA_HASTA_INTERACTUAR}`}>
                    Ver más <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </Carrusel>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-1">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Todo para que tu negocio <span className="text-cyan-400">crezca con vos</span>
              </p>
              <p className="mt-1 text-base sm:text-lg font-extrabold tracking-tight text-white">tecnoros<span className="text-cyan-400">.ar</span></p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/presupuesto"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 hover:bg-cyan-300 transition-colors"
              >
                Cotizá ahora <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/servicios"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 text-white font-semibold hover:border-cyan-400/60 transition-colors"
              >
                Ver todos los servicios
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ── Por qué elegirnos ─────────────────────────────────────────────── */
const RAZONES: { icon: React.ElementType; titulo: string; linea: string }[] = [
  { icon: Search, titulo: 'Diagnóstico sin costo', linea: 'Primero entendemos tu problema. Recién después hablamos de precio.' },
  { icon: Eye, titulo: 'Lo ves antes de pagarlo', linea: 'Armamos un prototipo y no seguimos hasta que lo aprobás.' },
  { icon: KeyRound, titulo: 'Lo que hacemos es tuyo', linea: 'Una vez pagado, lo desarrollado a medida es tuyo. Y tus datos son siempre tuyos.' },
  { icon: CreditCard, titulo: 'Facilidades de pago', linea: 'Te damos facilidades para que pagar no sea un problema.' },
  { icon: Smile, titulo: 'No necesitás saber de tecnología', linea: 'Te explicamos todo en simple y lo dejamos andando.' },
  { icon: Headset, titulo: 'Soporte técnico todo el tiempo', linea: 'Te acompañamos antes, durante y después de la entrega.' },
  { icon: Unlock, titulo: 'Sin permanencia', linea: 'Los abonos mensuales se dan de baja cuando quieras.' },
  { icon: Calculator, titulo: 'Precios claros', linea: 'Precios de referencia y combos publicados. Sin sorpresas.' },
];

export const PorQueElegirnos: React.FC = () => (
  <section id="por-que-elegirnos" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="Por qué elegirnos" titulo="Lo que nos hace distintos" />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {RAZONES.map(({ icon: Icon, titulo, linea }) => (
          <li key={titulo} className="flex sm:flex-col items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/25">
            <span className="w-12 h-12 rounded-2xl bg-emerald-400 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-emerald-500/20">
              <Icon className="w-6 h-6" />
            </span>
            <span>
              <span className="block text-base sm:text-lg font-bold text-white">{titulo}</span>
              <span className="block mt-1 text-sm sm:text-base text-slate-400 leading-snug">{linea}</span>
            </span>
          </li>
        ))}
      </ul>
      <VerMas onClick={() => irA('combos-inicio')}>Ver combos con precio</VerMas>
    </div>
  </section>
);

/* ── 3. Productos (carrusel en celular) ────────────────────────────────── */
const PRODUCTOS_CORTOS: { logo: React.ElementType; nombre: string; linea: string; boton: string; ir: string; equipo?: Equipo3D; estado: string; color: string }[] = [
  { logo: GolondrinaLogo, nombre: 'Golondrina Automatización', linea: 'Vigila tus máquinas y te avisa por WhatsApp si algo falla. Lo resolvés con 1 clic.', boton: 'Verlo en 3D', ir: 'hardware-studio-3d', equipo: 'golondrina', estado: 'Disponible', color: 'emerald' },
  { logo: GolondrinaLogo, nombre: 'Golondrina Personal', linea: 'Le decís qué avisarte, por voz o texto. Sin aprender nada.', boton: 'Probar la demo', ir: 'golondrina-personal-demo', estado: 'Disponible', color: 'emerald' },
  { logo: Cpu, nombre: 'CHAJÁ', linea: 'Un equipo chiquito que cuida tu red y tus equipos, y te avisa si algo cambia.', boton: 'Verlo en 3D', ir: 'hardware-studio-3d', equipo: 'colibri', estado: 'A demanda', color: 'cyan' },
  { logo: TeroLogo, nombre: 'TERO Security', linea: 'Ciberseguridad para pymes. Implementación USD 300 y servicio USD 250 por mes.', boton: 'Mantenete informado', ir: 'tero-proximamente', estado: 'Próximamente', color: 'violet' },
];

const CHIP: Record<string, string> = {
  emerald: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  cyan: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  violet: 'text-violet-300 border-violet-500/40 bg-violet-500/10',
};

export const ProductosInicio: React.FC = () => (
  <section id="productos-inicio" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      {/* En compu se ven los cuatro juntos: "Deslizá" sólo tiene sentido en el carrusel */}
      <Titulo chip="Productos propios" titulo="Nuestros productos" bajada={<><span className="lg:hidden">Deslizá para ver cada uno y probalo.</span><span className="hidden lg:inline">Elegí uno y probalo.</span></>} />
    </div>
    {/* En celular se desliza de costado; en compu se ven los cuatro.
        scroll-px: sin esto el snap alinea la tarjeta contra el borde y se "come" el padding. */}
    <div className="max-w-7xl mx-auto lg:px-12">
      <ul className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory px-5 sm:px-8 lg:px-0 scroll-px-5 sm:scroll-px-8 lg:scroll-px-0 pb-3 no-scrollbar">
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

/* ── 4. Quiénes somos ────────────────────────────────────────────────── */
export const EquipoCorto: React.FC = () => (
  <section id="equipo" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo
        chip="Quiénes somos"
        titulo="Nuestro equipo"
        bajada="Nacimos en Rosario y hoy trabajamos en remoto, con gente de distintos lugares. Así estamos organizados:"
      />
      <EquipoAreas />
    </div>
  </section>
);

/* ── 5. ¿Querés saber más? ─────────────────────────────────────────────── */
const SECCIONES: { icon: React.ElementType; titulo: string; linea: string; ruta: string }[] = [
  { icon: Layers, titulo: 'Servicios', linea: 'Todo lo que hacemos y cómo trabajamos', ruta: '/servicios' },
  { icon: Boxes, titulo: 'Productos y demos', linea: 'Simuladores, equipos en 3D y precios', ruta: '/productos' },
  { icon: Bot, titulo: 'Diseñá tu robot', linea: 'Armalo y probalo en 3D, en la pantalla', ruta: '/robotica' },
  { icon: FolderKanban, titulo: 'Proyectos', linea: 'Sistemas que ya están funcionando', ruta: '/proyectos' },
  { icon: Calculator, titulo: 'Presupuesto', linea: 'Calculá cuánto cuesta lo que necesitás', ruta: '/presupuesto' },
  { icon: Package, titulo: 'Combos', linea: 'Servicios juntos, a mejor precio', ruta: '/presupuesto#combos' },
  { icon: BookOpen, titulo: 'Blog', linea: 'Ideas cortas para tu negocio', ruta: '/blog' },
  { icon: Camera, titulo: 'Encuentros', linea: 'Nuestra historia en fotos', ruta: '/encuentros' },
];

export const SaberMas: React.FC = () => (
  <section id="saber-mas" className="py-14 sm:py-20 border-t border-slate-800/50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <Titulo chip="¿Querés saber más?" titulo="Elegí qué te interesa" />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECCIONES.map(({ icon: Icon, titulo, linea, ruta }) => (
          <li key={titulo}>
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
        {/* Gmail web como en el resto de la web: un mailto: en una compu sin programa de correo no hace nada. */}
        <a
          href={gmailLink('Consulta desde tecnoros.ar', 'Hola tecnoros.ar, quiero consultar por una solución para mi negocio.')}
          target="_blank"
          rel="noopener noreferrer"
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
