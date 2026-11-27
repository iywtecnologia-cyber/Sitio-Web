// Fábrica de sistemas · la «spec»: un documento JSON que describe el sistema de un negocio
// (entidades, pantallas, roles, flujos, marca). La IA escribe y corrige la spec; el motor
// (Motor.tsx) la convierte en una aplicación funcionando. Este archivo lo usan la web y el Worker.

export type TipoCampo = 'texto' | 'texto_largo' | 'numero' | 'dinero' | 'fecha' | 'hora' | 'opcion' | 'si_no' | 'telefono' | 'email' | 'relacion';

export interface Campo {
  id: string;
  etiqueta: string;
  tipo: TipoCampo;
  requerido?: boolean;
  opciones?: string[]; // tipo «opcion»
  entidad?: string; // tipo «relacion»: id de la otra entidad
  enListado?: boolean; // se muestra como columna (por defecto: los primeros 5)
}

export interface Aprobacion {
  campo: string; // campo numérico que se compara
  mayorA: number;
  rol: string; // rol que aprueba
  estadoPendiente: string; // estado en el que queda hasta aprobarse
}

export interface Flujo {
  campo: string; // campo «opcion» que guarda el estado
  estados: string[]; // en orden
  aprobaciones?: Aprobacion[];
}

export interface Entidad {
  id: string;
  nombre: string; // singular: «Pedido»
  plural: string; // «Pedidos»
  icono?: string; // un emoji
  campos: Campo[];
  flujo?: Flujo;
  ejemplos?: Record<string, string | number | boolean>[];
}

