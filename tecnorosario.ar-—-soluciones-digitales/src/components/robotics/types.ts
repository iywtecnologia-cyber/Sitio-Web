export type ChassisType = 'mecanum' | 'tracks' | 'wheels' | 'quadruped' | 'differential';

export type MissionModuleType = 'arm' | 'cargo' | 'mast' | 'sensor_dome' | 'conveyor' | 'dispenser';

export type Active3DModel = 'robot' | 'tero' | 'golondrina';

export type RobotScaleType = 'micro' | 'compact' | 'desktop';

export type BatteryType = 'life_po4' | 'li_ion' | 'docking_24_7';

export type IpRatingType = 'ip54' | 'ip65' | 'ip67';

export type RobotModelId = 
  | 'mini_amr'       // Mini-AMR Cleanroom / Mesa (Bandeja portamuestras / PCBs, Mecanum 360°)
  | 'micro_rover'    // Micro-Rover 4x4 (Explorador para cañerías, ductos y zanjas)
  | 'cobot_mobile'   // Mini-Cobot Móvil de Precisión (Brazo servo 4-DOF pick & place)
  | 'micro_walker'   // Micro-Walker Cuadrúpedo (4 patas bioinspiradas con servos de mesa)
  | 'micro_agribot'  // Micro-AgriBot Vertical (Para invernaderos hidropónicos y estanterías)
  | 'caster_dome';   // Caster-Bot Domo 360° (Chasis circular de perfil bajo con sensores 360°)

export interface RobotModelCatalogItem {
  id: RobotModelId;
  name: string;
  category: string;
  badge: string;
  tagline: string;
  dimensionsMm: string;
  weightKg: string;
  maxPayloadKg: string;
  suggestedChassis: ChassisType;
  suggestedModule: MissionModuleType;
  colorHex: string;
  accentColorHex: string;
  description: string;
}

export const ROBOT_MODELS_CATALOG: RobotModelCatalogItem[] = [
  {
    id: 'mini_amr',
    name: 'Mini-AMR Cleanroom',
    category: 'Mesa & Salas Limpias',
    badge: 'Mecanum 360°',
    tagline: 'Transporte de bandejas de PCBs, reactivos y muestras biológicas en laboratorios.',
    dimensionsMm: '280 × 220 × 125 mm',
    weightKg: '3.2 kg',
    maxPayloadKg: '4.5 kg',
    suggestedChassis: 'mecanum',
    suggestedModule: 'cargo',
    colorHex: '#06b6d4',
    accentColorHex: '#1e2430',
    description: 'Chasis plano ultra-bajo de aluminio anodizado con ruedas Mecanum para giros de radio cero entre mesadas y campanas de flujo laminar.',
  },
  {
    id: 'micro_rover',
    name: 'Micro-Rover Explorador 4x4',
    category: 'Inspección de Ductos',
    badge: 'Rocker-Bogie Mini',
    tagline: 'Acceso a cañerías de 200 mm, cámaras de inspección y espacios reducidos.',
    dimensionsMm: '240 × 190 × 135 mm',
    weightKg: '1.8 kg',
    maxPayloadKg: '1.5 kg',
    suggestedChassis: 'wheels',
    suggestedModule: 'mast',
    colorHex: '#f97316',
    accentColorHex: '#18181b',
    description: 'Chasis tubular protegido con jaula antivuelco, neumáticos de micro-tracción 4WD y cabezal de cámara frontal estéreo pan-tilt.',
  },
  {
    id: 'cobot_mobile',
    name: 'Mini-Cobot Móvil de Mesa',
    category: 'Ensamble de Precisión',
    badge: 'Brazo Articulado',
    tagline: 'Alimentación de componentes y testeo de placas electrónicas en bancos de trabajo.',
    dimensionsMm: '310 × 230 × 240 mm',
    weightKg: '4.1 kg',
    maxPayloadKg: '1.2 kg',
    suggestedChassis: 'differential',
    suggestedModule: 'arm',
    colorHex: '#8b5cf6',
    accentColorHex: '#0f172a',
    description: 'Brazo robótico articulado miniatura con 4 servomotores inteligentes Dynamixel y pinza micro-paralela para manipulación fina.',
  },
  {
    id: 'micro_walker',
    name: 'Micro-Walker Cuadrúpedo',
    category: 'Bioinspirado / I+D',
    badge: '4 Patas Servomotoras',
    tagline: 'Investigación académica y paso sobre obstáculos, cables y escalones de laboratorio.',
    dimensionsMm: '260 × 210 × 160 mm',
    weightKg: '2.4 kg',
    maxPayloadKg: '0.9 kg',
    suggestedChassis: 'quadruped',
    suggestedModule: 'sensor_dome',
    colorHex: '#eab308',
    accentColorHex: '#1c1917',
    description: 'Robot caminante bioinspirado de 4 patas articuladas con 8 servos de torque metálico, marcha cinemática inversa y sensores inerciales.',
  },
  {
    id: 'micro_agribot',
    name: 'Micro-AgriBot Invernadero',
    category: 'Hidroponía & Botánica',
    badge: 'Micro-Orugas',
    tagline: 'Monitoreo vertical de nutrientes, humedad foliar y plagas en estanterías hidropónicas.',
    dimensionsMm: '340 × 200 × 190 mm',
    weightKg: '3.6 kg',
    maxPayloadKg: '3.0 kg',
    suggestedChassis: 'tracks',
    suggestedModule: 'conveyor',
    colorHex: '#10b981',
    accentColorHex: '#064e3b',
    description: 'Orugas compactas antideslizantes para canaletas hidropónicas con mástil vertical para sensor multiespectral y micro-aspersión localizada.',
  },
  {
    id: 'caster_dome',
    name: 'Caster-Bot Domo 360°',
    category: 'Vigilancia de Ambientes',
    badge: 'Domo Óptico',
    tagline: 'Rondas silenciosas de telemetría y sensores en salas de servidores y oficinas.',
    dimensionsMm: '250 × 250 × 115 mm',
    weightKg: '2.1 kg',
    maxPayloadKg: '2.0 kg',
    suggestedChassis: 'differential',
    suggestedModule: 'sensor_dome',
    colorHex: '#38bdf8',
    accentColorHex: '#0f172a',
    description: 'Chasis circular aerodinámico con domo protector ahumado, 8 sensores de proximidad de ultrasonido 360° y navegación silenciosa.',
  },
];

