import * as THREE from 'three';
import { RobotConfig, ChassisType, MissionModuleType, Active3DModel, RobotModelId } from './types';

export interface RobotModelParts {
  rootGroup: THREE.Group;
  chassisGroup: THREE.Group;
  wheelsGroup: THREE.Group;
  internalsGroup: THREE.Group;
  moduleGroup: THREE.Group;
  sensorsGroup: THREE.Group;
  simulationGroup: THREE.Group;
  lidarHead: THREE.Object3D | null;
  laserScanMesh: THREE.Mesh | null;
  safetyArcMesh: THREE.Mesh | null;
  leftGripperFinger: THREE.Object3D | null;
  rightGripperFinger: THREE.Object3D | null;
  armShoulder: THREE.Object3D | null;
  armElbow: THREE.Object3D | null;
  mastHead: THREE.Object3D | null;
  conveyorRollers: THREE.Object3D[];
  wheelsList: THREE.Object3D[];
  beaconLight: THREE.Mesh | null;
  frontLights: THREE.Mesh[];
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
}

// =========================================================================
// TEXTURAS PROCEDURALES PBR DE ALTA DEFINICIÓN (Sin dependencias externas)
// =========================================================================

let cachedTreadTex: THREE.CanvasTexture | null = null;
function getTreadTexture(): THREE.CanvasTexture {
  if (cachedTreadTex) return cachedTreadTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#606060';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#181818';
  const lugs = 16;
  const step = 512 / lugs;
  for (let i = 0; i < lugs; i++) {
    const x = i * step;
    ctx.fillRect(x + 2, 114, step - 6, 28);

    ctx.beginPath();
    ctx.moveTo(x + 4, 16);
    ctx.lineTo(x + step - 4, 98);
    ctx.lineTo(x + step - 18, 98);
    ctx.lineTo(x - 8, 16);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + step - 4, 240);
    ctx.lineTo(x + 4, 158);
    ctx.lineTo(x + 18, 158);
    ctx.lineTo(x + step + 8, 240);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#383838';
  for (let x = 0; x < 512; x += 6) {
    ctx.fillRect(x, 0, 1.5, 256);
  }

  cachedTreadTex = new THREE.CanvasTexture(canvas);
  cachedTreadTex.wrapS = THREE.RepeatWrapping;
  cachedTreadTex.wrapT = THREE.RepeatWrapping;
  cachedTreadTex.repeat.set(4, 1);
  return cachedTreadTex;
}

