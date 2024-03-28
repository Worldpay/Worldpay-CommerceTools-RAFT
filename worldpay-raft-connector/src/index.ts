import * as dotenv from 'dotenv'
dotenv.config()

import express, { Express } from 'express'
import basicAuth from 'express-basic-auth'
import bodyParser from 'body-parser'

// Import routes
import ServiceRoutes from './routes/service.route'
import HealthRoute from './routes/health.route'

// Import logger
import { logger } from './utils/logger.utils'

import { readConfiguration } from './utils/config.utils'
import { errorMiddleware } from './middleware/error.middleware'
import { initializeConfig } from '@gradientedge/worldpay-raft-connector'

// Read env variables
const config = readConfiguration()
initializeConfig(config, false)

const PORT = 8080

// Create the express app
const app: Express = express()
app.disable('x-powered-by')

app.use(
  basicAuth({
    users: { [config.connector.user]: config.connector.secret },
  }),
)
// Define configurations
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Define routes
app.use('/service', ServiceRoutes)
app.use('/health', HealthRoute)

// Global error handler
app.use(errorMiddleware)

// Listen the application
const server = app.listen(PORT, () => {
  logger.info(`⚡️ Service application listening on port ${PORT}`)
})

export default server
