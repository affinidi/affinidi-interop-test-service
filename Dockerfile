# Build the Demo Web Client
FROM node:12 AS client-build

WORKDIR /web
COPY ./apps/issuer/package*.json ./
RUN npm install --silent
COPY ./apps/issuer .

RUN npm run build


# Build the server, and serve the web client statically
FROM node:12 AS server-build

# Variables which are coming from the docker build command (e.g github secrets, or docker-compose)
ARG ENVIRONMENT

# Environment variables for the Server
ENV PORT 3000
ENV ENVIRONMENT ${ENVIRONMENT}

WORKDIR /apps
COPY ./apps/server/package*.json /apps/server/
COPY ./apps/server /apps/server/
COPY --from=client-build /web /apps/server/client/

WORKDIR /apps/server
RUN npm install --silent
RUN npm run build

ENV NODE_ENV production  

EXPOSE ${PORT}