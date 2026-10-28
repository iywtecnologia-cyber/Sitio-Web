import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// Fondo con color: manchas de luz suaves detrás de toda la web.
// El fondo usa el tema Aurora (cian, violeta y verde).

type Tema = { id: string; nombre: string; capas: string };

const TEMAS: Tema[] = [
  {
    id: 'aurora',
    nombre: 'Aurora',
    capas:
      'radial-gradient(60% 50% at 10% 0%, rgba(0,210,243,0.34), transparent 75%),' +
      'radial-gradient(50% 45% at 95% 25%, rgba(167,139,250,0.31), transparent 75%),' +
      'radial-gradient(55% 45% at 30% 100%, rgba(16,185,129,0.24), transparent 75%)',
  },
  {
    id: 'oceano',
    nombre: 'Océano',
    capas:
      'radial-gradient(60% 50% at 0% 10%, rgba(14,165,233,0.41), transparent 75%),' +
      'radial-gradient(55% 50% at 100% 60%, rgba(0,210,243,0.31), transparent 75%),' +
      'radial-gradient(50% 40% at 40% 100%, rgba(59,130,246,0.27), transparent 75%)',
  },
  {
    id: 'atardecer',
    nombre: 'Atardecer',
    capas:
      'radial-gradient(60% 50% at 5% 5%, rgba(167,139,250,0.41), transparent 75%),' +
      'radial-gradient(50% 45% at 95% 35%, rgba(236,72,153,0.27), transparent 75%),' +
      'radial-gradient(55% 45% at 50% 100%, rgba(245,158,11,0.2), transparent 75%)',
  },
  {
    id: 'bosque',
    nombre: 'Bosque',
    capas:
      'radial-gradient(60% 50% at 0% 0%, rgba(16,185,129,0.37), transparent 75%),' +
      'radial-gradient(50% 45% at 100% 40%, rgba(20,184,166,0.31), transparent 75%),' +
      'radial-gradient(55% 45% at 35% 100%, rgba(0,210,243,0.2), transparent 75%)',
  },
  { id: 'noche', nombre: 'Noche', capas: 'none' },
];

// Capa fija detrás de todo el contenido
export const FondoColor: React.FC = () => {
  const tema = TEMAS[0];
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none transition-[background-image] duration-700"
      style={{ backgroundColor: '#070A12', backgroundImage: tema.capas }}
    />
  );
};

// Interruptor claro / oscuro (sol y luna). El modo claro invierte los colores de la web
// y deja las fotos, videos y el 3D como están. Se recuerda en el navegador de cada visitante.
const CLAVE_MODO = 'tecnoros-modo';
const leerModo = (): 'oscuro' | 'claro' => {
  try {
    return localStorage.getItem(CLAVE_MODO) === 'claro' ? 'claro' : 'oscuro';
  } catch {
    return 'oscuro';
  }
};
const aplicarModo = (m: 'oscuro' | 'claro') => {
  document.documentElement.dataset.tema = m;
};
if (typeof document !== 'undefined') aplicarModo(leerModo());

export const BotonFondo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [modo, setModo] = useState<'oscuro' | 'claro'>(leerModo);
  const claro = modo === 'claro';
  const cambiar = () => {
    const nuevo = claro ? 'oscuro' : 'claro';
    setModo(nuevo);
    aplicarModo(nuevo);
    try {
      localStorage.setItem(CLAVE_MODO, nuevo);
    } catch {
      /* sin almacenamiento: igual cambia mientras la página está abierta */
    }
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={claro}
      onClick={cambiar}
      title={claro ? 'Pasar a modo oscuro' : 'Pasar a modo claro'}
      aria-label="Modo claro"
      className={`relative inline-flex items-center w-14 h-7 rounded-full border border-slate-600 bg-slate-800 transition-colors cursor-pointer shrink-0 ${className}`}
    >
      <Sun className="absolute left-1.5 w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
      <Moon className="absolute right-1.5 w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${claro ? 'translate-x-[1.85rem]' : 'translate-x-0.5'}`}
        aria-hidden="true"
      />
    </button>
  );
};
