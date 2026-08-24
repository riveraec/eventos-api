// BD de test ANTES de cargar app (si no, abre data/eventos.db).
const fs = require("fs");
const path = require("path");

const dbFile = path.join(__dirname, "..", "data", "test-eventos.db");
if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
}

process.env.DB_PATH = dbFile;

const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");

const body = {
    id: "evt-test-001",
    tipo: "pago.recibido",
    fuente: "caja-01",
    payload: { monto: 1500 },
};

test("POST /eventos valido -> 201", async () => {
    const res = await request(app).post("/eventos").send(body);
    assert.equal(res.status, 201);
    assert.equal(res.body.id, body.id);
});

test("POST mismo id -> 200", async () => {
    const res = await request(app).post("/eventos").send(body);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, body.id);
});

test("POST sin id -> 400", async () => {
    const res = await request(app)
        .post("/eventos")
        .send({ tipo: "pago.recibido", fuente: "caja-01", payload: {}});
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "validacion");
});

test("GET /eventos/:id inexistente → 404", async () => {
    const res = await request(app).get("/eventos/no-existe");
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "no_encontrado");
  });