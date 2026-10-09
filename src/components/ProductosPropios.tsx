import React from 'react';
import { ShieldCheck, FlaskConical, Workflow, BellRing, BookOpen, CheckCircle2, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../data/contact';
import { openSentinelOpsDocs } from './SentinelOpsDocs';

const SENTINEL_BULLETS = [
  'Escanea tus equipos y te dice qué fallos tienen y cómo solucionarlos',
  'Alertas y respuestas automáticas ante incidentes',
  'Reportes en PDF o CSV para compartir el estado de tu seguridad',
];

const cardClass =
  'p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex flex-col gap-4';

export const ProductosPropios: React.FC = () => (
  <section id="productos" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
    <div className="absolute -top-10 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300 mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Productos propios</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Creamos{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            nuestros propios productos
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
          Además de desarrollar a medida, construimos soluciones propias, pensadas desde cero para los problemas que vemos en los negocios todos los días.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SentinelOps */}
        <div className={`${cardClass} border-cyan-500/30`}>
          <div className="flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded border tracking-wider border-cyan-500/40 text-cyan-300 bg-cyan-950/30">
              Creación propia
            </span>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">Software propio de ciberseguridad</div>
            <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">SentinelOps</h3>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Plataforma de ciberseguridad defensiva para empresas: vigila tus equipos, encuentra fallos de seguridad y te ayuda a responder ante incidentes. Todo desde un panel, con botones y formularios, sin necesidad de programar.
          </p>
          <ul className="space-y-2">
            {SENTINEL_BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href="#sentinelops"
              onClick={(e) => {
                e.preventDefault();
                openSentinelOpsDocs();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Ver documentación funcional
            </a>
            <a
              href={whatsappLink('Hola tecnoros.ar, quiero conocer SentinelOps para mi empresa')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 text-white font-semibold text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              Quiero conocerlo
            </a>
          </div>
        </div>

        {/* Plataforma de automatización (en desarrollo) */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
              <Workflow className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded border tracking-wider border-violet-500/40 text-violet-300 bg-violet-950/30">
              En desarrollo
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Plataforma integral de automatización</h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Una solución que une software y automatización para que las distintas partes de tu negocio trabajen conectadas, sin pasar datos a mano.
          </p>
          <div className="mt-auto pt-2">
            <a
              href={whatsappLink('Hola tecnoros.ar, quiero enterarme cuando lancen su plataforma de automatización')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 text-white font-semibold text-sm transition-colors"
            >
              <BellRing className="w-4 h-4 text-violet-300" />
              Quiero ser de los primeros
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
