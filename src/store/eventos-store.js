// Persistencia SQLite. No habla HTTP ni Zod (eso es el service / las rutas).
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { dbPath } = require("../config");

// Ruta absoluta; crea data/ si no existe.
const resolvedPath = path.resolve(dbPath);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS eventos (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL,
    fuente TEXT NOT NULL,
    payload TEXT NOT NULL,
    creado_en TEXT NOT NULL
  )
`);

function getById(id) {
  const row = db
    .prepare(`SELECT id, tipo, fuente, payload, creado_en FROM eventos WHERE id = ?`)
    .get(id);

  if (!row) return null;

  // payload se guarda como texto; al leer vuelve a ser objeto.
  return {
    id: row.id,
    tipo: row.tipo,
    fuente: row.fuente,
    payload: JSON.parse(row.payload),
    creado_en: row.creado_en,
  };
}

function insert(evento) {
  db.prepare(`
    INSERT INTO eventos (id, tipo, fuente, payload, creado_en)
    VALUES (@id, @tipo, @fuente, @payload, @creado_en)
  `).run({
    id: evento.id,
    tipo: evento.tipo,
    fuente: evento.fuente,
    payload: JSON.stringify(evento.payload),
    creado_en: new Date().toISOString(),
  });

  return getById(evento.id);
}

// tipo opcional: si viene, filtra; si no, lista todos.
function list({ tipo } = {}) {
  const sql = tipo
    ? `SELECT id, tipo, fuente, payload, creado_en FROM eventos WHERE tipo = ? ORDER BY creado_en DESC`
    : `SELECT id, tipo, fuente, payload, creado_en FROM eventos ORDER BY creado_en DESC`;

  const rows = tipo ? db.prepare(sql).all(tipo) : db.prepare(sql).all();

  return rows.map((row) => ({
    id: row.id,
    tipo: row.tipo,
    fuente: row.fuente,
    payload: JSON.parse(row.payload),
    creado_en: row.creado_en,
  }));
}

module.exports = { insert, getById, list };
