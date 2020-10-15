import app from '../index'
import supertest from 'supertest'
import { logger } from '../shared/logger'

const request = supertest(app)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

console.log(process.env.DID)
console.log(process.env.PASSWORD)

describe('Dummy Test ', () => {
  test('should be true', () => {
    expect(true).toBeTruthy()
  })
})
