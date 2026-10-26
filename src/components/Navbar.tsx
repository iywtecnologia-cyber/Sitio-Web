import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, ArrowRight, Workflow } from 'lucide-react';
import { TecnorosLogo } from './TecnorosLogo';
import { SERVICES } from './ServicesSection';
import { PRODUCTOS } from './ProductosPropios';
import { PROJECTS_DATA } from './PortfolioSection';
import { irA, useRuta, type Ruta } from '../rutas';
import { BotonFondo } from './FondoColor';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

interface SubItem {
  key: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  go: () => void;
}

interface NavLink {
  label: string;
  href: string;
  id: string;
  items?: SubItem[];
}

const MENU_MOVIL: { ruta: Ruta; titulo: string; linea: string }[] = [
  { ruta: '/', titulo: 'Inicio', linea: 'Quiénes somos y qué hacemos' },
  { ruta: '/servicios', titulo: 'Servicios', linea: 'Todo lo que hacemos y cómo trabajamos' },
  { ruta: '/productos', titulo: 'Productos y demos', linea: 'Golondrina, CHAJÁ y TERO' },
  { ruta: '/robotica', titulo: 'Diseñá tu robot', linea: 'Armalo y probalo en 3D' },
  { ruta: '/proyectos', titulo: 'Proyectos', linea: 'Sistemas funcionando' },
  { ruta: '/presupuesto', titulo: 'Presupuesto', linea: 'Calculá cuánto cuesta' },
  { ruta: '/nosotros', titulo: 'Nosotros', linea: 'Historia y equipo' },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seccionInicio, setActiveSection] = useState('inicio');
  const ruta = useRuta();
  const SECCION_DE_PAGINA: Record<string, string> = {
    '/servicios': 'servicios', '/productos': 'productos', '/robotica': 'robotica-3d', '/proyectos': 'proyectos', '/contacto': 'contacto',
    '/presupuesto': 'facturacion', '/tecnologias': 'stack', '/nosotros': 'sobre-nosotros',
  };
  const activeSection = ruta === '/' ? seccionInicio : SECCION_DE_PAGINA[ruta];
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracker for active underline
      const sections = ['inicio', 'servicios', 'robotica-3d', 'productos', 'sobre-nosotros', 'stack', 'proyectos', 'facturacion', 'como-trabajamos', 'contacto'];
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

  // Cerrar el desplegable con un clic afuera o con Escape.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
    setOpenMobileGroup(null);
  };

  const navLinks: NavLink[] = [
    {
      label: 'Servicios',
      href: '#servicios',
      id: 'servicios',
      items: SERVICES.map((s) => ({
        key: s.id,
        label: s.title,
        icon: s.icon,
        go: () => (s.id === 'robotica-a-medida' ? irA('robotica-3d', true) : irA(`servicio-${s.id}`, true)),
      })),
    },
    {
      label: 'Diseñá tu robot',
      href: '#robotica-3d',
      id: 'robotica-3d',
    },
    {
      label: 'Productos propios',
      href: '#productos',
      id: 'productos',
      items: [
        ...PRODUCTOS.map((p) => ({
          key: p.id,
          label: p.title,
          icon: p.icon,
          go: () => irA(`producto-${p.id}`, true),
        })),
        {
          key: 'golondrina-demo-b2b',
          label: 'Demo B2B Golondrina (Interactivo)',
          hint: 'Simulador 1 Clic en Planta',
          icon: Workflow,
          go: () => irA('aplicaciones-golondrina', true),
        }
      ],
    },
    {
      label: 'Proyectos',
      href: '#proyectos',
      id: 'proyectos',
      items: PROJECTS_DATA.map((p) => ({
        key: p.id,
        label: p.title,
        hint: p.category !== p.title ? p.category : undefined,
        icon: p.icon,
        go: () => {
          window.dispatchEvent(new CustomEvent('seleccionar-proyecto', { detail: p.id }));
          irA('proyectos');
        },
      })),
    },
    { label: 'Cómo Trabajamos', href: '#como-trabajamos', id: 'como-trabajamos' },
    { label: 'Nosotros', href: '#sobre-nosotros', id: 'sobre-nosotros' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeAll();
    irA(href.replace(/^#/, ''));
  };

  const pick = (item: SubItem) => {
    closeAll();
    item.go();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled || openMenu
          ? 'bg-[#070A12]/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-[84px] gap-2 sm:gap-4">

          {/* Marca: solo el logo y tecnoros.ar */}
          <div className="flex items-center shrink-0">
            <a
              href="#inicio"
              onClick={(e) => handleLinkClick(e, '#inicio')}
              className="flex items-center gap-2.5 sm:gap-3.5 group py-1"
            >
              <div className="relative group-hover:scale-105 transition-transform duration-200 shrink-0">
                <TecnorosLogo className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-[0_0_14px_rgba(0,210,243,0.4)]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl sm:text-[1.75rem] font-black tracking-tight text-white leading-none">
                  tecnoros<span className="text-[#00D2F3]">.ar</span>
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: nav links; Servicios, Productos propios y Proyectos despliegan su lista */}
          <nav ref={navRef} className="hidden xl:flex items-center gap-2.5 2xl:gap-5 text-[12.5px] 2xl:text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const underline = isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full" />
              );

              if (!link.items) {
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
                    {underline}
                  </a>
                );
              }

              const isOpen = openMenu === link.id;
              const panelId = `menu-${link.id}`;
              return (
                <div key={link.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : link.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={`relative py-1 inline-flex items-center gap-1 transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
                      isActive || isOpen ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    {underline}
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[340px] rounded-2xl bg-[#0B1120] border border-slate-700/80 shadow-2xl shadow-black/50 p-2"
                    >
                      <ul className="flex flex-col">
                        {link.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.key}>
                              <button
                                type="button"
                                onClick={() => pick(item)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-800/70 transition-colors cursor-pointer group"
                              >
                                <span className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 shrink-0 group-hover:border-cyan-500/50">
                                  <Icon className="w-4 h-4" />
                                </span>
                                <span className="flex flex-col min-w-0">
                                  <span className="text-sm font-semibold text-slate-100 group-hover:text-white leading-snug">{item.label}</span>
                                  {item.hint && <span className="text-xs text-slate-400 leading-snug">{item.hint}</span>}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="mt-1 flex items-center justify-between px-3 py-2.5 rounded-xl border-t border-slate-800 text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-slate-800/50 transition-colors"
                      >
                        <span>Ver todo en {link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden lg:flex items-center gap-2 2xl:gap-3 shrink-0">
            <BotonFondo />
            <a
              href="#contacto"
              onClick={(e) => handleLinkClick(e, '#contacto')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 2xl:px-3.5 2xl:py-2 text-xs font-semibold text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Contacto
            </a>
            <a
              href="#facturacion"
              onClick={(e) => handleLinkClick(e, '#facturacion')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 2xl:px-4 2xl:py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-md shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span>Cotizar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <BotonFondo className="lg:hidden" />
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

      {/* Menú del celular: una lista simple de páginas, cada una con una línea que dice qué hay */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0B1120] border-b border-slate-800 px-4 pt-3 pb-6 max-h-[calc(100dvh-5rem)] overflow-y-auto">
          <ul className="space-y-1">
            {MENU_MOVIL.map(({ ruta: r, titulo, linea }) => (
              <li key={r}>
                <a
                  href={r}
                  onClick={closeAll}
                  aria-current={ruta === r ? 'page' : undefined}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors ${ruta === r ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-200 hover:bg-slate-800/50'}`}
                >
                  <span className="min-w-0">
                    <span className="block text-base font-semibold">{titulo}</span>
                    <span className="block text-xs text-slate-400">{linea}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/contacto"
            onClick={closeAll}
            className="mt-4 block w-full text-center px-4 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl"
          >
            Contactanos
          </a>
        </div>
      )}
    </header>
  );
};
