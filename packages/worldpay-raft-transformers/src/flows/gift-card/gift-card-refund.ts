import {
  withAccountCodesAndData,
  withAPITransactionID,
  withGiftCardData,
  withLocalDateTime,
  withMiscAmountsBalances,
  withReferenceTraceNumbers,
  withSTPData,
  withTerminalData,
  withWorldpayMerchantID,
  withCardInfo,
  withAuthorizationType,
} from '../../model'
import { Payment, TypedMoney } from '@commercetools/platform-sdk'
import {
  AccountSelected,
  AuthorizationType,
  GiftCardRefund,
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
  WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD,
  WORLDPAY_RAFT_PAYMENT_INTERFACE,
} from '@gradientedge/worldpay-raft-messages'
import { RAFT_TEST_CARD_SECURITY_CODE, RAFT_TEST_GIFT_CARD, RAFT_TEST_GIFT_CARD_REFUND_AMOUNT } from './constants'

export interface GiftCardRefundParams {
  worldpayMerchantID: string
  apiTransactionID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
  transactionAmount?: TypedMoney
  authorizationType?: AuthorizationType
}

/**
 * Create a giftcardrefund message from the given input parameters
 * @param options - The entities required to build the message
 * @returns The giftcardrefund message
 */
export function giftCardRefund(options: GiftCardRefundParams): GiftCardRefund {
  if (
    options.payment.paymentMethodInfo.paymentInterface !== WORLDPAY_RAFT_PAYMENT_INTERFACE ||
    options.payment.paymentMethodInfo.method !== WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD
  ) {
    throw new Error(
      `Payment [${options.payment.id}] with interface [${options.payment.paymentMethodInfo.paymentInterface}], method [${options.payment.paymentMethodInfo.method}] is not a Worldpay RAFT gift card`,
    )
  }
  const transaction = options.payment?.transactions.find(
    (transaction) => transaction.type === 'Charge' && transaction.state === 'Success',
  )
  const transactionAmount =
    options.transactionAmount ??
    // Special case for test card
    (options.payment?.custom?.fields?.tokenizedPAN === RAFT_TEST_GIFT_CARD &&
    options.payment?.custom?.fields?.gcSecurityCode === RAFT_TEST_CARD_SECURITY_CODE
      ? RAFT_TEST_GIFT_CARD_REFUND_AMOUNT
      : (transaction?.amount ?? options.payment?.amountPlanned))
  return {
    giftcardrefund: {
      ...withMiscAmountsBalances({ transactionAmount }),
      ...withAccountCodesAndData({
        FromAccountSelected: AccountSelected.GiftCard,
        ToAccountSelected: AccountSelected.GiftCard,
      }),
      ...withCardInfo({
        PAN: options.payment.custom?.fields?.tokenizedPAN,
        ExpirationDate: options.payment.custom?.fields?.expirationDate,
      }),
      ...withGiftCardData(options.payment.custom?.fields?.gcSecurityCode),
      ...withSTPData(options.STPBankId, options.STPTerminalId, transaction?.interactionId),
      ...(transaction?.custom?.fields?.authorizationNumber &&
        withReferenceTraceNumbers({
          AuthorizationNumber: transaction?.custom?.fields?.authorizationNumber,
        })),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...(options.authorizationType && withAuthorizationType(options.authorizationType)),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withAPITransactionID(options.apiTransactionID),
      ...withLocalDateTime(),
    },
  }
}
