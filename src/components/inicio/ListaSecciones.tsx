// Lista de secciones: para recorrer la web sin chatear. Cada sección muestra el dibujito del
// asistente que te ayuda ahí, pero hablarle es opcional: tocando la sección vas directo.
// En compu queda fija a la izquierda; en el celu se abre desde el botón «Secciones» de arriba.
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { irA, navegar, useRuta, type Ruta } from '../../rutas';
import { imagenDe } from '../../asistentes/funciones';

interface Seccion {
  texto: string;
  ruta: Ruta;
  hash?: string;
  /** Asistente que ayuda en esta sección (su dibujito). */
  asistente: string;
}

export const SECCIONES: Seccion[] = [
  { texto: 'Inicio', ruta: '/', hash: 'asistentes', asistente: 'servicios' },
  { texto: 'Quiénes somos', ruta: '/nosotros', asistente: 'equipo' },
  { texto: 'Qué hacemos', ruta: '/servicios', asistente: 'servicios' },
  { texto: 'Productos', ruta: '/productos', asistente: 'productos' },
  { texto: 'Diseñá tu robot', ruta: '/robotica', asistente: 'robot' },
  { texto: 'Proyectos', ruta: '/proyectos', asistente: 'proyectos' },
  { texto: 'Cómo trabajamos', ruta: '/servicios', hash: 'como-trabajamos', asistente: 'equipo' },
  { texto: 'Presupuesto', ruta: '/presupuesto', asistente: 'presupuesto' },
  { texto: 'Encuentros', ruta: '/encuentros', asistente: 'equipo' },
  { texto: 'Blog', ruta: '/blog', asistente: 'proyectos' },
  { texto: 'Contacto', ruta: '/contacto', asistente: 'contacto' },
];

export const EVENTO_SECCIONES = 'abrir-secciones';

const ir = (s: Seccion) => {
  if (s.hash) irA(s.hash, false, 'start');
  else navegar(s.ruta);
};

const Items: React.FC<{ alElegir?: () => void }> = ({ alElegir }) => {
  const ruta = useRuta();
  return (
    <ul className="space-y-1">
      {SECCIONES.map((s) => {
        const activa = ruta === s.ruta && (s.ruta !== '/servicios' || !s.hash);
        return (
          <li key={s.texto}>
            <button
              type="button"
              onClick={() => {
                ir(s);
                alElegir?.();
              }}
              aria-current={activa ? 'page' : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                activa ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/40' : 'text-slate-300 border border-transparent hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <img src={imagenDe(s.asistente)} alt="" aria-hidden="true" className="w-7 h-7 object-contain shrink-0" />
              {s.texto}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

/** Fija a la izquierda en compu. */
export const ListaSecciones: React.FC = () => (
  <nav aria-label="Secciones" className="hidden lg:block fixed z-40 left-0 top-[72px] bottom-0 w-60 border-r border-slate-800/70 bg-[#070A12]/85 backdrop-blur-md overflow-y-auto px-3 py-4">
    <p className="px-2.5 mb-2 text-[11px] font-mono uppercase tracking-[0.16em] text-slate-500">Secciones</p>
    <Items />
    <p className="mt-4 px-2.5 text-xs text-slate-500 leading-snug">Cada dibujito es un asistente: si querés, tocalo en el inicio y te ayuda.</p>
  </nav>
);

/** En el celu: se abre desde el botón «Secciones» de la cabecera. */
export const SeccionesCelu: React.FC = () => {
  const [abierta, setAbierta] = useState(false);
  useEffect(() => {
    const abrir = () => setAbierta(true);
    window.addEventListener(EVENTO_SECCIONES, abrir);
    return () => window.removeEventListener(EVENTO_SECCIONES, abrir);
  }, []);
  if (!abierta) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-[80]" role="dialog" aria-label="Secciones">
      <button type="button" aria-label="Cerrar secciones" onClick={() => setAbierta(false)} className="absolute inset-0 bg-black/60" />
      <nav className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-[#0B1120] border-r border-slate-700 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Secciones</p>
          <button type="button" onClick={() => setAbierta(false)} aria-label="Cerrar" className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <Items alElegir={() => setAbierta(false)} />
      </nav>
    </div>
  );
};
