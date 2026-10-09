import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, Lock, MonitorDown, ShieldCheck, Workflow } from 'lucide-react';

/**
 * Documentación funcional de SentinelOps (software propio de ciberseguridad).
 * Resumida en lenguaje simple a partir de la guía de ayuda y el README del
 * repositorio del producto. Si el producto cambia, actualizar estos textos.
 */

const OPEN_EVENT = 'abrir-docs-sentinelops';

// Abre la documentación y la lleva a la vista (lo usa la tarjeta de Productos).
export const openSentinelOpsDocs = () => {
  window.dispatchEvent(new Event(OPEN_EVENT));
  document.getElementById('sentinelops')?.scrollIntoView({ behavior: 'smooth' });
};

const PASOS = [
  { t: 'Registrá tus activos', d: 'Cargás los equipos, servidores o páginas web que querés vigilar.' },
  { t: 'Lanzá un escaneo', d: 'Con un botón, SentinelOps busca fallos de seguridad automáticamente.' },
  { t: 'Revisá las vulnerabilidades', d: 'Cada fallo aparece con su gravedad y los pasos concretos para solucionarlo.' },
  { t: 'Dejá que SIEM y SOAR trabajen', d: 'La plataforma analiza la actividad y puede responder sola, por ejemplo bloqueando una IP sospechosa.' },
  { t: 'Seguí los casos', d: 'Lo que necesita atención humana se convierte en un caso, que seguís hasta cerrarlo.' },
];

interface Modulo {
  nombre: string;
  resumen: string;
  detalle: string[];
}

const GRUPOS: { titulo: string; icon: React.ElementType; modulos: Modulo[] }[] = [
  {
    titulo: 'Detectar',
    icon: ShieldCheck,
    modulos: [
      {
        nombre: 'Dashboard',
        resumen: 'Vista general del estado de seguridad.',
        detalle: ['Muestra de un vistazo cómo está la seguridad de tu organización: activos, hallazgos, alertas y casos.'],
      },
      {
        nombre: 'Activos',
        resumen: 'Los equipos que estás vigilando.',
        detalle: [
          'Un activo es cualquier equipo, servidor o dispositivo de tu red: una notebook, un servidor de archivos, una página web.',
          'Se carga con su nombre o su IP, el sistema operativo, el entorno (producción, pruebas, desarrollo), qué tan crítico es y quién es el responsable.',
          'Cada activo tiene un botón para lanzar un escaneo de detección de fallos sin configurar nada más.',
        ],
      },
      {
        nombre: 'Escaneos',
        resumen: 'Búsqueda automática de fallos de seguridad.',
        detalle: [
          'Escaneos inmediatos o programados (diarios o semanales) que se ejecutan solos.',
          'Distintos tipos según lo que quieras revisar: contenedores e imágenes, vulnerabilidades web, análisis de páginas web, código fuente, claves olvidadas en repositorios, archivos sospechosos y vigilancia de red y del sistema durante un tiempo que elegís.',
          'Agentes remotos: se instalan dentro de una red interna (por ejemplo, la de tu oficina) para revisarla desde adentro.',
          'Historial completo con el estado de cada escaneo. Siempre en modo detección: nunca ataca ni explota fallos.',
        ],
      },
      {
        nombre: 'Imágenes y paquetes',
        resumen: 'Inventario de todo el software instalado.',
        detalle: ['Lista todos los paquetes detectados en contenedores y sistemas escaneados, no solo los que tienen una vulnerabilidad conocida.'],
      },
      {
        nombre: 'Superficie externa',
        resumen: 'Lo que tu empresa expone en internet.',
        detalle: ['Monitoreo pasivo de dominios, subdominios y certificados SSL, para detectar a tiempo algo expuesto o por vencer.'],
      },
      {
        nombre: 'Integraciones Cloud',
        resumen: 'Revisión de cuentas de AWS.',
        detalle: ['Inventario automático de recursos de AWS (servidores, almacenamiento, reglas de red) y detección de configuraciones peligrosas.'],
      },
      {
        nombre: 'Código y repositorios',
        resumen: 'Revisión periódica del código.',
        detalle: ['Detecta contraseñas o claves que quedaron guardadas por error en el código y dependencias con vulnerabilidades conocidas.'],
      },
    ],
  },
  {
    titulo: 'Responder',
    icon: Workflow,
    modulos: [
      {
        nombre: 'Vulnerabilidades',
        resumen: 'Los fallos encontrados y cómo solucionarlos.',
        detalle: [
          'Cada fallo aparece con su gravedad (crítica, alta, media o baja) y un plan de acción concreto: actualizar un programa, cerrar un puerto, revisar un aviso oficial.',
          'Prioriza primero lo que se está explotando activamente en el mundo, combinando indicadores reconocidos (CVSS, EPSS y el catálogo CISA KEV).',
          'Cada fallo se puede marcar como confirmado, falso positivo, riesgo aceptado o remediado, con una nota que explique la decisión.',
        ],
      },
      {
        nombre: 'SIEM',
        resumen: 'Toda la actividad de tus sistemas, en un solo lugar.',
        detalle: [
          'Junta la actividad de tus equipos y los resultados de los escaneos, y la compara con reglas de detección.',
          'Trae reglas recomendadas listas para usar, y permite crear reglas propias con botones, sin escribir código.',
          'Genera alertas cuando pasa algo que merece atención, como un fallo crítico o intentos repetidos de entrar a una cuenta de administrador.',
        ],
      },
      {
        nombre: 'SOAR',
        resumen: 'Respuestas automáticas ante un incidente.',
        detalle: [
          'Ejecuta "playbooks": pasos automáticos como bloquear una IP sospechosa, aislar un equipo comprometido o abrir un caso.',
          'Por seguridad, las acciones arrancan en modo simulación y solo actúan sobre sistemas reales cuando se habilitan a propósito.',
        ],
      },
      {
        nombre: 'Casos',
        resumen: 'Seguimiento de incidentes de principio a fin.',
        detalle: [
          'Agrupa todo lo relacionado con un incidente que necesita una persona: estado, responsable, notas y línea de tiempo.',
          'Tiene plazos de atención (SLA) según la prioridad y se actualiza solo cuando SIEM o SOAR encuentran algo nuevo.',
        ],
      },
      {
        nombre: 'Purple Team',
        resumen: 'Poner a prueba tus defensas.',
        detalle: [
          'Compara las técnicas de ataque más comunes (catálogo MITRE ATT&CK) contra lo que tus defensas detectan, y muestra las brechas sin cobertura.',
          'Es un análisis sobre datos declarados: no ejecuta ataques reales.',
        ],
      },
      {
        nombre: 'Reportes',
        resumen: 'Resúmenes para compartir.',
        detalle: ['Junta escaneos, vulnerabilidades, casos y demás en un documento descargable en PDF o CSV, ideal para quien no usa la plataforma todos los días. Se pueden programar.'],
      },
      {
        nombre: 'Notificaciones',
        resumen: 'Cómo te avisa SentinelOps.',
        detalle: ['Avisos por email, Slack o webhook, con envío de prueba e historial de todo lo enviado.'],
      },
      {
        nombre: 'Integraciones',
        resumen: 'Conexión con tus herramientas reales.',
        detalle: ['Conecta las acciones automáticas con tus sistemas, por ejemplo tu firewall, tu antivirus corporativo (EDR) o tu herramienta de tickets. Mientras no se configuran, esas acciones quedan simuladas.'],
      },
      {
        nombre: 'Organizaciones y pagos',
        resumen: 'Solo para administradores.',
        detalle: ['Datos de la organización, usuarios que pueden entrar, varias organizaciones separadas entre sí y estado de la suscripción.'],
      },
    ],
  },
];

