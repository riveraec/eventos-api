// Rutas de health: "¿el proceso responde?"
const express = require("express");
const router = express.Router();

// GET /health → 200 y { "status": "ok" }.
// _req no se usa; el guion bajo marca que es a propósito.
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
