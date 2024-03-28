import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import { getConfig } from '../config'
import { createClient } from './client-builder'

/**
 * Create client with apiRoot
 * apiRoot can now be used to build requests to de Composable Commerce API
 */
export const createApiRoot = ((root?: any) => () => {
  if (root) {
    return root
  }

  const config = getConfig()
  root = createApiBuilderFromCtpClient(createClient(config)).withProjectKey({
    projectKey: config.commercetools.projectKey,
  })

  return root
})()
