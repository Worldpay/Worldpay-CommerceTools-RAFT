import { type AuthMiddlewareOptions } from '@commercetools/sdk-client-v2' // Required for auth

import { readConfiguration } from '../utils/config.utils'
/**
 * Configure Middleware.
 */
export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `https://auth.${readConfiguration().commercetools.region}.commercetools.com`,
  projectKey: readConfiguration().commercetools.projectKey!,
  credentials: {
    clientId: readConfiguration().commercetools.clientId!,
    clientSecret: readConfiguration().commercetools.clientSecret!,
  },
  scopes: [readConfiguration().commercetools.scopes ? (readConfiguration().commercetools.scopes as string) : 'default'],
}
