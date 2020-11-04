# Build the Demo Web Client
FROM node:12 AS client-build

ARG PUBLIC_URL

WORKDIR /web
COPY ./apps/issuer/package*.json ./
RUN npm install --silent
COPY ./apps/issuer .

RUN PUBLIC_URL=${PUBLIC_URL} npm run build


# Build the server, and serve the web client statically
FROM node:12 AS server-build

# Variables which are coming from the docker build command (e.g github secrets, or docker-compose)
ARG ENVIRONMENT
ARG PUBLIC_URL

# Environment variables for the Server
ENV PORT 3000
ENV ENVIRONMENT ${ENVIRONMENT}

WORKDIR /apps
COPY ./apps/server/package*.json /apps/server/
COPY ./apps/server /apps/server/

WORKDIR /apps/server
RUN npm install --silent
RUN PUBLIC_URL=${PUBLIC_URL} npm run build

COPY --from=client-build /web/build/ /apps/server/dist/public/

ENV NODE_ENV production  

EXPOSE ${PORT}