export interface Pantalla {
  id: string;
  titulo: string;
  tipo: 'tablero' | 'listado' | 'calendario';
  entidad?: string; // listado / calendario
  campoFecha?: string; // calendario
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Automatizacion {
  id: string;
  cuando: string; // «Un pedido pasa a Listo»
  accion: string; // «Avisar al cliente por WhatsApp»
}

export interface Spec {
  version: 1;
  negocio: { nombre: string; rubro: string; descripcion: string };
  marca: { colorPrimario: string; logo?: string };
  roles: Rol[];
  entidades: Entidad[];
  pantallas: Pantalla[];
  automatizaciones: Automatizacion[];
  golondrina: { saludo: string };
}

const TIPOS: TipoCampo[] = ['texto', 'texto_largo', 'numero', 'dinero', 'fecha', 'hora', 'opcion', 'si_no', 'telefono', 'email', 'relacion'];
const ID = /^[a-z][a-z0-9_]{0,39}$/;
const COLOR = /^#[0-9a-fA-F]{6}$/;

/** Devuelve la lista de problemas (vacía = la spec es válida). */
export function validar(s: unknown): string[] {
  const e: string[] = [];
  const spec = s as Spec;
  if (!spec || typeof spec !== 'object') return ['La spec no es un objeto.'];
  if (spec.version !== 1) e.push('version debe ser 1.');
  if (!spec.negocio?.nombre) e.push('negocio.nombre es obligatorio.');
  if (!COLOR.test(spec.marca?.colorPrimario ?? '')) e.push('marca.colorPrimario debe ser un color #rrggbb.');
  if (spec.marca?.logo && !/^data:image\/(png|jpeg|svg\+xml|webp);base64,/.test(spec.marca.logo)) e.push('marca.logo debe ser una imagen en data URL.');
  if (!Array.isArray(spec.entidades) || spec.entidades.length === 0) e.push('Hace falta al menos una entidad.');
  if (!Array.isArray(spec.pantallas) || spec.pantallas.length === 0) e.push('Hace falta al menos una pantalla.');
  if (!Array.isArray(spec.roles)) e.push('roles debe ser una lista.');
  if (!Array.isArray(spec.automatizaciones)) e.push('automatizaciones debe ser una lista.');
  const idsEntidad = new Set<string>();
  for (const en of spec.entidades ?? []) {
    if (!ID.test(en.id)) e.push(`Entidad con id inválido: «${en.id}».`);
    if (idsEntidad.has(en.id)) e.push(`Entidad repetida: «${en.id}».`);
    idsEntidad.add(en.id);
    if (!en.nombre || !en.plural) e.push(`La entidad «${en.id}» necesita nombre y plural.`);
    const idsCampo = new Set<string>();
    for (const c of en.campos ?? []) {
      if (!ID.test(c.id)) e.push(`Campo con id inválido en «${en.id}»: «${c.id}».`);
      if (idsCampo.has(c.id)) e.push(`Campo repetido en «${en.id}»: «${c.id}».`);
      idsCampo.add(c.id);
      if (!TIPOS.includes(c.tipo)) e.push(`Tipo de campo desconocido en «${en.id}.${c.id}»: «${c.tipo}».`);
      if (c.tipo === 'opcion' && !(c.opciones?.length)) e.push(`El campo «${en.id}.${c.id}» es de opción y no tiene opciones.`);
    }
    if (!(en.campos?.length)) e.push(`La entidad «${en.id}» no tiene campos.`);
    if (en.flujo) {
      const campo = en.campos.find((c) => c.id === en.flujo!.campo);
      if (!campo || campo.tipo !== 'opcion') e.push(`El flujo de «${en.id}» apunta a un campo de opción que no existe.`);
      for (const a of en.flujo.aprobaciones ?? []) {
        if (!en.campos.some((c) => c.id === a.campo)) e.push(`La aprobación de «${en.id}» usa un campo que no existe: «${a.campo}».`);
        if (!en.flujo.estados.includes(a.estadoPendiente)) e.push(`La aprobación de «${en.id}» usa un estado que no existe: «${a.estadoPendiente}».`);
      }
    }
  }
  for (const en of spec.entidades ?? []) {
    for (const c of en.campos ?? []) {
      if (c.tipo === 'relacion' && !idsEntidad.has(c.entidad ?? '')) e.push(`«${en.id}.${c.id}» se relaciona con una entidad que no existe.`);
    }
  }
  for (const p of spec.pantallas ?? []) {
    if (!ID.test(p.id)) e.push(`Pantalla con id inválido: «${p.id}».`);
    if (p.tipo !== 'tablero' && !idsEntidad.has(p.entidad ?? '')) e.push(`La pantalla «${p.id}» apunta a una entidad que no existe.`);
  }
  return e;
}

// ── Parches (JSON Patch, RFC 6902: add / replace / remove) ─────────────────────────────

export interface OpParche {
  op: 'add' | 'replace' | 'remove';
  path: string; // JSON Pointer: /entidades/0/campos/-
  value?: unknown;
}

const partes = (path: string) =>
  path.split('/').slice(1).map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~'));

/** Aplica el parche sobre una copia; si algún paso falla, lanza un error y no cambia nada. */
export function aplicarParche(spec: Spec, parche: OpParche[]): Spec {
  const copia = JSON.parse(JSON.stringify(spec)) as Spec;
  for (const op of parche) {
    const ps = partes(op.path);
    if (ps.length === 0) throw new Error('No se puede reemplazar la spec entera.');
    // Las rutas por nombre («/entidades/pedido/...») se traducen al índice correspondiente.
    let padre: unknown = copia;
    for (let i = 0; i < ps.length - 1; i++) padre = paso(padre, ps, i);
    const ultima = ps.at(-1)!;
    if (Array.isArray(padre)) {
      const idx = ultima === '-' ? padre.length : indice(padre, ultima);
      if (op.op === 'add') padre.splice(idx, 0, op.value);
      else if (idx >= padre.length) throw new Error(`No existe ${op.path}`);
      else if (op.op === 'replace') padre[idx] = op.value;
      else padre.splice(idx, 1);
    } else if (padre && typeof padre === 'object') {
      const obj = padre as Record<string, unknown>;
      if (op.op === 'remove') {
        if (!(ultima in obj)) throw new Error(`No existe ${op.path}`);
        delete obj[ultima];
      } else obj[ultima] = op.value;
    } else throw new Error(`Ruta inválida: ${op.path}`);
  }
  const problemas = validar(copia);
  if (problemas.length) throw new Error(problemas.join(' '));
  return copia;
}

function indice(lista: unknown[], clave: string): number {
  if (/^\d+$/.test(clave)) return Number(clave);
  const i = lista.findIndex((x) => (x as { id?: string })?.id === clave);
  if (i < 0) throw new Error(`No encontré «${clave}».`);
  return i;
}

function paso(padre: unknown, ps: string[], i: number): unknown {
  const clave = ps.at(i)!;
  if (Array.isArray(padre)) return padre.at(indice(padre, clave));
  if (padre && typeof padre === 'object' && clave in (padre as object)) return (padre as Record<string, unknown>)[clave];
  throw new Error(`Ruta inválida: /${ps.join('/')}`);
}

// ── Ayudas ──────────────────────────────────────────────────────────────────────────────

/** «Nuevo pedido» / «Nueva reserva» / «Nueva orden de trabajo». */
export const nuevoDe = (nombre: string) => {
  const primera = nombre.trim().split(/\s+/)[0].toLowerCase();
  const fem = /(a|ión|dad|orden)$/.test(primera) && !/^(dia|día|sistema|problema|tema|mapa)$/.test(primera);
  return `${fem ? 'Nueva' : 'Nuevo'} ${nombre.toLowerCase()}`;
};

export const slug = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').replace(/^(\d)/, 'c_$1').slice(0, 40) || 'campo';

export const COLORES: Record<string, string> = {
  azul: '#2563eb', celeste: '#0ea5e9', verde: '#16a34a', rojo: '#dc2626', naranja: '#ea580c', amarillo: '#ca8a04',
  violeta: '#7c3aed', rosa: '#db2777', negro: '#111827', gris: '#475569', bordo: '#881337', turquesa: '#0d9488',
};

/** Esquema JSON de la spec, para pedirle a Claude una salida estructurada que valide. */
export const ESQUEMA_SPEC = {
  type: 'object',
  required: ['version', 'negocio', 'marca', 'roles', 'entidades', 'pantallas', 'automatizaciones', 'golondrina'],
  properties: {
    version: { const: 1 },
    negocio: { type: 'object', required: ['nombre', 'rubro', 'descripcion'], properties: { nombre: { type: 'string' }, rubro: { type: 'string' }, descripcion: { type: 'string' } } },
    marca: { type: 'object', required: ['colorPrimario'], properties: { colorPrimario: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' } } },
    roles: { type: 'array', items: { type: 'object', required: ['id', 'nombre'], properties: { id: { type: 'string' }, nombre: { type: 'string' }, descripcion: { type: 'string' } } } },
    entidades: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'nombre', 'plural', 'campos'],
        properties: {
          id: { type: 'string', pattern: '^[a-z][a-z0-9_]{0,39}$' },
          nombre: { type: 'string' },
          plural: { type: 'string' },
          icono: { type: 'string' },
          campos: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'etiqueta', 'tipo'],
              properties: {
                id: { type: 'string', pattern: '^[a-z][a-z0-9_]{0,39}$' },
                etiqueta: { type: 'string' },
                tipo: { enum: TIPOS },
                requerido: { type: 'boolean' },
                opciones: { type: 'array', items: { type: 'string' } },
                entidad: { type: 'string' },
                enListado: { type: 'boolean' },
              },
            },
          },
          flujo: {
            type: 'object',
            required: ['campo', 'estados'],
            properties: {
              campo: { type: 'string' },
              estados: { type: 'array', items: { type: 'string' } },
              aprobaciones: { type: 'array', items: { type: 'object', required: ['campo', 'mayorA', 'rol', 'estadoPendiente'], properties: { campo: { type: 'string' }, mayorA: { type: 'number' }, rol: { type: 'string' }, estadoPendiente: { type: 'string' } } } },
            },
          },
          ejemplos: { type: 'array', items: { type: 'object' } },
        },
      },
    },
    pantallas: { type: 'array', items: { type: 'object', required: ['id', 'titulo', 'tipo'], properties: { id: { type: 'string' }, titulo: { type: 'string' }, tipo: { enum: ['tablero', 'listado', 'calendario'] }, entidad: { type: 'string' }, campoFecha: { type: 'string' } } } },
    automatizaciones: { type: 'array', items: { type: 'object', required: ['id', 'cuando', 'accion'], properties: { id: { type: 'string' }, cuando: { type: 'string' }, accion: { type: 'string' } } } },
    golondrina: { type: 'object', required: ['saludo'], properties: { saludo: { type: 'string' } } },
  },
} as const;
