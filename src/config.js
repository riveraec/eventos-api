// Lee variables de entorno. El resto del código importa este módulo;
// no lee process.env por su cuenta.
require("dotenv").config();

// PORT llega como texto; Number() lo convierte. Si falta o es 0, usa 3000.
const port = Number(process.env.PORT) || 3000;

// Ruta del archivo SQLite. Aún no se abre aquí (eso es el store, paso 4).
const dbPath = process.env.DB_PATH || "./data/eventos.db";

module.exports = { port, dbPath };
