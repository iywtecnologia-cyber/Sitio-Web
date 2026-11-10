// Corre después de `vite build`. Genera un HTML por ruta (dist/servicios/index.html, etc.)
// para que el servidor responda 200 en cada página. Antes todo caía en 404.html: el contenido
// se veía, pero con código 404, y Google no indexaba nada más que el inicio.
// De paso, cada HTML ya trae su título, descripción y canonical, que Google y las vistas
// previas de WhatsApp leen sin ejecutar el JavaScript.
// Lo que no está acá cae en 404.html (responde 404 y la app muestra "no encontrada").
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { RUTAS, ATAJOS, type Ruta } from '../src/rutas';
import { tituloDe, descripcionDe, urlDe, TITULO_NO_ENCONTRADA } from '../src/data/paginas';

const DIST = join(import.meta.dirname, '..', 'dist');
const base = readFileSync(join(DIST, 'index.html'), 'utf8');

const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Si alguna etiqueta cambia en index.html y el reemplazo no encuentra nada, el build falla:
// mejor eso que publicar todas las páginas con los datos del inicio sin enterarse.
const reemplazar = (html: string, patron: RegExp, nuevo: string) => {
  if (!patron.test(html)) throw new Error(`generar-paginas: no se encontró ${patron} en dist/index.html`);
  return html.replace(patron, nuevo);
};

const conMeta = (html: string, titulo: string, descripcion: string, url: string) => {
  const t = escapar(titulo);
  const d = escapar(descripcion);
  let r = reemplazar(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  r = reemplazar(r, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`);
  r = reemplazar(r, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`);
  r = reemplazar(r, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`);
  r = reemplazar(r, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`);
  r = reemplazar(r, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`);
  r = reemplazar(r, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  r = reemplazar(r, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  return r;
};

const escribir = (camino: string, html: string) => {
  const archivo = join(DIST, camino);
  mkdirSync(dirname(archivo), { recursive: true });
  writeFileSync(archivo, html);
};

const paginaPara = (ruta: Ruta) => conMeta(base, tituloDe(ruta), descripcionDe(ruta), urlDe(ruta));

let total = 0;
for (const ruta of RUTAS) {
  if (ruta === '/') continue;
  escribir(join(ruta, 'index.html'), paginaPara(ruta));
  total++;
}

// Los atajos para QR y redes (/golondrina, /soporte…) también responden 200, con los datos
// y el canonical de la página a la que llevan: la app cambia la dirección al entrar.
for (const [atajo, [destino]] of Object.entries(ATAJOS)) {
  escribir(join(atajo, 'index.html'), paginaPara(destino));
  total++;
}

// 404.html: lo sirve el hosting con código 404 para cualquier otra dirección.
// noindex y sin canonical para que Google no lo confunda con el inicio.
let html404 = conMeta(base, TITULO_NO_ENCONTRADA, 'La página que buscás no existe.', '');
html404 = html404.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '').replace(/\s*<meta property="og:url" content="[^"]*" \/>/, '');
html404 = reemplazar(html404, /<\/title>/, '</title>\n    <meta name="robots" content="noindex" />');
escribir('404.html', html404);

console.log(`generar-paginas: ${total} páginas + 404.html`);
