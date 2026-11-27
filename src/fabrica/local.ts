// Modo sin IA: entrevista guiada, plantillas por rubro y cambios simples interpretados localmente.
// Sirve cuando el Worker con Claude no está configurado (desarrollo, demo o falla de red) y como
// red de seguridad: el usuario siempre llega a ver un sistema funcionando.
import { COLORES, aplicarParche, slug, type Campo, type Entidad, type OpParche, type Spec } from './spec';

export interface Pregunta {
  id: string;
  texto: string;
  opciones?: string[];
  ayuda?: string;
}

export const PREGUNTAS: Pregunta[] = [
  { id: 'negocio', texto: '¡Hola! Contame cómo se llama tu negocio y a qué se dedica.', ayuda: 'Ej.: «Taller Rivas, arreglamos autos en Rosario».' },
  { id: 'repite', texto: '¿Qué es lo que más se repite en tu día?', opciones: ['Tomar pedidos', 'Dar turnos', 'Vender en el mostrador', 'Reservas o alquileres', 'Reparaciones o servicio técnico'] },
  { id: 'datos', texto: '¿Qué anotás de cada uno? Nombralo como lo decís vos, separado por comas.', ayuda: 'Ej.: «cliente, teléfono, patente, problema, presupuesto».' },
  { id: 'equipo', texto: '¿Quiénes más trabajan con vos y qué hace cada uno?', ayuda: 'Ej.: «un mecánico y mi señora que atiende el teléfono».' },
  { id: 'aprueba', texto: '¿Hay algo que alguien tenga que aprobar antes de seguir?', opciones: ['No, nada', 'Sí, los montos grandes', 'Sí, todo lo aprueba el dueño'], ayuda: 'Si es por monto, decime desde cuánto: «más de 300000».' },
  { id: 'duele', texto: '¿Qué te gustaría dejar de hacer a mano?', opciones: ['Avisar a los clientes', 'Llevar la planilla', 'Saber quién me debe', 'Recordar turnos'] },
  { id: 'color', texto: 'Por último: ¿de qué color es tu marca?', opciones: ['Azul', 'Verde', 'Rojo', 'Violeta', 'Naranja', 'Negro'] },
];

type Rubro = 'pedidos' | 'turnos' | 'ventas' | 'reservas' | 'reparaciones';

const RUBRO_TEXTO: Record<Rubro, string> = { pedidos: 'Pedidos y entregas', turnos: 'Turnos y agenda', ventas: 'Ventas y caja', reservas: 'Reservas', reparaciones: 'Servicio técnico' };

const detectarRubro = (r: string): Rubro => {
  const t = r.toLowerCase();
  if (/turno|consult|agenda|cita|peluq|odont|medic/.test(t)) return 'turnos';
  if (/reserv|alquil|cancha|cabaña|habitaci/.test(t)) return 'reservas';
  if (/repar|servicio t|taller|arregl|t[eé]cnic/.test(t)) return 'reparaciones';
  if (/mostrador|vend|caja|kiosco|almac/.test(t)) return 'ventas';
  return 'pedidos';
};

const cliente = (): Entidad => ({
  id: 'cliente', nombre: 'Cliente', plural: 'Clientes', icono: '👤',
  campos: [
    { id: 'nombre', etiqueta: 'Nombre', tipo: 'texto', requerido: true },
    { id: 'telefono', etiqueta: 'Teléfono', tipo: 'telefono' },
    { id: 'email', etiqueta: 'E-mail', tipo: 'email' },
    { id: 'notas', etiqueta: 'Notas', tipo: 'texto_largo', enListado: false },
  ],
  ejemplos: [
    { nombre: 'Laura Gómez', telefono: '341 555 0101', email: 'laura@ejemplo.com' },
    { nombre: 'Martín Ruiz', telefono: '341 555 0102', email: 'martin@ejemplo.com' },
    { nombre: 'Sofía Díaz', telefono: '341 555 0103', email: 'sofia@ejemplo.com' },
  ],
});

