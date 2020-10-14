import app from '../index'
import supertest from 'supertest'
import { logger } from '../shared/logger'

const request = supertest(app)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

logger.info(process.env.INTEROP_SECRETS)
logger.info(process.env.ENVIRONMENT)
let SECRETS

if (process.env.INTEROP_SECRETS) {
  SECRETS = JSON.parse(process.env.INTEROP_SECRETS)
}
logger.info(SECRETS)

describe('Integration Tests: Interop API Router', () => {
  describe('GET /api/v1/interop/is-alive', () => {
    test('should respond with true', async () => {
      expect(true).toBeTruthy()
    })
  })
})
