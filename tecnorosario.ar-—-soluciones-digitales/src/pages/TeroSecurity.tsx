import React, { useEffect } from 'react';
import {
  ShieldCheck, Server, Radar, Bug, Activity, Zap, ClipboardList, Target, FileBarChart, Bell, Plug,
  Globe, Cloud, GitBranch, Users, KeyRound, Download, MessageCircle, PlayCircle, ArrowLeft, CheckCircle2,
  Lock, Building2, MonitorCog, HelpCircle,
} from 'lucide-react';
import { TecnorosLogo } from '../components/TecnorosLogo';
import { whatsappLink, CONTACT_EMAIL } from '../data/contact';

// Demo interactiva (un solo archivo HTML) que corre en el navegador, con datos ficticios de Grupo Delta.
// Si se vacía, los botones vuelven a pedir la demo por WhatsApp.
export const TERO_DEMO_URL = '/tero-demo/index.html';
// El precio no se publica (se decidió "a consultar"). Si algún día se quiere mostrar, cambiar acá.
const PRECIO = 'Abono mensual';
const PERIODO = 'por empresa · precio a consultar';

const PDF = '/tero/TERO-Security-documentacion-funcional.pdf';

const MODULOS = [
  { icon: Server, t: 'Inventario de activos', d: 'Servidores, computadoras y equipos con su criticidad y responsable. Desde cada uno se lanza un escaneo.' },
  { icon: Radar, t: 'Escaneos de detección', d: 'Trivy, Nuclei, ZAP, Semgrep, Gitleaks, YARA, Zeek y Falco. Buscan fallas sin atacar ni dañar nada. Programables.' },
  { icon: Bug, t: 'Vulnerabilidades priorizadas', d: 'Ordenadas por riesgo real (CVSS, probabilidad de explotación EPSS y catálogo CISA KEV), con los pasos para corregirlas.' },
  { icon: Activity, t: 'SIEM', d: 'Recibe los registros de tus equipos, aplica reglas de detección y genera alertas en el momento.' },
  { icon: Zap, t: 'Respuesta automática (SOAR)', d: 'Bloquea la IP atacante, aísla el equipo, abre un caso y avisa. Arranca en modo simulación.' },
  { icon: ClipboardList, t: 'Casos e incidentes', d: 'Cada incidente con responsable, prioridad, tiempo máximo de atención (SLA) y línea de tiempo.' },
  { icon: Target, t: 'Cobertura MITRE ATT&CK', d: 'Mide qué técnicas de ataque podés detectar y dónde tenés puntos ciegos.' },
  { icon: Globe, t: 'Superficie externa', d: 'Vigila tus dominios, subdominios y certificados publicados en internet.' },
  { icon: Cloud, t: 'Nube (AWS)', d: 'Detecta configuraciones peligrosas con permisos de solo lectura: nunca modifica nada.' },
  { icon: GitBranch, t: 'Código y repositorios', d: 'Encuentra contraseñas y claves olvidadas en el código, y dependencias vulnerables.' },
  { icon: FileBarChart, t: 'Reportes', d: 'Resumen ejecutivo, vulnerabilidades, incidentes y cobertura, en PDF o CSV, también por email programado.' },
  { icon: Bell, t: 'Notificaciones', d: 'Avisos por email y Slack, con historial de envíos.' },
  { icon: Plug, t: 'Integraciones', d: 'Firewall, EDR y mesa de ayuda para contener y abrir tickets.' },
  { icon: Users, t: 'Usuarios y roles', d: 'Administrador, responsable del SOC, analista y lector (solo lectura).' },
  { icon: KeyRound, t: 'Acceso seguro', d: 'Doble factor (MFA), ingreso con Google o SSO empresarial (Entra ID, Okta, Keycloak y cualquier OIDC).' },
];

const PASOS = [
  ['Registrás tus activos', 'Cargás servidores y computadoras con su importancia para el negocio.'],
  ['TERO busca fallas', 'Escaneos manuales o programados, sin dañar los equipos.'],
  ['Prioriza por riesgo real', 'Primero lo que más probablemente te ataquen, con cómo solucionarlo.'],
  ['Detecta ataques', 'El SIEM revisa los registros y genera alertas al instante.'],
  ['Responde solo', 'Un playbook bloquea, aísla, abre un caso y avisa (simulado hasta que lo habilités).'],
  ['Te rinde cuentas', 'Reportes claros para la gerencia y medición de brechas de detección.'],
];

