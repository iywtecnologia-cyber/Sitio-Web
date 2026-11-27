// Motor: convierte una spec en una aplicación que funciona (tablero, listados, formularios,
// agenda, estados y aprobaciones). Los datos viven en el navegador (vista previa) y arrancan
// con los ejemplos del rubro. El mismo componente recibe órdenes de Golondrina (ver vista.tsx).
import React, { useEffect, useMemo, useState } from 'react';
import { nuevoDe, slug, type Campo, type Entidad, type Spec } from './spec';
import './motor.css';

type Registro = Record<string, string | number | boolean> & { _id: string };
type Datos = Record<string, Registro[]>;

const nuevoId = () => Math.random().toString(36).slice(2, 10);
const claveDatos = (spec: Spec) => `fabrica-datos-${slug(spec.negocio.nombre)}`;
const pesos = (n: number) => `$ ${Math.round(n).toLocaleString('es-AR')}`;

/** Primer campo de texto: lo que se muestra como «nombre» del registro. */
export const campoTitulo = (en: Entidad) => en.campos.find((c) => c.tipo === 'texto' || c.tipo === 'relacion') ?? en.campos[0];

function cargar(spec: Spec): Datos {
  let guardado: Datos = {};
  try {
    guardado = JSON.parse(localStorage.getItem(claveDatos(spec)) ?? '{}');
  } catch {
    /* vista previa sin almacenamiento: arranca de cero */
  }
  const datos: Datos = {};
  for (const en of spec.entidades) {
    datos[en.id] = guardado[en.id] ?? (en.ejemplos ?? []).map((e) => ({ ...e, _id: nuevoId() }));
  }
  return datos;
}

export interface Orden {
  tipo: 'ir' | 'nuevo' | 'buscar';
  pantalla?: string;
  entidad?: string;
  texto?: string;
}

export const EV_ORDEN = 'fabrica:orden';
export const ordenar = (o: Orden) => window.dispatchEvent(new CustomEvent(EV_ORDEN, { detail: o }));

