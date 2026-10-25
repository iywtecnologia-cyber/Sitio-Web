import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RobotConfig, Active3DModel } from './types';
import { buildSceneModel, RobotModelParts } from './RobotModelBuilder';
import { Maximize2, Eye, Compass, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface RobotCanvas3DProps {
  modelType: Active3DModel;
  config: RobotConfig;
  autoRotate?: boolean;
  onToggleMotion?: () => void;
}

// Textura procedural de la plataforma circular de ensayo y calibración de banco
function createBenchPlatformTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Superficie circular antiestática ESD gris oscura
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, 1024, 1024);

  // Círculo principal de la plataforma
  ctx.beginPath();
  ctx.arc(512, 512, 490, 0, Math.PI * 2);
  ctx.fillStyle = '#0b1120';
  ctx.fill();

  // Borde exterior con franja de seguridad rayada en amarillo y negro
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 512, 480, 0, Math.PI * 2);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.setLineDash([18, 18]);
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();

  // Anillos concéntricos de calibración milimétrica
  const radii = [140, 260, 360, 440];
  radii.forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx === 1 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = idx === 1 ? 2.5 : 1.5;
    ctx.stroke();
  });

  // Marcas de ángulo cada 15 grados y etiquetas cada 90 grados
  for (let deg = 0; deg < 360; deg += 15) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 90 === 0;
    const rStart = isMajor ? 420 : 445;
    const rEnd = 465;

    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(rad) * rStart, 512 + Math.sin(rad) * rStart);
    ctx.lineTo(512 + Math.cos(rad) * rEnd, 512 + Math.sin(rad) * rEnd);
    ctx.strokeStyle = isMajor ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.stroke();

    if (isMajor) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textR = 395;
      ctx.fillText(`${deg}°`, 512 + Math.cos(rad) * textR, 512 + Math.sin(rad) * textR);
    }
  }

  // Ejes ópticos de alineación en cruz (X / Y)
  ctx.beginPath();
  ctx.moveTo(512, 70);
  ctx.lineTo(512, 954);
  ctx.moveTo(70, 512);
  ctx.lineTo(954, 512);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Tipografía técnica de ensayo de laboratorio
  ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TECNOROSARIO • BANCO DE PRUEBAS DE ROBÓTICA DE PRECISIÓN', 512, 475);
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('ZONA DE ENSAYO RESTRINGIDA • DIÁMETRO Ø 1.70 M', 512, 550);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const RobotCanvas3D: React.FC<RobotCanvas3DProps> = ({
  modelType,
  config,
  autoRotate = false,
  onToggleMotion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<RobotModelParts | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const modelTypeRef = useRef(modelType);
  modelTypeRef.current = modelType;
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;
  const prevModelTypeRef = useRef<Active3DModel>(modelType);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [is3DActive, setIs3DActive] = useState(false);
  const is3DActiveRef = useRef(is3DActive);
  is3DActiveRef.current = is3DActive;

  // Reconstrucción del modelo cuando cambian opciones, piezas o colores
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Capturar la pose espacial exacta actual (posición y orientación) antes de desmontar las geometrías
    // para que cualquier cambio de pieza se realice "in-situ" (en el lugar exacto donde esté el robot)
    let prevPosition: THREE.Vector3 | null = null;
    let prevRotation: THREE.Euler | null = null;

    if (partsRef.current) {
      prevPosition = partsRef.current.rootGroup.position.clone();
      prevRotation = partsRef.current.rootGroup.rotation.clone();

      scene.remove(partsRef.current.rootGroup);
      partsRef.current.geometries.forEach((g) => g.dispose());
      partsRef.current.materials.forEach((m) => m.dispose());
      partsRef.current = null;
    }

    const newParts = buildSceneModel(modelType, config);

    // Si veníamos de un robot y seguimos en robot (o el mismo tipo de modelo), preservamos la pose espacial exacta
    const isRobot = modelType === 'robot';
    const wasRobot = prevModelTypeRef.current === 'robot';
    const shouldPreservePose = prevPosition && prevRotation && (modelType === prevModelTypeRef.current || (isRobot && wasRobot));

    if (shouldPreservePose && prevPosition && prevRotation) {
      newParts.rootGroup.position.copy(prevPosition);
      newParts.rootGroup.rotation.copy(prevRotation);

      if (shadowMeshRef.current) {
        shadowMeshRef.current.position.x = prevPosition.x;
        shadowMeshRef.current.position.z = prevPosition.z;
      }
    }
    prevModelTypeRef.current = modelType;

    // Preservar la separación de vista explosionada si estaba activa
    if (config.explodedAmount > 0) {
      newParts.internalsGroup.position.y = config.explodedAmount * 0.12;
      newParts.moduleGroup.position.y = config.explodedAmount * 0.22;
      newParts.sensorsGroup.position.y = config.explodedAmount * 0.16;
    }

    partsRef.current = newParts;
    scene.add(newParts.rootGroup);
  }, [
    modelType,
    config.robotModelId,
    config.chassisType,
    config.missionModule,
    config.robotScale,
    config.colorHex,
    config.accentColorHex,
    config.wheelsColorHex,
    config.ledColorHex,
    config.metalness,
    config.roughness,
    config.hasLidar,
    config.hasSafetyLaser,
    config.hasStereoVision,
    config.hasUltrasonic,
    config.hasTelemetry5G,
    config.hasGpsRtk,
    config.lightsOn,
    config.gripperOpen,
    config.isSimulatingScan,
    config.isEmergencyStop,
  ]);

  // Ciclo de vida principal Three.js
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
    scene.background = new THREE.Color(0x05070e);
    scene.fog = new THREE.FogExp2(0x05070e, 0.12);

    // Cámara adaptada para robots compactos / dispositivos de mesa
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.05,
      30
    );
    camera.position.set(1.15, 0.75, 1.15);
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

    // Entorno de estudio HDRI procedural
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Iluminación de estudio
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x090d16, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(2.5, 4.0, 3.0);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.2;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      const d = 1.4;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    fillLight.position.set(-3, 2.5, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 0.95);
    rimLight.position.set(0, 3, -3.5);
    scene.add(rimLight);

    // 1. Piso ambiental inferior
    const ambientFloorGeo = new THREE.PlaneGeometry(16, 16);
    ambientFloorGeo.rotateX(-Math.PI / 2);
    const ambientFloorMat = new THREE.MeshStandardMaterial({
      color: 0x04060c,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ambientFloor = new THREE.Mesh(ambientFloorGeo, ambientFloorMat);
    ambientFloor.position.y = -0.02;
    ambientFloor.receiveShadow = true;
    scene.add(ambientFloor);

    // 2. Plataforma circular física de ensayo y calibración (Mesa de banco Ø 1.70m)
    const benchTex = createBenchPlatformTexture();
    const benchGeo = new THREE.CylinderGeometry(0.85, 0.90, 0.04, 64);
    const benchMat = new THREE.MeshStandardMaterial({
      map: benchTex,
      roughness: 0.35,
      metalness: 0.25,
      envMapIntensity: 1.0,
    });
    const benchPlatform = new THREE.Mesh(benchGeo, benchMat);
    benchPlatform.position.y = 0.02;
    benchPlatform.receiveShadow = true;
    scene.add(benchPlatform);

    // Anillo perimetral iluminado LED de seguridad que delimita estrictamente la plataforma
    const ledRingGeo = new THREE.TorusGeometry(0.86, 0.007, 12, 64);
    ledRingGeo.rotateX(Math.PI / 2);
    const ledRingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    const ledRing = new THREE.Mesh(ledRingGeo, ledRingMat);
    ledRing.position.y = 0.041;
    scene.add(ledRing);

    // 3. Trayectoria de navegación autónoma ROS 2 proyectada estrictamente en el centro (radio 0.28m)
    // Con radio 0.28m, el robot permanece SIEMPRE a >0.55m dentro de la plataforma (imposible salir)
    const patrolRadius = 0.28;
    const pathCurve = new THREE.EllipseCurve(0, 0, patrolRadius, patrolRadius, 0, 2 * Math.PI, false, 0);
    const pathPoints = pathCurve.getPoints(64).map((p) => new THREE.Vector3(p.x, 0.045, p.y));
    const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.65,
    });
    const pathLine = new THREE.LineLoop(pathGeo, pathMat);
    scene.add(pathLine);

    // 4. Sombra de contacto suave debajo del robot
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(0.55, 0.55);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = 0.043;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // OrbitControls: rotación libre en todas las dimensiones
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.45;
    controls.maxDistance = 4.5;
    controls.minPolarAngle = 0.0001;
    controls.maxPolarAngle = Math.PI - 0.0001;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.target.set(0, 0.12, 0);

    // OrbitControls: deshabilitamos enableZoom nativo para permitir scroll natural de la página
    controls.enableZoom = false;
    controls.minDistance = 0.45;
    controls.maxDistance = 4.5;

    // Zoom interactivo contextualmente conectado con la rueda del mouse ("la ruedita"):
    // Si el usuario scrollea, la página avanza normalmente; si hace clic en el 3D o mantiene Ctrl/Cmd, hace zoom en el modelo.
    const handleCanvasWheel = (e: WheelEvent) => {
      const isFocused = is3DActiveRef.current;
      const hasKeyModifier = e.ctrlKey || e.metaKey || e.altKey;

      if (isFocused || hasKeyModifier) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 0.92 : 1.08;
        const currentDist = camera.position.distanceTo(controls.target);
        const newDist = currentDist * factor;

        if (newDist >= 0.42 && newDist <= 4.6) {
          const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
          camera.position.copy(controls.target).add(offset);
          controls.update();
        }
      }
    };

    renderer.domElement.addEventListener('wheel', handleCanvasWheel, { passive: false });
    controls.update();

    // Montaje del modelo inicial
    const parts = buildSceneModel(modelTypeRef.current, configRef.current);
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

    const currentExploded = { value: configRef.current.explodedAmount };

    // Bucle de animación cinemática y física hiperrealista
    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const targetExp = configRef.current.explodedAmount;
      currentExploded.value = THREE.MathUtils.damp(currentExploded.value, targetExp, 8, delta);

      const p = partsRef.current;
      const cfg = configRef.current;

      if (p) {
        const exp = currentExploded.value;

        p.internalsGroup.position.y = exp * 0.12;
        p.moduleGroup.position.y = exp * 0.22;
        p.sensorsGroup.position.y = exp * 0.16;

        // Rotación continua del cabezal LiDAR
        if (p.lidarHead) {
          p.lidarHead.rotation.y += delta * 7.0;
        }

        // Haces de escaneo holográfico láser LiDAR
        if (p.laserScanMesh) {
          p.laserScanMesh.rotation.z += delta * 4.5;
          const mat = p.laserScanMesh.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.15 + Math.sin(elapsed * 7) * 0.08;
        }

        // Arco de seguridad láser de piso SIL2
        if (p.safetyArcMesh) {
          const mat = p.safetyArcMesh.material as THREE.MeshBasicMaterial;
          mat.opacity = cfg.isEmergencyStop ? 0.7 + Math.sin(elapsed * 16) * 0.25 : 0.35;
        }

        // =====================================================================
        // SIMULACIÓN DE MOVIMIENTO: ESTRICTAMENTE CONTENIDO EN EL CÍRCULO CENTRAL
        // =====================================================================
        if (modelTypeRef.current === 'robot' && cfg.isSimulatingMotion && !cfg.isEmergencyStop) {
          pathLine.visible = true;

          // Velocidad angular suave de demostración
          const patrolSpeed = 0.55;
          const t = elapsed * patrolSpeed;

          // Radio de trayectoria circular: 0.28m (estrictamente dentro de la plataforma de 0.85m)
          const targetX = Math.sin(t) * patrolRadius;
          const targetZ = Math.cos(t) * patrolRadius;

          // Vector de dirección tangencial (Yaw)
          const dx = Math.cos(t) * patrolRadius;
          const dz = -Math.sin(t) * patrolRadius;
          const targetYaw = Math.atan2(dx, dz);

          // Posicionamiento amortiguado sin derivas
          p.rootGroup.position.x = THREE.MathUtils.damp(p.rootGroup.position.x, targetX, 12, delta);
          p.rootGroup.position.z = THREE.MathUtils.damp(p.rootGroup.position.z, targetZ, 12, delta);

          // Micro-vibración mecánica de motor de banco
          const motorVibe = Math.sin(elapsed * 28) * 0.001;
          p.rootGroup.position.y = motorVibe;

          // Giro de orientación (Yaw) con inclinación física de carrocería en curvas (Roll)
          let diffYaw = targetYaw - p.rootGroup.rotation.y;
          diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
          p.rootGroup.rotation.y += diffYaw * Math.min(1, delta * 12);

          // Inclinación lateral realista en curvas
          p.rootGroup.rotation.z = THREE.MathUtils.damp(p.rootGroup.rotation.z, -diffYaw * 0.12, 8, delta);

          // Inclinación longitudinal (Pitch)
          const pitch = Math.sin(elapsed * 2.5) * 0.01;
          p.rootGroup.rotation.x = THREE.MathUtils.damp(p.rootGroup.rotation.x, pitch, 8, delta);

          // Sombra de contacto sigue exactamente al robot sobre la plataforma
          shadowMesh.position.x = p.rootGroup.position.x;
          shadowMesh.position.z = p.rootGroup.position.z;

          // Rotación de ruedas
          const wheelSpeed = delta * 9.0;
          p.wheelsList.forEach((w) => {
            w.rotation.x += wheelSpeed;
          });
          p.conveyorRollers.forEach((r) => {
            r.rotation.y += delta * 12.0;
          });
        } else {
          // Retorno suave y centrado al punto cero de la plataforma (0, 0, 0)
          pathLine.visible = false;
          p.rootGroup.position.x = THREE.MathUtils.damp(p.rootGroup.position.x, 0, 8, delta);
          p.rootGroup.position.z = THREE.MathUtils.damp(p.rootGroup.position.z, 0, 8, delta);
          p.rootGroup.position.y = THREE.MathUtils.damp(p.rootGroup.position.y, 0, 8, delta);
          p.rootGroup.rotation.y = THREE.MathUtils.damp(p.rootGroup.rotation.y, 0, 8, delta);
          p.rootGroup.rotation.z = THREE.MathUtils.damp(p.rootGroup.rotation.z, 0, 8, delta);
          p.rootGroup.rotation.x = THREE.MathUtils.damp(p.rootGroup.rotation.x, 0, 8, delta);

          shadowMesh.position.x = p.rootGroup.position.x;
          shadowMesh.position.z = p.rootGroup.position.z;
        }

        // Simulación: Tarea de manipulación robótica
        if (cfg.isSimulatingTask) {
          if (p.armShoulder) {
            p.armShoulder.rotation.y = Math.sin(elapsed * 1.5) * 0.6;
          }
          if (p.armElbow) {
            p.armElbow.rotation.z = Math.sin(elapsed * 2.0) * 0.35;
          }
          if (p.mastHead) {
            p.mastHead.rotation.y = Math.sin(elapsed * 1.2) * 0.8;
          }
          if (p.leftGripperFinger && p.rightGripperFinger) {
            const gripWave = 0.003 + Math.abs(Math.sin(elapsed * 3.0)) * 0.008;
            p.leftGripperFinger.position.x = -0.01 - gripWave;
            p.rightGripperFinger.position.x = 0.01 + gripWave;
          }
        }

        // Baliza estroboscópica
        if (p.beaconLight) {
          const bMat = p.beaconLight.material as THREE.MeshStandardMaterial;
          if (bMat) {
            const freq = cfg.isEmergencyStop ? 18 : 8;
            bMat.emissiveIntensity = cfg.lightsOn || cfg.isEmergencyStop
              ? 1.5 + Math.sin(elapsed * freq) * 1.5
              : 0;
          }
        }
      }

      controls.autoRotate = autoRotateRef.current;
      controls.autoRotateSpeed = 1.4;

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

      if (partsRef.current) {
        partsRef.current.geometries.forEach((g) => g.dispose());
        partsRef.current.materials.forEach((m) => m.dispose());
      }
      shadowMeshRef.current = null;
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      ambientFloorGeo.dispose();
      ambientFloorMat.dispose();
      benchGeo.dispose();
      benchMat.dispose();
      benchTex.dispose();
      ledRingGeo.dispose();
      ledRingMat.dispose();
      pathGeo.dispose();
      pathMat.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  const setCameraView = (view: 'iso' | 'front' | 'top' | 'bottom') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.target.set(0, 0.12, 0);
    if (view === 'iso') {
      camera.position.set(1.15, 0.75, 1.15);
    } else if (view === 'front') {
      camera.position.set(0, 0.35, 1.35);
    } else if (view === 'top') {
      // Vista cenital mirando directamente desde arriba
      camera.position.set(0.001, 1.45, 0.001);
    } else if (view === 'bottom') {
      // Vista inferior para inspeccionar chasis y ruedas
      camera.position.set(0.001, -0.65, 0.95);
    }
    camera.lookAt(controls.target);
    controls.update();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const factor = direction === 'in' ? 0.85 : 1.18;
    const currentDist = camera.position.distanceTo(controls.target);
    const newDist = currentDist * factor;

    if (newDist >= 0.45 && newDist <= 4.5) {
      const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[440px] lg:min-h-[620px] bg-slate-950/80 rounded-2xl overflow-hidden border transition-all duration-300 touch-pan-y ${
        is3DActive ? 'border-cyan-400/80 ring-2 ring-cyan-500/20' : 'border-slate-800/80'
      }`}
      onPointerDown={() => setIs3DActive(true)}
      onPointerLeave={() => setIs3DActive(false)}
    >
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-cyan-400">Renderizando hardware 3D de banco...</span>
          </div>
        </div>
      )}

      {/* Live Operation Telemetry HUD */}
      {modelType === 'robot' && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 max-w-[270px] sm:max-w-xs p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-xl text-xs font-mono">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${config.isEmergencyStop ? 'bg-red-500 animate-ping' : config.isSimulatingMotion ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-bold text-white text-[11px] sm:text-xs">
                {config.isEmergencyStop
                  ? 'PARADA SIL2 ACTIVADA'
                  : config.isSimulatingMotion
                  ? 'ENSAYO EN MOVIMIENTO'
                  : 'STANDBY EN BANCO'}
              </span>
            </div>
            {onToggleMotion && (
              <button
                onClick={onToggleMotion}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  config.isSimulatingMotion
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {config.isSimulatingMotion ? 'Pausar' : 'Iniciar'}
              </button>
            )}
          </div>

          {config.isSimulatingMotion && !config.isEmergencyStop && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 border-t border-slate-800 text-[10px] text-slate-300">
              <div>
                <span className="text-slate-500 block">Velocidad:</span>
                <span className="text-cyan-300 font-semibold">0.85 m/s (3.0 km/h)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Navegación:</span>
                <span className="text-emerald-300 font-semibold">SLAM 360° LiDAR</span>
              </div>
              <div>
                <span className="text-slate-500 block">Área de Ensayo:</span>
                <span className="text-white font-semibold">100% en Banco</span>
              </div>
              <div>
                <span className="text-slate-500 block">Control:</span>
                <span className="text-cyan-400 font-semibold">ROS 2 Nav2</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating HUD Controls: Camera Angles & Dedicated Zoom In / Out Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-mono shadow-xl">
        {/* Zoom In & Out */}
        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Acercar (Zoom In)"
        >
          <ZoomIn className="w-4 h-4 text-cyan-400" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Alejar (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4 text-cyan-400" />
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

        {/* Camera Views */}
        <button
          onClick={() => setCameraView('iso')}
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          title="Vista Isométrica"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Iso</span>
        </button>
        <button
          onClick={() => setCameraView('top')}
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          title="Vista Cenital (Mirar desde arriba)"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Arriba</span>
        </button>
        <button
          onClick={() => setCameraView('front')}
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          title="Vista Frontal"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frente</span>
        </button>
        <button
          onClick={() => setCameraView('bottom')}
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          title="Vista Inferior (Mirar chasis y ruedas desde abajo)"
        >
          <span>Abajo</span>
        </button>
      </div>

      {/* Touch & Scroll Interaction Tip */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 border border-slate-800/80 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md">
        <RotateCcw className="w-3 h-3 text-cyan-400" />
        <span>Arrastrá para rotar • Clic para foco 3D o Ctrl+Rueda para Zoom • Rueda libre para scrollear</span>
      </div>
    </div>
  );
};
