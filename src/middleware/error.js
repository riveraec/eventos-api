// Handler de errores HTTP (4 argumentos: Express lo reconoce así).
// No corre al npm start. Solo si un request lanza o llama next(err).
// 400/404 de las rutas no llegan aquí.
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const error = err.error || "interno";
    const detalle = err.detalle || err.message || "error interno";

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({ error, detalle });
}

module.exports = errorHandler;