export const Motor: React.FC<{ spec: Spec }> = ({ spec }) => {
  const [datos, setDatos] = useState<Datos>(() => cargar(spec));
  const [pantalla, setPantalla] = useState(spec.pantallas[0]?.id);
  const [rol, setRol] = useState(spec.roles[0]?.id ?? 'dueno');
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState<{ entidad: Entidad; reg: Registro | null } | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Si la spec cambia (nuevo campo, nueva entidad), se completan los datos que falten.
  useEffect(() => {
    setDatos((d) => {
      const n: Datos = { ...d };
      for (const en of spec.entidades) if (!n[en.id]) n[en.id] = (en.ejemplos ?? []).map((e) => ({ ...e, _id: nuevoId() }));
      return n;
    });
    if (!spec.pantallas.some((p) => p.id === pantalla)) setPantalla(spec.pantallas[0]?.id);
  }, [spec]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      localStorage.setItem(claveDatos(spec), JSON.stringify(datos));
    } catch {
      /* sin almacenamiento */
    }
  }, [datos, spec]);

  // Órdenes de Golondrina («nuevo pedido», «ver clientes», «buscar Laura»).
  useEffect(() => {
    const oir = (e: Event) => {
      const o = (e as CustomEvent<Orden>).detail;
      if (o.tipo === 'ir' && o.pantalla) setPantalla(o.pantalla);
      if (o.tipo === 'nuevo' && o.entidad) {
        const en = spec.entidades.find((x) => x.id === o.entidad);
        const p = spec.pantallas.find((x) => x.entidad === o.entidad && x.tipo === 'listado');
        if (p) setPantalla(p.id);
        if (en) setEditando({ entidad: en, reg: null });
      }
      if (o.tipo === 'buscar' && o.entidad) {
        const p = spec.pantallas.find((x) => x.entidad === o.entidad && x.tipo === 'listado');
        if (p) setPantalla(p.id);
        setBusqueda(o.texto ?? '');
      }
    };
    window.addEventListener(EV_ORDEN, oir);
    return () => window.removeEventListener(EV_ORDEN, oir);
  }, [spec]);

  const avisar = (t: string) => {
    setAviso(t);
    window.setTimeout(() => setAviso(null), 2600);
  };

  const p = spec.pantallas.find((x) => x.id === pantalla) ?? spec.pantallas[0];
  const entidad = spec.entidades.find((x) => x.id === p?.entidad);

  // Estado inicial de un registro nuevo y reglas de aprobación.
  const aplicarFlujo = (en: Entidad, reg: Registro): Registro => {
    if (!en.flujo) return reg;
    const r = { ...reg };
    if (!r[en.flujo.campo]) r[en.flujo.campo] = en.flujo.estados[0];
    for (const a of en.flujo.aprobaciones ?? []) {
      if (Number(r[a.campo] ?? 0) > a.mayorA && r[en.flujo.campo] === en.flujo.estados[0]) r[en.flujo.campo] = a.estadoPendiente;
    }
    return r;
  };

  const guardar = (en: Entidad, reg: Registro) => {
    const r = aplicarFlujo(en, reg);
    setDatos((d) => {
      const lista = d[en.id] ?? [];
      const existe = lista.some((x) => x._id === r._id);
      return { ...d, [en.id]: existe ? lista.map((x) => (x._id === r._id ? r : x)) : [r, ...lista] };
    });
    setEditando(null);
    const pend = en.flujo?.aprobaciones?.find((a) => r[en.flujo!.campo] === a.estadoPendiente);
    avisar(pend ? `Guardado. Queda «${pend.estadoPendiente}» hasta que lo apruebe ${spec.roles.find((x) => x.id === pend.rol)?.nombre ?? pend.rol}.` : `${en.nombre} guardado.`);
  };

  const avanzar = (en: Entidad, reg: Registro) => {
    if (!en.flujo) return;
    const estados = en.flujo.estados;
    const actual = String(reg[en.flujo.campo] ?? estados[0]);
    const aprob = en.flujo.aprobaciones?.find((a) => a.estadoPendiente === actual);
    if (aprob && aprob.rol !== rol) {
      avisar(`Esto lo tiene que aprobar ${spec.roles.find((x) => x.id === aprob.rol)?.nombre ?? aprob.rol}.`);
      return;
    }
    const sig = estados.at(Math.min(estados.indexOf(actual) + 1, estados.length - 1));
    if (!sig || sig === actual) return;
    setDatos((d) => ({ ...d, [en.id]: d[en.id].map((x) => (x._id === reg._id ? { ...x, [en.flujo!.campo]: sig } : x)) }));
    avisar(aprob ? `Aprobado. Pasa a «${sig}».` : `Pasó a «${sig}».`);
  };

  const estilo = { '--c': spec.marca.colorPrimario } as React.CSSProperties;
  return (
    <div className="m-app" style={estilo}>
      <aside className="m-lado">
        <div className="m-marca">
          {spec.marca.logo ? <img src={spec.marca.logo} alt="" /> : <span className="m-inicial">{spec.negocio.nombre.charAt(0).toUpperCase()}</span>}
          <span>
            <b>{spec.negocio.nombre}</b>
            <small>{spec.negocio.rubro}</small>
          </span>
        </div>
        {spec.pantallas.map((x) => (
          <button key={x.id} type="button" className={`m-nav ${x.id === p?.id ? 'activo' : ''}`} onClick={() => { setPantalla(x.id); setBusqueda(''); }}>
            <span aria-hidden="true">{x.tipo === 'tablero' ? '🏠' : x.tipo === 'calendario' ? '📅' : spec.entidades.find((e) => e.id === x.entidad)?.icono ?? '📄'}</span>
            {x.titulo}
          </button>
        ))}
        {spec.roles.length > 1 && (
          <label className="m-rol">
            Estás usando el sistema como
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              {spec.roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </label>
        )}
      </aside>

      <main className="m-main">
        {p?.tipo === 'tablero' && <Tablero spec={spec} datos={datos} rol={rol} onAbrir={(en, reg) => setEditando({ entidad: en, reg })} onAvanzar={avanzar} />}
        {p?.tipo === 'listado' && entidad && (
          <Listado spec={spec} entidad={entidad} titulo={p.titulo} registros={datos[entidad.id] ?? []} busqueda={busqueda} setBusqueda={setBusqueda}
            onNuevo={() => setEditando({ entidad, reg: null })} onAbrir={(reg) => setEditando({ entidad, reg })} onAvanzar={(reg) => avanzar(entidad, reg)} />
        )}
        {p?.tipo === 'calendario' && entidad && (
          <Agenda entidad={entidad} titulo={p.titulo} campoFecha={p.campoFecha ?? ''} registros={datos[entidad.id] ?? []} onAbrir={(reg) => setEditando({ entidad, reg })} onNuevo={() => setEditando({ entidad, reg: null })} />
        )}
      </main>

      {editando && <Formulario spec={spec} datos={datos} entidad={editando.entidad} reg={editando.reg} onCerrar={() => setEditando(null)} onGuardar={(r) => guardar(editando.entidad, r)} />}
      {aviso && <div className="m-aviso" role="status">{aviso}</div>}
    </div>
  );
};

