import { Request, Response, NextFunction } from 'express'
import z, { ZodTypeAny } from 'zod'
import { parseWithSchema } from 'common/dist/index.js'

type Schema<
  Query extends ZodTypeAny,
  Body extends ZodTypeAny,
  Params extends ZodTypeAny,
  Headers extends ZodTypeAny,
> = {
  querySchema: Query
  bodySchema: Body
  paramsSchema: Params
  headerSchema: Headers
}

function validateRoute<
  Query extends ZodTypeAny,
  Body extends ZodTypeAny,
  Params extends ZodTypeAny,
  Headers extends ZodTypeAny,
>(schema: Schema<Query, Body, Params, Headers>) {
  return (req: Request<any>, res: Response, next: NextFunction) => {
    try {
      const { querySchema, bodySchema, paramsSchema, headerSchema } = schema
      req.query = parseWithSchema({
        data: req.query,
        schema: querySchema,
        errorMessage: 'Unrecognized query parameters',
      })
      req.body = parseWithSchema({
        data: req.body,
        schema: bodySchema,
        errorMessage: 'Unrecognized body parameters',
      })
      req.params = parseWithSchema({
        data: req.params,
        schema: paramsSchema,
        errorMessage: 'Unrecognized path parameters',
      })
      req.headers = parseWithSchema({
        data: req.headers,
        schema: headerSchema,
        errorMessage: 'Unrecognized header parameters',
      })
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error)
        res.status(400).json(error.errors)
        return
      }

      // TODO throw(error)
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

function resolveParsedRequestTypes<
  Query extends ZodTypeAny,
  Body extends ZodTypeAny,
  Params extends ZodTypeAny,
  Headers extends ZodTypeAny,
>(_: Schema<Query, Body, Params, Headers>) {
  return (req: Request) => {
    return {
      query: req.query as z.infer<Query>,
      body: req.body as z.infer<Body>,
      params: req.params as z.infer<Params>,
      headers: req.headers as z.infer<Headers>,
    }
  }
}

export { validateRoute, resolveParsedRequestTypes }
