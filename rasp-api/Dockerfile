FROM node:8-alpine3.9

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]