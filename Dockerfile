# Dockerfile para frontend React
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

# Usar un servidor estático para servir el build
RUN npm install -g serve
EXPOSE 5001
CMD ["serve", "-s", "build", "-l", "5001"]
