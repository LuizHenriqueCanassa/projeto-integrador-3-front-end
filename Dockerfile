FROM node:22-alpine as base

WORKDIR /src/app
COPY package*.json ./

EXPOSE 3000

FROM base as dev

ENV NODE_ENV=production

RUN npm install

COPY . .

CMD npm run start