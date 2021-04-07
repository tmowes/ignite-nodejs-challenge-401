import 'reflect-metadata'
import 'express-async-errors'

import express, { json, Request, Response, NextFunction } from 'express'
import cors from 'cors'

import './database'
import './shared/container'
import { router } from './routes'
import { AppError } from './shared/errors/AppError'
import createConnection from './database'

createConnection()

const app = express()

app.use(cors())
app.use(json())

app.use('/api/v1', router)

app.use(
  (err: Error, _: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message
      })
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} `,
    })
  }
)

export { app }
