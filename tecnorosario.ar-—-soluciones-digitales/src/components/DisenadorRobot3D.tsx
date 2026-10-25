import React, { useMemo, useState } from 'react';
import { Bot, Rotate3D, Palette, SlidersHorizontal, MessageCircle, RotateCcw } from 'lucide-react';
import { whatsappLink } from '../data/contact';

type RobotStyle = 'explorador' | 'industrial' | 'asistente';

const PALETAS = [
  { nombre: 'Cian', valor: '#22d3ee' },
  { nombre: 'Violeta', valor: '#a78bfa' },
  { nombre: 'Verde', valor: '#34d399' },
  { nombre: 'Naranja', valor: '#fb923c' },
  { nombre: 'Blanco', valor: '#e2e8f0' },
];

const ESTILOS: Record<RobotStyle, { nombre: string; descripcion: string; cuerpo: string }> = {
  explorador: { nombre: 'Explorador', descripcion: 'Compacto y versátil, pensado para explorar ideas.', cuerpo: 'EXPLORADOR' },
  industrial: { nombre: 'Industrial', descripcion: 'Estructura robusta para conceptos de uso técnico.', cuerpo: 'INDUSTRIAL' },
  asistente: { nombre: 'Asistente', descripcion: 'Diseño amigable para interacción y demostraciones.', cuerpo: 'ASISTENTE' },
};

