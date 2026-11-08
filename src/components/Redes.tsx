import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { REDES } from '../data/contact';

export const LISTA_REDES = [
  { nombre: 'Instagram', href: REDES.instagram, icon: Instagram, color: 'text-pink-400' },
  { nombre: 'LinkedIn', href: REDES.linkedin, icon: Linkedin, color: 'text-[#4DA3FF]' },
];

// Fila de botones "Seguinos" con las redes de tecnoros.ar
export const BotonesRedes: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
    {LISTA_REDES.map(({ nombre, href, icon: Icon, color }) => (
      <a
        key={nombre}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`tecnoros.ar en ${nombre}`}
        title={nombre}
        className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
      >
        <Icon className={`w-5 h-5 shrink-0 ${color}`} />
      </a>
    ))}
  </div>
);
