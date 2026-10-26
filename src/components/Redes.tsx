import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { REDES } from '../data/contact';

// Logo de TikTok (lucide no lo trae)
export const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.4-2.47V9.67a5.73 5.73 0 0 0-.8-.06 5.69 5.69 0 0 0-5.69 5.7A5.69 5.69 0 0 0 9.86 21a5.69 5.69 0 0 0 5.69-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
  </svg>
);

export const LISTA_REDES = [
  { nombre: 'Instagram', href: REDES.instagram, icon: Instagram, color: 'text-pink-400' },
  { nombre: 'TikTok', href: REDES.tiktok, icon: TikTokIcon, color: 'text-white' },
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
