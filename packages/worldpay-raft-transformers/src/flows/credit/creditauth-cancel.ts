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
  withTerminalData,
  withReferenceTraceNumbers,
  withECommerceData,
  withCardInfo,
} from '../../model'
import { Payment } from '@commercetools/platform-sdk'
import {
  AuthorizationType,
  BooleanString,
  ECommerceIndicator,
  EntryMode,
  POSConditionCode,
  ReversalAdviceReasonCd,
  TerminalEntryCap,
} from '@gradientedge/worldpay-raft-messages'

export interface CreditAuthCancelParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
  reversalAdviceReasonCd?: ReversalAdviceReasonCd
}

/**
 * Create a creditauth message from the given input parameters, to (partially) cancel a previously authorized transaction
 * @param options - The entities required to build the message
 * @returns The creditauth message
 * @throws {Error} If no authorized transaction to reverse is found in the payment
 */
export function creditAuthCancel(options: CreditAuthCancelParams) {
  const transaction = options.payment.transactions.find((t) => t.type === 'Authorization' && t.state === 'Success')
  if (transaction === undefined) {
    throw new Error('No authorized transaction to reverse found in payment')
  }

  const expirationDate = options.payment.custom?.fields?.expirationDate
  return {
    creditauth: {
      ...withMiscAmountsBalances({ transactionAmount: transaction.amount }),
      ...withSTPData(options.STPBankId, options.STPTerminalId, transaction.interactionId),
      ...(transaction?.custom?.fields?.authorizationNumber &&
        withReferenceTraceNumbers({
          AuthorizationNumber: transaction?.custom?.fields?.authorizationNumber,
        })),
      ...(expirationDate && withCardInfo({ ExpirationDate: expirationDate })),
      ...withECommerceData({ 'E-commerceIndicator': ECommerceIndicator.ECommerceUnverified }),
      ...withAPITransactionID(options.payment?.interfaceId ?? 'UNKNOWN'),
      ...withReversalAdviceReasonCd(options.reversalAdviceReasonCd ?? ReversalAdviceReasonCd.NormalReversal),
      ...withEncryptionTokenData({ TokenizedPAN: options.payment.custom?.fields?.tokenizedPAN }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...withProcFlagsIndicators({
        PriorAuth: BooleanString.YES,
        ...(options.payment?.custom?.fields?.PinlessConverted && { PinlessRequest: BooleanString.YES }),
      }),
      ...withAuthorizationType(AuthorizationType.Reversal),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withLocalDateTime(),
    },
  }
}
