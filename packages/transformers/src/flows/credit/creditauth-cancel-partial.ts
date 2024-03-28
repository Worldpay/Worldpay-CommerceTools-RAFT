import {
  withAuthorizationType,
  withMiscAmountsBalances,
  withWorldpayMerchantID,
  withAPITransactionID,
  withProcFlagsIndicators,
  withReversalAdviceReasonCd,
  withEncryptionTokenData,
  withSTPData,
  withLocalDateTime,
  withMultiClearingData,
  withTerminalData,
  withReferenceTraceNumbers,
  withECommerceData,
  withCardInfo,
} from '../../model'
import { Payment, TypedMoney } from '@commercetools/platform-sdk'
import {
  AuthorizationType,
  BooleanString,
  ECommerceIndicator,
  EntryMode,
  POSConditionCode,
  ReversalAdviceReasonCd,
  TerminalEntryCap,
} from '@gradientedge/worldpay-raft-messages'

export interface CreditAuthCancelPartialParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
  transactionAmount: TypedMoney
  dispensedAmount?: TypedMoney // Optional, if not found, the amount of the authorized transaction is used
  reversalAdviceReasonCd?: ReversalAdviceReasonCd // Optional, if omitted Normal reversal is assumed
  paymentSequenceNumber?: string
  paymentSequenceCount?: string
  isFinalShipment?: boolean
  dispensed?: boolean
}

/**
 * Create a creditauth message from the given input parameters, to partially cancel a previously authorized transaction
 * @param options - The entities required to build the message
 * @returns The creditauth message
 * @throws {Error} If no authorized transaction to reverse is found in the payment
 */
export function creditAuthCancelPartial(options: CreditAuthCancelPartialParams) {
  const transaction = options.payment.transactions.find((t) => t.type === 'Authorization' && t.state === 'Success')
  if (!transaction) {
    throw new Error('No authorized transaction to reverse found in payment')
  }

  const expirationDate = options.payment.custom?.fields?.expirationDate
  return {
    creditauth: {
      ...withMiscAmountsBalances({
        transactionAmount: options.transactionAmount,
        ...(options.dispensedAmount && { dispensedAmount: options.dispensedAmount }),
        ...(!options.dispensedAmount && options.dispensed === true && { dispensedAmount: options.transactionAmount }),
        ...(!options.dispensedAmount && !options.dispensed && { preAuthorizedAmount: transaction.amount }),
      }),
      ...withSTPData(options.STPBankId, options.STPTerminalId, transaction.interactionId),
      ...(transaction?.custom?.fields?.authorizationNumber &&
        withReferenceTraceNumbers({
          AuthorizationNumber: transaction?.custom?.fields?.authorizationNumber,
        })),
      ...(expirationDate && withCardInfo({ ExpirationDate: expirationDate })),
      ...withECommerceData({ 'E-commerceIndicator': ECommerceIndicator.ECommerceUnverified }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...(options.paymentSequenceNumber &&
        options.paymentSequenceCount &&
        options.isFinalShipment !== undefined &&
        withMultiClearingData(options.paymentSequenceNumber, options.paymentSequenceCount, options.isFinalShipment)),
      ...withReversalAdviceReasonCd(options.reversalAdviceReasonCd ?? ReversalAdviceReasonCd.NormalReversal),
      ...withEncryptionTokenData({ TokenizedPAN: options.payment.custom?.fields?.tokenizedPAN }),
      ...withProcFlagsIndicators({
        PriorAuth: BooleanString.YES,
        ...(options.payment?.custom?.fields?.PinlessConverted && { PinlessRequest: BooleanString.YES }),
      }),
      ...withAuthorizationType(AuthorizationType.Reversal),
      ...withAPITransactionID(options.payment?.interfaceId ?? 'UNKNOWN'),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withLocalDateTime(),
    },
  }
}
