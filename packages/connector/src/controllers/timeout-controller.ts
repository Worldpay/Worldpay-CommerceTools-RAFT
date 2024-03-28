import { Payment } from '@commercetools/platform-sdk'
import log from '@gradientedge/logger'
import {
  buildEmptySuccessWithId,
  buildGeneralErrorWithId,
  buildSuccessWithId,
  createApiRoot,
  queryPayments,
} from '../commercetools'
import { CreditTimeoutHandler, TimedOutMessageHandler, GiftCardTimeoutHandler } from '../handlers'
import { PaymentResponseWithId } from '../types'

/**
 * The handlers that are supported by the connector, matching the Native RAFT APIs defined on
 * @see https://developerengine.fisglobal.com/apis/native-raft
 *
 * This controller will query commercetools for any pending transactions and will attempt to retransmit
 * them to RAFT using the exact same message. The response is stored. For successful messages this ends the
 * processing, but if the retry count is exceeded, a reversal message is sent (with timeout repeater as well),
 * until a (separately configarable) retry limit is encountered.
 */
const HANDLERS: Record<string, TimedOutMessageHandler> = {
  Credit: CreditTimeoutHandler,
  GiftCard: GiftCardTimeoutHandler,
}

/**
 * Handle a payment create or update event, responding with a 'FailedValidation' error or 'UpdateRequest' success
 * message.
 */
export async function handleRaftTimeouts(payload: any) {
  log.info('Received timeout handler trigger', payload)
  const apiRoot = createApiRoot()

  const paymentsWithPendingTransactions = await queryPayments(apiRoot)

  log.debug(`Found a total of [${paymentsWithPendingTransactions.body?.results?.length}] pending transactions`)
  const paymentsToUpdate: PaymentResponseWithId[] = paymentsWithPendingTransactions.body.results.map(
    (payment: Payment) => {
      const handlers: TimedOutMessageHandler[] = []
      const message = JSON.parse(payment.custom?.fields?.request ?? '{}')
      const requestTypes = Object.keys(message)
      if (requestTypes.length > 1) {
        return buildGeneralErrorWithId(
          `Too many request types found [${requestTypes.join()}]`,
          payment.id,
          payment.version,
        )
      }
      if (requestTypes.length === 0) {
        return buildEmptySuccessWithId(payment.id, payment.version)
      }
      const requestType = requestTypes[0]
      Object.keys(HANDLERS).forEach((key) => {
        if (requestType.startsWith(key.toLowerCase())) {
          handlers.push(HANDLERS[key])
        }
      })

      log.debug(`RAFT timeout handler found [${handlers.length}] handlers for payment [${payment.id}]`)
      const transactions = payment.transactions.filter((t) => t.state === 'Pending')
      if (transactions.length === 0 || transactions.length > 1) {
        log.warn(`Unexpected number of [${transactions.length}] pending transactions in payment [${payment.id}]`)
      }

      try {
        const result = handlers[0].handleTimedOutMessage(payment, transactions[0], message)
        return buildSuccessWithId(result, payment.id, payment.version)
      } catch (error) {
        buildGeneralErrorWithId(
          `Error converting message to actions for payment [${payment.id}]`,
          payment.id,
          payment.version,
        )
      }
    },
  )

  paymentsToUpdate.forEach(async (update) => {
    if (update.actions) {
      try {
        const paymentResponse = await apiRoot
          .payments()
          .withId({ ID: update.paymentId })
          .post({ body: { version: update.version, actions: update.actions } })
          .execute()
        log.debug(`Successful update of payment [${paymentResponse.body.id}]`)
      } catch (error) {
        log.error(`Failed to update payment [${update.paymentId}] version [${update.version}]`, { error })
      }
    }
  })
}
