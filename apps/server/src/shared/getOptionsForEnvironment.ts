import {
  DEV_REGISTRY_URL,
  STAGING_REGISTRY_URL,
  PROD_REGISTRY_URL,
  DEV_KEY_STORAGE_URL,
  STAGING_KEY_STORAGE_URL,
  PROD_KEY_STORAGE_URL
} from '@affinidi/wallet-core-sdk/dist/_defaultConfig'
import { logger } from './logger'

let registryUrl: string
let keyStorageUrl: string
let baseUrl: string

const { PORT } = process.env
const password = process.env.PASSWORD
const encryptedSeed = process.env.ENCRYPTED_SEED
const encryptedSeedJolo = process.env.ENCRYPTED_SEED_JOLO
const encryptedSeedElem = process.env.ENCRYPTED_SEED_ELEM

export const getOptionsForEnvironment = (environment = ''): any => {
  const env = environment || 'staging'
  baseUrl = `http://affinidi-interop-test-service.${environment}.affinity-project.org/v1`
  registryUrl = STAGING_REGISTRY_URL
  keyStorageUrl = STAGING_KEY_STORAGE_URL

  switch (environment) {
    case 'test':
      baseUrl = `http://localhost:${PORT}/v1`
      break

    case 'local':
      baseUrl = `${process.env.NGROK_ENDPOINT}/v1`
      break

    case 'dev':
      registryUrl = DEV_REGISTRY_URL
      keyStorageUrl = DEV_KEY_STORAGE_URL

      break

    case 'prod':
      baseUrl = 'https://api.affinidi.com/interop/v1/'
      registryUrl = PROD_REGISTRY_URL
      keyStorageUrl = PROD_KEY_STORAGE_URL
      break
  }
  logger.info('getOptionsForEnvironment: environment: ', environment)
  logger.info('getOptionsForEnvironment: baseUrl: ', baseUrl)
  logger.info('getOptionsForEnvironment: password: ', password)
  return { env, registryUrl, keyStorageUrl, baseUrl, password, encryptedSeed, encryptedSeedJolo, encryptedSeedElem }
}
