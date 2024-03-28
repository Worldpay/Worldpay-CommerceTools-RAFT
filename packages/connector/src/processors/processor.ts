import { Transaction } from '@commercetools/platform-sdk'
import { PaymentExtensionResponse } from '../types'

/**
 * A processor handles a specific type of RAFT message, and:
 *
 * <ol>
 * <li>validates the message</li>
 * <li>sends the message to RAFT, using the endpoint for this particular message</li>
 * <li>processes the response from RAFT</li>
 * <li>generates commercetools actions based on the response</li>
 * </ol>
 */
export interface Processor {
  validate: (message: unknown) => string[]
  /**
   * Handle a message
   * @param transaction An optional transaction - undefined for new, populated for retries
   * @param message The RAFT message to send
   */
  handleMessage: (transaction: Transaction | undefined, message: unknown) => Promise<PaymentExtensionResponse>
  endpoint: string
}
