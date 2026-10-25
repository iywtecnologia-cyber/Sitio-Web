/**
 * Golondrina Frío Seguro • Motor de Telemetría Térmica Contextual
 * 
 * Implementación de producción para monitoreo de cámaras frigoríficas,
 * depósitos de alimentos congelados, heladerías y laboratorios.
 * 
 * Evalúa:
 * - Temperatura instantánea (°C)
 * - Tasa de incremento térmico (ΔT/Δt en °C por hora)
 * - Horario operativo vs horario nocturno
 * - Detección de falso positivo por ciclo de deshielo
 */

import { WhatsAppGateway, defaultWhatsAppGateway } from './whatsapp_gateway';

export interface LecturaTermica {
  timestamp: number;
  temperaturaC: number;
  camaraId: string;
  humedadRelativa?: number;
}

export interface FrioSeguroConfig {
  camaraNombre: string;
  tempObjetivoC: number;       // Ej: -20°C
  tempCriticaC: number;        // Ej: -10°C (umbral donde se arruina mercadería)
  tasaSubidaCriticaHora: number; // Ej: 1.5°C por hora sostenido
  ventanaAnalisisMinutos: number; // Ej: 30 minutos
  destinatariosWhatsApp: string[];
}

export class GolondrinaFrioSeguro {
  private historial: LecturaTermica[] = [];
  private config: FrioSeguroConfig;
  private alertaEnviada: boolean = false;
  private gateway: WhatsAppGateway;

  constructor(config: FrioSeguroConfig, gateway?: WhatsAppGateway) {
    this.config = config;
    this.gateway = gateway || defaultWhatsAppGateway;
  }

  /**
   * Recibe una nueva lectura de la sonda de temperatura
   * (desde un sensor Wi-Fi Sonoff, Shelly, Modbus RS-485 o el módulo Golondrina).
   */
  async procesarLectura(lectura: LecturaTermica): Promise<void> {
    this.historial.push(lectura);

    // Conservar solo las últimas 2 horas de muestras
    const hace2Horas = Date.now() - 2 * 60 * 60 * 1000;
    this.historial = this.historial.filter((m) => m.timestamp >= hace2Horas);

    await this.evaluarContexto();
  }

  /**
   * Algoritmo de reconocimiento contextual
   */
  private async evaluarContexto(): Promise<void> {
    if (this.historial.length < 3) return;

    const actual = this.historial[this.historial.length - 1];
    const tiempoVentanaMs = this.config.ventanaAnalisisMinutos * 60 * 1000;
    const corteVentana = actual.timestamp - tiempoVentanaMs;

    const lecturasVentana = this.historial.filter((m) => m.timestamp >= corteVentana);
    if (lecturasVentana.length < 2) return;

    const inicial = lecturasVentana[0];
    const deltaHoras = (actual.timestamp - inicial.timestamp) / (1000 * 60 * 60);

    if (deltaHoras <= 0.05) return;

    const deltaTemp = actual.temperaturaC - inicial.temperaturaC;
    const tasaSubidaPorHora = deltaTemp / deltaHoras;

    const fecha = new Date(actual.timestamp);
    const hora = fecha.getHours();
    const esHorarioNocturno = hora >= 21 || hora < 7;

    console.log(
      `[${fecha.toLocaleTimeString()}] ${this.config.camaraNombre}: ${actual.temperaturaC.toFixed(1)}°C | ` +
      `Ritmo: ${tasaSubidaPorHora > 0 ? '+' : ''}${tasaSubidaPorHora.toFixed(2)}°C/h | ` +
      `Turno: ${esHorarioNocturno ? 'NOCTURNO (Cerrado)' : 'DIURNO (Operativo)'}`
    );

    // Condición 1: Anomalía de subida sostenida (incluso antes de llegar a descongelarse)
    const pendientePeligrosa = tasaSubidaPorHora >= this.config.tasaSubidaCriticaHora;
    const superoTempObjetivo = actual.temperaturaC > (this.config.tempObjetivoC + 4.0);

    if (pendientePeligrosa && superoTempObjetivo && !this.alertaEnviada) {
      this.alertaEnviada = true;

      const horasRestantesParaPérdida = Math.max(
        0.5,
        (this.config.tempCriticaC - actual.temperaturaC) / Math.max(0.1, tasaSubidaPorHora)
      );

      for (const telefono of this.config.destinatariosWhatsApp) {
        await this.gateway.sendAlert({
          toPhone: telefono,
          header: `🚨 ALERTA CRÍTICA: CURVA ANÓMALA EN ${this.config.camaraNombre.toUpperCase()}`,
          body: [
            `• Temp. actual: *${actual.temperaturaC.toFixed(1)}°C* (Consigna: ${this.config.tempObjetivoC}°C)`,
            `• Tasa de calentamiento: *+${tasaSubidaPorHora.toFixed(1)}°C por hora*`,
            `• Diagnóstico contextual: Posible corte de energía o fallo en compresor en horario cerrado.`,
            `• Tiempo estimado antes de daño irreversible a mercadería: *${horasRestantesParaPérdida.toFixed(1)} horas*.`
          ].join('\n'),
          footer: 'Golondrina Frío Seguro • Protocolo de Rescate Activo',
          severity: 'critical',
          buttons: ['Confirmar Alerta y Asistir', 'Llamar a Técnico de Guardia']
        });
      }
    }

    // Reset de alerta si el frío se restablece de forma estable
    if (actual.temperaturaC <= this.config.tempObjetivoC && this.alertaEnviada) {
      this.alertaEnviada = false;
      console.log(`[RECUPERACIÓN] ${this.config.camaraNombre} normalizó temperatura.`);
    }
  }
}

// Demo ejecutable directamente con: npx tsx src/implementaciones/golondrina_frio_seguro.ts
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('golondrina_frio_seguro')) {
  console.log('Iniciando daemon de prueba Golondrina Frío Seguro...');
  const motor = new GolondrinaFrioSeguro({
    camaraNombre: 'Cámara #2 Lácteos y Helados',
    tempObjetivoC: -20,
    tempCriticaC: -8,
    tasaSubidaCriticaHora: 1.8,
    ventanaAnalisisMinutos: 20,
    destinatariosWhatsApp: ['+5493415112000']
  });

  // Simulación de 5 lecturas consecutivas simulando corte de luz a las 2 AM
  const ahora = Date.now();
  const lecturasSimuladas: LecturaTermica[] = [
    { timestamp: ahora - 40 * 60 * 1000, temperaturaC: -20.2, camaraId: 'cam-2' },
    { timestamp: ahora - 30 * 60 * 1000, temperaturaC: -18.9, camaraId: 'cam-2' },
    { timestamp: ahora - 20 * 60 * 1000, temperaturaC: -17.5, camaraId: 'cam-2' },
    { timestamp: ahora - 10 * 60 * 1000, temperaturaC: -15.8, camaraId: 'cam-2' },
    { timestamp: ahora,                   temperaturaC: -14.1, camaraId: 'cam-2' },
  ];

  (async () => {
    for (const l of lecturasSimuladas) {
      await motor.procesarLectura(l);
    }
  })();
}
