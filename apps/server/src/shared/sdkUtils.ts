import { getOptionsForEnvironment }  from './getOptionsForEnvironment'
import { logger } from './logger'
import {
  InputSignCredentials,
  InputPresentationChallenge,
  InputVerifyPresentation
} from '../interop/interop.dto'

import { affinidi, commonNetworkMember } from './affinidi'

export const sdkUtils = {
  async getResolvableDidDocument (did: string): Promise<any> {
    logger.info('sdkUtils#getResolvableDidDocument')

    return commonNetworkMember.resolveDid(did)
  },

  async getVerifiedVc (credential: string): Promise<any> {
    logger.info('sdkUtils#getVerifiedVc')

    return affinidi.validateCredential(credential)
  },

  async getCredentialOfferRequestToken (input: any): Promise<any> {
    logger.info('sdkUtils#getCredentialOfferRequestToken')
    const { offeredCredentials } = input

    const { baseUrl } = getOptionsForEnvironment(process.env.ENVIRONMENT)

    const networkOptions = {
      callbackUrl: `${baseUrl}/sign-credentials`
    }

    return commonNetworkMember.generateCredentialOfferRequestToken(offeredCredentials, networkOptions)
  },

  async getSignedCredentials (input: InputSignCredentials): Promise<any> {
    logger.info('sdkUtils#getSignedCredentials')
    const { responseToken, unsignedCredentials } = input

    return commonNetworkMember.signCredentials(responseToken, unsignedCredentials)
  },

  async getValidatedVp (vp: any): Promise<any> {
    logger.info('sdkUtils#getValidatedVp')
    return affinidi.validatePresentation(vp)
  },

  async getVPChallenge (input: InputPresentationChallenge): Promise<any> {
    logger.info('sdkUtils#getVPChallenge')
    const { issuerDid, credentialRequirements } = input

    const { baseUrl } = getOptionsForEnvironment(process.env.ENVIRONMENT)

    const networkOptions = {
      callbackUrl: `${baseUrl}/verify-presentation`
    }
    return commonNetworkMember.generatePresentationChallenge(credentialRequirements, issuerDid, networkOptions)
  },

  async verifyVP (input: InputVerifyPresentation): Promise<any> {
    logger.info('sdkUtils#verifyVP')
    const { vp } = input

    return commonNetworkMember.verifyPresentation(vp)
  }
}
