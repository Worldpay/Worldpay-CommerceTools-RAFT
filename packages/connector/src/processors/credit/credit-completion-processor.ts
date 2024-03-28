import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import {
  CreditCompletion,
  CreditCompletionResponse,
  ReturnCode,
  validateCreditCompletion,
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
    validateCreditCompletion(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

const ENDPOINT = '/credit/completion'

export const CreditCompletionProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

async function handleMessage(transaction: Transaction, message: any): Promise<PaymentExtensionResponse> {
  log.debug('Handle message for creditcompletion', message)

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
  message: CreditCompletion,
  result: AxiosResponse,
): PaymentUpdateAction[] {
  log.debug(result)

  const apiTransactionId = message.creditcompletion.APITransactionID
  const actions: PaymentUpdateAction[] = []
  actions.push(buildClearRequestAction())
  if (result) {
    actions.push(buildInterfaceInteraction(message, result?.data, apiTransactionId))
  }

  const response: CreditCompletionResponse =
    result?.status === Status.Ok ? (result.data as CreditCompletionResponse) : undefined
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
      actions.push(
        buildAddTransaction(
          message.creditcompletion.MiscAmountsBalances.TransactionAmount,
          'Charge',
          success ? 'Success' : 'Failure',
          response.creditcompletionresponse?.STPData?.STPReferenceNUM,
        ),
      )
    }
    actions.push(buildUpdatePaymentStateAction(success ? 'payment-paid' : 'payment-failed'))
    actions.push(buildPaymentStatusInterfaceCodeAction(response.creditcompletionresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.creditcompletionresponse?.ReasonCode))
  }
  return actions
}

/**
 * The message to RAFT had a timeout, so update the payment with information that will be used for retries.
 * Most importantly: create a Pending transaction and don't erase the request
 */
function processTimeout(
  transaction: Transaction,
  message: CreditCompletion,
  error: AxiosError,
): Array<PaymentUpdateAction> {
  const actions: PaymentUpdateAction[] = []

  const apiTransactionId = message?.creditcompletion?.APITransactionID
  actions.push(buildInterfaceInteraction(message, axiosError(error), apiTransactionId))
  actions.push(buildPaymentInterfaceIdAction(message.creditcompletion.APITransactionID))

  if (!transaction) {
    actions.push(
      buildAddTransaction(
        message.creditcompletion.MiscAmountsBalances.TransactionAmount,
        'Charge',
        'Pending',
        undefined,
      ),
    )
  }
  return actions
}

function getTransactionState(result: AxiosResponse, response: CreditCompletionResponse): boolean {
  return result.status === Status.Ok && response?.creditcompletionresponse?.ReturnCode === ReturnCode.Successful
}
