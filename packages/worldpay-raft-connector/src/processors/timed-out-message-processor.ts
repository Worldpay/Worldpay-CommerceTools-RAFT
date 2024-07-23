import log from '@gradientedge/logger'
import { PaymentUpdateAction, Payment, Transaction } from '@commercetools/platform-sdk'
import { buildSetRequestAction, buildSetRetryCountAction } from '../commercetools'
import { getConfig } from '../config'

export type TimedOutMessageProcessor<T> = (
  payment: Payment,
  transaction: Transaction,
  message: T,
) => PaymentUpdateAction[]

/**
 * transforms a message of type T to its reversal by changing the AuthorizationType to RV
 */
export type RevertFunction<T> = (t: T) => T

/**
 * Type of a function that validates a message of type T. Should throw an exception if the message is invalid.
 */
export type ValidateFunction<T> = (t: T) => void

/**
 * Generate a function that processes a timed out message of type T
 *
 * The processing consists of:
 *
 * - Increment the transaction retryCount (of set it to 1 if not yet available). The payment holding the transaction will be saved, triggering a message to the connector that causes the message to RAFT to be re-sent
 * -  If the retryCount passes a threshold, the function to revert the message with RAFT is stored in the payment, and the retryCount is set to a negative number, signaling a revert was started. That revert is retried as well.
 *
 * @param {RevertFunction<T>} transformRequestToReversal Function to transform a message of type T to its reversal
 * @param {ValidateFunction<T>} validateFunction Function to validate a RAFT message of type T
 *
 * @returns A function that takes a payment, transaction and a message of type T and produces a list of commercetools payment update actions to retry or revert that message
 */
export function generateTimedOutMessageProcessor<T>(
  transformRequestToReversal: RevertFunction<T>,
  validateFunction: ValidateFunction<T>,
): TimedOutMessageProcessor<T> {
  return (payment: Payment, transaction: Transaction, message: T): PaymentUpdateAction[] => {
    log.debug(`Handle retry for transaction [${transaction.id}]`)
    const actions: PaymentUpdateAction[] = []
    let retryCount = transaction.custom?.fields?.retryCount ?? 0

    // Update the retryCount, if negative the transaction is in reversal and we'll keep on decreasing the
    // value until the reversal succeeds. Then we use the negative value to change the state to Failure instead
    // of success
    retryCount = retryCount < 0 ? retryCount - 1 : retryCount + 1

    if (retryCount > getConfig().worldpayRaft.maxRetries) {
      // We exceeded the retry count, so we will now start sending reversal messages
      log.info(
        `Retry limit [${retryCount}] reached for RAFT transaction [${transaction.id}] of payment [${payment.id}], reverting the creditAuth`,
      )
      const reversal = transformRequestToReversal(message)
      validateFunction(reversal)
      return [buildSetRequestAction(JSON.stringify(reversal)), buildSetRetryCountAction(transaction, -1)]
    }

    // Try sending the message again, we update the retryCount, which will trigger an event on the payment
    // connector and because the timedout request property is still on the payment, the connector will find
    // it and send it to RAFT
    log.info(`Retrying RAFT transaction [${transaction.id}] of payment [${payment.id}] attempt [${retryCount}]`)
    actions.push(buildSetRetryCountAction(transaction, retryCount))
    return actions
  }
}
