/* eslint-disable id-match */
import interopService from './interop.service'
import { sdkUtils } from '../shared/sdkUtils'
import { affinity } from '../shared/affinityNetworkObjects'
import {
  requestDidIsResolvable,
  requestVpIsVerifiable,
  requestOfferToken,
  requestSignCredentials,
  requestPresentationChallenge,
  requestVerifyPresentation,
  invalidRequestOfferTokenArr,
  invalidRequestOfferTokenObj,
  invalidUnsignedCredentials,
  invalidUnsignedCredentialsExpiryDate,
  resultAffinityValidateCredential,
  resultAffinityValidatePresentation,
  resultExpiredVC,
  resultUnknownVCError,
  resultVCInvalidSignature,
  resultVPInvalidSignature,
  resultUnknownVPError,
  resultOfferRequestToken,
  resultGetVPChallenge,
  resultVerifyPresentation
} from '../testHelpers/testMock'
import {
  InputSignCredentials,
  InputPresentationChallenge,
  InputVerifyPresentation
} from './interop.dto'
import { unsignedCredentials } from '../factory/unsignedCredential'
import { createSandbox } from 'sinon'
import SdkError from '@affinidi/wallet-core-sdk/dist/shared/SdkError'
import OperationError from '../OperationError'
import { getOptionsForEnvironment }  from '../shared/getOptionsForEnvironment'

const { password, encryptedSeed } = getOptionsForEnvironment(process.env.ENVIRONMENT)
const unsignedVCV1 = unsignedCredentials[0]
const didDocument  = require('@affinidi/wallet-core-sdk/test/factory/didDocument')
const sandbox = createSandbox()
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

