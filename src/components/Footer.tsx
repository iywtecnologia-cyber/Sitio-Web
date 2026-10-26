import React from 'react';
import { Heart, Linkedin } from 'lucide-react';
import { TecnorosLogo } from './TecnorosLogo';
import { irA } from '../rutas';
import { BotonesRedes } from './Redes';

const NAV_LINKS = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'productos', label: 'Productos' },
  { id: 'robotica-3d', label: 'Diseñá tu robot' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'como-trabajamos', label: 'Cómo Trabajamos' },
  { id: 'facturacion', label: 'Presupuestos' },
  { id: 'sobre-nosotros', label: 'Nosotros' },
  { id: 'stack', label: 'Tecnologías' },
  { id: 'contacto', label: 'Contacto' },
];

const LINKEDIN_LINKS = [
  { href: 'https://www.linkedin.com/in/manuel-angiulli/', label: 'Manuel A.' },
  { href: 'https://www.linkedin.com/in/mariiasof%C3%ADagenta/', label: 'María Sofía Genta' },
  { href: 'https://www.linkedin.com/in/esteban-menin-31928a259/', label: 'Esteban José Menin' },
  { href: 'https://www.linkedin.com/in/sebastinsosa/', label: 'Sebastián Gabriel Sosa' },
];

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    irA(id);
  };

  return (
    // pb extra en celular para que el botón flotante de contacto no tape el contenido
    <footer className="bg-[#05070D] border-t border-slate-800/80 text-slate-400 text-xs pt-14 pb-28 sm:pt-16 sm:pb-16">
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
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="hover:text-cyan-400 transition-colors cursor-pointer py-2 whitespace-nowrap"
              >
                {link.label}
              </button>
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
          <a href="/contrato-de-servicios.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Contrato de servicios</a>
          <a href="/politica-de-privacidad.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Política de privacidad</a>
          <a href="/preguntas-frecuentes" className="text-slate-300 hover:text-cyan-300 underline underline-offset-4 py-1">Preguntas frecuentes</a>
        </div>

        {/* Equipo (LinkedIn de cada integrante) y, abajo, las redes de tecnoros.ar */}
        <div className="mt-8 pt-8 border-t border-slate-800/70 flex flex-col items-center gap-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Equipo</span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {LINKEDIN_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-[#0A66C2]/60 transition-colors text-[13px] whitespace-nowrap"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
          <span className="mt-4 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Seguinos</span>
          <BotonesRedes />
        </div>

        {/* Créditos */}
        <div className="mt-8 pt-6 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center font-mono text-[11px] sm:text-xs text-slate-500">
          <span>© {new Date().getFullYear()} tecnoros.ar · Todos los derechos reservados</span>
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
