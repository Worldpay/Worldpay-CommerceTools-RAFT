import { PaymentExtensionResponse } from '../types'
import { Handler } from './handler'
import { Processor } from '../processors'
import { CreditAuthProcessor, CreditCompletionProcessor, CreditRefundProcessor } from '../processors'
import { buildGeneralError, buildErrors } from '../commercetools'
import log from '@gradientedge/logger'
import { Payment } from '@commercetools/platform-sdk'

/**
 * The processors that are supported by this handler.
 * They are API endpoints of the RAFT Credit API, but not all endpoints are supported.
 */
const PROCESSORS: Record<string, Processor> = {
  creditauth: CreditAuthProcessor,
  creditcompletion: CreditCompletionProcessor,
  creditrefund: CreditRefundProcessor,
}

/**
 * The CreditHandler definitions, which handles all credit* endpoints
 */
export const CreditHandler: Handler = {
  handle: (paymentObject: any, message: any, requestType: string) => handleCredit(paymentObject, message, requestType),
}

/** Handle a credit request message, by passing it on to the appropriate processor
 * @param payment The payment object from commercetools
 * @param message The message to RAFT as parsed from the payment object's custom property
 * @param requestType The request type, i.e. creditauth
 * @returns A commercetools response with updates to the payment object (or error)
 */
async function handleCredit(payment: Payment, message: any, requestType: string): Promise<PaymentExtensionResponse> {
  const processor = PROCESSORS[requestType]
  if (processor === undefined || processor === null) {
    return buildGeneralError(
      processor === null
        ? `Not implemented yet processor ${requestType}`
        : `No Credit request processor for ${requestType}`,
    )
  }

  // Validate the RAFT message before sending it to RAFT
  const validationErrors = processor.validate(message)
  if (validationErrors.length > 0) {
    log.error('Failed validation of RAFT request message', { validationErrors })
    return buildErrors(
      validationErrors.map((message) => ({
        code: 'InvalidInput',
        message,
      })),
    )
  }

  // Send the message to RAFT, process the response. Return the generated update actions or error.
  const transaction = payment?.transactions?.find((t) => t.state === 'Pending')
  return await processor.handleMessage(transaction, message)
}
