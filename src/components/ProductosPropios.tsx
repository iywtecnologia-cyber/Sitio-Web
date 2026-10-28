import React, { useEffect, useRef, useState } from 'react';
import { irA } from '../rutas';
import { tomarEquipo3D, EVENTO_EQUIPO_3D, type Equipo3D } from '../equipo3d';
import { 
  ShieldCheck, 
  FlaskConical, 
  Workflow, 
  BellRing, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Send, 
  Check, 
  Cpu, 
  Layers, 
  Zap, 
  RotateCw,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  MessageSquare,
  Shield,
  CheckCircle2,
  Terminal,
  Play
} from 'lucide-react';
import { HardwareSystemCanvas3D } from './systems/HardwareSystemCanvas3D';
import { GolondrinaAplicacionesShowcase } from './systems/GolondrinaAplicacionesShowcase';
import { whatsappLink } from '../data/contact';
import { GolondrinaLogo } from './LogosProductos';
import { GolondrinaPersonalDemo } from './systems/GolondrinaPersonalDemo';
import { PlegableMovil } from './PlegableMovil';
import { dolares, pesos } from '../data/precios';

export interface ProductoPropio {
  id: string;
  icon: React.ElementType;
  title: string;
  tagline?: string;
  // Explicación simple: qué es y qué hace
  queEs?: string;
  queHace?: string;
  description: string;
  priceUsd: number;
  priceArs: number;
  category: string;
  specs: string[];
}

