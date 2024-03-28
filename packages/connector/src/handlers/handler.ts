import { Payment } from '@commercetools/platform-sdk'
import { PaymentExtensionResponse } from '../types'

/**
 * A handler handles all messages of a single RAFT API (i.e. CreditAPI, APM API, Tokenization API, ...)
 */
export interface Handler {
  handle(payment: Payment, message: unknown, requestType: string): Promise<PaymentExtensionResponse>
}