const hoy = (d = 0) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

const PLANTILLAS: Record<Rubro, () => Entidad> = {
  pedidos: () => ({
    id: 'pedido', nombre: 'Pedido', plural: 'Pedidos', icono: '📦',
    campos: [
      { id: 'cliente', etiqueta: 'Cliente', tipo: 'relacion', entidad: 'cliente', requerido: true },
      { id: 'detalle', etiqueta: 'Detalle', tipo: 'texto', requerido: true },
      { id: 'total', etiqueta: 'Total', tipo: 'dinero' },
      { id: 'entrega', etiqueta: 'Fecha de entrega', tipo: 'fecha' },
      { id: 'estado', etiqueta: 'Estado', tipo: 'opcion', opciones: ['Nuevo', 'En preparación', 'Listo', 'Entregado'] },
    ],
    flujo: { campo: 'estado', estados: ['Nuevo', 'En preparación', 'Listo', 'Entregado'] },
    ejemplos: [
      { cliente: 'Laura Gómez', detalle: '2 docenas de empanadas', total: 18000, entrega: hoy(0), estado: 'En preparación' },
      { cliente: 'Martín Ruiz', detalle: 'Torta de cumpleaños', total: 42000, entrega: hoy(1), estado: 'Nuevo' },
      { cliente: 'Sofía Díaz', detalle: 'Bandeja de sándwiches', total: 26500, entrega: hoy(-1), estado: 'Entregado' },
    ],
  }),
  turnos: () => ({
    id: 'turno', nombre: 'Turno', plural: 'Turnos', icono: '📅',
    campos: [
      { id: 'cliente', etiqueta: 'Cliente', tipo: 'relacion', entidad: 'cliente', requerido: true },
      { id: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true },
      { id: 'hora', etiqueta: 'Hora', tipo: 'hora', requerido: true },
      { id: 'motivo', etiqueta: 'Motivo', tipo: 'texto' },
      { id: 'estado', etiqueta: 'Estado', tipo: 'opcion', opciones: ['Pedido', 'Confirmado', 'Atendido', 'Cancelado'] },
    ],
    flujo: { campo: 'estado', estados: ['Pedido', 'Confirmado', 'Atendido', 'Cancelado'] },
    ejemplos: [
      { cliente: 'Laura Gómez', fecha: hoy(0), hora: '10:00', motivo: 'Primera consulta', estado: 'Confirmado' },
      { cliente: 'Martín Ruiz', fecha: hoy(0), hora: '11:30', motivo: 'Control', estado: 'Pedido' },
      { cliente: 'Sofía Díaz', fecha: hoy(1), hora: '9:00', motivo: 'Seguimiento', estado: 'Confirmado' },
    ],
  }),
  ventas: () => ({
    id: 'venta', nombre: 'Venta', plural: 'Ventas', icono: '🧾',
    campos: [
      { id: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true },
      { id: 'detalle', etiqueta: 'Qué se vendió', tipo: 'texto', requerido: true },
      { id: 'total', etiqueta: 'Total', tipo: 'dinero', requerido: true },
      { id: 'pago', etiqueta: 'Forma de pago', tipo: 'opcion', opciones: ['Efectivo', 'Transferencia', 'Tarjeta', 'Fiado'] },
      { id: 'cliente', etiqueta: 'Cliente', tipo: 'relacion', entidad: 'cliente' },
    ],
    ejemplos: [
      { fecha: hoy(0), detalle: 'Yerba 1 kg y azúcar', total: 7300, pago: 'Efectivo', cliente: 'Laura Gómez' },
      { fecha: hoy(0), detalle: 'Bidón de agua', total: 3900, pago: 'Transferencia', cliente: 'Martín Ruiz' },
      { fecha: hoy(-1), detalle: 'Compra del mes', total: 58200, pago: 'Fiado', cliente: 'Sofía Díaz' },
    ],
  }),
  reservas: () => ({
    id: 'reserva', nombre: 'Reserva', plural: 'Reservas', icono: '🗓️',
    campos: [
      { id: 'cliente', etiqueta: 'Cliente', tipo: 'relacion', entidad: 'cliente', requerido: true },
      { id: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true },
      { id: 'hora', etiqueta: 'Hora', tipo: 'hora' },
      { id: 'lugar', etiqueta: 'Qué se reserva', tipo: 'texto', requerido: true },
      { id: 'sena', etiqueta: 'Seña', tipo: 'dinero' },
      { id: 'estado', etiqueta: 'Estado', tipo: 'opcion', opciones: ['Pedida', 'Señada', 'Confirmada', 'Cancelada'] },
    ],
    flujo: { campo: 'estado', estados: ['Pedida', 'Señada', 'Confirmada', 'Cancelada'] },
    ejemplos: [
      { cliente: 'Laura Gómez', fecha: hoy(1), hora: '20:00', lugar: 'Cancha 1', sena: 5000, estado: 'Señada' },
      { cliente: 'Martín Ruiz', fecha: hoy(2), hora: '21:00', lugar: 'Cancha 2', sena: 0, estado: 'Pedida' },
      { cliente: 'Sofía Díaz', fecha: hoy(0), hora: '19:00', lugar: 'Quincho', sena: 10000, estado: 'Confirmada' },
    ],
  }),
  reparaciones: () => ({
    id: 'orden', nombre: 'Orden de trabajo', plural: 'Órdenes de trabajo', icono: '🛠️',
    campos: [
      { id: 'cliente', etiqueta: 'Cliente', tipo: 'relacion', entidad: 'cliente', requerido: true },
      { id: 'equipo', etiqueta: 'Equipo o vehículo', tipo: 'texto', requerido: true },
      { id: 'problema', etiqueta: 'Problema', tipo: 'texto_largo' },
      { id: 'presupuesto', etiqueta: 'Presupuesto', tipo: 'dinero' },
      { id: 'ingreso', etiqueta: 'Ingreso', tipo: 'fecha' },
      { id: 'estado', etiqueta: 'Estado', tipo: 'opcion', opciones: ['Recibido', 'Presupuestado', 'En reparación', 'Listo', 'Entregado'] },
    ],
    flujo: { campo: 'estado', estados: ['Recibido', 'Presupuestado', 'En reparación', 'Listo', 'Entregado'] },
    ejemplos: [
      { cliente: 'Laura Gómez', equipo: 'Lavarropas Drean', problema: 'No centrifuga', presupuesto: 45000, ingreso: hoy(-2), estado: 'En reparación' },
      { cliente: 'Martín Ruiz', equipo: 'Notebook Lenovo', problema: 'No enciende', presupuesto: 0, ingreso: hoy(0), estado: 'Recibido' },
      { cliente: 'Sofía Díaz', equipo: 'Heladera Gafa', problema: 'No enfría', presupuesto: 98000, ingreso: hoy(-5), estado: 'Listo' },
    ],
  }),
};

