/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { ProductosPropios } from './components/ProductosPropios';
import { ServicesSection } from './components/ServicesSection';
import { RobotStudioSection } from './components/robotics/RobotStudioSection';
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
import { HeroCorto, JarDestacado, QueHacemos, PorQueElegirnos, ProductosInicio, EquipoCorto, SaberMas, ContactoRapido, CierrePagina } from './components/inicio/Inicio';
import { useRuta, type Ruta } from './rutas';

// El inicio es un resumen corto; cada tema largo tiene su propia página.
const PAGINAS: Record<Exclude<Ruta, '/'>, { titulo: string; contenido: React.ReactNode }> = {
  '/servicios': { titulo: 'Servicios', contenido: <><ServicesSection /><HowWeWorkSection /></> },
  '/productos': { titulo: 'Productos propios', contenido: <ProductosPropios /> },
  '/robotica': { titulo: 'Diseñá tu robot', contenido: <RobotStudioSection /> },
  '/proyectos': { titulo: 'Proyectos', contenido: <PortfolioSection /> },
  '/presupuesto': { titulo: 'Presupuesto', contenido: <><Combos /><BillingModule /></> },
  '/tecnologias': { titulo: 'Tecnologías', contenido: <StackSection /> },
  '/nosotros': { titulo: 'Nosotros', contenido: <AboutSection /> },
  '/contacto': { titulo: 'Contacto', contenido: <ContactSection /> },
};

export default function App() {
  const ruta = useRuta();

  React.useEffect(() => {
    document.title = ruta === '/' ? 'tecnoros.ar | Automatización | Ciberseguridad | Robótica | Electrónica | Machine Learning' : `${PAGINAS[ruta].titulo} · tecnoros.ar`;
  }, [ruta]);

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />

      <main className="flex-1">
        {ruta === '/' ? (
          <>
            {/* Orden: quiénes somos → JAR → qué hacemos → qué ofrecemos → a dónde ir para saber más → contacto */}
            <HeroCorto />
            <JarDestacado />
            <EquipoCorto />
            <QueHacemos />
            <PorQueElegirnos />
            <ProductosInicio />
            <SaberMas />
            <ContactoRapido />
          </>
        ) : (
          <div key={ruta} className="pt-16 sm:pt-20">
            {PAGINAS[ruta].contenido}
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
