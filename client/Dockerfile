FROM node:lts-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM node:lts-slim AS runner

WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

RUN npm install --production --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
