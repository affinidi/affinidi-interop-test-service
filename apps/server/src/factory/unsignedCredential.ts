/* eslint-disable id-match */

import { buildVCV1Unsigned, buildVCV1Skeleton } from '@affinityproject/issuer-util'
import { VCSPhonePersonV1, getVCPhonePersonV1Context } from '@affinityproject/vc-data'

export const unsignedCredentials = [
  buildVCV1Unsigned({
    skeleton: buildVCV1Skeleton<VCSPhonePersonV1>({
      id:                'placeholder',
      credentialSubject: {
        data: {
          '@type':   ['Person', 'PersonE', 'PhonePerson'],
          telephone: '+1 555 555 5555'
        }
      },
      holder:  { id: 'placeholder' },
      type:    ['PhoneCredentialPersonV1', 'TestDenisCred'],
      context: getVCPhonePersonV1Context()
    }),
    issuanceDate:   new Date().toISOString(),
    expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
  })
]
