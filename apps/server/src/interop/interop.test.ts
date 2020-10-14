import app from '../index'
import supertest from 'supertest'

const request = supertest(app)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

describe('Integration Tests: Interop API Router', () => {
  describe('GET /api/v1/interop/is-alive', () => {
    test('should respond with status 200', async () => {
      const response = await request
        .get('/api/v1/interop/is-alive')
        .expect(200)

      expect(response.body.message).toEqual('Affinidi Interop Service is Alive')
      expect(response.status).toEqual(200)
    })
  })
})
