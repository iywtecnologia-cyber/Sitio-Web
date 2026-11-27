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
