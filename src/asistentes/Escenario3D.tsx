// Escenario 3D: la G de Golondrina en el centro y los asistentes girando siempre a su alrededor.
// Todo se puede tocar y arrastrar: tocás un asistente y hace un gesto y te abre su chat; lo arrastrás
// y después vuelve a su órbita; arrastrando el piso girás todo. Cuando un asistente responde o hace
// algo, en el escenario salta y dice lo que hizo en un globito.
import React, { useEffect, useRef, useState } from 'react';
import { ASISTENTES } from './funciones';
import { EV_DICE, EV_GESTO, EV_HIZO, abrirAsistente, hechos, type Gesto } from './eventos';

const COLOR_HEX: Record<string, number> = {
  cyan: 0x22d3ee,
  emerald: 0x34d399,
  violet: 0xa78bfa,
  amber: 0xfbbf24,
  sky: 0x38bdf8,
  pink: 0xf472b6,
  teal: 0x2dd4bf,
  lime: 0xa3e635,
};

// La G de Golondrina dibujada en un canvas para usarla como textura del escudo.
const LOGO_G = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" width="400" height="460"><path d="M50 6L89 19C89 62 80 92 50 110C20 92 11 62 11 19Z" fill="#0B1220" stroke="#22D3EE" stroke-width="6" stroke-linejoin="round"/><path d="M66 40H42L32 50V70L42 80H58L66 72V62H52" fill="none" stroke="#F1F5F9" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="66" cy="40" r="6" fill="#22D3EE"/><circle cx="52" cy="62" r="6" fill="#22D3EE"/></svg>`;

