import { CommonNetworkMember as CoreNetwork } from '@affinidi/wallet-core-sdk'
import { Affinidi } from '@affinidi/common'
import { getOptionsForEnvironment }  from './getOptionsForEnvironment'

const { password, encryptedSeed, registryUrl } = getOptionsForEnvironment(process.env.ENVIRONMENT)
const { ACCESS_API_KEY } = process.env

const affinidiOptions = {
  env:    'staging',
  apiKey: ACCESS_API_KEY
}
const commonNetworkOptions = {
  registryUrl,
  accessApiKey: ACCESS_API_KEY
}

export const affinidi = new Affinidi(affinidiOptions)
export const commonNetworkMember = new CoreNetwork(password, encryptedSeed, commonNetworkOptions)
