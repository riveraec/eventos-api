// BD de test ANTES de cargar app (si no, abre data/eventos.db).
const path = require("path");
process.env.DB_PATH = path.join(__dirname, "..", "data", "test-health.db");

const { test} = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");

test("GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
});