// Reglas de negocio: validar y no duplicar por id.
// No toca req/res ni SQL.
const { eventoSchema } = require("../schemas");
const store = require("../store/eventos-store");

function crear(body)  {
    const resultado = eventoSchema.safeParse(body);

    if (!resultado.success) {
        const detalle =
            resultado.error.issues[0]?.message || "body invalido";
        return { ok: false, error: "validacion", detalle };
    }

    const data = resultado.data;
    const existente = store.getById(data.id);

    if (existente) {
        return { ok: true, duplicado: true, evento: existente };
    }

    const evento = store.insert(data);
    return { ok: true, duplicado: false, evento };
}

function listar(tipo) {
    // Array directo (no { eventos: [...] }). La ruta hace res.json de esto.
    return store.list({ tipo });
}

function obtener(id) {
    // Evento o null; 404 lo pone la ruta.
    return store.getById(id);
}

module.exports = { crear, listar, obtener };