export const DisenadorRobot3D: React.FC = () => {
  const [estilo, setEstilo] = useState<RobotStyle>('explorador');
  const [color, setColor] = useState(PALETAS[0].valor);
  const [giro, setGiro] = useState(18);
  const [inclinacion, setInclinacion] = useState(-8);
  const [ojosEncendidos, setOjosEncendidos] = useState(true);

  const mensaje = useMemo(() => [
    'Hola TecnoRos, quiero consultar por un diseño de robot personalizado.',
    'Modelo conceptual: ' + ESTILOS[estilo].nombre,
    'Color principal: ' + color,
    'Giro: ' + giro + '°; inclinación: ' + inclinacion + '°',
    'Iluminación frontal: ' + (ojosEncendidos ? 'encendida' : 'apagada'),
    'Me gustaría conocer opciones de diseño, prototipado y presupuesto.'
  ].join('\n'), [estilo, color, giro, inclinacion, ojosEncendidos]);

  const reiniciar = () => {
    setEstilo('explorador');
    setColor(PALETAS[0].valor);
    setGiro(18);
    setInclinacion(-8);
    setOjosEncendidos(true);
  };

  return (
    <section id="disenador-robot-3d" className="relative overflow-hidden border-t border-slate-800/70 bg-[#080d18] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.045) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono text-cyan-300">
            <Bot className="h-3.5 w-3.5" /> LABORATORIO DE ROBÓTICA
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Diseñá tu robot <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">en 3D</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Explorá una primera maqueta conceptual, elegí su estilo y personalizá los detalles. Después, envianos tu idea para evaluar un diseño a medida y su posible prototipado.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="relative min-h-[390px] overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-[#0a1220] to-slate-950 p-4 sm:p-8">
            <div className="absolute left-5 top-5 flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400"><Rotate3D className="h-4 w-4 text-cyan-400" /> VISTA CONCEPTUAL</div>
            <div className="absolute right-5 top-5 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-[10px] font-mono text-slate-400">MODELO INTERACTIVO</div>
            <div className="robot-stage" style={{ perspective: '850px' }}>
              <div className="robot-model" style={{ transform: `rotateY(${giro}deg) rotateX(${inclinacion}deg)`, '--robot-accent': color } as React.CSSProperties}>
                <div className="robot-antenna" />
                <div className="robot-head">
                  <div className="robot-ear left" /><div className="robot-ear right" />
                  <div className="robot-face">
                    <span className={ojosEncendidos ? 'robot-eye lit' : 'robot-eye'} />
                    <span className={ojosEncendidos ? 'robot-eye lit' : 'robot-eye'} />
                    <span className="robot-mouth" />
                  </div>
                </div>
                <div className="robot-neck" />
                <div className="robot-torso">
                  <div className="robot-chest-mark"><Bot size={30} /></div>
                  <div className="robot-chest-line" />
                  <span className="robot-label">{ESTILOS[estilo].cuerpo}</span>
                </div>
                <div className="robot-arm left"><span /></div><div className="robot-arm right"><span /></div>
                <div className="robot-leg left"><span /></div><div className="robot-leg right"><span /></div>
                <div className="robot-shadow" />
              </div>
            </div>
            <p className="absolute bottom-5 left-0 right-0 text-center text-xs text-slate-500">Mové los controles para cambiar la vista y la apariencia</p>
          </div>

          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-xs font-mono uppercase tracking-widest text-cyan-300">Personalización</p><h3 className="mt-1 text-xl font-bold text-white">Tu concepto</h3></div>
              <button type="button" onClick={reiniciar} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/60 hover:text-white"><RotateCcw className="h-3.5 w-3.5" /> Reiniciar</button>
            </div>

            <label className="mb-2 block text-sm font-semibold text-slate-200">Tipo de robot</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ESTILOS) as RobotStyle[]).map((key) => (
                <button key={key} type="button" onClick={() => setEstilo(key)} aria-pressed={estilo === key} className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${estilo === key ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-500'}`}>
                  {ESTILOS[key].nombre}
                </button>
              ))}
            </div>
            <p className="mt-3 min-h-10 text-sm leading-relaxed text-slate-400">{ESTILOS[estilo].descripcion}</p>

            <div className="mt-5">
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><Palette className="h-4 w-4 text-cyan-300" /> Color principal</label>
              <div className="flex flex-wrap gap-3">
                {PALETAS.map((p) => <button key={p.valor} type="button" onClick={() => setColor(p.valor)} aria-label={p.nombre} aria-pressed={color === p.valor} className={`h-9 w-9 rounded-full border-2 transition ${color === p.valor ? 'scale-110 border-white ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-slate-900' : 'border-slate-600 hover:scale-105'}`} style={{ backgroundColor: p.valor }} />)}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div><label htmlFor="robot-giro" className="mb-2 flex justify-between text-sm text-slate-300"><span className="flex items-center gap-2"><Rotate3D className="h-4 w-4" /> Giro</span><span className="font-mono text-cyan-300">{giro}°</span></label><input id="robot-giro" type="range" min="-55" max="55" value={giro} onChange={(e) => setGiro(Number(e.target.value))} className="w-full accent-cyan-400" /></div>
              <div><label htmlFor="robot-inclinacion" className="mb-2 flex justify-between text-sm text-slate-300"><span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Inclinación</span><span className="font-mono text-cyan-300">{inclinacion}°</span></label><input id="robot-inclinacion" type="range" min="-22" max="22" value={inclinacion} onChange={(e) => setInclinacion(Number(e.target.value))} className="w-full accent-cyan-400" /></div>
            </div>
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300"><input type="checkbox" checked={ojosEncendidos} onChange={(e) => setOjosEncendidos(e.target.checked)} className="h-4 w-4 accent-cyan-400" /> Iluminación frontal</label>

            <a href={whatsappLink(mensaje)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:from-cyan-300 hover:to-cyan-200">
              <MessageCircle className="h-4 w-4" /> Consultar por mi diseño
            </a>
            <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">Esta maqueta es ilustrativa; las especificaciones, viabilidad y presupuesto se definen en una consulta técnica.</p>
          </div>
        </div>
      </div>
      <style>{`
        .robot-stage{display:flex;align-items:center;justify-content:center;min-height:330px;padding-top:28px;perspective:850px}
        .robot-model{--robot-accent:#22d3ee;position:relative;width:210px;height:280px;transform-style:preserve-3d;transition:transform .25s ease;filter:drop-shadow(0 16px 30px rgba(0,0,0,.4))}
        .robot-head{position:absolute;z-index:4;top:30px;left:58px;width:94px;height:78px;border:2px solid #64748b;border-radius:25px 25px 20px 20px;background:linear-gradient(135deg,#e2e8f0 0%,#94a3b8 48%,#475569 100%);box-shadow:inset -10px -4px 0 #334155, inset 5px 5px 0 #f8fafc;transform:translateZ(18px)}
        .robot-face{position:absolute;left:11px;right:11px;top:17px;height:39px;border-radius:12px;background:#07111d;border:1px solid #334155;display:flex;align-items:center;justify-content:center;gap:17px;box-shadow:inset 0 0 12px #020617}
        .robot-eye{width:9px;height:12px;border-radius:50%;background:#334155}.robot-eye.lit{background:var(--robot-accent);box-shadow:0 0 9px var(--robot-accent),0 0 18px color-mix(in srgb,var(--robot-accent),transparent 35%)}
        .robot-mouth{position:absolute;bottom:5px;width:17px;height:2px;border-radius:3px;background:#64748b}
        .robot-ear{position:absolute;top:23px;width:10px;height:27px;border-radius:4px;background:var(--robot-accent);box-shadow:0 0 10px color-mix(in srgb,var(--robot-accent),transparent 50%)}.robot-ear.left{left:-10px}.robot-ear.right{right:-10px}
        .robot-antenna{position:absolute;top:10px;left:101px;width:8px;height:24px;border-radius:6px;background:#94a3b8;transform:translateZ(12px)}.robot-antenna:after{content:'';position:absolute;top:-8px;left:-3px;width:14px;height:14px;border-radius:50%;background:var(--robot-accent);box-shadow:0 0 15px var(--robot-accent)}
        .robot-neck{position:absolute;z-index:2;top:104px;left:91px;width:28px;height:17px;background:#475569;border:2px solid #64748b;border-radius:4px}
        .robot-torso{position:absolute;z-index:3;top:116px;left:43px;width:124px;height:86px;border:2px solid #64748b;border-radius:19px 19px 14px 14px;background:linear-gradient(120deg,#cbd5e1,#64748b 58%,#334155);box-shadow:inset 7px 5px 0 #e2e8f0,inset -9px -4px 0 #1e293b;transform:translateZ(14px);display:flex;flex-direction:column;align-items:center}
        .robot-chest-mark{margin-top:12px;width:42px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--robot-accent);background:#07111d;border:1px solid var(--robot-accent);box-shadow:0 0 12px color-mix(in srgb,var(--robot-accent),transparent 78%)}
        .robot-chest-line{margin-top:7px;width:60px;height:3px;border-radius:4px;background:var(--robot-accent);opacity:.8}
        .robot-label{margin-top:4px;font:6px ui-monospace,monospace;letter-spacing:1.4px;color:#0f172a}
        .robot-arm{position:absolute;z-index:1;top:127px;width:31px;height:72px;border-radius:14px;background:linear-gradient(90deg,#475569,#cbd5e1,#475569);border:2px solid #64748b;transform-style:preserve-3d}.robot-arm.left{left:14px;transform:rotate(8deg) translateZ(3px)}.robot-arm.right{right:14px;transform:rotate(-8deg) translateZ(3px)}.robot-arm span{position:absolute;bottom:-10px;left:3px;width:21px;height:17px;border-radius:7px;background:var(--robot-accent);border:2px solid #64748b}
        .robot-leg{position:absolute;z-index:2;top:195px;width:36px;height:58px;border-radius:8px 8px 12px 12px;background:linear-gradient(90deg,#475569,#cbd5e1,#64748b);border:2px solid #64748b}.robot-leg.left{left:62px}.robot-leg.right{right:62px}.robot-leg span{position:absolute;bottom:-9px;left:-5px;width:42px;height:17px;border-radius:7px 7px 5px 5px;background:#334155;border:2px solid #64748b}
        .robot-shadow{position:absolute;z-index:-1;bottom:5px;left:16px;width:178px;height:25px;border-radius:50%;background:rgba(34,211,238,.12);filter:blur(12px);transform:rotateX(65deg) translateZ(-25px)}
        @media(max-width:480px){.robot-model{transform-origin:center center;scale:.88}.robot-stage{min-height:300px}}
        @media(prefers-reduced-motion:reduce){.robot-model{transition:none}}
      `}</style>
    </section>
  );
};
