/**
 * Value of the `paymentInfo.paymentInterface` property on the payment object:
 * https://docs.commercetools.com/api/projects/payments#paymentmethodinfo
 */
export const WORLDPAY_RAFT_PAYMENT_INTERFACE = 'worldpay-raft'

/**
 * Zero dollar typed money
 */
export const ZERO_DOLLARS = { centAmount: 0, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' }

/**
 * Value of the `paymentInfo.method` property on the payment object for gift cards:
 * https://docs.commercetools.com/api/projects/payments#paymentmethodinfo
 */
export const WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD = 'Gift Card'
