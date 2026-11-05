import 'dotenv/config';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { LIMITES, MODELO, historialSeguro, preguntarAGemini } from './gemini';

// Servidor mínimo del asistente con IA.
// - En desarrollo: corre en el puerto 3001 y Vite le pasa /api (ver vite.config.ts).
// - En producción (Render como Web Service): además sirve la web compilada de dist/.

const app = express();
const PUERTO = Number(process.env.PORT || process.env.PUERTO_API || 3001);

app.disable('x-powered-by');
// Render está detrás de un proxy: así req.ip es la IP real del visitante y no la del balanceador.
app.set('trust proxy', 1);
app.use(express.json({ limit: '16kb' }));

// ── Límites de uso ──────────────────────────────────────────────────────────
// En memoria: alcanzan para un solo proceso. Protegen la cuota y la factura de Gemini.
const POR_IP = { max: 20, ventanaMs: 10 * 60 * 1000 };
const POR_DIA = Number(process.env.ASISTENTE_MAX_DIA || 1500);

const usos = new Map<string, number[]>();
let dia = new Date().toDateString();
let usosHoy = 0;

const superoLimite = (ip: string): string | null => {
  const hoy = new Date().toDateString();
  if (hoy !== dia) {
    dia = hoy;
    usosHoy = 0;
    usos.clear();
  }
  if (usosHoy >= POR_DIA) return 'dia';
  const ahora = Date.now();
  const recientes = (usos.get(ip) ?? []).filter((t) => ahora - t < POR_IP.ventanaMs);
  if (recientes.length >= POR_IP.max) return 'ip';
  recientes.push(ahora);
  usos.set(ip, recientes);
  usosHoy++;
  return null;
};

app.post('/api/asistente', async (req, res) => {
  const pregunta = typeof req.body?.pregunta === 'string' ? req.body.pregunta.trim() : '';
  if (!pregunta) return res.status(400).json({ error: 'pregunta vacía' });
  if (pregunta.length > LIMITES.pregunta) return res.status(413).json({ error: 'pregunta demasiado larga' });

  const limite = superoLimite(req.ip ?? 'desconocida');
  if (limite) return res.status(429).json({ error: limite === 'ip' ? 'demasiadas consultas' : 'cupo diario agotado' });

  try {
    const r = await preguntarAGemini(pregunta, historialSeguro(req.body?.historial));
    res.json(r);
  } catch (e) {
    // No se loguea el contenido de la charla: sólo el error, para poder diagnosticar.
    console.error(`[asistente] ${e instanceof Error ? e.message : String(e)}`.slice(0, 300));
    // El front cae a la respuesta local ante cualquier error: no hace falta dar detalle.
    res.status(502).json({ error: 'no disponible' });
  }
});

app.get('/api/salud', (_req, res) => res.json({ ok: true, ia: Boolean(process.env.GEMINI_API_KEY), modelo: MODELO }));

// ── Web compilada (sólo si existe dist/, o sea en producción) ─────────────────
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
app.use(express.static(dist, { index: false, maxAge: '1h' }));
app.get(/^(?!\/api\/).*/, (_req, res, next) => res.sendFile(path.join(dist, 'index.html'), (err) => err && next()));

app.listen(PUERTO, () => {
  console.log(`[asistente] API en http://localhost:${PUERTO} · modelo ${MODELO} · key ${process.env.GEMINI_API_KEY ? 'cargada' : 'FALTA'}`);
});
