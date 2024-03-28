import { PaymentUpdateAction, Transaction } from '@commercetools/platform-sdk'
import { Status } from '@reflet/http'
import {
  GiftCardInquiry,
  GiftCardInquiryResponse,
  ReturnCode,
  validateGiftCardInquiry,
  ZERO_DOLLARS,
} from '@gradientedge/worldpay-raft-messages'
import log from '@gradientedge/logger'
import { Processor } from '../processor'
import { PaymentExtensionResponse } from '../../types'
import { sendRaftMessage } from '../../raft-connector'
import {
  buildAddExpirationDateAction,
  buildAddSecurityCodeAction,
  buildAddTokenizedPANAction,
  buildAmountPlannedAction,
  buildClearRequestAction,
  buildGeneralError,
  buildInterfaceInteraction,
  buildPaymentMethodAction,
  buildPaymentMethodNameAction,
  buildPaymentStatusInterfaceCodeAction,
  buildPaymentStatusInterfaceTextAction,
  buildSuccess,
  buildUpdatePaymentStateAction,
} from '../../commercetools'
import { AxiosResponse } from 'axios'

const ENDPOINT = '/giftcard/inquiry'
const PAYMENT_METHOD_NAME = 'Gift Card'

export const GiftCardInquiryProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: any): string[] {
  try {
    validateGiftCardInquiry(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

async function handleMessage(
  _transaction: Transaction | undefined,
  message: GiftCardInquiry,
): Promise<PaymentExtensionResponse> {
  log.debug('Handle message for giftcardinquiry', message)
  try {
    const result = await sendRaftMessage(ENDPOINT, message)
    const actions = processRaftResponse(message, result)
    return buildSuccess(actions)
  } catch (err) {
    log.error(`Failed request to ${ENDPOINT}`, err)
    return buildGeneralError(`Failed request to ${ENDPOINT}: ${JSON.stringify(err)}`)
  }
}

function processRaftResponse(message: any, result: any) {
  const actions: PaymentUpdateAction[] = []

  const response = result?.status === Status.Ok ? (result.data as GiftCardInquiryResponse) : undefined
  log.debug('Response', response)

  actions.push(buildClearRequestAction())
  actions.push(buildInterfaceInteraction(message, result?.data))

  actions.push(buildPaymentMethodAction(PAYMENT_METHOD_NAME))
  actions.push(buildPaymentMethodNameAction(PAYMENT_METHOD_NAME))
  if (response) {
    actions.push(buildPaymentStatusInterfaceCodeAction(response.giftcardinquiryresponse?.ReturnCode))
    actions.push(buildPaymentStatusInterfaceTextAction(response.giftcardinquiryresponse?.ReasonCode))
  }
  const success = getTransactionSuccess(result, response)
  if (success) {
    actions.push(
      buildAmountPlannedAction(
        response?.giftcardinquiryresponse?.MiscAmountsBalances?.AvailableBALFromAcct ??
          ZERO_DOLLARS.centAmount.toString(),
      ),
    )
    actions.push(buildUpdatePaymentStateAction('payment-open'))
    actions.push(buildAddTokenizedPANAction(message.giftcardinquiry.CardInfo?.PAN))
    actions.push(buildAddExpirationDateAction(message.giftcardinquiry.CardInfo?.ExpirationDate))
    actions.push(buildAddSecurityCodeAction(message.giftcardinquiry.GiftCardData?.GcSecurityCode))
  } else {
    // Unsuccessful, so force a zero amount and mark as failed
    actions.push(buildAmountPlannedAction(ZERO_DOLLARS.centAmount.toString()))
    actions.push(buildUpdatePaymentStateAction('payment-failed'))
  }
  return actions
}

function getTransactionSuccess(result: AxiosResponse, response: GiftCardInquiryResponse): boolean {
  return result?.status === Status.Ok && response?.giftcardinquiryresponse?.ReturnCode === ReturnCode.Successful
}
