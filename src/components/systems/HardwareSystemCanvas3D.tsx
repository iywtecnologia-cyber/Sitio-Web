import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildSceneModel, RobotModelParts } from '../robotics/RobotModelBuilder';
import { RobotConfig } from '../robotics/types';
import { ZoomIn, ZoomOut, RotateCcw, Play, Square, Eye, ShieldCheck, Workflow, ScrollText, MousePointer, ArrowDown, Compass } from 'lucide-react';

interface HardwareSystemCanvas3DProps {
  systemType: 'tero' | 'golondrina' | 'colibri';
  filamentColor?: string;
  autoRotate?: boolean;
  colibriMode?: 'voice' | 'text' | 'shield' | 'learn';
  explodedAmount?: number;
}

// Textura procedural de la mesa de inspección técnica de hardware
function createHardwareBenchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Superficie ESD mate
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 1024, 1024);

  // Rejilla técnica milimétrica
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Círculo de inspección
  ctx.beginPath();
  ctx.arc(512, 512, 440, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Marcas radiales
  for (let deg = 0; deg < 360; deg += 30) {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(rad) * 410, 512 + Math.sin(rad) * 410);
    ctx.lineTo(512 + Math.cos(rad) * 440, 512 + Math.sin(rad) * 440);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Leyenda técnica
  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TECNOROSARIO • BANCO DE INSPECCIÓN DE SISTEMAS Y DISPOSITIVOS A MEDIDA', 512, 490);
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('PROTOTIPADO RÁPIDO & FABRICACIÓN INDUSTRIAL EN ROSARIO', 512, 535);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const HardwareSystemCanvas3D: React.FC<HardwareSystemCanvas3DProps> = ({
  systemType,
  filamentColor = '#18181b',
  autoRotate: initialAutoRotate = false,
  colibriMode = 'voice',
  explodedAmount = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<RobotModelParts | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const systemTypeRef = useRef(systemType);
  systemTypeRef.current = systemType;
  const filamentColorRef = useRef(filamentColor);
  filamentColorRef.current = filamentColor;

  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de control de la ruedita: conexión íntima por contexto entre Scroll de Página y Zoom 3D
  const [wheelMode, setWheelMode] = useState<'contextual' | 'zoom' | 'scroll'>('contextual');
  const [is3DActive, setIs3DActive] = useState(false);
  const wheelModeRef = useRef(wheelMode);
  wheelModeRef.current = wheelMode;
  const is3DActiveRef = useRef(is3DActive);
  is3DActiveRef.current = is3DActive;

  // Si el usuario presiona la tecla Escape, libera inmediatamente el foco del 3D para continuar scrolleando
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIs3DActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Configuración base para el builder
  const makeConfig = (color: string): RobotConfig => ({
    robotName: systemType.toUpperCase(),
    robotModelId: 'mini_amr',
    chassisType: 'differential',
    missionModule: 'cargo',
    robotScale: systemType === 'colibri' ? 'micro' : 'compact',
    colorHex: color,
    accentColorHex: '#1e2430',
    wheelsColorHex: '#f1f5f9',
    ledColorHex: systemType === 'tero' ? '#0284c7' : systemType === 'colibri' ? '#06b6d4' : '#10b981',
    colibriMode: colibriMode,
    metalness: 0.85,
    roughness: 0.25,
    batteryType: 'docking_24_7',
    ipRating: 'ip54',
    hasLidar: false,
    hasSafetyLaser: false,
    hasStereoVision: false,
    hasUltrasonic: false,
    hasTelemetry5G: true,
    hasGpsRtk: false,
    lightsOn: true,
    gripperOpen: false,
    explodedAmount: explodedAmount,
    isSimulatingMotion: false,
    isSimulatingScan: false,
    isSimulatingTask: false,
    isEmergencyStop: false,
  });

  // Reconstrucción reactiva del modelo cuando cambia el tipo de sistema o el color del filamento
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (partsRef.current) {
      scene.remove(partsRef.current.rootGroup);
      partsRef.current.materials.forEach((m) => m.dispose());
      partsRef.current.geometries.forEach((g) => g.dispose());
    }

    const cfg = makeConfig(filamentColor);
    const parts = buildSceneModel(systemType, cfg);
    partsRef.current = parts;
    scene.add(parts.rootGroup);

    // Ajustar ángulo y elevación del modelo para inspección óptima
    if (systemType === 'tero') {
      parts.rootGroup.position.set(0, 0.04, 0);
      parts.rootGroup.rotation.set(0.1, -0.4, 0);
    } else if (systemType === 'colibri') {
      parts.rootGroup.position.set(0, 0.05, 0);
      parts.rootGroup.rotation.set(0.14, -0.38, 0);
    } else {
      parts.rootGroup.position.set(0, 0.08, 0);
      parts.rootGroup.rotation.set(0.12, -0.35, 0);
    }
  }, [systemType, filamentColor, colibriMode, explodedAmount]);

  // Actualización de rotación automática
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [autoRotate]);

  // Inicialización de Three.js
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.15);

    // Cámara de inspección cercana
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.05,
      20
    );
    // Posición inicial centrada y cercana al equipo
    camera.position.set(0.65, 0.42, 0.65);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Entorno HDRI procedural
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Iluminación de estudio
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x090d16, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(2, 3.5, 2.5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.2;
      keyLight.shadow.camera.far = 8;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-2.5, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 0.9);
    rimLight.position.set(0, 2.5, -3);
    scene.add(rimLight);

    // Iluminación inferior dirigida para visualizar el equipo desde abajo con nitidez
    const bottomLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    bottomLight.position.set(0, -3.0, 1.2);
    scene.add(bottomLight);

    const bottomWarmLight = new THREE.DirectionalLight(0xf59e0b, 0.85);
    bottomWarmLight.position.set(-1.2, -2.2, -1.2);
    scene.add(bottomWarmLight);

    // Plataforma circular de banco de calibración suspendida con espacio libre inferior
    // Permite que la cámara orbite completamente por debajo sin oclusiones
    const benchTex = createHardwareBenchTexture();
    const benchGeo = new THREE.CylinderGeometry(0.55, 0.58, 0.02, 48);
    const benchMat = new THREE.MeshStandardMaterial({
      map: benchTex,
      roughness: 0.35,
      metalness: 0.25,
      envMapIntensity: 1.0,
      transparent: true,
      opacity: 0.75,
    });
    const benchPlatform = new THREE.Mesh(benchGeo, benchMat);
    benchPlatform.position.y = -0.16;
    benchPlatform.receiveShadow = true;
    scene.add(benchPlatform);

    // Anillo LED perimetral de calibración
    const ledRingGeo = new THREE.TorusGeometry(0.56, 0.005, 12, 48);
    ledRingGeo.rotateX(Math.PI / 2);
    const ledRingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });
    const ledRing = new THREE.Mesh(ledRingGeo, ledRingMat);
    ledRing.position.y = -0.15;
    scene.add(ledRing);

    // 4 soportes técnicos de banco que elevan el equipo para inspección inferior libre
    [
      [-0.14, -0.09],
      [0.14, -0.09],
      [-0.14, 0.09],
      [0.14, 0.09],
    ].forEach(([px, pz]) => {
      const postGeo = new THREE.CylinderGeometry(0.0035, 0.005, 0.18, 12);
      const postMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.2,
        metalness: 0.9,
      });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, -0.07, pz);
      scene.add(post);

      const padGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.004, 12);
      const padMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.8,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(px, 0.02, pz);
      scene.add(pad);
    });

    // OrbitControls: rotación 360° total en TODAS las direcciones (arriba, costados y abajo)
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controls.enableZoom = false; // Gestionado contextualmente por handleCanvasWheel
    controls.minDistance = 0.20;
    controls.maxDistance = 2.4;
    controls.minPolarAngle = 0.0001; // Permite mirar directamente desde arriba (cenital)
    controls.maxPolarAngle = Math.PI - 0.0001; // Permite mirar directamente desde abajo (inferior)
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.target.set(0, 0.08, 0);

    // CONEXIÓN ÍNTIMA POR CONTEXTO ENTRE RUEDITA, ZOOM 3D Y SCROLL DE PÁGINA:
    // - Si el usuario simplemente pasa la ruedita por encima: la página web se desplaza libremente sin trabarse.
    // - Si el usuario interactúa activamente (hace clic/arrastra sobre el 3D), mantiene presionada Ctrl/Cmd,
    //   o activa el modo Zoom en el panel: la ruedita hace zoom fluido, inmediato e interactivo.
    const handleCanvasWheel = (e: WheelEvent) => {
      const mode = wheelModeRef.current;
      const isExplicitZoom = mode === 'zoom';
      const isExplicitScroll = mode === 'scroll';
      const isFocused = is3DActiveRef.current;
      const hasKeyModifier = e.ctrlKey || e.metaKey || e.altKey;

      const shouldZoom = !isExplicitScroll && (isExplicitZoom || isFocused || hasKeyModifier);

      if (shouldZoom) {
        e.preventDefault(); // Zoom 3D sin mover la página web
        const factor = e.deltaY < 0 ? 0.92 : 1.08;
        const currentDist = camera.position.distanceTo(controls.target);
        const newDist = currentDist * factor;

        if (newDist >= 0.22 && newDist <= 2.35) {
          const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
          camera.position.copy(controls.target).add(offset);
          controls.update();

          const zoomPct = Math.round(((2.35 - newDist) / (2.35 - 0.22)) * 100);
          setZoomLevel(Math.max(10, Math.min(200, zoomPct + 40)));
        }
      }
      // Si no es Zoom, el evento rueda scrollea naturalmente la página web sin ser bloqueado
    };

    renderer.domElement.addEventListener('wheel', handleCanvasWheel, { passive: false });
    controls.update();

    // Montar modelo inicial
    const cfg = makeConfig(filamentColorRef.current);
    const parts = buildSceneModel(systemTypeRef.current, cfg);
    partsRef.current = parts;
    scene.add(parts.rootGroup);
    setIsLoading(false);

    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const delta = clock.getDelta();
      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('wheel', handleCanvasWheel);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      controls.dispose();
      renderer.dispose();
      if (partsRef.current) {
        partsRef.current.materials.forEach((m) => m.dispose());
        partsRef.current.geometries.forEach((g) => g.dispose());
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Botones de acción manual de zoom
  const handleZoom = (inDirection: boolean) => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    const zoomDelta = inDirection ? 0.85 : 1.18;
    const currentDist = camera.position.distanceTo(controls.target);
    const newDist = currentDist * zoomDelta;

    if (newDist >= 0.25 && newDist <= 2.2) {
      const offset = camera.position.clone().sub(controls.target).multiplyScalar(zoomDelta);
      camera.position.copy(controls.target).add(offset);
      controls.update();
      setZoomLevel((prev) => (inDirection ? Math.min(200, prev + 25) : Math.max(10, prev - 25)));
    }
  };

  const handleResetCamera = () => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    camera.position.set(0.65, 0.42, 0.65);
    controls.target.set(0, 0.08, 0);
    controls.update();
    setZoomLevel(100);
  };

  const handleViewUnderneath = () => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    camera.position.set(0.01, -0.62, 0.22);
    controls.target.set(0, 0.08, 0);
    controls.update();
  };

  const handleViewTop = () => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    camera.position.set(0.01, 0.75, 0.12);
    controls.target.set(0, 0.08, 0);
    controls.update();
  };

  return (
    <div
      className={`relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden bg-slate-950 border transition-all duration-300 shadow-2xl group/canvas ${
        is3DActive
          ? 'border-cyan-400/80 ring-2 ring-cyan-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
      onPointerDown={() => setIs3DActive(true)}
      onPointerLeave={() => {
        // Al salir del cuadro, si no está fijado el modo zoom, liberamos el scroll de página
        if (wheelMode === 'contextual') {
          setIs3DActive(false);
        }
      }}
    >
      {/* Contenedor del lienzo Three.js */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Overlay de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-cyan-300">Cargando modelo 3D del hardware...</span>
          </div>
        </div>
      )}

      {/* Etiqueta superior del sistema en pantalla */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-lg">
          {systemType === 'tero' ? (
            <>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>TERO Security • Ciberseguridad IDS/IPS (Próximamente)</span>
            </>
          ) : (
            <>
              <Workflow className="w-4 h-4 text-emerald-400" />
              <span>Golondrina Automatización • Servicio Activo Disponible</span>
            </>
          )}
        </div>

        {/* Indicador de Estado Contextual de la Ruedita */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-2 transition-all backdrop-blur-md shadow-md ${
              wheelMode === 'zoom' || (wheelMode === 'contextual' && is3DActive)
                ? 'bg-cyan-950/85 border-cyan-400/60 text-cyan-300'
                : 'bg-slate-950/85 border-slate-800/80 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                wheelMode === 'zoom' || (wheelMode === 'contextual' && is3DActive)
                  ? 'bg-cyan-400 animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span>
              {wheelMode === 'zoom'
                ? '🔍 Ruedita: Zoom 3D Fijo'
                : wheelMode === 'scroll'
                ? '📜 Ruedita: Scroll Web Fijo'
                : is3DActive
                ? '🎯 Inspección 3D activa • Ruedita hace Zoom'
                : '📜 Scroll Web • Clic adentro o Ctrl+Rueda para Zoom'}
            </span>
          </div>

          {is3DActive && wheelMode === 'contextual' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIs3DActive(false);
              }}
              title="Volver a permitir scroll normal de la página web"
              className="pointer-events-auto px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700 shadow transition-colors cursor-pointer"
            >
              Liberar Scroll
            </button>
          )}
        </div>
      </div>

      {/* Controles interactivos HUD flotantes inferiores */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Guía contextual de control */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-auto shadow-md backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rotación 360° total (arriba, costados y abajo) • Clic para foco • Ctrl+Rueda para zoom</span>
        </div>

        {/* Botonera de control de rueda, zoom y rotación */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 pointer-events-auto shadow-lg backdrop-blur-md">
          {/* Selector de modo de rueda rápido (Zoom 3D vs Scroll Web) */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800/80 mr-1">
            <button
              type="button"
              onClick={() => {
                setWheelMode((prev) => (prev === 'zoom' ? 'contextual' : 'zoom'));
                setIs3DActive(true);
              }}
              title="Fijar la ruedita en modo Zoom 3D"
              className={`px-2 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                wheelMode === 'zoom' || (wheelMode === 'contextual' && is3DActive)
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ZoomIn className="w-3 h-3 text-cyan-400" />
              <span>Zoom 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWheelMode((prev) => (prev === 'scroll' ? 'contextual' : 'scroll'));
                setIs3DActive(false);
              }}
              title="Fijar la ruedita para scrollear libremente la página"
              className={`px-2 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                wheelMode === 'scroll'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ScrollText className="w-3 h-3" />
              <span>Scroll</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleZoom(true)}
            title="Acercar (Zoom In)"
            aria-label="Acercar zoom"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom(false)}
            title="Alejar (Zoom Out)"
            aria-label="Alejar zoom"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleViewUnderneath}
            title="Inspeccionar directamente desde abajo (Vista inferior 360°)"
            aria-label="Ver desde abajo"
            className="px-2 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
          >
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Ver Abajo</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          <button
            type="button"
            onClick={handleResetCamera}
            title="Restablecer posición inicial de cámara"
            aria-label="Restablecer cámara"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            title={autoRotate ? 'Pausar auto-rotación' : 'Activar auto-rotación'}
            aria-label="Auto rotación"
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {autoRotate ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{autoRotate ? 'Pausar' : 'Girar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
