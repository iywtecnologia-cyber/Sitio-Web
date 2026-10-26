import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Layers, 
  Settings2, 
  Sparkles, 
  Check, 
  RotateCw, 
  Send, 
  Zap, 
  BatteryCharging, 
  Gauge, 
  Weight, 
  Crosshair,
  Lightbulb,
  Radar,
  Play,
  Square,
  AlertTriangle,
  HelpCircle,
  Shield,
  Info,
  Maximize2
} from 'lucide-react';
import { RobotCanvas3D } from './RobotCanvas3D';
import { PlegableMovil } from '../PlegableMovil';
import { 
  RobotConfig, 
  ChassisType, 
  MissionModuleType, 
  RobotScaleType,
  BatteryType,
  IpRatingType,
  RobotModelId,
  ROBOT_MODELS_CATALOG,
  COLOR_PALETTES,
  USE_CASE_TEMPLATES,
  UseCaseTemplate
} from './types';

export const RobotStudioSection: React.FC = () => {
  // Mode in Robot: 'use-case' (Need-guided design) or 'free-custom' (100% customization)
  const [activeTab, setActiveTab] = useState<'use-case' | 'free-custom'>('free-custom');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('logistica-almacen');
  const [customNeedText, setCustomNeedText] = useState<string>('');

  // 100% Robot Configuration State (Miniature Tabletop / Bench Scale)
  const [robotConfig, setRobotConfig] = useState<RobotConfig>({
    robotName: 'MINI-AMR-280',
    robotModelId: 'mini_amr',
    chassisType: 'mecanum',
    missionModule: 'cargo',
    robotScale: 'compact',
    colorHex: '#06b6d4',
    accentColorHex: '#1e2430',
    wheelsColorHex: '#f1f5f9',
    ledColorHex: '#22d3ee',
    metalness: 0.85,
    roughness: 0.25,
    batteryType: 'docking_24_7',
    ipRating: 'ip54',
    hasLidar: true,
    hasSafetyLaser: true,
    hasStereoVision: true,
    hasUltrasonic: true,
    hasTelemetry5G: true,
    hasGpsRtk: false,
    lightsOn: true,
    gripperOpen: false,
    explodedAmount: 0,
    isSimulatingMotion: true,
    isSimulatingScan: true,
    isSimulatingTask: true,
    isEmergencyStop: false,
  });

  const [autoRotate, setAutoRotate] = useState(false);
  const [showExplodedInfo, setShowExplodedInfo] = useState(false);

  // Switch between miniature robot models
  const handleSelectRobotModel = (modelId: RobotModelId) => {
    const catalogItem = ROBOT_MODELS_CATALOG.find((m) => m.id === modelId);
    if (!catalogItem) return;

    setRobotConfig((prev) => ({
      ...prev,
      robotModelId: modelId,
      robotName: catalogItem.name.toUpperCase().replace(/\s+/g, '-').slice(0, 16),
      chassisType: catalogItem.suggestedChassis,
      missionModule: catalogItem.suggestedModule,
      colorHex: catalogItem.colorHex,
      accentColorHex: catalogItem.accentColorHex,
    }));
  };

  // Active Template
  const activeTemplate = useMemo(() => {
    return USE_CASE_TEMPLATES.find((t) => t.id === selectedTemplateId) || USE_CASE_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Apply template
  const handleApplyTemplate = (tmpl: UseCaseTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setRobotConfig((prev) => ({
      ...prev,
      ...tmpl.suggestedConfig,
    }));
  };

  // Dynamic Miniature Specs Calculator (Tabletop / Bench scale: 1.2 kg to 7.5 kg)
  const currentSpecs = useMemo(() => {
    let payload = 3.5;
    let speed = 4.2; // km/h
    let battery = 8; // hs
    let weight = 3.2; // kg

    // Model baseline
    const curModel = ROBOT_MODELS_CATALOG.find((m) => m.id === robotConfig.robotModelId);
    if (curModel) {
      payload = parseFloat(curModel.maxPayloadKg);
      weight = parseFloat(curModel.weightKg);
    }

    // Chassis adjustments
    if (robotConfig.chassisType === 'mecanum') {
      speed = 3.8;
      battery = 9;
    } else if (robotConfig.chassisType === 'tracks') {
      speed = 4.8;
      battery = 7;
      weight += 0.5;
    } else if (robotConfig.chassisType === 'quadruped') {
      speed = 3.2;
      battery = 5;
      payload = Math.min(payload, 1.2);
    } else if (robotConfig.chassisType === 'differential') {
      speed = 4.5;
      battery = 10;
    } else {
      speed = 5.2;
      battery = 8;
    }

    // Scale adjustments (Miniature proportions)
    let dimensions = '280 × 220 × 125 mm';
    if (robotConfig.robotScale === 'micro') {
      payload = parseFloat((payload * 0.6).toFixed(1));
      weight = parseFloat((weight * 0.65).toFixed(1));
      dimensions = '180 × 140 × 95 mm';
    } else if (robotConfig.robotScale === 'desktop') {
      payload = parseFloat((payload * 1.5).toFixed(1));
      weight = parseFloat((weight * 1.6).toFixed(1));
      dimensions = '380 × 290 × 180 mm';
    } else {
      dimensions = curModel?.dimensionsMm || '280 × 220 × 125 mm';
    }

    // Battery adjustments
    if (robotConfig.batteryType === 'li_ion') battery = Math.round(battery * 1.25);
    if (robotConfig.batteryType === 'docking_24_7') battery = 24;

    return {
      maxPayloadKg: payload,
      maxSpeedKmH: speed,
      batteryHours: battery,
      slamAccuracyMm: robotConfig.hasLidar ? 2 : 10,
      weightKg: weight,
      dimensions,
    };
  }, [robotConfig.robotModelId, robotConfig.chassisType, robotConfig.robotScale, robotConfig.batteryType, robotConfig.hasLidar]);

  // Handle WhatsApp Quotation
  const handleQuoteClick = () => {
    const chassisLabels: Record<ChassisType, string> = {
      mecanum: 'Mecanum 360° Omnidireccional',
      tracks: 'Micro-Orugas Continuas de Goma',
      wheels: '4WD Neumáticos Compactos',
      quadruped: 'Base Cuadrúpeda 4 Patas Bioinspirada',
      differential: 'Tracción Diferencial AGV para Banco/Mesa',
    };

    const moduleLabels: Record<MissionModuleType, string> = {
      arm: 'Brazo Robótico Articulado 4-DOF con Micro-Pinza',
      cargo: 'Bandeja Anti-estática para Muestras y PCBs',
      mast: 'Mástil Telescópico con Cámara PTZ',
      sensor_dome: 'Domo Protector Ahumado con Sensores 360°',
      conveyor: 'Cama de Rodillos de Transferencia',
      dispenser: 'Compartimento Seguro de Mesa',
    };

    const userNeed = customNeedText ? `\n- Necesidad del software / algoritmo: "${customNeedText}"` : '';
    const text = `¡Hola TecnoRosario! Probé el simulador 3D del cerebro robótico en la web:\n\n- Arquitectura de Simulación: ${robotConfig.robotName} (${robotConfig.robotModelId})\n- Cinemática / Tracción simulada: ${chassisLabels[robotConfig.chassisType]}\n- Tarea del software: ${moduleLabels[robotConfig.missionModule]}\n- Módulos de percepción: LiDAR (${robotConfig.hasLidar ? 'Sí' : 'No'}), Láser SIL2 (${robotConfig.hasSafetyLaser ? 'Sí' : 'No'}), Visión Estéreo (${robotConfig.hasStereoVision ? 'Sí' : 'No'}), Telemetría (${robotConfig.hasTelemetry5G ? 'Sí' : 'No'})${userNeed}\n\n¿Podemos coordinar una reunión para evaluar primero el desarrollo del cerebro/software robótico y la viabilidad técnica para incorporar y fabricar el cuerpo físico para nuestra empresa?`;

    window.open(`https://wa.me/5493415112000?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="robotica-3d" className="py-14 sm:py-20 bg-[#060810] border-t border-slate-800/60 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-violet-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado corto: qué hacemos en una frase y los 2 pasos */}
        <div className="mb-8 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Robótica a medida
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            Desarrollo del cerebro robótico y fabricación física a medida
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Primero programamos el cerebro del robot y lo probás en 3D. Si funciona, fabricamos el cuerpo.
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
            <li className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
              <span className="w-9 h-9 rounded-full bg-cyan-400 text-slate-950 font-black flex items-center justify-center shrink-0">1</span>
              <span><strong className="block text-white text-base">El cerebro</strong><span className="text-sm text-slate-300">Lo programamos y lo probás en 3D</span></span>
            </li>
            <li className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/90 border border-violet-500/30">
              <span className="w-9 h-9 rounded-full bg-violet-400 text-slate-950 font-black flex items-center justify-center shrink-0">2</span>
              <span><strong className="block text-white text-base">El cuerpo</strong><span className="text-sm text-slate-300">Lo fabricamos si es viable</span></span>
            </li>
          </ol>
          <a
            href="https://airclub-udesa.github.io/jar_site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-500/10 border border-violet-400/40 text-violet-200 hover:bg-violet-500/20 text-sm font-semibold transition-colors"
          >
            <span aria-hidden="true">🏁</span>
            <span>Rumbo al Challenge JAR 2026: estamos desarrollando nuestro robot para participar</span>
          </a>
        </div>

        {/* Model Selector Carousel / Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <strong className="text-white">Modelos Base en Miniatura Disponibles</strong> (Elegí uno para inspeccionar su diseño):
            </span>
            <span className="text-[11px] text-cyan-300 hidden sm:inline">
              Todos de escala compacta para banco, laboratorio o ductos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ROBOT_MODELS_CATALOG.map((m) => {
              const isSelected = robotConfig.robotModelId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectRobotModel(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                        {m.badge}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{m.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{m.category}</div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400/90">
                    {m.dimensionsMm.split('×')[0]} mm • {m.weightKg}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Sub-Header & Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('free-custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'free-custom'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Personalización 100% Libre</span>
            </button>
            <button
              onClick={() => setActiveTab('use-case')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'use-case'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Para qué lo necesitás? (Casos de Uso)</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Modelo en Banco:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              {robotConfig.robotName}
            </span>
            <div
              className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
              style={{ backgroundColor: robotConfig.colorHex }}
              title="Color Principal"
            />
            <div
              className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: robotConfig.accentColorHex }}
              title="Color Acentos"
            />
          </div>
        </div>

        {/* Main 3D Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Central 3D Canvas Viewport */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top Viewport HUD Bar */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-white font-semibold">
                  Prototipo: {robotConfig.robotName} ({currentSpecs.dimensions} • {currentSpecs.weightKg} kg)
                </span>
              </div>

              {/* Interactivity Shortcuts */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors flex items-center gap-1 cursor-pointer ${
                    autoRotate
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Giro continuo automático"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Auto-Giro</span>
                </button>

                <button
                  onClick={() =>
                    setRobotConfig((prev) => ({ ...prev, lightsOn: !prev.lightsOn }))
                  }
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors flex items-center gap-1 cursor-pointer ${
                    robotConfig.lightsOn
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>{robotConfig.lightsOn ? 'Luces ON' : 'Luces OFF'}</span>
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <RobotCanvas3D
              modelType="robot"
              config={robotConfig}
              autoRotate={autoRotate}
              onToggleMotion={() =>
                setRobotConfig((prev) => ({
                  ...prev,
                  isSimulatingMotion: !prev.isSimulatingMotion,
                }))
              }
            />

            {/* Exploded View Slider */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Layers className="w-4 h-4" />
                  <span className="font-semibold">Vista Explosionada del Hardware</span>
                </div>
                <span className="text-slate-400">
                  Separación: {Math.round(robotConfig.explodedAmount * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={robotConfig.explodedAmount}
                onChange={(e) =>
                  setRobotConfig((prev) => ({
                    ...prev,
                    explodedAmount: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0% Ensamblado Completo</span>
                <span>50% Separación Parcial</span>
                <span>100% Despiece Total de Placas</span>
              </div>
            </div>

            {/* Actuators & Simulation Panel */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Crosshair className="w-4 h-4" />
                    <span className="font-semibold">Simulador de Ensayo en Banco (Vida Real)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Trayectoria 100% contenida en el banco</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() =>
                      setRobotConfig((prev) => ({
                        ...prev,
                        isSimulatingMotion: !prev.isSimulatingMotion,
                      }))
                    }
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      robotConfig.isSimulatingMotion
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {robotConfig.isSimulatingMotion ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3" />}
                    <span>Ruedas / Marcha</span>
                  </button>

                  <button
                    onClick={() =>
                      setRobotConfig((prev) => ({
                        ...prev,
                        isSimulatingScan: !prev.isSimulatingScan,
                      }))
                    }
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      robotConfig.isSimulatingScan
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Radar className="w-3 h-3" />
                    <span>Haz Láser LiDAR</span>
                  </button>

                  <button
                    onClick={() =>
                      setRobotConfig((prev) => ({
                        ...prev,
                        isSimulatingTask: !prev.isSimulatingTask,
                      }))
                    }
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      robotConfig.isSimulatingTask
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Misión / Brazo</span>
                  </button>

                  <button
                    onClick={() =>
                      setRobotConfig((prev) => ({
                        ...prev,
                        isEmergencyStop: !prev.isEmergencyStop,
                      }))
                    }
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      robotConfig.isEmergencyStop
                        ? 'bg-rose-500/30 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Parada SIL2</span>
                  </button>
                </div>
              </div>

            {/* Performance & Specifications Bar (Authentic Miniature / Bench Specs) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Dimensiones Reales</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentSpecs.dimensions}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                  <Weight className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Peso / Carga Útil</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentSpecs.weightKg} kg / {currentSpecs.maxPayloadKg} kg</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Autonomía</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentSpecs.batteryHours} horas</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Protección IP</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{robotConfig.ipRating.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: 100% Customization Controls */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {activeTab === 'use-case' ? (
              /* USE CASE ASSISTANT */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-1">
                    ¿Para qué necesitás un robot en tu empresa?
                  </h4>
                  <p className="text-xs text-slate-300 mb-3">
                    Elegí tu objetivo o escribí tu necesidad particular:
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {USE_CASE_TEMPLATES.map((tmpl) => {
                      const isSel = tmpl.id === selectedTemplateId;
                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => handleApplyTemplate(tmpl)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-slate-800/90 border-cyan-400/80 shadow-md shadow-cyan-500/10'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-white">{tmpl.title}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                              {tmpl.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">{tmpl.description}</p>
                          <div className="text-[10px] font-mono text-cyan-300">
                            ✦ {tmpl.specsSummary}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="block text-xs font-mono text-slate-300">
                    O describinos tu necesidad particular:
                  </label>
                  <textarea
                    rows={2}
                    value={customNeedText}
                    onChange={(e) => setCustomNeedText(e.target.value)}
                    placeholder="Ej: Mover bandejas de reactivos en campana de laboratorio o inspeccionar cañería de 200 mm..."
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>
            ) : (
              /* 100% TOTAL CUSTOMIZATION PANEL */
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 max-h-[640px] overflow-y-auto pr-2">
                
                {/* 0. Robot Name & Scale */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    0. Identificación & Escala de Banco
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={robotConfig.robotName}
                      onChange={(e) =>
                        setRobotConfig((prev) => ({ ...prev, robotName: e.target.value }))
                      }
                      placeholder="Nombre del Robot / Tu Empresa"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                    />

                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      {[
                        { id: 'micro' as RobotScaleType, label: 'Micro-Mesa', sub: '180×140 mm' },
                        { id: 'compact' as RobotScaleType, label: 'AMR Lab', sub: '280×220 mm' },
                        { id: 'desktop' as RobotScaleType, label: 'Inspector', sub: '380×290 mm' },
                      ].map((sc) => (
                        <button
                          key={sc.id}
                          onClick={() => setRobotConfig((prev) => ({ ...prev, robotScale: sc.id }))}
                          className={`p-1.5 rounded-lg border font-mono text-[11px] transition-colors cursor-pointer ${
                            robotConfig.robotScale === sc.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          <div>{sc.label}</div>
                          <div className="text-[9px] text-cyan-400/80">{sc.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1. Chassis / Traction */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    1. Tracción & Chasis
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'mecanum' as ChassisType, label: 'Mecanum 360°', sub: 'Giro en su eje (Radio cero)' },
                      { id: 'tracks' as ChassisType, label: 'Micro-Orugas', sub: 'Estanterías y canaletas' },
                      { id: 'wheels' as ChassisType, label: '4WD Compacto', sub: 'Neumáticos de micro-tracción' },
                      { id: 'quadruped' as ChassisType, label: '4 Patas Robot Dog', sub: 'Obstáculos y cables' },
                      { id: 'differential' as ChassisType, label: 'Diferencial AGV', sub: 'Bancos lisos y mesas' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          setRobotConfig((prev) => ({ ...prev, chassisType: item.id }))
                        }
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          robotConfig.chassisType === item.id
                            ? 'bg-cyan-500/15 border-cyan-400 text-white'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Mission Module */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    2. Módulo de Trabajo / Herramienta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'arm' as MissionModuleType, label: 'Brazo Cobot 4-DOF', sub: 'Micro-pinza servo' },
                      { id: 'cargo' as MissionModuleType, label: 'Bandeja Muestras', sub: 'PCBs y frascos de laboratorio' },
                      { id: 'conveyor' as MissionModuleType, label: 'Micro-Rodillos', sub: 'Transferencia automática' },
                      { id: 'mast' as MissionModuleType, label: 'Mástil PTZ', sub: 'Cámaras térmicas e IR' },
                      { id: 'sensor_dome' as MissionModuleType, label: 'Domo Ahumado', sub: 'Sensores 360° protegidos' },
                      { id: 'dispenser' as MissionModuleType, label: 'Locker Seguro', sub: 'Entrega autónoma de mesa' },
                    ].map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() =>
                          setRobotConfig((prev) => ({ ...prev, missionModule: mod.id }))
                        }
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          robotConfig.missionModule === mod.id
                            ? 'bg-cyan-500/15 border-cyan-400 text-white'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{mod.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{mod.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Total Colors & Finishes */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    3. Carrocería & Colores al 100%
                  </label>

                  {/* Primary Color Picker */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-300">Pintura Principal:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={robotConfig.colorHex}
                        onChange={(e) =>
                          setRobotConfig((prev) => ({ ...prev, colorHex: e.target.value }))
                        }
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-white">{robotConfig.colorHex}</span>
                    </div>
                  </div>

                  {/* Secondary Accent Color Picker */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-300">Acentos y Perfiles:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={robotConfig.accentColorHex}
                        onChange={(e) =>
                          setRobotConfig((prev) => ({ ...prev, accentColorHex: e.target.value }))
                        }
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-white">{robotConfig.accentColorHex}</span>
                    </div>
                  </div>

                  {/* Quick Color Presets */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-400">Paletas Industriales de Referencia:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {COLOR_PALETTES[0].colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() =>
                            setRobotConfig((prev) => ({
                              ...prev,
                              colorHex: c.hex,
                              metalness: c.metalness,
                              roughness: c.roughness,
                            }))
                          }
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-950 flex flex-col items-center gap-1 hover:border-cyan-400 transition-colors cursor-pointer"
                          title={c.name}
                        >
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: c.hex }} />
                          <span className="text-[9px] font-mono text-slate-300 truncate w-full text-center">
                            {c.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Battery & Power */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      4. Pack de Batería de Litio
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'li_ion' as BatteryType, label: 'Li-Ion 18650', sub: 'Ligera' },
                        { id: 'life_po4' as BatteryType, label: 'LiFePO4', sub: '3000 ciclos' },
                        { id: 'docking_24_7' as BatteryType, label: 'Docking 24/7', sub: 'Carga cont.' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setRobotConfig((prev) => ({ ...prev, batteryType: b.id }))}
                          className={`p-2 rounded-lg border text-center font-mono text-[11px] transition-all cursor-pointer ${
                            robotConfig.batteryType === b.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          <div>{b.label}</div>
                          <div className="text-[9px] text-cyan-400/80">{b.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      5. Grado de Protección Ambiental
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'ip54' as IpRatingType, label: 'IP54 (Lab/Mesa)' },
                        { id: 'ip65' as IpRatingType, label: 'IP65 (Polvo/Salpic.)' },
                        { id: 'ip67' as IpRatingType, label: 'IP67 (Ductos/Húmedo)' },
                      ].map((ip) => (
                        <button
                          key={ip.id}
                          onClick={() => setRobotConfig((prev) => ({ ...prev, ipRating: ip.id }))}
                          className={`p-2 rounded-lg border text-center font-mono text-[11px] transition-all cursor-pointer ${
                            robotConfig.ipRating === ip.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          {ip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Sensor Pack */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    6. Pack de Sensores & Navegación
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { key: 'hasLidar' as const, label: 'LiDAR Láser 360° Micro-Puck (SLAM)' },
                      { key: 'hasSafetyLaser' as const, label: 'Láser de Seguridad Frontal SIL2' },
                      { key: 'hasStereoVision' as const, label: 'Cámaras de Visión Estéreo RGB-D' },
                      { key: 'hasTelemetry5G' as const, label: 'Módulo Wi-Fi Industrial / 5G' },
                    ].map((sensor) => {
                      const isChecked = robotConfig[sensor.key];
                      return (
                        <div
                          key={sensor.key}
                          onClick={() =>
                            setRobotConfig((prev) => ({
                              ...prev,
                              [sensor.key]: !prev[sensor.key],
                            }))
                          }
                          className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-slate-800 border-cyan-500/50'
                              : 'bg-slate-900/60 border-slate-800 text-slate-500'
                          }`}
                        >
                          <span className={`text-xs ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                            {sensor.label}
                          </span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Action Box: Direct WhatsApp Quotation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Hecho en Rosario</span>
              </div>
              <h4 className="text-lg font-bold text-white leading-snug">
                ¿Querés un robot para tu negocio?
              </h4>
              <p className="text-sm text-slate-300">
                Empezamos por el cerebro y lo ves en 3D antes de gastar en materiales.
              </p>
              <button
                onClick={handleQuoteClick}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Cotizar mi robot</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
