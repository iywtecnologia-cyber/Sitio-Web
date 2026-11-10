import React from 'react';
import { Compass, Home, MessageCircle } from 'lucide-react';

// Se muestra cuando la dirección no existe (el servidor responde 404 con 404.html).
// Ofrece salir a Inicio o a Contacto, que es lo que suele buscar quien llega por un link viejo.
export const NoEncontrada: React.FC = () => (
  <section className="min-h-[70vh] flex items-center py-16">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
        <Compass className="w-3.5 h-3.5" aria-hidden="true" />
        Error 404
      </span>
      <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
        No encontramos esta página
      </h1>
      <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
        Puede que el link esté mal escrito o que la página ya no exista. Volvé al inicio o escribinos y te ayudamos a encontrar lo que buscás.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-sm"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Ir al inicio
        </a>
        <a
          href="/contacto"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          Contactanos
        </a>
      </div>
    </div>
  </section>
);
