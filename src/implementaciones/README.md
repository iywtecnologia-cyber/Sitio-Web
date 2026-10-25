# Guía de Implementación en Planta: Golondrina Automatización (TecnoRosario)

Este directorio contiene el **código de implementación real y autónomo** para desplegar los sistemas de Golondrina Automatización en clientes reales (cámaras frigoríficas, líneas de producción y silos).

---

## 🏗️ Arquitectura de Funcionamiento

Cualquier implementación de Golondrina se compone de 3 elementos:

```
[1. Sensor en Planta]  ──(Wi-Fi / Modbus / USB)──>  [2. Daemon Golondrina (Node/TS)]  ──(HTTPS)──>  [3. WhatsApp / Celular]
 • Sensor térmico DS18B20 / Sonoff                     • Evalúa el contexto (horario, ΔT)              • Alerta de rescate
 • Fotocélula NPN o botón de pulso                     • Detecta paradas no declaradas                 • Pregunta causa de parada
 • Sensor ToF láser o ultrasonido                      • Proyecta quiebre de stock                     • Reporte semanal PDF
 • O módulo físico Golondrina (Riel DIN)
```

---

## 📁 Archivos de Implementación en este Directorio

| Archivo | Solución | Qué hace |
| :--- | :--- | :--- |
| `golondrina_frio_seguro.ts` | **Golondrina Frío Seguro** | Monitorea temperatura en tiempo real, calcula la tasa de subida térmica por hora ($\Delta T/\Delta t$), filtra ciclos de deshielo automático y dispara llamada/alerta de rescate por WhatsApp. |
| `golondrina_oee_industrial.ts` | **Golondrina OEE Industrial** | Cuenta pulsos de piezas en línea, detecta pausas mayores a 6 min durante turnos activos y despacha consultas interactivas de causas de paro. |
| `golondrina_silos_proactivo.ts` | **Golondrina Silos & Tolvas** | Lee nivel o distancia volumétrica, calcula la regresión de consumo por hora y proyecta con anticipación la hora exacta de vaciado. |
| `whatsapp_gateway.ts` | **Conector WhatsApp** | Envía mensajes y alertas formateadas usando Meta Cloud API, Twilio, Evolution API o webhook local de prueba. |

---

## 🚀 Cómo ponerlo a funcionar en 15 minutos en el cliente

### Opción A: Prueba de Concepto Inmediata (Sin comprar ningún hardware aún)
Podés instalar el script en cualquier computadora con Windows o Linux que el cliente tenga en la oficina o planta:

1. Clonar o copiar esta carpeta en la computadora:
   ```bash
   cd src/implementaciones
   ```
2. Instalar dependencias necesarias (TypeScript/Node):
   ```bash
   npm install
   ```
3. Ejecutar el script deseado con variables de entorno:
   ```bash
   # Para probar Frío Seguro en modo simulación o con sensor HTTP:
   npx tsx golondrina_frio_seguro.ts
   ```

### Opción B: Conexión con Sensores Físicos de Bajo Costo (Setup de $15 - $30 USD)
Para hacer la instalación real en una cámara frigorífica o máquina:
* **Para Frío Seguro:** 
  * Se puede usar un sensor Wi-Fi con sonda sumergible de acero inoxidable (ej: Sonoff TH16 / Elite con sonda DS18B20, o Shelly Plus 1PM con add-on de temperatura). 
  * El sensor envía la lectura por HTTP o MQTT a la computadora local donde corre `golondrina_frio_seguro.ts`.
* **Para OEE Industrial:**
  * Se conecta una fotocélula infrarroja de paso o un sensor inductivo NPN (de $8.000 a $20.000 ARS en MercadoLibre) a un conversor USB-Serial / ESP32 o al módulo Golondrina. Cada vez que pasa una pieza, el script incrementa el contador.
* **Para Silos:**
  * Se instala un sensor ToF láser o ultrasónico (0-5m o 0-10m) en la boca superior del silo conectado por 4-20mA o RS-485 Modbus.

### Opción C: Con el Módulo Físico Propio Golondrina (TecnoRosario)
* El cliente adquiere el **Controlador Riel DIN Golondrina** (el gabinete negro con conectores dorados y pantalla OLED).
* Se monta en el riel DIN del tablero eléctrico.
* Conecta las sondas directamente a sus terminales de tornillo dorados (borneras industriales) y se enlaza por cable Ethernet o Wi-Fi directo al software.

---

## ⚙️ Configuración de Alertas por WhatsApp

El archivo `whatsapp_gateway.ts` permite configurar:
* **Número de destino del encargado:** `DESTINATION_PHONE=+549341xxxxxxx`
* **Proveedor de WhatsApp:**
  * **Meta Cloud API Oficial:** Necesitás tu Token de Meta Developers y Phone Number ID.
  * **Twilio:** Account SID y Auth Token.
  * **Evolution API / Baileys (Gratis y Libre):** Servidor propio de WhatsApp Web en Node.js que no cobra por mensaje.
  * **Modo Consola (Default):** Imprime la alerta en pantalla con colores para pruebas y demos sin costo.
