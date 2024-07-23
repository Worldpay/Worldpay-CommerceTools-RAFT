import dotenv from 'dotenv'

// Load environment vars at start - so that any config is available when modules initialise themselves using env vars
dotenv.config()

import { createApiRoot } from '../client/create.client'
import { assertError, assertString } from '../utils/assert.utils'
import { loadConnectorCustomTypes, registerConnectorEvents } from './actions'

const CONNECT_SERVICE_URL = 'CONNECT_SERVICE_URL'

async function postDeploy(properties: Map<string, unknown>): Promise<void> {
  const applicationUrl = properties.get(CONNECT_SERVICE_URL)

  assertString(applicationUrl, CONNECT_SERVICE_URL)

  const apiRoot = createApiRoot()
  await registerConnectorEvents(apiRoot, applicationUrl)
  await loadConnectorCustomTypes(apiRoot)
}

async function run(): Promise<void> {
  try {
    const properties = new Map(Object.entries(process.env))
    await postDeploy(properties)
  } catch (error) {
    assertError(error)
    process.stderr.write(`Post-deploy failed: ${error.message}`)
    process.exitCode = 1
  }
}

run()
