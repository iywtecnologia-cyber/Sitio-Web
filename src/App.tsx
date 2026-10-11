/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
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

export default function App() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <ProductosPropios />
        <PortfolioSection />
        <HowWeWorkSection />
        <BillingModule />
        <AboutSection />
        <StackSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Asistente guiado: el botón flotante abre el chat */}
      <Asistente />
    </div>
  );
}