const ROLES: [RegExp, string, string][] = [
  [/vendedor|vendedora|ventas/, 'vendedor', 'Vendedor'],
  [/cajer/, 'cajero', 'Cajero'],
  [/mec[aá]nic|t[eé]cnic/, 'tecnico', 'Técnico'],
  [/secretari|atiende|tel[eé]fono|recepci/, 'recepcion', 'Recepción'],
  [/emplead|ayudante|chico|chica/, 'empleado', 'Empleado'],
  [/socio|socia/, 'socio', 'Socio'],
  [/cadete|repart|delivery/, 'cadete', 'Cadete'],
];

/** Arma la primera versión del sistema a partir de las respuestas (modo sin IA). */
export function armarDesdeRespuestas(r: Record<string, string>): Spec {
  const rubro = detectarRubro(`${r.repite ?? ''} ${r.negocio ?? ''}`);
  const principal = PLANTILLAS[rubro]();
  // Campos que nombró el usuario y la plantilla no tiene.
  const yaEsta = (etq: string) => principal.campos.some((c) => slug(c.etiqueta) === slug(etq) || c.id === slug(etq)) || /^(cliente|nombre|telefono|tel[eé]fono)$/i.test(etq.trim());
  for (const d of (r.datos ?? '').split(/,|\sy\s|\n/).map((x) => x.trim()).filter(Boolean).slice(0, 8)) {
    if (yaEsta(d)) continue;
    const etiqueta = d.charAt(0).toUpperCase() + d.slice(1);
    const tipo: Campo['tipo'] = /precio|monto|total|presupuesto|importe|seña|sena/i.test(d) ? 'dinero' : /fecha|d[ií]a/i.test(d) ? 'fecha' : /tel/i.test(d) ? 'telefono' : /mail/i.test(d) ? 'email' : 'texto';
    principal.campos.splice(principal.campos.length - (principal.flujo ? 1 : 0), 0, { id: slug(d), etiqueta, tipo });
  }
  const roles = [{ id: 'dueno', nombre: 'Dueño', descripcion: 'Ve todo y aprueba' }];
  for (const [re, id, nombre] of ROLES) if (re.test((r.equipo ?? '').toLowerCase())) roles.push({ id, nombre, descripcion: '' });
  // Aprobaciones: «más de 300000» o «todo lo aprueba el dueño».
  const monto = Number((r.aprueba ?? '').replace(/\./g, '').match(/(\d{3,})/)?.[1] ?? 0);
  const campoMonto = principal.campos.find((c) => c.tipo === 'dinero');
  if (principal.flujo && campoMonto && (monto || /grande|monto/i.test(r.aprueba ?? ''))) {
    principal.flujo.estados.splice(1, 0, 'Por aprobar');
    const estado = principal.campos.find((c) => c.id === principal.flujo!.campo)!;
    estado.opciones = [...principal.flujo.estados];
    principal.flujo.aprobaciones = [{ campo: campoMonto.id, mayorA: monto || 300000, rol: 'dueno', estadoPendiente: 'Por aprobar' }];
  }
  const nombre = (r.negocio ?? 'Mi negocio').split(/[,.;]| y | que /)[0].trim().slice(0, 40) || 'Mi negocio';
  const color = COLORES[slug(r.color ?? '').split('_')[0]] ?? COLORES.azul;
  const automatizaciones = [];
  const duele = (r.duele ?? '').toLowerCase();
  if (/avis|client|whats/.test(duele) && principal.flujo) automatizaciones.push({ id: 'avisar_listo', cuando: `${principal.nombre} pasa a «${principal.flujo.estados.at(-2)}»`, accion: 'Avisar al cliente por WhatsApp' });
  if (/turno|record/.test(duele)) automatizaciones.push({ id: 'recordatorio', cuando: 'Un día antes de la fecha', accion: 'Mandar recordatorio por WhatsApp' });
  if (/debe|fiado|cobr/.test(duele)) automatizaciones.push({ id: 'deudores', cuando: 'Todos los lunes', accion: 'Resumen de quién debe y cuánto' });
  if (/planilla/.test(duele)) automatizaciones.push({ id: 'resumen', cuando: 'Cada noche', accion: 'Resumen del día por e-mail' });
  const pantallas: Spec['pantallas'] = [
    { id: 'tablero', titulo: 'Inicio', tipo: 'tablero' },
    { id: principal.id, titulo: principal.plural, tipo: 'listado', entidad: principal.id },
  ];
  const campoFecha = principal.campos.find((c) => c.tipo === 'fecha');
  if (campoFecha && (rubro === 'turnos' || rubro === 'reservas')) pantallas.push({ id: 'agenda', titulo: 'Agenda', tipo: 'calendario', entidad: principal.id, campoFecha: campoFecha.id });
  pantallas.push({ id: 'clientes', titulo: 'Clientes', tipo: 'listado', entidad: 'cliente' });
  return {
    version: 1,
    negocio: { nombre, rubro: RUBRO_TEXTO[rubro], descripcion: r.negocio ?? '' },
    marca: { colorPrimario: color },
    roles,
    entidades: [principal, cliente()],
    pantallas,
    automatizaciones,
    golondrina: { saludo: `¡Hola! Soy Golondrina, el asistente de ${nombre}. Pedime «nuevo ${principal.nombre.toLowerCase()}», «ver ${principal.plural.toLowerCase()}» o «buscar» lo que necesites.` },
  };
}

