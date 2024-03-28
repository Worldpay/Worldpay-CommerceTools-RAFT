import { PaymentExtensionResponse } from '../types'
import { Handler } from './handler'
import log from '@gradientedge/logger'
import { buildGeneralError } from '../commercetools'

async function handleNotImplementedYet(payload: unknown): Promise<PaymentExtensionResponse> {
  log.debug(payload)

  return buildGeneralError('Not implemented yet')
}

export const NotImplementedYetHandler: Handler = {
  handle: (payload) => handleNotImplementedYet(payload),
}
