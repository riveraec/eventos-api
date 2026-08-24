// Punto de entrada del proceso: abre el puerto. Los tests importan app.js
// sin pasar por aquí, para no llamar a listen().
const app = require("./app");
// Puerto desde config.js (env PORT o 3000). No hardcodear aquí.
const { port } = require("./config");

app.listen(port, () => {
  console.log(`eventos-api en http://127.0.0.1:${port}`);
});