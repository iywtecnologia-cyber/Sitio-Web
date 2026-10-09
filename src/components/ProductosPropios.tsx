import React from 'react';
import { Boxes, FlaskConical, Workflow, BellRing } from 'lucide-react';
import { whatsappLink } from '../data/contact';

// Productos propios en desarrollo. Cuando tengan nombre y detalles definidos,
// se actualizan acá (título, descripción y etiqueta).
const PRODUCTOS = [
  {
    icon: Boxes,
    title: 'Software propio',
    text: 'Una herramienta pensada desde cero para resolver un problema que vemos en muchos negocios todos los días.',
  },
  {
    icon: Workflow,
    title: 'Plataforma integral de automatización',
    text: 'Una solución que une software y automatización para que las distintas partes de tu negocio trabajen conectadas, sin pasar datos a mano.',
  },
];

export const ProductosPropios: React.FC = () => (
  <section id="productos" className="py-14 sm:py-16 md:py-20 bg-[#070A12] border-t border-slate-800/50 relative overflow-hidden">
    <div className="absolute -top-10 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300 mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>En nuestro laboratorio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Estamos creando{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            nuestros propios productos
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
          Además de desarrollar a medida, estamos construyendo soluciones propias. Todavía están en proceso, pero podés anotarte para conocerlas antes que nadie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRODUCTOS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded border tracking-wider border-violet-500/40 text-violet-300 bg-violet-950/30">
                En desarrollo
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <a
          href={whatsappLink('Hola tecnoros.ar, quiero enterarme cuando lancen sus productos propios')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
        >
          <BellRing className="w-4 h-4" />
          Quiero ser de los primeros
        </a>
        <span className="text-sm text-slate-400">Te avisamos por WhatsApp cuando estén listos.</span>
      </div>
    </div>
  </section>
);
