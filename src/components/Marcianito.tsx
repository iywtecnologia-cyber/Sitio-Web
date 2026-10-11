import React from 'react';

// Mascota de tecnoros.ar: un marcianito que saluda. Dibujo propio en SVG.
// `saludando` mueve el brazo; respeta "reducir movimiento" del sistema.
export const Marcianito: React.FC<{ className?: string; saludando?: boolean }> = ({ className, saludando = true }) => (
  <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Marcianito de tecnoros.ar saludando">
    <style>{`
      @keyframes marci-saludo { 0%,100% { transform: rotate(0deg); } 20% { transform: rotate(-28deg); } 40% { transform: rotate(8deg); } 60% { transform: rotate(-24deg); } 80% { transform: rotate(6deg); } }
      @keyframes marci-flota { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      @keyframes marci-parpadeo { 0%,92%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
      .marci-brazo { transform-origin: 86px 74px; }
      .marci-saluda .marci-brazo { animation: marci-saludo 1.6s ease-in-out infinite; }
      .marci-cuerpo { animation: marci-flota 3s ease-in-out infinite; }
      .marci-ojo { transform-box: fill-box; transform-origin: center; animation: marci-parpadeo 4s infinite; }
      @media (prefers-reduced-motion: reduce) { .marci-brazo, .marci-cuerpo, .marci-ojo { animation: none !important; } }
    `}</style>
    <g className={saludando ? 'marci-saluda' : ''}>
      <g className="marci-cuerpo">
        {/* antenas */}
        <path d="M46 26 L38 10" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M74 26 L82 10" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="37" cy="8" r="5" fill="#A78BFA" />
        <circle cx="83" cy="8" r="5" fill="#A78BFA" />
        {/* brazo izquierdo */}
        <path d="M34 74 Q24 82 26 94" stroke="#34D399" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* cuerpo */}
        <path d="M38 70 Q60 62 82 70 L86 104 Q60 112 34 104 Z" fill="#10B981" />
        <rect x="50" y="80" width="20" height="12" rx="3" fill="#0B1220" />
        <circle cx="55" cy="86" r="2" fill="#22D3EE" />
        <circle cx="65" cy="86" r="2" fill="#A78BFA" />
        {/* cabeza */}
        <ellipse cx="60" cy="44" rx="30" ry="26" fill="#34D399" />
        <ellipse cx="48" cy="44" rx="8" ry="10" fill="#0B1220" className="marci-ojo" />
        <ellipse cx="72" cy="44" rx="8" ry="10" fill="#0B1220" className="marci-ojo" />
        <circle cx="50" cy="40" r="3" fill="#FFFFFF" />
        <circle cx="74" cy="40" r="3" fill="#FFFFFF" />
        <path d="M50 58 Q60 66 70 58" stroke="#0B1220" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="40" cy="54" r="3.5" fill="#F9A8D4" opacity="0.7" />
        <circle cx="80" cy="54" r="3.5" fill="#F9A8D4" opacity="0.7" />
      </g>
      {/* brazo que saluda */}
      <g className="marci-brazo">
        <path d="M86 74 Q98 66 100 52" stroke="#34D399" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="48" r="7" fill="#34D399" />
      </g>
    </g>
  </svg>
);
