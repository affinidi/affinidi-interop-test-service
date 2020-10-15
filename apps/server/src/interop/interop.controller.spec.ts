import { createSandbox } from 'sinon'
import interopService from './interop.service'
import { InteropController } from './interop.controller'
import {
  requestDidIsResolvable,
  requestVcIsVerifiable,
  requestVpIsVerifiable,
  requestOfferToken,
  requestSignCredentials,
  requestVerifyPresentation,
  requestPresentationChallenge,
  invalidRequestOfferTokenArr,
  invalidUnsignedCredentials,
  resultOfferRequestToken
} from '../testHelpers/testMock'
import {
  InputDidIsResolvable,
  InputVcIsVerifiable,
  InputVpIsVerifiable,
  InputSignCredentials,
  InputVerifyPresentation,
  OutputDidIsResolvable,
  OutputGenerateOfferRequestToken,
  OutputGetOfferRequestToken,
  OutputVcIsVerifiable,
  OutputVpIsVerifiable,
  OutputSignedCredential,
  OutputVerifyPresentation,
  OutputGetPresentationChallenge
} from './interop.dto'
import OperationError from '../OperationError'

const sandbox = createSandbox()
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

describe.skip('Unit Tests: Interop API Controller', () => {
  let controller: InteropController

  describe('Did Methods', () => {
    describe('#didIsResolvable()', () => {
      let didIsResolvableStub: sinon.SinonStub<[InputDidIsResolvable], Promise<any>>

      beforeEach(() => {
        controller = new InteropController()
        didIsResolvableStub = sandbox.stub(interopService, 'didIsResolvable')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      test('Success Case: should return status true and the didDocument, if did is resolvable', async () => {
      // mock service response
        const serviceResponseMock: OutputDidIsResolvable = {
          status:         true,
          message:        'Success: Did was resolved'
        }
        // call and resolve the service stub with the mock service response
        didIsResolvableStub.resolves(serviceResponseMock)

        const result = await controller.didIsResolvable(requestDidIsResolvable)
        expect(result.status).toEqual(true)
      })

      test('Failure Case: should return status false and error INT-3, if input params are invalid or empty', async () => {
      // mock controller input
        const input = { ...requestDidIsResolvable }
        input.did = ''

        // mock service response
        const serviceResponseMock: OutputDidIsResolvable = {
          status:         false,
          message:        '',
          error:          new OperationError('INT-3')
        }
        // call and resolve the service stub with the mock service response
        didIsResolvableStub.resolves(serviceResponseMock)

        const result = await controller.didIsResolvable(input)
        expect(result.status).toEqual(false)
        expect(result.error.code).toEqual('INT-3')
      })
    })
  })

  describe('Verifiable Credentials Methods', () => {
    describe('#vcIsVerifiable', () => {
      let vcIsVerifiableStub: sinon.SinonStub<[InputVcIsVerifiable], Promise<OutputVcIsVerifiable>>

      beforeEach(() => {
        controller = new InteropController()
        vcIsVerifiableStub = sandbox.stub(interopService, 'vcIsVerifiable')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      test('Success Case: should return status true, when VC is verifiable', async () => {
      // mock service response
        const serviceResponseMock: OutputVcIsVerifiable = {
          status:  true,
          message: 'Success: VC was verified'
        }
        // call and resolve the service stub with the mock service response
        vcIsVerifiableStub.resolves(serviceResponseMock)

        const result = await controller.vcIsVerifiable(requestVcIsVerifiable)
        expect(result.status).toEqual(true)
      })

      describe('Failure Cases', () => {
        test('should respond with status false and error INT-5, when vc signature is invalid', async () => {
        // create invalid signature
          const _credential: any = { ...requestVcIsVerifiable.credential }
          _credential.issuer = ''
          const input = {
            credential: _credential
          }
          // mock service response
          const serviceResponseMock: OutputVcIsVerifiable = {
            status:  false,
            message: 'Failure: VC was not verified',
            error:   new OperationError('INT-5')
          }
          // call and resolve the service stub with the mock service response
          vcIsVerifiableStub.resolves(serviceResponseMock)

          const result = await controller.vcIsVerifiable(input)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-5')
        })

        test('should respond with status false and error INT-6, when vc is expired', async () => {
        // create expired vc
          const _credential: any = { ...requestVcIsVerifiable.credential }
          _credential.expires = '2010-01-17T07:06:35.402Z'
          const input = {
            credential: _credential
          }
          // mock service response
          const serviceResponseMock: OutputVcIsVerifiable = {
            status:  false,
            message: 'Failure: VC was not verified',
            error:   new OperationError('INT-6')
          }
          // call and resolve the service stub with the mock service response
          vcIsVerifiableStub.resolves(serviceResponseMock)

          const result = await controller.vcIsVerifiable(input)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-6')
        })
      })
    })

    describe('#generateOfferRequestToken()', () => {
      let generateOfferRequestTokenStub: sinon.SinonStub<[any], Promise<OutputGenerateOfferRequestToken>>

      beforeEach(() => {
        controller = new InteropController()
        generateOfferRequestTokenStub = sandbox.stub(interopService, 'generateOfferRequestToken')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      describe('Success Case', () => {
        test('should return status true and token, when single credential is provided as valid array', async () => {
          // mock service response
          const serviceResponseMock: OutputGenerateOfferRequestToken = {
            status:       true,
            message:      'Success: Offer Request Token is generated. GET it from the paylodUrl',
            tokenUrl:   'http://some-site.com/some-route/some-id'
          }

          generateOfferRequestTokenStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.generateOfferRequestToken(requestOfferToken)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('tokenUrl')
          expect(result.message).toEqual('Success: Offer Request Token is generated. GET it from the paylodUrl')
        })
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-8, when credential is provided as invalid array object', async () => {
        // mock service response
          const serviceResponseMock: OutputGenerateOfferRequestToken = {
            status:  false,
            message: 'Failure: Offer Request Token was not returned',
            error:   new OperationError('INT-8')
          }

          // call and resolve the service stub with the mock service response
          generateOfferRequestTokenStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.generateOfferRequestToken(invalidRequestOfferTokenArr)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-8')
          expect(result.error.message).toContain('Array Expected')
        })
      })
    })

    describe('#getOfferRequestToken()', () => {
      let getOfferRequestTokenStub: sinon.SinonStub<[any], Promise<OutputGetOfferRequestToken>>

      beforeEach(() => {
        controller = new InteropController()
        getOfferRequestTokenStub = sandbox.stub(interopService, 'getOfferRequestToken')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      describe('Success Case', () => {
        test('should return status true and token, when single credential is provided as valid array', async () => {
          // save a paylod first in the Map
          const { tokenUrl } = await controller.generateOfferRequestToken(requestOfferToken)

          const uuid = tokenUrl.split('/').pop()

          // mock service response
          const serviceResponseMock: OutputGetOfferRequestToken = {
            status:       true,
            message:      'Success: Offer Request Token is attached',
            purpose:      'claim',
            token:        resultOfferRequestToken
          }

          getOfferRequestTokenStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.getOfferRequestToken(uuid)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('token')
          expect(result.purpose).toEqual('claim')
          expect(result.message).toEqual('Success: Offer Request Token is attached')
        })
      })
    })

    describe('#signCredentials', () => {
      let signCredentialsStub: sinon.SinonStub<[InputSignCredentials], Promise<OutputSignedCredential>>

      beforeEach(() => {
        controller = new InteropController()
        signCredentialsStub = sandbox.stub(interopService, 'signCredentials')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      describe('Success Case', () => {
        test('should return status true and signed credentials, when valid response token is provided', async () => {
          // mock service response
          const serviceResponseMock: OutputSignedCredential = {
            status:            true,
            message:           'Success: Signed Credentials are attached',
            signedCredentials: {}
          }

          signCredentialsStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.getSignedCredential(requestSignCredentials)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('signedCredentials')
          expect(result.message).toEqual('Success: Signed Credentials are attached')
        })
      })

      describe('Failure Cases', () => {
        test('should return status false and error INT-9, when credential is provided as non-array object', async () => {
          const _requestSignCredentials = { ...requestSignCredentials }
          _requestSignCredentials.unsignedCredentials = invalidUnsignedCredentials

          // mock service response
          const serviceResponseMock: OutputSignedCredential = {
            status:       false,
            message:      'Failure: Credentials were not signed',
            error:   new OperationError('INT-9')
          }

          signCredentialsStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.getSignedCredential(_requestSignCredentials)

          expect(result.status).toEqual(false)
          expect(result).toHaveProperty('error')
          expect(result.error.code).toEqual('INT-9')
          expect(result.message).toEqual('Failure: Credentials were not signed')
        })

        test('should return status false and error INT-10, when expiry date is less than current date', async () => {
          const _requestSignCredentials = { ...requestSignCredentials }
          _requestSignCredentials.unsignedCredentials[0].issuanceDate = new Date().toISOString()
          _requestSignCredentials.unsignedCredentials[0].expirationDate = new Date().toISOString()

          // mock service response
          const serviceResponseMock: OutputSignedCredential = {
            status:       false,
            message:      'Failure: Credentials were not signed',
            error:   new OperationError('INT-9')
          }

          signCredentialsStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.getSignedCredential(_requestSignCredentials)

          expect(result.status).toEqual(false)
          expect(result).toHaveProperty('error')
          expect(result.error.code).toEqual('INT-9')
          expect(result.message).toEqual('Failure: Credentials were not signed')
        })

        test('should return status false and error INT-51, when internal server error happens', async () => {
          // TODO:
        })
      })
    })
  })

  describe('Verifiable Presentation Methods', () => {
    describe('#vpIsVerifiable', () => {
      let vpIsVerifiableStub: sinon.SinonStub<[InputVpIsVerifiable], Promise<OutputVpIsVerifiable>>

      beforeEach(() => {
        controller = new InteropController()
        vpIsVerifiableStub = sandbox.stub(interopService, 'vpIsVerifiable')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      test('Success Case: should return status true, when VP is verifiable', async () => {
      // mock service response
        const serviceResponseMock: OutputVpIsVerifiable = {
          status:  true,
          message: 'Success: VP was verified'
        }
        // call and resolve the service stub with the mock service response
        vpIsVerifiableStub.resolves(serviceResponseMock)

        const result = await controller.vpIsVerifiable(requestVpIsVerifiable)
        expect(result.status).toEqual(true)
      })

      describe('Failure Cases', () => {
        test('should respond with status false and error INT-30, when vp signature is invalid', async () => {
        // create invalid signature
          const _vp = { ...requestVpIsVerifiable.vp }
          delete _vp.proof
          const _requestVpIsVerifiable = {
            vp: _vp
          }
          // mock service response
          const serviceResponseMock: OutputVpIsVerifiable = {
            status:  false,
            message: 'Failure: VP was not verified',
            error:   new OperationError('INT-30')
          }
          // call and resolve the service stub with the mock service response
          vpIsVerifiableStub.resolves(serviceResponseMock)

          const result = await controller.vpIsVerifiable(_requestVpIsVerifiable)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-30')
        })
      })
    })

    // describe('#generatePresentationChallenge', () => {

    // })

    describe('#getPresentationChallenge()', () => {
      let getPresentationChallengeStub: sinon.SinonStub<[any], Promise<OutputGetPresentationChallenge>>

      beforeEach(() => {
        controller = new InteropController()
        getPresentationChallengeStub = sandbox.stub(interopService, 'getPresentationChallenge')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      describe('Success Case', () => {
        test('should return status true and token, when single credential is provided as valid array', async () => {
          // save a paylod first in the Map
          const { tokenUrl } = await controller.generatePresentationChallenge(requestPresentationChallenge)

          const uuid = tokenUrl.split('/').pop()

          // mock service response
          const serviceResponseMock: OutputGetPresentationChallenge = {
            status:       true,
            message:      'Success: Presentation Challenge is attached',
            purpose:      'request',
            token:        ''
          }

          getPresentationChallengeStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.getPresentationChallenge(uuid)

          expect(result.status).toEqual(true)
          expect(result).toHaveProperty('token')
          expect(result.purpose).toEqual('request')
          expect(result.message).toEqual('Success: Presentation Challenge is attached')
        })
      })
    })

    describe('#verifyPresentation', () => {
      let verifyPresentationStub: sinon.SinonStub<[InputVerifyPresentation], Promise<OutputVerifyPresentation>>

      beforeEach(() => {
        controller = new InteropController()
        verifyPresentationStub = sandbox.stub(interopService, 'verifyPresentation')
      })

      afterEach(() => {
        controller = null
        sandbox.restore()
      })

      test('Success Case: should return status true, when VP is verifiable', async () => {
      // mock service response
        const serviceResponseMock: OutputVerifyPresentation = {
          status:  true,
          message: 'Success: VP is verified'
        }

        verifyPresentationStub.resolves(serviceResponseMock)

        const result = await controller.verifyPresentation(requestVerifyPresentation)
        expect(result.status).toEqual(true)
      })

      describe('Failure Cases', () => {
        test('should respond with status false and error INT-31, when unknown error from SDK is returned', async () => {
          // mock service response
          const serviceResponseMock: OutputVpIsVerifiable = {
            status:  false,
            message: 'Failure: VP was not verified',
            error:   new OperationError('INT-31')
          }
          // call and resolve the service stub with the mock service response
          verifyPresentationStub.resolves(serviceResponseMock)

          // call the unit under test
          const result = await controller.verifyPresentation(requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-31')
          expect(result.message).toEqual('Failure: VP was not verified')
        })

        test('should respond with status false and error INT-33, when JWS in the proof is invalid', async () => {
          // create invalid signature
          const _requestVerifyPresentation = { ...requestVerifyPresentation }
          _requestVerifyPresentation.vp.proof.jws = 'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..wd0lKZBoQ5AvOnllqXvNHoy7grQKTjJGK-h4qe7MDEdSTbOieDCx_oNzEUdqqGvKQXrSJKK9JIFJMOO7iOxZbg'

          // mock service response
          const serviceResponseMock: OutputVpIsVerifiable = {
            status:  false,
            message: 'Failure: VP was not verified',
            error:   new OperationError('INT-33')
          }
          // call and resolve the service stub with the mock service response
          verifyPresentationStub.resolves(serviceResponseMock)

          const result = await controller.verifyPresentation(_requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-33')
          expect(result.message).toEqual('Failure: VP was not verified')
        })

        test('should respond with status false and error INT-34, when invalid value is passed as input', async () => {
          // create invalid signature
          const _requestVerifyPresentation = { ...requestVerifyPresentation }
          _requestVerifyPresentation.vp.proof.jws = ''

          // mock service response
          const serviceResponseMock: OutputVpIsVerifiable = {
            status:  false,
            message: 'Failure: VP was not verified',
            error:   new OperationError('INT-34')
          }
          // call and resolve the service stub with the mock service response
          verifyPresentationStub.resolves(serviceResponseMock)

          const result = await controller.verifyPresentation(_requestVerifyPresentation)
          expect(result.status).toEqual(false)
          expect(result.error.code).toEqual('INT-34')
          expect(result.message).toEqual('Failure: VP was not verified')
        })
      })
    })
  })
})