/** Cambios comunes en lenguaje natural, sin IA. Devuelve null si no lo entiende. */
export function cambioLocal(spec: Spec, pedido: string): { parche: OpParche[]; explicacion: string } | null {
  const t = pedido.trim();
  const n = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const entidadPorNombre = (txt: string) =>
    spec.entidades.find((e) => n.includes(slug(e.nombre).replace(/_/g, ' ')) || n.includes(slug(e.plural).replace(/_/g, ' ')) || txt.includes(e.id));
  // Color
  const color = Object.keys(COLORES).find((c) => new RegExp(`\\b${c}\\b`).test(n));
  if (color && /color|pinta|ponel|cambia|que sea/.test(n)) {
    return { parche: [{ op: 'replace', path: '/marca/colorPrimario', value: COLORES[color] }], explicacion: `Cambio el color principal a ${color}.` };
  }
  // Nombre del negocio
  const nombre = t.match(/(?:llame|nombre (?:a|por)|nombre del negocio (?:a|por)?)\s*[«"']?([^«»"']{2,40})[»"']?\s*$/i)?.[1];
  if (nombre) return { parche: [{ op: 'replace', path: '/negocio/nombre', value: nombre.trim() }], explicacion: `Cambio el nombre a «${nombre.trim()}».` };
  // Agregar campo: «agregá el campo patente al vehículo / a los pedidos»
  const add = t.match(/agreg[aá]\w*\s+(?:un\s+|el\s+)?campo\s+[«"']?(.+?)[»"']?\s+(?:a|al|en|para)\s+(?:la\s+|los\s+|las\s+|el\s+)?(.+)$/i);
  if (add) {
    const en = entidadPorNombre(add[2]) ?? spec.entidades[0];
    const etiqueta = add[1].charAt(0).toUpperCase() + add[1].slice(1);
    const tipo: Campo['tipo'] = /precio|monto|total|importe/i.test(add[1]) ? 'dinero' : /fecha/i.test(add[1]) ? 'fecha' : /tel/i.test(add[1]) ? 'telefono' : /mail/i.test(add[1]) ? 'email' : 'texto';
    return { parche: [{ op: 'add', path: `/entidades/${en.id}/campos/-`, value: { id: slug(add[1]), etiqueta, tipo } }], explicacion: `Agrego el campo «${etiqueta}» a ${en.plural.toLowerCase()}.` };
  }
  // Sacar campo
  const quitar = t.match(/(?:sac[aá]|borr[aá]|quit[aá])\w*\s+(?:el\s+)?campo\s+[«"']?(.+?)[»"']?(?:\s+(?:de|del)\s+(.+))?$/i);
  if (quitar) {
    for (const en of spec.entidades) {
      const c = en.campos.find((x) => slug(x.etiqueta) === slug(quitar[1]) || x.id === slug(quitar[1]));
      if (c) return { parche: [{ op: 'remove', path: `/entidades/${en.id}/campos/${c.id}` }], explicacion: `Saco el campo «${c.etiqueta}» de ${en.plural.toLowerCase()}.` };
    }
  }
  return null;
}

/** Aplica un cambio local y devuelve la nueva spec (o null si no lo entendió). */
export function intentarCambioLocal(spec: Spec, pedido: string) {
  const c = cambioLocal(spec, pedido);
  if (!c) return null;
  return { ...c, spec: aplicarParche(spec, c.parche) };
}