const CAPTURAS = [
  ['dashboard', 'Panel general con el estado de seguridad'],
  ['vulnerabilidades', 'Vulnerabilidades ordenadas por riesgo real'],
  ['siem', 'Alertas del SIEM con inteligencia de amenazas'],
  ['soar', 'Playbooks de respuesta automática'],
  ['casos', 'Caso con responsable, SLA y línea de tiempo'],
  ['purple', 'Cobertura de técnicas MITRE ATT&CK'],
];

const SEGURIDAD = [
  'Solo defensa: no incluye herramientas de ataque ni explota fallas.',
  'Modo simulación por defecto: nada real se toca hasta que lo habilitás.',
  'Cada empresa ve solo sus datos (aislamiento multi-empresa).',
  'Protección contra pedidos a la red interna (SSRF) en escaneos e integraciones.',
  'Claves cifradas, sesiones cortas, doble factor y registro de auditoría.',
  'Verificado en octubre de 2026: 820 pruebas automáticas, 50 pruebas de punta a punta y las 20 pantallas sin errores.',
];

const FAQ = [
  ['¿TERO ataca o puede dañar mis equipos?', 'No. Es una plataforma defensiva: los escaneos buscan fallas sin explotarlas y las acciones de contención arrancan en modo simulación.'],
  ['¿Dónde quedan mis datos?', 'En tu propio servidor. TERO se instala en tu red (on-premise) con Docker; solo valida la licencia contra nuestro servidor.'],
  ['¿Necesito un equipo de seguridad?', 'No. Está en español, trae una guía paso a paso y te acompañamos en la instalación y la puesta en marcha.'],
  ['¿Qué necesito para instalarlo?', 'Una PC o servidor con Docker, 16 GB de RAM, 4 núcleos y 30 GB libres. En Windows se inicia con doble clic.'],
  ['¿Cómo se paga?', 'Con un abono mensual por empresa, por PayPal. Consultanos el precio por WhatsApp. Si se deja de pagar, el sistema se bloquea hasta regularizar.'],
  ['¿Lo puedo probar antes?', 'Sí. La demo online es el sistema real con los datos de una empresa ficticia: podés recorrer todas las pantallas sin registrarte. Y si querés, te lo mostramos funcionando con tu empresa.'],
];

const Btn: React.FC<{ href: string; children: React.ReactNode; primary?: boolean; download?: boolean }> = ({ href, children, primary, download }) => (
  <a
    href={href}
    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    {...(download ? { download: '' } : {})}
    className={
      'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ' +
      (primary
        ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 shadow-lg shadow-cyan-500/20'
        : 'border border-slate-700 bg-slate-900/60 hover:border-cyan-400/60 text-slate-100')
    }
  >
    {children}
  </a>
);

const Titulo: React.FC<{ k: string; t: string; s?: string }> = ({ k, t, s }) => (
  <div className="max-w-3xl mb-8">
    <div className="text-xs font-mono tracking-widest text-cyan-300 uppercase mb-2">{k}</div>
    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t}</h2>
    {s && <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">{s}</p>}
  </div>
);

