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

// TODO: make this the function

export const staticSignedVCV1 = {
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
    id: 'did:elem:EiD5Rx3mRfvGTD-IBzjtOs0k5nLMwiPgZyd2_TYuGBK0cw;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU1XRmlZalJpWW1GaFpXTTVOekJrTUdNeU5XUmtORFpoWkRNMlpUUTBZalJoWWpNMk5UQTBOVGhrTWpOaE1EWmlaVEJsTnpFeU9HSm1aRE13TVROaU9TSjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TXpObVpEUTFPR1JoWldKbU5HWXpOV0V4TW1ZMU16VmxaRFl6TkdRNVl6ZzBaVGszTVRrek1UWXlOekV4TjJKbU9UTTJNVEJqTkRBd1pUWTROVFZqTWpVaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiZUdUTkdGdk5ZU2lOa3FJWUhud2ZCUGM4M2o1ZEI4a3pqeFRQYXVwMkpPUWJiNjU1cG92ajFOelk1MXl1WG1XR3Z5aHBiTTNyTmRtaXZJNWVoZ1p4RUEifQ'
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
  expirationDate: '2021-09-09T21:01:12.530Z',
  issuer:         'did:elem:EiD5Rx3mRfvGTD-IBzjtOs0k5nLMwiPgZyd2_TYuGBK0cw;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU1XRmlZalJpWW1GaFpXTTVOekJrTUdNeU5XUmtORFpoWkRNMlpUUTBZalJoWWpNMk5UQTBOVGhrTWpOaE1EWmlaVEJsTnpFeU9HSm1aRE13TVROaU9TSjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TXpObVpEUTFPR1JoWldKbU5HWXpOV0V4TW1ZMU16VmxaRFl6TkdRNVl6ZzBaVGszTVRrek1UWXlOekV4TjJKbU9UTTJNVEJqTkRBd1pUWTROVFZqTWpVaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiZUdUTkdGdk5ZU2lOa3FJWUhud2ZCUGM4M2o1ZEI4a3pqeFRQYXVwMkpPUWJiNjU1cG92ajFOelk1MXl1WG1XR3Z5aHBiTTNyTmRtaXZJNWVoZ1p4RUEifQ',
  proof:          {
    type:               'EcdsaSecp256k1Signature2019',
    created:            '2020-09-09T20:51:12Z',
    verificationMethod: 'did:elem:EiD5Rx3mRfvGTD-IBzjtOs0k5nLMwiPgZyd2_TYuGBK0cw#primary',
    proofPurpose:       'assertionMethod',
    jws:                'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..hVLK2CaCn81z4lkrapJRnPtzxRm9spOC5CjJmkM_PzJ_KAX-j75I5pfgrZwR57JFgZJ1hiyip9M0UNjMe1bvdw'
  }
}
