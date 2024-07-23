import { TypedMoney } from '@commercetools/platform-sdk'
import { toRaftPrice } from '../../utils'
import { BooleanString } from '@gradientedge/worldpay-raft-messages'

export function withMiscAmountsBalances(options: {
  transactionAmount: TypedMoney
  dispensedAmount?: TypedMoney
  preAuthorizedAmount?: TypedMoney
}) {
  return {
    MiscAmountsBalances: {
      TransactionAmount: toRaftPrice(options.transactionAmount),
      ...(options.dispensedAmount && { DispensedAmount: toRaftPrice(options.dispensedAmount) }),
      ...(options.preAuthorizedAmount && { DispensedAmount: toRaftPrice(options.preAuthorizedAmount) }),
    },
  }
}

export function withMiscAmountsBalancesCompletion(amount: TypedMoney, preAuthAmount?: TypedMoney) {
  return {
    MiscAmountsBalances: {
      TransactionAmount: toRaftPrice(amount),
      ...(preAuthAmount && { PreauthorizedAmount: toRaftPrice(preAuthAmount) }),
    },
  }
}

export function withMultiClearingData(sequenceNumber: string, sequenceCount: string, isFinalPayment: boolean) {
  return {
    'Multi-clearingData': {
      'SequenceNumber_00-99': sequenceNumber,
      'SequenceCount_01-99': sequenceCount,
      FinalShipment: isFinalPayment ? BooleanString.YES : BooleanString.NO,
    },
  }
}
