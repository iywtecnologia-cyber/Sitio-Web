// Configuración de Golondrina (100% configurable): se guarda en el navegador y la comparten
// la tarjeta de arriba de todo (lo primero que ve el cliente) y el escenario de los asistentes.
import { useEffect, useState } from 'react';

// Lo que se puede automatizar (se elige al configurar Golondrina).
export const AUTOMATIZABLE: [string, string, string][] = [
  ['whatsapp', '💬', 'Responder el WhatsApp solo, a cualquier hora.'],
  ['turnos', '📅', 'Dar turnos y mandar recordatorios.'],
  ['stock', '📦', 'Avisarte cuando falta stock o algo se rompe.'],
  ['presupuestos', '🧾', 'Armar presupuestos y facturas sin planillas.'],
  ['clientes', '👥', 'Seguir a cada cliente: quién compró, a quién llamar.'],
  ['tablero', '📊', 'Juntar los números del día en un solo tablero.'],
];
export interface ConfigGolondrina {
  configurada: boolean;
  registrar: boolean;
  repetir: boolean;
  destino: boolean;
  automatizar: string[];
  rubro?: string;
  avisos?: string[];
}
export const CONFIG_INICIAL: ConfigGolondrina = { configurada: false, registrar: true, repetir: true, destino: true, automatizar: [], rubro: '', avisos: ['web'] };

export const RUBROS = ['Comercio', 'Salud y turnos', 'Industria y planta', 'Servicios', 'Gastronomía', 'Otro'];
export const AVISOS: [string, string][] = [['web', 'En la web'], ['whatsapp', 'Por WhatsApp'], ['email', 'Por e-mail']];
export const leerConfig = (): ConfigGolondrina => {
  try {
    return { ...CONFIG_INICIAL, ...JSON.parse(localStorage.getItem('golondrina-config') ?? '{}') };
  } catch {
    return CONFIG_INICIAL;
  }
};


const EV_CONFIG = 'golondrina-config-cambio';
const EV_ABRIR = 'golondrina-config-abrir';

export const guardarConfig = (c: ConfigGolondrina) => {
  try {
    localStorage.setItem('golondrina-config', JSON.stringify(c));
  } catch { /* sin almacenamiento: vale para esta visita */ }
  window.dispatchEvent(new CustomEvent(EV_CONFIG, { detail: c }));
};

/** Abre la configuración de arriba de todo y lleva la pantalla hasta ahí. */
export const abrirConfigGolondrina = () => window.dispatchEvent(new CustomEvent(EV_ABRIR));
export const alPedirConfig = (fn: () => void) => {
  window.addEventListener(EV_ABRIR, fn);
  return () => window.removeEventListener(EV_ABRIR, fn);
};

/** La configuración actual, siempre al día en todos los lugares donde se usa. */
export const useConfigGolondrina = () => {
  const [config, setConfig] = useState<ConfigGolondrina>(leerConfig);
  useEffect(() => {
    const act = (e: Event) => setConfig((e as CustomEvent<ConfigGolondrina>).detail);
    window.addEventListener(EV_CONFIG, act);
    return () => window.removeEventListener(EV_CONFIG, act);
  }, []);
  return config;
};
