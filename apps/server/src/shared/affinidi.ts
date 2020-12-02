import { CommonNetworkMember as CoreNetwork } from '@affinidi/wallet-core-sdk'
import { Affinidi } from '@affinidi/common'
import { getOptionsForEnvironment }  from './getOptionsForEnvironment'

const { password, encryptedSeed, registryUrl } = getOptionsForEnvironment(process.env.ENVIRONMENT)
const { API_KEY, API_KEY_HASH } = process.env

const affinidiOptions = {
  env:    'staging',
  registryUrl,
  apiKey: API_KEY_HASH
}
const commonNetworkOptions = {
  registryUrl,
  apiKey:       API_KEY,
  accessApiKey: API_KEY_HASH
}

export const affinidi = new Affinidi(affinidiOptions)
export const commonNetworkMember = new CoreNetwork(password, encryptedSeed, commonNetworkOptions)
