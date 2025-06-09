FROM node:18-alpine

WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client .

RUN npm run build

# Serve with static server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
