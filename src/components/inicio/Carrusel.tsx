import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carrusel horizontal: flechas arriba a la derecha (se apagan en los extremos), deslizable con el dedo
// y con las flechas del teclado. Cada hijo es una tarjeta; el ancho de cada una lo define `anchoItem`.
export const Carrusel: React.FC<{
  etiqueta: string;
  anchoItem: string; // clases de ancho por tamaño de pantalla, ej. 'w-[86%] sm:w-[calc((100%-1rem)/2)]'
  children: React.ReactNode[];
  claseFlecha?: string;
}> = ({ etiqueta, anchoItem, children, claseFlecha = '' }) => {
  const pista = useRef<HTMLUListElement>(null);
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(true);

  const medir = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuedeIzq(el.scrollLeft > 4);
    setPuedeDer(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir]);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const tarjeta = el.querySelector(':scope > li');
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 16 : el.clientWidth;
    el.scrollBy({ left: dir * paso, behavior: 'smooth' });
  };

  const flecha = `w-10 h-10 rounded-full bg-slate-900/95 border border-slate-700 text-white flex items-center justify-center transition-opacity hover:border-cyan-400/70 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${claseFlecha}`;

  // Las flechas van arriba, a la derecha, fuera de las tarjetas: así no tapan el contenido.
  return (
    <div role="region" aria-roledescription="carrusel" aria-label={etiqueta}>
      <div className="flex justify-end gap-2 mb-3">
        <button type="button" onClick={() => mover(-1)} disabled={!puedeIzq} aria-label="Ver anteriores" className={flecha}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => mover(1)} disabled={!puedeDer} aria-label="Ver más" className={flecha}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <ul
        ref={pista}
        onScroll={medir}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return; // dentro de una tarjeta, las flechas son de la tarjeta
          if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
        }}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-2xl"
      >
        {React.Children.map(children, (hijo) => (
          <li className={`snap-start shrink-0 ${anchoItem}`}>{hijo}</li>
        ))}
      </ul>
    </div>
  );
};
