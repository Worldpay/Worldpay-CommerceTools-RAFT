import { Cart, Order, Payment, PaymentReference, TypedMoney } from '@commercetools/platform-sdk'
import {
  WORLDPAY_RAFT_PAYMENT_INTERFACE,
  WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD,
} from '@gradientedge/worldpay-raft-messages'

/**
 * Calculates the gift card amount based on the balance inquiry results.
 * That is one of two strategies to deal with multiple payments.
 * See gift-card-amount-pre-auth.ts for the other one.
 *
 * 1. Balance inquiry to obtain the amount left on the gift card. Assume all of it will be used to pay for this order
 * 2. Pay the remaining amount by credit card or other payment method.
 * 3. Place the order
 * 4. Pre-authorise all the gift cards
 *    a. In case a pre-auth fails, for example due to insufficient balance, cancel all other pre-auths and cancel the order
 * 5. On shipment of the order, complete the payment(s). Note that RAFT does not support partial completion on gift cards.
 */
export function calculateGiftCardTotal(cartOrOrder: Cart | Order): TypedMoney {
  const total: number =
    cartOrOrder.paymentInfo?.payments?.reduce((acc: number, paymentRef: PaymentReference) => {
      const payment: Payment = paymentRef.obj!
      if (isRaftGiftCard(payment)) {
        acc += payment.amountPlanned.centAmount
      }
      return acc
    }, 0) ?? 0

  return {
    ...cartOrOrder.totalPrice,
    centAmount: Math.min(total, cartOrOrder.totalPrice.centAmount),
  }
}

export function isRaftGiftCard(payment: Payment): boolean {
  return (
    payment &&
    payment.paymentMethodInfo?.paymentInterface === WORLDPAY_RAFT_PAYMENT_INTERFACE &&
    payment.paymentMethodInfo?.method === WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD &&
    payment.transactions.length === 0
  )
}
