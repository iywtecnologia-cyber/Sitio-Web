-- Fábrica de sistemas · base D1
CREATE TABLE IF NOT EXISTS proyectos (
  id TEXT PRIMARY KEY,
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado TEXT NOT NULL DEFAULT (datetime('now')),
  nombre TEXT NOT NULL,
  rubro TEXT,
  contacto TEXT,
  estado TEXT NOT NULL DEFAULT 'borrador' -- borrador | pagado | publicado | suspendido
);
CREATE TABLE IF NOT EXISTS versiones (
  proyecto TEXT NOT NULL REFERENCES proyectos(id),
  numero INTEGER NOT NULL,
  creada TEXT NOT NULL DEFAULT (datetime('now')),
  nota TEXT NOT NULL,
  spec TEXT NOT NULL,
  PRIMARY KEY (proyecto, numero)
);
CREATE TABLE IF NOT EXISTS entrevistas (
  proyecto TEXT PRIMARY KEY REFERENCES proyectos(id),
  historial TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS usos (
  ip TEXT NOT NULL,
  dia TEXT NOT NULL,
  llamadas INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, dia)
);

-- Etapa 2: claves de acceso, cambios con aprobación y pagos.
-- (En una base ya creada con la etapa 1, correr estas líneas una sola vez.)
ALTER TABLE proyectos ADD COLUMN clave TEXT;       -- del dueño: puede guardar, aprobar y pagar
ALTER TABLE proyectos ADD COLUMN clave_dev TEXT;   -- del programador invitado: solo lectura con detalle técnico
ALTER TABLE proyectos ADD COLUMN cambios TEXT;     -- historial de cambios pedidos (JSON)
ALTER TABLE proyectos ADD COLUMN email TEXT;
ALTER TABLE proyectos ADD COLUMN abono TEXT;       -- pendiente | activo | pausado | cancelado
CREATE TABLE IF NOT EXISTS pagos (
  mp_id TEXT PRIMARY KEY,
  proyecto TEXT NOT NULL REFERENCES proyectos(id),
  tipo TEXT NOT NULL,                              -- alta | abono
  estado TEXT NOT NULL,
  monto REAL NOT NULL,
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado TEXT NOT NULL DEFAULT (datetime('now'))
);
