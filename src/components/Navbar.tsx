import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { TecnorosLogo } from './TecnorosLogo';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracker for active underline
      const sections = ['inicio', 'servicios', 'sobre-nosotros', 'stack', 'proyectos', 'facturacion', 'como-trabajamos', 'contacto'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Sobre Nosotros', href: '#sobre-nosotros', id: 'sobre-nosotros' },
    { label: 'Nuestro Stack', href: '#stack', id: 'stack' },
    { label: 'Proyectos', href: '#proyectos', id: 'proyectos' },
    { label: 'Presupuestos', href: '#facturacion', id: 'facturacion' },
    { label: 'Cómo Trabajamos', href: '#como-trabajamos', id: 'como-trabajamos' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#070A12]/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-[84px] gap-4">
          
          {/* Brand Lockup: Logo + tecnoros.ar + Tagline (pushed to the left) */}
          <div className="flex items-center shrink-0">
            <a
              href="#inicio"
              onClick={(e) => handleLinkClick(e, '#inicio')}
              className="flex items-center gap-3 sm:gap-4 group py-1"
            >
              <div className="relative group-hover:scale-105 transition-transform duration-200 shrink-0">
                <TecnorosLogo className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-[0_0_14px_rgba(0,210,243,0.4)]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl sm:text-2xl sm:text-[26px] font-black tracking-tight text-white leading-none">
                  tecnoros<span className="text-[#00D2F3]">.ar</span>
                </span>
                <span className="hidden sm:inline-block text-[13px] sm:text-[14px] font-mono text-slate-200 tracking-wide mt-1.5 leading-none whitespace-nowrap">
                  Automatización <span className="text-cyan-500/70 font-sans mx-0.5">|</span> Ciberseguridad <span className="text-cyan-500/70 font-sans mx-0.5">|</span> Software
                </span>
                <span className="inline-block sm:hidden text-[10px] font-mono text-cyan-400 tracking-wide mt-1 leading-none">
                  Automatización & Software
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Clean single-line text nav links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-slate-300 translate-y-[18px] sm:translate-y-[20px]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative py-1 transition-colors whitespace-nowrap hover:text-white ${
                    isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3 translate-y-[18px] sm:translate-y-[20px]">
            <a
              href="#contacto"
              onClick={(e) => handleLinkClick(e, '#contacto')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Contacto
            </a>
            <a
              href="#facturacion"
              onClick={(e) => handleLinkClick(e, '#facturacion')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-md shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Cotizar Proyecto</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1120] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="#contacto"
              onClick={(e) => handleLinkClick(e, '#contacto')}
              className="w-full text-center px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/80 rounded-lg hover:bg-slate-800"
            >
              Contacto
            </a>
            <a
              href="#facturacion"
              onClick={(e) => handleLinkClick(e, '#facturacion')}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md shadow-cyan-500/20"
            >
              Cotizar Proyecto
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
