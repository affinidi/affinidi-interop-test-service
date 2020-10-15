import {
  DEV_REGISTRY_URL,
  STAGING_REGISTRY_URL,
  PROD_REGISTRY_URL,
  DEV_KEY_STORAGE_URL,
  STAGING_KEY_STORAGE_URL,
  PROD_KEY_STORAGE_URL
} from '@affinityproject/wallet-core-sdk/dist/_defaultConfig'
import { logger } from './logger'

let registryUrl: string
let keyStorageUrl: string
let baseUrl: string

logger.info(process.env.ENVIRONMENT)

const password = process.env.PASSWORD
const encryptedSeed = process.env.ENCRYPTED_SEED
const encryptedSeedJolo = process.env.ENCRYPTED_SEED_JOLO
const encryptedSeedElem = process.env.ENCRYPTED_SEED_ELEM

export const getOptionsForEnvironment = (environment = ''): any => {
  const env = environment || 'staging'
  baseUrl = `http://affinidi-interop-test-service.${environment}.affinity-project.org/api/v1/interop`

  switch (environment) {
    case 'test':
      baseUrl = 'http://localhost:4000/api/v1/interop'

      break

    case 'local':
      baseUrl = `${process.env.NGROK_ENDPOINT}/api/v1/interop`

      break

    case 'dev':
      registryUrl = DEV_REGISTRY_URL
      keyStorageUrl = DEV_KEY_STORAGE_URL

      break

    case 'prod':
      registryUrl = PROD_REGISTRY_URL
      keyStorageUrl = PROD_KEY_STORAGE_URL
      break

    default:
      registryUrl = STAGING_REGISTRY_URL
      keyStorageUrl = STAGING_KEY_STORAGE_URL
      baseUrl = process.env.NGROK_ENDPOINT
      break
  }

  return { env, registryUrl, keyStorageUrl, baseUrl, password, encryptedSeed, encryptedSeedJolo, encryptedSeedElem }
}
