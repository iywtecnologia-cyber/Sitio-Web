import React from 'react';

// Fondo con color detrás de toda la web: luces suaves en cian, violeta, verde y azul,
// con una base azul noche (no negra) para que la web no quede tan oscura.
const CAPAS = [
  'radial-gradient(55% 45% at 8% 2%, rgba(0,210,243,0.42), transparent 72%)',
  'radial-gradient(45% 40% at 96% 18%, rgba(167,139,250,0.40), transparent 72%)',
  'radial-gradient(50% 45% at 85% 85%, rgba(56,189,248,0.30), transparent 72%)',
  'radial-gradient(55% 45% at 18% 98%, rgba(16,185,129,0.32), transparent 72%)',
  'radial-gradient(40% 35% at 50% 50%, rgba(99,102,241,0.18), transparent 75%)',
].join(',');

export const FondoColor: React.FC = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 -z-10 pointer-events-none"
    style={{ backgroundColor: '#0B1220', backgroundImage: CAPAS }}
  />
);
