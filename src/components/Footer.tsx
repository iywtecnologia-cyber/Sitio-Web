import React from 'react';
import { Heart, Linkedin } from 'lucide-react';
import { TecnorosLogo } from './TecnorosLogo';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070D] border-t border-slate-800/80 text-slate-400 text-xs py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fila Superior: Marca y Navegación con amplio espacio */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 sm:pb-10 border-b border-slate-800/70">
          <div className="flex items-center gap-3.5">
            <TecnorosLogo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(0,210,243,0.35)] shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                tecnoros<span className="text-[#00D2F3]">.ar</span>
              </span>
              <span className="text-[12px] sm:text-[13px] font-mono text-slate-300 mt-1 leading-none">
                Automatizacion <span className="text-cyan-500/60 font-sans mx-0.5">|</span> Ciberseguridad <span className="text-cyan-500/60 font-sans mx-0.5">|</span> Software
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-7 text-xs sm:text-[13px] text-slate-400">
            <button onClick={() => scrollTo('servicios')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Servicios
            </button>
            <button onClick={() => scrollTo('sobre-nosotros')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Sobre Nosotros
            </button>
            <button onClick={() => scrollTo('stack')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Nuestro Stack
            </button>
            <button onClick={() => scrollTo('proyectos')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Proyectos
            </button>
            <button onClick={() => scrollTo('facturacion')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Presupuestos
            </button>
            <button onClick={() => scrollTo('como-trabajamos')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Cómo Trabajamos
            </button>
            <button onClick={() => scrollTo('contacto')} className="hover:text-cyan-400 transition-colors cursor-pointer py-1">
              Contacto
            </button>
          </nav>
        </div>

        {/* Fila Inferior: Créditos con los dos puntos • y Enlaces de LinkedIn amplios y descolapsados */}
        <div className="pt-8 sm:pt-10 flex flex-col lg:flex-row items-center justify-between gap-5 text-slate-400 text-xs">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-mono text-[11px] sm:text-xs text-slate-400">
              © {new Date().getFullYear()} tecnoros.ar • Todos los derechos reservados.
            </span>
            <span className="inline text-slate-600 font-bold">•</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-slate-400">
              <span>Desarrollado con</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
              <span>en Rosario, Santa Fe, Argentina</span>
            </div>
            <span className="inline text-slate-600 font-bold">•</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono">
            <a
              href="https://www.linkedin.com/in/manuel-angiulli/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors py-1"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
              <span>Linkedin Manuel Angiulli</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://www.linkedin.com/in/mariiasof%C3%ADagenta/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors py-1"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
              <span>Linkedin M. Sofía Genta</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
