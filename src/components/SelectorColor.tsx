import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Selector de color propio, igual en Chrome, Firefox, Safari y el celu.
// (El <input type="color"> nativo en Firefox abre el cuadro del sistema operativo, distinto al de Chrome.)
// Tiene el mismo funcionamiento que el de Chrome: un cuadro de tono/brillo, una barra de color y el código.

type HSV = { h: number; s: number; v: number };

const limitar = (x: number, min = 0, max = 1) => Math.min(max, Math.max(min, x));

const hexAHsv = (hex: string): HSV => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max ? d / max : 0, v: max };
};

const hsvAHex = ({ h, s, v }: HSV): string => {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return '#' + [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
};

const COLORES_RAPIDOS = ['#0B1220', '#18181b', '#FFFFFF', '#00D2F3', '#22C55E', '#EAB308', '#F97316', '#EF4444', '#8B5CF6', '#EC4899'];

export const SelectorColor: React.FC<{
  value: string;
  onChange: (hex: string) => void;
  etiqueta: string;
  className?: string;
}> = ({ value, onChange, etiqueta, className = '' }) => {
  const [abierto, setAbierto] = useState(false);
  const [hsv, setHsv] = useState<HSV>(() => hexAHsv(value));
  const [texto, setTexto] = useState(value);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [lugar, setLugar] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  // Si el color cambia desde afuera (por ejemplo, una paleta), el selector lo sigue.
  useEffect(() => {
    if (value.toLowerCase() !== hsvAHex(hsv).toLowerCase()) setHsv(hexAHsv(value));
    setTexto(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const elegir = (nuevo: HSV) => {
    setHsv(nuevo);
    const hex = hsvAHex(nuevo);
    setTexto(hex);
    onChange(hex);
  };

  // Se abre debajo del botón, sin salirse de la pantalla.
  useLayoutEffect(() => {
    if (!abierto || !boton.current) return;
    const ubicar = () => {
      const r = boton.current!.getBoundingClientRect();
      const ancho = 240;
      const alto = panel.current?.offsetHeight ?? 300;
      let left = Math.min(r.left, window.innerWidth - ancho - 8);
      left = Math.max(8, left);
      let top = r.bottom + 6;
      if (top + alto > window.innerHeight - 8) top = Math.max(8, r.top - alto - 6);
      setLugar({ left, top });
    };
    ubicar();
    window.addEventListener('resize', ubicar);
    window.addEventListener('scroll', ubicar, true);
    return () => {
      window.removeEventListener('resize', ubicar);
      window.removeEventListener('scroll', ubicar, true);
    };
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !boton.current?.contains(t)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  // Arrastre dentro del cuadro y de la barra.
  const arrastrar = (e: React.PointerEvent<HTMLDivElement>, mover: (x: number, y: number) => void) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const r = el.getBoundingClientRect();
    const aplicar = (ev: { clientX: number; clientY: number }) =>
      mover(limitar((ev.clientX - r.left) / r.width), limitar((ev.clientY - r.top) / r.height));
    aplicar(e);
    const mov = (ev: PointerEvent) => aplicar(ev);
    const fin = () => {
      el.removeEventListener('pointermove', mov);
      el.removeEventListener('pointerup', fin);
      el.removeEventListener('pointercancel', fin);
    };
    el.addEventListener('pointermove', mov);
    el.addEventListener('pointerup', fin);
    el.addEventListener('pointercancel', fin);
  };

  const colorPuro = hsvAHex({ h: hsv.h, s: 1, v: 1 });
  const hex = hsvAHex(hsv);

  return (
    <>
      <button
        ref={boton}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={etiqueta}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        title={etiqueta}
        className={`w-7 h-7 rounded-md border-2 border-slate-500 hover:border-cyan-300 cursor-pointer shrink-0 ${className}`}
        style={{ background: value }}
      />
      {abierto &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label={etiqueta}
            className="fixed z-[200] w-60 p-3 rounded-xl bg-white text-slate-900 shadow-2xl shadow-black/50 border border-slate-200 select-none"
            style={{ left: lugar.left, top: lugar.top }}
          >
            {/* Tono y brillo */}
            <div
              onPointerDown={(e) => arrastrar(e, (x, y) => elegir({ ...hsv, s: x, v: 1 - y }))}
              className="relative h-36 rounded-md cursor-crosshair touch-none"
              style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${colorPuro})` }}
            >
              <span
                className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)] pointer-events-none"
                style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }}
              />
            </div>
            {/* Barra de color */}
            <div className="mt-3 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border border-slate-300 shrink-0" style={{ background: hex }} />
              <div
                onPointerDown={(e) => arrastrar(e, (x) => elegir({ ...hsv, h: x * 359.9 }))}
                className="relative flex-1 h-3 rounded-full cursor-pointer touch-none"
                style={{ background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
              >
                <span
                  className="absolute top-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)] pointer-events-none"
                  style={{ left: `${(hsv.h / 360) * 100}%`, background: colorPuro }}
                />
              </div>
            </div>
            {/* Código */}
            <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
              HEX
              <input
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  const t = e.target.value.trim();
                  if (/^#?[0-9a-f]{6}$/i.test(t)) {
                    const h = t.startsWith('#') ? t : `#${t}`;
                    setHsv(hexAHsv(h));
                    onChange(h.toLowerCase());
                  }
                }}
                spellCheck={false}
                className="flex-1 min-w-0 px-2 py-1 rounded-md border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </label>
            {/* Colores rápidos */}
            <div className="mt-3 grid grid-cols-10 gap-1">
              {COLORES_RAPIDOS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => elegir(hexAHsv(c))}
                  aria-label={`Color ${c}`}
                  className="aspect-square rounded border border-slate-300 cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
