import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { router } from './routes.js'

const app = express()

// TODO take from env
const corsOptions = {
  origin: 'http://localhost:8080',
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', router)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).send()
})

export { app }
