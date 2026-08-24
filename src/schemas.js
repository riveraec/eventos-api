// Contrato del JSON de un evento (lo que llegará en POST /eventos).
const { z } = require("zod");

const eventoSchema = z.object({
  // Identificador único. Si llega dos veces el mismo id, no se duplica (idempotencia).
  id: z.string().min(1),
  // Qué pasó. Solo estos tres valores en v1.
  tipo: z.enum(["pago.recibido", "pago.rechazado", "aviso.operacion"]),
  // Quién envía el aviso (caja, otro servicio, etc.).
  fuente: z.string().min(1),
  // Detalle variable del hecho: monto, moneda, etc.
  // Esta API no calcula ni interpreta el negocio; solo guarda el objeto.
  // {} vacío es válido. passthrough() deja pasar claves extra (si no, Zod las quita).
  payload: z.object({}).passthrough(),
});

module.exports = { eventoSchema };
