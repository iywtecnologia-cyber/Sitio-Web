// Modelos 3D de cada asistente (los mismos personajes de los emojis, pero con volumen).
// Cada modelo mide ~1,3 unidades, está centrado en el origen y mira hacia +Z (la cámara).
// `animar(t)` les da vida propia: la paloma aletea, el robot mueve la antena, el sobre se abre, etc.
import type * as T3 from 'three';

type THREE = typeof T3;
export interface Modelo {
  grupo: T3.Group;
  animar: (t: number) => void;
}

const mat = (THREE: THREE, color: number, extra: Partial<T3.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05, ...extra });

const malla = (THREE: THREE, padre: T3.Object3D, geo: T3.BufferGeometry, m: T3.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
  const o = new THREE.Mesh(geo, m);
  o.position.set(x, y, z);
  o.rotation.set(rx, ry, rz);
  padre.add(o);
  return o;
};

// "$" dibujado para la bolsa de plata
const signoPeso = (THREE: THREE) => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  x.fillStyle = '#7a5a10';
  x.font = 'bold 110px Arial, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('$', 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const robot = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const gris = mat(THREE, 0xb8c2cc, { metalness: 0.5, roughness: 0.3 });
  const oscuro = mat(THREE, 0x334155, { metalness: 0.4, roughness: 0.3 });
  malla(THREE, g, new THREE.BoxGeometry(1.15, 0.95, 0.85), gris);
  malla(THREE, g, new THREE.BoxGeometry(0.95, 0.55, 0.05), oscuro, 0, 0.05, 0.43);
  const ojoM = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
  const ojos = [-0.22, 0.22].map((x) => malla(THREE, g, new THREE.SphereGeometry(0.11, 16, 12), ojoM, x, 0.1, 0.46));
  [-0.24, -0.08, 0.08, 0.24].forEach((x) => malla(THREE, g, new THREE.BoxGeometry(0.1, 0.08, 0.04), mat(THREE, 0xe2e8f0), x, -0.18, 0.47));
  [-1, 1].forEach((s) => malla(THREE, g, new THREE.CylinderGeometry(0.13, 0.13, 0.14, 20), oscuro, s * 0.64, 0, 0, 0, 0, Math.PI / 2));
  const antena = new THREE.Group();
  antena.position.y = 0.47;
  g.add(antena);
  malla(THREE, antena, new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), oscuro, 0, 0.17, 0);
  malla(THREE, antena, new THREE.SphereGeometry(0.1, 16, 12), mat(THREE, 0xef4444, { emissive: 0xef4444, emissiveIntensity: 0.6 }), 0, 0.38, 0);
  return {
    grupo: g,
    animar: (t) => {
      antena.rotation.z = Math.sin(t * 5) * 0.25;
      const parpadeo = Math.sin(t * 1.3) > 0.97 ? 0.15 : 1;
      ojos.forEach((o) => o.scale.set(1, parpadeo, 1));
    },
  };
};

const paloma = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const blanco = mat(THREE, 0xf8fafc, { roughness: 0.6 });
  const cuerpo = malla(THREE, g, new THREE.SphereGeometry(0.42, 24, 18), blanco, 0, -0.05, 0);
  cuerpo.scale.set(1.35, 0.85, 0.85);
  malla(THREE, g, new THREE.SphereGeometry(0.25, 20, 16), blanco, 0.5, 0.25, 0);
  malla(THREE, g, new THREE.ConeGeometry(0.07, 0.2, 12), mat(THREE, 0xf59e0b), 0.78, 0.22, 0, 0, 0, -Math.PI / 2);
  const ojoM = new THREE.MeshBasicMaterial({ color: 0x111827 });
  [-1, 1].forEach((s) => malla(THREE, g, new THREE.SphereGeometry(0.04, 10, 8), ojoM, 0.6, 0.3, s * 0.19));
  const cola = malla(THREE, g, new THREE.ConeGeometry(0.22, 0.45, 4), blanco, -0.68, 0.02, 0, 0, 0, Math.PI / 2);
  cola.scale.set(1, 1, 0.35);
  // Ramita de olivo en el pico
  const verde = mat(THREE, 0x65a30d);
  malla(THREE, g, new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6), mat(THREE, 0x78350f), 0.82, 0.1, 0, 0, 0, 0.4);
  [-0.08, 0.06].forEach((y, i) => {
    const h = malla(THREE, g, new THREE.SphereGeometry(0.07, 10, 8), verde, 0.84 + i * 0.06, y, i ? 0.05 : -0.05);
    h.scale.set(1.8, 0.6, 0.6);
  });
  const alas = [-1, 1].map((s) => {
    const pivote = new THREE.Group();
    pivote.position.set(-0.05, 0.15, s * 0.25);
    g.add(pivote);
    const ala = malla(THREE, pivote, new THREE.SphereGeometry(0.4, 18, 12), blanco, 0, 0, s * 0.32);
    ala.scale.set(0.75, 0.12, 1);
    return { pivote, s };
  });
  // Mira de costado hacia la derecha: la giramos un poco para que se vea de frente y perfil a la vez.
  g.rotation.y = -0.5;
  return {
    grupo: g,
    animar: (t) => alas.forEach(({ pivote, s }) => (pivote.rotation.x = s * (0.3 + Math.sin(t * 10) * 0.6))),
  };
};

