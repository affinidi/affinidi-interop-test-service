import { Body, Controller, Get, Post, Route, Query, Response, SuccessResponse, Tags } from 'tsoa'
import interopService from './interop.service'
import {
  InputDidIsResolvable,
  InputVcIsVerifiable,
  InputVpIsVerifiable,
  InputGenerateOfferRequestToken,
  InputSignCredentials,
  InputPresentationChallenge,
  InputVerifyPresentation,
  OutputError,
  OutputDidIsResolvable,
  OutputVcIsVerifiable,
  OutputVpIsVerifiable,
  OutputGenerateOfferRequestToken,
  OutputGetOfferRequestToken,
  OutputSignedCredential,
  OutputPresentationChallenge,
  OutputGetPresentationChallenge,
  OutputVerifyPresentation
} from './interop.dto'
import { logger } from '../shared/logger'

@Route('interop')
@Tags('interop')
export class InteropController extends Controller {
  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Response<OutputError>(500, 'Catastrophy')
  @Post('did-is-resolvable')
  public async didIsResolvable (@Body() input: InputDidIsResolvable): Promise<OutputDidIsResolvable> {
    logger.info('interopController#didIsResolvable')

    const response = await interopService.didIsResolvable(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  // VC methods
  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Post('vc-is-verifiable')
  public async vcIsVerifiable (@Body() input: InputVcIsVerifiable): Promise<OutputVcIsVerifiable> {
    logger.info('interopController#vcIsVerifiable')

    const response = await interopService.vcIsVerifiable(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Post('offer-request-token')
  public async generateOfferRequestToken (@Body() input: InputGenerateOfferRequestToken): Promise<OutputGenerateOfferRequestToken> {
    logger.info('interopController#generateOfferRequestToken')

    const response = await interopService.generateOfferRequestToken(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Get('offer-request-token/{uuid}')
  public async getOfferRequestToken (uuid: string): Promise<OutputGetOfferRequestToken> {
    logger.info('interopController#getOfferRequestToken')

    const response = await interopService.getOfferRequestToken(uuid)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Post('sign-credentials')
  public async getSignedCredential (@Body() input: InputSignCredentials): Promise<OutputSignedCredential> {
    logger.info('interopController#getSignedCredential')

    const response = await interopService.signCredentials(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  // VP methods
  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Post('vp-is-verifiable')
  public async vpIsVerifiable (@Body() input: InputVpIsVerifiable): Promise<OutputVpIsVerifiable> {
    logger.info('interopController#vpIsVerifiable')

    const response = await interopService.vpIsVerifiable(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Post('presentation-challenge')
  public async generatePresentationChallenge (@Body() input: InputPresentationChallenge): Promise<OutputPresentationChallenge> {
    logger.info('interopController#generatePresentationChallenge')

    const response = await interopService.generatePresentationChallenge(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Get('presentation-challenge/{uuid}')
  public async getPresentationChallenge (uuid: string): Promise<OutputGetPresentationChallenge> {
    logger.info('interopController#getPresentationChallenge')

    const response = await interopService.getPresentationChallenge(uuid)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Response<OutputError>(400, 'Failure')
  @Post('verify-presentation')
  public async verifyPresentation (@Body() input: InputVerifyPresentation): Promise<OutputVerifyPresentation> {
    logger.info('interopController#verifyPresentation')

    const response = await interopService.verifyPresentation(input)
    this.setStatus(response.httpStatusCode)
    delete response.httpStatusCode
    return response
  }

  @SuccessResponse(200, 'Success')
  @Get('is-alive')
  public async isAlive (): Promise<any> {
    logger.info('interopController#isAlive')

    return { message: 'This Service is Alive' }
  }
}
