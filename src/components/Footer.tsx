import React from 'react';
import { Heart, Linkedin } from 'lucide-react';
import { TecnorosLogo } from './TecnorosLogo';

const NAV_LINKS = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'sobre-nosotros', label: 'Sobre Nosotros' },
  { id: 'stack', label: 'Nuestro Stack' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'facturacion', label: 'Presupuestos' },
  { id: 'como-trabajamos', label: 'Cómo Trabajamos' },
  { id: 'contacto', label: 'Contacto' },
];

const LINKEDIN_LINKS = [
  { href: 'https://www.linkedin.com/in/manuel-angiulli/', label: 'Manuel Angiulli' },
  { href: 'https://www.linkedin.com/in/mariiasof%C3%ADagenta/', label: 'M. Sofía Genta' },
];

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // pb extra en celular para que el botón flotante de contacto no tape el contenido
    <footer className="bg-[#05070D] border-t border-slate-800/80 text-slate-400 text-xs pt-14 pb-28 sm:pt-16 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Fila superior: marca + navegación */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 pb-8 sm:pb-10 border-b border-slate-800/70">
          <div className="flex items-center gap-3.5">
            <TecnorosLogo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(0,210,243,0.35)] shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                tecnoros<span className="text-[#00D2F3]">.ar</span>
              </span>
              <span className="text-[11px] sm:text-[13px] font-mono text-slate-300 mt-1.5 leading-none whitespace-nowrap">
                Automatización <span className="text-cyan-500/60 font-sans mx-0.5">|</span> Ciberseguridad <span className="text-cyan-500/60 font-sans mx-0.5">|</span> Software
              </span>
            </div>
          </div>

          <nav
            aria-label="Secciones del sitio"
            className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-8 gap-y-1 sm:gap-x-7 text-[13px] text-slate-400 text-center"
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

        {/* Fila inferior: créditos + LinkedIn */}
        <div className="pt-8 sm:pt-10 flex flex-col lg:flex-row items-center justify-between gap-6 font-mono text-[11px] sm:text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center">
            <span>© {new Date().getFullYear()} tecnoros.ar · Todos los derechos reservados</span>
            <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              Hecho con
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" aria-label="amor" />
              en Rosario, Santa Fe
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LINKEDIN_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors py-1 whitespace-nowrap"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
