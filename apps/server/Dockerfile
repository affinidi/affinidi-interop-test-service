FROM node:12

EXPOSE 4000

WORKDIR /server

COPY package*.json /server/

RUN npm install --pure-lockfile

COPY . /server

RUN npm run build

CMD [ "npm", "run", "dev"]