import {
  AccountSelected,
  EntryMode,
  GiftCardInquiry,
  POSConditionCode,
  TerminalEntryCap,
  ZERO_DOLLARS,
} from '@gradientedge/worldpay-raft-messages'
import {
  withAccountCodesAndData,
  withAPITransactionID,
  withCardInfo,
  withGiftCardData,
  withLocalDateTime,
  withMiscAmountsBalances,
  withSTPData,
  withTerminalData,
  withWorldpayMerchantID,
} from '../../model'
import { CentPrecisionMoney } from '@commercetools/platform-sdk'

/**
 * The GiftCardInquiry parameters.
 */
export interface GiftCardInquiryParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  apiTransactionID: string
  pan: string
  expirationDate: string
  gcSecurityCode: string
}

/**
 * Create a giftcardinquiry message from the given input parameters
 * @param options - The options for the Worldpay RAFT giftcardinquiry message
 * @returns The giftcardinquiry message
 */
export function giftCardInquiry(options: GiftCardInquiryParams): GiftCardInquiry {
  return {
    giftcardinquiry: {
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
      ...withMiscAmountsBalances({ transactionAmount: ZERO_DOLLARS as CentPrecisionMoney }),
      ...withCardInfo({ PAN: options.pan, ExpirationDate: options.expirationDate }),
      ...withGiftCardData(options.gcSecurityCode),
      ...withLocalDateTime(),
    },
  }
}
