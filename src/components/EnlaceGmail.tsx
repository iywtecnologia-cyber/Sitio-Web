import React from 'react';

// Respaldo del mailto: para quien no tiene programa de correo configurado y usa Gmail en el navegador.
export const EnlaceGmail: React.FC<{ href: string; className?: string; texto?: string }> = ({
  href,
  className = '',
  texto = '¿Usás Gmail en el navegador? Abrilo ahí',
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block py-1 text-xs text-slate-400 hover:text-cyan-300 underline underline-offset-4 ${className}`}
  >
    {texto}
  </a>
);