export const PRODUCTOS: ProductoPropio[] = [
  {
    id: 'golondrina-automatizacion',
    icon: GolondrinaLogo,
    title: 'Golondrina Automatización • Software & Telemetría',
    queEs: 'Un sistema con sensores que vigila tus máquinas, cámaras de frío, tanques o silos.',
    queHace: 'Si algo falla, te avisa por WhatsApp y lo resolvés con 1 clic.',
    tagline: 'Hardware a demanda y software contextual de telemetría con alertas por WhatsApp.',
    description: 'Implementación inmediata de software de telemetría y automatización: detecta el contexto operativo de tu empresa sin configuraciones complicadas y alerta con botón de resolución en 1 solo clic por WhatsApp. Aplicable en tambos y leche, silos, cámaras de frío, inyectoras, motores y bombas.',
    priceUsd: 190,
    priceArs: 228000,
    category: 'Software & Automatización Contextual',
    specs: [
      'Setup inicial: $120.000 a $250.000 ARS por única vez',
      'Abono mensual SaaS: $80.000 a $120.000 ARS/mes por máquina monitoreada',
      'Automatización contextual (Zero-Click): detecta anomalías y actúa sola',
      'Alertas directas y resolución de incidentes en 1 clic por WhatsApp',
      'Múltiples sectores: tambos, silos, frío, inyectoras, motores y bombas',
      'Dispositivo físico con sensores fabricado por encargo según tu tablero'
    ]
  },
  {
    id: 'golondrina-personal',
    icon: GolondrinaLogo,
    title: 'Golondrina Personal • Módulo a tu medida',
    queEs: 'Un asistente que se conecta a las apps que vos elijas (mail, calendario, cobros).',
    queHace: 'Te avisa y te recuerda lo que le pidas, por voz o por texto.',
    tagline: 'Con una G no tenés que aprender nada.',
    description: 'Elegís qué aplicaciones conectar con un clic y le decís qué querés que te avise, escribiendo o hablando: un transcriptor muestra al lado lo que le vas pidiendo. Después te avisa solo donde la habilitaste.',
    priceUsd: 0,
    priceArs: 0,
    category: 'Módulo personalizable',
    specs: [
      'Conectás tus apps con un clic; pedidos por escrito o por voz',
      'Te avisa solo donde vos la habilitás',
      'Se integra a tu sistema actual o como sistema nuevo',
      'Para comercio, oficina, campo o casa'
    ]
  },
  {
    id: 'colibri-micro-hub',
    icon: Cpu,
    title: 'CHAJÁ Micro-Hub • Edge AI & Ciberseguridad',
    queEs: 'Un equipo chiquito que se instala en tu planta, galpón o comercio.',
    queHace: 'Cuida tu red y tus equipos, y te avisa por WhatsApp o por voz cuando algo cambia.',
    tagline: 'Un equipo chiquito que cuida tu empresa y te avisa con 1 clic.',
    description: 'Un equipo chico que se instala en tu planta, galpón o comercio. Aprende cómo funciona tu operación, protege tus datos y te avisa por WhatsApp o por voz cuando algo cambia. Lo resolvés con un clic.',
    priceUsd: 180,
    priceArs: 216000,
    category: 'Edge Computing & Micro-Dispositivo 3D',
    specs: [
      'Diminuto, silencioso y de bajo consumo',
      'Protege los datos de tu empresa',
      'Aprende cómo funciona tu operación y avisa si algo cambia',
      'Alertas por WhatsApp o por voz, y se resuelven con 1 clic',
      'Fabricado en Rosario',
      'Se configura en minutos, sin tocar código'
    ]
  },
  {
    id: 'software-ciberseguridad',
    icon: ShieldCheck,
    title: 'TERO Security',
    tagline: 'Sistema de ciberseguridad (Próximamente).',
    description: 'Sistema de ciberseguridad (Próximamente). En fase de investigación y desarrollo en nuestro laboratorio.',
    priceUsd: 0,
    priceArs: 0,
    category: 'Ciberseguridad (Próximamente)',
    specs: [
      'Sistema de ciberseguridad',
      'Próximamente disponible en TecnoRosario',
      'Actualmente en fase de I+D en laboratorio'
    ]
  },
  {
    id: 'carancho-robotica',
    icon: Bot,
    title: 'Robótica a Medida • Cerebro Digital & Cuerpo Físico',
    queEs: 'Un robot hecho para una tarea de tu negocio.',
    queHace: 'Primero programamos el cerebro y lo probás en 3D; si funciona, fabricamos el cuerpo.',
    tagline: 'Lo primero que se desarrolla es el cerebro del robot; si es viable, también incorporás el cuerpo físico.',
    description: 'Nos especializamos en el desarrollo de software e inteligencia: lo primero que se diseña y programa es el cerebro del robot (algoritmos, visión artificial, percepción y simulación en computadora). Luego, evaluando la viabilidad técnica y operativa del proyecto, podés pedir e incorporar también el modelo del cuerpo físico (chasis, electrónica, motores y ensamble fabricado a medida).',
    priceUsd: 0,
    priceArs: 0,
    category: 'Robótica a Medida (Viabilidad Técnica)',
    specs: [
      'Paso 1: Desarrollo del cerebro robótico (IA, navegación ROS 2, visión y gemelo digital)',
      'Simulación 3D previa: probás la cinemática e interacción antes de invertir en hardware',
      'Paso 2: Fabricación del cuerpo físico (chasis, electrónica y sensores) si el proyecto es viable',
      'Evaluación técnica y comercial individual de factibilidad para cada cliente',
      'Integración final con tus sistemas de planta o computadoras de control'
    ]
  },
];

const PALABRA = 'PRÓXIMAMENTE';
const SIGNOS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789#%&*';

// Efecto "decodificando": las letras se mezclan y se van acomodando hasta formar la palabra.
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
      aria-label="TERO Security: próximamente"
      className="group mb-12 w-full relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 via-slate-950 to-cyan-950/40 px-6 py-6 sm:py-8 text-center cursor-pointer hover:border-cyan-400/60 transition-colors"
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
        TERO SECURITY · EN DESARROLLO
      </span>
      <span aria-hidden="true" className="relative block mt-2 font-mono text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.16em] sm:tracking-[0.22em] text-white group-hover:text-cyan-200 transition-colors">
        {texto}
      </span>
      <span aria-hidden="true" className="relative block mt-2 text-sm sm:text-base text-slate-300">
        Sistema de ciberseguridad en fase de desarrollo y pruebas de laboratorio<span className="inline-block w-[0.6ch] animate-pulse motion-reduce:animate-none">_</span>
      </span>
      <span className="relative mt-3 flex flex-wrap justify-center gap-2 text-xs sm:text-sm font-semibold">
        <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-violet-500/40 text-violet-200">Implementación USD 300</span>
        <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-violet-500/40 text-violet-200">Servicio USD 250 por mes</span>
      </span>
      <span aria-hidden="true" className="relative block mx-auto mt-4 h-1 w-40 sm:w-56 rounded-full bg-slate-800 overflow-hidden">
        <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-[creando_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <style>{'@keyframes creando{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}'}</style>
    </button>
  );
};

