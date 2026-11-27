# Fábrica de sistemas · Worker (Cloudflare + Claude)

API de `tecnoros.ar/crear`: entrevista de analista, generación de la primera versión y cambios en lenguaje natural.
La web funciona igual sin este Worker (modo guiado sin IA); con el Worker, la entrevista y los cambios los hace Claude.

## Cómo está armado

- `src/index.ts` — endpoints, CORS, tope de uso por IP y guardado de proyectos en D1.
- `src/claude.ts` — llamada a la API de Anthropic con salida estructurada (una herramienta obligatoria).
- `src/prompts.ts` — instrucciones del analista, del generador y del editor.
- `../src/fabrica/spec.ts` — la spec del sistema: tipos, validación y parches (la comparte con la web).
- `schema.sql` — tablas de D1.
- `prueba.ts` — pruebas sin red (Claude y D1 simulados): `npm test`.

## Puesta en marcha (una sola vez)

1. Cuenta de Cloudflare con el plan **Workers Paid** (US$5/mes) y la zona `tecnoros.ar` en Cloudflare.
2. En esta carpeta: `npm install --legacy-peer-deps` y `npx wrangler login`.
3. Crear la base: `npx wrangler d1 create tecnoros-fabrica` y pegar el `database_id` en `wrangler.toml`.
4. Crear las tablas: `npm run db:crear`.
5. Cargar la clave de Claude: `npx wrangler secret put ANTHROPIC_API_KEY` (de console.anthropic.com; poné un límite de gasto mensual ahí).
6. Publicar: `npm run deploy`. Queda en `https://fabrica.tecnoros.ar`.
7. En Render (sitio web) agregar la variable `VITE_FABRICA_API=https://fabrica.tecnoros.ar` y hacer **Deploy latest commit**.

## Variables

| Variable | Para qué |
| --- | --- |
| `MODELO` | Modelo de Claude (por defecto `claude-sonnet-5-5`) |
| `ORIGENES` | Webs que pueden llamar a la API |
| `LIMITE_DIARIO` | Llamadas por IP y por día (protege el gasto de IA) |
| `ANTHROPIC_API_KEY` | Secreto: clave de la API de Claude |
| `TURNSTILE_SECRET` | Secreto opcional para el antibots (etapa 2) |
