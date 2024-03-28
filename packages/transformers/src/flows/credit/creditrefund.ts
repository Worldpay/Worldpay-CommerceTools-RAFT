import { BooleanString } from '@gradientedge/worldpay-raft-messages'
import {
  withAPITransactionID,
  withCardInfo,
  withEncryptionTokenData,
  withLocalDateTime,
  withMiscAmountsBalances,
  withProcFlagsIndicators,
  withSTPData,
  withWorldpayMerchantID,
} from '../../model'
import { Payment, Transaction, TypedMoney } from '@commercetools/platform-sdk'

export interface CreditRefundParams {
  worldpayMerchantID: string
  apiTransactionID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
  amount?: TypedMoney
  calculateRefundFunction?: (payment: Payment) => TypedMoney
}

/**
 * Create a creditrefund message from the given input parameters
 * @param options - The entities required to build the message
 * @returns The creditrefund message
 */
export function creditRefund(options: CreditRefundParams) {
  const transactions =
    options.payment?.transactions?.filter(
      (transaction) => transaction.type === 'Charge' && transaction.state === 'Success',
    ) ?? []
  if (transactions.length === 0) {
    throw new Error('No successful charge transaction found in payment, refund not valid')
  }

  const totalAmount = options.calculateRefundFunction
    ? options.calculateRefundFunction(options.payment)
    : calculateRefundAmountWithChargeTransactions(transactions)

  const interactionId = transactions[0].interactionId
  const expirationDate = options.payment?.custom?.fields?.expirationDate
  return {
    creditrefund: {
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withMiscAmountsBalances({
        dispensedAmount: totalAmount,
        transactionAmount: options.amount ?? totalAmount,
      }),
      ...withAPITransactionID(options.apiTransactionID),
      ...withEncryptionTokenData({ TokenizedPAN: options.payment.custom?.fields?.tokenizedPAN }),
      ...(expirationDate && withCardInfo({ ExpirationDate: expirationDate })),
      ...withProcFlagsIndicators({
        PriorAuth: BooleanString.YES,
        ...(options.payment?.custom?.fields?.PinlessConverted && { PinlessRequest: BooleanString.YES }),
      }),
      ...withSTPData(options.STPBankId, options.STPTerminalId, interactionId),
      ...withLocalDateTime(),
    },
  }

  function calculateRefundAmountWithChargeTransactions(transactions: Transaction[]) {
    const firstTransaction = transactions[0]
    return {
      ...firstTransaction.amount,
      centAmount: transactions.reduce((acc, transaction) => acc + transaction.amount.centAmount, 0),
    }
  }
}