const bolsa = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const tela = mat(THREE, 0xe9b949, { roughness: 0.75 });
  const panza = malla(THREE, g, new THREE.SphereGeometry(0.55, 28, 20), tela, 0, -0.15, 0);
  panza.scale.set(1, 0.95, 0.85);
  malla(THREE, g, new THREE.CylinderGeometry(0.16, 0.3, 0.3, 20), tela, 0, 0.42, 0);
  malla(THREE, g, new THREE.TorusGeometry(0.17, 0.05, 10, 24), mat(THREE, 0x92400e), 0, 0.38, 0, Math.PI / 2);
  const boca = malla(THREE, g, new THREE.ConeGeometry(0.3, 0.25, 20, 1, true), tela, 0, 0.66, 0, Math.PI);
  boca.scale.set(1, 1, 0.8);
  const signo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: signoPeso(THREE), transparent: true }));
  signo.position.set(0, -0.15, 0.475);
  g.add(signo);
  return { grupo: g, animar: (t) => (g.rotation.z = Math.sin(t * 2.2) * 0.06) };
};

const rompecabezas = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const f = new THREE.Shape();
  const L = 0.42;
  f.moveTo(-L, -L);
  f.lineTo(-0.12, -L);
  f.absarc(0, -L, 0.12, Math.PI, 0, false);
  f.lineTo(L, -L);
  f.lineTo(L, -0.12);
  f.absarc(L + 0.02, 0, 0.14, -Math.PI / 2, Math.PI / 2, false);
  f.lineTo(L, L);
  f.lineTo(0.12, L);
  f.absarc(0, L + 0.02, 0.14, 0, Math.PI, false);
  f.lineTo(-L, L);
  f.lineTo(-L, 0.12);
  f.absarc(-L, 0, 0.12, Math.PI / 2, -Math.PI / 2, true);
  f.closePath();
  const geo = new THREE.ExtrudeGeometry(f, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 16 });
  geo.center();
  malla(THREE, g, geo, mat(THREE, 0x4ade80, { roughness: 0.35 }));
  return { grupo: g, animar: (t) => (g.rotation.z = Math.sin(t * 1.5) * 0.2) };
};

// (Ya no se usa: el de soporte ahora son los auriculares)
export const salvavidas = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const rojo = mat(THREE, 0xef4444, { roughness: 0.4 });
  const blanco = mat(THREE, 0xf8fafc, { roughness: 0.4 });
  for (let i = 0; i < 4; i++) {
    const arco = malla(THREE, g, new THREE.TorusGeometry(0.45, 0.17, 16, 20, Math.PI / 2), i % 2 ? blanco : rojo);
    arco.rotation.z = (i * Math.PI) / 2 + Math.PI / 4;
  }
  const soga = mat(THREE, 0xfde68a, { roughness: 0.9 });
  const sogaAro = malla(THREE, g, new THREE.TorusGeometry(0.62, 0.025, 6, 64), soga);
  sogaAro.position.z = 0.02;
  return { grupo: g, animar: (t) => (g.rotation.z = t * 0.8) };
};

const sobre = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const papel = mat(THREE, 0xf1f5f9, { roughness: 0.7 });
  malla(THREE, g, new THREE.BoxGeometry(1.2, 0.8, 0.08), papel);
  // Pliegues de abajo
  const pliegue = new THREE.Shape();
  pliegue.moveTo(-0.6, -0.4);
  pliegue.lineTo(0, 0.02);
  pliegue.lineTo(0.6, -0.4);
  pliegue.closePath();
  malla(THREE, g, new THREE.ShapeGeometry(pliegue), mat(THREE, 0xe2e8f0, { side: 2 }), 0, 0, 0.045);
  // Solapa de arriba (se abre y se cierra)
  const bisagra = new THREE.Group();
  bisagra.position.set(0, 0.4, 0.045);
  g.add(bisagra);
  const solapa = new THREE.Shape();
  solapa.moveTo(-0.6, 0);
  solapa.lineTo(0.6, 0);
  solapa.lineTo(0, -0.45);
  solapa.closePath();
  malla(THREE, bisagra, new THREE.ShapeGeometry(solapa), mat(THREE, 0xcbd5e1, { side: 2 }));
  const sello = malla(THREE, bisagra, new THREE.CylinderGeometry(0.09, 0.09, 0.03, 20), mat(THREE, 0xdc2626), 0, -0.36, 0.02, Math.PI / 2);
  sello.name = 'sello';
  return { grupo: g, animar: (t) => (bisagra.rotation.x = -Math.max(0, Math.sin(t * 1.4)) * 2.2) };
};

