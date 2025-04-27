import { Router, Request, Response } from 'express'
import dotenv from 'dotenv'

const envFile = '.env'
dotenv.config({ path: envFile })

const router = Router()

const SWOP_BASE_URL = 'https://swop.cx/rest'
const swopHeaders = new Headers()
swopHeaders.append('Authorization', `ApiKey ${process.env.SWOP_API_KEY}`)

const getJSON = <T>(config: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers: Headers
}): Promise<T> => {
  const fetchConfig = { method: 'GET', headers: config.headers }
  return fetch(config.url, fetchConfig).then<T>((response) => response.json())
}

router.get('/convert/:from/:to/:amount', async (req, res, next) => {
  const amount = parseFloat(req.params.amount)
  if (isNaN(amount)) return res.send(400)

  let swopRes = await getJSON<{ quote: number }>({
    url: `${SWOP_BASE_URL}/rates/${req.params.from}/${req.params.to}`,
    method: 'GET',
    headers: swopHeaders,
  })
  if (swopRes === null) return res.send(400)

  console.log('swopRes: ', swopRes)
  const rate = swopRes.quote
  console.log(typeof rate)
  if (typeof rate !== 'number') return res.send(400)

  return res.json({ converted: amount * rate })
})

export { router }
