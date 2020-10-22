Table of Contents
- [Welcome To the Affinidi Interop Service](#welcome-to-the-affinidi-interop-service)
  - [Environment Variables](#environment-variables)
  - [Setup](#setup)
  - [local setup (less preferred)](#local-setup-less-preferred)
    - [Pre-requisites for the Wallet App](#pre-requisites-for-the-wallet-app)
  - [Run the App on a mobile device](#run-the-app-on-a-mobile-device)
  - [Working with the Endpoints](#working-with-the-endpoints)



# Welcome To the Affinidi Interop Service
The Interop Service is a set of server (REST API) and client applications. Demo Web Client is a React App and Wallet App is a React Native app with QR scanning functionality. 

## Environment Variables
- create env file: `cp .env.example .env`
- Internal Affinidi Devs: copy the file contents from 1Password under the note `Interop Service Secrets`
- 3rd party Devs: Join Affinidi slack at `affinidicommunity.slack.com` and ask a friendly engineer in the channel `#open-source-dev` for secrets

## Setup
- run the docker commands
  - to run lint fix, prune the docker system, and spin up all the apps: `npm run interop:docker`
  - to build and run all the services: `docker-compose up --build`
  - to run services without building: `docker-compose up`
- launch the apps using the following urls:
  - http://localhost:4000 (for the Interop API Server with statically rendered Demo Web Client)
  - http://0.0.0.0:19002 (for Expo DevTools and the Wallet app)
  
- Optionally,
  - http://localhost:3000 (for Demo Web Client in warm-reload setting)


## local setup (less preferred)
This will start the server and SSR (server-side rendered) the demo client
- install dependencies: `npm i && npm run bootstrap`
- build the server and issuer client and generate the routes, swagger docs, and build the package: `npm run build`
- start the server and issuer client: `npm run dev`
- run tests (if no changes have happened in the code): `ENVIRONMENT=test npm test`
- run tests (if changes has happened in the service): `npm run build && ENVIRONMENT=test npm test`

### Pre-requisites for the Wallet App

1. Install XCode iOS tools

2. Install global dependencies

```bash
	 npm install -g expo-cli
```

## Run the App on a mobile device
	- download the expo app on your mobile device
	- scan the QR code using your expo app
	- this will download the app to your mobile device 
	- 

## Working with the Endpoints
To hit the endpoints of the interop backend service (api), follow these steps:
- download [Postman](https://www.postman.com/) 
- launch Postman and then import the postman collection and environment provided in the folder `./postman_collection` 
