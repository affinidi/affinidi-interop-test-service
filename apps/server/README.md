# Affinity InterOp Testing Service

This API provides routes for testing different functionality provided by the Affinity platform. 



## How to use this service

1. Clone this repo: `git clone git@github.com:affinityproject/affinity-interop-tester.git`
2. Install dependecies: `cd affinity-interop-tester && npm i`
3. Run the service: `npm run dev`
4. Generate the routes, swagger docs, and build the package: `npm run build`
5. Run tests (if no changes has happened in the service): `npm test`
6. Run tests (if changes has happened in the service): `npm run build && npm test`

## Deployment
To deploy to a brand new environment/stack:
- create a Pulumi yaml file for the new stack in the infra folder
  - You can copy paste the existing file
  - E.g to create a `staging` stack, create a copy of the `Pulumi.dev.yaml` and save it as `Pulumi.staging.yaml`
  - Create a PR for the new changes and once it is merged, let the github Actions complete
  - Then run the following commands locally:
    -  `pulumi stack select` to create the new stack named `affinityproject/affinity-interop-tester/staging`
    -  `pulumi up` to create the stack's infrastructure

To deploy changes to existing stacks:
- Create a PR for the new changes and once it is merged, let the github Actions complete
  -  `pulumi stack select` to make sure the right stack is selected 
  -  `pulumi up` to update the stack's infrastructure
   

### Troubleshooting
#### Deployment
- if you see that the pods are not being created or started
- make sure that the docker image is created in the Registry for your new service (you can confirm this by visiting the ECR in AWS)
- check that the github action related to Docker Image taging has run successfully 
#### Global Dependencies
- Check if you have typescript compiler (`tsc`) installed: `tsc --version`
  - if not: `npm install -g typescript`