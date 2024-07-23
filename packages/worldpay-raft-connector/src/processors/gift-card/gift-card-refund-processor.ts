import {
  AuthorizationType,
  GiftCardRefund,
  GiftCardRefundResponse,
  ReturnCode,
  validateGiftCardRefund,
} from '@gradientedge/worldpay-raft-messages'
import { Processor } from '../processor'
import { PaymentExtensionResponse } from '../../types'
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
import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import { Status } from '@reflet/http'
import { AxiosError, AxiosResponse } from 'axios'
import { axiosError } from '../../convert-errors'

const ENDPOINT = '/giftcard/refund'

export const GiftCardRefundProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: any): string[] {
  try {
    validateGiftCardRefund(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

async function handleMessage(
  transaction: Transaction | undefined,
  message: GiftCardRefund,
): Promise<PaymentExtensionResponse> {
  log.debug(`Handle message for giftcardrefund with APITransactionID=${message?.giftcardrefund?.APITransactionID}`)
  try {
    const result = await sendRaftMessage(ENDPOINT, message)
    const actions = processRaftResponse(transaction, message, result)
    return buildSuccess(actions)
  } catch (error) {
    if (error?.code === 'ECONNABORTED') {
      const actions = processTimeout(transaction, message, error)
      return buildSuccess(actions)
    }
    log.error(`Failed request to ${ENDPOINT}`, error)
    return buildGeneralError(`Failed request to ${ENDPOINT}: ${JSON.stringify(error)}`)
  }
}

function processRaftResponse(transaction: Transaction, message: any, result: any) {
  const apiTransactionId = message?.giftcardrefund?.APITransactionID
  const actions: PaymentUpdateAction[] = []
  actions.push(buildClearRequestAction())
  actions.push(buildInterfaceInteraction(message, result?.data, apiTransactionId))

  const response: GiftCardRefundResponse =
    result?.status === Status.Ok ? (result.data as GiftCardRefundResponse) : undefined
  if (response) {
    const success = getTransactionState(result, response)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (transaction) {
      // Update the existing transaction, marking it as failed if it was a reversal of a timed out transaction
      const retryCount = transaction.custom?.fields?.retryCount ?? 1
      actions.push(...buildChangeTransactionActions(transaction, success && retryCount >= 0))
    } else {
      // Create a new transaction
      const transactionAmount = getTransactionAmount(message)
      actions.push(
        buildAddTransaction(
          transactionAmount,
          'Refund',
          success ? 'Success' : 'Failure',
          response.giftcardrefundresponse?.STPData?.STPReferenceNUM,
        ),
      )
    }
    if (success) {
      actions.push(buildUpdatePaymentStateAction('payment-refunded'))
    }
    actions.push(buildPaymentStatusInterfaceCodeAction(response.giftcardrefundresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.giftcardrefundresponse?.ReasonCode))
  }
  return actions
}

/**
 * The message to RAFT had a timeout, so update the payment with information that will be used for retries.
 * Most importantly: create a Pending transaction and don't erase the request
 */
function processTimeout(
  transaction: Transaction,
  message: GiftCardRefund,
  error: AxiosError,
): Array<PaymentUpdateAction> {
  const actions: PaymentUpdateAction[] = []

  const apiTransactionId = message?.giftcardrefund?.APITransactionID
  actions.push(buildInterfaceInteraction(message, axiosError(error), apiTransactionId))
  actions.push(buildPaymentInterfaceIdAction(message.giftcardrefund.APITransactionID))

  if (!transaction) {
    actions.push(
      buildAddTransaction(message.giftcardrefund.MiscAmountsBalances.TransactionAmount, 'Refund', 'Pending', undefined),
    )
  }
  return actions
}

/**
 * The gift card transaction amount, negative in case of a reversal
 */
function getTransactionAmount(message: GiftCardRefund) {
  return message.giftcardrefund?.AuthorizationType === AuthorizationType.Reversal
    ? '-' + message.giftcardrefund.MiscAmountsBalances.TransactionAmount
    : message.giftcardrefund.MiscAmountsBalances.TransactionAmount
}

function getTransactionState(result: AxiosResponse, response: GiftCardRefundResponse): boolean {
  return result.status === Status.Ok && response?.giftcardrefundresponse?.ReturnCode === ReturnCode.Successful
}
