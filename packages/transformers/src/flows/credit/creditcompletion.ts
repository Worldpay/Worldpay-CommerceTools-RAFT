import {
  withAccountCodesAndData,
  withAuthorizationType,
  withAPITransactionID,
  withECommerceData,
  withEncryptionTokenData,
  withLocalDateTime,
  withMiscAmountsBalancesCompletion,
  withProcFlagsIndicators,
  withReferenceTraceNumbers,
  withSTPData,
  withTerminalData,
  withWorldpayMerchantID,
  withCardInfo,
} from '../../model'
import { Payment } from '@commercetools/platform-sdk'
import {
  AccountSelected,
  AuthorizationType,
  BooleanString,
  CreditCompletion,
  ECommerceIndicator,
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
} from '@gradientedge/worldpay-raft-messages'

export interface CreditCompletionParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
  authorizationType?: AuthorizationType
}

/**
 * Create a creditcompletion message from the given input parameters
 * @param options - The entities required to build the message
 * @returns The creditcompletion message
 */
export function creditCompletion(options: CreditCompletionParams): CreditCompletion {
  const transaction = options.payment?.transactions.find(
    (transaction) => transaction.type === 'Authorization' && transaction.state === 'Success',
  )
  const expirationDate = options.payment?.custom?.fields?.expirationDate
  return {
    creditcompletion: {
      ...withMiscAmountsBalancesCompletion(
        transaction?.amount ?? options.payment?.amountPlanned,
        transaction?.amount ?? options.payment.amountPlanned,
      ),
      ...withAccountCodesAndData({ FromAccountSelected: AccountSelected.CreditCard }),
      ...withEncryptionTokenData({ TokenizedPAN: options.payment.custom?.fields?.tokenizedPAN }),
      ...withSTPData(options.STPBankId, options.STPTerminalId, transaction?.interactionId),
      ...(expirationDate && withCardInfo({ ExpirationDate: expirationDate })),
      ...(transaction?.custom?.fields?.authorizationNumber &&
        withReferenceTraceNumbers({
          AuthorizationNumber: transaction?.custom?.fields?.authorizationNumber,
        })),
      ...withECommerceData({ 'E-commerceIndicator': ECommerceIndicator.ECommerceUnverified }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...withProcFlagsIndicators({
        PriorAuth: BooleanString.YES,
        ...(options.payment?.custom?.fields?.PinlessConverted && { PinlessRequest: BooleanString.YES }),
      }),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withAuthorizationType(options.authorizationType ?? AuthorizationType.ForcePost),
      ...withAPITransactionID(options.payment.interfaceId ?? 'UNKNOWN'),
      ...withLocalDateTime(),
    },
  }
}
