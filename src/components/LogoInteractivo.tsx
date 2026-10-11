import React from 'react';

// Logo de tecnoros.ar "vivo" para el asistente: el escudo con el circuito en T.
// La corriente recorre el circuito y los nodos se prenden en secuencia.
// `activo` (mientras lo agarrás) lo enciende del todo. Las animaciones se apagan con "reducir movimiento".
export const LogoInteractivo: React.FC<{ className?: string; activo?: boolean; destello?: number }> = ({
  className,
  activo = false,
  destello = 0,
}) => (
  <svg
    viewBox="0 0 100 115"
    fill="none"
    className={className}
    role="img"
    aria-label="Asistente de tecnoros.ar"
  >
    <style>{`
      @keyframes tr-corriente { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -60; } }
      @keyframes tr-nodo { 0%,100% { opacity: .55; transform: scale(1); } 40% { opacity: 1; transform: scale(1.35); } }
      @keyframes tr-destello { 0% { opacity: .9; } 100% { opacity: 0; } }
      .tr-nodo { transform-box: fill-box; transform-origin: center; animation: tr-nodo 2.4s ease-in-out infinite; }
      .tr-corriente { stroke-dasharray: 6 24; animation: tr-corriente 1.6s linear infinite; }
      .tr-activo .tr-corriente { animation-duration: .5s; }
      .tr-activo .tr-nodo { animation-duration: .6s; }
      @media (prefers-reduced-motion: reduce) { .tr-nodo, .tr-corriente, .tr-flash { animation: none !important; } }
    `}</style>
    <g className={activo ? 'tr-activo' : ''}>
      {/* escudo con fondo oscuro para que se lea sobre cualquier sección */}
      <path
        d="M 50 6 L 89 19 C 89 62 80 92 50 110 C 20 92 11 62 11 19 Z"
        fill="#0B1220"
        stroke="#00D2F3"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      {/* destello al hacer un truco */}
      {destello > 0 && (
        <path
          key={destello}
          className="tr-flash"
          d="M 50 6 L 89 19 C 89 62 80 92 50 110 C 20 92 11 62 11 19 Z"
          fill="#22D3EE"
          style={{ animation: 'tr-destello .7s ease-out forwards' }}
        />
      )}
      {/* circuito en T */}
      <g stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="31" y1="38" x2="69" y2="38" />
        <line x1="50" y1="38" x2="50" y2="78" />
        <path d="M 50 56 L 61 56 L 69 64" />
      </g>
      {/* corriente que recorre el circuito */}
      <g stroke="#67E8F9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="tr-corriente">
        <line x1="31" y1="38" x2="69" y2="38" />
        <line x1="50" y1="38" x2="50" y2="78" />
        <path d="M 50 56 L 61 56 L 69 64" />
      </g>
      {/* nodos que se prenden en secuencia */}
      <circle cx="31" cy="38" r="6" fill="#00D2F3" className="tr-nodo" />
      <circle cx="69" cy="38" r="6" fill="#00D2F3" className="tr-nodo" style={{ animationDelay: '.3s' }} />
      <circle cx="69" cy="64" r="5.5" fill="#00D2F3" className="tr-nodo" style={{ animationDelay: '.6s' }} />
      <circle cx="50" cy="78" r="6" fill="#00D2F3" className="tr-nodo" style={{ animationDelay: '.9s' }} />
    </g>
  </svg>
);
