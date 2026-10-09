/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DemoSection } from './components/demos/DemoSection';
import { ProductosPropios } from './components/ProductosPropios';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { StackSection } from './components/StackSection';
import { PortfolioSection } from './components/PortfolioSection';
import { BillingModule } from './components/billing/BillingModule';
import { HowWeWorkSection } from './components/HowWeWorkSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TecnorosContactIcon } from './components/TecnorosContactIcon';

export default function App() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <DemoSection />
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

      {/* Floating Action: Tecnoros Contact Icon (Without Text) -> Scrolls to Contact */}
      <a
        href="#contacto"
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById('contacto');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}
        className="fixed bottom-6 right-6 z-40 p-2.5 sm:p-3 rounded-2xl bg-[#0B1220]/95 hover:bg-[#0E172A] border border-cyan-500/40 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center backdrop-blur-md cursor-pointer"
        aria-label="Ir a Contacto y WhatsApp"
        title="Contactar a tecnoros.ar"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-1" />
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute -top-1 -right-1" />
        <TecnorosContactIcon className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_12px_rgba(0,210,243,0.45)] group-hover:scale-105 transition-transform" />
      </a>
    </div>
  );
}