const SEGURIDAD = [
  'Ingreso con email y contraseña, Google o SSO, con verificación en dos pasos (MFA).',
  'Permisos por rol: cada usuario ve y hace solo lo que le corresponde.',
  'Cada organización tiene sus datos separados de las demás.',
  'Las acciones automáticas arrancan en modo simulación hasta que se habilitan.',
  'Es 100% defensivo: detecta y responde, nunca ataca ni explota fallos.',
];

export const SentinelOpsDocs: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    if (window.location.hash === '#sentinelops') setOpen(true);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  return (
    <section id="sentinelops" className="py-14 sm:py-16 bg-[#090D18] border-t border-slate-800/50 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documentación funcional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Cómo funciona <span className="text-cyan-300">SentinelOps</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            SentinelOps es una plataforma de ciberseguridad <strong className="text-white">defensiva</strong>: te ayuda a vigilar tus equipos, encontrar fallos de seguridad y responder ante incidentes. Está pensada para empresas que necesitan cuidar su información sin tener un equipo técnico grande: todo se hace con botones y formularios, sin escribir código.
          </p>
        </div>

        {/* Cómo se usa */}
        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PASOS.map((p, i) => (
            <li key={p.t} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-mono text-cyan-400">Paso {i + 1}</div>
              <div className="mt-1 font-semibold text-white">{p.t}</div>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">{p.d}</p>
            </li>
          ))}
        </ol>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="sentinelops-detalle"
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-200 font-semibold text-sm transition-colors"
        >
          {open ? 'Ocultar documentación completa' : 'Ver documentación completa'}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div id="sentinelops-detalle" className="mt-8 space-y-10">
            {GRUPOS.map(({ titulo, icon: Icon, modulos }) => (
              <div key={titulo}>
                <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-white mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                  {titulo}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                  {modulos.map((m) => (
                    <details key={m.nombre} className="group rounded-xl bg-slate-900/70 border border-slate-800 open:border-cyan-500/40">
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4">
                        <span>
                          <span className="block font-semibold text-white">{m.nombre}</span>
                          <span className="block text-sm text-slate-400">{m.resumen}</span>
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="px-4 pb-4 space-y-2">
                        {m.detalle.map((d) => (
                          <li key={d} className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-500/30">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Seguridad de la plataforma
                </h3>
                <ul className="space-y-2">
                  {SEGURIDAD.map((s) => (
                    <li key={s} className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-500/30">{s}</li>
                  ))}
                </ul>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
                  <MonitorDown className="w-5 h-5 text-cyan-400" />
                  Instalación
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-500/30">
                    En Windows se inicia con doble clic, sin usar la línea de comandos (requiere Docker Desktop instalado).
                  </li>
                  <li className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-500/30">
                    También se puede instalar en servidores propios o en la nube, según el tamaño de la empresa.
                  </li>
                  <li className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-500/30">
                    Incluye una guía de ayuda dentro de la plataforma que explica cada sección paso a paso.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
