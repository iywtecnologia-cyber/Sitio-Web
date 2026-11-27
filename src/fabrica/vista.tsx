// Vista previa viva: corre dentro de un iframe de /crear. Recibe la spec por postMessage,
// la dibuja con el motor y monta Golondrina con acciones armadas a partir de la spec.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Motor, ordenar } from './Motor';
import { nuevoDe, slug, validar, type Spec } from './spec';
import { Golondrina, type Accion } from './golondrina/index';

let asistente: Golondrina | null = null;
let appActual = '';

/** Acciones de Golondrina a partir de la spec: ver cada pantalla, crear y buscar en cada entidad. */
function accionesDe(spec: Spec): Accion[] {
  const a: Accion[] = [];
  for (const p of spec.pantallas) {
    a.push({ id: `ver-${p.id}`, titulo: `Ver ${p.titulo.toLowerCase()}`, frases: [`ver ${p.titulo}`, `ir a ${p.titulo}`, `mostrame ${p.titulo}`], ejecutar: () => { ordenar({ tipo: 'ir', pantalla: p.id }); return `Listo, te muestro ${p.titulo.toLowerCase()}.`; } });
  }
  for (const en of spec.entidades) {
    const n = en.nombre.toLowerCase();
    a.push({ id: `nuevo-${en.id}`, titulo: nuevoDe(en.nombre), descripcion: `cargar ${n}`, frases: [nuevoDe(en.nombre).toLowerCase(), `nuevo ${n}`, `cargar ${n}`, `agregar ${n}`, `anotar ${n}`], ejecutar: () => { ordenar({ tipo: 'nuevo', entidad: en.id }); return `Te abrí el formulario de ${n}.`; } });
    a.push({
      id: `buscar-${en.id}`, titulo: `Buscar «{consulta}» en ${en.plural.toLowerCase()}`, descripcion: `buscar en ${en.plural.toLowerCase()}`,
      frases: [`buscar {consulta} en ${en.plural}`, `buscar ${n} {consulta}`, `buscá el ${n} {consulta}`],
      parametros: [{ nombre: 'consulta', libre: true, requerido: true, pregunta: '¿Qué busco?' }],
      ejecutar: ({ consulta }) => { ordenar({ tipo: 'buscar', entidad: en.id, texto: consulta }); return `Busqué «${consulta}» en ${en.plural.toLowerCase()}.`; },
    });
  }
  return a;
}

function montarAsistente(spec: Spec) {
  const app = `fabrica-${slug(spec.negocio.nombre)}`;
  if (!asistente || appActual !== app) {
    asistente?.destruir();
    appActual = app;
    asistente = new Golondrina({ app, acciones: accionesDe(spec), colorPrimario: spec.marca.colorPrimario, saludo: spec.golondrina.saludo });
    asistente.montar();
  } else asistente.definirAcciones(accionesDe(spec));
}

const Vista: React.FC = () => {
  const [spec, setSpec] = useState<Spec | null>(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('fabrica-spec') ?? 'null');
      return s && !validar(s).length ? s : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const oir = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.tipo !== 'fabrica:spec') return;
      const s = e.data.spec as Spec;
      if (validar(s).length) return;
      try { sessionStorage.setItem('fabrica-spec', JSON.stringify(s)); } catch { /* sin almacenamiento */ }
      setSpec(s);
    };
    window.addEventListener('message', oir);
    window.parent?.postMessage({ tipo: 'fabrica:lista' }, window.location.origin);
    return () => window.removeEventListener('message', oir);
  }, []);
  useEffect(() => {
    if (spec) montarAsistente(spec);
  }, [spec]);
  if (!spec) return <p style={{ fontFamily: 'system-ui', padding: 24, color: '#64748b' }}>Preparando la vista previa…</p>;
  return <Motor spec={spec} />;
};

createRoot(document.getElementById('vista')!).render(<Vista />);
