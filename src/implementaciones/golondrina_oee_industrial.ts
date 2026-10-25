/**
 * Golondrina OEE & Conteo Industrial • Motor de Productividad Contextual
 * 
 * Implementación de producción para monitoreo de líneas de mecanizado,
 * inyectoras de plástico, empaquetado y prensas.
 * 
 * Evalúa:
 * - Pulsos de piezas en línea (fotocélula o sensor inductivo)
 * - Tiempos muertos y paradas no declaradas (> 6 minutos)
 * - Consulta interactiva contextual por WhatsApp al supervisor
 * - Cálculo de OEE y resumen de turno
 */

import { WhatsAppGateway, defaultWhatsAppGateway } from './whatsapp_gateway';

export interface PulsoPieza {
  timestamp: number;
  lineaId: string;
  unidadesProducidas: number;
}

export interface OEEConfig {
  lineaNombre: string;
  tiempoCicloIdealSegundos: number; // Ej: 12 seg por pieza
  umbralParadaMinutos: number;       // Ej: 6 minutos sin piezas = Parada No Declarada
  telefonoSupervisor: string;
  metaPiezasPorTurno: number;        // Ej: 1200 piezas
}

export class GolondrinaOEEIndustrial {
  private config: OEEConfig;
  private totalPiezasTurno: number = 0;
  private ultimoPulsoTimestamp: number = Date.now();
  private paradaDetectadaNotificada: boolean = false;
  private gateway: WhatsAppGateway;

  constructor(config: OEEConfig, gateway?: WhatsAppGateway) {
    this.config = config;
    this.gateway = gateway || defaultWhatsAppGateway;
  }

  /**
   * Se llama cada vez que el sensor físico o fotocélula detecta una pieza terminada
   */
  registrarPulso(cantidad: number = 1): void {
    this.totalPiezasTurno += cantidad;
    this.ultimoPulsoTimestamp = Date.now();
    this.paradaDetectadaNotificada = false;

    console.log(
      `[PRODUCCIÓN] ${this.config.lineaNombre}: +${cantidad} pieza(s) | ` +
      `Total turno: ${this.totalPiezasTurno}/${this.config.metaPiezasPorTurno} ` +
      `(${((this.totalPiezasTurno / this.config.metaPiezasPorTurno) * 100).toFixed(1)}%)`
    );
  }

  /**
   * Loop periódico de supervisión (ejecutado cada 30-60 segundos por cron o timer)
   */
  async verificarCadencia(): Promise<void> {
    const ahora = Date.now();
    const minutosSinProduccion = (ahora - this.ultimoPulsoTimestamp) / (1000 * 60);

    if (minutosSinProduccion >= this.config.umbralParadaMinutos && !this.paradaDetectadaNotificada) {
      this.paradaDetectadaNotificada = true;

      const retrasoPiezas = Math.floor(
        (minutosSinProduccion * 60) / this.config.tiempoCicloIdealSegundos
      );

      console.warn(`[PARADA DETECTADA] ${this.config.lineaNombre} inactiva por ${minutosSinProduccion.toFixed(1)} min.`);

      await this.gateway.sendAlert({
        toPhone: this.config.telefonoSupervisor,
        header: `⚠️ PARADA DETECTADA EN ${this.config.lineaNombre.toUpperCase()}`,
        body: [
          `• Tiempo de inactividad continuo: *${Math.round(minutosSinProduccion)} minutos*`,
          `• Piezas no producidas durante el paro: *~${retrasoPiezas} unidades*`,
          `• Avance actual del turno: *${this.totalPiezasTurno} piezas* (${((this.totalPiezasTurno / this.config.metaPiezasPorTurno) * 100).toFixed(0)}% del objetivo).`,
          `• Por favor respondé para registrar la causa en el reporte OEE semanal.`
        ].join('\n'),
        footer: 'Golondrina OEE • Control de Eficiencia en Planta',
        severity: 'warning',
        buttons: ['Falta de Materia Prima', 'Cambio de Matriz / Setup', 'Avería Mecánica o Mantenimiento', 'Pausa Operativa']
      });
    }
  }

  /**
   * Genera el resumen consolidado de fin de turno
   */
  obtenerMetricasTurno() {
    return {
      linea: this.config.lineaNombre,
      piezas: this.totalPiezasTurno,
      meta: this.config.metaPiezasPorTurno,
      cumplimiento: (this.totalPiezasTurno / this.config.metaPiezasPorTurno) * 100,
    };
  }
}
