import {
  AccountSelected,
  BooleanString,
  EntryMode,
  GiftCardPreAuth,
  POSConditionCode,
  TerminalEntryCap,
  WORLDPAY_RAFT_PAYMENT_INTERFACE,
  WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD,
} from '@gradientedge/worldpay-raft-messages'
import {
  withAccountCodesAndData,
  withAPITransactionID,
  withCardInfo,
  withGiftCardData,
  withLocalDateTime,
  withMiscAmountsBalances,
  withProcFlagsIndicators,
  withSTPData,
  withTerminalData,
  withWorldpayMerchantID,
} from '../../model'
import { Cart, Order, Payment, PaymentReference, Transaction, TypedMoney } from '@commercetools/platform-sdk'
import { RAFT_TEST_CARD_SECURITY_CODE, RAFT_TEST_GIFT_CARD, RAFT_TEST_GIFT_CARD_PRE_AUTH_AMOUNT } from './constants'

/**
 * The GiftCardPreAuth parameters.
 */
export interface GiftCardPreAuthParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  apiTransactionID: string
  order: Order | Cart // Must contain expaneded paymentInfo.payments[*]
  payment: Payment
}

/**
 * Create a giftcardpreauth message from the given input parameters
 * @param options - The options for the Worldpay RAFT giftcardpreauth message
 * @returns The giftcardpreauth message
 */
export function giftCardPreAuth(options: GiftCardPreAuthParams): GiftCardPreAuth {
  /** The test card pre-auth only succeeds when the amount has a specific value,
   * which in not equal to the balance amount at the time this code is written.
   * We normally attempt to authorize the balance amount (or less if the order amount is lower),
   * but that doesn't work with the test card.
   */
  const amountDue = calculateAmountDue(options.order)
  const transactionAmount =
    // Special case for test card
    options.payment?.custom?.fields?.tokenizedPAN === RAFT_TEST_GIFT_CARD &&
    options.payment?.custom?.fields?.gcSecurityCode === RAFT_TEST_CARD_SECURITY_CODE
      ? RAFT_TEST_GIFT_CARD_PRE_AUTH_AMOUNT
      : // Don't exceed the cart price when charging a gift card
        minimum(amountDue, options.payment.amountPlanned)
  return {
    giftcardpreauth: {
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withSTPData(options.STPBankId, options.STPTerminalId),
      ...withAPITransactionID(options.apiTransactionID),
      ...withAccountCodesAndData({
        FromAccountSelected: AccountSelected.GiftCard,
        ToAccountSelected: AccountSelected.GiftCard,
      }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...withProcFlagsIndicators({
        PartialAllowed: BooleanString.YES,
      }),
      ...withMiscAmountsBalances({ transactionAmount }),
      ...withCardInfo({
        PAN: options.payment.custom?.fields?.tokenizedPAN,
        ExpirationDate: options.payment.custom?.fields?.expirationDate,
      }),
      ...withGiftCardData(options.payment.custom?.fields?.gcSecurityCode),
      ...withLocalDateTime(),
    },
  }
}

function calculateAmountDue(order: Order | Cart): TypedMoney {
  const cartPrice = order.taxedPrice?.totalGross || order.totalPrice
  const amountDue = (order.paymentInfo?.payments ?? []).reduce(
    (amountDue: TypedMoney, paymentRef: PaymentReference) => {
      if (!paymentRef.obj) {
        throw new Error(
          'Please expand the payments in the Cart or Order, see https://docs.commercetools.com/api/general-concepts#reference-expansion',
        )
      }
      const payment = paymentRef.obj
      if (
        payment.paymentMethodInfo?.paymentInterface === WORLDPAY_RAFT_PAYMENT_INTERFACE &&
        payment.paymentMethodInfo?.method === WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD
      ) {
        const transaction: Transaction | undefined = payment.transactions.find(
          (transaction) =>
            transaction.type === 'Authorization' &&
            (transaction.state === 'Success' || transaction.state === 'Pending'),
        )
        if (transaction) {
          return { ...amountDue, centAmount: amountDue.centAmount - transaction.amount.centAmount }
        }
      }
      return amountDue
    },
    cartPrice,
  )
  return amountDue
}

function minimum(amount1: TypedMoney, amount2: TypedMoney): TypedMoney {
  return amount1.centAmount < amount2.centAmount ? amount1 : amount2
}
