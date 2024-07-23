import { PaymentExtensionResponse } from '../types'
import { Handler } from './handler'
import log from '@gradientedge/logger'
import { buildGeneralError } from '../commercetools'

async function handleNotImplementedYet(payload: any): Promise<PaymentExtensionResponse> {
  log.debug(`Received message with no Implemented handler=[${payload?.resource?.id}]`)

  return buildGeneralError('Not implemented yet')
}

export const NotImplementedYetHandler: Handler = {
  handle: (payload) => handleNotImplementedYet(payload),
}