describe('Unit Tests: Interop API interopService', () => {
  describe('Did Methods', () => {
    describe('#didIsResolvable()', () => {
      let getResolvableDidDocumentStub: sinon.SinonStub<[string], Promise<any>>

      beforeEach(async () => {
        getResolvableDidDocumentStub = sandbox.stub(sdkUtils, 'getResolvableDidDocument')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      test('Success Case: should return status true and the didDocument, if DID is resolvable', async () => {
      // mock the response of the getResolvableDidDocument() to return the did document
        getResolvableDidDocumentStub.resolves(didDocument)

        // call the unit under test
        const result = await interopService.didIsResolvable(requestDidIsResolvable)
        expect(result.status).toEqual(true)
        expect(result).toHaveProperty('didDocument')
        expect(result.didDocument).toHaveProperty('id')
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-3, if requestDidIsResolvable params are invalid or empty', async () => {
        // mock input to the interopService
          const input = { ...requestDidIsResolvable }
          input.did = ''

          // mock the response of the getResolvableDidDocument() to throw COR-1 error
          getResolvableDidDocumentStub.throws(new SdkError('COR-1'))

          // call the unit under test
          const result = await interopService.didIsResolvable(input)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-3')
        })

        test('should return status false and error INT-50, if sdk returned COR-0', async () => {
        // mock the response of the getResolvableDidDocument() to throw COR-0 error
          getResolvableDidDocumentStub.throws(new SdkError('COR-0'))

          // call the unit under test
          const result = await interopService.didIsResolvable(requestDidIsResolvable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-50')
        })

        test('should return status false and error INT-51, if the interopService fails for unknown reasons', async () => {
        // mock the response of the getResolvableDidDocument() to throw generic internal error
          getResolvableDidDocumentStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.didIsResolvable(requestDidIsResolvable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-51')
        })
      })
    })
  })

  describe('Verifiable Credentials Methods', () => {
    describe('#vcIsVerifiable()', () => {
      let getVerifiedVcStub: sinon.SinonStub<[string], Promise<any>>

      beforeEach(() => {
        getVerifiedVcStub = sandbox.stub(sdkUtils, 'getVerifiedVc')
      })

      afterEach(() => {
        sandbox.restore()
      })

      test('Success Case: should return status true, if VC is verifiable', async () => {
        const _requestVcIsVerifiable = {
          credential:  await affinity.signCredential(unsignedVCV1, encryptedSeed, password),
          vcVersion:  1
        }

        // mock the response of the getVerifiedVc() to return the correct result
        getVerifiedVcStub.resolves(resultAffinityValidateCredential)

        // call the unit under test
        const result = await interopService.vcIsVerifiable(_requestVcIsVerifiable)
        expect(result.status).toEqual(true)
        expect(result).toHaveProperty('httpStatusCode')
        expect(result.message).toEqual('Success: VC was verified')
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-5, when issuer is invalid', async () => {
        // create invalid signature
          const _credential: any = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)

          _credential.issuer = ''

          const _requestVcIsVerifiable = {
            credential: _credential
          }

          // mock the response of the getVerifiedVc() to return the error for invalid signature
          getVerifiedVcStub.resolves(resultVCInvalidSignature)

          // call the unit under test
          const result = await interopService.vcIsVerifiable(_requestVcIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-5')
        })

        test('should return status false and error INT-6, when vc is expired', async () => {
          // create expired vc
          const _credential: any = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)

          _credential.expirationDate = '2010-01-17T07:06:35.402Z'

          const _requestVcIsVerifiable = {
            credential: _credential
          }

          // mock the response of the getVerifiedVc() to return the error for invalid signature
          getVerifiedVcStub.resolves(resultExpiredVC)

          // call the unit under test
          const result = await interopService.vcIsVerifiable(_requestVcIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-6')
        })

        test('should return status false and error INT-7, if sdk responds with some unknown error', async () => {
          const _requestVcIsVerifiable = {
            credential:  await affinity.signCredential(unsignedVCV1, encryptedSeed, password),
            vcVersion:  1
          }

          // mock the response of the getVerifiedVc() to return the error for unknown reason
          getVerifiedVcStub.resolves(resultUnknownVCError)

          // call the unit under test
          const result = await interopService.vcIsVerifiable(_requestVcIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-7')
        })

        test('should return status false and error INT-7, the interopService fails for unknown reasons', async () => {
          const _requestVcIsVerifiable = {
            credential:  await affinity.signCredential(unsignedVCV1, encryptedSeed, password),
            vcVersion:  1
          }

          // mock the response of the getVerifiedVc() to return the error for internal server error
          getVerifiedVcStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.vcIsVerifiable(_requestVcIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-7')
        })
      })
    })

    describe('#generateOfferRequestToken()', () => {
      let getCredentialOfferRequestTokenStub: sinon.SinonStub<[string], Promise<any>>

      beforeEach(async () => {
        getCredentialOfferRequestTokenStub = sandbox.stub(sdkUtils, 'getCredentialOfferRequestToken')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      test('Success Case: should return status true and token, when single credential is provided as valid array', async () => {
        // mock the response of the getCredentialOfferRequestToken() to return the correct result
        getCredentialOfferRequestTokenStub.resolves(resultOfferRequestToken)

        // call the unit under test
        const result = await interopService.generateOfferRequestToken(requestOfferToken)

        expect(result.status).toEqual(true)
        expect(result).toHaveProperty('httpStatusCode')
        expect(result.message).toEqual('Success: Offer Request Token is generated. GET it from the paylodUrl')
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-8, when credential is provided as non-array object', async () => {
        // mock the response of the getCredentialOfferRequestToken() to throw COR-1 error for invalid credential input
          getCredentialOfferRequestTokenStub.throws(new SdkError('COR-1'))

          // call the unit under test
          const result = await interopService.generateOfferRequestToken(invalidRequestOfferTokenObj)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-8')
          expect(result.error.message).toContain('Array Expected')
        })

        test('should return status false and error INT-8, when credential is provided as invalid array object', async () => {
        // mock the response of the getCredentialOfferRequestToken() to throw COM-0 error for invalid credential input
          getCredentialOfferRequestTokenStub.throws(new OperationError('COM-0'))

          // call the unit under test
          const result = await interopService.generateOfferRequestToken(invalidRequestOfferTokenArr)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-8')
          expect(result.error.message).toContain('Array Expected')
        })

        test('should return status false and error INT-51, if the interopService fails for unknown reasons', async () => {
        // mock the response of the getCredentialOfferRequestToken() to return the error for unknown reason
          getCredentialOfferRequestTokenStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.generateOfferRequestToken(requestOfferToken)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-51')
        })
      })
    })

    describe('#getOfferRequestToken()', () => {
      let getCredentialOfferRequestTokenStub: sinon.SinonStub<[InputPresentationChallenge], Promise<any>>

      beforeEach(async () => {
        getCredentialOfferRequestTokenStub = sandbox.stub(sdkUtils, 'getCredentialOfferRequestToken')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      describe('Success Case', () => {
        test('should return status true and token, when token for the given uuid is found in the storage', async () => {
          // mock the dependency of the generateOfferRequestToken()
          getCredentialOfferRequestTokenStub.resolves(resultOfferRequestToken)

          // save a paylod first in the Map
          const { tokenUrl } = await interopService.generateOfferRequestToken(requestOfferToken)

          const uuid = tokenUrl.split('/').pop()

          // call the unit under test
          const result = await interopService.getOfferRequestToken(uuid)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('token')
          expect(result.purpose).toEqual('offer')
          expect(result.message).toEqual('Success: Offer Request Token is attached')
        })
      })

      describe('Failure Case', () => {
        test('should return status false, when token is not found in the storage', async () => {
          // mock the dependency of the generateOfferRequestToken()
          getCredentialOfferRequestTokenStub.resolves('')

          // save a paylod first in the Map
          const { tokenUrl } = await interopService.generateOfferRequestToken(requestOfferToken)

          const uuid = tokenUrl.split('/').pop()

          // call the unit under test
          const result = await interopService.getOfferRequestToken(uuid)

          expect(result.status).toEqual(false)
          expect(result.message).toEqual('Failure: Offer Request Token was not found')
        })
      })
    })

    describe('#signCredentials()', () => {
      let getSignedCredentialsStub: sinon.SinonStub<[InputSignCredentials], Promise<any>>
      let resultGetSignedCredentials: any

      beforeEach(async () => {
        getSignedCredentialsStub = sandbox.stub(sdkUtils, 'getSignedCredentials')
        resultGetSignedCredentials = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)
      })

      afterEach(async () => {
        sandbox.restore()
      })
      describe('Success Cases', () => {
        test('should return status true and token, when single credential is provided as valid array', async () => {
          // mock the response of the getSignedCredentials() to return the correct result
          getSignedCredentialsStub.resolves(resultGetSignedCredentials)

          // call the unit under test
          const result = await interopService.signCredentials(requestSignCredentials)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('httpStatusCode')
          expect(result.message).toEqual('Success: Signed Credentials are attached')
        })

        test('should pass input with unsignedCredentials if unsignedCredentials are provided in the input', async () => {
          // mock the response of the getSignedCredentials() to return the correct result
          getSignedCredentialsStub.resolves(resultGetSignedCredentials)

          // call the unit under test
          const result = await interopService.signCredentials(requestSignCredentials)

          expect(result).toHaveProperty('signedCredentials')
          expect(result.signedCredentials).toBeInstanceOf(Object)
          expect(result.signedCredentials).toHaveProperty('type')
        })

        test('should pass input with defaultUnsignedCredentials if unsignedCredentials are not provided in the input', async () => {
          const _requestSignCredentials = { ...requestSignCredentials }
          delete _requestSignCredentials.unsignedCredentials

          // mock the response of the getSignedCredentials() to return the correct result
          getSignedCredentialsStub.resolves(resultGetSignedCredentials)

          // call the unit under test
          const result = await interopService.signCredentials(_requestSignCredentials)

          expect(result).toHaveProperty('signedCredentials')
          expect(result.signedCredentials).toBeInstanceOf(Object)
          expect(result.signedCredentials).toHaveProperty('type')
        })
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-9, when credential is provided as non-array object', async () => {
          const _requestSignCredentials = { ...requestSignCredentials }
          _requestSignCredentials.unsignedCredentials = invalidUnsignedCredentials

          // mock the response of the getSignedCredentials() to throw COR-1 error for invalid credential input
          getSignedCredentialsStub.throws(new SdkError('COR-22'))

          // call the unit under test
          const result = await interopService.signCredentials(_requestSignCredentials)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-9')
          expect(result.error.message).toContain('Offered Credentials Type name mismatch Error')
        })

        test('should return status false and error INT-10, when Expiry date should be greater than current date', async () => {
          const _requestSignCredentials = { ...requestSignCredentials }
          _requestSignCredentials.unsignedCredentials = invalidUnsignedCredentialsExpiryDate

          // mock the response of the getSignedCredentials() to throw COR-1 error for invalid credential input
          getSignedCredentialsStub.throws(new Error('Expiry date should be greater than current date'))

          // call the unit under test
          const result = await interopService.signCredentials(_requestSignCredentials)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-10')
          expect(result.error.message).toContain('Expiry Date Error. Should be greater than current date.')
        })

        test('should return status false and error INT-51, if the interopService fails for unknown reasons', async () => {
        // mock the response of the getSignedCredentials() to return the error for unknown reason
          getSignedCredentialsStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.signCredentials(requestSignCredentials)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-51')
        })
      })
    })
  })

  describe('Verifiable Presentation Methods', () => {
    describe('#vpIsVerifiable()', () => {
      let getValidatedVpStub: sinon.SinonStub<[string], Promise<any>>

      beforeEach(async () => {
        getValidatedVpStub = sandbox.stub(sdkUtils, 'getValidatedVp')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      test('Success Case: should return status true, if VP is verifiable', async () => {
        // mock the response to return the correct result
        getValidatedVpStub.resolves(resultAffinityValidatePresentation)

        // call the unit under test
        const result = await interopService.vpIsVerifiable(requestVpIsVerifiable)
        expect(result.status).toEqual(true)
        expect(result).toHaveProperty('httpStatusCode')
        expect(result.message).toEqual('Success: VP was verified')
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-30, if credential signature is invalid', async () => {
        // create invalid signature
          const _vp: any = { ...requestVpIsVerifiable.vp }
          delete _vp.proof
          const _requestVpIsVerifiable = {
            vp: _vp
          }

          // mock the response of the getValidatedVp() to return the error for invalid signature
          getValidatedVpStub.resolves(resultVPInvalidSignature)

          // call the unit under test
          const result = await interopService.vpIsVerifiable(_requestVpIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-30')
        })

        test('should return status false and error INT-31, if sdk responds with some unknown error', async () => {
        // mock the response of the getValidatedVp() to return the error for unknown reason
          getValidatedVpStub.resolves(resultUnknownVPError)

          // call the unit under test
          const result = await interopService.vpIsVerifiable(requestVpIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-31')
        })

        test('should return status false and error INT-31, the interopService fails for unknown reasons', async () => {
        // mock the response of the getValidatedVp() to return the error for internal server error
          getValidatedVpStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.vpIsVerifiable(requestVpIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-31')
        })
      })
    })

    describe('#generatePresentationChallenge', () => {
      let getVPChallengeStub: sinon.SinonStub<[InputPresentationChallenge], Promise<any>>

      beforeEach(async () => {
        getVPChallengeStub = sandbox.stub(sdkUtils, 'getVPChallenge')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      describe('Success Cases', () => {
        test('should return status true and the token, when presentation challenge token is returned', async () => {
          // mock the response to return the correct result
          getVPChallengeStub.resolves(resultGetVPChallenge)

          // call the unit under test
          const result = await interopService.generatePresentationChallenge(requestPresentationChallenge)
          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('tokenUrl')
          expect(result.message).toEqual('Success: Presentation Challenge is generated. GET it from the paylodUrl')
        })
      })

      describe('Failure Cases', () => {
        test('should respond with status false and error INT-32, when issuerDid is null', async () => {
          const _requestPresentationChallenge = { ...requestPresentationChallenge }
          _requestPresentationChallenge.issuerDid = ''

          // mock the response to return the correct result
          getVPChallengeStub.throws(new SdkError('COR-1'))

          // call the unit under test
          const result = await interopService.generatePresentationChallenge(_requestPresentationChallenge)
          expect(result.status).toEqual(false)
          expect(result).toHaveProperty('error')
          expect(result.error.code).toEqual('INT-32')
          expect(result.message).toEqual('Failure: Presentation Challenge was not generated')
        })

        test('should respond with status false and error INT-32, when credentialRequirement object doesnt have type key', async () => {
          const _requestPresentationChallenge = { ...requestPresentationChallenge }
          _requestPresentationChallenge.credentialRequirements = [{}]

          // mock the response to return the correct result
          getVPChallengeStub.throws(new SdkError('COR-1'))

          // call the unit under test
          const result = await interopService.generatePresentationChallenge(_requestPresentationChallenge)
          expect(result.status).toEqual(false)
          expect(result).toHaveProperty('error')
          expect(result.error.code).toEqual('INT-32')
          expect(result.message).toEqual('Failure: Presentation Challenge was not generated')
        })

        test('should respond with status false and error INT-50, when sdk throws COR-0', async () => {
          // mock the response to return the correct result
          getVPChallengeStub.throws(new SdkError('COR-0'))

          // call the unit under test
          const result = await interopService.generatePresentationChallenge(requestPresentationChallenge)
          expect(result.status).toEqual(false)
          expect(result).toHaveProperty('error')
          expect(result.error.code).toEqual('INT-50')
          expect(result.message).toEqual('Failure: Presentation Challenge was not generated')
        })

        test('should return status false and error INT-51, if the interopService fails for unknown reasons', async () => {
          // mock the response of the getResolvableDidDocument() to throw generic internal error
          getVPChallengeStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.generatePresentationChallenge(requestPresentationChallenge)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-51')
          expect(result.message).toEqual('Failure: Presentation Challenge was not generated')
        })
      })
    })

    describe('#getPresentationChallenge()', () => {
      let getVPChallengeStub: sinon.SinonStub<[InputPresentationChallenge], Promise<any>>

      beforeEach(async () => {
        getVPChallengeStub = sandbox.stub(sdkUtils, 'getVPChallenge')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      describe('Success Case', () => {
        test('should return status true and token, when token for the given uuid is found in the storage', async () => {
          // mock the dependency of the generatePresentationChallenge()
          getVPChallengeStub.resolves(resultGetVPChallenge)

          // save a paylod first in the Map
          const { tokenUrl } = await interopService.generatePresentationChallenge(requestPresentationChallenge)

          const uuid = tokenUrl.split('/').pop()

          // call the unit under test
          const result = await interopService.getPresentationChallenge(uuid)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('token')
          expect(result.purpose).toEqual('request')
          expect(result.message).toEqual('Success: Presentation Challenge is attached')
        })
      })

      describe('Failure Case', () => {
        test('should return status false, when token is not found in the storage', async () => {
          // mock the dependency of the generatePresentationChallenge()
          getVPChallengeStub.resolves('')

          // save a paylod first in the Map
          const { tokenUrl } = await interopService.generatePresentationChallenge(requestPresentationChallenge)

          const uuid = tokenUrl.split('/').pop()

          // call the unit under test
          const result = await interopService.getPresentationChallenge(uuid)

          expect(result.status).toEqual(false)
          expect(result.message).toEqual('Failure: Presentation Challenge was not found')
        })
      })
    })

    describe('#verifyPresentation', () => {
      let verifyVPStub: sinon.SinonStub<[InputVerifyPresentation], Promise<any>>

      beforeEach(async () => {
        verifyVPStub = sandbox.stub(sdkUtils, 'verifyVP')
      })

      afterEach(async () => {
        sandbox.restore()
      })

      describe('Success Cases', () => {
        test('should respond with status true, when VP is verified', async () => {
          // mock the response to return the correct result
          verifyVPStub.resolves(resultVerifyPresentation)

          // call the unit under test
          const result = await interopService.verifyPresentation(requestVerifyPresentation)
          expect(result.status).toEqual(true)
          expect(result.message).toEqual('Success: VP is verified')
        })
      })

      describe('Failure Cases', () => {
        test('should respond with status false and error INT-33, when JWS in the proof is invalid', async () => {
          const _requestVerifyPresentation = { ...requestVerifyPresentation }
          _requestVerifyPresentation.vp.proof.jws = 'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..wd0lKZBoQ5AvOnllqXvNHoy7grQKTjJGK-h4qe7MDEdSTbOieDCx_oNzEUdqqGvKQXrSJKK9JIFJMOO7iOxZbg'

          // mock the response to return the error result
          verifyVPStub.resolves({
            isValid: false,
            errors:  [{
              stack: 'Error: Invalid Token'
            }]
          })

          // call the unit under test
          const result = await interopService.verifyPresentation(_requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-33')
          expect(result.message).toEqual('Failure: VP was not verified')
        })

        test('should respond with status false and error INT-33, when JWS in the verifiableCredential proof is invalid', async () => {
          const _requestVerifyPresentation = { ...requestVerifyPresentation }
          _requestVerifyPresentation.vp.verifiableCredential[0].proof.jws = 'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..IxVRur3Ma2n1FsLbyO-CYC9VP-NdF8lpoVmZ_O644U94QxaQ1hhlNFr2_XU7xCVRkRWIVQ7qlSp5u3Kymz3ceQ'

          // mock the response to return the error result
          verifyVPStub.resolves({
            isValid: false,
            errors:  [{
              stack: 'Error: Invalid Token'
            }]
          })

          // call the unit under test
          const result = await interopService.verifyPresentation(_requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-33')
          expect(result.message).toEqual('Failure: VP was not verified')
        })

        test('should respond with status false and error INT-34, when invalid value is passed as input', async () => {
          const _requestVerifyPresentation = { ...requestVerifyPresentation }
          _requestVerifyPresentation.vp.proof.jws = ''

          // mock the response to return the error result
          verifyVPStub.resolves({
            isValid: false,
            errors:  [
              'undefined: The following errors have occurred:\n' +
              'invalid_param: Invalid value for field "proof": The following errors have occurred:\n' +
              'invalid_param: Invalid value for field "jws": Expected non empty string\n' +
              'invalid_param: Invalid value for field "proof": Invalid presentation proof:\n' +
              'Error: Invalid signature.'
            ]
          })

          // call the unit under test
          const result = await interopService.verifyPresentation(_requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-34')
          expect(result.message).toEqual('Failure: VP was not verified')
        })

        test('should respond with status false and error INT-31, when unknown error from SDK is returned', async () => {
          // mock the response to return the error result
          verifyVPStub.resolves('No Idea')

          // call the unit under test
          const result = await interopService.verifyPresentation(requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-31')
          expect(result.message).toEqual('Failure: VP was not verified')
        })

        test('should respond with status false and error INT-51, when interop faces internal server error', async () => {
          // mock the response to return the error result
          verifyVPStub.throws(new Error('internal server error'))

          // call the unit under test
          const result = await interopService.verifyPresentation(requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-51')
          expect(result.message).toEqual('Failure: VP was not verified')
        })
      })
    })
  })
})
