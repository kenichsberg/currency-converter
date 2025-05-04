import { describe, it, expect, beforeEach, beforeAll } from '@jest/globals'
import request from 'supertest'
import { app } from '../src/app'

it('', async () => {
  const res = await request(app).get('/api/convert/EUR/USD/2.5')

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('converted')
  expect(typeof res.body.converted).toBe('number')
  console.log(res.status)
  console.log(res.body)
})
