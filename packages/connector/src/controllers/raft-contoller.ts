import log from '@gradientedge/logger'

import { PaymentExtensionResponse } from '../types'
import { validate } from './validate'
import { Handler, CreditHandler, SystemHandler, NotImplementedYetHandler, GiftCardHandler } from '../handlers'
import { buildEmptySuccess, buildGeneralError } from '../commercetools'

/**
 * The handlers that are supported by the connector, matching the Native RAFT APIs defined on
 * @see https://developerengine.fisglobal.com/apis/native-raft
 *
 * The incoming event is passed to a handler for further processing.
 */
const HANDLERS: Record<string, Handler> = {
  Account: NotImplementedYetHandler,
  ACH: NotImplementedYetHandler,
  APM: NotImplementedYetHandler,
  BatchUpload: NotImplementedYetHandler,
  Check: NotImplementedYetHandler,
  Credit: CreditHandler,
  Debit: NotImplementedYetHandler,
  GiftCard: GiftCardHandler,
  KeyChange: NotImplementedYetHandler,
  Store: NotImplementedYetHandler,
  System: SystemHandler,
  Tokenization: NotImplementedYetHandler,
}

/**
 * Handle a payment create or update event, responding with a 'FailedValidation' error or 'UpdateRequest' success
 * message.
 */
export async function handleRaftRequest(payload: any): Promise<PaymentExtensionResponse> {
  log.info('Received request', payload)

  if (validate(payload)) {
    const message = JSON.parse(payload?.resource?.obj?.custom?.fields?.request || '{}')
    const requestTypes = Object.keys(message)
    const handlers = []
    if (requestTypes.length > 1) {
      return buildGeneralError(`Too many request type found [${requestTypes.join()}]`)
    }
    if (requestTypes.length === 0) {
      return buildEmptySuccess()
    }
    const requestType = requestTypes[0] // i.e. creditauth
    Object.keys(HANDLERS).forEach((key) => {
      if (requestType.startsWith(key.toLowerCase())) {
        handlers.push(HANDLERS[key])
      }
    })
    if (handlers.length !== 1) {
      return buildGeneralError(`No or too many handlers found for ${requestType}`)
    }

    const paymentObject = payload?.resource?.obj
    log.debug(`RAFT Controller found [${handlers.length}] handlers`)
    return await handlers[0].handle(paymentObject, message, requestType)
  } else {
    log.warn('Unsupported payload received, ignore message and let commercetools continue')
    return buildEmptySuccess()
  }
}
