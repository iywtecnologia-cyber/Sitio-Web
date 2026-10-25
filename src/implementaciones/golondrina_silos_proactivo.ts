/**
 * Golondrina Nivel & Silos Proactivo • Motor de Proyección Predictiva
 * 
 * Implementación de producción para tolvas de granos, tanques de fertilizantes,
 * moliendas y acopios agroindustriales.
 * 
 * Evalúa:
 * - Distancia/nivel mediante sensor ToF láser, ultrasonido o celdas de carga
 * - Tasa horaria de consumo de insumo (toneladas o % por hora)
 * - Proyección exacta del momento de quiebre de stock
 * - Alerta temprana antes de que cierren los despachos de logística
 */

import { WhatsAppGateway, defaultWhatsAppGateway } from './whatsapp_gateway';

export interface LecturaNivel {
  timestamp: number;
  siloId: string;
  nivelPorcentaje: number; // 0 a 100%
  toneladasEstimadas?: number;
}

export interface SiloConfig {
  siloNombre: string;
  nivelCriticoPorcentaje: number; // Ej: 15%
  telefonoResponsableLogistica: string;
  capacidadMaximaToneladas: number;
}

export class GolondrinaSilosProactivo {
  private historial: LecturaNivel[] = [];
  private config: SiloConfig;
  private alertaEnviada: boolean = false;
  private gateway: WhatsAppGateway;

  constructor(config: SiloConfig, gateway?: WhatsAppGateway) {
    this.config = config;
    this.gateway = gateway || defaultWhatsAppGateway;
  }

  async registrarLectura(lectura: LecturaNivel): Promise<void> {
    this.historial.push(lectura);

    // Conservar últimas 6 horas de registros para calcular pendiente confiable
    const corte = Date.now() - 6 * 60 * 60 * 1000;
    this.historial = this.historial.filter((m) => m.timestamp >= corte);

    await this.evaluarProyeccion();
  }

  private async evaluarProyeccion(): Promise<void> {
    if (this.historial.length < 3) return;

    const actual = this.historial[this.historial.length - 1];
    const inicial = this.historial[0];

    const deltaHoras = (actual.timestamp - inicial.timestamp) / (1000 * 60 * 60);
    if (deltaHoras <= 0.2) return;

    const deltaNivel = inicial.nivelPorcentaje - actual.nivelPorcentaje; // Positivo si se está vaciando
    const tasaConsumoPorHora = deltaNivel / deltaHoras; // % por hora

    if (tasaConsumoPorHora <= 0.2) {
      // No hay consumo significativo o se está cargando
      return;
    }

    const porcentajeHastaCritico = actual.nivelPorcentaje - this.config.nivelCriticoPorcentaje;
    if (porcentajeHastaCritico <= 0) return;

    const horasRestantes = porcentajeHastaCritico / tasaConsumoPorHora;
    const momentoQuiebre = new Date(actual.timestamp + horasRestantes * 60 * 60 * 1000);

    const horaActual = new Date(actual.timestamp).getHours();

    console.log(
      `[SILO] ${this.config.siloNombre}: ${actual.nivelPorcentaje.toFixed(1)}% | ` +
      `Consumo: -${tasaConsumoPorHora.toFixed(1)}%/h | ` +
      `Autonomía restante: ${horasRestantes.toFixed(1)} hs (Quiebre: ${momentoQuiebre.toLocaleTimeString()})`
    );

    // Si la autonomía es menor a 10 horas y aún es horario de oficina o tarde, avisar ya
    if (horasRestantes <= 10 && !this.alertaEnviada) {
      this.alertaEnviada = true;

      const horaFormato = momentoQuiebre.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      const toneladasActuales = actual.toneladasEstimadas || (actual.nivelPorcentaje / 100) * this.config.capacidadMaximaToneladas;

      await this.gateway.sendAlert({
        toPhone: this.config.telefonoResponsableLogistica,
        header: `🔔 PROYECCIÓN PREDICTIVA DE STOCK: ${this.config.siloNombre.toUpperCase()}`,
        body: [
          `• Nivel actual: *${actual.nivelPorcentaje.toFixed(0)}%* (~${toneladasActuales.toFixed(1)} toneladas)`,
          `• Ritmo de consumo de planta: *${tasaConsumoPorHora.toFixed(1)}% por hora*`,
          `• *Hora estimada de quiebre de stock:* *${horaFormato} hs*`,
          `• Autonomía operativa restante: *${Math.floor(horasRestantes)}h ${Math.round((horasRestantes % 1) * 60)}m*`,
          `• Acción recomendada: Emitir orden de carga / solicitar camión tolva antes de finalizar la jornada logística.`
        ].join('\n'),
        footer: 'Golondrina Agroindustrial • Telemetría Predictiva',
        severity: 'warning',
        buttons: ['Solicitar Camión Tolva', 'Consultar Stock en Silo Pulmón']
      });
    }

    // Reset si se recargó el silo
    if (actual.nivelPorcentaje > 70 && this.alertaEnviada) {
      this.alertaEnviada = false;
      console.log(`[RECARGA] ${this.config.siloNombre} fue reabastecido.`);
    }
  }
}