export const ProductosPropios: React.FC = () => {
  // Dispositivo de hardware seleccionado en el laboratorio 3D (Chajá o Golondrina)
  const [selectedSystem, setSelectedSystem] = useState<'tero' | 'golondrina' | 'colibri'>('golondrina');
  const [colibriMode, setColibriMode] = useState<'voice' | 'text' | 'shield' | 'learn'>('voice');
  const [activeCapability, setActiveCapability] = useState<'voice' | 'text' | 'shield' | null>(null);
  const [customFilament, setCustomFilament] = useState(false);
  const [filamentColorHex, setFilamentColorHex] = useState('#06b6d4');

  // Control de despiece técnico "Ver por dentro" (0 a 0.85)
  const [explodedAmount, setExplodedAmount] = useState<number>(0);
  const [physicalDemo, setPhysicalDemo] = useState<{label: string; message: string} | null>(null);
  const [demoCount, setDemoCount] = useState(0);


  // Estado de simulación interactiva de 1-clic y auto-aprendizaje
  const [isLearningSim, setIsLearningSim] = useState(false);
  const [learningStep, setLearningStep] = useState(0);

  const activeData = selectedSystem === 'colibri'
    ? (PRODUCTOS.find(p => p.id === 'colibri-micro-hub') || PRODUCTOS[1])
    : selectedSystem === 'golondrina'
    ? (PRODUCTOS.find(p => p.id === 'golondrina-automatizacion') || PRODUCTOS[0])
    : (PRODUCTOS.find(p => p.id === 'software-ciberseguridad') || PRODUCTOS[2]);

  // Si se llegó con "Verlo en 3D" desde el inicio, mostrar ese equipo
  useEffect(() => {
    const inicial = tomarEquipo3D();
    if (inicial) setSelectedSystem(inicial);
    const onEquipo = (e: Event) => {
      tomarEquipo3D();
      setSelectedSystem((e as CustomEvent<Equipo3D>).detail);
    };
    window.addEventListener(EVENTO_EQUIPO_3D, onEquipo);
    return () => window.removeEventListener(EVENTO_EQUIPO_3D, onEquipo);
  }, []);

  const handleSelectCard = (id: string) => {
    if (id === 'golondrina-personal') {
      irA('golondrina-personal-demo');
      return;
    }
    if (id === 'colibri-micro-hub') {
      setSelectedSystem('colibri');
      irA('hardware-studio-3d');
    } else if (id === 'software-ciberseguridad') {
      setSelectedSystem('tero');
      irA('hardware-studio-3d');
    } else if (id === 'golondrina-automatizacion') {
      setSelectedSystem('golondrina');
      irA('hardware-studio-3d');
    } else {
      // Carancho Robótica Autónoma -> Dirige al laboratorio de robótica
      irA('robotica-3d');
    }
  };

  const handleTrigger1ClickLearn = () => {
    if (isLearningSim) return;
    setIsLearningSim(true);
    setColibriMode('learn');
    setLearningStep(1);

    setTimeout(() => {
      setLearningStep(2);
    }, 900);

    setTimeout(() => {
      setLearningStep(3);

    }, 2000);

    setTimeout(() => {
      setIsLearningSim(false);
      setColibriMode('voice');
    }, 4500);
  };

  const handleWhatsAppQuote = () => {
    const filamentoMsg = customFilament
      ? `\n- Carcasa física a medida para la marca: ${filamentColorHex} (+$22.000 ARS)`
      : '';

    const text = selectedSystem === 'colibri'
      ? `¡Hola TecnoRosario! Quiero cotizar el micro-dispositivo *CHAJÁ Micro-Hub • Edge AI & Ciberseguridad* (Dispositivo diminuto con pantalla para reemplazar PC en planta):${filamentoMsg}\n\n¿Podemos coordinar una demo técnica para configurarlo con 1 solo clic en nuestra empresa?`
      : selectedSystem === 'golondrina'
      ? `¡Hola TecnoRosario! Quiero cotizar el módulo físico y software *Golondrina Automatización* (Setup inicial y abono mensual SaaS):${filamentoMsg}\n\n¿Podemos coordinar una reunión de diagnóstico para aplicarlo en nuestra empresa?`
      : `¡Hola TecnoRosario! Me interesa conocer más sobre el próximo sistema de ciberseguridad *TERO Security* (En fase I+D):\n\n¿Tienen una lista de espera o novedades de avance técnico para cuando esté disponible la prueba de concepto?`;

    window.open(`https://wa.me/5493415112000?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="productos" className="py-14 sm:py-16 md:py-20 bg-transparent border-t border-slate-800/50 relative overflow-hidden">
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[400px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado de la Sección */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300 mb-3">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Sistemas Propios & Hardware a Medida</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Nuestros{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              sistemas propios
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Software listo para usar y equipos que fabricamos a pedido para tu máquina o tablero.
          </p>
        </div>

        {/* Tarjetas de Productos Propios (vigentes a demanda; TERO va aparte en el cartel Próximamente) */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold tracking-widest text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>DISPONIBLES A DEMANDA</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PRODUCTOS.filter((prod) => prod.id !== 'software-ciberseguridad').map((prod) => {
            const { id, icon: Icon, title, tagline, queEs, queHace } = prod;
            const isRobotica = id === 'carancho-robotica';
            const isColibri = id === 'colibri-micro-hub';
            const isGolondrina = id === 'golondrina-automatizacion' || id === 'golondrina-personal';
            const isPersonal = id === 'golondrina-personal';

            return (
              <div 
                key={id} 
                id={`producto-${id}`} 
                className={`scroll-mt-28 p-6 sm:p-7 rounded-2xl border flex flex-col justify-between group transition-all shadow-xl ${
                  isColibri
                    ? 'bg-gradient-to-b from-cyan-950/30 via-slate-900 to-slate-950 border-cyan-500/40 hover:border-cyan-400 shadow-cyan-950/20'
                    : 'bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                      isColibri 
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' 
                        : 'bg-slate-800/80 border-slate-700/80 text-cyan-400 group-hover:text-cyan-300'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isColibri ? (
                      <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-500/50 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>A demanda • Vigente</span>
                      </span>
                    ) : isGolondrina ? (
                      <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <span>A demanda • Vigente</span>
                      </span>
                    ) : id === 'software-ciberseguridad' ? (
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Próximamente I+D</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-violet-300 bg-violet-950/70 border border-violet-500/30 px-2 py-0.5 rounded-lg">
                        A demanda • Vigente
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">{title}</h3>
                  {queEs ? (
                    <dl className="mt-3 space-y-2 text-sm leading-snug">
                      <div><dt className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">Qué es</dt><dd className="text-slate-200">{queEs}</dd></div>
                      <div><dt className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">Qué hace</dt><dd className="text-slate-200">{queHace}</dd></div>
                    </dl>
                  ) : tagline && (
                    <p className="mt-2 text-sm text-cyan-300 font-semibold leading-relaxed">
                      {tagline}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSelectCard(id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400/50 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer group/b3d"
                  >
                    <span>
                      {isPersonal
                        ? 'Probar cómo se configura'
                        : isRobotica
                        ? 'Ver Gemelo Digital y Robótica'
                        : isColibri
                        ? 'Probar Micro-Hub 3D (1-Clic)'
                        : isGolondrina
                        ? 'Inspeccionar Software & 3D'
                        : 'Inspeccionar Prototipo en 3D'}
                    </span>
                    <span className="text-cyan-400 group-hover/b3d:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <PlegableMovil titulo="Probá Golondrina Personal" resumen="Conectá apps y pedile avisos por voz o texto">
          <GolondrinaPersonalDemo />
        </PlegableMovil>

        {/* Próximamente: TERO Security, separado de los productos disponibles */}
        <div id="tero-proximamente" className="scroll-mt-28 pt-10 border-t border-slate-800/80">
          <CartelProximamente />
        {/* Aviso de lanzamiento de TERO Security (único producto próximamente) */}
        <div className="-mt-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={whatsappLink('Hola tecnoros.ar, quiero enterarme cuando lancen TERO Security')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
          >
            <BellRing className="w-4 h-4" />
            Mantenete informado
          </a>
          <span className="text-sm text-slate-400">Te contamos las novedades por WhatsApp.</span>
        </div>
        </div>

        {/* =========================================================================
            TABLA TRANSPARENTE DE PRECIOS & ABONOS: GOLONDRINA AUTOMATIZACIÓN
            ========================================================================= */}
        <PlegableMovil titulo="Precios de Golondrina" resumen="Puesta en marcha y abono mensual">
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-2">
                <Workflow className="w-3.5 h-3.5" />
                <span>Modelo Comercial Claro & Accesible • Golondrina Automatización</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Tarifas de Setup y Abono Mensual
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Estructura transparente sin costos ocultos: cobro de puesta en marcha por única vez y suscripción mensual por monitoreo continuo 24/7.
              </p>
            </div>
            <a
              href={whatsappLink('Hola TecnoRosario, quiero consultar por la instalación en planta ($120.000-$250.000 ARS) y el abono mensual ($80.000-$120.000 ARS/mes) de Golondrina Automatización.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Contratar Setup en WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta 1: Setup & Puesta en marcha */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    Pago Único Inicial
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Puesta en Marcha en Planta</span>
                </div>

                <h4 className="text-xl font-bold text-white">Setup & Puesta en marcha</h4>
                
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    $120.000 a $250.000 ARS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    por única vez
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white">Qué cobramos:</strong> Instalación del sensor en planta, conexión a la red Wi-Fi industrial, calibración de umbrales operativos y configuración de los números de WhatsApp de los encargados.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sin esfuerzo físico de tu personal: lo dejamos funcionando</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Configuración completa de números de WhatsApp y guardias</span>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Abono mensual recurrente (SaaS) */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                    Abono Mensual Recurrente (SaaS)
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Sin Permanencia Forzada</span>
                </div>

                <h4 className="text-xl font-bold text-white">Monitoreo Continuo 24/7 & Nube</h4>
                
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                    $80.000 a $120.000 ARS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    / mes por máquina o cámara
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white">Qué cobramos:</strong> Monitoreo continuo 24/7, servidor en la nube de alta disponibilidad, envío de alertas automáticas por WhatsApp con botón de resolución en 1 clic y reporte semanal ejecutivo en PDF.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Servidor en la nube dedicado y telemetría ininterrumpida</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Reportes semanales automáticos consolidados en PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        </PlegableMovil>

        {/* Aviso de seguridad industrial: una línea a la vista y el texto completo al tocar */}
        <details id="aviso-seguridad" className="scroll-mt-24 mb-8 rounded-2xl border border-amber-500/40 bg-slate-900/90 px-5 py-4 group/aviso" aria-label="Compromiso con la seguridad industrial">
          <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
            <span>
              <span className="block text-base sm:text-lg font-bold text-amber-200">Compromiso con la seguridad industrial</span>
              <span className="block mt-1 text-sm sm:text-base text-slate-300">Las demos son ilustrativas: no están certificadas ni reemplazan los sistemas de seguridad de tu planta.</span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-amber-300 mt-0.5 group-open/aviso:hidden">Ver más</span>
            <span className="shrink-0 text-sm font-semibold text-amber-300 mt-0.5 hidden group-open/aviso:inline">Ocultar</span>
          </summary>
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-sm sm:text-base text-slate-300">
            <p>Golondrina y CHAJÁ están pensados para monitoreo, automatización y protección de entornos industriales.</p>
            <p>El control de motores, válvulas y otros actuadores se muestra como función prevista o demostrativa, sujeta a evaluación técnica y de seguridad.</p>
            <p>Antes de una implementación real se definen los requisitos normativos, las pruebas y las condiciones de instalación.</p>
            <p className="text-amber-200">Los productos no se anuncian como certificados. Las demostraciones no autorizan a operar maquinaria real.</p>
          </div>
        </details>

        {/* Aplicaciones Llave en Mano de Golondrina Automatización (Listas para implementar hoy) */}
        <GolondrinaAplicacionesShowcase />

        {/* =========================================================================
            ESTUDIO 3D EXCLUSIVO DE SISTEMAS Y HARDWARE A MEDIDA (CHAJÁ Y GOLONDRINA)
            ========================================================================= */}
        <PlegableMovil titulo="Ver los equipos en 3D" resumen="CHAJÁ y Golondrina, con sus botones">
        <div id="hardware-studio-3d" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070b14] border border-cyan-500/30 shadow-2xl space-y-6">
          
          {/* Header del Laboratorio 3D de Sistemas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Mirá los equipos en 3D
              </h3>
              <p className="mt-2 text-base sm:text-lg text-slate-300">
                Giralo con el dedo o el mouse y tocá sus botones para ver qué hacen.
              </p>
            </div>

            {/* Selector de Dispositivo Hardware Propio (disponibles a demanda) */}
            <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSystem('golondrina')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSystem === 'golondrina'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Workflow className="w-4 h-4" />
                <span>Golondrina Automatización</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSystem('colibri')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSystem === 'colibri'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>CHAJÁ</span>
              </button>

            </div>
          </div>

          {/* Grid Principal: Visor 3D a la izquierda, Panel de Especificaciones a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Visor 3D Interactivo */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <HardwareSystemCanvas3D
                systemType={selectedSystem}
                filamentColor={customFilament ? filamentColorHex : '#18181b'}
                colibriMode={colibriMode}
                explodedAmount={explodedAmount}
              />

              {/* Simulación segura de los controles representados sobre las carcasas 3D. */}
              {(selectedSystem === 'colibri' || selectedSystem === 'golondrina') && (
                <section className="rounded-xl border border-cyan-500/30 bg-slate-950/90 p-4 text-slate-200" aria-label="Simulador de controles físicos">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-base text-cyan-300">Tocá un botón del equipo</h4>
                  </div>
                  <div className={`grid grid-cols-1 gap-2 ${selectedSystem === 'colibri' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                    {(selectedSystem === 'colibri' ? [
                      {label:'CONFIG',nombre:'Configurar',desc:'Lo apretás una sola vez al instalarlo: se vincula con tu celular y empieza a aprender cómo trabajás.',message:'Listo para configurar (simulación). En el equipo real te pide confirmar desde tu celular.'},
                      {label:'TEST',nombre:'Probar',desc:'Revisa que sensores, conexión y avisos funcionen. Usalo cuando quieras chequear que todo anda.',message:'Prueba completada (simulación): sensores, conexión y avisos funcionando.'},
                      {label:'ACK',nombre:'Silenciar alerta',desc:'Confirma que viste el aviso y apaga el sonido. La alerta queda registrada.',message:'Alerta confirmada y silenciada (simulación). Queda en el historial.'},
                    ] : [
                      {label:'STATUS',nombre:'Ver estado',desc:'Muestra en la pantalla si todo está bien, qué sensores están conectados y si hay alarmas.',message:'Todo en orden (simulación): sensores conectados y sin alarmas.'},
                      {label:'PAIR',nombre:'Vincular',desc:'Sirve para conectar un sensor nuevo o tu celular al equipo.',message:'Modo vinculación (simulación): en el equipo real acercás el sensor o confirmás desde el celular.'},
                    ]).map((control) => (
                      <button key={control.label} type="button" title={control.desc}
                        onClick={() => {setPhysicalDemo({label:control.label,message:control.message});setDemoCount(n=>n+1);}}
                        className="text-left rounded-lg border border-cyan-700/50 bg-slate-900 hover:bg-cyan-950/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 p-3 transition-colors">
                        <span className="flex items-center gap-2"><span className="font-bold text-white text-sm">{control.nombre}</span><span className="text-[10px] font-mono text-cyan-300 border border-cyan-700/60 rounded px-1.5">{control.label}</span></span>
                      </button>
                    ))}
                  </div>
                  {physicalDemo && <div key={demoCount} role="status" aria-live="polite" className="mt-3 p-3 rounded-lg bg-cyan-950/40 border border-cyan-700/40 text-xs"><strong className="text-cyan-300">{physicalDemo.label}:</strong> {physicalDemo.message}</div>}
                </section>
              )}

              {/* PANEL INTERACTIVO DE CONTROL EN VIVO DE CHAJÁ */}
              {selectedSystem === 'colibri' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">CHAJÁ · Demo interactiva</span>
                    <h4 className="text-sm font-bold text-white">Elegí una función para conocerla</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="Funciones de CHAJÁ">
                    {([
                      {id:'voice' as const, label:'Voz (opcional)', icon:Volume2, info:'Alertas habladas con abono mensual por cada CHAJÁ. Servicio a contratar; no reproduce voz en esta demo.'},
                      {id:'text' as const, label:'WhatsApp', icon:MessageSquare, info:'Avisos de eventos y anomalías por WhatsApp, sujetos a configuración del servicio.'},
                      {id:'shield' as const, label:'Ciberseguridad', icon:Shield, info:'Aislamiento y supervisión de red industrial. Funcionalidad sujeta a validación técnica.'},
                    ]).map(({id,label,icon:Icon,info}) => (
                      <button key={id} type="button" aria-pressed={activeCapability === id}
                        onClick={() => {setActiveCapability(id);setColibriMode(id);}}
                        className={`p-3 rounded-xl border bg-slate-950/80 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:border-cyan-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${activeCapability===id?'border-cyan-500':'border-slate-800'}`}>
                        <Icon className="w-4 h-4 text-cyan-400" aria-hidden="true" /> {label}
                      </button>
                    ))}
                  </div>
                  {activeCapability && (
                    <div role="status" aria-live="polite" className="p-3 rounded-xl border border-slate-700 bg-slate-950/80 text-xs text-slate-300">
                      {activeCapability==='voice' ? 'Voz: alertas habladas mediante servicio pago por equipo; no hay voz de prueba.' : activeCapability==='text' ? 'WhatsApp: notificaciones de eventos, previa configuración.' : 'Ciberseguridad: protección y segmentación de red, sujeta a evaluación.'}
                      {activeCapability==='voice' && <button type="button" onClick={() => window.open('https://wa.me/5493415112000?text='+encodeURIComponent('Hola, quiero cotizar voz premium por CHAJÁ.'),'_blank','noopener,noreferrer')} className="ml-2 underline text-cyan-300">Consultar precio</button>}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna Derecha: Detalles del Sistema y Cotización */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">{activeData.title}</h4>
                  {activeData.queEs ? (
                    <dl className="mt-3 space-y-2.5 text-base leading-snug">
                      <div><dt className="text-xs font-mono uppercase tracking-wider text-cyan-400">Qué es</dt><dd className="text-slate-200">{activeData.queEs}</dd></div>
                      <div><dt className="text-xs font-mono uppercase tracking-wider text-emerald-400">Qué hace</dt><dd className="text-slate-200">{activeData.queHace}</dd></div>
                    </dl>
                  ) : activeData.tagline && <p className="mt-2 text-base text-slate-300">{activeData.tagline}</p>}
                </div>

                {/* Personalización de Color de Carcasa (Filamento PETG) */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Color: negro mate</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customFilament}
                        onChange={(e) => setCustomFilament(e.target.checked)}
                        className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300">
                        Personalizar color de carcasa para tu empresa{' '}
                        <span className="text-cyan-300 font-mono font-semibold">(+$22.000 ARS)</span>
                      </span>
                    </label>

                    {customFilament && (
                      <div className="mt-2.5 pl-6 flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-mono">Elegir color:</span>
                        <input
                          type="color"
                          value={filamentColorHex}
                          onChange={(e) => setFilamentColorHex(e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-xs font-mono text-cyan-300">{filamentColorHex}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de Acción: Cotizar en WhatsApp o Ver en Presupuestador */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppQuote}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      selectedSystem === 'colibri'
                        ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        : selectedSystem === 'golondrina'
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:scale-[1.01]'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {selectedSystem === 'colibri'
                        ? 'Cotizar CHAJÁ en WhatsApp'
                        : selectedSystem === 'golondrina'
                        ? 'Cotizar Golondrina en WhatsApp'
                        : 'Consultar por Avances de TERO Security en WhatsApp'}
                    </span>
                  </button>

                  <a
                    href="#facturacion"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Sumar al Presupuestador de la web</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>

              </div>

            </div>

          </div>

        </div>
        </PlegableMovil>

      </div>
    </section>
  );
};
