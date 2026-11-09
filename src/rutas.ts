import { useEffect, useState } from 'react';

// Navegación simple entre páginas sin librerías: el inicio es un resumen corto y lo pesado
// (simuladores, 3D, presupuestador, tecnologías) vive en páginas propias.
// Render ya reescribe cualquier ruta a index.html, así que /productos, /robotica, etc. funcionan al recargar.

export type Ruta = '/' | '/servicios' | '/productos' | '/robotica' | '/proyectos' | '/presupuesto' | '/tecnologias' | '/nosotros' | '/contacto' | '/blog' | '/encuentros';

export const RUTAS: Ruta[] = ['/', '/servicios', '/productos', '/robotica', '/proyectos', '/presupuesto', '/tecnologias', '/nosotros', '/contacto', '/blog', '/encuentros'];

// Direcciones cortas para compartir por WhatsApp, Instagram o un QR (tecnoros.ar/golondrina, etc.).
// Al entrar se cambian por la página real y se baja a la sección.
const ATAJOS: Record<string, [Ruta, string]> = {
  '/golondrina': ['/productos', 'aplicaciones-golondrina'],
  '/probar-golondrina': ['/productos', 'aplicaciones-golondrina'],
  '/golondrina-personal': ['/productos', 'golondrina-personal-demo'],
  '/equipos-3d': ['/productos', 'hardware-studio-3d'],
  '/chaja': ['/productos', 'hardware-studio-3d'],
  '/tero': ['/productos', 'tero-proximamente'],
  '/robot': ['/robotica', ''],
  '/disena-tu-robot': ['/robotica', ''],
  '/soporte': ['/contacto', 'soporte'],
  '/combos': ['/presupuesto', 'combos'],
  '/precios': ['/presupuesto', ''],
  '/fotos': ['/encuentros', ''],
  '/equipo': ['/nosotros', ''],
};

if (typeof window !== 'undefined') {
  const atajo = ATAJOS[window.location.pathname.replace(/\/+$/, '').toLowerCase()];
  if (atajo) window.history.replaceState({}, '', atajo[0] + (atajo[1] ? `#${atajo[1]}` : ''));
}

const normalizar = (p: string): Ruta => {
  const limpio = (p.replace(/\/+$/, '') || '/') as Ruta;
  return RUTAS.includes(limpio) ? limpio : '/';
};

// En qué página vive cada sección (id del elemento). Lo que no está acá se busca en la página actual o en el inicio.
const PAGINA_DE: Record<string, Ruta> = {
  inicio: '/', 'jar-2026': '/', 'que-hacemos': '/', 'productos-inicio': '/', equipo: '/', 'saber-mas': '/', 'contacto-rapido': '/',
  servicios: '/servicios', 'como-trabajamos': '/servicios',
  proyectos: '/proyectos',
  contacto: '/contacto', 'consulta-directa': '/contacto', soporte: '/contacto',
  productos: '/productos', 'golondrina-personal-demo': '/productos', 'hardware-studio-3d': '/productos',
  'aplicaciones-golondrina': '/productos', 'aviso-seguridad': '/productos', 'tero-proximamente': '/productos', 'tablero-golondrina': '/productos', 'precios-golondrina': '/productos',
  'robotica-3d': '/robotica',
  facturacion: '/presupuesto', combos: '/presupuesto',
  'por-que-elegirnos': '/', 'combos-inicio': '/', blog: '/blog', encuentros: '/encuentros',
  stack: '/tecnologias',
  'sobre-nosotros': '/nosotros',
};

const paginaDe = (id: string): Ruta | undefined => {
  if (PAGINA_DE[id]) return PAGINA_DE[id];
  if (id.startsWith('servicio-')) return '/servicios';
  if (id.startsWith('producto-')) return '/productos';
  if (id.startsWith('paso-')) return '/servicios';
  return undefined;
};

const EVENTO = 'cambio-de-ruta';

export const rutaActual = (): Ruta => (typeof window === 'undefined' ? '/' : normalizar(window.location.pathname));

// /servicios/ o /cualquier-cosa mostraban la página sin corregir la barra de direcciones:
// links rotos compartidos quedaban "funcionando" y Google veía el inicio duplicado en otra URL.
const corregirURL = () => {
  const { pathname, search, hash } = window.location;
  const ruta = rutaActual();
  if (pathname !== ruta) window.history.replaceState(window.history.state, '', ruta + search + hash);
};

export const navegar = (ruta: Ruta, hash = '') => {
  const destino = ruta + (hash ? `#${hash}` : '');
  if (window.location.pathname + window.location.hash !== destino) {
    window.history.pushState({}, '', destino);
  }
  window.dispatchEvent(new Event(EVENTO));
  // 'instant' a propósito: con scroll-smooth en <html>, la página nueva se veía "pasar" de abajo hacia arriba.
  if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
};

