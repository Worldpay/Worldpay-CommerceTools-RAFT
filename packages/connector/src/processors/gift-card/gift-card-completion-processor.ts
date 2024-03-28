import {
  AuthorizationType,
  GiftCardCompletion,
  GiftCardCompletionResponse,
  ReturnCode,
  validateGiftCardCompletion,
} from '@gradientedge/worldpay-raft-messages'
import log from '@gradientedge/logger'
import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import { AxiosError, AxiosResponse } from 'axios'
import { Status } from '@reflet/http'
import { Processor } from '../processor'
import { PaymentExtensionResponse } from '../../types'
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
import { axiosError } from '../../convert-errors'

const ENDPOINT = '/giftcard/completion'

export const GiftCardCompletionProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: any): string[] {
  try {
    validateGiftCardCompletion(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

async function handleMessage(transaction: Transaction | undefined, message: any): Promise<PaymentExtensionResponse> {
  log.debug('Handle message for giftcardcompletion', message)
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
  message: GiftCardCompletion,
  result: AxiosResponse,
): PaymentUpdateAction[] {
  log.debug(result)

  const apiTransactionId = message.giftcardcompletion.APITransactionID
  const actions: PaymentUpdateAction[] = []
  actions.push(buildClearRequestAction())
  actions.push(buildInterfaceInteraction(message, result?.data, apiTransactionId))

  const response: GiftCardCompletionResponse =
    result?.status === Status.Ok ? (result.data as GiftCardCompletionResponse) : undefined
  log.debug(response)
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
          'Charge',
          success ? 'Success' : 'Failure',
          response.giftcardcompletionresponse?.STPData?.STPReferenceNUM,
        ),
      )
    }
    actions.push(buildUpdatePaymentStateAction(success ? 'payment-paid' : 'payment-failed'))
    actions.push(buildPaymentStatusInterfaceCodeAction(response.giftcardcompletionresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.giftcardcompletionresponse?.ReasonCode))
  }
  return actions
}

/**
 * The message to RAFT had a timeout, so update the payment with information that will be used for retries.
 * Most importantly: create a Pending transaction and don't erase the request
 */
function processTimeout(
  transaction: Transaction,
  message: GiftCardCompletion,
  error: AxiosError,
): Array<PaymentUpdateAction> {
  const actions: PaymentUpdateAction[] = []

  const apiTransactionId = message?.giftcardcompletion?.APITransactionID
  actions.push(buildInterfaceInteraction(message, axiosError(error), apiTransactionId))
  actions.push(buildPaymentInterfaceIdAction(message.giftcardcompletion.APITransactionID))

  if (!transaction) {
    actions.push(
      buildAddTransaction(
        message.giftcardcompletion.MiscAmountsBalances.TransactionAmount,
        'Charge',
        'Pending',
        undefined,
      ),
    )
  }
  return actions
}

/**
 * The gift card transaction amount, negative in case of a reversal
 */
function getTransactionAmount(message: GiftCardCompletion) {
  const reversal = message.giftcardcompletion.AuthorizationType === AuthorizationType.Reversal
  const amount = message.giftcardcompletion.MiscAmountsBalances.TransactionAmount
  return reversal ? '-' + amount : amount
}

function getTransactionState(result: AxiosResponse, response: GiftCardCompletionResponse): boolean {
  return result.status === Status.Ok && response?.giftcardcompletionresponse?.ReturnCode === ReturnCode.Successful
}
