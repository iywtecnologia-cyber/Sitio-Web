import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // Dos páginas: la web y la vista previa de la fábrica de sistemas (se abre en un iframe en /crear).
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, 'index.html'),
          vista: path.resolve(import.meta.dirname, 'vista-sistema.html'),
        },
      },
    },
    resolve: {
      alias: {
        // import.meta.dirname y no __dirname: Vite avisa que __dirname deja de andar con su cargador nativo.
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // El asistente con IA corre en un servidor aparte (npm run server); en desarrollo Vite le pasa /api.
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
  };
});
