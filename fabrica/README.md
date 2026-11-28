# Fábrica de sistemas · Worker (Cloudflare + Claude)

API de `tecnoros.ar/crear`: entrevista de analista, generación de la primera versión y cambios en lenguaje natural.
La web funciona igual sin este Worker (modo guiado sin IA); con el Worker, la entrevista y los cambios los hace Claude.

## Cómo está armado

- `src/index.ts` — endpoints, CORS, tope de uso por IP y guardado de proyectos en D1.
- `src/claude.ts` — llamada a la API de Anthropic con salida estructurada (una herramienta obligatoria).
- `src/prompts.ts` — instrucciones del analista, del generador y del editor.
- `../src/fabrica/spec.ts` — la spec del sistema: tipos, validación y parches (la comparte con la web).
- `schema.sql` — tablas de D1.
- `prueba.ts` — pruebas sin red (Claude y D1 simulados): `npx tsx prueba.ts`.

## Puesta en marcha (una sola vez)

1. Cuenta de Cloudflare con el plan **Workers Paid** (US$5/mes) y la zona `tecnoros.ar` en Cloudflare.
2. En esta carpeta: `npx wrangler login`.
3. Crear la base: `npx wrangler d1 create tecnoros-fabrica` y pegar el `database_id` en `wrangler.toml`.
4. Crear las tablas: `npx wrangler d1 execute tecnoros-fabrica --remote --file=schema.sql`.
5. Cargar la clave de Claude: `npx wrangler secret put ANTHROPIC_API_KEY` (de console.anthropic.com; poné un límite de gasto mensual ahí).
6. Publicar: `npx wrangler deploy`. Queda en `https://fabrica.tecnoros.ar`.
7. En Render (sitio web) agregar la variable `VITE_FABRICA_API=https://fabrica.tecnoros.ar` y hacer **Deploy latest commit**.

## Variables

| Variable | Para qué |
| --- | --- |
| `MODELO` | Modelo de Claude (por defecto `claude-sonnet-5-5`) |
| `ORIGENES` | Webs que pueden llamar a la API |
| `LIMITE_DIARIO` | Llamadas por IP y por día (protege el gasto de IA) |
| `ANTHROPIC_API_KEY` | Secreto: clave de la API de Claude |
| `TURNSTILE_SECRET` | Secreto opcional para el antibots (etapa 2) |


> Esta carpeta no lleva `package.json` a propósito: el comando de build de Render busca el primer `package.json` del repo y, si encuentra uno acá, pisa el de la web y el deploy falla. Todo se corre con `npx`.

## Etapa 2: pagos, cambios con aprobación y programador invitado

- **Base ya creada con la etapa 1:** correr una vez las líneas de «Etapa 2» de `schema.sql` (los `ALTER TABLE` y la tabla `pagos`).
- **Mercado Pago (modo prueba):** en mercadopago.com.ar/developers creá una aplicación, copiá el *Access Token de prueba* y cargalo con `npx wrangler secret put MP_ACCESS_TOKEN`. Mientras `MP_MODO = "prueba"` en `wrangler.toml`, se usa el entorno de pruebas y no se cobra dinero real.
- **Aviso de pagos (webhook):** en la aplicación de Mercado Pago, Webhooks → URL `https://fabrica.tecnoros.ar/api/fabrica/pagos/aviso`, eventos *Pagos* y *Planes y suscripciones*. Copiá la clave secreta y cargala con `npx wrangler secret put MP_WEBHOOK_SECRET`.
- **Precios:** `PRECIO_ALTA` y `PRECIO_ABONO` en `wrangler.toml`. El precio siempre lo pone el servidor.
- **Salir a producción:** cambiar el secreto por el Access Token productivo y poner `MP_MODO = "produccion"`.
- **Transferencia:** en Render, variable `VITE_ALIAS_TRANSFERENCIA` con el alias de la cuenta (si no está, la web ofrece pedir los datos por WhatsApp).
- **Claves:** cada proyecto tiene una clave del dueño (guardar, aprobar, pagar) y otra del programador invitado (solo lectura con el detalle técnico). Un sistema se marca «pagado» únicamente cuando Mercado Pago lo confirma por el aviso.
