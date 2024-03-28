import {
  AccountSelected,
  AuthorizationType,
  EntryMode,
  GiftCardPreAuth,
  POSConditionCode,
  TerminalEntryCap,
  WORLDPAY_RAFT_PAYMENT_INTERFACE,
  WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD,
} from '@gradientedge/worldpay-raft-messages'
import {
  withAccountCodesAndData,
  withAuthorizationType,
  withAPITransactionID,
  withCardInfo,
  withGiftCardData,
  withLocalDateTime,
  withMiscAmountsBalances,
  withReferenceTraceNumbers,
  withSTPData,
  withTerminalData,
  withWorldpayMerchantID,
} from '../../model'
import { Payment } from '@commercetools/platform-sdk'

/**
 * The GiftCardPreAuth parameters.
 */
export interface GiftCardCancelPreAuthParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
}

/**
 * Create a giftcardpreauth message to cancel a gift card pre-auth from the given input parameters
 * @param options - The options for the Worldpay RAFT giftcardpreauth message
 * @returns The giftcardpreauth message for cancelling the pre-auth
 */
export function giftCardCancelPreAuth(options: GiftCardCancelPreAuthParams): GiftCardPreAuth {
  if (
    options.payment.paymentMethodInfo.paymentInterface !== WORLDPAY_RAFT_PAYMENT_INTERFACE ||
    options.payment.paymentMethodInfo.method !== WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD
  ) {
    throw new Error(
      `Payment [${options.payment.id}] with interface [${options.payment.paymentMethodInfo.paymentInterface}], method [${options.payment.paymentMethodInfo.method}] is not a Worldpay RAFT gift card`,
    )
  }
  const transaction = options.payment.transactions.find((t) => t.type === 'Authorization' && t.state === 'Success')
  if (transaction === undefined) {
    throw new Error(`No authorized transaction to reverse found in payment [${options.payment.id}]`)
  }
  return {
    giftcardpreauth: {
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withSTPData(options.STPBankId, options.STPTerminalId),
      ...withAPITransactionID(options.payment?.interfaceId ?? 'UNKNOWN'),
      ...(transaction?.custom?.fields?.authorizationNumber &&
        withReferenceTraceNumbers({
          AuthorizationNumber: transaction?.custom?.fields?.authorizationNumber,
        })),
      ...withAccountCodesAndData({
        FromAccountSelected: AccountSelected.GiftCard,
        ToAccountSelected: AccountSelected.GiftCard,
      }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...withMiscAmountsBalances({ transactionAmount: transaction.amount }),
      ...withCardInfo({
        PAN: options.payment.custom?.fields?.tokenizedPAN,
        ExpirationDate: options.payment.custom?.fields?.expirationDate,
      }),
      ...withAuthorizationType(AuthorizationType.Reversal),
      ...withGiftCardData(options.payment.custom?.fields?.gcSecurityCode),
      ...withLocalDateTime(),
    },
  }
}
