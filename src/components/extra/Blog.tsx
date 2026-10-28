import React from 'react';
import { ChevronDown } from 'lucide-react';
import { NOTAS } from '../../data/blog';

const fechaLinda = (f: string) =>
  new Date(`${f}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

// Blog: notas cortas que se abren al tocarlas.
export const Blog: React.FC = () => (
  <section id="blog" className="scroll-mt-24 py-14 sm:py-20">
    <div className="max-w-3xl mx-auto px-5 sm:px-8">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">Blog</span>
      <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Ideas para tu negocio</h2>
      <p className="mt-2 text-base text-slate-400">Notas cortas y prácticas. Tocá una para leerla.</p>
      <div className="mt-8 space-y-4">
        {NOTAS.map((n) => (
          <details key={n.id} id={`nota-${n.id}`} className="group rounded-2xl bg-slate-900/80 border border-slate-800 open:border-cyan-500/50 scroll-mt-24">
            <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
              <span>
                <span className="text-xs font-mono text-cyan-400">{n.tema} · {fechaLinda(n.fecha)}</span>
                <span className="block mt-1 text-lg sm:text-xl font-bold text-white">{n.titulo}</span>
                <span className="block mt-1 text-sm sm:text-base text-slate-400">{n.resumen}</span>
              </span>
              <ChevronDown className="w-5 h-5 text-cyan-300 shrink-0 mt-6 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 -mt-1 space-y-3 text-base text-slate-300 leading-relaxed">
              {n.parrafos.map((p) => <p key={p}>{p}</p>)}
              {n.puntos && (
                <ul className="space-y-2">
                  {n.puntos.map((p) => (
                    <li key={p} className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>{p}</span></li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);
