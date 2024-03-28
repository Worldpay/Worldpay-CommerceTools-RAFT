import { PaymentExtensionResponse } from '../types'
import { Processor } from './processor'
import log from '@gradientedge/logger'
import { buildGeneralError } from '../commercetools'

async function handleNotImplementedYet(payload: unknown): Promise<PaymentExtensionResponse> {
  log.debug(payload)

  return buildGeneralError('Not implemented yet')
}

export const NotImplementedYetProcessor = (endpoint: string): Processor => {
  return {
    validate: (_message) => [],
    handleMessage: async (message: unknown) => handleNotImplementedYet(message),
    endpoint,
  }
}
