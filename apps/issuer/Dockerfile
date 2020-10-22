FROM node:12

EXPOSE 3000
EXPOSE 35729

WORKDIR /web

COPY package*.json /web/

RUN npm install --pure-lockfile

COPY . /web

RUN npm run build

CMD [ "npm", "start"]
