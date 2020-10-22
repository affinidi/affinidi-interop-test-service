FROM node:12

# ARG EXPO_USERNAME
# ARG EXPO_PASSWORD

EXPOSE 19000 19001 19002

WORKDIR /wallet

COPY package*.json app.json /wallet/

RUN npm install --pure-lockfile
RUN npm i -g expo-cli

COPY . /wallet

# RUN expo login --username ${EXPO_USERNAME} --password ${EXPO_PASSWORD}

CMD [ "expo", "start", "--tunnel"]
