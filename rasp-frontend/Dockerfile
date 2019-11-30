FROM node:8-alpine3.9

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4000

CMD ["node", "server.js"]