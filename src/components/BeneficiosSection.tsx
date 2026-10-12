import React from 'react';
import { Clock, Wallet, TrendingUp, ArrowRight } from 'lucide-react';

// Franja de beneficios: valores de referencia (hora valuada en $5.000). El detalle se muestra en el diagnóstico.
const DATOS = [
  { icon: Clock, valor: 'Hasta 24 h', texto: 'libres por mes', nota: 'más de 3 jornadas de trabajo' },
  { icon: Wallet, valor: 'Hasta $120.000', texto: 'por mes en tiempo recuperado', nota: 'valuando la hora en $5.000' },
  { icon: TrendingUp, valor: '3 meses', texto: 'para recuperar una automatización', nota: 'después, todo es ganancia' },
];

export const BeneficiosSection: React.FC = () => (
  <section id="beneficios" className="scroll-mt-12 sm:scroll-mt-16 py-12 sm:py-16 bg-[#0B1220] border-t border-slate-800/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-xs font-mono tracking-[0.25em] uppercase text-cyan-400">Lo que ganás</p>
      <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Trabaja el sistema, ganás tiempo, <span className="text-cyan-400">crece tu negocio.</span>
      </h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DATOS.map(({ icon: Icon, valor, texto, nota }) => (
          <div key={valor} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <Icon className="w-6 h-6 text-cyan-400" />
            <div className="mt-3 text-3xl font-extrabold text-cyan-300">{valor}</div>
            <div className="mt-1 font-semibold text-white">{texto}</div>
            <div className="text-sm text-slate-400">{nota}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <p className="text-xs text-slate-500">Valores de referencia para un comercio o pyme. Cada negocio tiene sus números.</p>
        <a href="#contacto" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-300">
          Calculalo con tu negocio: diagnóstico gratis <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
);
