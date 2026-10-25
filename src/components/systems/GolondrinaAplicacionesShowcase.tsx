import React, { useState, useEffect } from 'react';
import { 
  ThermometerSnowflake, 
  Activity, 
  Layers, 
  Send, 
  CheckCircle2, 
  Zap, 
  Sliders, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Clock, 
  Building2, 
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PhoneCall,
  Milk,
  Wheat,
  Factory,
  Gauge,
  Waves,
  Boxes,
  Flame,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { whatsappLink } from '../../data/contact';

export type SimulationMode = 
  | 'frio' 
  | 'oee' 
  | 'silos' 
  | 'vibracion' 
  | 'lacteos'
  | 'avicola'
  | 'riego'
  | 'fermentador'
  | 'compresor'
  | 'generador'
  | 'vacunas'
  | 'cisterna';

export interface GolondrinaLugar {
  id: string;
  category: 'agro' | 'alimentos' | 'industria' | 'logistica' | 'salud';
  categoryLabel: string;
  icon: React.ElementType;
  lugar: string;
  subtitulo: string;
  sensor: string;
  queDetecta: string;
  riesgoEvitado: string;
  presetTab: SimulationMode;
  whatsappConsulta: string;
}

export const LUGARES_IMPLEMENTACION: GolondrinaLugar[] = [
  {
    id: 'lacteos-tambos',
    category: 'agro',
    categoryLabel: 'Agro & Tambos',
    icon: Milk,
    lugar: 'Tambos & Tanques de Enfriamiento de Leche',
    subtitulo: 'Curva térmica a 4°C y control ininterrumpido de agitación',
    sensor: 'Sonda inoxidable en camisa de tanque + pinza amperométrica en motor agitador',
    queDetecta: 'Si la leche no desciende a 4°C dentro de las 2 horas del ordeñe o si el motor agitador se paró a medianoche.',
    riesgoEvitado: 'Evita la acidificación y decomiso de 5.000 a 25.000 litros de leche cruda por la usina láctea.',
    presetTab: 'lacteos',
    whatsappConsulta: 'Hola TecnoRosario, me interesa implementar Golondrina en tambos y tanques de leche.'
  },
  {
    id: 'silos-granos',
    category: 'agro',
    categoryLabel: 'Agro & Granos',
    icon: Wheat,
    lugar: 'Silos de Acopio & Tolvas de Balanceado',
    subtitulo: 'Detección de focos térmicos internos y vaciado predictivo',
    sensor: 'Termocuplas en cables colgantes de silo + sensor ToF superior de nivel continuo',
    queDetecta: 'Gradientes anómalos de temperatura (fermentación o autocombustión) y cálculo exacto de horas antes de quiebre de stock.',
    riesgoEvitado: 'Protege miles de toneladas de cereal y permite solicitar camiones tolva antes del cierre logístico.',
    presetTab: 'silos',
    whatsappConsulta: 'Hola TecnoRosario, quiero consultar por Golondrina para silos de granos y tolvas.'
  },
  {
    id: 'criaderos-aves-cerdos',
    category: 'agro',
    categoryLabel: 'Agro & Criaderos',
    icon: Waves,
    lugar: 'Criaderos Avícolas & Galpones Porcinos',
    subtitulo: 'Supervisión de extractores en túnel, estrés térmico y bebederos',
    sensor: 'Sondas de temperatura/humedad ambiental + supervisión de fase eléctrica en ventilación',
    queDetecta: 'Caída de extractores en días de calor extremo (estrés térmico fatal en menos de 40 min) o corte en líneas de agua.',
    riesgoEvitado: 'Previene mortandades masivas y asfixia en galpones intensivos durante la noche.',
    presetTab: 'avicola',
    whatsappConsulta: 'Hola TecnoRosario, me interesa Golondrina para galpones avícolas y criaderos de cerdos.'
  },
  {
    id: 'bombas-riego',
    category: 'agro',
    categoryLabel: 'Agro & Riego',
    icon: Gauge,
    lugar: 'Estaciones de Bombeo & Riego por Pivote / Goteo',
    subtitulo: 'Protección contra cavitación, marcha en seco y rotura de matriz',
    sensor: 'Transductor de presión 4-20mA en troncal + caudalímetro de pozo profundo',
    queDetecta: 'Caída súbita de presión por rotura de mangueras principales o sobrepresión y marcha en seco por pozo deprimido.',
    riesgoEvitado: 'Evita fundir bombas sumergibles de alto costo y derrochar millones de litros de agua y electricidad.',
    presetTab: 'riego',
    whatsappConsulta: 'Hola TecnoRosario, quiero implementar Golondrina en estaciones de bombeo y riego.'
  },
  {
    id: 'frigorificos-camaras',
    category: 'alimentos',
    categoryLabel: 'Alimentos & Frío',
    icon: ThermometerSnowflake,
    lugar: 'Frigoríficos & Cámaras de Carnes / Helados',
    subtitulo: 'Detección proactiva de desfrío y puertas abiertas fuera de turno',
    sensor: 'Sondas PT100 calibradas + detector magnético industrial en compuertas',
    queDetecta: 'Corte eléctrico nocturno con curva acelerada de calentamiento y puertas de cámara abiertas más de 10 min.',
    riesgoEvitado: 'Protege mercadería de altísimo valor y cumple normativas SENASA sin necesidad de planillas manuales.',
    presetTab: 'frio',
    whatsappConsulta: 'Hola TecnoRosario, quiero cotizar Golondrina para cámaras frigoríficas y carnes/helados.'
  },
  {
    id: 'fermentadores-cerveza',
    category: 'alimentos',
    categoryLabel: 'Alimentos & Bebidas',
    icon: Flame,
    lugar: 'Fermentadores en Cervecerías & Bodegas',
    subtitulo: 'Control de rampa térmica y presión en tanques isobarométricos',
    sensor: 'Sonda PT1000 en camisa de glicol + manómetro digital en domo de tanque',
    queDetecta: 'Desvío de 0.5°C durante fermentación primaria o aumento descontrolado de presión antes del alivio.',
    riesgoEvitado: 'Garantiza calidad organoléptica y elimina el riesgo de perder lotes enteros de cerveza o vino.',
    presetTab: 'fermentador',
    whatsappConsulta: 'Hola TecnoRosario, me interesa Golondrina para fermentadores de cerveza y bodegas.'
  },
  {
    id: 'inyectoras-prensas',
    category: 'industria',
    categoryLabel: 'Industria & Fábrica',
    icon: Factory,
    lugar: 'Inyectoras de Plástico & Prensas Metalmecánicas',
    subtitulo: 'Trazabilidad de OEE en tiempo real, cadencia y micro-paradas',
    sensor: 'Sensor inductivo/óptico contador de ciclos + pinza amperométrica de motor principal',
    queDetecta: 'Máquina detenida por más de 5 minutos, ritmo de ciclo por debajo del estándar o falta de granza.',
    riesgoEvitado: 'Elimina tiempos muertos ocultos y clasifica el motivo de parada en 1 solo clic del operario.',
    presetTab: 'oee',
    whatsappConsulta: 'Hola TecnoRosario, quiero consultar por Golondrina para inyectoras plásticas y prensas.'
  },
  {
    id: 'motores-rodamientos',
    category: 'industria',
    categoryLabel: 'Industria & Mantenimiento',
    icon: Activity,
    lugar: 'Motores Eléctricos, Reductores & Rodamientos',
    subtitulo: 'Mantenimiento predictivo por vibración acelerométrica y temperatura',
    sensor: 'Acelerómetro triaxial piezoeléctrico (mm/s RMS) + sensor térmico de carcasa',
    queDetecta: 'Vibraciones anómalas por rozamiento o desbalanceo entre 15 y 20 días antes de que el rodamiento se clave.',
    riesgoEvitado: 'Ahorra paradas intempestivas de planta que frenan toda la línea durante días con costos millonarios.',
    presetTab: 'vibracion',
    whatsappConsulta: 'Hola TecnoRosario, me interesa Golondrina para mantenimiento predictivo de motores y rodamientos.'
  },
  {
    id: 'compresores-aire',
    category: 'industria',
    categoryLabel: 'Industria & Neumática',
    icon: Gauge,
    lugar: 'Compresores de Aire Comprimido Central',
    subtitulo: 'Detección de fugas neumáticas ocultas y ciclos de sobrecarga',
    sensor: 'Presostato digital en pulmón de aire + termómetro de aceite de tornillo',
    queDetecta: 'Ciclos de encendido continuos en horarios no productivos (fugas en cañerías del taller) o sobrecalentamiento de tornillo.',
    riesgoEvitado: 'Las fugas neumáticas representan hasta el 35% del costo eléctrico de una fábrica; detectarlas ahorra sumas enormes.',
    presetTab: 'compresor',
    whatsappConsulta: 'Hola TecnoRosario, quiero implementar Golondrina en compresores de aire y detección de fugas.'
  },
  {
    id: 'generadores-diesel',
    category: 'logistica',
    categoryLabel: 'Logística & Energía',
    icon: Zap,
    lugar: 'Grupos Electrógenos & Tanques Diésel de Respaldo',
    subtitulo: 'Garantía de arranque en emergencia y monitoreo de combustible',
    sensor: 'Voltímetro de batería de arranque 12/24V + flotador resistivo en tanque diésel',
    queDetecta: 'Batería descargada antes del corte y nivel insuficiente de gasoil para cubrir turnos críticos.',
    riesgoEvitado: 'Garantiza que el generador realmente arranque en la emergencia y avisa en vivo cuánto combustible le queda.',
    presetTab: 'generador',
    whatsappConsulta: 'Hola TecnoRosario, quiero consultar por Golondrina para grupos electrógenos y tanques de gasoil.'
  },
  {
    id: 'heladeras-vacunas',
    category: 'salud',
    categoryLabel: 'Salud & Laboratorios',
    icon: ShieldAlert,
    lugar: 'Heladeras de Vacunas, Medicamentos & Laboratorios',
    subtitulo: 'Cadena de frío estricta de 2°C a 8°C con registro auditable continuo',
    sensor: 'Sonda calibrada inmersa en glicol (2°C a 8°C) con memoria no volátil y batería de respaldo',
    queDetecta: 'Desvíos de temperatura, puertas entreabiertas o corte de energía con proyección de tiempo de seguridad.',
    riesgoEvitado: 'Cumplimiento normativo y cero descarte de vacunas o medicamentos biológicos de alto costo.',
    presetTab: 'vacunas',
    whatsappConsulta: 'Hola TecnoRosario, quiero cotizar Golondrina para heladeras de vacunas y farmacias.'
  },
  {
    id: 'cisternas-edificios',
    category: 'logistica',
    categoryLabel: 'Grandes Instalaciones',
    icon: Boxes,
    lugar: 'Cisternas de Agua, Bombas de Achique & Calderas',
    subtitulo: 'Nivel de reserva hídrica, prevención de inundaciones y presión de vapor',
    sensor: 'Sensor ultrasónico de nivel en cisterna + sensor de presión en caldera de vapor',
    queDetecta: 'Cisterna perdiendo nivel antes del horario pico de uso o bomba pluvial trabada antes de inundación en subsuelos.',
    riesgoEvitado: 'Protege edificios, hoteles y fábricas contra desabastecimiento hídrico e inundaciones mecánicas.',
    presetTab: 'cisterna',
    whatsappConsulta: 'Hola TecnoRosario, me interesa Golondrina para cisternas de agua y salas de máquinas.'
  }
];

export const GolondrinaAplicacionesShowcase: React.FC = () => {
  // Modo activo en el simulador (Cubre los 12 casos reales)
  const [activeTab, setActiveTab] = useState<SimulationMode>('frio');
  const [companyName, setCompanyName] = useState<string>('Frigorífico San Jorge');

  // Filtro de categorías en la grilla de lugares
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'agro' | 'alimentos' | 'industria' | 'logistica' | 'salud'>('todos');

  // Estados interactivos según el caso seleccionado:
  const [tempC, setTempC] = useState<number>(-20);
  const [corteElectrico, setCorteElectrico] = useState<boolean>(false);

  const [lineaParada, setLineaParada] = useState<boolean>(false);
  const [tiempoParadaMin, setTiempoParadaMin] = useState<number>(0);
  const [contadorPiezas, setContadorPiezas] = useState<number>(840);

  const [nivelSiloPct, setNivelSiloPct] = useState<number>(75);
  const [tasaConsumoTonH] = useState<number>(1.8);

  const [vibracionMmS, setVibracionMmS] = useState<number>(1.8);
  const [tempMotorC, setTempMotorC] = useState<number>(42);

  const [tempLecheC, setTempLecheC] = useState<number>(3.8);
  const [agitadorActivo, setAgitadorActivo] = useState<boolean>(true);

  const [tempGalponC, setTempGalponC] = useState<number>(24);
  const [extractoresOk, setExtractoresOk] = useState<boolean>(true);

  const [presionBar, setPresionBar] = useState<number>(4.2);
  const [roturaMatriz, setRoturaMatriz] = useState<boolean>(false);

  const [tempFermentadorC, setTempFermentadorC] = useState<number>(18.2);
  const [glicolActivo, setGlicolActivo] = useState<boolean>(true);

  const [ciclosCompresorHora, setCiclosCompresorHora] = useState<number>(4);
  const [fugaNeumatica, setFugaNeumatica] = useState<boolean>(false);

  const [bateriaVolts, setBateriaVolts] = useState<number>(13.2);
  const [nivelDieselPct, setNivelDieselPct] = useState<number>(85);

  const [tempVacunasC, setTempVacunasC] = useState<number>(4.5);
  const [puertaVacunasAbierta, setPuertaVacunasAbierta] = useState<boolean>(false);

  const [nivelCisternaPct, setNivelCisternaPct] = useState<number>(78);
  const [bombaCisternaTraba, setBombaCisternaTraba] = useState<boolean>(false);

  // Estado del Celular WhatsApp Interactivo
  const [whatsappResponse, setWhatsappResponse] = useState<string | null>(null);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const [alertPulse, setAlertPulse] = useState<boolean>(false);

  // Inicializar o cambiar de modo en el simulador
  useEffect(() => {
    setWhatsappResponse(null);
    setIsAlarmActive(false);

    switch (activeTab) {
      case 'frio':
        setCompanyName('Frigorífico San Jorge');
        setTempC(-20);
        setCorteElectrico(false);
        break;
      case 'oee':
        setCompanyName('Inyectora Plástica #3');
        setLineaParada(false);
        setTiempoParadaMin(0);
        break;
      case 'silos':
        setCompanyName('Silo Pulmón Maíz #1');
        setNivelSiloPct(75);
        break;
      case 'vibracion':
        setCompanyName('Molino Central');
        setVibracionMmS(1.8);
        setTempMotorC(42);
        break;
      case 'lacteos':
        setCompanyName('Tambo Don Eduardo');
        setTempLecheC(3.8);
        setAgitadorActivo(true);
        break;
      case 'avicola':
        setCompanyName('Granja Avícola El Amanecer');
        setTempGalponC(24);
        setExtractoresOk(true);
        break;
      case 'riego':
        setCompanyName('Estación Riego Pivote #4');
        setPresionBar(4.2);
        setRoturaMatriz(false);
        break;
      case 'fermentador':
        setCompanyName('Cervecería Artesanal Delta');
        setTempFermentadorC(18.2);
        setGlicolActivo(true);
        break;
      case 'compresor':
        setCompanyName('Taller Metalúrgico Central');
        setCiclosCompresorHora(4);
        setFugaNeumatica(false);
        break;
      case 'generador':
        setCompanyName('Centro Logístico Rosario');
        setBateriaVolts(13.2);
        setNivelDieselPct(85);
        break;
      case 'vacunas':
        setCompanyName('Clínica & Vacunatorio');
        setTempVacunasC(4.5);
        setPuertaVacunasAbierta(false);
        break;
      case 'cisterna':
        setCompanyName('Edificio Torre & Complejo');
        setNivelCisternaPct(78);
        setBombaCisternaTraba(false);
        break;
    }
  }, [activeTab]);

  // Disparar alarma con animación
  const triggerAlarm = () => {
    setIsAlarmActive(true);
    setAlertPulse(true);
    setWhatsappResponse(null);
    setTimeout(() => setAlertPulse(false), 1200);
  };

  const handleResponderWhatsApp = (accionTexto: string) => {
    setWhatsappResponse(accionTexto);
    setIsAlarmActive(false);
  };

  const handleReset = () => {
    setWhatsappResponse(null);
    setIsAlarmActive(false);
    // Reinicia según activeTab
    if (activeTab === 'frio') { setTempC(-20); setCorteElectrico(false); }
    else if (activeTab === 'oee') { setLineaParada(false); setTiempoParadaMin(0); setContadorPiezas(840); }
    else if (activeTab === 'silos') { setNivelSiloPct(75); }
    else if (activeTab === 'vibracion') { setVibracionMmS(1.8); setTempMotorC(42); }
    else if (activeTab === 'lacteos') { setTempLecheC(3.8); setAgitadorActivo(true); }
    else if (activeTab === 'avicola') { setTempGalponC(24); setExtractoresOk(true); }
    else if (activeTab === 'riego') { setPresionBar(4.2); setRoturaMatriz(false); }
    else if (activeTab === 'fermentador') { setTempFermentadorC(18.2); setGlicolActivo(true); }
    else if (activeTab === 'compresor') { setCiclosCompresorHora(4); setFugaNeumatica(false); }
    else if (activeTab === 'generador') { setBateriaVolts(13.2); setNivelDieselPct(85); }
    else if (activeTab === 'vacunas') { setTempVacunasC(4.5); setPuertaVacunasAbierta(false); }
    else if (activeTab === 'cisterna') { setNivelCisternaPct(78); setBombaCisternaTraba(false); }
  };

  const horasRestantesSilo = (nivelSiloPct * 50) / (tasaConsumoTonH * 100);

  const irAlSimuladorConPreset = (preset: SimulationMode) => {
    setActiveTab(preset);
    const el = document.getElementById('aplicaciones-golondrina');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const lugaresFiltrados = selectedCategory === 'todos'
    ? LUGARES_IMPLEMENTACION
    : LUGARES_IMPLEMENTACION.filter((l) => l.category === selectedCategory);

  return (
    <div 
      id="aplicaciones-golondrina" 
      className="scroll-mt-28 p-5 sm:p-7 lg:p-9 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-8 relative overflow-hidden shadow-2xl"
    >
      {/* Luz ambiental */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-4 text-sm text-slate-200 space-y-2">
        <p className="font-bold text-white">Guía de los botones de Golondrina</p>
        <p><strong>Elegir escenario:</strong> selecciona un proceso (frío, producción, silos y otros). <strong>Simular falla:</strong> provoca un evento ficticio y muestra cómo se vería una alerta. <strong>Restablecer / Reiniciar:</strong> devuelve los valores de la demostración a su estado normal. <strong>Probar en simulador:</strong> carga el caso elegido.</p>
        <p className="text-amber-200 text-xs">Todo sucede dentro de esta simulación web. No se envían órdenes a máquinas, motores o válvulas reales. La instalación y automatización industrial requieren evaluación técnica y de seguridad previa.</p>
      </div>

      {/* Cabecera del Simulador */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>BANCO DE PRUEBA EN VIVO • MODO DEMOSTRACIÓN B2B</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Probá Golondrina con <span className="text-emerald-400">1 Solo Clic</span>
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Tocá los controles de planta. Mirá cómo suena el WhatsApp. Resolvé sin esfuerzo físico ni planillas manuales.
          </p>
        </div>

        {/* Selector Rápido de Preset en Cabecera */}
        <div className="flex flex-wrap p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0 gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'frio' as const, label: '1. Frío' },
            { id: 'oee' as const, label: '2. OEE' },
            { id: 'silos' as const, label: '3. Silos' },
            { id: 'vibracion' as const, label: '4. Motores' },
            { id: 'lacteos' as const, label: '5. Tambos' },
            { id: 'avicola' as const, label: '6. Galpón' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre de la Empresa en Vivo */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <span className="font-mono text-cyan-300 font-bold flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Empresa / Equipo en Simulación:</span>
        </span>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Ej: Mi Empresa SRL"
          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
        />
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          (Aparece en el mensaje de WhatsApp a la derecha)
        </span>
      </div>

      {/* GRID PRINCIPAL: Controles de Planta (7 cols) + Smartphone WhatsApp (5 cols) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================
            COLUMNA IZQUIERDA: CONTROLES DE PLANTA (7 COLS)
            ========================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>TABLERO DE PLANTA: {companyName.toUpperCase()}</span>
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            </div>

            {/* CASO 1: FRÍO SEGURO */}
            {activeTab === 'frio' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Sonda Térmica PT100 en Cámara:</span>
                    <span className={`text-2xl font-black font-mono ${tempC > -14 ? 'text-red-400' : 'text-cyan-300'}`}>
                      {tempC.toFixed(1)}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="-5"
                    step="0.5"
                    value={tempC}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setTempC(v);
                      if (v >= -14) triggerAlarm();
                      else setIsAlarmActive(false);
                    }}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>-25°C (Óptimo)</span>
                    <span className="text-amber-400">-15°C (Alerta)</span>
                    <span className="text-red-400">-5°C (Descongelado)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const n = !corteElectrico;
                      setCorteElectrico(n);
                      if (n) { setTempC(-13.5); triggerAlarm(); }
                      else { setTempC(-20); setIsAlarmActive(false); }
                    }}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      corteElectrico ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{corteElectrico ? 'Restablecer Fase Eléctrica' : '⚡ Simular Corte de Luz (2 AM)'}</span>
                  </button>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Estado de Planta:</span>
                    <span className={`font-bold ${isAlarmActive ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {isAlarmActive ? '🚨 PÉRDIDA DE FRÍO' : '✓ NORMAL (-20°C)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CASO 2: OEE MÁQUINAS */}
            {activeTab === 'oee' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">PIEZAS PRODUCIDAS</span>
                    <span className="text-3xl font-black font-mono text-white mt-1 block">{contadorPiezas}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Meta: 1.000 (84%)</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">ESTADO DE LÍNEA</span>
                    <span className={`text-xl font-black font-mono mt-2 block ${lineaParada ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {lineaParada ? `PARADA (${tiempoParadaMin || 8} min)` : 'ACTIVA (12s/ciclo)'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !lineaParada;
                    setLineaParada(n);
                    if (n) { setTiempoParadaMin(8); triggerAlarm(); }
                    else { setTiempoParadaMin(0); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    lineaParada ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-300'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{lineaParada ? 'Reanudar Producción en Máquina' : '⏹️ Simular Traba / Parada de Línea (>6 min)'}</span>
                </button>
              </div>
            )}

            {/* CASO 3: SILOS & TOLVAS */}
            {activeTab === 'silos' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Nivel de Tolva:</span>
                    <span className={`text-2xl font-black font-mono ${nivelSiloPct <= 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {nivelSiloPct}% ({((nivelSiloPct / 100) * 50).toFixed(1)} tn)
                    </span>
                  </div>
                  <div className="w-full h-5 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${nivelSiloPct <= 20 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-400'}`}
                      style={{ width: `${nivelSiloPct}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={nivelSiloPct}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setNivelSiloPct(v);
                      if (v <= 25) triggerAlarm();
                      else setIsAlarmActive(false);
                    }}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Consumo: {tasaConsumoTonH} ton/h</span>
                    <span className="text-amber-300 font-bold">
                      Autonomía: ~{horasRestantesSilo.toFixed(1)} hs (Quiebre: 02:40 AM)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setNivelSiloPct(18); triggerAlarm(); }}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Simular Pendiente de Vaciado Crítico (Alerta Proactiva)</span>
                </button>
              </div>
            )}

            {/* CASO 4: MOTORES & VIBRACIÓN */}
            {activeTab === 'vibracion' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Vibración Triaxial en Rodamiento:</span>
                    <span className={`text-2xl font-black font-mono ${vibracionMmS >= 4.5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {vibracionMmS.toFixed(1)} mm/s RMS
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.2"
                    value={vibracionMmS}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVibracionMmS(v);
                      if (v >= 4.5) { setTempMotorC(74); triggerAlarm(); }
                      else { setTempMotorC(42); setIsAlarmActive(false); }
                    }}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>1.5 mm/s (Excelente)</span>
                    <span className="text-amber-400">3.5 mm/s (Alerta)</span>
                    <span className="text-red-400">&gt;4.5 mm/s (Peligro de rotura)</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Temperatura en Carcasa:</span>
                  <span className={`font-bold ${tempMotorC > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tempMotorC}°C {tempMotorC > 70 ? '(🔥 Sobrecalentamiento)' : '(✓ Normal)'}
                  </span>
                </div>
              </div>
            )}

            {/* CASO 5: TAMBOS & LECHE */}
            {activeTab === 'lacteos' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Temperatura Leche Cruda en Tanque:</span>
                    <span className={`text-2xl font-black font-mono ${tempLecheC > 5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {tempLecheC.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Límite reglamentario: 4.0°C</span>
                    <span className={tempLecheC > 5 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {tempLecheC > 5 ? '⚠️ RIESGO DE ACIDIFICACIÓN' : '✓ Enfriamiento Óptimo'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !agitadorActivo;
                    setAgitadorActivo(n);
                    if (!n) { setTempLecheC(6.8); triggerAlarm(); }
                    else { setTempLecheC(3.8); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    !agitadorActivo ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Milk className="w-4 h-4 text-cyan-400" />
                  <span>{!agitadorActivo ? 'Restablecer Motor Agitador' : '🛑 Simular Falla de Agitación (01:15 AM)'}</span>
                </button>
              </div>
            )}

            {/* CASO 6: GALPÓN AVÍCOLA */}
            {activeTab === 'avicola' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Temperatura en Galpón Túnel:</span>
                    <span className={`text-2xl font-black font-mono ${tempGalponC >= 32 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {tempGalponC.toFixed(1)}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    value={tempGalponC}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setTempGalponC(v);
                      if (v >= 32) triggerAlarm();
                      else setIsAlarmActive(false);
                    }}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>24°C (Confort aves)</span>
                    <span className="text-amber-400">30°C (Estrés térmico)</span>
                    <span className="text-red-400">&gt;35°C (Letal en 35 min)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !extractoresOk;
                    setExtractoresOk(n);
                    if (!n) { setTempGalponC(35.5); triggerAlarm(); }
                    else { setTempGalponC(24); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    !extractoresOk ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span>{!extractoresOk ? 'Restablecer Extractores de Aire' : '⚡ Simular Corte de Ventiladores en Galpón'}</span>
                </button>
              </div>
            )}

            {/* CASO 7: ESTACIÓN DE RIEGO */}
            {activeTab === 'riego' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Presión en Cañería Matriz:</span>
                    <span className={`text-2xl font-black font-mono ${presionBar < 2.0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {presionBar.toFixed(1)} bar
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={presionBar}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setPresionBar(v);
                      if (v < 2.0) triggerAlarm();
                      else setIsAlarmActive(false);
                    }}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-red-400">1.0 bar (Rotura / Fuga)</span>
                    <span className="text-emerald-400">4.2 bar (Óptimo)</span>
                    <span className="text-amber-400">6.0 bar (Sobrepresión)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !roturaMatriz;
                    setRoturaMatriz(n);
                    if (n) { setPresionBar(1.1); triggerAlarm(); }
                    else { setPresionBar(4.2); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    roturaMatriz ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>{roturaMatriz ? 'Reparar Válvula / Matriz' : '💥 Simular Rotura de Manguera Troncal'}</span>
                </button>
              </div>
            )}

            {/* CASO 8: FERMENTADOR */}
            {activeTab === 'fermentador' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Temperatura de Fermentación:</span>
                    <span className={`text-2xl font-black font-mono ${tempFermentadorC > 21 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {tempFermentadorC.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Rango fijado: 18.0°C ± 0.5°C</span>
                    <span className={tempFermentadorC > 21 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {tempFermentadorC > 21 ? '⚠️ RIESGO DE OFF-FLAVORS' : '✓ Fermentación Estable'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !glicolActivo;
                    setGlicolActivo(n);
                    if (!n) { setTempFermentadorC(24.5); triggerAlarm(); }
                    else { setTempFermentadorC(18.2); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    !glicolActivo ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{!glicolActivo ? 'Restablecer Chiller de Glicol' : '❄️ Simular Falla de Recirculación de Frío'}</span>
                </button>
              </div>
            )}

            {/* CASO 9: COMPRESOR DE AIRE */}
            {activeTab === 'compresor' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Ciclos de Carga por Hora:</span>
                    <span className={`text-2xl font-black font-mono ${ciclosCompresorHora > 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {ciclosCompresorHora} ciclos/hora
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Normal en reposo: 2-3 ciclos</span>
                    <span className={ciclosCompresorHora > 10 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {ciclosCompresorHora > 10 ? '⚠️ FUGA NEUMÁTICA DETECTADA' : '✓ Cañería Estanca'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !fugaNeumatica;
                    setFugaNeumatica(n);
                    if (n) { setCiclosCompresorHora(19); triggerAlarm(); }
                    else { setCiclosCompresorHora(4); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    fugaNeumatica ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>{fugaNeumatica ? 'Sellar Fuga Neumática' : '💨 Simular Fuga Nocturna de Aire Comprimido'}</span>
                </button>
              </div>
            )}

            {/* CASO 10: GRUPO ELECTRÓGENO */}
            {activeTab === 'generador' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">BATERÍA ARRANQUE</span>
                    <span className={`text-2xl font-black font-mono mt-1 block ${bateriaVolts < 11.5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {bateriaVolts.toFixed(1)}V
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">TANQUE GASOIL</span>
                    <span className="text-2xl font-black font-mono text-white mt-1 block">{nivelDieselPct}%</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (bateriaVolts > 12) { setBateriaVolts(10.8); triggerAlarm(); }
                    else { setBateriaVolts(13.2); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    bateriaVolts < 11.5 ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{bateriaVolts < 11.5 ? 'Recargar Batería' : '🔋 Simular Batería Descargada (10.8V)'}</span>
                </button>
              </div>
            )}

            {/* CASO 11: HELADERA DE VACUNAS */}
            {activeTab === 'vacunas' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Sonda Glicol (2°C a 8°C):</span>
                    <span className={`text-2xl font-black font-mono ${tempVacunasC > 8.0 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                      {tempVacunasC.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Norma ANMAT: 2°C a 8°C</span>
                    <span className={tempVacunasC > 8 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {tempVacunasC > 8 ? '🚨 ROTURA DE CADENA DE FRÍO' : '✓ Rango Seguro'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !puertaVacunasAbierta;
                    setPuertaVacunasAbierta(n);
                    if (n) { setTempVacunasC(9.6); triggerAlarm(); }
                    else { setTempVacunasC(4.5); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    puertaVacunasAbierta ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>{puertaVacunasAbierta ? 'Cerrar Puerta de Heladera' : '🚪 Simular Puerta Entreabierta (>10 min)'}</span>
                </button>
              </div>
            )}

            {/* CASO 12: CISTERNA Y CALDERA */}
            {activeTab === 'cisterna' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Nivel de Cisterna Enterrada:</span>
                    <span className={`text-2xl font-black font-mono ${nivelCisternaPct < 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {nivelCisternaPct}% ({((nivelCisternaPct / 100) * 30).toFixed(1)} m³)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={nivelCisternaPct}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setNivelCisternaPct(v);
                      if (v < 20) triggerAlarm();
                      else setIsAlarmActive(false);
                    }}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-red-400">10% (Sin agua)</span>
                    <span className="text-amber-400">20% (Alerta previa)</span>
                    <span className="text-emerald-400">80% (Óptimo)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const n = !bombaCisternaTraba;
                    setBombaCisternaTraba(n);
                    if (n) { setNivelCisternaPct(14); triggerAlarm(); }
                    else { setNivelCisternaPct(78); setIsAlarmActive(false); }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    bombaCisternaTraba ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  <span>{bombaCisternaTraba ? 'Destrabar Bomba Elevadora' : '⚠️ Simular Vaciado de Cisterna (1h al quiebre)'}</span>
                </button>
              </div>
            )}

            {/* Aviso de Cero Esfuerzo */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Cero esfuerzo: nadie tiene que cargar planillas. Golondrina detecta y pregunta sola.</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            COLUMNA DERECHA: TELÉFONO WHATSAPP EN VIVO (5 COLS)
            ========================================================= */}
        <div className="lg:col-span-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LO QUE RECIBÍS EN TU CELULAR:</span>
            </span>
            <span className="text-[10px] text-slate-500">1 Clic para resolver</span>
          </div>

          <div className={`p-4 sm:p-5 rounded-3xl bg-[#0b141a] border ${alertPulse ? 'border-red-400 shadow-red-500/30' : 'border-[#202c33]'} shadow-2xl relative transition-all duration-300`}>
            {/* Cabecera del Chat */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#202c33] text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  G
                </div>
                <div>
                  <div className="font-bold text-white leading-none">Golondrina Telemetría</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">En línea • Sistema Activo</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Hoy</span>
            </div>

            {/* Mensaje de WhatsApp Recibido según el modo */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#1f2c34] text-slate-100 shadow-md text-xs space-y-2 border border-[#2a3942]">
                <div className="flex items-center justify-between text-[11px] text-cyan-300 font-mono font-bold">
                  <span>[{companyName || 'Tu Empresa'}]</span>
                  <span className="text-[10px] text-slate-400">02:18 AM</span>
                </div>

                {activeTab === 'frio' && (
                  <>
                    <div className="font-bold text-amber-300">🚨 ALERTA: CURVA ANÓMALA DE CALENTAMIENTO</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Temperatura subió a <strong className="text-white">{tempC.toFixed(1)}°C</strong> (+2.3°C/h). Corte de energía detectado en horario no operativo. Tiempo de rescate antes de desfrío: <strong className="text-red-300">1h 40m</strong>.
                    </p>
                  </>
                )}

                {activeTab === 'oee' && (
                  <>
                    <div className="font-bold text-amber-300">⚠️ DETECCIÓN DE PARADA EN LÍNEA</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Línea detenida por <strong className="text-white">{tiempoParadaMin || 8} minutos</strong> continuos en turno activo. Retraso proyectado: ~140 piezas.
                    </p>
                  </>
                )}

                {activeTab === 'silos' && (
                  <>
                    <div className="font-bold text-amber-300">🔔 AVISO PREDICTIVO DE STOCK</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Nivel en <strong className="text-white">{nivelSiloPct}%</strong>. Al ritmo actual el silo alcanzará nivel crítico a las <strong className="text-amber-300">02:40 AM</strong>. Pedir camión antes del cierre logístico.
                    </p>
                  </>
                )}

                {activeTab === 'vibracion' && (
                  <>
                    <div className="font-bold text-amber-300">⚙️ MANTENIMIENTO PREDICTIVO: VIBRACIÓN</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Vibración en rodamiento superó umbral con <strong className="text-white">{vibracionMmS.toFixed(1)} mm/s</strong> y temp en carcasa a <strong className="text-amber-300">{tempMotorC}°C</strong>. Detección temprana de rozamiento (riesgo de clavado en ~15 días).
                    </p>
                  </>
                )}

                {activeTab === 'lacteos' && (
                  <>
                    <div className="font-bold text-amber-300">🥛 ALERTA CRÍTICA EN TANQUE DE LECHE</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {!agitadorActivo 
                        ? 'Se detectó detención del motor agitador con temperatura subiendo a 6.8°C. Riesgo de acidificación de la partida.' 
                        : 'Temperatura en 3.8°C y agitación normal. Próximo retiro estimado por cisterna: 06:00 AM.'}
                    </p>
                  </>
                )}

                {activeTab === 'avicola' && (
                  <>
                    <div className="font-bold text-amber-300">🚨 ALERTA: CAÍDA DE VENTILACIÓN EN TÚNEL</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Temperatura en galpón alcanzó <strong className="text-white">{tempGalponC.toFixed(1)}°C</strong> por desconexión en fase de extractores. Riesgo de asfixia o mortandad en menos de 40 minutos.
                    </p>
                  </>
                )}

                {activeTab === 'riego' && (
                  <>
                    <div className="font-bold text-amber-300">💥 CAÍDA ANÓMALA DE PRESIÓN EN MATRIZ</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Presión descendió a <strong className="text-white">{presionBar.toFixed(1)} bar</strong> con bomba encendida a plena potencia. Caudal disparado: rotura de caño troncal o válvula abierta.
                    </p>
                  </>
                )}

                {activeTab === 'fermentador' && (
                  <>
                    <div className="font-bold text-amber-300">❄️ DESVÍO TÉRMICO EN FERMENTACIÓN</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Fermentador subió a <strong className="text-white">{tempFermentadorC.toFixed(1)}°C</strong> (+2.5°C sobre la receta). Glicol sin retorno: levadura en estrés.
                    </p>
                  </>
                )}

                {activeTab === 'compresor' && (
                  <>
                    <div className="font-bold text-amber-300">💨 FUGA DE AIRE COMPRIMIDO FUERA DE TURNO</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Compresor encendió <strong className="text-white">{ciclosCompresorHora} veces</strong> en la última hora con la planta cerrada. Fuga estimada: ~350 L/min (~$180.000 ARS/mes).
                    </p>
                  </>
                )}

                {activeTab === 'generador' && (
                  <>
                    <div className="font-bold text-amber-300">🔋 BATERÍA DE ARRANQUE EN NIVEL CRÍTICO</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Tensión en batería de arranque cayó a <strong className="text-white">{bateriaVolts.toFixed(1)}V</strong>. El grupo electrógeno no podrá encender automáticamente en el próximo corte.
                    </p>
                  </>
                )}

                {activeTab === 'vacunas' && (
                  <>
                    <div className="font-bold text-amber-300">🚨 PUERTA DE HELADERA DE VACUNAS ABIERTA</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Sensor magnético detecta puerta abierta hace 14 minutos. Sonda subió a <strong className="text-white">{tempVacunasC.toFixed(1)}°C</strong>. Riesgo para biológicos sensibles.
                    </p>
                  </>
                )}

                {activeTab === 'cisterna' && (
                  <>
                    <div className="font-bold text-amber-300">💧 NIVEL DE CISTERNA CRÍTICO ANTES DE PICO</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Nivel en cisterna al <strong className="text-white">{nivelCisternaPct}%</strong>. Al ritmo actual no cubrirá la demanda de las 07:00 AM. Bomba elevadora con retardo.
                    </p>
                  </>
                )}
              </div>

              {/* Botones de Respuesta de 1 Clic */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400 block">
                  👉 TOCÁ UN BOTÓN PARA RESOLVER (Cero esfuerzo):
                </span>

                <div className="grid grid-cols-1 gap-1.5">
                  {(
                    activeTab === 'frio' ? ['Confirmar Alerta y Asistir al Local', 'Llamar a Técnico de Guardia'] :
                    activeTab === 'oee' ? ['Falta de Materia Prima', 'Cambio de Matriz en Curso', 'Avería Mecánica'] :
                    activeTab === 'silos' ? ['Solicitar Camión Tolva de Recarga', 'Consultar Silo Pulmón'] :
                    activeTab === 'vibracion' ? ['Programar Cambio de Rodamiento', 'Reengrasar Punto de Apoyo'] :
                    activeTab === 'lacteos' ? ['Llamar al Tambero de Guardia', 'Encender Compresor Auxiliar'] :
                    activeTab === 'avicola' ? ['Activar Generador de Emergencia', 'Bajar Cortinas de Túnel'] :
                    activeTab === 'riego' ? ['Detener Bomba Sumergible', 'Cerrar Válvula Troncal Sector 3'] :
                    activeTab === 'fermentador' ? ['Purgar Válvula de Glicol', 'Reiniciar Chiller'] :
                    activeTab === 'compresor' ? ['Cerrar Llave de Paso Sector Chapa', 'Programar Detección Acústica'] :
                    activeTab === 'generador' ? ['Conectar Cargador de Mantenimiento', 'Pedir Reposición de Gasoil'] :
                    activeTab === 'vacunas' ? ['Cerrar Puerta de Heladera', 'Mudar Dosis a Heladera Pulmón'] :
                    ['Conmutar a Bomba Auxiliar', 'Verificar Presión de Entrada Red']
                  ).map((motivo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleResponderWhatsApp(motivo)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                        whatsappResponse === motivo
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                          : 'bg-[#1f2c34] hover:bg-[#2a3942] text-cyan-300'
                      }`}
                    >
                      <span>{idx + 1}. {motivo}</span>
                      <span className="text-[10px] opacity-75">1 clic</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mensaje de Confirmación Instantáneo */}
              {whatsappResponse && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-400 text-xs font-mono text-emerald-200 space-y-1 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Acción Registrada: "{whatsappResponse}"</span>
                  </div>
                  <p className="text-[10px] text-emerald-300">
                    Resuelto en 1 segundo por el operador. Cero planillas, cero esfuerzo físico.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botón Directo para el Cliente B2B */}
          <div className="mt-3">
            <a
              href={whatsappLink(`Hola TecnoRosario, probé el simulador de Golondrina Automatización en la web para ${companyName || 'mi empresa'} y quiero coordinar una prueba piloto de 7 días.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Pedir Prueba Piloto de 7 Días en mi Empresa</span>
            </a>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ESPACIO GENEROSO + SECCIÓN DE LOS 12 LUGARES DE IMPLEMENTACIÓN
          ========================================================================= */}
      <div className="relative z-10 mt-14 sm:mt-16 pt-10 sm:pt-12 border-t border-slate-800/80">
        
        {/* Cabecera del Catálogo de Lugares con Espaciado Generoso */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>VERSATILIDAD INDUSTRIAL & COMERCIAL</span>
          </div>

          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            12 Lugares Reales Donde Podés Implementar Golondrina
          </h4>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Cualquier máquina, tanque o proceso físico donde una falla o detención no detectada a tiempo cueste plata o esfuerzo humano. <strong className="text-cyan-300">Tocá "Probar en Simulador" en cualquiera de ellos</strong> para ver exactamente cómo responde el sistema arriba:
          </p>
        </div>

        {/* Fila Independiente de Filtros con Desplazamiento Limpio */}
        <div className="mb-8 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 w-full">
          {[
            { id: 'todos', label: 'Todos (12 Casos)' },
            { id: 'agro', label: 'Agro & Tambos' },
            { id: 'alimentos', label: 'Alimentos & Frío' },
            { id: 'industria', label: 'Industria & Motores' },
            { id: 'logistica', label: 'Logística & Energía' },
            { id: 'salud', label: 'Salud & Clínicas' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedCategory(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                selectedCategory === f.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grilla de Lugares: TODOS CON PROBAR EN SIMULADOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {lugaresFiltrados.map((item) => {
            const Icon = item.icon;
            const isCurrentlySelectedInSim = activeTab === item.presetTab;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between group shadow-xl ${
                  isCurrentlySelectedInSim
                    ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-400 ring-1 ring-emerald-400/40'
                    : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10.5px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <h5 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {item.lugar}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.subtitulo}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">¿Dónde se conecta el sensor?</span>
                      <p className="text-slate-300 text-[11px] font-mono mt-0.5">{item.sensor}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">¿Qué detecta Golondrina?</span>
                      <p className="text-slate-200 text-xs leading-relaxed mt-0.5">{item.queDetecta}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-[11px] text-amber-200/90 leading-tight">
                      <strong className="text-amber-300 block text-[10px] font-mono uppercase tracking-wider mb-1">Riesgo o Pérdida Evitada:</strong>
                      {item.riesgoEvitado}
                    </div>
                  </div>
                </div>

                {/* Botones de Acción: Ambos activos en TODAS las tarjetas */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => irAlSimuladorConPreset(item.presetTab)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Probar en Simulador</span>
                    <span className="text-sm font-black">↑</span>
                  </button>
                  <a
                    href={whatsappLink(`${item.whatsappConsulta} Quiero evaluar una prueba piloto de 7 días.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Consultar</span>
                    <Send className="w-3 h-3 text-cyan-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Banner de Cierre: Consultar por Proceso Específico */}
      <div className="relative z-10 mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed">
            <strong className="text-white block text-sm sm:text-base mb-1">
              ¿Tu empresa tiene otra máquina, variable o proceso específico?
            </strong>
            Golondrina es 100% modular: el software y la telemetría se implementan de inmediato, y los módulos de hardware físico con sensores se fabrican <strong className="text-cyan-300">exclusivamente a demanda y por encargo</strong> para adaptarse a la maquinaria o tableros de tu empresa.
          </div>
        </div>
        <a
          href={whatsappLink('Hola TecnoRosario, tengo un proceso específico en mi empresa y quiero saber si lo puedo monitorear con Golondrina.')}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <span>Consultar por mi Máquina</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
