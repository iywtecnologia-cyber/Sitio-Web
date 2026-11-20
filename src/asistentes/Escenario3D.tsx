// Escenario 3D: el logo de tecnoros en el centro y los asistentes como personajes 3D
// girando siempre a su alrededor, haciendo gestos todo el tiempo (vueltas, saltos, giros, se menean).
// Todo se puede tocar y arrastrar: tocás un asistente y hace un gesto y te abre su chat; lo arrastrás
// y después vuelve a su órbita; arrastrando el piso girás todo. Cuando un asistente responde o hace
// algo, en el escenario salta y dice lo que hizo en un globito.
import React, { useEffect, useRef, useState } from 'react';
import { ASISTENTES } from './funciones';
import { crearModelo } from './modelos3D';
import { EV_DICE, EV_GESTO, EV_HIZO, abrirAsistente, hechos, type Gesto } from './eventos';

// Colores de los degradés de Tailwind que usa cada asistente (from-… to-…).
const TW: Record<string, string> = {
  'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4', 'sky-400': '#38bdf8', 'sky-500': '#0ea5e9', 'emerald-400': '#34d399', 'emerald-500': '#10b981',
  'teal-400': '#2dd4bf', 'teal-500': '#14b8a6', 'violet-400': '#a78bfa', 'fuchsia-500': '#d946ef', 'amber-400': '#fbbf24', 'orange-500': '#f97316',
  'blue-500': '#3b82f6', 'pink-400': '#f472b6', 'rose-500': '#f43f5e', 'lime-400': '#a3e635',
};
const colores = (degrade: string) => {
  const de = /from-([a-z]+-\d+)/.exec(degrade)?.[1] ?? 'cyan-400';
  const a = /to-([a-z]+-\d+)/.exec(degrade)?.[1] ?? 'sky-500';
  return [TW[de] ?? '#22d3ee', TW[a] ?? '#0ea5e9'] as const;
};
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