export interface RobotColorOption {
  id: string;
  name: string;
  hex: string;
  roughness: number;
  metalness: number;
  badge: string;
}

export const COLOR_PALETTES: { category: string; colors: RobotColorOption[] }[] = [
  {
    category: 'Firma TecnoRosario & Alta Tecnología',
    colors: [
      { id: 'cyber-cyan', name: 'Cyber Cyan TecnoRosario', hex: '#06b6d4', roughness: 0.25, metalness: 0.85, badge: 'Anodizado' },
      { id: 'electric-blue', name: 'Azul Eléctrico Cobalto', hex: '#2563eb', roughness: 0.2, metalness: 0.8, badge: 'Metálico' },
      { id: 'neon-violet', name: 'Violeta Quantum', hex: '#8b5cf6', roughness: 0.3, metalness: 0.75, badge: 'Perlado' },
      { id: 'deep-emerald', name: 'Esmeralda Biónico', hex: '#059669', roughness: 0.25, metalness: 0.7, badge: 'Tecnológico' },
    ],
  },
  {
    category: 'Norma Industrial & Seguridad en Planta',
    colors: [
      { id: 'safety-orange', name: 'Naranja Seguridad ISO', hex: '#f97316', roughness: 0.4, metalness: 0.3, badge: 'Alta Visibilidad' },
      { id: 'heavy-yellow', name: 'Amarillo Maquinaria de Laboratorio', hex: '#eab308', roughness: 0.35, metalness: 0.35, badge: 'Industrial' },
      { id: 'alert-red', name: 'Rojo Alerta Operativa', hex: '#dc2626', roughness: 0.3, metalness: 0.4, badge: 'Seguridad' },
      { id: 'line-green', name: 'Verde Planta Operativa', hex: '#16a34a', roughness: 0.4, metalness: 0.3, badge: 'Producción' },
    ],
  },
  {
    category: 'Táctico & Stealth / Inspección',
    colors: [
      { id: 'stealth-carbon', name: 'Carbon Black Ultra Mate', hex: '#18181b', roughness: 0.85, metalness: 0.15, badge: 'Antirreflejo' },
      { id: 'military-olive', name: 'Verde Oliva Táctico', hex: '#3f4f34', roughness: 0.7, metalness: 0.2, badge: 'Defensa' },
      { id: 'desert-sand', name: 'Arena Táctica Desierto', hex: '#d4a373', roughness: 0.65, metalness: 0.2, badge: 'Camuflaje' },
      { id: 'titanium-gray', name: 'Gris Titanio Forjado', hex: '#475569', roughness: 0.3, metalness: 0.9, badge: 'Titanio' },
    ],
  },
  {
    category: 'Salud, Farmacia & Salas Blancas',
    colors: [
      { id: 'cleanroom-white', name: 'Blanco Puro Farmacéutico', hex: '#f8fafc', roughness: 0.15, metalness: 0.3, badge: 'Grado Quirúrgico' },
      { id: 'antiseptic-cyan', name: 'Celeste Hospitalario', hex: '#bae6fd', roughness: 0.2, metalness: 0.2, badge: 'Antibacterial' },
      { id: 'chrome-silver', name: 'Plata Espejada Inoxidable', hex: '#cbd5e1', roughness: 0.08, metalness: 0.98, badge: 'Espejo' },
      { id: 'matte-bone', name: 'Hueso Sala Blanca', hex: '#e2e8f0', roughness: 0.4, metalness: 0.15, badge: 'Anti-estático' },
    ],
  },
];

