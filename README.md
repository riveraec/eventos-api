# eventos-api

[![CI](https://github.com/riveraec/eventos-api/actions/workflows/ci.yml/badge.svg)](https://github.com/riveraec/eventos-api/actions/workflows/ci.yml)

API **Express** (Node.js) de **ingesta de eventos** (webhooks): valida el JSON con Zod, no duplica por `id`, persiste en SQLite y deja listar/consultar.

Pensada para recibir avisos de otros sistemas (`POST /eventos`), guardar el hecho y consultarlo después (`GET`). El `payload` se almacena tal cual; esta API no interpreta reglas de negocio del evento.

**Autor:** [Efrain Rivera](https://www.linkedin.com/in/riveraec/) · [Portafolio](https://riveraec.github.io/portafolio/)

---

## Stack

| Pieza | Uso |
|-------|-----|
| Node.js LTS | Runtime |
| Express 5 | HTTP / rutas |
| Zod | Validación del body |
| better-sqlite3 | Persistencia local |
| dotenv | `PORT`, `DB_PATH` |
| SuperTest + `node:test` | Tests HTTP |
| Docker / Compose | Misma API en contenedor |

---

## Endpoints

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/health` | Servicio vivo |
| `POST` | `/eventos` | Alta (201) o reuso si el `id` ya existe (200) |
| `GET` | `/eventos` | Lista; filtro opcional `?tipo=` |
| `GET` | `/eventos/:id` | Uno; 404 si no existe |

Tipos de evento en v1: `pago.recibido` · `pago.rechazado` · `aviso.operacion`.

Body de ejemplo:

```json
{
  "id": "evt-001",
  "tipo": "pago.recibido",
  "fuente": "caja-01",
  "payload": { "monto": 1500 }
}
```

---

## Requisitos

- Node.js LTS (`node --version`, `npm --version`)
- (Opcional) Docker Desktop + WSL 2 en Windows, para compose

---

## Instalación

```powershell
cd eventos-api
npm install
copy .env.example .env
```

(En `.env` puedes cambiar `PORT` y `DB_PATH`. El `.env` no va a git.)

---

## Correr en local

```powershell
npm start
# → http://127.0.0.1:3000
```

### Smoke (otra terminal)

```powershell
curl.exe http://127.0.0.1:3000/health

curl.exe -X POST http://127.0.0.1:3000/eventos -H "Content-Type: application/json" -d "{\"id\":\"evt-001\",\"tipo\":\"pago.recibido\",\"fuente\":\"caja-01\",\"payload\":{\"monto\":1500}}"

curl.exe http://127.0.0.1:3000/eventos
curl.exe http://127.0.0.1:3000/eventos/evt-001
curl.exe "http://127.0.0.1:3000/eventos?tipo=pago.recibido"
```

Repetir el mismo `POST` con el mismo `id` → **200** (idempotente), no un segundo insert.

### Emisor demo

Con la API arriba:

```powershell
node scripts/emitir-evento.js evt-003
node scripts/emitir-evento.js evt-003
```

Simula un emisor externo con un `POST` de ejemplo (equivalente a usar curl).

---

## Tests

No hace falta `npm start`. Usan BD temporal.

```powershell
npm test
```

---

## Docker

```powershell
docker compose up --build
```

Smoke igual contra `http://127.0.0.1:3000` (health + POST + GET).

**Nota:** la SQLite del contenedor vive en el **volume** `eventos-data` (`/app/data`), no en `./data` del repo (esa es la de `npm start` local). Valida con `GET /eventos`.

```powershell
docker compose down      # para; el volume se queda
docker compose down -v   # además borra el volume (BD limpia)
```

Publicar la imagen en Docker Hub (`docker push`) es **opcional** y no forma parte de este demo.

---

## Estructura (vista rápida)

```text
src/
  index.js              # listen
  app.js                # Express + rutas + error handler
  config.js             # PORT, DB_PATH
  schemas.js            # Zod
  routes/               # health, eventos
  services/             # crear / listar / obtener
  store/                # SQLite
  middleware/error.js
scripts/emitir-evento.js
tests/
Dockerfile · docker-compose.yml · .dockerignore
```

---

## Licencia

ISC
