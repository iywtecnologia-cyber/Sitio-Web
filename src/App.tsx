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
import { FondoColor } from './components/FondoColor';
import { HeroCorto, JarDestacado, QueHacemos, PorQueElegirnos, ProductosInicio, EquipoCorto, SaberMas, ContactoRapido, CierrePagina } from './components/inicio/Inicio';
import { useRuta, type Ruta } from './rutas';

// El estudio de robótica arrastra three.js: se descarga sólo al entrar a /robotica
// para que el inicio cargue rápido en el celular.
const RobotStudioSection = lazy(() => import('./components/robotics/RobotStudioSection').then((m) => ({ default: m.RobotStudioSection })));

const Cargando: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center" role="status" aria-live="polite">
    <span className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" aria-hidden="true" />
    <span className="sr-only">Cargando…</span>
  </div>
);

const SITIO = 'https://www.tecnoros.ar';
const TITULO_INICIO = 'tecnoros.ar | Automatización | Ciberseguridad | Robótica | Electrónica | Machine Learning';
const DESCRIPCION_INICIO = 'Automatización inteligente, ciberseguridad, robótica a medida, electrónica y machine learning para empresas y la agroindustria. Diagnóstico gratuito.';

// El inicio es un resumen corto; cada tema largo tiene su propia página.
const PAGINAS: Record<Exclude<Ruta, '/'>, { titulo: string; descripcion: string; contenido: React.ReactNode }> = {
  '/servicios': { titulo: 'Servicios', descripcion: 'Automatizaciones, ciberseguridad, e-commerce, apps, CRM, bots de WhatsApp y robótica. Mirá qué hacemos y cómo trabajamos.', contenido: <><ServicesSection /><HowWeWorkSection /></> },
  '/productos': { titulo: 'Productos propios', descripcion: 'Golondrina, CHAJÁ y TERO: nuestros sistemas y equipos propios. Probá las demos y miralos en 3D.', contenido: <ProductosPropios /> },
  '/robotica': { titulo: 'Diseñá tu robot', descripcion: 'Armá tu robot a medida y probalo en 3D. Primero programamos el cerebro; si funciona, fabricamos el cuerpo.', contenido: <RobotStudioSection /> },
  '/proyectos': { titulo: 'Proyectos', descripcion: 'Sistemas reales que hicimos y que ya están funcionando en negocios.', contenido: <PortfolioSection /> },
  '/presupuesto': { titulo: 'Presupuesto', descripcion: 'Calculá cuánto cuesta lo que necesitás, con precios de referencia y combos.', contenido: <><BillingModule /><Combos /></> },
  '/tecnologias': { titulo: 'Tecnologías', descripcion: 'Las tecnologías con las que trabajamos.', contenido: <StackSection /> },
  '/nosotros': { titulo: 'Nosotros', descripcion: 'Somos un equipo de Rosario: ciberseguridad, QA, automatización, electrónica y machine learning.', contenido: <AboutSection /> },
  '/contacto': { titulo: 'Contacto', descripcion: 'Contanos qué necesitás por WhatsApp o e-mail. El diagnóstico es sin costo.', contenido: <ContactSection /> },
  '/blog': { titulo: 'Blog', descripcion: 'Notas cortas y prácticas para tu negocio: automatización, ciberseguridad y más.', contenido: <Blog /> },
};

const ponerMeta = (selector: string, atributo: 'content' | 'href', valor: string) => {
  document.querySelector(selector)?.setAttribute(atributo, valor);
};

export default function App() {
  const ruta = useRuta();

  // Título, descripción y canonical por página: sin esto todas apuntaban al inicio
  // y Google trataba /servicios, /productos, etc. como duplicados.
  React.useEffect(() => {
    const pagina = ruta === '/' ? null : PAGINAS[ruta];
    const titulo = pagina ? `${pagina.titulo} · tecnoros.ar` : TITULO_INICIO;
    const descripcion = pagina?.descripcion ?? DESCRIPCION_INICIO;
    const url = SITIO + (ruta === '/' ? '/' : ruta);
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
        ) : (
          <div key={ruta} className="pt-20 sm:pt-[84px]">
            <Suspense fallback={<Cargando />}>
              {PAGINAS[ruta].contenido}
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
