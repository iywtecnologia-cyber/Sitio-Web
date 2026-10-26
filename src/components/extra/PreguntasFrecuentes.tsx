import React, { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PREGUNTAS } from '../../data/preguntas';

// Preguntas frecuentes: cada respuesta se abre al tocar la pregunta.
export const PreguntasFrecuentes: React.FC = () => {
  // Datos para buscadores (Google puede mostrar las preguntas en los resultados)
  useEffect(() => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'faq-jsonld';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: PREGUNTAS.map((q) => ({ '@type': 'Question', name: q.p, acceptedAnswer: { '@type': 'Answer', text: q.r } })),
    });
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  return (
    <section id="preguntas" className="scroll-mt-24 py-14 sm:py-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-400">Preguntas frecuentes</span>
        <h2 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Lo que más nos preguntan</h2>
        <div className="mt-8 space-y-3">
          {PREGUNTAS.map((q) => (
            <details key={q.p} className="group rounded-2xl bg-slate-900/80 border border-slate-800 open:border-cyan-500/50">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4 text-base sm:text-lg font-bold text-white">
                {q.p}
                <ChevronDown className="w-5 h-5 text-cyan-300 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 -mt-1 text-base text-slate-300 leading-relaxed">{q.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
