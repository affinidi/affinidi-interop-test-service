FROM node:12

ARG EXPO_USERNAME
ARG EXPO_PASSWORD

EXPOSE 3001 19000 19001 19002

WORKDIR /interop

COPY package*.json app.json /interop/

RUN npm install --pure-lockfile
RUN npm i -g expo-cli

COPY . /interop

RUN expo login --username ${EXPO_USERNAME} --password ${EXPO_PASSWORD}

CMD [ "expo", "start", "--tunnel"]