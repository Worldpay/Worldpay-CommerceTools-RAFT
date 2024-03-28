import { Payment, TypedMoney } from '@commercetools/platform-sdk'
import {
  AuthorizationType,
  BooleanString,
  CreditCompletion,
  ECommerceIndicator,
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
} from '@gradientedge/worldpay-raft-messages'
import {
  withAPITransactionID,
  withAuthorizationType,
  withCardInfo,
  withECommerceData,
  withEncryptionTokenData,
  withLocalDateTime,
  withMiscAmountsBalancesCompletion,
  withMultiClearingData,
  withProcFlagsIndicators,
  withReferenceTraceNumbers,
  withSTPData,
  withTerminalData,
  withWorldpayMerchantID,
} from '../../model'

type Money = TypedMoney

export interface CreditCompletionPartialParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  transactionAmount: Money
  paymentSequenceNumber: string
  paymentSequenceCount: string
  isFinalShipment: boolean
  payment: Payment
  authorizationType?: AuthorizationType
}

/**
 * Create a creditcompletion partial message from the given input parameters to allow multiple completion
 * @param options - The entities required to build the message
 * @returns The creditcompletion message
 */
export function creditCompletionPartial(options: CreditCompletionPartialParams): CreditCompletion {
  const transaction = options.payment?.transactions.find(
    (transaction) => transaction.type === 'Authorization' && transaction.state === 'Success',
  )
  if (!transaction === undefined) {
    throw new Error('No authorized transaction to complete found in payment')
  }

  const expirationDate = options.payment?.custom?.fields?.expirationDate
  return {
    creditcompletion: {
      ...withMiscAmountsBalancesCompletion(options.transactionAmount, transaction?.amount),
      ...(expirationDate && withCardInfo({ ExpirationDate: expirationDate })),
      ...withMultiClearingData(options.paymentSequenceNumber, options.paymentSequenceCount, options.isFinalShipment),
      ...withAPITransactionID(options.payment.interfaceId ?? 'UNKNOWN'),
      ...withEncryptionTokenData({ TokenizedPAN: options.payment.custom?.fields?.tokenizedPAN }),
      ...(transaction?.custom?.fields?.authorizationNumber &&
        withReferenceTraceNumbers({
          AuthorizationNumber: transaction?.custom?.fields?.authorizationNumber,
        })),
      ...withSTPData(options.STPBankId, options.STPTerminalId, transaction?.interactionId),
      ...withECommerceData({ 'E-commerceIndicator': ECommerceIndicator.ECommerceUnverified }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...withAuthorizationType(options.authorizationType ?? AuthorizationType.ForcePost),
      ...withProcFlagsIndicators({
        PriorAuth: BooleanString.YES,
        ...(options.payment?.custom?.fields?.PinlessConverted && { PinlessRequest: BooleanString.YES }),
      }),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withLocalDateTime(),
    },
  }
}
