import { CommonNetworkMember as CoreNetwork } from '@affinityproject/wallet-core-sdk'
import { Affinity } from '@affinityproject/common-lib'
import { getOptionsForEnvironment }  from './getOptionsForEnvironment'

import {
  InputSignCredentials,
  InputPresentationChallenge,
  InputVerifyPresentation
} from '../interop/interop.dto'
import { logger } from './logger'

const { ENVIRONMENT } = process.env
const { password, encryptedSeed, registryUrl } = getOptionsForEnvironment(ENVIRONMENT)
const affinityOptions = {
  registryUrl
}
const affinity = new Affinity(affinityOptions)
const commonNetworkMember = new CoreNetwork(password, encryptedSeed)

export const sdkUtils = {
  async getResolvableDidDocument (did: string): Promise<any> {
    logger.info('sdkUtils#getResolvableDidDocument')

    return await commonNetworkMember.resolveDid(did)
  },

  async getVerifiedVc (credential: string): Promise<any> {
    logger.info('sdkUtils#getVerifiedVc')
    return await affinity.validateCredential(credential)
  },

  async getCredentialOfferRequestToken (input: any): Promise<any> {
    logger.info('sdkUtils#getCredentialOfferRequestToken')
    const { offeredCredentials } = input

    const { baseUrl } = getOptionsForEnvironment(ENVIRONMENT)
    const networkOptions = {
      callbackUrl: `${baseUrl}/sign-credentials`
    }
    return await commonNetworkMember.generateCredentialOfferRequestToken(offeredCredentials, networkOptions)
  },

  async getSignedCredentials (input: InputSignCredentials): Promise<any> {
    logger.info('sdkUtils#getSignedCredentials')
    const { responseToken, unsignedCredentials } = input

    return await commonNetworkMember.signCredentials(responseToken, unsignedCredentials)
  },

  async getValidatedVp (vp: any): Promise<any> {
    logger.info('sdkUtils#getValidatedVp')
    return await affinity.validatePresentation(vp)
  },

  async getVPChallenge (input: InputPresentationChallenge): Promise<any> {
    logger.info('sdkUtils#getVPChallenge')
    const { issuerDid, credentialRequirements } = input

    const { baseUrl } = getOptionsForEnvironment(ENVIRONMENT)
    const networkOptions = {
      callbackUrl: `${baseUrl}/verify-presentation`
    }
    return await commonNetworkMember.generatePresentationChallenge(credentialRequirements, issuerDid, networkOptions)
  },

  async verifyVP (input: InputVerifyPresentation): Promise<any> {
    logger.info('sdkUtils#verifyVP')
    const { vp } = input

    return await commonNetworkMember.verifyPresentation(vp)
  }
}
