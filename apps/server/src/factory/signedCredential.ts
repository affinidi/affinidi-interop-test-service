/* eslint-disable id-match */
export const signedVcOld = {
  '@context':
    [
      {
        id:                        '@id',
        type:                      '@type',
        cred:                      'https://w3id.org/credentials#',
        schema:                    'http://schema.org/',
        dc:                        'http://purl.org/dc/terms/',
        xsd:                       'http://www.w3.org/2001/XMLSchema#',
        sec:                       'https://w3id.org/security#',
        Credential:                'cred:Credential',
        issuer:                    { '@id': 'cred:issuer', '@type': '@id' },
        issued:                    { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
        claim:                     { '@id': 'cred:claim', '@type': '@id' },
        credential:                { '@id': 'cred:credential', '@type': '@id' },
        expires:                   { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        proof:                     { '@id': 'sec:proof', '@type': '@id' },
        EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
        created:                   { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator:                   { '@id': 'dc:creator', '@type': '@id' },
        domain:                    'sec:domain',
        nonce:                     'sec:nonce',
        signatureValue:            'sec:signatureValue'
      },
      {
        ProofOfNameCredential: 'https://identity.jolocom.com/terms/ProofOfNameCredential',
        schema:                'http://schema.org/',
        familyName:            'schema:familyName',
        givenName:             'schema:givenName'
      }],
  id:      'claimId:63b5d11c0d1b5566',
  issuer:  'did:jolo:6df6fd4a876dcd375fbc5d630e64e7529f27e9612aecbbbf3213861a2b0b7e9d',
  issued:  '2020-01-17T07:06:35.403Z',
  type:    ['Credential', 'ProofOfNameCredential'],
  expires: '2021-01-16T07:06:35.337Z',
  proof:   {
    created:        '2020-01-17T07:06:35.402Z',
    type:           'EcdsaKoblitzSignature2016',
    nonce:          'cf82f1b448514229',
    signatureValue: '866191eb3f7a871b59d0c665ed8a4c3b799124aa54e9faf7d2163486fd146c14047d3d4a688056d4c6d0ad221170af55561d87b872e428d30b5c1fa8ffd27f83',
    creator:        'did:jolo:6df6fd4a876dcd375fbc5d630e64e7529f27e9612aecbbbf3213861a2b0b7e9d#keys-1'
  },
  claim: {
    givenName:  'DenisUpdated',
    familyName: 'Popov',
    id:         'did:jolo:6df6fd4a876dcd375fbc5d630e64e7529f27e9612aecbbbf3213861a2b0b7e9d'
  },
  name: 'Name'
}

export const signedVCV1 = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      PhoneCredentialPersonV1: {
        '@id':      'https://schema.affinity-project.org/PhoneCredentialPersonV1',
        '@context': {
          '@version':   1.1,
          '@protected': true
        }
      },
      data: {
        '@id':      'https://schema.affinity-project.org/data',
        '@context': [
          null,
          {
            '@version':    1.1,
            '@protected':  true,
            '@vocab':      'https://schema.org/',
            PhonePerson:  {
              '@id':      'https://schema.affinity-project.org/PhonePerson',
              '@context': {
                '@version':   1.1,
                '@protected': true,
                '@vocab':     'https://schema.org/',
                telephone:    'https://schema.org/telephone'
              }
            },
            PersonE: {
              '@id':      'https://schema.affinity-project.org/PersonE',
              '@context': {
                '@version':   1.1,
                '@protected': true,
                '@vocab':     'https://schema.org/'
              }
            },
            OrganizationE: {
              '@id':      'https://schema.affinity-project.org/OrganizationE',
              '@context': {
                '@version':      1.1,
                '@protected':    true,
                '@vocab':        'https://schema.org/',
                hasCredential: 'https://schema.org/hasCredential',
                industry:      'https://schema.affinity-project.org/industry'
              }
            },
            Credential: {
              '@id':      'https://schema.affinity-project.org/Credential',
              '@context': {
                '@version':     1.1,
                '@protected':   true,
                '@vocab':       'https://schema.org/',
                dateRevoked:  'https://schema.affinity-project.org/dateRevoked',
                recognizedBy: 'https://schema.affinity-project.org/recognizedBy'
              }
            },
            OrganizationalCredential: {
              '@id':      'https://schema.affinity-project.org/OrganizationalCredential',
              '@context': {
                '@version':            1.1,
                '@protected':          true,
                '@vocab':              'https://schema.org/',
                credentialCategory:  'https://schema.affinity-project.org/credentialCategory',
                organizationType:    'https://schema.affinity-project.org/organizationType',
                goodStanding:        'https://schema.affinity-project.org/goodStanding',
                active:              'https://schema.affinity-project.org/active',
                primaryJurisdiction: 'https://schema.affinity-project.org/primaryJurisdiction',
                identifier:          'https://schema.org/identifier'
              }
            }
          }
        ]
      }
    }
  ],
  id:   'claimId:75444196a4640281',
  type: [
    'VerifiableCredential',
    'PhoneCredentialPersonV1',
    'TestDenisCred'
  ],
  holder: {
    id: 'did:jolo:f559265b6c1becd56109c5623435fa797ad4308a4a686f8eda709f3387d303e6'
  },
  credentialSubject: {
    data: {
      '@type': [
        'Person',
        'PersonE',
        'PhonePerson'
      ],
      telephone: '+1 555 555 5555'
    }
  },
  issuanceDate:   '2020-09-09T20:51:12.601Z',
  expirationDate: '2020-09-09T21:01:12.530Z',
  issuer:         'did:jolo:f559265b6c1becd56109c5623435fa797ad4308a4a686f8eda709f3387d303e6',
  proof:          {
    type:               'EcdsaSecp256k1Signature2019',
    created:            '2020-09-09T20:51:12Z',
    verificationMethod: 'did:jolo:f559265b6c1becd56109c5623435fa797ad4308a4a686f8eda709f3387d303e6#keys-1',
    proofPurpose:       'assertionMethod',
    jws:                'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..hVLK2CaCn81z4lkrapJRnPtzxRm9spOC5CjJmkM_PzJ_KAX-j75I5pfgrZwR57JFgZJ1hiyip9M0UNjMe1bvdw'
  }
}
