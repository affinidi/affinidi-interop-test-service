import app from '../index'
import supertest from 'supertest'
import { signedPresentation } from '../factory/signedPresentation'
/* eslint-disable id-match */
import {
  requestDidIsResolvable,
  requestVpIsVerifiable,
  requestOfferToken,
  requestOfferTokenArr,
  requestSignCredentials,
  requestPresentationChallenge,
  invalidUnsignedCredentials,
  invalidDid,
  DID
} from '../testHelpers/testMock'
import { affinity, commonNetworkMember } from '../shared/affinidi'
import { InputVerifyPresentation } from './interop.dto'
import { getOptionsForEnvironment }  from '../shared/getOptionsForEnvironment'
import { unsignedCredentials } from '../factory/unsignedCredential'

import { buildVCV1Unsigned, buildVCV1Skeleton } from '@affinidi/vc-common'
import { VCSPhonePersonV1, getVCPhonePersonV1Context } from '@affinidi/vc-data'
import { logger } from '../shared/logger'

const { password, encryptedSeed, encryptedSeedJolo } = getOptionsForEnvironment(process.env.ENVIRONMENT)
const unsignedVCV1 = unsignedCredentials[0]
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

describe('Integration Tests: Interop API Router', () => {
  let request: supertest.SuperTest<supertest.Test>
  beforeEach(() => {
    request = supertest(app)
  })

  afterEach(() => {
    request = null
  })

  describe('GET /v1/is-alive', () => {
    test('should respond with status 200', async () => {
      const response = await request
        .get('/v1/is-alive')
        .expect(200)

      expect(response.body.message).toEqual('Affinidi Interop Service is Alive')
      expect(response.status).toEqual(200)
    })
  })

  describe('POST /v1/did-is-resolvable', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true and the didDocument, when Did is resolvable', async () => {
        const response = await request
          .post('/v1/did-is-resolvable')
          .set('Accept', 'application/json')
          .send(requestDidIsResolvable)
          .expect(200)

        expect(response.body.status).toEqual(true)
      })
    })

    describe('Failure Cases:', () => {
      test('should respond with error code INT-3, when empty param is passed', async () => {
        const _requestDidIsResolvable = { ...requestDidIsResolvable }
        _requestDidIsResolvable.did = ''
        const response = await request
          .post('/v1/did-is-resolvable')
          .set('Accept', 'application/json')
          .send(_requestDidIsResolvable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-3')
      })

      test('should respond with error code INT-3, when the passed param has validation errors', async () => {
        const _requestDidIsResolvable = { ...requestDidIsResolvable }
        _requestDidIsResolvable.did = invalidDid
        const response = await request
          .post('/v1/did-is-resolvable')
          .set('Accept', 'application/json')
          .send(_requestDidIsResolvable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-3')
      })
    })
  })

  // Verifiable Credentials endpoints
  describe('POST /v1/vc-is-verifiable', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true, when vc is validated', async () => {
        const _requestVcIsVerifiable = {
          credential:  await affinity.signCredential(unsignedVCV1, encryptedSeed, password),
          vcVersion:  1
        }

        const response = await request
          .post('/v1/vc-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVcIsVerifiable)
          .expect(200)

        expect(response.body.status).toEqual(true)
      })
    })

    describe('Failure Case:', () => {
      test('should respond with status false and error INT-5, when issuer is invalid', async () => {
        // create invalid signature
        const _credential: any = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)

        _credential.issuer = ''

        const _requestVcIsVerifiable = {
          credential: _credential
        }

        const response = await request
          .post('/v1/vc-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVcIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-5')
      })

      test('should respond with status false and error INT-5, when holder id is invalid', async () => {
        // create invalid signature
        const _credential: any = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)

        const _holder = { ..._credential.holder }
        _holder.id = ''

        _credential.holder = _holder

        const _requestVcIsVerifiable = {
          credential: _credential
        }

        const response = await request
          .post('/v1/vc-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVcIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-5')
      })

      test('should respond with status false and error INT-5, when id is invalid', async () => {
        // create invalid signature
        const _credential: any = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)

        _credential.id = ''

        const _requestVcIsVerifiable = {
          credential: _credential
        }

        const response = await request
          .post('/v1/vc-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVcIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-5')
      })

      test('should respond with status false and error INT-6, when vc is expired', async () => {
        // create expired vc
        const _credential: any = await affinity.signCredential(unsignedVCV1, encryptedSeed, password)
        _credential.expirationDate = '2010-01-17T07:06:35.402Z'

        const _requestVcIsVerifiable = {
          credential: _credential
        }

        const response = await request
          .post('/v1/vc-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVcIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-6')
      })
    })
  })

  describe('POST /v1/offer-request-token', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true and token, when single credential is provided as valid array', async () => {
        const response = await request
          .post('/v1/offer-request-token')
          .set('Accept', 'application/json')
          .send(requestOfferToken)
          .expect(200)

        expect(response.body.status).toEqual(true)
        expect(response.body).toHaveProperty('tokenUrl')
      })

      test('should respond with status true and tokens, when credentials are provided as valid array', async () => {
        const response = await request
          .post('/v1/offer-request-token')
          .set('Accept', 'application/json')
          .send(requestOfferTokenArr)
          .expect(200)

        expect(response.body.status).toEqual(true)
        expect(response.body).toHaveProperty('tokenUrl')
      })
    })
  })

  describe('POST /v1/sign-credentials', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true and signed vc, when Offer Response Token is provided', async () => {
        const response = await request
          .post('/v1/sign-credentials')
          .set('Accept', 'application/json')
          .send(requestSignCredentials)
          .expect(200)

        expect(response.body.status).toEqual(true)
        expect(response.body).toHaveProperty('signedCredentials')
      })
    })

    describe('Failure Cases:', () => {
      test('should respond with error code INT-9, when credential is provided as non-array object', async () => {
        const _requestSignCredentials = { ...requestSignCredentials }
        _requestSignCredentials.unsignedCredentials = invalidUnsignedCredentials

        const response = await request
          .post('/v1/sign-credentials')
          .set('Accept', 'application/json')
          .send(_requestSignCredentials)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body.error.code).toEqual('INT-9')
        expect(response.body.error.message).toContain('Offered Credentials Type name mismatch Error')
      })
    })
  })

  // Verifiable Presentation endpoints
  describe('POST /v1/vp-is-verifiable', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true, when vp is validated', async () => {
        const response = await request
          .post('/v1/vp-is-verifiable')
          .set('Accept', 'application/json')
          .send(requestVpIsVerifiable)
          .expect(200)

        expect(response.body.status).toEqual(true)
      })
    })

    describe('Failure Cases:', () => {
      test('should respond with error code INT-30, when VP signature is invalid (proof is missing)', async () => {
        const _vp = { ...signedPresentation }
        delete _vp.proof
        const _requestVpIsVerifiable = {
          vp: _vp
        }
        const response = await request
          .post('/v1/vp-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVpIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-30')
      })

      test('should respond with error code INT-30, when VP signature is invalid (type is missing)', async () => {
        const _vp = { ...signedPresentation }
        delete _vp.type
        const _requestVpIsVerifiable = {
          vp: _vp
        }
        const response = await request
          .post('/v1/vp-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVpIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-30')
      })

      test('should respond with error code INT-30, when VP signature is invalid (holder is missing)', async () => {
        const _vp = { ...signedPresentation }
        delete _vp.holder
        const _requestVpIsVerifiable = {
          vp: _vp
        }
        const response = await request
          .post('/v1/vp-is-verifiable')
          .set('Accept', 'application/json')
          .send(_requestVpIsVerifiable)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-30')
      })
    })
  })

  describe('POST /v1/presentation-challenge', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true and the token, when presentation challenge token is returned', async () => {
        const response = await request
          .post('/v1/presentation-challenge')
          .set('Accept', 'application/json')
          .send(requestPresentationChallenge)
          .expect(200)

        expect(response.body.status).toEqual(true)
        expect(response.body).toHaveProperty('tokenUrl')
      })

      test('should respond with status true, when credentialRequirements is empty array', async () => {
        const _requestPresentationChallenge = { ...requestPresentationChallenge }
        _requestPresentationChallenge.credentialRequirements = []

        const response = await request
          .post('/v1/presentation-challenge')
          .set('Accept', 'application/json')
          .send(_requestPresentationChallenge)
          .expect(200)

        expect(response.body.status).toEqual(true)
        expect(response.body).toHaveProperty('tokenUrl')
      })
    })

    describe('Failure Cases:', () => {
      test('should respond with status false and error INT-32, when issuerDid is null', async () => {
        const _requestPresentationChallenge = { ...requestPresentationChallenge }
        _requestPresentationChallenge.issuerDid = ''

        const response = await request
          .post('/v1/presentation-challenge')
          .set('Accept', 'application/json')
          .send(_requestPresentationChallenge)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-32')
      })

      test('should respond with status false and error INT-32, when credentialRequirement object doesnt have type key', async () => {
        const _requestPresentationChallenge = { ...requestPresentationChallenge }
        _requestPresentationChallenge.credentialRequirements = [{}]

        const response = await request
          .post('/v1/presentation-challenge')
          .set('Accept', 'application/json')
          .send(_requestPresentationChallenge)
          .expect(400)

        expect(response.body.status).toEqual(false)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error.code).toEqual('INT-32')
      })
    })
  })

  describe('POST /v1/verify-presentation', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true, when VP is verified', async () => {
        let vp, tokenUrl
        // Pre-requisites
        try {
          // step 1: get payload URL for QR code (this is to be called from the Verifier app)
          const tokenResponse = await request
            .post('/v1/presentation-challenge')
            .set('Accept', 'application/json')
            .send(requestPresentationChallenge)

          if (tokenResponse.body.status) {
            tokenUrl = tokenResponse.body.tokenUrl
            const uuid = tokenUrl.split('/').pop()

            // step 2: get presentation challenge (this is to be called from the Verifier app)
            const challengeResponse = await request
              .get(`/v1/presentation-challenge/${uuid}`)
              .set('Accept', 'application/json')
              .expect(200)

            const presentationChallenge = challengeResponse.body.token

            // step 3: retrieve VC from vault (this part is to be implemented by the Wallet app)

            // since this api doesnt have a VC stored in any vault, the workaround is to generate a VC on behalf of the Issuer, on the fly
            const vc = await affinity.signCredential(
              buildVCV1Unsigned({
                skeleton: buildVCV1Skeleton<VCSPhonePersonV1>({
                  id:                'urn:uuid:11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
                  credentialSubject: {
                    data: {
                      '@type':   ['Person', 'PersonE', 'PhonePerson'],
                      telephone: '555 555 5555'
                    }
                  },
                  holder:  { id: DID },
                  type:    'PhoneCredentialPersonV1',
                  context: getVCPhonePersonV1Context()
                }),
                issuanceDate:   new Date().toISOString(),
                expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
              }),
              encryptedSeed,
              password
            )

            // step 4: generate VP (this part is to be implemented by the Wallet app)
            vp = await commonNetworkMember.createPresentationFromChallenge(
              presentationChallenge,
              [vc],
              'domain')
          } else {
            logger.error(tokenResponse.body.error.message)
          }
        } catch (e) {
          logger.error('Catch Error')
          logger.error(e)
        }

        // Test the endpoint
        const requestVerifyPresentation: InputVerifyPresentation = {
          vp
        }
        const response = await request
          .post('/v1/verify-presentation')
          .set('Accept', 'application/json')
          .send(requestVerifyPresentation)
          .expect(200)

        expect(response.body.status).toEqual(true)
      })
    })

    // describe('Failure Cases:', () => {
    //   test('should respond with status false and error INT-33, when JWS in the proof is invalid', async () => {

    //   })
    // })
  })
})
