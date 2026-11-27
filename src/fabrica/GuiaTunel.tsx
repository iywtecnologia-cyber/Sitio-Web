// Guía para mostrar un sistema que corre en la propia compu con Cloudflare Tunnel (túnel rápido).
import React, { useState } from 'react';
import { Check, Copy, Globe } from 'lucide-react';

const PUERTOS = [
  { puerto: 5173, nombre: 'React + Vite' },
  { puerto: 3000, nombre: 'React / Next.js' },
  { puerto: 4000, nombre: 'Node.js / Express' },
  { puerto: 4200, nombre: 'Angular' },
  { puerto: 8000, nombre: 'Laravel' },
];

const VITE_BASICO = `server: {
  host: '0.0.0.0',
  allowedHosts: ['.trycloudflare.com']
}`;

const VITE_PROXY = `server: {
  host: '0.0.0.0',
  allowedHosts: ['.trycloudflare.com'],
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true
    }
  }
}`;

const Codigo: React.FC<{ texto: string }> = ({ texto }) => {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard?.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    }).catch(() => {});
  };
  return (
    <div className="relative mt-2">
      <pre className="overflow-x-auto rounded-xl bg-slate-950 border border-slate-800 p-3 pr-24 text-[13px] leading-relaxed text-cyan-100"><code>{texto}</code></pre>
      <button type="button" onClick={copiar} className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer">
        {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
};

const Paso: React.FC<{ n: number; titulo: string; children: React.ReactNode }> = ({ n, titulo, children }) => (
  <li className="relative pl-11">
    <span className="absolute left-0 top-0 grid place-items-center w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/40 text-cyan-300 text-sm font-bold">{n}</span>
    <h4 className="font-bold text-white">{titulo}</h4>
    <div className="mt-1 text-sm text-slate-300">{children}</div>
  </li>
);

const GuiaTunel: React.FC = () => {
  const [puerto, setPuerto] = useState(5173);
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 max-w-3xl" aria-labelledby="guia-tunel">
      <h3 id="guia-tunel" className="text-xl font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-300" /> Mostralo funcionando con un túnel</h3>
      <p className="mt-2 text-slate-300">Si el sistema corre en tu compu, lo podés compartir con un link seguro de Cloudflare. Quien lo abre no necesita instalar nada, y vos seguís trabajando en VS Code mientras lo ve.</p>

      <ol className="mt-5 space-y-6">
        <Paso n={1} titulo="Instalá Cloudflare Tunnel">
          Abrí PowerShell y ejecutá:
          <Codigo texto="winget install --id Cloudflare.cloudflared" />
          <p className="mt-2">Cerrá y volvé a abrir PowerShell, y comprobá la instalación:</p>
          <Codigo texto="cloudflared --version" />
        </Paso>

        <Paso n={2} titulo="Iniciá tu proyecto">
          Desde la terminal de VS Code, dentro de tu proyecto:
          <Codigo texto="npm run dev" />
          <p className="mt-2">Comprobá que funciona en tu navegador y fijate en qué puerto corre.</p>
        </Paso>

        <Paso n={3} titulo="Creá el túnel">
          Abrí otra terminal de PowerShell, sin cerrar la del proyecto. Elegí el puerto:
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Puerto de tu proyecto">
            {PUERTOS.map((p) => (
              <button
                key={p.puerto}
                type="button"
                role="radio"
                aria-checked={puerto === p.puerto}
                onClick={() => setPuerto(p.puerto)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${puerto === p.puerto ? 'border-cyan-400 bg-cyan-400/15 text-cyan-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}
              >
                {p.puerto} · {p.nombre}
              </button>
            ))}
          </div>
          <Codigo texto={`cloudflared tunnel --url http://localhost:${puerto}`} />
        </Paso>

        <Paso n={4} titulo="Compartí el link">
          Cloudflare te va a dar una dirección parecida a <span className="font-mono text-cyan-200">https://demo-example-project.trycloudflare.com</span>. Ese es el link que mandás: el cliente lo abre y listo.
        </Paso>

        <Paso n={5} titulo="Si usás Vite y aparece «Blocked request»">
          Si ves <span className="font-mono">This host is not allowed</span>, agregá esto en <span className="font-mono">vite.config.ts</span> (sin borrar lo que ya tenés) y reiniciá el proyecto:
          <Codigo texto={VITE_BASICO} />
          <p className="mt-2">Para más seguridad, cambiá <span className="font-mono">.trycloudflare.com</span> por el nombre exacto que te dio Cloudflare.</p>
        </Paso>

        <Paso n={6} titulo="Si tenés frontend y backend">
          Si el frontend llama a <span className="font-mono">localhost:4000</span>, desde la compu del cliente no va a andar. Poné un proxy en Vite:
          <Codigo texto={VITE_PROXY} />
          <p className="mt-2">y hacé las llamadas con rutas relativas, por ejemplo <span className="font-mono">fetch('/api/productos')</span>. Así alcanza con un solo túnel para todo el sistema. Adaptá los puertos a tu proyecto.</p>
        </Paso>
      </ol>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <caption className="text-left text-white font-bold mb-2">Comparación de alternativas</caption>
          <thead className="text-slate-400">
            <tr><th className="py-1.5 pr-3 font-semibold">Característica</th><th className="py-1.5 pr-3 font-semibold">Cloudflare</th><th className="py-1.5 pr-3 font-semibold">Ngrok</th><th className="py-1.5 font-semibold">LocalTunnel</th></tr>
          </thead>
          <tbody className="text-slate-300 divide-y divide-slate-800">
            <tr><td className="py-1.5 pr-3">HTTPS</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
            <tr><td className="py-1.5 pr-3">Demostración gratuita</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
            <tr><td className="py-1.5 pr-3">Requiere cuenta</td><td>No (túnel rápido)</td><td>Sí</td><td>No</td></tr>
            <tr><td className="py-1.5 pr-3">Instalación</td><td>Fácil</td><td>Fácil</td><td>Fácil</td></tr>
            <tr><td className="py-1.5 pr-3">Recomendación</td><td className="text-emerald-300 font-semibold">Excelente</td><td>Buena</td><td>Básica</td></tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <h4 className="font-bold text-amber-200">Para tener en cuenta</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300">
          <li>Dejá la compu prendida y con internet, y desactivá la suspensión de Windows durante la demo.</li>
          <li>No cierres las terminales del proyecto ni del túnel.</li>
          <li>Usá datos de prueba y usuarios de demostración.</li>
          <li>No expongas PostgreSQL ni herramientas de administración.</li>
          <li>Cualquiera con el link puede entrar mientras el túnel esté abierto; tu sistema puede pedir usuario y contraseña.</li>
          <li>Para cerrar el acceso, apretá Ctrl + C en la terminal de Cloudflare.</li>
          <li>El link del túnel rápido cambia cada vez que lo reiniciás. Si necesitás una dirección fija con tu dominio, se puede armar un túnel administrado.</li>
        </ul>
      </div>
    </section>
  );
};

export default GuiaTunel;
