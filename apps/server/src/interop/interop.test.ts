import app from '../index'
import supertest from 'supertest'
import { logger } from '../shared/logger'

const request = supertest(app)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000

console.log(process.env.INTEROP_SECRETS)
console.log(JSON.parse(JSON.stringify(process.env.INTEROP_SECRETS)))

const SECRETS = JSON.parse(JSON.stringify(process.env.INTEROP_SECRETS))
console.log(SECRETS)

describe('Dummy Test ', () => {
  test('should be true', () => {
    expect(true).toBeTruthy()
  })
})