export const useRuta = (): Ruta => {
  const [ruta, setRuta] = useState<Ruta>(rutaActual());
  useEffect(() => {
    corregirURL();
    const actualizar = () => setRuta(rutaActual());
    window.addEventListener('popstate', actualizar);
    window.addEventListener(EVENTO, actualizar);
    return () => {
      window.removeEventListener('popstate', actualizar);
      window.removeEventListener(EVENTO, actualizar);
    };
  }, []);
  return ruta;
};

const resaltarEl = (el: Element) => {
  if (typeof (el as HTMLElement).animate !== 'function') return;
  window.setTimeout(() => {
    (el as HTMLElement).animate(
      [{ boxShadow: '0 0 0 2px rgba(34,211,238,0.9)' }, { boxShadow: '0 0 0 2px rgba(34,211,238,0)' }],
      { duration: 1600, easing: 'ease-out' }
    );
  }, 500);
};

// Margen para que el header fijo no tape el título de la sección. Se calcula acá y no con
// scroll-mt-* en cada sección: había valores distintos y algunas quedaban debajo del header.
const MARGEN_SOBRE_SECCION = 16;

// suave = true: desliza (dentro de la misma página). false: aparece directo ahí (al cambiar de página),
// para que no se vea la página nueva deslizándose desde arriba.
const scrollearA = (el: Element, bloque: ScrollLogicalPosition, suave: boolean) => {
  // Si el destino está dentro de un bloque plegado del celular (PlegableMovil), primero se abre
  // y después se scrollea: si no, el elemento está oculto y el botón "no lleva a ningún lado".
  const plegado = el.closest('[data-plegable="cerrado"]');
  if (plegado) {
    plegado.dispatchEvent(new CustomEvent('abrir-plegable'));
    window.setTimeout(() => requestAnimationFrame(() => scrollearA(el, bloque, suave)), 150);
    return;
  }
  const behavior: ScrollBehavior = suave ? 'smooth' : 'instant';
  if (bloque !== 'start') {
    el.scrollIntoView({ behavior, block: bloque });
    return;
  }
  const alturaHeader = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
  const top = el.getBoundingClientRect().top + window.scrollY - alturaHeader - MARGEN_SOBRE_SECCION;
  window.scrollTo({ top: Math.max(0, top), behavior });
};

// Espera a que el elemento exista (la página nueva tarda un instante en dibujarse) y scrollea hasta él.
const esperarYScrollear = (id: string, resaltar: boolean, bloque: ScrollLogicalPosition, suave = true) => {
  let intentos = 0;
  const probar = () => {
    const el = document.getElementById(id);
    if (el) {
      scrollearA(el, bloque, suave);
      if (resaltar) resaltarEl(el);
      return;
    }
    // Hasta 5 s: las páginas pesadas se descargan aparte y en un celular con 3G tardan.
    if (++intentos < 100) window.setTimeout(probar, 50);
  };
  probar();
};

// Lleva a una sección esté en la página que esté.
export const irA = (id: string, resaltar = false, bloque: ScrollLogicalPosition = 'start') => {
  const destino = paginaDe(id);
  const actual = rutaActual();
  if (destino && destino !== actual) {
    navegar(destino, id === 'inicio' ? '' : id);
    if (id !== 'inicio') esperarYScrollear(id, resaltar, bloque, false);
    return;
  }
  if (id === 'inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  esperarYScrollear(id, resaltar, bloque);
};

// Links <a href="/productos"> o <a href="#contacto"> en cualquier parte de la web pasan por acá.
// #arrepentimiento y #baja se dejan como están porque abren su propia ventana.
if (typeof window !== 'undefined' && !(window as unknown as { __rutasListas?: boolean }).__rutasListas) {
  (window as unknown as { __rutasListas?: boolean }).__rutasListas = true;
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a');
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!id || id === 'arrepentimiento' || id === 'baja') return;
      e.preventDefault();
      irA(id);
      return;
    }
    if (href.startsWith('/') && !href.startsWith('//')) {
      const [camino, hash] = href.split('#');
      if (!RUTAS.includes(camino as Ruta)) return; // PDFs y otros archivos
      e.preventDefault();
      if (hash) irA(hash);
      else navegar(camino as Ruta);
    }
  });
  // Al entrar directo con /productos#hardware-studio-3d, ir a esa parte.
  window.addEventListener('load', () => {
    const h = window.location.hash.slice(1);
    if (h && h !== 'arrepentimiento' && h !== 'baja') esperarYScrollear(h, false, 'start', false);
  });
}
