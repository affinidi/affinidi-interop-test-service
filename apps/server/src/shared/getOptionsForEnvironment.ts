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
let apiKey: string
let apiKeyHash: string

const { PORT } = process.env
const password = process.env.PASSWORD
const encryptedSeed = process.env.ENCRYPTED_SEED
const passwordJolo = process.env.PASSWORD_JOLO
const encryptedSeedJolo = process.env.ENCRYPTED_SEED_JOLO
const encryptedSeedElem = process.env.ENCRYPTED_SEED_ELEM
const { API_KEY, API_KEY_HASH } = process.env

export const getOptionsForEnvironment = (environment = ''): any => {
  const env = environment || 'staging'
  baseUrl = `https://api.${environment}.affinity-project.org/interop/v1`
  registryUrl = STAGING_REGISTRY_URL
  keyStorageUrl = STAGING_KEY_STORAGE_URL
  apiKey = API_KEY
  apiKeyHash = API_KEY_HASH

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

  return { env, registryUrl, keyStorageUrl, baseUrl, password, passwordJolo, encryptedSeed, encryptedSeedJolo, encryptedSeedElem, apiKey, apiKeyHash }
}
