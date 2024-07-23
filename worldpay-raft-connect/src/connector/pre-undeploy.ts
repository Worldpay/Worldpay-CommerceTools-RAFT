import dotenv from 'dotenv'
dotenv.config()

import { createApiRoot } from '../client/create.client'
import { assertError } from '../utils/assert.utils'
import { removeConnectorEvents } from './actions'

async function preUndeploy(): Promise<void> {
  const apiRoot = createApiRoot()
  await removeConnectorEvents(apiRoot)
  // DON'T ADD THE LINE BELOW, before understanding the impact. It probably destroys all data when deploying a new version of a connector.
  // await unloadConnectorTypes(apiRoot)
}

async function run(): Promise<void> {
  try {
    await preUndeploy()
  } catch (error) {
    assertError(error)
    process.stderr.write(`Pre-undeploy failed: ${error.message}`)
    process.exitCode = 1
  }
}

run()
