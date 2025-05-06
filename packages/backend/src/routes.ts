import { Router, Request, Response } from 'express'
import dotenv from 'dotenv'
import z from 'zod'
import { validateRoute } from './validator.js'
import { CURRENCY_CODES, ConvertRes } from 'common/dist/index.js'

const envFile = '.env'
dotenv.config({ path: envFile })

const router = Router()

const SWOP_BASE_URL = 'https://swop.cx/rest'
const swopHeaders = new Headers()
swopHeaders.append('Authorization', `ApiKey ${process.env.SWOP_API_KEY}`)

type ConvertParams = {
  from: string
  to: string
  amount: string
}
type Empty = {}

type SwopRes = {
  base_currency: string
  quote_currency: string
  quote: number
  date: string
}

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
  paramsSchema: z
    .strictObject({
      from: z
        .enum(CURRENCY_CODES, { message: 'Invalid currency code' })
        .refine((data) => data === 'EUR', {
          message:
            "The only supported from currency is 'EUR'. Other currencies can not be converted.",
        }),
      to: z.enum(CURRENCY_CODES, { message: 'Invalid currency code' }),
    })
    .refine((data) => data.from !== data.to, {
      message: 'Same currency codes',
      path: ['to'],
    }),
  headerSchema: z.object({}),
}

router.get<ConvertParams, ConvertRes, Empty, Empty>(
  '/convert/:from/:to',
  validateRoute(convertSchema),
  async (req, res, _) => {
    const { from, to } = req.params as unknown as {
      from: string
      to: string
    }

    let swopRes = await getJSON<SwopRes>({
      url: `${SWOP_BASE_URL}/rates/${from}/${to}`,
      method: 'GET',
      headers: swopHeaders,
    })
    if (swopRes.quote === null) {
      res.status(422).json({ message: 'Request could not be processed.' })
      return
    }

    res.json({
      fromCurrency: swopRes.base_currency,
      toCurrency: swopRes.quote_currency,
      rate: swopRes.quote,
      date: swopRes.date,
    })
  },
)

export { router }
