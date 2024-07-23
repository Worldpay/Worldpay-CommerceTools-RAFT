import { Payment, PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import log from '@gradientedge/logger'
import {
  GiftCardPreAuthTimedOutProcessor,
  GiftCardCompletionTimedOutProcessor,
  TimedOutMessageProcessor,
} from '../processors'
import { TimedOutMessageHandler } from './timed-out-message-handler'

/**
 * The processors that are supported by this handler.
 * They are API endpoints of the RAFT Gift Card API, but not all endpoints are supported.
 */
const PROCESSORS: Record<string, TimedOutMessageProcessor<any>> = {
  giftcardpreauth: GiftCardPreAuthTimedOutProcessor,
  giftcardcompletion: GiftCardCompletionTimedOutProcessor,
}

export const GiftCardTimeoutHandler: TimedOutMessageHandler = {
  handleTimedOutMessage: (payment: Payment, transaction: Transaction, message: any): PaymentUpdateAction[] => {
    log.debug(`Handling timeout for gift card payment [${payment.id}], transaction [${transaction.id}]`)
    const requestType = Object.keys(message)?.[0]

    if (requestType === undefined) {
      throw new Error(`No processor found for [${requestType}] in [${message}]`)
    }

    const processor = PROCESSORS[requestType]
    if (processor === undefined || processor === null) {
      return []
    }

    // Re-send the message to RAFT, process the response - or start the reversal if the number of attempts is exceeded.
    return processor(payment, transaction, message)
  },
}