export interface RobotConfig {
  robotName: string;
  robotModelId: RobotModelId;
  chassisType: ChassisType;
  missionModule: MissionModuleType;
  robotScale: RobotScaleType;
  // Complete 100% Color Customization
  colorHex: string;
  accentColorHex: string;
  wheelsColorHex: string;
  ledColorHex: string;
  metalness: number;
  roughness: number;
  // Power & Environment
  batteryType: BatteryType;
  ipRating: IpRatingType;
  // Sensors
  hasLidar: boolean;
  hasSafetyLaser: boolean;
  hasStereoVision: boolean;
  hasUltrasonic: boolean;
  hasTelemetry5G: boolean;
  hasGpsRtk: boolean;
  // State & Interactivity
  lightsOn: boolean;
  gripperOpen: boolean;
  explodedAmount: number; // 0 to 1
  // Real-time Simulation
  isSimulatingMotion: boolean;
  isSimulatingScan: boolean;
  isSimulatingTask: boolean;
  isEmergencyStop: boolean;
}

export interface UseCaseTemplate {
  id: string;
  title: string;
  badge: string;
  tagline?: string;
  description: string;
  promptText: string;
  suggestedConfig: Partial<RobotConfig>;
  specsSummary: string;
}

export const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    id: 'logistica-almacen',
    title: 'Salas Limpias & Laboratorios',
    badge: 'Bandejas & Microelectrónica',
    description: 'Navegación milimétrica entre mesadas y campanas de flujo laminar. Transporte de muestras, cajas de reactivos y bandejas de PCBs.',
    promptText: 'Necesito transportar bandejas de circuitos electrónicos y frascos de reactivos entre bancos de trabajo de forma 100% autónoma.',
    suggestedConfig: {
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
    },
    specsSummary: 'Chasis Mecanum 360° + Bandeja Anti-estática + LiDAR SLAM de Mesa + Sensores SIL2',
  },
  {
    id: 'seguridad-perimetral',
    title: 'Inspección de Cañerías & Ductos',
    badge: 'Micro-Rover 4x4',
    tagline: 'Inspección por video de tuberías de 200 mm, zanjas técnicas y cámaras subterráneas.',
    description: 'Exploración de cañerías y ductos industriales inaccesibles para personas, con iluminación LED frontal y cámara HD orientable.',
    promptText: 'Necesito un robot diminuto para inspeccionar el interior de ductos de ventilación y cañerías industriales con cámara térmica.',
    suggestedConfig: {
      robotName: 'MICRO-ROVER-X',
      robotModelId: 'micro_rover',
      chassisType: 'wheels',
      missionModule: 'mast',
      robotScale: 'micro',
      colorHex: '#f97316',
      accentColorHex: '#18181b',
      wheelsColorHex: '#3f3f46',
      ledColorHex: '#f43f5e',
      metalness: 0.4,
      roughness: 0.65,
      batteryType: 'li_ion',
      ipRating: 'ip67',
      hasLidar: true,
      hasSafetyLaser: false,
      hasStereoVision: true,
      hasUltrasonic: true,
      hasTelemetry5G: true,
      hasGpsRtk: false,
    },
    specsSummary: 'Chasis Tubular Compacto + Cabezal PTZ Infrarrojo + Enlace Inalámbrico + Sellado IP67',
  },
  {
    id: 'ensamble-cobot',
    title: 'Pick & Place de Banco de Trabajo',
    badge: 'Mini-Cobot Móvil',
    description: 'Base móvil pequeña que se posiciona frente a impresoras 3D, fresadoras CNC o bancos de test para mover piezas con micro-pinza.',
    promptText: 'Necesito un robot pequeño de mesa para alimentar piezas a una máquina de pruebas y clasificarlas automáticamente.',
    suggestedConfig: {
      robotName: 'COBOT-MINI-4',
      robotModelId: 'cobot_mobile',
      chassisType: 'differential',
      missionModule: 'arm',
      robotScale: 'compact',
      colorHex: '#8b5cf6',
      accentColorHex: '#0f172a',
      wheelsColorHex: '#cbd5e1',
      ledColorHex: '#22d3ee',
      metalness: 0.6,
      roughness: 0.3,
      batteryType: 'li_ion',
      ipRating: 'ip54',
      hasLidar: true,
      hasSafetyLaser: true,
      hasStereoVision: true,
      hasUltrasonic: true,
      hasTelemetry5G: true,
      hasGpsRtk: false,
      gripperOpen: true,
    },
    specsSummary: 'Base Diferencial Fina + Brazo 4-DOF con Micro-Servos + Pinza Paralela + Visión Estéreo',
  },
  {
    id: 'desinfeccion-limpieza',
    title: 'Vigilancia Silenciosa & Salas de Servidores',
    badge: 'Caster-Bot Domo 360°',
    description: 'Rondas autónomas entre racks de servidores e instalaciones corporativas, monitoreando temperatura, humedad y gases.',
    promptText: 'Necesito un robot circular bajo y silencioso para recorrer el pasillo frío del datacenter y medir temperatura de racks.',
    suggestedConfig: {
      robotName: 'DOME-CASTER-360',
      robotModelId: 'caster_dome',
      chassisType: 'differential',
      missionModule: 'sensor_dome',
      robotScale: 'compact',
      colorHex: '#38bdf8',
      accentColorHex: '#0f172a',
      wheelsColorHex: '#cbd5e1',
      ledColorHex: '#10b981',
      metalness: 0.3,
      roughness: 0.15,
      batteryType: 'docking_24_7',
      ipRating: 'ip54',
      hasLidar: true,
      hasSafetyLaser: true,
      hasStereoVision: true,
      hasUltrasonic: true,
      hasTelemetry5G: true,
      hasGpsRtk: false,
    },
    specsSummary: 'Chasis Circular AGV + Domo Ahumado Protector + Sensores 360° + Docking Autónomo',
  },
  {
    id: 'agro-campo',
    title: 'Investigación & Robótica Bioinspirada',
    badge: 'Micro-Walker Cuadrúpedo',
    description: 'Prototipo cuadrúpedo compacto para investigación académica y sorteo de obstáculos de mesa, zanjas pequeñas y escalones.',
    promptText: 'Necesitamos una plataforma cuadrúpeda de tamaño de mesa para proyectos de investigación en cinemática y control.',
    suggestedConfig: {
      robotName: 'TERO-WALKER-MINI',
      robotModelId: 'micro_walker',
      chassisType: 'quadruped',
      missionModule: 'sensor_dome',
      robotScale: 'micro',
      colorHex: '#eab308',
      accentColorHex: '#1c1917',
      wheelsColorHex: '#78716c',
      ledColorHex: '#06b6d4',
      metalness: 0.45,
      roughness: 0.35,
      batteryType: 'li_ion',
      ipRating: 'ip54',
      hasLidar: true,
      hasSafetyLaser: false,
      hasStereoVision: true,
      hasUltrasonic: true,
      hasTelemetry5G: true,
      hasGpsRtk: false,
    },
    specsSummary: 'Base Cuadrúpeda Articulada 8-Servo + IMU de Alta Precisión + Cámara RGB-D',
  },
  {
    id: 'distribucion-conveyor',
    title: 'Invernaderos & Estanterías Hidropónicas',
    badge: 'Micro-AgriBot Orugas',
    tagline: 'Monitoreo vertical de cultivos.',
    description: 'Navegación estrecha sobre canaletas y rieles de hidroponía vertical con mástil sensor para inspección de follaje y micro-riego.',
    promptText: 'Necesito un robot estrecho para recorrer los pasillos de nuestro invernadero hidropónico y chequear la salud foliar.',
    suggestedConfig: {
      robotName: 'AGRIBOT-MINI',
      robotModelId: 'micro_agribot',
      chassisType: 'tracks',
      missionModule: 'mast',
      robotScale: 'compact',
      colorHex: '#10b981',
      accentColorHex: '#064e3b',
      wheelsColorHex: '#334155',
      ledColorHex: '#22d3ee',
      metalness: 0.5,
      roughness: 0.35,
      batteryType: 'life_po4',
      ipRating: 'ip65',
      hasLidar: true,
      hasSafetyLaser: true,
      hasStereoVision: true,
      hasUltrasonic: true,
      hasTelemetry5G: true,
      hasGpsRtk: false,
    },
    specsSummary: 'Micro-Orugas de Goma + Mástil Vertical Multispectral + Chasis Resistente al Agua IP65',
  },
];
