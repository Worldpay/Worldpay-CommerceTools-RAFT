import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import log from '@gradientedge/logger'
import {
  AuthorizationType,
  BooleanString,
  CreditAuth,
  CreditAuthResponse,
  ReturnCode,
  validateCreditAuth,
} from '@gradientedge/worldpay-raft-messages'
import { Status } from '@reflet/http'
import { AxiosError, AxiosResponse } from 'axios'
import {
  StateKey,
  buildAddExpirationDateAction,
  buildAddPinlessConvertedAction,
  buildAddSTPReferenceNUMAction,
  buildAddTokenizedPANAction,
  buildAddTransaction,
  buildChangeTransactionActions,
  buildClearRequestAction,
  buildGeneralError,
  buildInterfaceInteraction,
  buildPaymentInterfaceIdAction,
  buildPaymentMethodAction,
  buildPaymentMethodNameAction,
  buildPaymentStatusInterfaceCodeAction,
  buildPaymentStatusInterfaceTextAction,
  buildSuccess,
  buildUpdatePaymentStateAction,
} from '../../commercetools'
import { axiosError } from '../../convert-errors'
import { sendRaftMessage } from '../../raft-connector'
import { PaymentExtensionResponse } from '../../types'
import { Processor } from '../processor'

const ENDPOINT = '/credit/authorization'
const PAYMENT_METHOD_NAME = 'Card'

// The extraction of information from the message should not assume the exact structure of the message
// is as expected because it is received from a service over the internet. We protect ourselves with ?. access
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export const CreditAuthProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: unknown): string[] {
  try {
    validateCreditAuth(message)
  } catch (error) {
    return error.inner.map((errors: { path: string; errors: string[] }) => `${errors.path}: ${errors.errors.join(',')}`)
  }
  return []
}

async function handleMessage(transaction: Transaction | undefined, message: any): Promise<PaymentExtensionResponse> {
  log.debug('Handle message for creditauth', message)

  try {
    const result = await sendRaftMessage(ENDPOINT, message)
    const actions = processRaftResponse(transaction, message, result)
    return buildSuccess(actions)
  } catch (error) {
    const axError = axiosError(error)
    log.error(`Failed request to ${ENDPOINT}`, axError)
    if (error?.code === 'ECONNABORTED') {
      const actions = processTimeout(transaction, message, error)
      return buildSuccess(actions)
    }
    return buildGeneralError(`Failed request to ${ENDPOINT}: ${JSON.stringify(axError)}`)
  }
}

