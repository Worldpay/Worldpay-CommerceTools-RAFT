import { ClientBuilder, AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2'
import { Config } from '../config'

/**
 * Create a new client builder.
 * This code creates a new Client that can be used to make API calls
 */
export const createClient = (config: Config) =>
  new ClientBuilder()
    .withProjectKey(config.commercetools.projectKey)
    .withClientCredentialsFlow(authMiddlewareOptions(config))
    .withHttpMiddleware(httpMiddlewareOptions(config))
    .build()

function authMiddlewareOptions(config: Config): AuthMiddlewareOptions {
  return {
    host: `https://auth.${config.commercetools.region}.commercetools.com`,
    projectKey: config.commercetools.projectKey,
    credentials: {
      clientId: config.commercetools.clientId,
      clientSecret: config.commercetools.clientSecret,
    },
  }
}

/**
 * Configure Middleware. Example only. Adapt on your own
 */
function httpMiddlewareOptions(config: Config): HttpMiddlewareOptions {
  return { host: `https://api.${config.commercetools.region}.commercetools.com` }
}
