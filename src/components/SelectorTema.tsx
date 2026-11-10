import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

// Desplegable propio para elegir el tema del formulario. El <select> del navegador decide solo
// si abre para arriba o para abajo (y en el celu abre una ruedita): este abre siempre hacia abajo
// y arranca desde la primera opción. Se maneja con mouse, dedo o teclado (flechas, Enter, Esc).

export interface OpcionTema {
  id: string;
  etiqueta: string;
}

export const SelectorTema: React.FC<{
  id: string;
  valor: string;
  vacio: string; // texto cuando no hay nada elegido
  grupos: [string, OpcionTema[]][];
  onElegir: (id: string) => void;
}> = ({ id, valor, vacio, grupos, onElegir }) => {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const caja = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const base = useId();

  // Lista plana: primero la opción vacía, después cada tema en el orden de los grupos.
  const planas: OpcionTema[] = [{ id: '', etiqueta: vacio }, ...grupos.flatMap(([, l]) => l)];
  const elegida = planas.find((o) => o.id === valor) ?? planas[0];
  const idOpcion = (i: number) => `${base}-op-${i}`;

  const abrir = () => {
    setActivo(0);
    setAbierto(true);
  };
  const cerrar = () => setAbierto(false);
  const elegir = (i: number) => {
    onElegir(planas[i].id);
    cerrar();
  };

  // Al abrir, la lista arranca desde arriba de todo.
  useEffect(() => {
    if (abierto && lista.current) {
      lista.current.scrollTop = 0;
      lista.current.focus({ preventScroll: true });
      // Si la lista queda cortada abajo de la pantalla, la página sube lo justo para mostrarla entera
      // (sin que el campo quede tapado por el menú de arriba).
      const r = lista.current.getBoundingClientRect();
      const sobra = r.bottom - window.innerHeight + 16;
      if (sobra > 0) {
        const alturaHeader = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
        const campo = caja.current?.getBoundingClientRect().top ?? 0;
        window.scrollBy({ top: Math.min(sobra, campo - alturaHeader - 12), behavior: 'smooth' });
      }
    }
  }, [abierto]);

  // La opción marcada con el teclado siempre queda a la vista.
  useEffect(() => {
    if (!abierto) return;
    document.getElementById(idOpcion(activo))?.scrollIntoView({ block: 'nearest' });
  }, [activo, abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tocar afuera cierra.
  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) cerrar();
    };
    document.addEventListener('pointerdown', afuera);
    return () => document.removeEventListener('pointerdown', afuera);
  }, [abierto]);

  const teclas = (e: React.KeyboardEvent) => {
    if (!abierto) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        abrir();
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActivo((i) => Math.min(i + 1, planas.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActivo((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActivo(0); }
    else if (e.key === 'End') { e.preventDefault(); setActivo(planas.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(activo); }
    else if (e.key === 'Escape' || e.key === 'Tab') { cerrar(); }
  };

  let indice = 0;
  const opcion = (o: OpcionTema) => {
    const i = indice++;
    const marcada = o.id === valor;
    return (
      <li
        key={o.id || 'vacio'}
        id={idOpcion(i)}
        role="option"
        aria-selected={marcada}
        onPointerEnter={() => setActivo(i)}
        onClick={() => elegir(i)}
        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer ${
          i === activo ? 'bg-slate-800 text-white' : 'text-slate-200'
        } ${o.id === '' ? 'text-slate-400' : ''}`}
      >
        <span>{o.etiqueta}</span>
        {marcada && <Check className="w-4 h-4 text-cyan-300 shrink-0" />}
      </li>
    );
  };

  return (
    <div ref={caja} className="relative" onKeyDown={teclas}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={`${base}-lista`}
        onClick={() => (abierto ? cerrar() : abrir())}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-left text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
      >
        <span className={elegida.id ? 'text-white' : 'text-slate-300'}>{elegida.etiqueta}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <ul
          ref={lista}
          id={`${base}-lista`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          aria-activedescendant={idOpcion(activo)}
          className="absolute left-0 right-0 top-full mt-2 z-30 max-h-72 overflow-y-auto overscroll-contain rounded-xl bg-[#0B1120] border border-slate-700 shadow-2xl shadow-black/60 p-1.5 focus:outline-none"
        >
          {opcion(planas[0])}
          {grupos.map(([grupo, lista]) => (
            <li key={grupo} role="presentation">
              <span className="block px-3 pt-3 pb-1 text-xs sm:text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-400">{grupo}</span>
              <ul role="group" aria-label={grupo}>{lista.map(opcion)}</ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
