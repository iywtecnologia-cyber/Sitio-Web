import React from 'react';

interface TecnorosContactIconProps {
  className?: string;
  size?: number;
}

export const TecnorosContactIcon: React.FC<TecnorosContactIconProps> = ({ 
  className = "w-12 h-12", 
  size 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 120 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Contacto TecnoRos.ar"
    >
      {/* Outer Shield with Cyan Border & Transparent interior */}
      <path
        d="M 46 6 L 82 18 C 82 58 74 86 46 102 C 18 86 10 58 10 18 Z"
        fill="#070A12"
        stroke="#00D2F3"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />

      {/* Internal Circuit - Horizontal Top Bar */}
      <line
        x1="28"
        y1="36"
        x2="64"
        y2="36"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Internal Circuit - Vertical Central Stem */}
      <line
        x1="46"
        y1="36"
        x2="46"
        y2="72"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Internal Circuit - Lower Right Branch */}
      <path
        d="M 46 52 L 56 52 L 63 59"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Circuit Nodes (Cyan dots) */}
      <circle cx="28" cy="36" r="5.5" fill="#00D2F3" />
      <circle cx="64" cy="36" r="5.5" fill="#00D2F3" />
      <circle cx="63" cy="59" r="5" fill="#00D2F3" />
      <circle cx="46" cy="72" r="5.5" fill="#00D2F3" />

      {/* Speech Bubble Base (with dark stroke cutout to overlap the shield cleanly) */}
      <g>
        {/* Dark cutout / halo around bubble to detach from shield lines */}
        <path
          d="M 68 64 H 112 C 117.5 64 121 67.5 121 73 V 95 C 121 100.5 117.5 104 112 104 H 82 L 72 116 V 104 H 68 C 62.5 104 59 100.5 59 95 V 73 C 59 67.5 62.5 64 68 64 Z"
          fill="#070A12"
        />

        {/* Cyan Speech Bubble */}
        <path
          d="M 70 66 H 110 C 114.5 66 118 69.5 118 74 V 93 C 118 97.5 114.5 101 110 101 H 83 L 74 112 V 101 H 70 C 65.5 101 62 97.5 62 93 V 74 C 62 69.5 65.5 66 70 66 Z"
          fill="#00D2F3"
        />

        {/* 3 Dark Chat Dots (...) */}
        <circle cx="77" cy="83.5" r="3.5" fill="#0C192C" />
        <circle cx="90" cy="83.5" r="3.5" fill="#0C192C" />
        <circle cx="103" cy="83.5" r="3.5" fill="#0C192C" />
      </g>
    </svg>
  );
};
