import app from '../index'
import supertest from 'supertest'
import { logger } from '../shared/logger'

const request = supertest(app)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

console.log('ENVIRONMENT: ', process.env.ENVIRONMENT)
console.log('DID: ', process.env.DID)

describe('Dummy Test ', () => {
  test('should be true', () => {
    expect(true).toBeTruthy()
  })
})
