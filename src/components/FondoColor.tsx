import React, { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';

// Fondo con color: manchas de luz suaves detrás de toda la web.
// La "lucecita" cambia el color del fondo; la elección se recuerda en ese navegador.

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

const CLAVE = 'tecnoros-fondo';
const EVENTO = 'cambio-fondo';

const leer = (): string => {
  try {
    return localStorage.getItem(CLAVE) || 'aurora';
  } catch {
    return 'aurora';
  }
};

const useTema = () => {
  const [id, setId] = useState<string>(leer);
  useEffect(() => {
    const on = () => setId(leer());
    window.addEventListener(EVENTO, on);
    return () => window.removeEventListener(EVENTO, on);
  }, []);
  return TEMAS.find((t) => t.id === id) ?? TEMAS[0];
};

// Capa fija detrás de todo el contenido
export const FondoColor: React.FC = () => {
  const tema = useTema();
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none transition-[background-image] duration-700"
      style={{ backgroundColor: '#070A12', backgroundImage: tema.capas }}
    />
  );
};

// Botón "lucecita": cada toque pasa al siguiente color
export const BotonFondo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const tema = useTema();
  const siguiente = () => {
    const i = TEMAS.findIndex((t) => t.id === tema.id);
    const nuevo = TEMAS[(i + 1) % TEMAS.length];
    try {
      localStorage.setItem(CLAVE, nuevo.id);
    } catch {
      /* sin almacenamiento: igual cambia mientras la página está abierta */
    }
    window.dispatchEvent(new Event(EVENTO));
  };
  const apagado = tema.id === 'noche';
  return (
    <button
      type="button"
      onClick={siguiente}
      title={`Color de fondo: ${tema.nombre} (tocá para cambiar)`}
      aria-label={`Cambiar el color del fondo. Ahora: ${tema.nombre}`}
      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
        apagado ? 'border-slate-700 text-slate-500 hover:text-slate-300' : 'border-amber-400/40 text-amber-300 bg-amber-400/10 hover:bg-amber-400/20'
      } ${className}`}
    >
      <Lightbulb className={`w-4 h-4 ${apagado ? '' : 'drop-shadow-[0_0_6px_rgba(251,191,36,0.42)]'}`} />
    </button>
  );
};
