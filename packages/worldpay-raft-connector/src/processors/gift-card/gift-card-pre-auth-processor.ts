import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import { Status } from '@reflet/http'
import { AxiosError, AxiosResponse } from 'axios'
import log from '@gradientedge/logger'
import {
  GiftCardPreAuthResponse,
  ReturnCode,
  AuthorizationType,
  validateGiftCardPreAuth,
  GiftCardPreAuth,
  WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD,
} from '@gradientedge/worldpay-raft-messages'
import { Processor } from '../processor'
import { PaymentExtensionResponse } from '../../types'
import { sendRaftMessage } from '../../raft-connector'
import {
  buildAddExpirationDateAction,
  buildAddSTPReferenceNUMAction,
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

const ENDPOINT = '/giftcard/preauth'

export const GiftCardPreAuthProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: any): string[] {
  try {
    validateGiftCardPreAuth(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

async function handleMessage(
  transaction: Transaction | undefined,
  message: GiftCardPreAuth,
): Promise<PaymentExtensionResponse> {
  log.debug(`Handle message for giftcardpreauth with APITransactionID=${message?.giftcardpreauth?.APITransactionID}`)
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

function processRaftResponse(transaction: Transaction, message: GiftCardPreAuth, result: any) {
  const actions: PaymentUpdateAction[] = []
  const response = result?.status === Status.Ok ? (result.data as GiftCardPreAuthResponse) : undefined
  const apiTransactionId = message?.giftcardpreauth?.APITransactionID

  actions.push(buildClearRequestAction())
  actions.push(buildInterfaceInteraction(message, result?.data, apiTransactionId))

  actions.push(buildPaymentMethodAction(WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD))
  actions.push(buildPaymentMethodNameAction(WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD))

  if (response) {
    const reversal = message.giftcardpreauth?.AuthorizationType === AuthorizationType.Reversal
    const success = getTransactionSuccess(result, response)
    if (transaction) {
      // Update the existing transaction, marking it as failed if it was a reversal of a timed out transaction
      const retryCount = transaction.custom?.fields?.retryCount ?? 1
      actions.push(...buildChangeTransactionActions(transaction, success && retryCount >= 0))
    } else {
      // Create a new transaction
      if (success && !reversal) {
        actions.push(buildPaymentInterfaceIdAction(message.giftcardpreauth.APITransactionID))
      }
      actions.push(
        buildAddTransaction(
          message.giftcardpreauth.MiscAmountsBalances.TransactionAmount,
          reversal ? 'CancelAuthorization' : 'Authorization',
          success ? 'Success' : 'Failure',
          response.giftcardpreauthresponse?.STPData?.STPReferenceNUM,
          response.giftcardpreauthresponse?.ReferenceTraceNumbers?.AuthorizationNumber,
          response.giftcardpreauthresponse?.ReferenceTraceNumbers?.RetrievalREFNumber,
        ),
      )
    }
    if (response.giftcardpreauthresponse?.STPData?.STPReferenceNUM) {
      actions.push(buildAddSTPReferenceNUMAction(response.giftcardpreauthresponse?.STPData?.STPReferenceNUM))
    }
    actions.push(
      buildUpdatePaymentStateAction(success ? (reversal ? 'payment-cancelled' : 'payment-open') : 'payment-failed'),
    )
    actions.push(buildPaymentStatusInterfaceCodeAction(response.giftcardpreauthresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.giftcardpreauthresponse?.ReasonCode))
    const expiryDate = message.giftcardpreauth?.CardInfo?.ExpirationDate
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
function processTimeout(
  transaction: Transaction,
  message: GiftCardPreAuth,
  error: AxiosError,
): Array<PaymentUpdateAction> {
  const actions: PaymentUpdateAction[] = []

  const apiTransactionId = message?.giftcardpreauth?.APITransactionID
  actions.push(buildInterfaceInteraction(message, axiosError(error), apiTransactionId))
  actions.push(buildPaymentInterfaceIdAction(message.giftcardpreauth.APITransactionID))

  if (!transaction) {
    actions.push(
      buildAddTransaction(
        message.giftcardpreauth.MiscAmountsBalances.TransactionAmount,
        'Authorization',
        'Pending',
        undefined,
      ),
    )
  }
  return actions
}

function getTransactionSuccess(result: AxiosResponse, response: GiftCardPreAuthResponse): boolean {
  return result.status === Status.Ok && response?.giftcardpreauthresponse?.ReturnCode === ReturnCode.Successful
}
