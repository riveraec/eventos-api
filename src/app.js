// App Express: rutas y middleware. No abre el puerto (eso es index.js).
const express = require("express");
const health = require("./routes/health");
const eventos = require("./routes/eventos");
const errorHandler = require("./middleware/error");

const app = express();

// Convierte el body JSON de cada request en un objeto (req.body).
app.use(express.json());

// Monta las rutas de health.js (GET /health).
app.use(health);
// Monta las rutas de eventos.js (POST y GET /eventos).
app.use(eventos);

// Errores no manejados de un request → JSON { error, detalle }.
app.use(errorHandler);

module.exports = app;
