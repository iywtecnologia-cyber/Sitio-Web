import React, { useEffect, useRef, useState } from 'react';
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
import { dolares, pesos } from '../data/precios';

export interface ProductoPropio {
  id: string;
  icon: React.ElementType;
  title: string;
  tagline?: string;
  description: string;
  priceUsd: number;
  priceArs: number;
  category: string;
  specs: string[];
}

export const PRODUCTOS: ProductoPropio[] = [
  {
    id: 'golondrina-automatizacion',
    icon: Workflow,
    title: 'Golondrina Automatización • Software & Telemetría',
    tagline: 'Hardware a demanda y software contextual de telemetría con alertas por WhatsApp.',
    description: 'Implementación inmediata de software de telemetría y automatización: detecta el contexto operativo de tu empresa sin configuraciones complicadas y alerta con botón de resolución en 1 solo clic por WhatsApp. Aplicable en tambos y leche, silos, cámaras de frío, inyectoras, motores y bombas.',
    priceUsd: 190,
    priceArs: 228000,
    category: 'Software & Automatización Contextual',
    specs: [
      'Setup inicial: $120.000 a $250.000 ARS ($150 a $250 USD) por única vez',
      'Abono mensual SaaS: $35.000 a $80.000 ARS/mes por máquina monitoreada',
      'Automatización contextual (Zero-Click): detecta anomalías y actúa sola',
      'Alertas directas y resolución de incidentes en 1 clic por WhatsApp',
      'Múltiples sectores: tambos, silos, frío, inyectoras, motores y bombas',
      'Dispositivo físico con sensores fabricado por encargo según tu tablero'
    ]
  },
  {
    id: 'colibri-micro-hub',
    icon: Cpu,
    title: 'CHAJÁ Micro-Hub • Edge AI & Ciberseguridad',
    tagline: 'Dispositivo 3D diminuto con pantalla: reemplaza a una computadora grande con IA contextual, ciberseguridad y 1 solo clic.',
    description: 'El micro-dispositivo propio de TecnoRosario: un hardware diminuto impreso en 3D que reemplaza por completo a una computadora grande en tu planta, galpón o comercio. Integra ciberseguridad perimetral para proteger tus datos industriales y Machine Learning contextual que aprende en minutos el ciclo normal de tus máquinas. Con su micro-pantalla interactiva, configurás con un solo clic si preferís que te hable por altavoz de voz audible o te notifique por WhatsApp/Telegram. Toda tu empresa protegida y configurada con un solo dispositivo.',
    priceUsd: 180,
    priceArs: 216000,
    category: 'Edge Computing & Micro-Dispositivo 3D',
    specs: [
      'Reemplaza una computadora grande: diminuto (8×8 cm), silencioso y de ultra bajo consumo',
      'Ciberseguridad de datos integrada: red encriptada local, aislamiento OT/IT y cortafuegos',
      'Machine Learning contextual: aprende los parámetros y ritmos normales en minutos sin tocar código',
      'Pantalla micro-OLED de 1 clic: elegí si te habla por voz audible o te avisa por WhatsApp',
      'Alertas instantáneas a WhatsApp y Telegram con botón de resolución en 1 solo clic',
      'Fabricado en impresión 3D técnica en Rosario con anclaje a riel DIN o fijación magnética',
      'Configuración Zero-Effort: 1 solo clic en su pantalla y tenés toda tu empresa configurada'
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
      className="group mb-8 w-full relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 via-slate-950 to-cyan-950/40 px-6 py-6 sm:py-8 text-center cursor-pointer hover:border-cyan-400/60 transition-colors"
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
      <span aria-hidden="true" className="relative block mx-auto mt-4 h-1 w-40 sm:w-56 rounded-full bg-slate-800 overflow-hidden">
        <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-[creando_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <style>{'@keyframes creando{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}'}</style>
    </button>
  );
};

export const ProductosPropios: React.FC = () => {
  // Dispositivo de hardware seleccionado en el laboratorio 3D (Chajá o Golondrina)
  const [selectedSystem, setSelectedSystem] = useState<'tero' | 'golondrina' | 'colibri'>('colibri');
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

  const handleSelectCard = (id: string) => {
    if (id === 'colibri-micro-hub') {
      setSelectedSystem('colibri');
      const studio = document.getElementById('hardware-studio-3d');
      if (studio) studio.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'software-ciberseguridad') {
      setSelectedSystem('tero');
      const studio = document.getElementById('hardware-studio-3d');
      if (studio) studio.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'golondrina-automatizacion') {
      setSelectedSystem('golondrina');
      const studio = document.getElementById('hardware-studio-3d');
      if (studio) studio.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Carancho Robótica Autónoma -> Dirige al laboratorio de robótica
      const el = document.getElementById('robotica-3d');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    <section id="productos" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
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
            No son robótica convencional: son <strong className="text-white">sistemas a medida dentro de tus sistemas</strong>. Todos los dispositivos y módulos de hardware físico se fabrican <strong className="text-cyan-300">exclusivamente a demanda y por encargo</strong> según la maquinaria o tablero de cada empresa, mientras que el software de telemetría y automatización está listo para implementación inmediata.
          </p>
        </div>

        <CartelProximamente />

        {/* Tarjetas de Productos Propios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PRODUCTOS.map((prod) => {
            const { id, icon: Icon, title, tagline, description } = prod;
            const isRobotica = id === 'carancho-robotica';
            const isColibri = id === 'colibri-micro-hub';
            const isGolondrina = id === 'golondrina-automatizacion';

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
                  {tagline && (
                    <p className="mt-2 text-xs text-cyan-300 font-semibold leading-relaxed">
                      {tagline}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-4">
                    {description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    {prod.specs.slice(0, 3).map((sp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400 font-mono">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSelectCard(id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400/50 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer group/b3d"
                  >
                    <span>
                      {isRobotica
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

        {/* =========================================================================
            TABLA TRANSPARENTE DE PRECIOS & ABONOS: GOLONDRINA AUTOMATIZACIÓN
            ========================================================================= */}
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
              href={whatsappLink('Hola TecnoRosario, quiero consultar por la instalación en planta ($120.000-$250.000 ARS) y el abono mensual ($35.000-$80.000 ARS/mes) de Golondrina Automatización.')}
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
                    (o $150 a $250 USD) por única vez
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
                    $35.000 a $80.000 ARS
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

        <section className="mb-6 rounded-2xl border border-amber-500/40 bg-slate-900/90 p-5 space-y-3" aria-label="Compromiso con la seguridad industrial">
          <h3 className="text-lg font-bold text-white">Compromiso con la seguridad industrial</h3>
          <p className="text-xs text-slate-400">TecnoRosario · Información técnica y comercial</p>
          <p className="inline-flex w-fit rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">Aviso de seguridad industrial</p>
          <p className="text-sm text-slate-200">Nuestras soluciones Golondrina y CHAJÁ están concebidas para monitoreo inteligente, automatización y protección de entornos industriales.</p>
          <p className="text-sm text-slate-200">Las capacidades de control de motores, válvulas y otros actuadores se presentan actualmente como funcionalidades previstas o demostrativas, sujetas a evaluación técnica y de seguridad.</p>
          <p className="text-sm text-slate-200">Antes de ofrecer una implementación operativa se determinarán los requisitos normativos aplicables, las pruebas necesarias y las condiciones de instalación.</p>
          <p className="text-sm text-amber-200">Los productos no se anuncian como certificados. Las demostraciones no constituyen autorización para operar maquinaria real ni reemplazan los sistemas de seguridad industrial.</p>
        </section>

        {/* Aplicaciones Llave en Mano de Golondrina Automatización (Listas para implementar hoy) */}
        <GolondrinaAplicacionesShowcase />

        {/* =========================================================================
            ESTUDIO 3D EXCLUSIVO DE SISTEMAS Y HARDWARE A MEDIDA (CHAJÁ, GOLONDRINA Y TERO)
            ========================================================================= */}
        <div id="hardware-studio-3d" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070b14] border border-cyan-500/30 shadow-2xl space-y-6">
          
          {/* Header del Laboratorio 3D de Sistemas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Banco de Ensayo 3D • Micro-Dispositivos & Hardware a Medida</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Inspección 3D & Simulación Interactiva de Hardware
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Probá el funcionamiento interactivo de nuestros dispositivos propios. Cada gabinete se imprime <strong className="text-cyan-300">en 3D a demanda</strong> para adaptarse a tu tablero, riel DIN o maquinaria.
              </p>
            </div>

            {/* Selector de Dispositivo Hardware Propio (3 Opciones) */}
            <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSystem('colibri')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSystem === 'colibri'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>CHAJÁ (Edge AI & 1-Clic)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSystem('golondrina')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSystem === 'golondrina'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Workflow className="w-4 h-4" />
                <span>Golondrina (A Demanda)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSystem('tero')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSystem === 'tero'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>TERO Security (Próximamente)</span>
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
                    <h4 className="font-bold text-sm text-cyan-300">Botones de la carcasa · demo</h4>
                    <span className="text-[10px] rounded-full border border-amber-500/40 px-2 py-1 text-amber-300">SIMULACIÓN · sin conexión a máquinas</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Probá los controles del modelo 3D. Solo simulación.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(selectedSystem === 'colibri' ? [
                      {label:'CONFIG',desc:'Iniciar configuración y vinculación',message:'Modo de configuración simulado. En un equipo real requerirá autenticación y validación de red.'},
                      {label:'TEST',desc:'Diagnóstico de sensores y comunicaciones',message:'Prueba simulada completada: sensores, red y alertas en estado demostrativo.'},
                      {label:'ACK',desc:'Reconocer una alerta',message:'Alerta de demostración reconocida. Las protecciones críticas nunca se desactivan.'},
                    ] : [
                      {label:'STATUS',desc:'Consultar estado del equipo',message:'Estado simulado: sensores conectados, monitoreo disponible y sin alarmas activas.'},
                      {label:'PAIR',desc:'Iniciar vinculación segura',message:'Vinculación simulada. No se ha conectado ningún sensor ni dispositivo real.'},
                    ]).map((control) => (
                      <button key={control.label} type="button" title={control.desc}
                        onClick={() => {setPhysicalDemo({label:control.label,message:control.message});setDemoCount(n=>n+1);}}
                        className="text-left rounded-lg border border-cyan-700/50 bg-slate-900 hover:bg-cyan-950/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 p-3 transition-colors">
                        <span className="block font-bold text-cyan-300 text-xs">● {control.label}</span>
                        <span className="block text-[11px] text-slate-400 mt-1">{control.desc}</span>
                      </button>
                    ))}
                  </div>
                  {physicalDemo && <div key={demoCount} role="status" aria-live="polite" className="mt-3 p-3 rounded-lg bg-cyan-950/40 border border-cyan-700/40 text-xs"><strong className="text-cyan-300">{physicalDemo.label}:</strong> {physicalDemo.message}</div>}
                </section>
              )}

              {/* Barra de Ayuda, Zoom y CONTROL DE DESPIECE / VER POR DENTRO */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Rueda del mouse: Zoom interactivo directo continuo</span>
                </div>

                {/* Botón y Slider de "Ver por dentro" / Despiece de Hardware */}
                {selectedSystem === 'colibri' && (
                  <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/30">
                    <button
                      type="button"
                      onClick={() => setExplodedAmount(explodedAmount > 0.05 ? 0 : 0.85)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        explodedAmount > 0.05
                          ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                          : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{explodedAmount > 0.05 ? 'Cerrar Carcasa 3D' : 'Ver por Dentro (Despiece PCB)'}</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Apertura:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={explodedAmount}
                        onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                        className="w-20 accent-cyan-400 cursor-pointer"
                        title="Despiece de componentes internos"
                      />
                      <span className="text-[10.5px] font-bold text-cyan-300 w-8">
                        {Math.round(explodedAmount * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

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
                  {/* Botones de Acción de Prueba en Vivo */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleTrigger1ClickLearn}
                      disabled={isLearningSim}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>
                        {isLearningSim
                          ? learningStep === 1
                            ? 'Escaneando variables de planta...'
                            : learningStep === 2
                            ? 'Aprendiendo ritmos normales (ML)...'
                            : 'Demo completada'
                          : 'Simular autoaprendizaje'}
                      </span>
                    </button>

                  </div>

                  {/* Mensaje de Confirmación de Configuración */}
                  {isLearningSim && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {learningStep === 1 && 'Paso 1: Detectando variables de ejemplo...'}
                        {learningStep === 2 && 'Paso 2: Calculando patrones simulados...'}
                        {learningStep === 3 && 'Demo finalizada. No se configuraron equipos reales.'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna Derecha: Detalles del Sistema y Cotización */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {activeData.category}
                  </span>
                  {selectedSystem === 'colibri' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Micro-Dispositivo Edge</span>
                    </span>
                  ) : selectedSystem === 'golondrina' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <span>Hardware a Demanda</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Próximamente en I+D</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">{activeData.title}</h4>
                  {selectedSystem === 'colibri' ? (
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-cyan-300 font-mono">
                        Micro-Dispositivo 3D
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (Reemplaza una PC grande)
                      </span>
                    </div>
                  ) : selectedSystem === 'golondrina' ? (
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-emerald-300 font-mono">
                        Hardware a Demanda
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (Módulo a medida por encargo)
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-amber-300 font-mono">
                        Próximamente
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (En fase de prototipado)
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeData.description}
                </p>

                {/* Especificaciones de Hardware */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Especificaciones Técnicas:
                  </span>
                  <div className="space-y-1.5">
                    {activeData.specs.map((sp, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalización de Color de Carcasa (Filamento PETG) */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Color de serie: Negro Mate Industrial</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Impreso en filamento técnico de alta resistencia térmica para durabilidad en tablero o rack.
                      </p>
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
                        ? 'Cotizar CHAJÁ Micro-Hub en WhatsApp'
                        : selectedSystem === 'golondrina'
                        ? 'Cotizar Módulo Golondrina en WhatsApp (A Demanda)'
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

        {/* =========================================================================
            RADIOGRAFÍA TÉCNICA: ¿CÓMO ESTÁ HECHO CHAJÁ POR DENTRO?
            ========================================================================= */}
        <div id="colibri-interior-hardware" className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-cyan-950/30 border border-cyan-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Ingeniería Electrónica Industrial • TecnoRosario</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                ¿Cómo está hecho CHAJÁ por dentro?
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Reemplaza una computadora gigante porque concentra toda la potencia de cálculo, ciberseguridad y audio en un micro-hardware de estado sólido, sin partes mecánicas frágiles ni ventiladores que aspiren polvo de fábrica.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedSystem('colibri');
                setExplodedAmount(0.85);
                const el = document.getElementById('hardware-studio-3d');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Despiece 3D en el Laboratorio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {/* Componente 1: PCB FR-4 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    01
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Sustrato FR-4
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Placa Base PCB Multicapa Industrial
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Circuito impreso de 4 capas con pistas de cobre pesado de 2oz y plano de masa continuo. Diseñado para absorber vibraciones mecánicas y aislar el ruido electromagnético emitido por motores, contactores y variadores de frecuencia.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Aislamiento galvánico anti-ruidos
              </div>
            </div>

            {/* Componente 2: SoC NPU */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
                    02
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    NPU Inferencia
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Procesador Neural Edge Quad-Core
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  SoC con acelerador de tensor que corre el modelo de Machine Learning contextual en tiempo real con latencia menor a 5 ms. Disipación pasiva silenciosa con micro-aletas de aluminio negro: no usa ventiladores, no aspira polvillo ni sufre cuelgues de Windows.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                100% silencioso y sin mantenimiento
              </div>
            </div>

            {/* Componente 3: Chip Criptográfico TPM */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
                    03
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Cifrado Físico
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Chip Criptográfico de Hardware (TPM 2.0)
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Bóveda de silicio donde se generan y protegen las claves criptográficas privadas. Cifra toda la telemetría de planta en AES-256 GCM y aísla la red de automatización para que nadie fuera de tu empresa pueda acceder o vulnerar los datos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Cortafuegos perimetral Zero-Cloud
              </div>
            </div>

            {/* Componente 4: Transductor Acústico de Neodimio */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                    04
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Audio Premium
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Transductor Acústico de Neodimio & DAC
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Módulo de audio opcional para alertas habladas mediante servicio contratado; sujeto a diseño y validación del hardware.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Voz natural calibrada o tono tecnológico
              </div>
            </div>

            {/* Componente 5: Supercapacitores Anti-Corte */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-mono text-xs font-bold">
                    05
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Respaldo Eléctrico
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Supercapacitores & Filtro Anti-Cortes
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Módulo de almacenamiento electroquímico ultrarrápido que provee hasta 15 segundos de energía limpia ante una interrupción de corriente total en la planta. Registra el corte en su memoria e inmediatamente envía el mensaje de auxilio a WhatsApp antes del apagado.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Alerta de WhatsApp incluso sin luz
              </div>
            </div>

            {/* Componente 6: Magjack & Wi-Fi 6 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono text-xs font-bold">
                    06
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Red Redundante
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Gigabit Ethernet Blindado & Wi-Fi 6
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Puerto metálico RJ45 con bobinas magnéticas internas de 1.5 kV de aislamiento contra descargas atmosféricas, complementado por radio Wi-Fi 6 industrial con micro-antena cerámica SMD dorada para conexión inalámbrica robusta.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Doble enlace cableado e inalámbrico
              </div>
            </div>
          </div>
        </div>

        {/* Aviso de lanzamiento de TERO Security (único producto próximamente) */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={whatsappLink('Hola tecnoros.ar, quiero enterarme cuando lancen TERO Security')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
          >
            <BellRing className="w-4 h-4" />
            Avisame cuando salga TERO Security
          </a>
          <span className="text-sm text-slate-400">CHAJÁ, Golondrina, automatización y robótica ya están disponibles a demanda. TERO Security te lo avisamos por WhatsApp.</span>
        </div>

      </div>
    </section>
  );
};
