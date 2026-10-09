import React from 'react';

interface TecnorosLogoProps {
  className?: string;
  size?: number;
  circuitColor?: string;
}

export const TecnorosLogo: React.FC<TecnorosLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  circuitColor = "#FFFFFF"
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Logo TecnoRos.ar"
    >
      {/* Outer Shield with Cyan Border & TRANSPARENT Background */}
      <path
        d="M 50 6 L 89 19 C 89 62 80 92 50 110 C 20 92 11 62 11 19 Z"
        fill="none"
        stroke="#00D2F3"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* Internal Circuit - Horizontal Top Bar */}
      <line
        x1="31"
        y1="38"
        x2="69"
        y2="38"
        stroke={circuitColor}
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Internal Circuit - Vertical Central Stem */}
      <line
        x1="50"
        y1="38"
        x2="50"
        y2="78"
        stroke={circuitColor}
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Internal Circuit - Lower Right Branch */}
      <path
        d="M 50 56 L 61 56 L 69 64"
        stroke={circuitColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Circuit Nodes (Cyan dots) */}
      {/* Top Left Node */}
      <circle cx="31" cy="38" r="6" fill="#00D2F3" />
      
      {/* Top Right Node */}
      <circle cx="69" cy="38" r="6" fill="#00D2F3" />
      
      {/* Branch Node (Lower Right) */}
      <circle cx="69" cy="64" r="5.5" fill="#00D2F3" />
      
      {/* Bottom Central Node */}
      <circle cx="50" cy="78" r="6" fill="#00D2F3" />
    </svg>
  );
};
