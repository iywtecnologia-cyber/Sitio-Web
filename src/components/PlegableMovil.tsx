import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// En el celular muestra un botón con título y una línea de resumen, y el contenido
// recién aparece al tocarlo. En compu (sm en adelante) el contenido se ve siempre.
// Así el celular no se llena de texto y cada bloque se abre solo si interesa.

// Si algo de la web hace scroll hacia un elemento que está dentro de un bloque plegado
// (menú, botones "Probar en simulador", etc.), primero se abre el bloque y después se scrollea.
if (typeof window !== 'undefined' && !(window as unknown as { __plegableParche?: boolean }).__plegableParche) {
  (window as unknown as { __plegableParche?: boolean }).__plegableParche = true;
  const original = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (this: Element, arg?: boolean | ScrollIntoViewOptions) {
    const bloque = this.closest('[data-plegable="cerrado"]');
    if (bloque) {
      bloque.dispatchEvent(new CustomEvent('abrir-plegable'));
      // espera a que React pinte el bloque abierto antes de scrollear
      window.setTimeout(() => requestAnimationFrame(() => original.call(this, arg)), 120);
      return;
    }
    return original.call(this, arg);
  };
}

interface Props {
  titulo: string;
  resumen?: string;
  children: React.ReactNode;
  className?: string;
}

export const PlegableMovil: React.FC<Props> = ({ titulo, resumen, children, className = '' }) => {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const abrir = () => setAbierto(true);
    el.addEventListener('abrir-plegable', abrir);
    return () => el.removeEventListener('abrir-plegable', abrir);
  }, []);

  return (
    <div ref={ref} data-plegable={abierto ? 'abierto' : 'cerrado'} className={className}>
      <button
        type="button"
        onClick={() => {
          const abrir = !abierto;
          setAbierto(abrir);
          // Al abrir, llevar la vista al comienzo del bloque (y no quedar abajo)
          if (abrir) {
            window.setTimeout(() => {
              const el = ref.current;
              if (!el) return;
              const y = el.getBoundingClientRect().top + window.scrollY - 76;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }, 80);
          }
        }}
        aria-expanded={abierto}
        className="sm:hidden w-full mb-3 flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left cursor-pointer active:scale-[0.99] transition-transform"
      >
        <span className="min-w-0">
          <span className="block text-base font-bold text-white">{titulo}</span>
          {resumen && <span className="block mt-0.5 text-xs text-slate-400">{resumen}</span>}
        </span>
        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
          {abierto ? 'Ocultar' : 'Ver'}
          <ChevronDown className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div className={abierto ? '' : 'hidden sm:block'}>{children}</div>
    </div>
  );
};
