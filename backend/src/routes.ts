import { Router, Request, Response } from 'express'
import dotenv from 'dotenv'
import z from 'zod'
import { validateRoute } from './validator.js'
import { CURRENCY_CODES } from 'common'

const envFile = '.env'
dotenv.config({ path: envFile })

const router = Router()

const SWOP_BASE_URL = 'https://swop.cx/rest'
const swopHeaders = new Headers()
swopHeaders.append('Authorization', `ApiKey ${process.env.SWOP_API_KEY}`)

type ConvertParams = {
  from: string
  to: string
  amount: number
}
type ConvertRes =
  | {
      fromCurrency: string
      toCurrency: string
      rate: number
      date: string
      fromAmount: number
      toAmount: number
    }
  | { message: any }
type Empty = {}

type SwopRes = {
  base_currency: string
  quote_currency: string
  quote: number
  date: string
}

// TODO apply fetcher style
async function getJSON<T>(config: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers: Headers
}): Promise<T> {
  const fetchConfig = { method: config.method, headers: config.headers }
  return fetch(config.url, fetchConfig).then<T>((response) => response.json())
}

const convertSchema = {
  querySchema: z.strictObject({}),
  bodySchema: z.strictObject({}),
  paramsSchema: z.strictObject({
    from: z.enum(CURRENCY_CODES),
    to: z.enum(CURRENCY_CODES),
    amount: z.number().positive(),
  }),
  headerSchema: z.strictObject({}),
}

router.get<ConvertParams, ConvertRes, Empty, Empty>(
  '/convert/:from/:to/:amount',
  validateRoute(convertSchema),
  async (req, res, _) => {
    //const amount = parseFloat(req.params.amount)
    //if (isNaN(amount)) return res.send(400)
    //const { params } = resolveParsedRequestTypes(convertSchema)(req)
    const { from, to, amount } = req.params as unknown as { from: string; to: string; amount: number }
    if (from !== 'EUR') {
      res.status(400).json({ message: '' })
      return
    }

    let swopRes = await getJSON<SwopRes>({
      url: `${SWOP_BASE_URL}/rates/${from}/${to}`,
      method: 'GET',
      headers: swopHeaders,
    })
    if (swopRes.quote === null) {
      res.status(400).json({ message: swopRes })
      return
    }

    //console.log('swopRes: ', swopRes)
    //const rate = swopRes.quote
    //console.log(typeof rate)
    //if (typeof rate !== 'number') return res.send(400)

    res.json({
      fromCurrency: swopRes.base_currency,
      toCurrency: swopRes.quote_currency,
      rate: swopRes.quote,
      date: swopRes.date,
      fromAmount: amount,
      toAmount: amount * swopRes.quote,
    })
  },
)

export { router }