const carpeta = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const amarillo = mat(THREE, 0xfbbf24, { roughness: 0.5 });
  const fondo = new THREE.Shape();
  fondo.moveTo(-0.6, -0.42);
  fondo.lineTo(0.6, -0.42);
  fondo.lineTo(0.6, 0.36);
  fondo.lineTo(-0.1, 0.36);
  fondo.lineTo(-0.2, 0.48);
  fondo.lineTo(-0.6, 0.48);
  fondo.closePath();
  const geo = new THREE.ExtrudeGeometry(fondo, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
  malla(THREE, g, geo, mat(THREE, 0xd97706, { roughness: 0.5 }), 0, 0, -0.12);
  [0, 1].forEach((i) => malla(THREE, g, new THREE.BoxGeometry(1.0, 0.7, 0.015), mat(THREE, 0xffffff), 0.02 + i * 0.04, -0.02 + i * 0.05, -0.03 + i * 0.02, 0, 0, i ? -0.05 : 0.04));
  const tapa = new THREE.Group();
  tapa.position.set(0, -0.42, 0.04);
  g.add(tapa);
  malla(THREE, tapa, new THREE.BoxGeometry(1.24, 0.74, 0.06), amarillo, 0, 0.37, 0);
  return { grupo: g, animar: (t) => (tapa.rotation.x = Math.max(0, Math.sin(t * 1.2)) * 0.6) };
};

const equipo = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const personas = [
    { x: 0.28, z: -0.15, color: 0x2563eb, piel: 0xf2c6a0, s: 0.9 },
    { x: -0.25, z: 0.1, color: 0x0ea5e9, piel: 0xe0ac80, s: 1 },
  ].map((p) => {
    const persona = new THREE.Group();
    persona.position.set(p.x, -0.1, p.z);
    persona.scale.setScalar(p.s);
    g.add(persona);
    const hombros = malla(THREE, persona, new THREE.SphereGeometry(0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(THREE, p.color), 0, -0.35, 0);
    hombros.scale.set(1, 0.9, 0.75);
    malla(THREE, persona, new THREE.SphereGeometry(0.24, 24, 18), mat(THREE, p.piel), 0, 0.15, 0);
    const pelo = malla(THREE, persona, new THREE.SphereGeometry(0.25, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2.2), mat(THREE, 0x3f2a1d, { roughness: 0.8 }), 0, 0.18, -0.02);
    pelo.rotation.x = -0.25;
    const ojoM = new THREE.MeshBasicMaterial({ color: 0x111827 });
    [-0.08, 0.08].forEach((x) => malla(THREE, persona, new THREE.SphereGeometry(0.03, 8, 6), ojoM, x, 0.17, 0.22));
    return persona;
  });
  g.scale.setScalar(1.3);
  return {
    grupo: g,
    animar: (t) => personas.forEach((p, i) => (p.rotation.y = Math.sin(t * 1.1 + i * 2) * 0.35)),
  };
};

// Auriculares (soporte técnico): solo los auriculares, sin micrófono
const auriculares = (THREE: THREE): Modelo => {
  const g = new THREE.Group();
  const negro = mat(THREE, 0x1f2937, { roughness: 0.35, metalness: 0.3 });
  const verde = mat(THREE, 0x84cc16, { roughness: 0.4 });
  malla(THREE, g, new THREE.TorusGeometry(0.5, 0.07, 12, 40, Math.PI), negro, 0, 0.05, 0);
  [-1, 1].forEach((s) => {
    malla(THREE, g, new THREE.CylinderGeometry(0.24, 0.24, 0.2, 28), negro, s * 0.52, -0.05, 0, 0, 0, Math.PI / 2);
    malla(THREE, g, new THREE.CylinderGeometry(0.2, 0.2, 0.06, 28), verde, s * 0.64, -0.05, 0, 0, 0, Math.PI / 2);
  });
  return { grupo: g, animar: (t) => (g.rotation.z = Math.sin(t * 2) * 0.12) };
};

const FABRICAS: Record<string, (THREE: THREE) => Modelo> = {
  servicios: rompecabezas,
  presupuesto: bolsa,
  productos: paloma,
  robot,
  proyectos: carpeta,
  equipo,
  contacto: sobre,
  soporte: auriculares,
};

export const crearModelo = (THREE: THREE, id: string): Modelo => (FABRICAS[id] ?? robot)(THREE);
