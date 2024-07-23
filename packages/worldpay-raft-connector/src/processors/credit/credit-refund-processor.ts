import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import {
  CreditRefund,
  CreditRefundResponse,
  ReturnCode,
  validateCreditRefund,
} from '@gradientedge/worldpay-raft-messages'
import { PaymentExtensionResponse } from '../../types'
import { Processor } from '../processor'
import log from '@gradientedge/logger'
import { sendRaftMessage } from '../../raft-connector'
import {
  buildAddTransaction,
  buildChangeTransactionActions,
  buildClearRequestAction,
  buildGeneralError,
  buildInterfaceInteraction,
  buildPaymentInterfaceIdAction,
  buildPaymentStatusInterfaceCodeAction,
  buildPaymentStatusInterfaceTextAction,
  buildSuccess,
  buildUpdatePaymentStateAction,
} from '../../commercetools'
import { AxiosError, AxiosResponse } from 'axios'
import { Status } from '@reflet/http'
import { axiosError } from '../../convert-errors'

function validate(message: unknown): string[] {
  try {
    validateCreditRefund(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

const ENDPOINT = '/credit/refund'

export const CreditRefundProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

async function handleMessage(
  transaction: Transaction | undefined,
  message: CreditRefund,
): Promise<PaymentExtensionResponse> {
  log.debug(`Handle message for creditrefund with APITransactionID=${message?.creditrefund?.APITransactionID}`)

  try {
    const result = await sendRaftMessage(ENDPOINT, message)
    const actions = processRaftResponse(transaction, message, result)
    return buildSuccess(actions)
  } catch (error) {
    log.error(`Failed request to ${ENDPOINT}`, error)
    if (error?.code === 'ECONNABORTED') {
      const actions = processTimeout(transaction, message, error)
      return buildSuccess(actions)
    }
    return buildGeneralError(`Failed request to ${ENDPOINT}: ${JSON.stringify(error)}`)
  }
}

function processRaftResponse(
  transaction: Transaction,
  message: CreditRefund,
  result: AxiosResponse,
): PaymentUpdateAction[] {
  const apiTransactionId = message?.creditrefund?.APITransactionID
  const actions: PaymentUpdateAction[] = []
  actions.push(buildClearRequestAction())
  if (result) {
    actions.push(buildInterfaceInteraction(message, result?.data, apiTransactionId))
  }

  const response: CreditRefundResponse =
    result?.status === Status.Ok ? (result.data as CreditRefundResponse) : undefined

  if (response) {
    const success = getTransactionState(result, response)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (transaction) {
      // Update the existing transaction, marking it as failed if it was a reversal of a timed out transaction
      const retryCount = transaction.custom?.fields?.retryCount ?? 1
      actions.push(...buildChangeTransactionActions(transaction, success && retryCount >= 0))
    } else {
      // Create a new transaction

      actions.push(
        buildAddTransaction(
          message.creditrefund.MiscAmountsBalances.TransactionAmount,
          'Refund',
          success ? 'Success' : 'Failure',
          response.creditrefundresponse?.STPData?.STPReferenceNUM,
        ),
      )
    }
    if (success) {
      actions.push(buildUpdatePaymentStateAction('payment-refunded'))
    }
    actions.push(buildPaymentStatusInterfaceCodeAction(response.creditrefundresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.creditrefundresponse?.ReasonCode))
  }
  return actions
}

/**
 * The message to RAFT had a timeout, so update the payment with information that will be used for retries.
 * Most importantly: create a Pending transaction and don't erase the request
 */
function processTimeout(
  transaction: Transaction,
  message: CreditRefund,
  error: AxiosError,
): Array<PaymentUpdateAction> {
  const actions: PaymentUpdateAction[] = []

  const apiTransactionId = message?.creditrefund?.APITransactionID
  actions.push(buildInterfaceInteraction(message, axiosError(error), apiTransactionId))
  actions.push(buildPaymentInterfaceIdAction(message.creditrefund.APITransactionID))

  if (!transaction) {
    actions.push(
      buildAddTransaction(message.creditrefund.MiscAmountsBalances.TransactionAmount, 'Refund', 'Pending', undefined),
    )
  }
  return actions
}

function getTransactionState(result: AxiosResponse, response: CreditRefundResponse): boolean {
  return result.status === Status.Ok && response?.creditrefundresponse?.ReturnCode === ReturnCode.Successful
}
