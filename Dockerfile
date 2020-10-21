FROM node:12

# Variables which are coming from the docker build command (e.g github secrets, or docker-compose)
ARG ENVIRONMENT

# Environment variables for the Server
ENV PORT 3000
ENV ENVIRONMENT ${ENVIRONMENT}

# Environment variables for the Issuer React app
ENV REACT_APP_ENVIRONMENT ${ENVIRONMENT}

WORKDIR /usr/src/app

RUN npm i lerna -g --loglevel notice
COPY package.json .
RUN npm install

COPY bin ./bin
COPY apps/server ./apps/server
COPY apps/issuer ./apps/issuer

COPY lerna.json .
RUN npm run bootstrap

# build the server and issuer apps
RUN npm run build

ENV NODE_ENV production  
# must keep this `ENV NODE_ENV production` after the `npm run bootstrap`, 
# and the value must be production

EXPOSE ${PORT}
