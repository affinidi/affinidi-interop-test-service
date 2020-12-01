import { CommonNetworkMember as CoreNetwork } from '@affinidi/wallet-core-sdk'
import { Affinity } from '@affinidi/common'
import { getOptionsForEnvironment }  from './getOptionsForEnvironment'

const { password, encryptedSeed, registryUrl } = getOptionsForEnvironment(process.env.ENVIRONMENT)
const { API_KEY, API_KEY_HASH, API_KEY_STG, API_KEY_HASH_STG } = process.env

const optionsAffinity = {
  registryUrl,
  apiKey: API_KEY_HASH
}
const optionsCommonNetwork = {
  registryUrl,
  apiKey:       API_KEY,
  accessApiKey: API_KEY_HASH
}
// const optionsAffinityStg = {
//   registryUrl,
//   apiKey: API_KEY_HASH_STG
// }
// const optionsCommonNetworkStg = {
//   registryUrl,
//   apiKey:       API_KEY_STG,
//   accessApiKey: API_KEY_HASH_STG
// }

console.log('affinityNetworkObjects')
console.log(optionsAffinity)
console.log(optionsCommonNetwork)

export const affinity = new Affinity(optionsAffinity)
export const commonNetworkMember = new CoreNetwork(password, encryptedSeed, optionsCommonNetwork)
