Table of Contents
- [Description](#description)
- [Motivation](#motivation)
- [Background](#background)
  - [What is SSI?](#what-is-ssi)
    - [Role of Blockchain in SSI](#role-of-blockchain-in-ssi)
  - [Interop from Holders point of view](#interop-from-holders-point-of-view)
  - [Interop from the point of view of developers of Wallets, Issuers, Verifiers](#interop-from-the-point-of-view-of-developers-of-wallets-issuers-verifiers)
- [Welcome To the Affinidi Interop Service](#welcome-to-the-affinidi-interop-service)
- [Server](#server)
- [Clients](#clients)
  - [Issuer](#issuer)
  - [Wallet](#wallet)
- [Setup](#setup)

# Description
To facilitate testing Affinidi SDK offerings, and build a successful end-user collaboration and a POC for 3rd party integration, Affinidi has provided interoperability standards for application developers to target.  

The Interop Service is a set of server and client applications describe in detail in their respective sections.

# Motivation
The purpose of this Service is two-fold:
- to provide access to the Affiniti Platform via the open source REST API ([Server](#server)) which abstracts away the details of using an SDK.
  - this API can be used by 3rd parties, such as developers and organizations who want to build wallet clients or verifier and issuer services 
- to help onboard 3rd party development teams, and demonstrate (using the [Issuer](#issuer) client and [Wallet](#wallet) mobile App) the different use cases and flows needed to perform most basic functions, such as:
  - checking if a Did is resolvable or VC/VP are verifiable
  - to request and claim VCs
  - to share VPs
  - etc. 


# Background

## What is SSI?
SSI stands for Self-Sovereign Identity, which can be defined as a lifetime, portable, digital identity that does not depend on any centralized authority. 
In order for a system like this to be successful, it needs to adhere to a set of guiding principles (see [Christopher Allen’s Ten Principles of SSI](http://www.lifewithalacrity.com/2016/04/the-path-to-self-soverereign-identity.html) and [this Medium post](https://medium.com/metadium/introduction-to-self-sovereign-identity-and-its-10-guiding-principles-97c1ba603872) ).

- Existence :— Users must have an independent existence.
- Control :— Users must control their identities.
- Access :— Users must have access to their own data
- Transparency :— Systems and algorithms must be transparent.
- Persistence :— Identities must be long-lived.
- Portability :— Information and services about identity must be transportable
- Interoperability :— Identities should be as widely usable as possible.
- Consent :— Users must agree to the use of their identity.
- Minimization :— Disclosure of claims must be minimized
- Protection :— The rights of users must be protected

### Role of Blockchain in SSI
The fundamental promise of blockchain is to provide a seamless method for multiple entities to share data without a single entity fully controlling all of the information. That is, in essensce, Decentralization and Interoperability

## Interop from Holders point of view 
Implemented correctly, interoperability promises the following:
- existence and user-centricity: 
  - Existence of a person’s identity independent of identity administrators
  - Control of their digital identity
  - greater control and ownership over their data, 
  - Protection of individual rights

- transparency
  - Full access to their own data
  - consent to exchange data
  - GDPR compliance

- privacy: 
  - selective disclosure of data, 
  - protection against data breaches in case of centralized storage of sensitive PII
  - reliability, security

- user experience: 
  - not having to create multitude of user accounts and remember usernames and passwords, 
  - sigle sing on
  - Interoperable digital identities

- avoidance of fragmentation and redundency: 
  - user data is disperssed across corporate silos, 
  - same data required and stored by multiple organizations/service providers

  
## Interop from the point of view of developers of Wallets, Issuers, Verifiers
From the challenges faced by individuals in regard to freedom of movement, which has only increased in the digital age, and as highlighted by the principles of SSI, Interoperability from the point of view of human beings as the holders of SSI are clear. But what does it mean for the developers of the Issuer and Verifier products and services? 

- In order to support interoperability in the SSI solutions, developers of Wallets need to allow for storage of credentials from any Issuer using any of the methods.
- Additionally, Holders of identity and credentials should have a seamless experience to register or validate their identity across multiple platforms and services.
- To ensure interoperable presentation and verification for credentials generated using a variety of different schemes


# Welcome To the Affinidi Interop Service
The Interop Service is a set of server (REST API) and client (React/React Native) applications.

# Server
This service provides endpoints which facilitate interoprability with the Affinidi platform. For more details, check the API documentation at https://affinidi-interop-test-service.dev.affinity-project.org/api-docs/

Currently, it is used by the Bloom Wallet to easily perform certain checks and build various flows, such as:

Endpoints for Checking conditions:
- check if a DID is resolvable by Affinidi
	- POST /interop/did-is-resolvable
- check if a VC (Verifiable Credential) is verifiable by Affinidi
	- POST /interop/vc-is-verifiable
- check if a VP (Verifiable Presentation) is verifiable by Affinidi
	- POST /interop/vp-is-verifiable

Endpoints for Building Flows
- VC Claiming Flow: There are 3 endpoints to help with this flow
	- POST /interop/offer-request-token
    - GET /interop/offer-request-token/{uuid}
	- POST /interop/sign-credential

		![VC Claim Flow](https://user-images.githubusercontent.com/28490858/95356352-cc85f080-0883-11eb-9c1b-bc10c62bc974.png)


- VP Request and Sharing Flow: There are 3 endpoints to help with this flow
	- POST /interop/presentation-challenge
	- GET /interop/presentation-challenge/{uuid}
	- POST /interop/verify-presentation
  
  		![VP Request Flow](https://user-images.githubusercontent.com/28490858/95356342-cabc2d00-0883-11eb-943d-4bc7c9e087a9.png)


# Clients
## Issuer
- The Issuer client is a React App which allows interacting with the endpoints on the Server side, and to: 
  - check if a Did is resolvable, 
  - to demonstrate flows such as VC Claiming

- Access the Issuer at https://affinidi-interop-test-service.prod.affinity-project.org


## Wallet
The Wallet client is an Expo React Native App which allows an end user to: 
- request and claim a VC by scanning a QR code
- request and share a VP by scanning a QR code



# Setup
- Please check [Local Setup and Development](./dev-setup.md)