const valorTexto = (c: Campo, v: unknown) => {
  if (v === undefined || v === '' || v === null) return '—';
  if (c.tipo === 'dinero') return pesos(Number(v));
  if (c.tipo === 'si_no') return v ? 'Sí' : 'No';
  if (c.tipo === 'fecha') return new Date(`${v}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  return String(v);
};

const Estado: React.FC<{ en: Entidad; valor: unknown }> = ({ en, valor }) => {
  const pend = en.flujo?.aprobaciones?.some((a) => a.estadoPendiente === valor);
  return <span className={`m-estado ${pend ? 'pend' : ''}`}>{String(valor ?? '—')}</span>;
};

const Tablero: React.FC<{ spec: Spec; datos: Datos; rol: string; onAbrir: (en: Entidad, r: Registro) => void; onAvanzar: (en: Entidad, r: Registro) => void }> = ({ spec, datos, rol, onAbrir, onAvanzar }) => {
  const pendientes = spec.entidades.flatMap((en) =>
    (en.flujo?.aprobaciones ?? []).filter((a) => a.rol === rol).flatMap((a) => (datos[en.id] ?? []).filter((r) => r[en.flujo!.campo] === a.estadoPendiente).map((r) => ({ en, r }))),
  );
  return (
    <>
      <div className="m-titulo"><h1>Hola 👋</h1></div>
      <div className="m-tarjetas">
        {spec.entidades.map((en) => {
          const lista = datos[en.id] ?? [];
          const dinero = en.campos.find((c) => c.tipo === 'dinero');
          return (
            <div className="m-tarjeta" key={en.id}>
              <small>{en.icono} {en.plural}</small>
              <b>{lista.length}</b>
              {dinero && <small>Total {dinero.etiqueta.toLowerCase()}: {pesos(lista.reduce((t, r) => t + Number(r[dinero.id] ?? 0), 0))}</small>}
            </div>
          );
        })}
      </div>
      {pendientes.length > 0 && (
        <div className="m-caja">
          <h2>Para aprobar ({pendientes.length})</h2>
          {pendientes.map(({ en, r }) => (
            <div className="m-item" key={r._id}>
              <span onClick={() => onAbrir(en, r)}>{en.icono} {String(r[campoTitulo(en).id] ?? en.nombre)}</span>{' '}
              <button type="button" className="m-btn chico" onClick={() => onAvanzar(en, r)}>Aprobar</button>
            </div>
          ))}
        </div>
      )}
      {spec.entidades.filter((en) => en.flujo).map((en) => (
        <div className="m-caja" key={en.id}>
          <h2>{en.plural} por estado</h2>
          <div className="m-tarjetas">
            {en.flujo!.estados.map((e) => (
              <div className="m-tarjeta" key={e}><small>{e}</small><b>{(datos[en.id] ?? []).filter((r) => r[en.flujo!.campo] === e).length}</b></div>
            ))}
          </div>
        </div>
      ))}
      {spec.automatizaciones.length > 0 && (
        <div className="m-caja">
          <h2>Automatizaciones activas</h2>
          <ul className="m-lista">{spec.automatizaciones.map((a) => <li key={a.id}><b>{a.cuando}:</b> {a.accion}</li>)}</ul>
        </div>
      )}
    </>
  );
};

const Listado: React.FC<{
  spec: Spec; entidad: Entidad; titulo: string; registros: Registro[]; busqueda: string; setBusqueda: (t: string) => void;
  onNuevo: () => void; onAbrir: (r: Registro) => void; onAvanzar: (r: Registro) => void;
}> = ({ entidad, titulo, registros, busqueda, setBusqueda, onNuevo, onAbrir, onAvanzar }) => {
  const columnas = entidad.campos.filter((c) => c.enListado !== false && c.tipo !== 'texto_largo').slice(0, 6);
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return q ? registros.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q))) : registros;
  }, [registros, busqueda]);
  return (
    <>
      <div className="m-titulo">
        <h1>{titulo}</h1>
        <button type="button" className="m-btn" onClick={onNuevo}>+ {nuevoDe(entidad.nombre)}</button>
      </div>
      <input className="m-buscar" placeholder={`Buscar en ${titulo.toLowerCase()}…`} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <table className="m-tabla">
        <thead><tr>{columnas.map((c) => <th key={c.id}>{c.etiqueta}</th>)}{entidad.flujo && <th />}</tr></thead>
        <tbody>
          {filtrados.map((r) => (
            <tr key={r._id} onClick={() => onAbrir(r)}>
              {columnas.map((c) => <td key={c.id}>{entidad.flujo?.campo === c.id ? <Estado en={entidad} valor={r[c.id]} /> : valorTexto(c, r[c.id])}</td>)}
              {entidad.flujo && (
                <td onClick={(e) => e.stopPropagation()}>
                  {r[entidad.flujo.campo] !== entidad.flujo.estados.at(-1) && <button type="button" className="m-btn sec chico" onClick={() => onAvanzar(r)}>Avanzar →</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {filtrados.length === 0 && <p className="m-vacio">No hay {titulo.toLowerCase()} {busqueda ? `con «${busqueda}»` : 'todavía'}.</p>}
    </>
  );
};

const Agenda: React.FC<{ entidad: Entidad; titulo: string; campoFecha: string; registros: Registro[]; onAbrir: (r: Registro) => void; onNuevo: () => void }> = ({ entidad, titulo, campoFecha, registros, onAbrir, onNuevo }) => {
  const dias = Array.from({ length: 7 }, (_, i) => new Date(Date.now() + i * 864e5).toISOString().slice(0, 10));
  const hora = entidad.campos.find((c) => c.tipo === 'hora');
  return (
    <>
      <div className="m-titulo"><h1>{titulo}</h1><button type="button" className="m-btn" onClick={onNuevo}>+ {nuevoDe(entidad.nombre)}</button></div>
      {dias.map((d) => {
        const del = registros.filter((r) => r[campoFecha] === d).sort((a, b) => String(a[hora?.id ?? ''] ?? '').localeCompare(String(b[hora?.id ?? ''] ?? '')));
        return (
          <div className="m-dia" key={d}>
            <h3>{new Date(`${d}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
            {del.length === 0 ? <p className="m-vacio" style={{ padding: 6, textAlign: 'left' }}>Libre</p> : del.map((r) => (
              <div className="m-item" key={r._id} onClick={() => onAbrir(r)}>
                {hora ? <b>{String(r[hora.id] ?? '')} · </b> : null}{String(r[campoTitulo(entidad).id] ?? '')}
                {entidad.flujo && <> · <Estado en={entidad} valor={r[entidad.flujo.campo]} /></>}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

const Formulario: React.FC<{ spec: Spec; datos: Datos; entidad: Entidad; reg: Registro | null; onCerrar: () => void; onGuardar: (r: Registro) => void }> = ({ spec, datos, entidad, reg, onCerrar, onGuardar }) => {
  const [v, setV] = useState<Registro>(() => reg ?? ({ _id: nuevoId() } as Registro));
  const [error, setError] = useState('');
  const poner = (id: string, x: string | number | boolean) => setV((o) => ({ ...o, [id]: x }));
  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const falta = entidad.campos.find((c) => c.requerido && (v[c.id] === undefined || v[c.id] === ''));
    if (falta) {
      setError(`Completá «${falta.etiqueta}».`);
      return;
    }
    onGuardar(v);
  };
  return (
    <div className="m-fondo" onClick={onCerrar}>
      <form className="m-modal" onClick={(e) => e.stopPropagation()} onSubmit={enviar}>
        <h2>{reg ? `Editar ${entidad.nombre.toLowerCase()}` : nuevoDe(entidad.nombre)}</h2>
        {entidad.campos.map((c) => (
          <label className="m-campo" key={c.id}>
            {c.etiqueta}{c.requerido ? ' *' : ''}
            {c.tipo === 'opcion' ? (
              <select value={String(v[c.id] ?? '')} onChange={(e) => poner(c.id, e.target.value)}>
                <option value="">Elegí…</option>
                {c.opciones?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : c.tipo === 'relacion' ? (
              <select value={String(v[c.id] ?? '')} onChange={(e) => poner(c.id, e.target.value)}>
                <option value="">Elegí…</option>
                {(() => {
                  const otra = spec.entidades.find((x) => x.id === c.entidad);
                  return otra ? (datos[otra.id] ?? []).map((r) => { const t = String(r[campoTitulo(otra).id] ?? ''); return <option key={r._id}>{t}</option>; }) : null;
                })()}
              </select>
            ) : c.tipo === 'texto_largo' ? (
              <textarea value={String(v[c.id] ?? '')} onChange={(e) => poner(c.id, e.target.value)} />
            ) : c.tipo === 'si_no' ? (
              <input type="checkbox" checked={Boolean(v[c.id])} onChange={(e) => poner(c.id, e.target.checked)} style={{ width: 'auto' }} />
            ) : (
              <input
                type={c.tipo === 'fecha' ? 'date' : c.tipo === 'hora' ? 'time' : c.tipo === 'email' ? 'email' : c.tipo === 'telefono' ? 'tel' : c.tipo === 'numero' || c.tipo === 'dinero' ? 'number' : 'text'}
                value={String(v[c.id] ?? '')}
                onChange={(e) => poner(c.id, c.tipo === 'numero' || c.tipo === 'dinero' ? Number(e.target.value) : e.target.value)}
              />
            )}
          </label>
        ))}
        {error && <p style={{ color: '#b91c1c', margin: '0 0 8px' }}>{error}</p>}
        <div className="m-acciones">
          <button type="button" className="m-btn sec" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="m-btn">Guardar</button>
        </div>
      </form>
    </div>
  );
};
