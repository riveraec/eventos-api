// Cliente demo: hace POST a la API. No es el servidor ni otro micro.
// Correr desde la raíz del proyecto, con npm start en otra terminal:
//   node scripts/emitir-evento.js evt-003
const url = process.env.EVENTOS_API_URL || "http://localhost:3000/eventos";
const id = process.argv[2] || "evt-demo-001";

async function main() {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id,
            tipo: "pago.recibido",
            fuente: "caja-01",
            payload: { monto: 1500 },
        }),
    });

    const texto = await res.text();
    console.log(res.status, texto);
}

main();