// El logo de tecnoros (escudo cian con el circuito en T) como textura del escudo del centro.
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" width="400" height="460"><path d="M50 6L89 19C89 62 80 92 50 110C20 92 11 62 11 19Z" fill="#0B1220" stroke="#00D2F3" stroke-width="7" stroke-linejoin="round"/><g stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M31 38H69M50 38V78M50 56H61L69 64"/></g><g fill="#00D2F3"><circle cx="31" cy="38" r="6"/><circle cx="69" cy="38" r="6"/><circle cx="69" cy="64" r="5.5"/><circle cx="50" cy="78" r="6"/></g></svg>`;

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
      scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.4));
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

      // Centro: el escudo con el logo de tecnoros
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
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO)}`;
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

      // Brillo suave (para el aura de cada asistente y las lucecitas que viajan al logo)
      const brillo = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const x = c.getContext('2d')!;
        const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(255,255,255,1)');
        gr.addColorStop(0.4, 'rgba(255,255,255,.45)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr;
        x.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      })();
      const brilloAura = brillo;
      // Los asistentes: cada uno es su personaje en 3D
      interface Bot {
        id: string;
        g: import('three').Group;
        cuerpo: import('three').Group;
        mat: import('three').SpriteMaterial;
        color: import('three').Color;
        animar: (t: number) => void;
        fase: number;
        trabajo: number;
        sostenido: import('three').Vector3 | null;
        volviendo: boolean;
        gesto: { tipo: string; t0: number; dur: number } | null;
        texturas: import('three').Texture[];
      }
      const bots: Bot[] = ASISTENTES.map((a, i) => {
        const [de] = colores(a.degrade);
        const g = new THREE.Group();
        const cuerpoBot = new THREE.Group();
        cuerpoBot.position.y = 1.15;
        g.add(cuerpoBot);
        // Aura de su color detrás (no es un cuadrado: es un brillo suave que se enciende cuando trabaja)
        const mat = new THREE.SpriteMaterial({ map: brilloAura, color: new THREE.Color(de), transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending });
        const aura = new THREE.Sprite(mat);
        aura.scale.set(1.9, 1.9, 1.9);
        aura.position.z = -0.05;
        cuerpoBot.add(aura);
        // El personaje en 3D (robot, paloma, bolsa de plata, rompecabezas, salvavidas, sobre, carpeta, equipo)
        const modelo = crearModelo(THREE, a.id);
        cuerpoBot.add(modelo.grupo);
        const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
        sombra.rotation.x = -Math.PI / 2;
        sombra.position.y = 0.02;
        sombra.name = 'sombra';
        g.add(sombra);
        g.traverse((o) => (o.userData.bot = a.id));
        mundo.add(g);
        return { id: a.id, g, cuerpo: cuerpoBot, mat, color: new THREE.Color(de), animar: modelo.animar, fase: i * 1.7 + Math.random(), trabajo: 0, sostenido: null, volviendo: false, gesto: null, texturas: [] };
      });

      const pulsos: { m: import('three').Sprite; curva: import('three').QuadraticBezierCurve3; t0: number }[] = [];
      const pulso = (b: Bot) => {
        const desde = b.g.position.clone().add(new THREE.Vector3(0, 1.2, 0));
        const hasta = new THREE.Vector3(0, 1.9, 0);
        const medio = desde.clone().add(hasta).multiplyScalar(0.5);
        medio.y += 1.6;
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: brillo, color: b.color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
        sp.scale.set(0.7, 0.7, 0.7);
        mundo.add(sp);
        pulsos.push({ m: sp, curva: new THREE.QuadraticBezierCurve3(desde, medio, hasta), t0: performance.now() });
      };
      const GESTOS = ['vuelta', 'giro', 'salto', 'meneo'];
      const hacerGesto = (b: Bot, tipo?: string) => {
        const t = tipo ?? GESTOS[Math.floor(Math.random() * GESTOS.length)];
        b.gesto = { tipo: t, t0: performance.now(), dur: t === 'meneo' ? 1100 : 900 };
      };

      // ─── Tamaño ───
      const ajustar = () => {
        const w = cont.clientWidth;
        const h = cont.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // En pantallas angostas se aleja un poco para que entren todos.
        camera.position.set(0, w < 500 ? 11 : 7.2, w < 500 ? 21 : 13.5);
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
          hacerGesto(bot, 'vuelta');
          bot.trabajo = 1;
          pulso(bot);
          setTimeout(() => abrirAsistente(bot.id), quieto ? 0 : 350);
        }
        if (bot && movio) {
          bot.sostenido = null;
          bot.volviendo = true;
          hacerGesto(bot, 'giro');
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
        if (!b) return;
        hacerGesto(b, tipo === 'saludo' ? 'meneo' : tipo === 'salto' ? 'salto' : 'vuelta');
        b.trabajo = 1;
        pulso(b);
      };
      window.addEventListener(EV_GESTO, alGesto);
      // Siempre hay alguno haciendo algo: cada tanto uno da una vuelta, salta, gira o se menea.
      const intervalo = quieto
        ? 0
        : window.setInterval(() => {
            const libres = bots.filter((b) => !b.gesto && !b.sostenido);
            const b = libres[Math.floor(Math.random() * libres.length)];
            if (!b) return;
            hacerGesto(b);
            if (Math.random() < 0.5) pulso(b);
          }, 1100);

      // ─── Animación ───
      let visible = true;
      const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
      io.observe(cont);
      let tOrbita = 0;
      let escudoLatido = 0;
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
        const t = ahora / 1000;
        const facil = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
        bots.forEach((b, i) => {
          const ang = tOrbita + (i / bots.length) * Math.PI * 2;
          const objetivo = b.sostenido ?? new THREE.Vector3(RX * Math.cos(ang), 0, RZ * Math.sin(ang));
          if (b.sostenido || b.volviendo) {
            b.g.position.lerp(objetivo, b.sostenido ? 0.35 : 0.08);
            if (b.volviendo && b.g.position.distanceTo(objetivo) < 0.05) b.volviendo = false;
          } else b.g.position.copy(objetivo);
          // Miran hacia la cámara (así se ve el emoji) y van mirando para los costados.
          b.g.rotation.y = -giro + (quieto ? 0 : Math.sin(t * 0.8 + b.fase) * 0.45);
          // Flotan y se balancean, cada uno a su ritmo; cuando trabajan rebotan y brillan.
          let y = 1.15 + (quieto ? 0 : Math.sin(t * 1.8 + b.fase) * 0.18) + b.trabajo * Math.abs(Math.sin(t * 9)) * 0.3;
          let rx = quieto ? 0 : Math.sin(t * 1.3 + b.fase) * 0.12;
          let ry = 0;
          let rz = quieto ? 0 : Math.sin(t * 1.1 + b.fase * 2) * 0.1;
          if (b.gesto) {
            const k = Math.min(1, (ahora - b.gesto.t0) / b.gesto.dur);
            const e = facil(k);
            if (b.gesto.tipo === 'vuelta') {
              rx = e * Math.PI * 2;
              y += Math.sin(Math.PI * k) * 1.1;
            } else if (b.gesto.tipo === 'giro') {
              ry = e * Math.PI * 2;
              y += Math.sin(Math.PI * k) * 0.45;
            } else if (b.gesto.tipo === 'salto') {
              y += Math.abs(Math.sin(Math.PI * 2 * k)) * 0.85;
            } else {
              rz = Math.sin(k * Math.PI * 6) * 0.45 * (1 - k);
            }
            if (k >= 1) b.gesto = null;
          }
          if (b.sostenido) y += 0.5;
          b.cuerpo.position.y = y;
          b.cuerpo.rotation.set(rx, ry, rz);
          if (!quieto) b.animar(t + b.fase);
          b.trabajo = Math.max(0, b.trabajo - dt / 2.6);
          b.mat.opacity = 0.3 + b.trabajo * 0.6;
          const esc = 1 + b.trabajo * 0.15;
          b.cuerpo.scale.set(esc, esc, esc);
          const sombra = b.g.getObjectByName('sombra');
          if (sombra) sombra.scale.setScalar(Math.max(0.5, 1.2 - (y - 1.15) * 0.4));

          // Etiqueta y globito, encima de cada uno.
          v3.set(0, y + 0.95, 0);
          b.g.localToWorld(v3);
          v3.project(camera);
          const bordes = w < 500 ? 58 : 70;
          const x = Math.max(bordes, Math.min(w - bordes, ((v3.x + 1) / 2) * w));
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
        for (let k = pulsos.length - 1; k >= 0; k--) {
          const pu = pulsos[k];
          const f = Math.min(1, (ahora - pu.t0) / (quieto ? 300 : 1100));
          pu.m.position.copy(pu.curva.getPoint(facil(f)));
          if (f >= 1) {
            mundo.remove(pu.m);
            pu.m.material.dispose();
            pulsos.splice(k, 1);
            escudoLatido = 1;
          }
        }
        escudoLatido = Math.max(0, escudoLatido - dt * 2.5);
        escudo.scale.setScalar(1 + escudoLatido * 0.08);
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(cuadro);

      limpiar = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener(EV_GESTO, alGesto);
        if (intervalo) window.clearInterval(intervalo);
        bots.forEach((b) => b.texturas.forEach((x) => x.dispose()));
        brillo.dispose();
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
        {!sin3D && <canvas ref={lienzo} className="absolute inset-0 w-full h-full" aria-label="Escenario 3D con el logo de tecnoros y los asistentes girando alrededor. Tocá uno para hablarle." />}
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
