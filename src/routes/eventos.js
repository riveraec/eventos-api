// Rutas de eventos: POST (ingesta) y GET (consulta).
const express = require("express");
const router = express.Router();
const service = require("../services/eventos-service");

// POST /eventos → crea un evento.
router.post("/eventos", (req, res) => {
    const resultado = service.crear(req.body);

    if (!resultado.ok) {
        return res.status(400).json({
            error: resultado.error,
            detalle: resultado.detalle
        });
    }

    // Solo POST 201/200. El 400 hace return antes; no usa error.js.
    console.log("POST /eventos", {
        id: resultado.evento.id,
        tipo: resultado.evento.tipo,
        duplicado: resultado.duplicado,
    });

    // 200 si es duplicado; 201 si es nuevo.
    const status = resultado.duplicado ? 200 : 201;
    res.status(status).json(resultado.evento);
});

// GET /eventos → lista. ?tipo= opcional (req.query.tipo).
// listar() ya es un array: res.json(resultado), no resultado.eventos.
router.get("/eventos", (req, res) => {
    const resultado = service.listar(req.query.tipo);
    res.json(resultado);
});

// GET /eventos/:id → uno; 404 si no está.
router.get("/eventos/:id", (req, res) => {
    const evento = service.obtener(req.params.id);
    if (!evento) {
        return res.status(404).json({
            error: "no_encontrado",
            detalle: `evento ${req.params.id} no existe`,
        });
    }
    res.json(evento);
});

module.exports = router;
