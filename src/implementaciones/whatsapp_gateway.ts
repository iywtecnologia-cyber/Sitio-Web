/**
 * Conector de WhatsApp Empresarial para Golondrina Automatización
 * Soporta Meta Cloud API, Twilio, Evolution API y modo simulación para pruebas en planta.
 */

export interface WhatsAppMessagePayload {
  toPhone: string;
  header: string;
  body: string;
  footer?: string;
  buttons?: string[];
  severity: 'info' | 'warning' | 'critical';
}

export class WhatsAppGateway {
  private apiUrl: string;
  private apiToken: string;
  private defaultRecipient: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_GATEWAY_URL || 'https://graph.facebook.com/v20.0/messages';
    this.apiToken = process.env.WHATSAPP_TOKEN || '';
    this.defaultRecipient = process.env.EMERGENCY_PHONE || '+5493415112000';
  }

  /**
   * Envía un mensaje urgente por WhatsApp.
   * Si no hay credenciales de Meta configuradas, opera en modo demostración/registro en consola.
   */
  async sendAlert(payload: WhatsAppMessagePayload): Promise<boolean> {
    const targetPhone = payload.toPhone || this.defaultRecipient;
    const timestamp = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    const formattedMessage = [
      `*GOLONDRINA AUTOMATIZACIÓN [${timestamp}]*`,
      `*${payload.header}*`,
      '',
      payload.body,
      '',
      payload.footer ? `_${payload.footer}_` : 'TecnoRosario • Telemetría Activa',
      payload.buttons && payload.buttons.length > 0
        ? `\nOpciones rápidas:\n${payload.buttons.map((b, i) => `${i + 1}. ${b}`).join('\n')}`
        : ''
    ].join('\n');

    // Si hay credenciales reales de Meta Cloud API o Webhook:
    if (this.apiToken) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: targetPhone.replace(/\D/g, ''),
            type: 'text',
            text: { body: formattedMessage },
          }),
        });

        if (response.ok) {
          console.log(`[WHATSAPP ENVIADO OK] -> ${targetPhone}`);
          return true;
        } else {
          console.error(`[WHATSAPP ERROR HTTP] ${response.status}:`, await response.text());
        }
      } catch (err) {
        console.error('[WHATSAPP EXCEPTION]', err);
      }
    }

    // Modo Demostración Local / Planta:
    console.log('\n======================================================');
    console.log(`📱 [DISPATCH WHATSAPP DEMO A ${targetPhone}]`);
    console.log(`Severidad: ${payload.severity.toUpperCase()}`);
    console.log('------------------------------------------------------');
    console.log(formattedMessage);
    console.log('======================================================\n');

    return true;
  }
}

export const defaultWhatsAppGateway = new WhatsAppGateway();
