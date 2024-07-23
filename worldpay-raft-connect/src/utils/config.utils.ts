import { Config } from '@gradientedge/worldpay-raft-connector'
import { validateEnvVars } from '../validators/env.validators'

export interface ConnectorConfig extends Config {
  connector: {
    user: string
    secret: string
  }
}
let envVars: ConnectorConfig

/**
 * Read the configuration env vars
 * (Add yours accordingly)
 *
 * @returns The configuration with the correct env vars
 */
export const readConfiguration = (): ConnectorConfig => {
  if (!envVars) {
    envVars = {
      commercetools: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
        projectKey: process.env.CTP_PROJECT_KEY as string,
        region: process.env.CTP_REGION as string,
        scopes: process.env.CTP_SCOPES as string,
      },
      worldpayRaft: {
        URL: process.env.WORLDPAY_URL as string,
        path: process.env.WORLDPAY_PATH as string,
        license: process.env.WORLDPAY_LICENSE as string,
        timeoutMs: parseInt(process.env.WORLDPAY_TIMEOUT_MS ?? '5000'),
      },
      connector: {
        user: 'admin',
        secret: process.env.CONNECTOR_SECRET as string,
      },
    }

    validateEnvVars(envVars)
  }

  return envVars
}