export const TeroSecurity: React.FC = () => {
  useEffect(() => {
    document.title = 'TERO Security — Ciberseguridad para empresas | tecnoros.ar';
  }, []);
  const pedirDemo = whatsappLink('Hola tecnoros.ar, quiero ver la demo de TERO Security');
  const contratar = whatsappLink('Hola tecnoros.ar, quiero contratar TERO Security para mi empresa');

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-cyan-500/20">
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-[#070A12]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <TecnorosLogo className="w-7 h-7" />
            <span className="font-bold">tecnoros<span className="text-cyan-400">.ar</span></span>
          </a>
          <a href={pedirDemo} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 text-sm font-bold hover:bg-cyan-300">
            Pedí tu demo
          </a>
        </div>
      </header>

      <main>
        {/* Portada */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center relative">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                TERO <span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">Security</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-slate-300 leading-relaxed">
                La plataforma de ciberseguridad que vigila tu empresa todos los días: encuentra fallas, detecta ataques, responde sola y te lo explica en reportes claros.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Btn href={TERO_DEMO_URL || pedirDemo} primary><PlayCircle className="w-4 h-4" /> {TERO_DEMO_URL ? 'Comprar demo' : 'Pedí acceso a la demo'}</Btn>
                <Btn href={PDF} download><Download className="w-4 h-4" /> Documentación funcional (PDF)</Btn>
              </div>
              <p className="mt-4 text-sm text-slate-400">Hecho en Rosario por tecnoros.ar · Se instala en tu propio servidor.</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-500/10 bg-black">
              <video controls preload="metadata" poster="/tero/tero-security-demo.jpg" className="w-full aspect-video">
                <source src="/tero/tero-security-demo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section className="py-14 sm:py-16 border-t border-slate-800/50" id="modulos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Titulo k="Qué hace" t="Todo lo que tu empresa necesita para cuidarse, en un solo lugar" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULOS.map(({ icon: I, t, d }) => (
                <div key={t} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                  <I className="w-6 h-6 text-cyan-400" />
                  <h3 className="mt-3 font-bold text-white">{t}</h3>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-14 sm:py-16 border-t border-slate-800/50 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Titulo k="Cómo funciona" t="De la falla al reporte, sin perder nada en el camino" />
            <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PASOS.map(([t, d], i) => (
                <li key={t} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/40 text-cyan-300 font-bold flex items-center justify-center">{i + 1}</div>
                  <h3 className="mt-3 font-bold text-white">{t}</h3>
                  <p className="mt-1 text-sm text-slate-300">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Capturas */}
        <section className="py-14 sm:py-16 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Titulo k="Así se ve" t="Pantallas reales del sistema" s="Con datos de demostración de una empresa ficticia." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAPTURAS.map(([f, c]) => (
                <figure key={f} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <a href={`/tero/${f}.jpg`} target="_blank" rel="noopener noreferrer">
                    <img src={`/tero/${f}.jpg`} alt={c} loading="lazy" className="w-full aspect-[16/10] object-cover object-top hover:opacity-90" />
                  </a>
                  <figcaption className="px-4 py-3 text-sm text-slate-300">{c}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Seguridad e instalación */}
        <section className="py-14 sm:py-16 border-t border-slate-800/50 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
            <div>
              <Titulo k="Seguro por diseño" t="Pensado para no romper nada" />
              <ul className="space-y-3">
                {SEGURIDAD.map((s) => (
                  <li key={s} className="flex gap-3 text-slate-200"><Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span>{s}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <Titulo k="Instalación" t="En tu servidor, con acompañamiento" />
              <ul className="space-y-3 text-slate-200">
                <li className="flex gap-3"><MonitorCog className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span>Se instala con Docker en Windows, Mac o Linux. En Windows arranca con doble clic, sin línea de comandos.</span></li>
                <li className="flex gap-3"><Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span>Requisitos recomendados: 16 GB de RAM, 4 núcleos y 30 GB libres.</span></li>
                <li className="flex gap-3"><Radar className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span>Agentes para escanear la red de la oficina (LAN) y equipos en internet (WAN), sin abrir puertos de entrada.</span></li>
                <li className="flex gap-3"><Building2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span>Varias empresas en una misma instalación, cada una con sus datos aislados.</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="py-14 sm:py-16 border-t border-slate-800/50" id="contratar">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Titulo k="Plan" t="Un abono simple, todo incluido" />
            <div className="p-8 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 to-slate-950 text-left">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">{PRECIO}</span>
                <span className="text-slate-300">{PERIODO}</span>
              </div>
              <ul className="mt-5 space-y-2 text-slate-200">
                {['Todos los módulos', 'Usuarios ilimitados dentro de tu empresa', 'Instalación asistida y puesta en marcha', 'Soporte por WhatsApp', 'Pago mensual por PayPal, cancelás cuando quieras'].map((x) => (
                  <li key={x} className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />{x}</li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Btn href={contratar} primary><MessageCircle className="w-4 h-4" /> Consultar precio y contratar</Btn>
                <Btn href={TERO_DEMO_URL || pedirDemo}><PlayCircle className="w-4 h-4" /> Primero quiero verlo</Btn>
              </div>
            </div>
          </div>
        </section>

        {/* Preguntas */}
        <section className="py-14 sm:py-16 border-t border-slate-800/50 bg-slate-950/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Titulo k="Preguntas frecuentes" t="Lo que más nos preguntan" />
            <div className="space-y-3">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group p-5 rounded-xl border border-slate-800 bg-slate-900/50">
                  <summary className="cursor-pointer list-none flex items-center gap-3 font-semibold text-white">
                    <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />{q}
                  </summary>
                  <p className="mt-3 text-slate-300 pl-8">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 justify-between text-sm text-slate-400">
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> TERO Security es un producto de tecnoros.ar · Rosario, Argentina · {CONTACT_EMAIL}</span>
          <span>Voz del video: Piper (OpenSLR 61, CC BY-SA 4.0)</span>
        </div>
      </footer>
    </div>
  );
};
