FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY scripts ./scripts
COPY .env.example ./

ENV PORT=3000
ENV DB_PATH=./data/eventos.db

EXPOSE 3000
CMD ["node", "src/index.js"]