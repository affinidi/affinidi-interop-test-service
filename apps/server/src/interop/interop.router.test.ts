import app from '../index'
import supertest from 'supertest'
import { signedPresentation } from '../factory/signedPresentation'
import {
  requestDidIsResolvable,
  requestVcIsVerifiable,
  requestVpIsVerifiable,
  requestOfferToken,
  requestOfferTokenArr,
  requestSignCredentials,
  requestPresentationChallenge,
  invalidUnsignedCredentials,
  invalidDid,
  didElem
} from '../testHelpers/testMock'
import { InputVerifyPresentation } from './interop.dto'
import { getOptionsForEnvironment }  from '../shared/getOptionsForEnvironment'
import { CommonNetworkMember as CoreNetwork } from '@affinityproject/wallet-core-sdk'
import { Affinity } from '@affinityproject/common-lib'
/* eslint-disable id-match */
import { buildVCV1Unsigned, buildVCV1Skeleton } from '@affinityproject/issuer-util'
import { VCSPhonePersonV1, getVCPhonePersonV1Context } from '@affinityproject/vc-data'
import { logger } from '../shared/logger'

const { ENVIRONMENT } = process.env
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

describe('Integration Tests: Single Test', () => {
  let request: supertest.SuperTest<supertest.Test>
  beforeEach(() => {
    request = supertest(app)
  })

  afterEach(() => {
    request = null
  })

  describe('POST /api/v1/interop/verify-presentation', () => {
    describe('Succcess Case:', () => {
      test('should respond with status true, when VP is verified', async () => {
        let vp
        // Pre-requisites
        try {
          // step 1: get payload URL for QR code (this is to be called from the Verifier app)
          const response = await request
            .post('/api/v1/interop/presentation-challenge')
            .set('Accept', 'application/json')
            .send(requestPresentationChallenge)
            .expect(200)

          const { tokenUrl } = response.body
          logger.info('Step 1: tokenUrl: ', tokenUrl)

          if (tokenUrl) {
            const uuid = tokenUrl.split('/').pop()

            // step 2: get presentation challenge (this is to be called from the Verifier app)
            const response1 = await request
              .get(`/api/v1/interop/presentation-challenge/${uuid}`)
              .set('Accept', 'application/json')
              .expect(200)

            const presentationChallenge = response1.body.token
            // logger.info('Step 2: presentationChallenge ')
            // logger.info(presentationChallenge)

            // step 3: retrieve VC from vault (this part is to be implemented by the Wallet app)

            // since this api doesnt have a VC stored in any vault, the workaround is to generate a VC on behalf of the Issuer, on the fly
            const { password, encryptedSeedElem, encryptedSeedJolo, registryUrl } = getOptionsForEnvironment(ENVIRONMENT)
            const options = {
              registryUrl
            }
            const affinity = new Affinity(options)
            const vc = await affinity.signCredential(
              buildVCV1Unsigned({
                skeleton: buildVCV1Skeleton<VCSPhonePersonV1>({
                  id:                '123',
                  credentialSubject: {
                    data: {
                      '@type':   ['Person', 'PersonE', 'PhonePerson'],
                      telephone: '555 555 5555'
                    }
                  },
                  holder:  { id: didElem },
                  type:    'PhoneCredentialPersonV1',
                  context: getVCPhonePersonV1Context()
                }),
                issuanceDate: new Date().toISOString()
              }),
              encryptedSeedJolo,
              password
            )

            // logger.info('Step 3: vc ')
            // logger.info(vc)

            // step 4: generate VP (this part is to be implemented by the Wallet app)
            const walletCommonNetworkMember = new CoreNetwork(password, encryptedSeedElem, options)
            vp = await walletCommonNetworkMember.createPresentationFromChallenge(
              presentationChallenge,
              [vc],
              'domain')

            // logger.info('Step 4: vp ')
            // logger.info(vp)
          } else {
            console.log('Payload URL was not found')
          }
        } catch (e) {
          console.log(e.message)
        }

        // Test the endpoint
        const requestVerifyPresentation: InputVerifyPresentation = {
          vp
        }
        const response = await request
          .post('/api/v1/interop/verify-presentation')
          .set('Accept', 'application/json')
          .send(requestVerifyPresentation)
          .expect(200)

        logger.info('Step test: response ')
        // logger.info(response.body)

        expect(response.body.status).toEqual(true)
      })
    })

    // describe('Failure Cases:', () => {
    //   test('should respond with status false and error INT-33, when JWS in the proof is invalid', async () => {

    //   })
    // })
  })
})
