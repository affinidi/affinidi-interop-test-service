Table of Contents
- [Welcome To the Affinidi Interop Service](#welcome-to-the-affinidi-interop-service)
- [Server](#server)
	- [Setup](#setup)
		- [Docker setup (preferred)](#docker-setup-preferred)
		- [local setup (less preferred)](#local-setup-less-preferred)
	- [Working with the Endpoints](#working-with-the-endpoints)
- [Clients](#clients)
	- [Issuer](#issuer)
		- [Setup](#setup-1)
		- [Run the client](#run-the-client)
	- [Wallet](#wallet)
		- [Setup](#setup-2)
			- [Pre-requisites](#pre-requisites)
			- [Run the client](#run-the-client-1)
			- [Run the App on a mobile device](#run-the-app-on-a-mobile-device)



# Welcome To the Affinidi Interop Service
The Interop Service is a set of server (REST API) and client (React/React Native) applications.

# Server
This service provides endpoints which facilitate interoprability with the Affinidi platform. For more details, check the API documentation at https://affinidi-interop-test-service.dev.affinity-project.org/api-docs/

Currently, it is used by the Bloom Wallet to easily perform certain checks and build various flows, such as:


## Setup
- request an API key at https://affinidi-project.org/register/interop
  - download the secrets bundle and unzip the file. Use the values in the env file later	
- create an EXPO account for yourself
- clone the repo
- create env file: `cp .env.example .env`
- fill up the values inside the `<< >>` from the Expo setup and the secrets bundle


### Docker setup (preferred)
- in the main folder of the affinidi-interop-test-service, type: `docker-compose up --build`
  - somehow the above doesnt work alone, so run: `docker system prune -a && docker-compose up --build`
- for running the Wallet client, follow the instructions under [Run the App on a mobile device](#run-the-app-on-a-mobile-device)


### local setup (less preferred)
This will start the server and SSR (server-side rendered) the issuer client
- install dependencies: `npm i && npm run bootstrap`
- build the server and issuer client and generate the routes, swagger docs, and build the package: `npm run build`
- start the server and issuer client: `npm run dev`
- run tests (if no changes have happened in the code): `npm test`
- run tests (if changes has happened in the service): `npm run build && npm test`


## Working with the Endpoints
To hit the endpoints of the interop backend service (api), follow these steps:
- download [Postman](https://www.postman.com/) 
- launch Postman and then import the postman collection and environment provided in the folder `./postman_collection` 



# Clients
## Issuer
- The Issuer client is a React App which allows interacting with the endpoints on the Server side, and to: 
  - check if a Did is resolvable, 
  - to demonstrate flows such as VC Claiming

- Access the Issuer at https://affinidi-interop-test-service.dev.affinity-project.org/clients/issuer
  - (replace `dev` for `staging`, `prod` etc to access other environments)



### Setup
This section is optional, since the Docker or local setup from [Setup](#setup) will serve the Issuer client as a static Server-side rendered app from the server. 

But if you want to run this client independently with hot-reload etc., then follow the instructions below.

### Run the client
In separate terminal
- go to the issuer folder: `cd apps/issuer`
- create env file: `cp .env.example .env`
- start client: `npm start`



## Wallet
The Wallet client is an Expo React Native App which allows an end user to: 
- request and claim a VC by scanning a QR code
- request and share a VP

### Setup
This step is optional, because the `docker-compose` command from [Docker setup (preferred)](#docker-setup-preferred) will spin up all the applications. But if you want to run this client independently with hot-reload etc., then follow the instructions below.

#### Pre-requisites

1. Install XCode iOS tools

2. Install global dependencies

```bash
	 npm install -g expo-cli
```

#### Run the client
- start client (in separate terminal): `cd apps/wallet && expo start --tunnel`

	- it will open the expo playground at `localhost:19002`
	- follow the instructions under [Run the App on a mobile device](#run-the-app-on-a-mobile-device)

#### Run the App on a mobile device
	- download the expo app on your mobile device
	- scan the QR code using your expo app
	- this will download the app to your mobile device 


more details: TODO in the PR NEP-647, NEP-649