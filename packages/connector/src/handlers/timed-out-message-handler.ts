import { PaymentUpdateAction, Payment, Transaction } from '@commercetools/platform-sdk'

export interface TimedOutMessageHandler {
  handleTimedOutMessage(payment: Payment, transaction: Transaction, message: any): PaymentUpdateAction[]
}
