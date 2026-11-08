import React from 'react';
import { Heart } from 'lucide-react';
import { TecnorosLogo } from './TecnorosLogo';
import { BotonesRedes } from './Redes';

// Links reales (no botones): se pueden abrir en otra pestaña y los buscadores los siguen.
// El clic lo intercepta rutas.ts, así que la navegación sigue siendo sin recargar.
const NAV_LINKS = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/productos', label: 'Productos' },
  { href: '/robotica', label: 'Diseñá tu robot' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/servicios#como-trabajamos', label: 'Cómo trabajamos' },
  { href: '/presupuesto', label: 'Presupuesto' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/tecnologias', label: 'Tecnologías' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

export const Footer: React.FC = () => {
  return (
    // pb extra en celular para que el botón flotante de contacto no tape el contenido
    <footer className="bg-[#05070D]/85 backdrop-blur-sm border-t border-slate-800/80 text-slate-400 text-xs pt-14 pb-28 sm:pt-16 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Fila superior: marca + navegación */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 pb-8 sm:pb-10 border-b border-slate-800/70">
          <div className="flex items-center gap-3.5 min-w-0 max-w-full">
            <TecnorosLogo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(0,210,243,0.35)] shrink-0" />
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                tecnoros<span className="text-[#00D2F3]">.ar</span>
              </span>
            </div>
          </div>

          <nav
            aria-label="Secciones del sitio"
            className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap items-center justify-center lg:justify-end gap-x-8 gap-y-1 sm:gap-x-4 xl:gap-x-5 text-[13px] text-slate-400 text-center"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-cyan-400 transition-colors cursor-pointer py-2 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Derechos del consumidor: siempre visibles */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px]">
          <a
            href="#arrepentimiento"
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-cyan-500/50 text-cyan-300 font-semibold hover:bg-cyan-500/10 transition-colors"
          >
            Botón de arrepentimiento
          </a>
          <a href="/contacto#soporte" className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 py-1">Soporte técnico</a>
          <a href="/contrato-de-servicios.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Contrato de servicios</a>
          <a href="/politica-de-privacidad.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Política de privacidad</a>
        </div>

        {/* Redes de tecnoros.ar */}
        <div className="mt-8 pt-8 border-t border-slate-800/70 flex flex-col items-center gap-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Seguinos</span>
          <BotonesRedes />
        </div>

        {/* Créditos */}
        <div className="mt-8 pt-6 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center font-mono text-[11px] sm:text-xs text-slate-500">
          <span>© {new Date().getFullYear()} tecnoros<span className="text-cyan-400">.ar</span> · Todos los derechos reservados</span>
          <span className="hidden sm:inline text-slate-700" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            Hecho con
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" aria-label="amor" />
            en Rosario, Santa Fe
          </span>
        </div>
      </div>
    </footer>
  );
};