function processRaftResponse(
  transaction: Transaction | undefined,
  message: CreditAuth,
  result: AxiosResponse,
): PaymentUpdateAction[] {
  log.debug(result)

  const actions: PaymentUpdateAction[] = []
  const response = result?.status === Status.Ok ? (result.data as CreditAuthResponse) : undefined
  const apiTransactionId = message?.creditauth?.APITransactionID

  actions.push(buildClearRequestAction())
  actions.push(buildInterfaceInteraction(message, result?.data, apiTransactionId))
  actions.push(buildPaymentMethodAction(getPaymentName(response)))
  actions.push(buildPaymentMethodNameAction(PAYMENT_METHOD_NAME))
  const reversal = message.creditauth?.AuthorizationType === AuthorizationType.Reversal
  if (!reversal && transaction === undefined) {
    actions.push(buildPaymentInterfaceIdAction(message.creditauth?.APITransactionID))
  }
  if (response) {
    const success = getTransactionSuccess(result, response)
    if (transaction) {
      // Update the existing transaction, marking it as failed if it was a reversal of a timed out transaction
      const retryCount = transaction.custom?.fields?.retryCount ?? 1
      actions.push(...buildChangeTransactionActions(transaction, success && retryCount >= 0))
    } else {
      // Create a new transaction

      actions.push(
        buildAddTransaction(
          message.creditauth.MiscAmountsBalances.TransactionAmount,
          reversal ? 'CancelAuthorization' : 'Authorization',
          success ? 'Success' : 'Failure',
          response?.creditauthresponse?.STPData?.STPReferenceNUM,
          response?.creditauthresponse?.ReferenceTraceNumbers?.AuthorizationNumber,
          response?.creditauthresponse?.ReferenceTraceNumbers?.RetrievalREFNumber,
        ),
      )
    }
    if (response?.creditauthresponse?.STPData?.STPReferenceNUM) {
      actions.push(buildAddSTPReferenceNUMAction(response?.creditauthresponse?.STPData.STPReferenceNUM))
    }
    actions.push(buildUpdatePaymentStateAction(getPaymentState(success, reversal, transaction)))
    actions.push(buildPaymentStatusInterfaceCodeAction(response.creditauthresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.creditauthresponse?.ReasonCode))
    if (response.creditauthresponse?.ProcFlagsIndicators?.PinlessConverted === BooleanString.YES) {
      actions.push(buildAddPinlessConvertedAction())
    }
    const tokenizedPAN = response?.creditauthresponse?.EncryptionTokenData?.TokenizedPAN
    if (success && !reversal && tokenizedPAN) {
      actions.push(buildAddTokenizedPANAction(tokenizedPAN))
    }
    const expiryDate = message.creditauth?.CardInfo?.ExpirationDate
    if (success && !reversal && expiryDate) {
      actions.push(buildAddExpirationDateAction(expiryDate))
    }
  }
  return actions
}

/**
 * The message to RAFT had a timeout, so update the payment with information that will be used for retries.
 * Most importantly: create a Pending transaction and don't erase the request
 */
function processTimeout(transaction: Transaction, message: any, error: AxiosError): Array<PaymentUpdateAction> {
  const actions: PaymentUpdateAction[] = []

  const apiTransactionId = message?.creditauth?.APITransactionID
  actions.push(buildInterfaceInteraction(message, axiosError(error), apiTransactionId))
  const reversal = message.creditauth?.AuthorizationType === AuthorizationType.Reversal

  actions.push(buildPaymentMethodNameAction(PAYMENT_METHOD_NAME))
  if (!reversal) {
    actions.push(buildPaymentInterfaceIdAction(message.creditauth.APITransactionID))
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!transaction) {
    // Create a new transaction, the existing one will have status Pending, so no need to update that
    actions.push(
      buildAddTransaction(
        message.creditauth.MiscAmountsBalances.TransactionAmount,
        reversal ? 'CancelAuthorization' : 'Authorization',
        'Pending',
        undefined,
      ),
    )
  }
  return actions
}

/**
 * Determine the state of the payment
 * @param success Was the message to RAFT successfully (returned 0000)?
 * @param reversal Was the message a cancellation (reversal)?
 * @param transaction Transaction that was retried. If a retry does not yield a success result in time, a reversal is started - signalled by a negative retryCount (custom field)
 * @returns The payment state key. Note that a successfully reversal of a transaction that failed will be marked as failed.
 */
function getPaymentState(success: boolean, reversal: boolean, transaction: Transaction | undefined): StateKey {
  if (!success || transaction?.custom?.fields?.retryCount < 0) {
    return 'payment-failed'
  }
  return reversal ? 'payment-cancelled' : 'payment-open'
}

function getTransactionSuccess(result: AxiosResponse, response: CreditAuthResponse): boolean {
  return result.status === Status.Ok && response?.creditauthresponse?.ReturnCode === ReturnCode.Successful
}

function getPaymentName(response: CreditAuthResponse): string {
  if (response?.creditauthresponse?.VisaSpecificData) {
    return 'Visa'
  }
  if (response?.creditauthresponse?.McrdSpecificData) {
    return 'Mastercard'
  }
  if (response?.creditauthresponse?.AmexSpecificData) {
    return 'American Express'
  }
  if (response?.creditauthresponse?.DiscSpecificData) {
    return 'Discover'
  }
  return 'Other'
}
