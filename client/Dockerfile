FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force

COPY . ./
RUN npm run build

# Use lightweight image for production
FROM node:18-alpine AS runner
WORKDIR /app


COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
RUN npm install --production --force

EXPOSE 3000

CMD ["npm", "run", "start"]
