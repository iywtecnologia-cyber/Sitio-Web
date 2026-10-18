import React from 'react';

// Marcio, la mascota de tecnoros.ar: mitad marciano, mitad astronauta, con el escudo de la marca en el pecho.
// `saludando` mueve el brazo; las animaciones se apagan con "reducir movimiento".
export const Marcianito: React.FC<{ className?: string; saludando?: boolean }> = ({ className, saludando = true }) => (
  <svg viewBox="0 0 120 140" className={className} role="img" aria-label="Asistente de tecnoros.ar">
    <style>{`
      @keyframes marci-saludo { 0%,100% { transform: rotate(0deg); } 20% { transform: rotate(-30deg); } 40% { transform: rotate(6deg); } 60% { transform: rotate(-26deg); } 80% { transform: rotate(4deg); } }
      @keyframes marci-parpadeo { 0%,92%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
      @keyframes marci-antena { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(8deg); } }
      @keyframes marci-nodo { 0%,100% { opacity: .5; } 40% { opacity: 1; } }
      .marci-nodo { animation: marci-nodo 2.4s ease-in-out infinite; }
      .marci-brazo { transform-origin: 88px 86px; }
      .marci-saluda .marci-brazo { animation: marci-saludo 1.6s ease-in-out infinite; }
      .marci-ojo { transform-box: fill-box; transform-origin: center; animation: marci-parpadeo 4s infinite; }
      .marci-antena { transform-box: fill-box; transform-origin: bottom center; animation: marci-antena 2.4s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .marci-brazo, .marci-ojo, .marci-antena, .marci-nodo { animation: none !important; } }
    `}</style>
    <g className={saludando ? 'marci-saluda' : ''}>
      {/* mochila */}
      <rect x="30" y="76" width="60" height="42" rx="10" fill="#94A3B8" />
      {/* piernas y botas */}
      <rect x="44" y="112" width="13" height="18" rx="5" fill="#E2E8F0" />
      <rect x="63" y="112" width="13" height="18" rx="5" fill="#E2E8F0" />
      <rect x="41" y="126" width="18" height="9" rx="4" fill="#475569" />
      <rect x="61" y="126" width="18" height="9" rx="4" fill="#475569" />
      {/* brazo izquierdo */}
      <path d="M36 88 Q24 96 26 110" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="112" r="6" fill="#34D399" />
      {/* traje */}
      <rect x="34" y="78" width="52" height="40" rx="14" fill="#F8FAFC" />
      <rect x="34" y="108" width="52" height="5" fill="#CBD5E1" />
      {/* antenas que salen del casco */}
      <g className="marci-antena">
        <path d="M48 26 L40 6" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="39" cy="5" r="5" fill="#00D2F3" />
      </g>
      <g className="marci-antena">
        <path d="M72 26 L80 6" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="81" cy="5" r="5" fill="#00D2F3" />
      </g>
      {/* cara de marciano */}
      <ellipse cx="60" cy="50" rx="24" ry="21" fill="#34D399" />
      <ellipse cx="51" cy="49" rx="6.5" ry="8.5" fill="#0B1220" className="marci-ojo" />
      <ellipse cx="69" cy="49" rx="6.5" ry="8.5" fill="#0B1220" className="marci-ojo" />
      <circle cx="53" cy="45.5" r="2.4" fill="#FFFFFF" />
      <circle cx="71" cy="45.5" r="2.4" fill="#FFFFFF" />
      <path d="M53 60 Q60 66 67 60" stroke="#0B1220" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="43" cy="57" r="3" fill="#F9A8D4" opacity="0.7" />
      <circle cx="77" cy="57" r="3" fill="#F9A8D4" opacity="0.7" />
      {/* casco de astronauta */}
      <circle cx="60" cy="50" r="33" fill="rgba(103,232,249,0.16)" stroke="#E2E8F0" strokeWidth="5" />
      <path d="M38 34 Q46 22 60 21" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <rect x="40" y="78" width="40" height="7" rx="3.5" fill="#22D3EE" />
      {/* escudo de tecnoros.ar en el pecho, bien grande para que se reconozca la marca, con los nodos que se prenden */}
      <g transform="translate(42 75) scale(0.36)">
        <path d="M 50 6 L 89 19 C 89 62 80 92 50 110 C 20 92 11 62 11 19 Z" fill="#0B1220" stroke="#00D2F3" strokeWidth="7" strokeLinejoin="round" />
        <g stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <line x1="31" y1="38" x2="69" y2="38" />
          <line x1="50" y1="38" x2="50" y2="78" />
          <path d="M 50 56 L 61 56 L 69 64" />
        </g>
        <circle cx="31" cy="38" r="7" fill="#00D2F3" className="marci-nodo" />
        <circle cx="69" cy="38" r="7" fill="#00D2F3" className="marci-nodo" style={{ animationDelay: '.3s' }} />
        <circle cx="69" cy="64" r="6.5" fill="#00D2F3" className="marci-nodo" style={{ animationDelay: '.6s' }} />
        <circle cx="50" cy="78" r="7" fill="#00D2F3" className="marci-nodo" style={{ animationDelay: '.9s' }} />
      </g>
      {/* brazo que saluda */}
      <g className="marci-brazo">
        <path d="M86 88 Q98 80 100 66" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="62" r="7" fill="#34D399" />
      </g>
    </g>
  </svg>
);
