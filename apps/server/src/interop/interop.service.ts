import {
  InputDidIsResolvable,
  InputVcIsVerifiable,
  InputSignCredentials,
  InputVpIsVerifiable,
  InputPresentationChallenge,
  InputVerifyPresentation
} from './interop.dto'

import { unsignedCredentials as defaultUnsignedCredentials } from '../factory/unsignedCredential'
import OperationError from '../OperationError'
import { getOptionsForEnvironment }  from '../shared/getOptionsForEnvironment'
import { sdkUtils } from '../shared/sdkUtils'
import { logger } from '../shared/logger'

import { v4 as UUID } from 'uuid'

const { ENVIRONMENT } = process.env
const payloadMap = new Map() // TODO: this needs to be a persistent storage in future

// TODO: remove the stack object from the errorResponse
class InteropService {
  async didIsResolvable (input: InputDidIsResolvable): Promise<any> {
    logger.info('interopService#didIsResolvable')

    const { did } = input
    const successMessage = 'Success: Did was resolved'
    const failureMessage = 'Failure: Did was not resolved'

    try {
      const didDocument = await sdkUtils.getResolvableDidDocument(did)

      return {
        status:         true,
        httpStatusCode: 200,
        message:        successMessage,
        didDocument
      }
    } catch (e) {
      const errorResponse = {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          e
      }
      if (e.code === 'COR-1') {
        errorResponse.error = new OperationError('INT-3')
      } else if (e.code === 'COR-0') { // the SDK could possibly return the 500 error (COR-0)
        errorResponse.error = new OperationError('INT-50')
      } else { // this service could possibly face internal server errors
        errorResponse.error = new OperationError('INT-51')
      }

      return errorResponse
    }
  }

  // Verifiable Credentials Methods
  async vcIsVerifiable (input: InputVcIsVerifiable): Promise<any> {
    logger.info('interopService#vcIsVerifiable')

    const { credential } = input
    const successMessage = 'Success: VC was verified'
    const failureMessage = 'Failure: VC was not verified'

    try {
      const { result, error }  = await sdkUtils.getVerifiedVc(credential)

      const errorResponse = {
        status:         false,
        httpStatusCode: 400,
        message:        failureMessage,
        error
      }
      if (result) {
        return {
          status:         true,
          httpStatusCode: 200,
          message:        successMessage
        }
      } else if (error.includes('Signature is not valid')) {
        errorResponse.error = new OperationError('INT-5')
      } else if (error.includes('VC is expired')) {
        errorResponse.error = new OperationError('INT-6')
      } else { // unknown errors
        errorResponse.error = new OperationError('INT-7')
      }
      return errorResponse
    } catch (e) {
      return {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          new OperationError('INT-7')
      }
    }
  }

  async generateOfferRequestToken (input: any): Promise<any> {
    logger.info('interopService#generateOfferRequestToken')

    const uuid = UUID()
    const { baseUrl } = getOptionsForEnvironment(ENVIRONMENT)
    const tokenUrl = `${baseUrl}/offer-request-token/${uuid}`
    logger.info('tokenUrl: ', tokenUrl)
    const successMessage = 'Success: Offer Request Token is generated. GET it from the paylodUrl'
    const failureMessage = 'Failure: Offer Request Token was not generated'

    try {
      const requestToken = await sdkUtils.getCredentialOfferRequestToken(input)

      // save the requestToken in the hashMap
      payloadMap.set(uuid, requestToken)

      return {
        status:         true,
        httpStatusCode: 200,
        message:        successMessage,
        tokenUrl
      }
    } catch (e) {
      const errorResponse = {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          e
      }
      // TODO: handle Error: COM-3
      if (e.code === 'COR-1' || e.code === 'COM-0') {
        errorResponse.httpStatusCode = 400
        errorResponse.error = new OperationError('INT-8')
      } else {
        errorResponse.error = new OperationError('INT-51')
      }

      return errorResponse
    }
  }

  async getOfferRequestToken (uuid: string): Promise<any> {
    logger.info('interopService#getOfferRequestToken')

    const successMessage = 'Success: Offer Request Token is attached'
    const failureMessage = 'Failure: Offer Request Token was not found'

    const requestToken = payloadMap.get(uuid)

    if (requestToken) {
      return {
        status:         true,
        httpStatusCode: 200,
        purpose:        'offer',
        message:        successMessage,
        token:          requestToken
      }
    } else {
      return {
        status:         false,
        httpStatusCode: 200,
        message:        failureMessage
      }
    }
  }

