// Videos de demostración: al tocarlos empiezan a reproducirse solos y no se pueden descargar.
import type React from 'react';

/** Props comunes para todos los <video> de demos. */
export const propsVideo = {
  controls: true,
  playsInline: true,
  preload: 'metadata' as const,
  // Sin «Descargar» en el menú del video, sin ventanita flotante y sin menú del clic derecho.
  controlsList: 'nodownload noremoteplayback',
  disablePictureInPicture: true,
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  // Tocar el video lo reproduce (en el celu el toque solo mostraba los controles).
  onClick: (e: React.MouseEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (!v.paused) return;
    window.setTimeout(() => {
      if (v.paused) void v.play().catch(() => {});
    }, 0);
  },
};
