/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { ProductosPropios } from './components/ProductosPropios';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { StackSection } from './components/StackSection';
import { PortfolioSection } from './components/PortfolioSection';
import { BillingModule } from './components/billing/BillingModule';
import { HowWeWorkSection } from './components/HowWeWorkSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Asistente } from './components/Asistente';
import { Arrepentimiento } from './components/Arrepentimiento';
import { Combos } from './components/extra/Combos';
import { Blog } from './components/extra/Blog';
import { Encuentros } from './components/extra/Encuentros';
import { FondoColor } from './components/FondoColor';
import { HeroCorto, JarDestacado, QueHacemos, PorQueElegirnos, ProductosInicio, EquipoCorto, SaberMas, ContactoRapido, CierrePagina } from './components/inicio/Inicio';
import { NoEncontrada } from './components/NoEncontrada';
import { useRuta, NO_ENCONTRADA, type Ruta } from './rutas';
import { META_PAGINAS, TITULO_NO_ENCONTRADA, tituloDe, descripcionDe, urlDe } from './data/paginas';

// El estudio de robótica arrastra three.js: se descarga sólo al entrar a /robotica
// para que el inicio cargue rápido en el celular.
const RobotStudioSection = lazy(() => import('./components/robotics/RobotStudioSection').then((m) => ({ default: m.RobotStudioSection })));

const Cargando: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center" role="status" aria-live="polite">
    <span className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" aria-hidden="true" />
    <span className="sr-only">Cargando…</span>
  </div>
);

// El inicio es un resumen corto; cada tema largo tiene su propia página.
// Títulos y descripciones viven en data/paginas.ts (los usa también el build).
const CONTENIDO: Record<Exclude<Ruta, '/'>, React.ReactNode> = {
  '/servicios': <><ServicesSection /><HowWeWorkSection /></>,
  '/productos': <ProductosPropios />,
  '/robotica': <RobotStudioSection />,
  '/proyectos': <PortfolioSection />,
  '/presupuesto': <><BillingModule /><Combos /></>,
  '/tecnologias': <StackSection />,
  '/nosotros': <AboutSection />,
  '/contacto': <ContactSection />,
  '/encuentros': <Encuentros />,
  '/blog': <Blog />,
};

const ponerMeta = (selector: string, atributo: 'content' | 'href', valor: string) => {
  document.querySelector(selector)?.setAttribute(atributo, valor);
};

// Una página inexistente no tiene que aparecer en Google: noindex mientras se ve el aviso.
const ponerNoIndex = (activo: boolean) => {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!activo) {
    meta?.remove();
    return;
  }
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'robots';
    document.head.appendChild(meta);
  }
  meta.content = 'noindex';
};

export default function App() {
  const ruta = useRuta();

  // Título, descripción y canonical por página: sin esto todas apuntaban al inicio
  // y Google trataba /servicios, /productos, etc. como duplicados.
  // El HTML de cada ruta ya trae estos datos desde el build; esto los actualiza al navegar sin recargar.
  React.useEffect(() => {
    ponerNoIndex(ruta === NO_ENCONTRADA);
    if (ruta === NO_ENCONTRADA) {
      document.title = TITULO_NO_ENCONTRADA;
      return;
    }
    const titulo = tituloDe(ruta);
    const descripcion = descripcionDe(ruta);
    const url = urlDe(ruta);
    document.title = titulo;
    ponerMeta('meta[name="description"]', 'content', descripcion);
    ponerMeta('meta[property="og:title"]', 'content', titulo);
    ponerMeta('meta[property="og:description"]', 'content', descripcion);
    ponerMeta('meta[property="og:url"]', 'content', url);
    ponerMeta('link[rel="canonical"]', 'href', url);
  }, [ruta]);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Fondo con color (la lucecita de arriba lo cambia) */}
      <FondoColor />
      <Navbar />

      <main className="flex-1">
        {ruta === '/' ? (
          <>
            {/* Orden: hero → combos → JAR → quiénes somos → servicios → productos → más información → contacto */}
            <HeroCorto />
            <Combos id="combos-inicio" />
            <JarDestacado />
            <EquipoCorto />
            <QueHacemos />
            <PorQueElegirnos />
            <ProductosInicio />
            <SaberMas />
            <ContactoRapido />
          </>
        ) : ruta === NO_ENCONTRADA ? (
          <div className="pt-20 sm:pt-[84px]">
            <NoEncontrada />
          </div>
        ) : (
          <div key={ruta} className="pt-20 sm:pt-[84px]">
            <Suspense fallback={<Cargando />}>
              {CONTENIDO[ruta]}
            </Suspense>
            {ruta !== '/contacto' && <CierrePagina />}
          </div>
        )}
      </main>

      <Footer />

      {/* Asistente guiado: el botón flotante abre el chat */}
      <Asistente />

      {/* Botón de arrepentimiento / baja (se abre con #arrepentimiento o #baja) */}
      <Arrepentimiento />
    </div>
  );
}
