/* eslint-disable id-match */
import { OfferedCredential } from '@affinityproject/wallet-core-sdk/dist/dto/shared.dto'

class LocalOperationError {
    type: string
    code: string
    message: string
    httpStatus: string
    httpStatusCode = 400
}

export class InputDidIsResolvable {
    did: string
}

export class InputVcIsVerifiable {
    credential: any
    vcVersion?: number
}

export class InputVpIsVerifiable {
    vp: any
}

export class InputPresentationChallenge {
    issuerDid?: string
    credentialRequirements: any
}

export class InputVerifyPresentation {
    vp: any
}

export class InputGenerateOfferRequestToken {
    offeredCredentials: OfferedCredential[]
}

export class InputSignCredentials {
    responseToken: string
    unsignedCredentials?: any
}

export class OutputDidIsResolvable {
    status: boolean
    message: string
    error?: LocalOperationError
    didDocument?: {}
}

export class OutputVcIsVerifiable {
    status: boolean
    message: string
    error?: LocalOperationError
}

export class OutputGenerateOfferRequestToken {
    status: boolean
    message: string
    error?: LocalOperationError
    tokenUrl?: string
}

export class OutputGetOfferRequestToken {
    status: boolean
    message: string
    purpose: string
    error?: LocalOperationError
    token?: string
}

export class OutputVpIsVerifiable {
    status: boolean
    message: string
    error?: LocalOperationError
}

export class OutputVerifyPresentation {
    status: boolean
    message: string
    error?: LocalOperationError
}

export class OutputPresentationChallenge {
    status: boolean
    message: string
    error?: LocalOperationError
    tokenUrl?: string
}

export class OutputGetPresentationChallenge {
    status: boolean
    message: string
    purpose: string
    error?: LocalOperationError
    token?: string
}

export class OutputSignedCredential {
    status: boolean
    message: string
    error?: LocalOperationError
    signedCredentials?: any
}

export class OutputError {
    status = false
    message: string
    error: LocalOperationError
}
