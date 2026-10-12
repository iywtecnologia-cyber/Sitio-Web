import React from 'react';

// Logos de los productos propios: mismo escudo de tecnoros.ar y la inicial
// dibujada como circuito (T de TERO Security, C de Calandria).
const ESCUDO = 'M 50 6 L 89 19 C 89 62 80 92 50 110 C 20 92 11 62 11 19 Z';

type Props = { className?: string; title?: string };

export const TeroLogo: React.FC<Props> = ({ className, title = 'TERO Security' }) => (
  <svg viewBox="0 0 100 115" fill="none" className={className} role="img" aria-label={title}>
    <path d={ESCUDO} fill="#0B1220" stroke="#22D3EE" strokeWidth="6" strokeLinejoin="round" />
    <path d="M30 42 H70 M50 42 V84" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
    <circle cx="30" cy="42" r="6" fill="#22D3EE" />
    <circle cx="70" cy="42" r="6" fill="#22D3EE" />
    <circle cx="50" cy="84" r="6" fill="#22D3EE" />
  </svg>
);

export const CalandriaLogo: React.FC<Props> = ({ className, title = 'Calandria Automatización' }) => (
  <svg viewBox="0 0 100 115" fill="none" className={className} role="img" aria-label={title}>
    <path d={ESCUDO} fill="#0B1220" stroke="#22D3EE" strokeWidth="6" strokeLinejoin="round" />
    <path d="M66 40 H42 L32 50 V70 L42 80 H66" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="66" cy="40" r="6" fill="#22D3EE" />
    <circle cx="66" cy="80" r="6" fill="#22D3EE" />
  </svg>
);
