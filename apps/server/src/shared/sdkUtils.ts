import { getOptionsForEnvironment }  from './getOptionsForEnvironment'
import { logger } from './logger'
import {
  InputSignCredentials,
  InputPresentationChallenge,
  InputVerifyPresentation
} from '../interop/interop.dto'

import { affinity, commonNetworkMember } from './affinityNetworkObjects'

const { baseUrl } = getOptionsForEnvironment(process.env.ENVIRONMENT)

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
