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
  Sliders
} from 'lucide-react';
import { HardwareSystemCanvas3D } from './systems/HardwareSystemCanvas3D';
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
    id: 'software-ciberseguridad',
    icon: ShieldCheck,
    title: 'TERO Security',
    tagline: 'Appliance físico de red IDS/IPS & auditoría continua.',
    description: 'Sistema de ciberseguridad a medida: equipo hardware plug & play para monitoreo perimetral, firewall criptográfico, inspección de paquetes en tiempo real y detección temprana de anomalías en redes corporativas.',
    priceUsd: 250,
    priceArs: 300000,
    category: 'Ciberseguridad & Hardware Appliance',
    specs: [
      '4 puertos RJ45 Gigabit blindados',
      'Microcomputadora con módulo criptográfico dedicado',
      'Pantalla OLED frontal con telemetría en vivo',
      'Antenas duales de alta ganancia Wi-Fi / 5G',
      'Carcasa impresa en 3D PETG/ABS de alta densidad'
    ]
  },
  {
    id: 'golondrina-automatizacion',
    icon: Workflow,
    title: 'Golondrina Automatización',
    tagline: 'Módulo de sensado de alta precisión en negro mate con conectores dorados.',
    description: 'Sistema a medida de adquisición y sensado continuo: carcasa monobloque en negro mate anodizado con transductores acústicos ultrasónicos, sensor óptico Time-of-Flight (ToF) y conectores dorados de precisión de baja impedancia.',
    priceUsd: 190,
    priceArs: 228000,
    category: 'Sensores & Automatización',
    specs: [
      'Carcasa de bajo perfil en negro mate anodizado de alta durabilidad',
      'Sensores integrados: ToF óptico infrarrojo y transductores acústicos 40kHz',
      'Conectores dorados de precisión (latón enchapado en oro 24K anticorrosión)',
      'Adquisición de telemetría en tiempo real y bus de alta velocidad',
      'Display OLED superior de diagnóstico con micro-LEDs de estado',
      'Puertos SMA/M12 dorados para expansión y sondas externas'
    ]
  },
  {
    id: 'carancho-robotica',
    icon: Bot,
    title: 'Carancho Robótica Autónoma',
    tagline: 'Investigación y desarrollo en robótica de precisión.',
    description: 'Nuestra división de robótica autónoma e inteligencia contextual: micro-rovers de inspección, AMRs de laboratorio y robots compactos de banco diseñados a medida en Rosario.',
    priceUsd: 0,
    priceArs: 0,
    category: 'Robótica de Precisión',
    specs: [
      'Escala compacta de banco y laboratorio (15 a 35 cm)',
      'Cinemática ROS 2 con LiDAR láser y SLAM',
      'Baterías LiFePO4 de carga rápida y autonomía extendida',
      'Chasis mecanum, orugas de goma dentada y 4WD',
      'Inspección y simulación en tiempo real disponible'
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
      aria-label="En el laboratorio: próximamente. Estamos en fase de creación"
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
        EN NUESTRO LABORATORIO DE HARDWARE & SISTEMAS
      </span>
      <span aria-hidden="true" className="relative block mt-2 font-mono text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.16em] sm:tracking-[0.22em] text-white group-hover:text-cyan-200 transition-colors">
        {texto}
      </span>
      <span aria-hidden="true" className="relative block mt-2 text-sm sm:text-base text-slate-300">
        Estamos en fase de fabricación y pruebas de campo<span className="inline-block w-[0.6ch] animate-pulse motion-reduce:animate-none">_</span>
      </span>
      <span aria-hidden="true" className="relative block mx-auto mt-4 h-1 w-40 sm:w-56 rounded-full bg-slate-800 overflow-hidden">
        <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-[creando_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <style>{'@keyframes creando{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}'}</style>
    </button>
  );
};

export const ProductosPropios: React.FC = () => {
  // Dispositivo de hardware seleccionado en el laboratorio 3D
  const [selectedSystem, setSelectedSystem] = useState<'tero' | 'golondrina'>('tero');
  const [customFilament, setCustomFilament] = useState(false);
  const [filamentColorHex, setFilamentColorHex] = useState('#06b6d4');

  const activeData = selectedSystem === 'tero' ? PRODUCTOS[0] : PRODUCTOS[1];

  const handleSelectCard = (id: string) => {
    if (id === 'software-ciberseguridad') {
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

  const handleWhatsAppQuote = () => {
    const filamentoMsg = customFilament
      ? `\n- Color de carcasa a medida para la marca: ${filamentColorHex} (+$22.000 ARS)`
      : '\n- Carcasa estándar: Negro Mate industrial (incluido)';

    const text = selectedSystem === 'tero'
      ? `¡Hola TecnoRosario! Quiero cotizar el sistema y equipo físico *TERO Security* (250 USD / ~$300.000 ARS):${filamentoMsg}\n\n¿Podemos coordinar para evaluar la entrega y puesta en marcha en nuestra red?`
      : `¡Hola TecnoRosario! Quiero cotizar el sistema de sensores y hardware *Golondrina Automatización* (190 USD / ~$228.000 ARS):${filamentoMsg}\n\n¿Podemos coordinar para evaluar la implementación en nuestras instalaciones?`;

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
            No son robótica convencional: son <strong className="text-white">sistemas a medida dentro de sus sistemas</strong>. Appliances de ciberseguridad y hubs modulares de automatización sobre riel DIN diseñados, programados y fabricados por TecnoRosario.
          </p>
        </div>

        <CartelProximamente />

        {/* Tarjetas de Productos Propios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PRODUCTOS.map((prod) => {
            const { id, icon: Icon, title, tagline, description, priceUsd, priceArs } = prod;
            const isRobotica = id === 'carancho-robotica';

            return (
              <div 
                key={id} 
                id={`producto-${id}`} 
                className="scroll-mt-28 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    {!isRobotica ? (
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                        {dolares(priceUsd)} (~{pesos(priceArs)})
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-violet-300 bg-violet-950/70 border border-violet-500/30 px-2.5 py-1 rounded-lg">
                        Proyecto I+D
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h3>
                  {tagline && (
                    <p className="mt-2 text-xs sm:text-sm text-cyan-300 font-semibold leading-relaxed">
                      {tagline}
                    </p>
                  )}
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
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
                    <span>{isRobotica ? 'Ver Laboratorio de Robótica 3D' : 'Inspeccionar Equipo en 3D'}</span>
                    <span className="text-cyan-400 group-hover/b3d:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            ESTUDIO 3D EXCLUSIVO DE SISTEMAS Y HARDWARE A MEDIDA (TERO Y GOLONDRINA)
            ========================================================================= */}
        <div id="hardware-studio-3d" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070b14] border border-cyan-500/30 shadow-2xl space-y-6">
          
          {/* Header del Laboratorio 3D de Sistemas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Banco de Ensayo e Inspección 3D Interactiva</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Inspección 3D de Dispositivos y Sistemas a Medida
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Rotación esférica 360° en todas las dimensiones (arrastrá libremente para ver el frente, los laterales o mirar desde abajo). La rueda del mouse (<strong className="text-cyan-300">"la ruedita"</strong>) funciona por contexto para zoom o scroll.
              </p>
            </div>

            {/* Selector de Dispositivo Hardware Propio */}
            <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSystem('tero')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSystem === 'tero'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>TERO Security (250 USD)</span>
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
                <span>Golondrina Riel DIN (190 USD)</span>
              </button>
            </div>
          </div>

          {/* Grid Principal: Visor 3D a la izquierda, Panel de Especificaciones a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Visor 3D Interactivo con Rueda de Zoom Directa */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <HardwareSystemCanvas3D
                systemType={selectedSystem}
                filamentColor={customFilament ? filamentColorHex : '#18181b'}
              />

              {/* Barra de Ayuda y Zoom */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Rueda del mouse: Zoom interactivo directo continuo</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Fabricado localmente en Rosario con termoplásticos técnicos PETG/ABS
                </span>
              </div>
            </div>

            {/* Columna Derecha: Detalles del Sistema y Cotización */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {activeData.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Equipo Físico Listo
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">{activeData.title}</h4>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-cyan-300 font-mono">
                      {dolares(activeData.priceUsd)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (~{pesos(activeData.priceArs)} ARS)
                    </span>
                  </div>
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
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Cotizar {activeData.title} en WhatsApp</span>
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

        {/* Notificación de lanzamientos */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={whatsappLink('Hola tecnoros.ar, quiero enterarme cuando lancen nuevos dispositivos de hardware y sistemas propios')}
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
};
