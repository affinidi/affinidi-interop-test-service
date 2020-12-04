Table of Contents
- [Welcome To the Affinidi Interop Service](#welcome-to-the-affinidi-interop-service)
  - [Clone the repo](#clone-the-repo)
  - [Setup](#setup)
  - [Run tests in Dokcer](#run-tests-in-dokcer)
  - [Launch the apps](#launch-the-apps)
  - [Run the Wallet App on a mobile device](#run-the-wallet-app-on-a-mobile-device)
  - [Working with the Endpoints](#working-with-the-endpoints)
  - [local setup (less preferred)](#local-setup-less-preferred)
    - [Pre-requisites for the Wallet App](#pre-requisites-for-the-wallet-app)



# Welcome To the Affinidi Interop Service
The Interop Service is a set of server (REST API) and client applications. Demo Web Client is a React App and Wallet App is a React Native app with QR scanning functionality. 

## Clone the repo
- `git clone git@github.com:affinityproject/affinidi-interop-test-service.git`
- create env file: `cp .env.example .env`
  - obtain your API Keys, for different environment as needed, at https://github.com/affinityproject/affinidi-core-sdk/tree/master/sdk/core#create-api-key 

## Setup
- to start the services, run one of the following docker command, as needed
  - to build and run all the services
  ```
  docker-compose up --build
  ```
  - Alternatively, to run services WITHOUT building: 
  ```
  docker-compose up
  ```

- Optional: for more specific needs, that is, to run lint fix, prune the docker system, and spin up all the apps: `npm run interop:docker`

## Run tests in Dokcer
- `docker-compose up tests`

## Launch the apps
- launch the apps using the following urls:
  - http://localhost:3001/interop for the Demo Web Client
  - http://0.0.0.0:19002 for Expo DevTools and the Wallet app
  - http://localhost:3000/v1 for the Interop API


## Run the Wallet App on a mobile device
- download the [Expo app](https://expo.io/tools) on your mobile device
- scan the QR code from the Expo DevTools, using your expo app (make sure its the Tunnel url)
- this will download the Wallet app to your mobile device 
  

## Working with the Endpoints
To hit the endpoints of the interop backend service (api), follow these steps:
- download [Postman](https://www.postman.com/) 
- launch Postman and then import the postman collection and environment provided in the folder `./postman_collection` 


## local setup (less preferred)
This will start the server and SSR (server-side rendered) the demo client
- go to the repo directory: `cd affinidi-interop-test-service`
- install dependencies: `npm i && lerna bootstrap`
- build the server, and generate the routes, swagger docs: `npm run build`
- start the server:
  ```
  cd apps/server
  npm run dev
  ```
- start Demo Web Client, in a separate terminal: 
  ```
  cd apps/issuer
  npm run dev
  ```
- run tests (if no changes have happened in the code): `ENVIRONMENT=test npm test`
- run tests (if changes has happened in the service): `npm run build && ENVIRONMENT=test npm test`

### Pre-requisites for the Wallet App

1. Install XCode iOS tools

2. Install global dependencies

```bash
	 npm install -g expo-cli
```