let cachedBrushedBump: THREE.CanvasTexture | null = null;
function getBrushedMetalBump(): THREE.CanvasTexture {
  if (cachedBrushedBump) return cachedBrushedBump;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1800; i++) {
    const y = Math.random() * 256;
    const len = 40 + Math.random() * 90;
    const x = Math.random() * 256;
    const b = 100 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgb(${b},${b},${b})`;
    ctx.fillRect(x, y, len, 1);
  }

  cachedBrushedBump = new THREE.CanvasTexture(canvas);
  cachedBrushedBump.wrapS = THREE.RepeatWrapping;
  cachedBrushedBump.wrapT = THREE.RepeatWrapping;
  cachedBrushedBump.repeat.set(2, 2);
  return cachedBrushedBump;
}

let cachedHazardDecal: THREE.CanvasTexture | null = null;
function getHazardDecalTexture(): THREE.CanvasTexture {
  if (cachedHazardDecal) return cachedHazardDecal;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);

  ctx.lineWidth = 14;
  for (let x = -100; x < 650; x += 36) {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(x, 128);
    ctx.lineTo(x + 22, 128);
    ctx.lineTo(x + 58, 0);
    ctx.lineTo(x + 36, 0);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(60, 28, 392, 72);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 28, 392, 72);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TECNOROSARIO • AMR LAB', 256, 62);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('MINI ROBOT DE BANCO • ROS 2', 256, 84);

  cachedHazardDecal = new THREE.CanvasTexture(canvas);
  cachedHazardDecal.colorSpace = THREE.SRGBColorSpace;
  return cachedHazardDecal;
}

let cached3DPrintTex: THREE.CanvasTexture | null = null;
function get3DPrintTexture(): THREE.CanvasTexture {
  if (cached3DPrintTex) return cached3DPrintTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#0c0a09';
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 1.5);
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let d = -256; d < 512; d += 8) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + 256, 256);
    ctx.stroke();
  }

  cached3DPrintTex = new THREE.CanvasTexture(canvas);
  cached3DPrintTex.wrapS = THREE.RepeatWrapping;
  cached3DPrintTex.wrapT = THREE.RepeatWrapping;
  cached3DPrintTex.repeat.set(4, 4);
  return cached3DPrintTex;
}

let cachedPcbTex: THREE.CanvasTexture | null = null;
function getPcbTexture(): THREE.CanvasTexture {
  if (cachedPcbTex) return cachedPcbTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const x1 = Math.random() * 512;
    const y1 = Math.random() * 512;
    const x2 = x1 + (Math.random() > 0.5 ? 60 : -60);
    const y2 = y1 + (Math.random() > 0.5 ? 60 : -60);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x2, y2, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#0f172a';
  for (let c = 0; c < 12; c++) {
    const cx = 50 + (c % 4) * 110;
    const cy = 60 + Math.floor(c / 4) * 140;
    ctx.fillRect(cx, cy, 64, 48);

    ctx.fillStyle = '#94a3b8';
    for (let p = 0; p < 8; p++) {
      ctx.fillRect(cx + p * 8 + 4, cy - 4, 3, 4);
      ctx.fillRect(cx + p * 8 + 4, cy + 48, 3, 4);
    }
    ctx.fillStyle = '#0f172a';
  }

  cachedPcbTex = new THREE.CanvasTexture(canvas);
  cachedPcbTex.wrapS = THREE.RepeatWrapping;
  cachedPcbTex.wrapT = THREE.RepeatWrapping;
  cachedPcbTex.repeat.set(1, 1);
  return cachedPcbTex;
}

function getOledScreenTexture(type: 'tero' | 'golondrina'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#020712';
  ctx.fillRect(0, 0, 512, 256);

  if (type === 'tero') {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 512, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('TERO SECURITY APPLIANCE • 250 USD', 20, 28);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('● HARDWARE IDS/IPS: PROTEGIDO', 24, 76);
    ctx.fillText('● CHIP CRIPTOGRÁFICO: AES-256 GCM OK', 24, 106);
    ctx.fillText('● THROUGHPUT DE RED: 1.45 Gbps', 24, 136);
    ctx.fillText('● ATAQUES MITIGADOS: 1,842', 24, 166);
    ctx.fillText('● PUERTOS ETH: [WAN: UP] [LAN1: UP] [LAN2: UP]', 24, 196);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 330; x < 490; x += 10) {
      const y = 145 + Math.sin(x * 0.12) * 22;
      if (x === 330) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('TRAFICO EN VIVO', 365, 185);
  } else {
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 512, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('GOLONDRINA • SENSOR SUITE & TELEMETRÍA 3D', 20, 27);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('● SENSORES ToF ÓPTICOS: ACTIVO [1.42 m]', 24, 76);
    ctx.fillText('● TRANSDUCTORES ACÚSTICOS: 40 kHz OK', 24, 106);
    ctx.fillText('● SENSOR ÓPTICO AMBIENTAL: 850 nm', 24, 136);
    ctx.fillText('● CONECTORES DORADOS DE PRECISIÓN: SYNC', 24, 166);
    ctx.fillText('● BUS DE DATOS Y TELEMETRÍA: EN LÍNEA', 24, 196);

    // Gráfica de onda ultrasónica / óptica en vivo (ámbar dorado)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 320; x < 490; x += 8) {
      const y = 145 + Math.sin(x * 0.14) * 20;
      if (x === 320) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#d4af37';
    ctx.font = '10px monospace';
    ctx.fillText('ONDAS DE SENSOR', 355, 185);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// =========================================================================
// CONSTRUCTOR PRINCIPAL DEL MODELO 3D ULTRA-REALISTA
// =========================================================================

export function buildSceneModel(
  modelType: Active3DModel,
  config: RobotConfig
): RobotModelParts {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'scene_root';

  // Escala en miniatura / banco de laboratorio
  // micro: 0.75 (~200 mm), compact: 1.0 (~280 mm), desktop: 1.25 (~350 mm)
  const scaleMultiplier = config.robotScale === 'micro' ? 0.75 : config.robotScale === 'desktop' ? 1.25 : 1.0;
  rootGroup.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const regGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometries.push(geo);
    return geo;
  };
  const regMat = <T extends THREE.Material>(mat: T): T => {
    materials.push(mat);
    return mat;
  };

  const brushedBump = getBrushedMetalBump();
  const tireTreadTex = getTreadTexture();
  const hazardDecalTex = getHazardDecalTexture();
  const print3DTex = get3DPrintTexture();
  const pcbTex = getPcbTexture();

  // Materiales PBR
  const bodyPaintMat = regMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.colorHex || '#06b6d4'),
      roughness: Math.max(0.12, Math.min(0.9, config.roughness)),
      metalness: Math.max(0.15, Math.min(0.95, config.metalness)),
      bumpMap: brushedBump,
      bumpScale: 0.015,
      envMapIntensity: 1.4,
    })
  );

  const accentPaintMat = regMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.accentColorHex || '#1e2430'),
      roughness: 0.42,
      metalness: 0.78,
      bumpMap: brushedBump,
      bumpScale: 0.025,
      envMapIntensity: 1.1,
    })
  );

  const wheelsAlloyMat = regMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.wheelsColorHex || '#f1f5f9'),
      roughness: 0.18,
      metalness: 0.92,
      bumpMap: brushedBump,
      bumpScale: 0.02,
      envMapIntensity: 1.6,
    })
  );

  const rubberMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.88,
      metalness: 0.08,
      bumpMap: tireTreadTex,
      bumpScale: 0.07,
    })
  );

  const chromeMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.96,
      envMapIntensity: 1.8,
    })
  );

  const glassLensMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.04,
      metalness: 0.15,
      transparent: true,
      opacity: 0.75,
      envMapIntensity: 2.4,
    })
  );

  const smokedDomeMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      clearcoat: 1.0,
      envMapIntensity: 2.0,
    })
  );

  const print3DMat = regMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.colorHex || '#18181b'),
      roughness: 0.75,
      metalness: 0.15,
      bumpMap: print3DTex,
      bumpScale: 0.035,
      envMapIntensity: 0.8,
    })
  );

  const hazardDecalMat = regMat(
    new THREE.MeshStandardMaterial({
      map: hazardDecalTex,
      roughness: 0.35,
      metalness: 0.3,
    })
  );

  const pcbMat = regMat(
    new THREE.MeshStandardMaterial({
      map: pcbTex,
      roughness: 0.35,
      metalness: 0.6,
    })
  );

  const customLedColor = new THREE.Color(config.ledColorHex || '#22d3ee');
  const ledCustomMat = regMat(
    new THREE.MeshStandardMaterial({
      color: config.lightsOn ? customLedColor : 0x083344,
      emissive: config.lightsOn ? customLedColor : 0x000000,
      emissiveIntensity: config.lightsOn ? 2.6 : 0,
      roughness: 0.2,
      metalness: 0.5,
    })
  );

  const ledAmberMat = regMat(
    new THREE.MeshStandardMaterial({
      color: config.lightsOn ? 0xfbbf24 : 0x451a03,
      emissive: config.lightsOn ? 0xf59e0b : 0x000000,
      emissiveIntensity: config.lightsOn ? 2.2 : 0,
    })
  );

  const ledEmergencyMat = regMat(
    new THREE.MeshStandardMaterial({
      color: config.isEmergencyStop ? 0xef4444 : 0x10b981,
      emissive: config.isEmergencyStop ? 0xdc2626 : 0x059669,
      emissiveIntensity: 2.5,
    })
  );

  // Materiales dedicados para aparatos industriales (Bornes dorados de latón, Riel DIN, Terminales)
  const goldBrassMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Oro metálico / latón pulido industrial brillante
      roughness: 0.18,
      metalness: 0.94,
      bumpMap: brushedBump,
      bumpScale: 0.015,
      envMapIntensity: 2.6,
    })
  );

  const goldScrewSlotMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x78350f, // Ranura contrastada del tornillo dorado
      roughness: 0.5,
      metalness: 0.8,
    })
  );

  const dinRailMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Acero cincado galvanizado estándar EN 50022
      roughness: 0.25,
      metalness: 0.92,
      bumpMap: brushedBump,
      bumpScale: 0.02,
      envMapIntensity: 2.2,
    })
  );

  const dinClipMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Pestillo de traba industrial para riel DIN
      roughness: 0.45,
      metalness: 0.2,
    })
  );

  const terminalHousingMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x15803d, // Verde industrial estándar Phoenix Contact para bornes
      roughness: 0.42,
      metalness: 0.12,
      envMapIntensity: 0.8,
    })
  );

  const ledRelayActiveMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2.8,
      roughness: 0.2,
    })
  );

  const ledPowerCyanMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    })
  );

  const chassisGroup = new THREE.Group();
  const wheelsGroup = new THREE.Group();
  const internalsGroup = new THREE.Group();
  const moduleGroup = new THREE.Group();
  const sensorsGroup = new THREE.Group();
  const simulationGroup = new THREE.Group();

  let lidarHead: THREE.Object3D | null = null;
  let laserScanMesh: THREE.Mesh | null = null;
  let safetyArcMesh: THREE.Mesh | null = null;
  let leftGripperFinger: THREE.Object3D | null = null;
  let rightGripperFinger: THREE.Object3D | null = null;
  let armShoulder: THREE.Object3D | null = null;
  let armElbow: THREE.Object3D | null = null;
  let mastHead: THREE.Object3D | null = null;
  const conveyorRollers: THREE.Object3D[] = [];
  const wheelsList: THREE.Object3D[] = [];
  let beaconLight: THREE.Mesh | null = null;
  const frontLights: THREE.Mesh[] = [];

  // =========================================================================
  // MODELO 1: TERO SECURITY 3D (Appliance Físico de Red IDS/IPS - 250 USD)
  // =========================================================================
  if (modelType === 'tero') {
    const chassisGeo = regGeo(new THREE.BoxGeometry(0.44, 0.088, 0.28));
    const chassis = new THREE.Mesh(chassisGeo, print3DMat);
    chassis.position.y = 0.06;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    chassisGroup.add(chassis);

    // Bisel frontal
    const bezelGeo = regGeo(new THREE.BoxGeometry(0.44, 0.085, 0.02));
    const bezel = new THREE.Mesh(bezelGeo, accentPaintMat);
    bezel.position.set(0, 0.06, 0.145);
    chassisGroup.add(bezel);

    // Pantalla OLED de telemetría y estado criptográfico
    const screenGeo = regGeo(new THREE.PlaneGeometry(0.14, 0.05));
    const screenMat = regMat(
      new THREE.MeshStandardMaterial({
        map: getOledScreenTexture('tero'),
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.1,
      })
    );
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0.08, 0.06, 0.156);
    chassisGroup.add(screen);

    // 4 Puertos Ethernet RJ45 frontales
    for (let p = -0.16; p <= -0.04; p += 0.04) {
      const portGeo = regGeo(new THREE.BoxGeometry(0.028, 0.022, 0.015));
      const port = new THREE.Mesh(portGeo, chromeMat);
      port.position.set(p, 0.055, 0.155);
      chassisGroup.add(port);
    }

    // Orejas de montaje
    [-0.23, 0.23].forEach((xRack) => {
      const earGeo = regGeo(new THREE.BoxGeometry(0.02, 0.08, 0.03));
      const ear = new THREE.Mesh(earGeo, chromeMat);
      ear.position.set(xRack, 0.06, 0.14);
      chassisGroup.add(ear);
    });

    // Antenas WiFi/5G dobles
    [-0.15, 0.15].forEach((xAnt) => {
      const antGeo = regGeo(new THREE.CylinderGeometry(0.005, 0.007, 0.16, 10));
      const ant = new THREE.Mesh(antGeo, accentPaintMat);
      ant.position.set(xAnt, 0.14, -0.12);
      sensorsGroup.add(ant);
    });

    rootGroup.add(chassisGroup, internalsGroup, sensorsGroup);
    return {
      rootGroup,
      chassisGroup,
      wheelsGroup,
      internalsGroup,
      moduleGroup,
      sensorsGroup,
      simulationGroup,
      lidarHead: null,
      laserScanMesh: null,
      safetyArcMesh: null,
      leftGripperFinger: null,
      rightGripperFinger: null,
      armShoulder: null,
      armElbow: null,
      mastHead: null,
      conveyorRollers: [],
      wheelsList: [],
      beaconLight: null,
      frontLights,
      materials,
      geometries,
    };
  }

  // =========================================================================
  // MODELO 2: GOLONDRINA AUTOMATIZACIÓN 3D (Sensor Suite & Hardware de Precisión)
  // Carcasa negro mate profundo, sensores acústicos/ópticos ToF y conectores dorados
  // =========================================================================
  if (modelType === 'golondrina') {
    // -------------------------------------------------------------------------
    // MATERIALES EXCLUSIVOS: NEGRO MATE ANODIZADO, ÓPTICA OSCURA Y ORO BRILLANTE
    // "Algo con sensores y negro nada más, tenía unos conectores dorados"
    // -------------------------------------------------------------------------
    const blackAnodizedMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x0c0e14, // Negro mate profundo anodizado
        roughness: 0.35,
        metalness: 0.88,
        bumpMap: brushedBump,
        bumpScale: 0.015,
        envMapIntensity: 1.3,
      })
    );

    const blackSatinBezelMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x141720, // Bisel negro satinado de alta precisión
        roughness: 0.24,
        metalness: 0.92,
        bumpMap: brushedBump,
        bumpScale: 0.01,
        envMapIntensity: 1.6,
      })
    );

    const acousticMeshMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x181a22, // Malla acústica microperforada del transductor
        roughness: 0.75,
        metalness: 0.45,
      })
    );

    const darkOpticalLensMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x03060c, // Lente óptica de zafiro oscuro antirreflejo para sensor ToF
        roughness: 0.03,
        metalness: 0.15,
        transmission: 0.25,
        transparent: true,
        opacity: 0.92,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.8,
      })
    );

    const sensorConeMat = regMat(
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b, // Haz de escaneo ámbar/dorado de los sensores
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      })
    );

    const goldContactMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Oro 24K pulido de alta conductividad
        roughness: 0.14,
        metalness: 0.96,
        bumpMap: brushedBump,
        bumpScale: 0.012,
        envMapIntensity: 2.8,
      })
    );

    const goldAccentTrimMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0xebb434, // Detalle dorado satinado
        roughness: 0.22,
        metalness: 0.92,
      })
    );

    // 1. CARCASA PRINCIPAL: NEGRO PURO MONOLÍTICO Y BISELADO
    const mainBodyGeo = regGeo(new THREE.BoxGeometry(0.26, 0.092, 0.165));
    const mainBody = new THREE.Mesh(mainBodyGeo, blackAnodizedMat);
    mainBody.position.set(0, 0.08, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    chassisGroup.add(mainBody);

    // Bisel superior mecanizado
    const topPlateGeo = regGeo(new THREE.BoxGeometry(0.244, 0.008, 0.15));
    const topPlate = new THREE.Mesh(topPlateGeo, blackSatinBezelMat);
    topPlate.position.set(0, 0.13, 0);
    chassisGroup.add(topPlate);

    // Bisel frontal
    const frontPlateGeo = regGeo(new THREE.BoxGeometry(0.248, 0.082, 0.008));
    const frontPlate = new THREE.Mesh(frontPlateGeo, blackSatinBezelMat);
    frontPlate.position.set(0, 0.08, 0.086);
    chassisGroup.add(frontPlate);

    // Ranuras laterales de agarre/refrigeración en negro profundo
    [-0.131, 0.131].forEach((sideX) => {
      for (let s = -0.045; s <= 0.045; s += 0.018) {
        const finGeo = regGeo(new THREE.BoxGeometry(0.003, 0.05, 0.008));
        const fin = new THREE.Mesh(finGeo, blackSatinBezelMat);
        fin.position.set(sideX, 0.08, s);
        chassisGroup.add(fin);
      }
    });

    // Tornillos hexagonales de fijación con arandela dorada en las 4 esquinas superiores
    [
      [-0.112, -0.065],
      [0.112, -0.065],
      [-0.112, 0.065],
      [0.112, 0.065],
    ].forEach(([cx, cz]) => {
      const washerGeo = regGeo(new THREE.CylinderGeometry(0.0055, 0.0055, 0.002, 12));
      const washer = new THREE.Mesh(washerGeo, goldContactMat);
      washer.position.set(cx, 0.135, cz);
      chassisGroup.add(washer);

      const boltGeo = regGeo(new THREE.CylinderGeometry(0.004, 0.004, 0.004, 6));
      const bolt = new THREE.Mesh(boltGeo, blackAnodizedMat);
      bolt.position.set(cx, 0.137, cz);
      chassisGroup.add(bolt);
    });

    // 2. CONJUNTO DE SENSORES INTEGRADOS (FRONTAL Y SUPERIOR)
    // Transductores Acústicos / Ultrasónicos Dobles (Izquierda y Derecha)
    [-0.075, 0.075].forEach((sx) => {
      // Cilindro exterior del sensor en negro satinado
      const barrelGeo = regGeo(new THREE.CylinderGeometry(0.024, 0.024, 0.018, 28));
      barrelGeo.rotateX(Math.PI / 2);
      const barrel = new THREE.Mesh(barrelGeo, blackSatinBezelMat);
      barrel.position.set(sx, 0.08, 0.095);
      barrel.castShadow = true;
      sensorsGroup.add(barrel);

      // Anillo biselado dorado de retención del sensor
      const goldRingGeo = regGeo(new THREE.CylinderGeometry(0.0225, 0.0225, 0.003, 28));
      goldRingGeo.rotateX(Math.PI / 2);
      const goldRing = new THREE.Mesh(goldRingGeo, goldContactMat);
      goldRing.position.set(sx, 0.08, 0.104);
      sensorsGroup.add(goldRing);

      // Malla acústica interior oscura
      const meshGeo = regGeo(new THREE.CylinderGeometry(0.0195, 0.0195, 0.002, 28));
      meshGeo.rotateX(Math.PI / 2);
      const mesh = new THREE.Mesh(meshGeo, acousticMeshMat);
      mesh.position.set(sx, 0.08, 0.105);
      sensorsGroup.add(mesh);

      // Cono central piezoeléctrico con punta dorada
      const coneGeo = regGeo(new THREE.CylinderGeometry(0.001, 0.0055, 0.006, 16));
      coneGeo.rotateX(Math.PI / 2);
      const cone = new THREE.Mesh(coneGeo, goldContactMat);
      cone.position.set(sx, 0.08, 0.107);
      sensorsGroup.add(cone);
    });

    // Sensor Central Time-of-Flight (ToF) & Óptico Infrarrojo
    const tofHousingGeo = regGeo(new THREE.BoxGeometry(0.062, 0.038, 0.016));
    const tofHousing = new THREE.Mesh(tofHousingGeo, blackAnodizedMat);
    tofHousing.position.set(0, 0.08, 0.094);
    sensorsGroup.add(tofHousing);

    // Marco biselado dorado para la bahía óptica ToF
    const tofTrimGeo = regGeo(new THREE.BoxGeometry(0.058, 0.034, 0.003));
    const tofTrim = new THREE.Mesh(tofTrimGeo, goldContactMat);
    tofTrim.position.set(0, 0.08, 0.102);
    sensorsGroup.add(tofTrim);

    // Lentes ópticas gemelas de zafiro oscuro (Emisor VCSEL y Receptor Fotodiodo)
    [-0.015, 0.015].forEach((lx, idx) => {
      const radius = idx === 0 ? 0.009 : 0.011;
      const lensGeo = regGeo(new THREE.CylinderGeometry(radius, radius, 0.004, 20));
      lensGeo.rotateX(Math.PI / 2);
      const lens = new THREE.Mesh(lensGeo, darkOpticalLensMat);
      lens.position.set(lx, 0.08, 0.104);
      sensorsGroup.add(lens);

      // Micro-anillo de reflexión interna dorada
      const innerGoldGeo = regGeo(new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, 0.002, 16));
      innerGoldGeo.rotateX(Math.PI / 2);
      const innerGold = new THREE.Mesh(innerGoldGeo, goldAccentTrimMat);
      innerGold.position.set(lx, 0.08, 0.103);
      sensorsGroup.add(innerGold);
    });

    // Sensor de Luz Ambiental / Espectro en la Cara Superior
    const topSensorBaseGeo = regGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.004, 24));
    const topSensorBase = new THREE.Mesh(topSensorBaseGeo, goldContactMat);
    topSensorBase.position.set(0, 0.136, 0.01);
    sensorsGroup.add(topSensorBase);

    const domeGeo = regGeo(new THREE.SphereGeometry(0.01, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2));
    const dome = new THREE.Mesh(domeGeo, darkOpticalLensMat);
    dome.position.set(0, 0.137, 0.01);
    sensorsGroup.add(dome);

    // Haz interactivo de escaneo hacia adelante de los sensores
    const scanConeGeo = regGeo(new THREE.ConeGeometry(0.19, 0.45, 24, 1, true));
    scanConeGeo.rotateX(-Math.PI / 2);
    const scanCone = new THREE.Mesh(scanConeGeo, sensorConeMat);
    scanCone.position.set(0, 0.08, 0.32);
    sensorsGroup.add(scanCone);

    // 3. CONECTORES DORADOS DE PRECISIÓN (SMA / M12 / BORNES DE ORO)
    // "Tenía unos conectores dorados" - Conectores dorados destacados y relucientes

    // A) 4 Conectores Dorados Superiores Roscados (Puertos SMA de Sensores Externos y Antena)
    [-0.084, -0.028, 0.028, 0.084].forEach((px) => {
      // Base o collar hexagonal dorado
      const baseNutGeo = regGeo(new THREE.CylinderGeometry(0.0085, 0.0085, 0.006, 6));
      const baseNut = new THREE.Mesh(baseNutGeo, goldContactMat);
      baseNut.position.set(px, 0.137, -0.048);
      baseNut.castShadow = true;
      chassisGroup.add(baseNut);

      // Barril roscado dorado del conector
      const barrelGeo = regGeo(new THREE.CylinderGeometry(0.0068, 0.0068, 0.022, 18));
      const barrel = new THREE.Mesh(barrelGeo, goldContactMat);
      barrel.position.set(px, 0.151, -0.048);
      barrel.castShadow = true;
      chassisGroup.add(barrel);

      // Ranuras de rosca dorada brillante
      for (let r = 0; r < 3; r++) {
        const ringGeo = regGeo(new THREE.TorusGeometry(0.007, 0.0009, 8, 16));
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, goldAccentTrimMat);
        ring.position.set(px, 0.144 + r * 0.005, -0.048);
        chassisGroup.add(ring);
      }

      // Núcleo aislante negro interior
      const coreGeo = regGeo(new THREE.CylinderGeometry(0.0045, 0.0045, 0.003, 14));
      const core = new THREE.Mesh(coreGeo, blackAnodizedMat);
      core.position.set(px, 0.162, -0.048);
      chassisGroup.add(core);

      // Pin central de señal en oro pulido
      const pinGeo = regGeo(new THREE.CylinderGeometry(0.0018, 0.0018, 0.012, 10));
      const pin = new THREE.Mesh(pinGeo, goldContactMat);
      pin.position.set(px, 0.166, -0.048);
      chassisGroup.add(pin);
    });

    // B) 4 Conectores Dorados Frontales Inferiores (Alimentación Dorada, Bus de Sensores I2C/SPI y Sincronismo)
    [-0.084, -0.028, 0.028, 0.084].forEach((px) => {
      // Cuello circular dorado frontal
      const frontCollarGeo = regGeo(new THREE.CylinderGeometry(0.0075, 0.0075, 0.014, 18));
      frontCollarGeo.rotateX(Math.PI / 2);
      const frontCollar = new THREE.Mesh(frontCollarGeo, goldContactMat);
      frontCollar.position.set(px, 0.042, 0.092);
      frontCollar.castShadow = true;
      chassisGroup.add(frontCollar);

      // Anillo moleteado dorado
      const knurlGeo = regGeo(new THREE.CylinderGeometry(0.0085, 0.0085, 0.005, 12));
      knurlGeo.rotateX(Math.PI / 2);
      const knurl = new THREE.Mesh(knurlGeo, goldContactMat);
      knurl.position.set(px, 0.042, 0.098);
      chassisGroup.add(knurl);

      // Cavidad central con contacto de oro hembra
      const socketGeo = regGeo(new THREE.CylinderGeometry(0.0025, 0.0025, 0.004, 10));
      socketGeo.rotateX(Math.PI / 2);
      const socket = new THREE.Mesh(socketGeo, blackAnodizedMat);
      socket.position.set(px, 0.042, 0.101);
      chassisGroup.add(socket);
    });

    // C) Conectores Dorados Laterales (Tierra PE de Chasis y Puerto Auxiliar)
    [-0.132, 0.132].forEach((lx, idx) => {
      // Espárrago roscado de latón dorado
      const studGeo = regGeo(new THREE.CylinderGeometry(0.005, 0.005, 0.016, 12));
      studGeo.rotateZ(Math.PI / 2);
      const stud = new THREE.Mesh(studGeo, goldContactMat);
      stud.position.set(lx, 0.08, 0);
      chassisGroup.add(stud);

      // Tuerca moleteada de apriete manual dorada
      const nutGeo = regGeo(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 8));
      nutGeo.rotateZ(Math.PI / 2);
      const nut = new THREE.Mesh(nutGeo, goldContactMat);
      nut.position.set(lx + (idx === 0 ? -0.004 : 0.004), 0.08, 0);
      chassisGroup.add(nut);
    });

    // 4. PANTALLA OLED DIAGNÓSTICA Y MICRO-LEDS EN NEGRO MATE
    const screenFrameGeo = regGeo(new THREE.BoxGeometry(0.124, 0.003, 0.062));
    const screenFrame = new THREE.Mesh(screenFrameGeo, blackSatinBezelMat);
    screenFrame.position.set(0, 0.135, -0.01);
    chassisGroup.add(screenFrame);

    // Fino borde perimetral dorado alrededor de la pantalla
    const screenGoldBorderGeo = regGeo(new THREE.BoxGeometry(0.126, 0.002, 0.064));
    const screenGoldBorder = new THREE.Mesh(screenGoldBorderGeo, goldContactMat);
    screenGoldBorder.position.set(0, 0.133, -0.01);
    chassisGroup.add(screenGoldBorder);

    // Pantalla OLED de telemetría de sensores
    const screenGeo = regGeo(new THREE.PlaneGeometry(0.118, 0.056));
    screenGeo.rotateX(-Math.PI / 2);
    const screenMat = regMat(
      new THREE.MeshStandardMaterial({
        map: getOledScreenTexture('golondrina'),
        emissive: 0xb45309,
        emissiveIntensity: 0.9,
        roughness: 0.06,
      })
    );
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.137, -0.01);
    chassisGroup.add(screen);

    // Micro-LEDs de estado de los sensores (Ámbar y Cian)
    [-0.08, 0.08].forEach((ledX, idx) => {
      // Bisel dorado del LED
      const bGeo = regGeo(new THREE.CylinderGeometry(0.004, 0.004, 0.002, 12));
      const bMesh = new THREE.Mesh(bGeo, goldContactMat);
      bMesh.position.set(ledX, 0.136, 0.045);
      chassisGroup.add(bMesh);

      // Lente del LED
      const lGeo = regGeo(new THREE.CylinderGeometry(0.0025, 0.0025, 0.003, 10));
      const lMesh = new THREE.Mesh(lGeo, idx === 0 ? ledAmberMat : ledPowerCyanMat);
      lMesh.position.set(ledX, 0.137, 0.045);
      chassisGroup.add(lMesh);
    });

    // 5. DETALLES DE LA BASE INFERIOR (Inspección 360° total desde abajo)
    // Placa base inferior en negro satinado con ranura biselada
    const botPlateGeo = regGeo(new THREE.BoxGeometry(0.244, 0.006, 0.15));
    const botPlate = new THREE.Mesh(botPlateGeo, blackSatinBezelMat);
    botPlate.position.set(0, 0.033, 0);
    chassisGroup.add(botPlate);

    // 4 Bujes roscados dorados de fijación inferior M4 (Brass threaded inserts)
    [
      [-0.1, -0.055],
      [0.1, -0.055],
      [-0.1, 0.055],
      [0.1, 0.055],
    ].forEach(([bx, bz]) => {
      // Casquillo de inserción de latón dorado
      const bushGeo = regGeo(new THREE.CylinderGeometry(0.0055, 0.0055, 0.005, 14));
      const bush = new THREE.Mesh(bushGeo, goldContactMat);
      bush.position.set(bx, 0.031, bz);
      chassisGroup.add(bush);

      // Agujero roscado central interior
      const holeGeo = regGeo(new THREE.CylinderGeometry(0.0025, 0.0025, 0.006, 10));
      const hole = new THREE.Mesh(holeGeo, blackAnodizedMat);
      hole.position.set(bx, 0.031, bz);
      chassisGroup.add(hole);
    });

    // Puntos de prueba / Test points dorados JTAG en la base
    for (let tp = 0; tp < 6; tp++) {
      const padGeo = regGeo(new THREE.CylinderGeometry(0.0022, 0.0022, 0.001, 10));
      const pad = new THREE.Mesh(padGeo, goldContactMat);
      pad.position.set(-0.04 + tp * 0.016, 0.031, -0.03);
      chassisGroup.add(pad);
    }

    // Rejilla de disipación térmica inferior en negro mate
    for (let vg = -0.03; vg <= 0.03; vg += 0.01) {
      const slotGeo = regGeo(new THREE.BoxGeometry(0.002, 0.002, 0.035));
      const slot = new THREE.Mesh(slotGeo, blackAnodizedMat);
      slot.position.set(vg, 0.031, 0.02);
      chassisGroup.add(slot);
    }

    rootGroup.add(chassisGroup, internalsGroup, sensorsGroup);
    return {
      rootGroup,
      chassisGroup,
      wheelsGroup,
      internalsGroup,
      moduleGroup,
      sensorsGroup,
      simulationGroup,
      lidarHead: null,
      laserScanMesh: null,
      safetyArcMesh: null,
      leftGripperFinger: null,
      rightGripperFinger: null,
      armShoulder: null,
      armElbow: null,
      mastHead: null,
      conveyorRollers: [],
      wheelsList: [],
      beaconLight: null,
      frontLights,
      materials,
      geometries,
    };
  }

  // =========================================================================
  // MODELO 3: CATÁLOGO DE ROBOTS EN MINIATURA (Escala de Mesa 240 a 340 mm)
  // =========================================================================
  const modelId: RobotModelId = config.robotModelId || 'mini_amr';

  // DIMENSIONES REALES COMPACTAS (Escala Desktop / Mesa / Laboratorio)
  // Longitud ~0.30m, Ancho ~0.22m, Altura base ~0.08m
  const baseL = modelId === 'micro_rover' ? 0.26 : modelId === 'caster_dome' ? 0.28 : modelId === 'micro_agribot' ? 0.34 : 0.30;
  const baseW = modelId === 'caster_dome' ? 0.28 : modelId === 'micro_agribot' ? 0.19 : 0.22;
  const baseH = 0.07;
  const baseY = 0.08;

  // 1. CHASIS ESPECÍFICO SEGÚN MODELO
  if (modelId === 'caster_dome') {
    // Chasis circular de bajo perfil con domo ahumado
    const discGeo = regGeo(new THREE.CylinderGeometry(baseW / 2, baseW / 2 + 0.01, baseH, 32));
    const disc = new THREE.Mesh(discGeo, bodyPaintMat);
    disc.position.y = baseY;
    disc.castShadow = true;
    disc.receiveShadow = true;
    chassisGroup.add(disc);

    // Domo protector ahumado semiesférico
    const domeGeo = regGeo(new THREE.SphereGeometry(baseW / 2 - 0.015, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2));
    const dome = new THREE.Mesh(domeGeo, smokedDomeMat);
    dome.position.y = baseY + baseH / 2;
    chassisGroup.add(dome);

    // Sensores de proximidad ultrasónicos perimetrales en 360 grados (8 sensores)
    for (let u = 0; u < 8; u++) {
      const angle = (u / 8) * Math.PI * 2;
      const usGeo = regGeo(new THREE.CylinderGeometry(0.007, 0.007, 0.008, 12));
      usGeo.rotateX(Math.PI / 2);
      const usMesh = new THREE.Mesh(usGeo, chromeMat);
      usMesh.position.set(Math.cos(angle) * (baseW / 2 + 0.004), baseY, Math.sin(angle) * (baseW / 2 + 0.004));
      usMesh.rotation.y = -angle + Math.PI / 2;
      sensorsGroup.add(usMesh);
    }
  } else if (modelId === 'micro_rover') {
    // Chasis tubular con jaula antivuelco compacta
    const roverHullGeo = regGeo(new THREE.BoxGeometry(baseW, baseH, baseL));
    const roverHull = new THREE.Mesh(roverHullGeo, bodyPaintMat);
    roverHull.position.y = baseY;
    roverHull.castShadow = true;
    chassisGroup.add(roverHull);

    // Jaula antivuelco de tubos metálicos (Roll-cage)
    [-baseW / 2 + 0.01, baseW / 2 - 0.01].forEach((rx) => {
      const cageBarGeo = regGeo(new THREE.CylinderGeometry(0.005, 0.005, baseH + 0.06, 8));
      const frontBar = new THREE.Mesh(cageBarGeo, chromeMat);
      frontBar.position.set(rx, baseY + 0.05, baseL / 3);
      const rearBar = new THREE.Mesh(cageBarGeo, chromeMat);
      rearBar.position.set(rx, baseY + 0.05, -baseL / 3);
      chassisGroup.add(frontBar, rearBar);
    });

    const topCrossGeo = regGeo(new THREE.BoxGeometry(baseW - 0.02, 0.008, baseL * 0.65));
    const topCross = new THREE.Mesh(topCrossGeo, accentPaintMat);
    topCross.position.set(0, baseY + 0.08, 0);
    chassisGroup.add(topCross);
  } else {
    // Chasis estándar modular / Mini-AMR / Cobot / AgriBot / Walker
    const hullGeo = regGeo(new THREE.BoxGeometry(baseW, baseH, baseL));
    const hullMesh = new THREE.Mesh(hullGeo, bodyPaintMat);
    hullMesh.position.y = baseY;
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    chassisGroup.add(hullMesh);

    // Tapa superior de aluminio maquinado con biseles
    const topPlateGeo = regGeo(new THREE.BoxGeometry(baseW - 0.015, 0.006, baseL - 0.015));
    const topPlate = new THREE.Mesh(topPlateGeo, accentPaintMat);
    topPlate.position.y = baseY + baseH / 2 + 0.003;
    topPlate.castShadow = true;
    chassisGroup.add(topPlate);

    // Calcomanía técnica miniatura
    const decalGeo = regGeo(new THREE.PlaneGeometry(baseW * 0.75, 0.035));
    const decal = new THREE.Mesh(decalGeo, hazardDecalMat);
    decal.position.set(0, baseY + 0.01, baseL / 2 + 0.001);
    chassisGroup.add(decal);

    // Tornillos Allen M3 de montaje de banco
    const boltGeo = regGeo(new THREE.CylinderGeometry(0.004, 0.004, 0.004, 8));
    [-baseW / 2 + 0.02, baseW / 2 - 0.02].forEach((bx) => {
      [-baseL / 2 + 0.02, baseL / 2 - 0.02].forEach((bz) => {
        const bolt = new THREE.Mesh(boltGeo, chromeMat);
        bolt.position.set(bx, baseY + baseH / 2 + 0.007, bz);
        chassisGroup.add(bolt);
      });
    });

    // Luces de navegación frontales micro-LED
    [-baseW / 3, baseW / 3].forEach((lx) => {
      const ledGeo = regGeo(new THREE.BoxGeometry(0.025, 0.012, 0.008));
      const ledMesh = new THREE.Mesh(ledGeo, ledCustomMat);
      ledMesh.position.set(lx, baseY, baseL / 2 + 0.002);
      frontLights.push(ledMesh);
      chassisGroup.add(ledMesh);
    });
  }

  rootGroup.add(chassisGroup);

  // 2. SISTEMA DE TRACCIÓN (Micro-Mecanum, Micro-Orugas, 4WD de mesa, Cuadrúpedo, Diferencial)
  const effectiveChassis = config.chassisType;

  if (effectiveChassis === 'mecanum') {
    // 4 Ruedas Micro-Mecanum de 70 mm
    const wR = 0.045; // 45 mm radio
    const wW = 0.032;
    const posList = [
      { x: baseW / 2 + wW / 2 + 0.004, z: baseL * 0.32, angle: 1 },
      { x: -(baseW / 2 + wW / 2 + 0.004), z: baseL * 0.32, angle: -1 },
      { x: baseW / 2 + wW / 2 + 0.004, z: -baseL * 0.32, angle: -1 },
      { x: -(baseW / 2 + wW / 2 + 0.004), z: -baseL * 0.32, angle: 1 },
    ];

    posList.forEach((pos) => {
      const hub = new THREE.Group();
      hub.position.set(pos.x, wR, pos.z);

      const hubGeo = regGeo(new THREE.CylinderGeometry(wR, wR, wW, 16));
      hubGeo.rotateZ(Math.PI / 2);
      const hubMesh = new THREE.Mesh(hubGeo, wheelsAlloyMat);
      hubMesh.castShadow = true;
      hub.add(hubMesh);

      // Rodillos micro-mecanum periféricos en ángulo de 45°
      const rollerGeo = regGeo(new THREE.CylinderGeometry(0.007, 0.007, wW * 0.85, 8));
      for (let r = 0; r < 6; r++) {
        const a = (r / 6) * Math.PI * 2;
        const roller = new THREE.Mesh(rollerGeo, rubberMat);
        roller.position.set(0, (wR - 0.002) * Math.cos(a), (wR - 0.002) * Math.sin(a));
        roller.rotation.x = (Math.PI / 4) * pos.angle;
        hub.add(roller);
      }

      wheelsList.push(hub);
      wheelsGroup.add(hub);
    });
  } else if (effectiveChassis === 'tracks') {
    // Micro-orugas de laboratorio con orugas de goma dentada
    const trackW = 0.038;
    const trackH = 0.07;
    const trackL = baseL * 1.05;

    [-baseW / 2 - trackW / 2, baseW / 2 + trackW / 2].forEach((tx) => {
      const tSide = new THREE.Group();
      tSide.position.set(tx, trackH / 2 + 0.01, 0);

      const beltGeo = regGeo(new THREE.BoxGeometry(trackW, trackH, trackL));
      const belt = new THREE.Mesh(beltGeo, rubberMat);
      belt.castShadow = true;
      tSide.add(belt);

      // Sprockets y ruedas tensoras de aluminio
      const spGeo = regGeo(new THREE.CylinderGeometry(trackH * 0.44, trackH * 0.44, trackW + 0.004, 14));
      spGeo.rotateZ(Math.PI / 2);
      const fWheel = new THREE.Mesh(spGeo, wheelsAlloyMat);
      fWheel.position.set(0, 0, trackL * 0.36);
      const rWheel = new THREE.Mesh(spGeo, wheelsAlloyMat);
      rWheel.position.set(0, 0, -trackL * 0.36);
      tSide.add(fWheel, rWheel);
      wheelsList.push(fWheel, rWheel);

      wheelsGroup.add(tSide);
    });
  } else if (effectiveChassis === 'quadruped') {
    // 4 Patas servo-articuladas (Robot Dog de Mesa)
    const legPositions = [
      { x: baseW / 2 + 0.015, z: baseL * 0.35, signX: 1 },
      { x: -baseW / 2 - 0.015, z: baseL * 0.35, signX: -1 },
      { x: baseW / 2 + 0.015, z: -baseL * 0.35, signX: 1 },
      { x: -baseW / 2 - 0.015, z: -baseL * 0.35, signX: -1 },
    ];

    legPositions.forEach((lp) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(lp.x, baseY + 0.01, lp.z);

      // Caja de micro-servo de cadera
      const servoGeo = regGeo(new THREE.BoxGeometry(0.024, 0.028, 0.03));
      const servo = new THREE.Mesh(servoGeo, accentPaintMat);
      legGroup.add(servo);

      // Fémur articulado inclinado
      const femurGeo = regGeo(new THREE.BoxGeometry(0.014, 0.055, 0.016));
      const femur = new THREE.Mesh(femurGeo, bodyPaintMat);
      femur.position.set(lp.signX * 0.018, -0.025, 0);
      femur.rotation.z = -lp.signX * 0.4;
      legGroup.add(femur);

      // Tibia articulada con almohadilla de goma
      const tibiaGeo = regGeo(new THREE.BoxGeometry(0.012, 0.065, 0.014));
      const tibia = new THREE.Mesh(tibiaGeo, accentPaintMat);
      tibia.position.set(lp.signX * 0.032, -0.065, 0);
      tibia.rotation.z = lp.signX * 0.25;
      legGroup.add(tibia);

      const footGeo = regGeo(new THREE.SphereGeometry(0.012, 10, 10));
      const foot = new THREE.Mesh(footGeo, rubberMat);
      foot.position.set(lp.signX * 0.038, -0.095, 0);
      legGroup.add(foot);

      wheelsGroup.add(legGroup);
    });
  } else {
    // 4WD Industrial o Diferencial AGV con ruedas de goma
    const wR = 0.042;
    const wW = 0.026;
    const posList = [
      { x: baseW / 2 + wW / 2 + 0.003, z: baseL * 0.3 },
      { x: -(baseW / 2 + wW / 2 + 0.003), z: baseL * 0.3 },
      { x: baseW / 2 + wW / 2 + 0.003, z: -baseL * 0.3 },
      { x: -(baseW / 2 + wW / 2 + 0.003), z: -baseL * 0.3 },
    ];

    posList.forEach((pos) => {
      const wheel = new THREE.Group();
      wheel.position.set(pos.x, wR, pos.z);

      const tireGeo = regGeo(new THREE.CylinderGeometry(wR, wR, wW, 20));
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      tire.castShadow = true;
      wheel.add(tire);

      const rimGeo = regGeo(new THREE.CylinderGeometry(wR * 0.65, wR * 0.65, wW + 0.004, 16));
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, wheelsAlloyMat);
      wheel.add(rim);

      wheelsList.push(wheel);
      wheelsGroup.add(wheel);
    });
  }

  rootGroup.add(wheelsGroup);

  // 3. ELECTRÓNICA INTERNA Y PACK DE BATERÍA 18650 (Explosionado)
  const batteryGeo = regGeo(new THREE.BoxGeometry(baseW * 0.6, 0.028, baseL * 0.35));
  const battery = new THREE.Mesh(batteryGeo, accentPaintMat);
  battery.position.set(0, baseY + 0.015, -baseL * 0.15);
  battery.castShadow = true;
  internalsGroup.add(battery);

  // Microcomputadora SBC (Jetson Nano / Raspberry Pi CM4) con disipador
  const sbcGeo = regGeo(new THREE.BoxGeometry(baseW * 0.65, 0.014, baseL * 0.35));
  const sbc = new THREE.Mesh(sbcGeo, pcbMat);
  sbc.position.set(0, baseY + 0.015, baseL * 0.15);
  internalsGroup.add(sbc);

  // Aletas de disipación de aluminio anodizado negro
  for (let f = -0.04; f <= 0.04; f += 0.016) {
    const finGeo = regGeo(new THREE.BoxGeometry(baseW * 0.55, 0.012, 0.003));
    const fin = new THREE.Mesh(finGeo, chromeMat);
    fin.position.set(0, baseY + 0.03, baseL * 0.15 + f);
    internalsGroup.add(fin);
  }

  rootGroup.add(internalsGroup);

  // 4. MÓDULO DE MISIÓN INTERCAMBIABLE
  const effectiveModule = config.missionModule;

  if (effectiveModule === 'arm' || modelId === 'cobot_mobile') {
    // Mini-Brazo Robótico Articulado 4-DOF
    const armBaseGeo = regGeo(new THREE.CylinderGeometry(0.042, 0.048, 0.025, 18));
    const armBase = new THREE.Mesh(armBaseGeo, accentPaintMat);
    armBase.position.set(0, baseY + baseH / 2 + 0.015, 0);
    moduleGroup.add(armBase);

    // Hombro articulado con servomotor
    const shoulderGeo = regGeo(new THREE.SphereGeometry(0.032, 16, 16));
    const shoulder = new THREE.Mesh(shoulderGeo, bodyPaintMat);
    shoulder.position.set(0, baseY + baseH / 2 + 0.045, 0);
    armShoulder = shoulder;
    moduleGroup.add(shoulder);

    // Brazo principal
    const bArmGeo = regGeo(new THREE.BoxGeometry(0.02, 0.11, 0.024));
    const bArm = new THREE.Mesh(bArmGeo, accentPaintMat);
    bArm.position.set(0, 0.065, 0.015);
    bArm.rotation.x = 0.25;
    shoulder.add(bArm);

    // Codo articulado
    const elbowGeo = regGeo(new THREE.SphereGeometry(0.025, 14, 14));
    const elbow = new THREE.Mesh(elbowGeo, bodyPaintMat);
    elbow.position.set(0, 0.06, 0);
    armElbow = elbow;
    bArm.add(elbow);

    // Antebrazo
    const fArmGeo = regGeo(new THREE.BoxGeometry(0.018, 0.09, 0.02));
    const fArm = new THREE.Mesh(fArmGeo, accentPaintMat);
    fArm.position.set(0, 0.05, 0.01);
    fArm.rotation.x = -0.45;
    elbow.add(fArm);

    // Micro-Pinza paralela servo
    const wristGeo = regGeo(new THREE.BoxGeometry(0.03, 0.018, 0.024));
    const wrist = new THREE.Mesh(wristGeo, chromeMat);
    wrist.position.set(0, 0.052, 0);
    fArm.add(wrist);

    const fGeo = regGeo(new THREE.BoxGeometry(0.005, 0.028, 0.012));
    const leftF = new THREE.Mesh(fGeo, chromeMat);
    leftF.position.set(-0.01, 0.022, 0);
    leftGripperFinger = leftF;

    const rightF = new THREE.Mesh(fGeo, chromeMat);
    rightF.position.set(0.01, 0.022, 0);
    rightGripperFinger = rightF;

    wrist.add(leftF, rightF);
  } else if (effectiveModule === 'cargo') {
    // Bandeja porta-muestras / bandejas de PCBs para salas limpias
    const trayGeo = regGeo(new THREE.BoxGeometry(baseW * 0.88, 0.012, baseL * 0.75));
    const tray = new THREE.Mesh(trayGeo, accentPaintMat);
    tray.position.set(0, baseY + baseH / 2 + 0.02, 0);
    moduleGroup.add(tray);

    // Rieles de sujeción para bandejas
    [-baseW * 0.4, baseW * 0.4].forEach((rx) => {
      const railGeo = regGeo(new THREE.BoxGeometry(0.008, 0.018, baseL * 0.72));
      const rail = new THREE.Mesh(railGeo, chromeMat);
      rail.position.set(rx, baseY + baseH / 2 + 0.03, 0);
      moduleGroup.add(rail);
    });
  } else if (effectiveModule === 'conveyor') {
    // Cama de micro-rodillos de transferencia
    const cBedGeo = regGeo(new THREE.BoxGeometry(baseW * 0.85, 0.014, baseL * 0.75));
    const cBed = new THREE.Mesh(cBedGeo, accentPaintMat);
    cBed.position.set(0, baseY + baseH / 2 + 0.015, 0);
    moduleGroup.add(cBed);

    for (let rz = -baseL * 0.3; rz <= baseL * 0.3; rz += 0.035) {
      const rGeo = regGeo(new THREE.CylinderGeometry(0.008, 0.008, baseW * 0.78, 12));
      rGeo.rotateZ(Math.PI / 2);
      const roller = new THREE.Mesh(rGeo, chromeMat);
      roller.position.set(0, baseY + baseH / 2 + 0.03, rz);
      conveyorRollers.push(roller);
      moduleGroup.add(roller);
    }
  } else if (effectiveModule === 'mast') {
    // Mástil telescópico con cámara PTZ
    const mastPoleGeo = regGeo(new THREE.CylinderGeometry(0.012, 0.015, 0.16, 12));
    const mastPole = new THREE.Mesh(mastPoleGeo, chromeMat);
    mastPole.position.set(0, baseY + baseH / 2 + 0.08, -baseL * 0.2);
    moduleGroup.add(mastPole);

    const ptzHeadGeo = regGeo(new THREE.SphereGeometry(0.026, 16, 14));
    const ptzHead = new THREE.Mesh(ptzHeadGeo, accentPaintMat);
    ptzHead.position.set(0, baseY + baseH / 2 + 0.17, -baseL * 0.2);
    mastHead = ptzHead;

    const eyeGeo = regGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.016, 14));
    eyeGeo.rotateX(Math.PI / 2);
    const eye = new THREE.Mesh(eyeGeo, glassLensMat);
    eye.position.set(0, 0, 0.024);
    ptzHead.add(eye);

    moduleGroup.add(ptzHead);
  }

  rootGroup.add(moduleGroup);

  // 5. SENSORES DE NAVEGACIÓN Y TELEMETRÍA (LiDAR, Cámaras RGB-D, Antena 5G)
  if (config.hasStereoVision) {
    // Barra de visión estereoscópica frontal en miniatura (estilo Intel RealSense D435)
    const camGeo = regGeo(new THREE.BoxGeometry(baseW * 0.55, 0.018, 0.016));
    const cam = new THREE.Mesh(camGeo, accentPaintMat);
    cam.position.set(0, baseY + baseH / 2 + 0.018, baseL / 2 - 0.01);
    sensorsGroup.add(cam);

    [-baseW * 0.2, baseW * 0.2].forEach((cx) => {
      const lensGeo = regGeo(new THREE.CylinderGeometry(0.006, 0.006, 0.006, 12));
      lensGeo.rotateX(Math.PI / 2);
      const lens = new THREE.Mesh(lensGeo, glassLensMat);
      lens.position.set(cx, baseY + baseH / 2 + 0.018, baseL / 2 - 0.001);
      sensorsGroup.add(lens);
    });
  }

  if (config.hasLidar) {
    // Micro-torreta LiDAR 360° (Puck compacto de 45 mm)
    const basePylonGeo = regGeo(new THREE.CylinderGeometry(0.022, 0.025, 0.03, 16));
    const pylon = new THREE.Mesh(basePylonGeo, accentPaintMat);
    pylon.position.set(0, baseY + baseH / 2 + 0.025, baseL * 0.1);
    sensorsGroup.add(pylon);

    const turretGeo = regGeo(new THREE.CylinderGeometry(0.026, 0.026, 0.024, 20));
    const turret = new THREE.Mesh(turretGeo, accentPaintMat);
    turret.position.set(0, baseY + baseH / 2 + 0.05, baseL * 0.1);

    const opticalRingGeo = regGeo(new THREE.CylinderGeometry(0.027, 0.027, 0.008, 20));
    const opticalRing = new THREE.Mesh(opticalRingGeo, glassLensMat);
    turret.add(opticalRing);

    lidarHead = turret;
    sensorsGroup.add(turret);
  }

  if (config.hasSafetyLaser) {
    // Sensor láser de seguridad frontal SIL2 micro
    const laserHousGeo = regGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.016, 14));
    const laserHous = new THREE.Mesh(laserHousGeo, ledEmergencyMat);
    laserHous.position.set(0, baseY - 0.015, baseL / 2 + 0.008);
    sensorsGroup.add(laserHous);
  }

  if (config.hasTelemetry5G) {
    // Antena micro SMA articulada
    const antGeo = regGeo(new THREE.CylinderGeometry(0.003, 0.004, 0.12, 8));
    const ant = new THREE.Mesh(antGeo, chromeMat);
    ant.position.set(-baseW / 2 + 0.025, baseY + baseH / 2 + 0.065, -baseL / 2 + 0.025);
    sensorsGroup.add(ant);
  }

  // Micro-baliza LED estroboscópica
  const beaconGeo = regGeo(new THREE.CylinderGeometry(0.012, 0.014, 0.018, 12));
  const beacon = new THREE.Mesh(beaconGeo, config.isEmergencyStop ? ledEmergencyMat : ledAmberMat);
  beacon.position.set(baseW / 2 - 0.025, baseY + baseH / 2 + 0.018, -baseL / 2 + 0.025);
  beaconLight = beacon;
  sensorsGroup.add(beacon);

  rootGroup.add(sensorsGroup);

  // 6. SIMULACIÓN DE HAZ LÁSER LIDAR (Escalado a rango de banco de laboratorio ~0.6m)
  if (config.isSimulatingScan && config.hasLidar) {
    const scanGeo = regGeo(new THREE.ConeGeometry(0.55, 0.65, 24, 1, true));
    scanGeo.rotateX(-Math.PI / 2);
    const scanMat = regMat(
      new THREE.MeshBasicMaterial({
        color: customLedColor,
        transparent: true,
        opacity: 0.22,
        wireframe: true,
        side: THREE.DoubleSide,
      })
    );
    const scanMesh = new THREE.Mesh(scanGeo, scanMat);
    scanMesh.position.set(0, baseY + baseH / 2 + 0.05, baseL * 0.1 + 0.35);
    laserScanMesh = scanMesh;
    simulationGroup.add(scanMesh);
  }

  if (config.hasSafetyLaser) {
    // Arco láser frontal en el suelo adaptado a la escala pequeña (radio 0.40m)
    const arcGeo = regGeo(new THREE.RingGeometry(0.28, 0.42, 24, 1, -Math.PI / 3, (2 * Math.PI) / 3));
    arcGeo.rotateX(-Math.PI / 2);
    const arcMat = regMat(
      new THREE.MeshBasicMaterial({
        color: config.isEmergencyStop ? 0xef4444 : 0x10b981,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      })
    );
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.position.set(0, 0.015, baseL / 2 + 0.01);
    safetyArcMesh = arcMesh;
    simulationGroup.add(arcMesh);
  }

  rootGroup.add(simulationGroup);

  return {
    rootGroup,
    chassisGroup,
    wheelsGroup,
    internalsGroup,
    moduleGroup,
    sensorsGroup,
    simulationGroup,
    lidarHead,
    laserScanMesh,
    safetyArcMesh,
    leftGripperFinger,
    rightGripperFinger,
    armShoulder,
    armElbow,
    mastHead,
    conveyorRollers,
    wheelsList,
    beaconLight,
    frontLights,
    materials,
    geometries,
  };
}