export const Escenario3D: React.FC<{ alto?: string }> = ({ alto = 'h-[420px] sm:h-[480px]' }) => {
  const caja = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const etiquetas = useRef<Record<string, HTMLDivElement | null>>({});
  const globos = useRef<Record<string, HTMLDivElement | null>>({});
  const [sin3D, setSin3D] = useState(false);
  const [lista, setLista] = useState(hechos.slice());

  useEffect(() => {
    const act = () => setLista(hechos.slice());
    window.addEventListener(EV_HIZO, act);
    return () => window.removeEventListener(EV_HIZO, act);
  }, []);

  useEffect(() => {
    let cancelado = false;
    let limpiar = () => {};
    (async () => {
      const THREE = await import('three');
      if (cancelado || !lienzo.current || !caja.current) return;
      const canvas = lienzo.current;
      const cont = caja.current;
      const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        setSin3D(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
      camera.position.set(0, 7.2, 13.5);
      camera.lookAt(0, 1.2, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.1));
      const sol = new THREE.DirectionalLight(0xffffff, 1.2);
      sol.position.set(5, 10, 8);
      scene.add(sol);
      const relleno = new THREE.DirectionalLight(0x67e8f9, 0.5);
      relleno.position.set(-8, 4, -6);
      scene.add(relleno);

      const mundo = new THREE.Group();
      scene.add(mundo);
      const RX = 4.7;
      const RZ = 3.1;

      // Piso y órbita punteada
      const piso = new THREE.Mesh(new THREE.CircleGeometry(6.6, 72), new THREE.MeshStandardMaterial({ color: 0x0f1b2d, roughness: 1, transparent: true, opacity: 0.85 }));
      piso.rotation.x = -Math.PI / 2;
      piso.scale.set(1, 0.72, 1);
      mundo.add(piso);
      const pts: import('three').Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const t = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(RX * Math.cos(t), 0.03, RZ * Math.sin(t)));
      }
      const anillo = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0x22d3ee, dashSize: 0.22, gapSize: 0.16, transparent: true, opacity: 0.55 }));
      anillo.computeLineDistances();
      mundo.add(anillo);

      // Centro: el escudo de Golondrina con la G
      const escudo = new THREE.Group();
      escudo.position.y = 1.9;
      mundo.add(escudo);
      const forma = new THREE.Shape();
      const p = (x: number, y: number) => [(x - 50) / 30, (57.5 - y) / 30] as const;
      forma.moveTo(...p(50, 6));
      forma.lineTo(...p(89, 19));
      forma.bezierCurveTo(...p(89, 62), ...p(80, 92), ...p(50, 110));
      forma.bezierCurveTo(...p(20, 92), ...p(11, 62), ...p(11, 19));
      forma.closePath();
      const cuerpo = new THREE.Mesh(
        new THREE.ExtrudeGeometry(forma, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 3 }),
        new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.35, metalness: 0.4, emissive: 0x0e7490, emissiveIntensity: 0.15 }),
      );
      cuerpo.position.z = -0.2;
      escudo.add(cuerpo);
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_G)}`;
      const tex = new THREE.Texture(img);
      img.onload = () => {
        tex.needsUpdate = true;
      };
      tex.colorSpace = THREE.SRGBColorSpace;
      const cara = new THREE.Mesh(new THREE.PlaneGeometry(100 / 30, 115 / 30), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      cara.position.z = 0.24;
      escudo.add(cara);
      const dorso = cara.clone();
      dorso.rotation.y = Math.PI;
      dorso.position.z = -0.3;
      escudo.add(dorso);

      // Los asistentes: cuerpito con visor, ojos y antena del color de cada uno
      interface Bot {
        id: string;
        g: import('three').Group;
        cuerpo: import('three').Group;
        sostenido: import('three').Vector3 | null;
        volviendo: boolean;
        gesto: { tipo: Gesto; t0: number } | null;
      }
      const bots: Bot[] = ASISTENTES.map((a) => {
        const color = COLOR_HEX[a.color] ?? 0x22d3ee;
        const g = new THREE.Group();
        const cuerpoBot = new THREE.Group();
        g.add(cuerpoBot);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.1 });
        const tronco = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.5, 6, 16), mat);
        tronco.position.y = 0.75;
        cuerpoBot.add(tronco);
        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 16), mat);
        cabeza.position.y = 1.55;
        cuerpoBot.add(cabeza);
        const visor = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16, -Math.PI / 2.4, Math.PI / 1.2, Math.PI / 3.2, Math.PI / 2.6), new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.2 }));
        visor.position.set(0, 1.55, 0.13);
        cuerpoBot.add(visor);
        const ojoMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
        [-0.13, 0.13].forEach((x) => {
          const ojo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), ojoMat);
          ojo.position.set(x, 1.6, 0.47);
          cuerpoBot.add(ojo);
        });
        const antena = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8), mat);
        antena.position.y = 2.1;
        cuerpoBot.add(antena);
        const bolita = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color }));
        bolita.position.y = 2.3;
        cuerpoBot.add(bolita);
        [-0.55, 0.55].forEach((x) => {
          const brazo = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.4, 4, 8), mat);
          brazo.position.set(x, 0.85, 0);
          brazo.rotation.z = x > 0 ? -0.3 : 0.3;
          brazo.name = x > 0 ? 'brazoDer' : 'brazoIzq';
          cuerpoBot.add(brazo);
        });
        const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }));
        sombra.rotation.x = -Math.PI / 2;
        sombra.position.y = 0.02;
        g.add(sombra);
        g.traverse((o) => (o.userData.bot = a.id));
        mundo.add(g);
        return { id: a.id, g, cuerpo: cuerpoBot, sostenido: null, volviendo: false, gesto: null };
      });

      // ─── Tamaño ───
      const ajustar = () => {
        const w = cont.clientWidth;
        const h = cont.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // En pantallas angostas se aleja un poco para que entren todos.
        camera.position.set(0, w < 500 ? 9 : 7.2, w < 500 ? 17 : 13.5);
        camera.lookAt(0, 1.2, 0);
        camera.updateProjectionMatrix();
      };
      ajustar();
      const ro = new ResizeObserver(ajustar);
      ro.observe(cont);

      // ─── Tocar y arrastrar ───
      const rayo = new THREE.Raycaster();
      const ptr = new THREE.Vector2();
      const planoPiso = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const aNDC = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      };
      const botBajo = (e: PointerEvent) => {
        aNDC(e);
        rayo.setFromCamera(ptr, camera);
        const h = rayo.intersectObjects(bots.map((b) => b.g), true)[0];
        return h ? bots.find((b) => b.id === h.object.userData.bot) ?? null : null;
      };
      const puntoPiso = (e: PointerEvent) => {
        aNDC(e);
        rayo.setFromCamera(ptr, camera);
        const v = new THREE.Vector3();
        if (!rayo.ray.intersectPlane(planoPiso, v)) return null;
        return mundo.worldToLocal(v);
      };
      let giro = 0;
      let vel = 0;
      let arrastre: { x: number; y: number; movio: boolean; bot: Bot | null } | null = null;
      const abajo = (e: PointerEvent) => {
        canvas.setPointerCapture(e.pointerId);
        arrastre = { x: e.clientX, y: e.clientY, movio: false, bot: botBajo(e) };
      };
      const mover = (e: PointerEvent) => {
        if (!arrastre) {
          canvas.style.cursor = botBajo(e) ? 'pointer' : 'grab';
          return;
        }
        if (!arrastre.movio && Math.hypot(e.clientX - arrastre.x, e.clientY - arrastre.y) < 6) return;
        arrastre.movio = true;
        if (arrastre.bot) {
          const v = puntoPiso(e);
          if (v) arrastre.bot.sostenido = new THREE.Vector3(Math.max(-6, Math.min(6, v.x)), 0.9, Math.max(-4, Math.min(4, v.z)));
        } else {
          vel = (e.movementX || 0) * 0.006;
          giro += vel;
        }
      };
      const arriba = () => {
        if (!arrastre) return;
        const { bot, movio } = arrastre;
        if (bot && !movio) {
          bot.gesto = { tipo: 'vuelta', t0: performance.now() };
          setTimeout(() => abrirAsistente(bot.id), quieto ? 0 : 350);
        }
        if (bot && movio) {
          bot.sostenido = null;
          bot.volviendo = true;
          bot.gesto = { tipo: 'salto', t0: performance.now() };
        }
        arrastre = null;
      };
      canvas.addEventListener('pointerdown', abajo);
      canvas.addEventListener('pointermove', mover);
      canvas.addEventListener('pointerup', arriba);
      canvas.addEventListener('pointercancel', arriba);

      // ─── Gestos y globitos que llegan del chat ───
      const alGesto = (e: Event) => {
        const { id, tipo } = (e as CustomEvent<{ id: string; tipo: Gesto }>).detail;
        const b = bots.find((x) => x.id === id);
        if (b) b.gesto = { tipo, t0: performance.now() };
      };
      window.addEventListener(EV_GESTO, alGesto);

      // ─── Animación ───
      let visible = true;
      const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
      io.observe(cont);
      let tOrbita = 0;
      let antes = performance.now();
      let raf = 0;
      const v3 = new THREE.Vector3();
      const cuadro = (ahora: number) => {
        raf = requestAnimationFrame(cuadro);
        const dt = Math.min(0.05, (ahora - antes) / 1000);
        antes = ahora;
        if (!visible) return;
        if (!quieto) tOrbita += dt * 0.22;
        if (!arrastre && Math.abs(vel) > 1e-4) {
          giro += vel;
          vel *= 0.92;
        }
        mundo.rotation.y = giro;
        escudo.rotation.y = quieto ? 0 : Math.sin(ahora / 1400) * 0.5;
        escudo.position.y = 1.9 + (quieto ? 0 : Math.sin(ahora / 900) * 0.12);

        const w = cont.clientWidth;
        const h = cont.clientHeight;
        bots.forEach((b, i) => {
          const ang = tOrbita + (i / bots.length) * Math.PI * 2;
          const objetivo = b.sostenido ?? new THREE.Vector3(RX * Math.cos(ang), 0, RZ * Math.sin(ang));
          if (b.sostenido || b.volviendo) {
            b.g.position.lerp(objetivo, b.sostenido ? 0.35 : 0.08);
            if (b.volviendo && b.g.position.distanceTo(objetivo) < 0.05) b.volviendo = false;
          } else b.g.position.copy(objetivo);
          // Miran hacia afuera de la órbita, levemente hacia la cámara.
          b.g.rotation.y = Math.atan2(b.g.position.x, b.g.position.z) * 0.6;
          // Flotan, cada uno a su ritmo.
          let y = quieto ? 0 : Math.sin(ahora / 420 + i) * 0.08;
          let rotY = 0;
          let rotZ = 0;
          const brazoDer = b.cuerpo.getObjectByName('brazoDer');
          if (brazoDer) brazoDer.rotation.z = -0.3;
          if (b.gesto) {
            const t = (ahora - b.gesto.t0) / 1000;
            if (t > 1) b.gesto = null;
            else if (b.gesto.tipo === 'salto') y += Math.sin(t * Math.PI) * 1.1;
            else if (b.gesto.tipo === 'vuelta') {
              rotY = t * Math.PI * 2;
              y += Math.sin(t * Math.PI) * 0.5;
            } else if (brazoDer) {
              brazoDer.rotation.z = -2.4 + Math.sin(t * Math.PI * 6) * 0.4;
              rotZ = Math.sin(t * Math.PI * 4) * 0.08;
            }
          }
          if (b.sostenido) y += 0.4;
          b.cuerpo.position.y = y;
          b.cuerpo.rotation.y = rotY;
          b.cuerpo.rotation.z = rotZ;

          // Etiqueta y globito, encima de cada uno.
          v3.set(0, 2.75 + y, 0);
          b.g.localToWorld(v3);
          v3.project(camera);
          const x = ((v3.x + 1) / 2) * w;
          const yy = ((1 - v3.y) / 2) * h;
          const delante = v3.z < 1;
          const prof = Math.max(0.75, Math.min(1.1, 1.25 - (b.g.position.z + RZ) / (RZ * 6)));
          const et = etiquetas.current[b.id];
          if (et) {
            et.style.transform = `translate(${x}px, ${yy}px) translate(-50%, -100%) scale(${prof})`;
            et.style.zIndex = String(Math.round(100 + b.g.position.z * 10));
            et.style.opacity = delante ? '1' : '0';
          }
          const gl = globos.current[b.id];
          if (gl) gl.style.transform = `translate(${x}px, ${yy - 34}px) translate(-50%, -100%)`;
        });
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(cuadro);

      limpiar = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener(EV_GESTO, alGesto);
        canvas.removeEventListener('pointerdown', abajo);
        canvas.removeEventListener('pointermove', mover);
        canvas.removeEventListener('pointerup', arriba);
        canvas.removeEventListener('pointercancel', arriba);
        scene.traverse((o) => {
          const m = o as import('three').Mesh;
          m.geometry?.dispose?.();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          mats.forEach((x) => x.dispose());
        });
        tex.dispose();
        renderer.dispose();
      };
    })();
    return () => {
      cancelado = true;
      limpiar();
    };
  }, []);

  // Globitos: lo que dice cada asistente cuando responde o hace algo.
  useEffect(() => {
    const timers: Record<string, number> = {};
    const alDecir = (e: Event) => {
      const { id, texto } = (e as CustomEvent<{ id: string; texto: string }>).detail;
      const el = globos.current[id];
      if (!el) return;
      el.textContent = texto.length > 70 ? `${texto.slice(0, 68)}…` : texto;
      el.style.opacity = '1';
      window.clearTimeout(timers[id]);
      timers[id] = window.setTimeout(() => (el.style.opacity = '0'), 4500);
    };
    window.addEventListener(EV_DICE, alDecir);
    return () => {
      window.removeEventListener(EV_DICE, alDecir);
      Object.values(timers).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div>
      <div ref={caja} className={`relative w-full ${alto} rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/80 via-[#0a1426] to-[#060b16] border border-cyan-500/20 touch-none select-none`}>
        {!sin3D && <canvas ref={lienzo} className="absolute inset-0 w-full h-full" aria-label="Escenario 3D con la G de Golondrina y los asistentes girando alrededor. Tocá uno para hablarle." />}
        {/* Nombre de cada asistente sobre su cabeza (también sirve para tocarlo con el teclado) */}
        <div className="absolute inset-0 pointer-events-none">
          {ASISTENTES.map((a) => (
            <React.Fragment key={a.id}>
              <div ref={(el) => { etiquetas.current[a.id] = el; }} className="absolute left-0 top-0 will-change-transform" style={sin3D ? { position: 'static' } : undefined}>
                <button
                  type="button"
                  onClick={() => abrirAsistente(a.id)}
                  className="pointer-events-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0B1220]/90 border border-white/15 text-[11px] sm:text-xs font-bold text-white whitespace-nowrap shadow-lg cursor-pointer hover:border-cyan-300"
                >
                  <span aria-hidden="true">{a.emoji}</span> {a.nombre}
                </button>
              </div>
              <div
                ref={(el) => { globos.current[a.id] = el; }}
                aria-live="polite"
                className="absolute left-0 top-0 max-w-[220px] px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-300 will-change-transform"
              />
            </React.Fragment>
          ))}
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 bottom-3 px-3 py-1 rounded-full bg-black/40 text-[11px] sm:text-xs text-slate-300 whitespace-nowrap pointer-events-none">
          Tocá un asistente para hablarle · arrastralo · girá el piso
        </p>
      </div>
      {lista.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-bold text-white">Lo que hicieron los asistentes</h3>
          <ol className="mt-2 space-y-1.5">
            {lista.map((h, i) => {
              const a = ASISTENTES.find((x) => x.id === h.id);
              return (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-xs font-mono text-slate-500 mt-0.5">{h.hora}</span>
                  <span aria-hidden="true">{a?.emoji}</span>
                  <span><b className="text-white">{a?.nombre}</b> {h.texto}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Escenario3D;