  async signCredentials (input: InputSignCredentials): Promise<any> {
    logger.info('interopService#signCredentials')

    const { unsignedCredentials } = input
    const _unsignedCredentials = unsignedCredentials || defaultUnsignedCredentials
    input.unsignedCredentials = _unsignedCredentials

    const successMessage = 'Success: Signed Credentials are attached'
    const failureMessage = 'Failure: Credentials were not signed'

    try {
      const signedCredentials = await sdkUtils.getSignedCredentials(input)

      return {
        status:         true,
        httpStatusCode: 200,
        message:        successMessage,
        signedCredentials
      }
    } catch (e) {
      const errorResponse = {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          e
      }

      if (e.code === 'COR-22') {
        errorResponse.httpStatusCode = 400
        errorResponse.error = new OperationError('INT-9')
      } else if (e.message.includes('Expiry date should be greater than current date')) {
        errorResponse.httpStatusCode = 400
        errorResponse.error = new OperationError('INT-10')
      } else {
        errorResponse.error = new OperationError('INT-51')
      }

      return errorResponse
    }
  }

  // Verifiable Presentation Methods
  async vpIsVerifiable (input: InputVpIsVerifiable): Promise<any> {
    logger.info('interopService#vpIsVerifiable')

    const { vp } = input
    const successMessage = 'Success: VP was verified'
    const failureMessage = 'Failure: VP was not verified'

    try {
      const { result, error } = await sdkUtils.getValidatedVp(vp)

      const errorResponse = {
        status:         false,
        httpStatusCode: 400,
        message:        failureMessage,
        error
      }
      if (result) {
        return {
          status:         true,
          httpStatusCode: 200,
          message:        successMessage
        }
      } else if (error.includes('Invalid value for field')) {
        errorResponse.error = new OperationError('INT-30')
      } else {
        errorResponse.error = new OperationError('INT-31')
      }
      return errorResponse
    } catch (e) {
      return {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          new OperationError('INT-31')
      }
    }
  }

  async generatePresentationChallenge (input: InputPresentationChallenge): Promise<any> {
    logger.info('interopService#generatePresentationChallenge')

    const uuid = UUID()
    const { baseUrl } = getOptionsForEnvironment(ENVIRONMENT)
    const tokenUrl = `${baseUrl}/presentation-challenge/${uuid}`
    logger.info('tokenUrl: ', tokenUrl)
    const successMessage = 'Success: Presentation Challenge is generated. GET it from the paylodUrl'
    const failureMessage = 'Failure: Presentation Challenge was not generated'

    try {
      const token =  await sdkUtils.getVPChallenge(input)

      // save the token in the hashMap
      payloadMap.set(uuid, token)

      return {
        status:         true,
        httpStatusCode: 200,
        message:        successMessage,
        tokenUrl
      }
    } catch (e) {
      const errorResponse = {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          e
      }
      if (e.code === 'COR-1') {
        errorResponse.error = new OperationError('INT-32')
      } else if (e.code === 'COR-0') { // the SDK could possibly return the 500 error (COR-0)
        errorResponse.error = new OperationError('INT-50')
      } else { // this service could possibly face internal server errors
        errorResponse.error = new OperationError('INT-51')
      }

      return errorResponse
    }
  }

  async getPresentationChallenge (uuid: string): Promise<any> {
    logger.info('interopService#getPresentationChallenge')

    const successMessage = 'Success: Presentation Challenge is attached'
    const failureMessage = 'Failure: Presentation Challenge was not found'

    const presentationChallenge = payloadMap.get(uuid)

    if (presentationChallenge) {
      return {
        status:         true,
        httpStatusCode: 200,
        purpose:        'request',
        message:        successMessage,
        token:          presentationChallenge
      }
    } else {
      return {
        status:         false,
        httpStatusCode: 200,
        message:        failureMessage
      }
    }
  }

  async verifyPresentation (input: InputVerifyPresentation): Promise<any> {
    logger.info('interopService#verifyPresentation')

    const successMessage = 'Success: VP is verified'
    const failureMessage = 'Failure: VP was not verified'

    try {
      const result = await sdkUtils.verifyVP(input)

      const errorResponse = {
        status:         false,
        httpStatusCode: 400,
        message:        failureMessage,
        error:          {}
      }
      if (result.isValid) {
        return {
          status:         true,
          httpStatusCode: 200,
          message:        successMessage
        }
      } else if (result.errors) {
        const errors = result.errors[0]
        if (errors.stack && errors.stack.includes('Invalid Token')) {
          errorResponse.error = new OperationError('INT-33')
        } else if (errors.includes('Invalid signature')) {
          errorResponse.error = new OperationError('INT-34')
        }
        // TODO: handle Error: Token not issued by expected issuer
      } else { // unknown errors
        errorResponse.error = new OperationError('INT-31')
      }
      return errorResponse
    } catch (e) {
      return {
        status:         false,
        httpStatusCode: e.httpStatusCode,
        message:        failureMessage,
        error:          new OperationError('INT-51')
      }
    }
  }
}

export default new InteropService()
