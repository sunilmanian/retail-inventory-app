FROM node:18-alpine

WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server .

RUN npm run build

CMD ["node", "dist/index.js"]
