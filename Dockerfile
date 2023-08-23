# ./Dockerfile
FROM node:18 AS base
WORKDIR /src
COPY ./package.json .

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn prisma generate

EXPOSE 3000
CMD [ "node", "server.js" ]
