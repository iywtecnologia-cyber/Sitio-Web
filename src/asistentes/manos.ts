// "Las manos" de los asistentes: lo que hacen en la página a la vista de la persona.
// - volarA: el asistente sale volando del chat hasta la parte de la web que te quiere mostrar,
//   se queda señalándola con un globito y después vuelve.
// - tocar: aprieta un botón de la página (con un "toque" visible).
// - escribir: escribe un texto en un campo, letra por letra.
// Todo respeta "reducir movimiento" del sistema: en ese caso aparece sin volar.

const sinMovimiento = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Espera a que aparezca un elemento (las páginas se cargan después de navegar). */
export async function esperar(buscar: string | (() => Element | null), maxMs = 5000): Promise<HTMLElement | null> {
  const fin = Date.now() + maxMs;
  while (Date.now() < fin) {
    const el = typeof buscar === 'string' ? document.querySelector(buscar) : buscar();
    if (el) return el as HTMLElement;
    await pausa(80);
  }
  return null;
}

/** Espera a que la página termine de desplazarse (scroll suave). */
async function quieto(maxMs = 1500) {
  let ultimo = -1;
  const fin = Date.now() + maxMs;
  while (Date.now() < fin) {
    if (Math.abs(window.scrollY - ultimo) < 1) return;
    ultimo = window.scrollY;
    await pausa(120);
  }
}

interface Personaje {
  emoji: string;
  /** Foto del personaje 3D (si está, se usa en vez del emoji). */
  imagen?: string;
  /** Clases del degradé del avatar (ej. 'from-cyan-400 to-sky-500'). */
  degrade: string;
}

let vuelo: HTMLElement | null = null;

/** Origen del vuelo: el panel del asistente abierto (o la esquina de abajo a la izquierda). */
const origen = () => {
  const panel = document.querySelector('[data-panel-asistente]')?.getBoundingClientRect();
  return panel ? { x: panel.left + 40, y: panel.top + 30 } : { x: 40, y: window.innerHeight - 60 };
};

export async function volarA(destino: string | HTMLElement, quien: Personaje, texto: string) {
  const el = typeof destino === 'string' ? await esperar(`#${CSS.escape(destino)}`) : destino;
  if (!el) return;
  await quieto();
  vuelo?.remove();

  const r = el.getBoundingClientRect();
  // Se posa en el borde superior derecho de lo que señala, sin salirse de la pantalla.
  const x = Math.min(Math.max(r.right - 28, 30), window.innerWidth - 30);
  const y = Math.min(Math.max(r.top + 8, 70), window.innerHeight - 90);
  const o = origen();

  const nodo = document.createElement('div');
  nodo.setAttribute('aria-hidden', 'true');
  nodo.style.cssText = `position:fixed;left:0;top:0;z-index:90;pointer-events:none;transform:translate(${x}px,${y}px)`;
  nodo.innerHTML = `
    <div class="relative -translate-x-1/2 -translate-y-1/2">
      <span class="asistente-volador flex w-12 h-12 items-center justify-center text-4xl drop-shadow-[0_6px_8px_rgba(0,0,0,.5)]">${quien.imagen ? `<img src="${quien.imagen}" alt="" class="w-14 h-14 object-contain" />` : quien.emoji}</span>
      <span class="asistente-globo absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-xl">${texto.replace(/</g, '&lt;')}</span>
    </div>`;
  document.body.appendChild(nodo);
  vuelo = nodo;
  window.dispatchEvent(new CustomEvent('asistente-vuela', { detail: true }));

  // El elemento señalado se ilumina mientras el asistente está ahí.
  el.classList.add('asistente-senalado');

  if (!sinMovimiento()) {
    nodo.animate(
      [
        { transform: `translate(${o.x}px,${o.y}px) scale(.6) rotate(-12deg)`, opacity: 0.2 },
        { transform: `translate(${(o.x + x) / 2}px,${Math.min(o.y, y) - 80}px) scale(1.1) rotate(8deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x}px,${y}px) scale(1) rotate(0deg)`, opacity: 1 },
      ],
      { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' },
    );
  }
  await pausa(3600);
  if (vuelo !== nodo) return;
  if (!sinMovimiento()) await nodo.animate([{ opacity: 1, transform: `translate(${x}px,${y}px)` }, { opacity: 0, transform: `translate(${o.x}px,${o.y}px) scale(.5)` }], { duration: 600, easing: 'ease-in' }).finished.catch(() => {});
  nodo.remove();
  el.classList.remove('asistente-senalado');
  if (vuelo === nodo) vuelo = null;
  window.dispatchEvent(new CustomEvent('asistente-vuela', { detail: false }));
}

/** Toca un botón de la página, con un círculo que se ve. */
export async function tocar(el: HTMLElement | null) {
  if (!el) return false;
  el.scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth', block: 'center' });
  await quieto();
  const r = el.getBoundingClientRect();
  const toque = document.createElement('span');
  toque.setAttribute('aria-hidden', 'true');
  toque.className = 'asistente-toque';
  toque.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px`;
  document.body.appendChild(toque);
  await pausa(350);
  el.click();
  setTimeout(() => toque.remove(), 700);
  return true;
}

/** Escribe en un campo (también en los controlados por React), letra por letra. */
export async function escribir(campo: HTMLInputElement | HTMLTextAreaElement | null, texto: string) {
  if (!campo) return false;
  campo.scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth', block: 'center' });
  await quieto();
  campo.focus();
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(campo), 'value')?.set;
  const poner = (v: string) => {
    setter?.call(campo, v);
    campo.dispatchEvent(new Event('input', { bubbles: true }));
  };
  if (sinMovimiento()) {
    poner(texto);
    return true;
  }
  let actual = '';
  for (const letra of texto) {
    actual += letra;
    poner(actual);
    await pausa(letra === ' ' ? 35 : 22);
  }
  return true;
}
