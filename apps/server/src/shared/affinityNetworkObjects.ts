import { CommonNetworkMember as CoreNetwork } from '@affinidi/wallet-core-sdk'
import { Affinity } from '@affinidi/common'
import { getOptionsForEnvironment }  from './getOptionsForEnvironment'

const { password, encryptedSeed, registryUrl, apiKey, apiKeyHash } = getOptionsForEnvironment(process.env.ENVIRONMENT)

const optionsAffinity = {
  registryUrl,
  apiKey: apiKeyHash
}
const optionsCommonNetwork = {
  registryUrl,
  apiKey,
  accessApiKey: apiKeyHash
}

console.log('affinityNetworkObjects')
console.log(optionsAffinity)
console.log(optionsCommonNetwork)

export const affinity = new Affinity(optionsAffinity)
export const commonNetworkMember = new CoreNetwork(password, encryptedSeed, optionsCommonNetwork)
