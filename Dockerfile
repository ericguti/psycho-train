FROM node:lts-alpine3.19
LABEL authors="guti"

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY ./ ./

RUN npm install --global http-server

RUN npm run build

EXPOSE 8080

CMD ["http-server", "dist"]
