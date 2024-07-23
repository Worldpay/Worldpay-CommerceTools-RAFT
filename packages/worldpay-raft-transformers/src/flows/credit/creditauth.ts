import {
  AuthorizationType,
  BooleanString,
  CreditAuth,
  ECommerceIndicator,
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
} from '@gradientedge/worldpay-raft-messages'
import {
  UnitOfMeasureConversion,
  UserDefinedData,
  withAddressVerificationData,
  withAPITransactionID,
  withAuthorizationType,
  withCardInfo,
  withECommerceData,
  withLocalDateTime,
  withMerchantSpecificData,
  withMiscAmountsBalances,
  withMultiClearingData,
  withProcFlagsIndicators,
  withSTPData,
  withTerminalData,
  withUserDefinedData,
  withWorldpayMerchantID,
} from '../../model'
import { Cart } from '@commercetools/platform-sdk'
import { calculateGiftCardTotal } from '../gift-card'

/**
 * The CreditAuth parameters.
 * Note: the cart holds an optional billing and/or shipping address, which is used for address verification.
 * The billingAddress.streetName is expected to hold both the number and the name!
 */
export interface CreditAuthParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  apiTransactionID: string
  cart: Cart
  expirationYYMM?: string
  unitOfMeasureFunction?: UnitOfMeasureConversion
  userDefinedData?: UserDefinedData
  reversal?: boolean
  authorizationType?: AuthorizationType
  partialCompletionExpected: boolean
}

/**
 * Create a creditauth message from the given input parameters
 * @param options - The options for the Worldpay RAFT creditauth message
 * @returns The creditauth message
 */
export function creditAuth(options: CreditAuthParams): CreditAuth {
  const giftCardTotal = calculateGiftCardTotal(options.cart)
  const cartTotal = {
    ...options.cart.totalPrice,
    centAmount: options.cart.totalPrice.centAmount - giftCardTotal.centAmount,
  }
  return {
    creditauth: {
      ...withMiscAmountsBalances({ transactionAmount: cartTotal }),
      ...withAddressVerificationData(options.cart),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withAPITransactionID(options.apiTransactionID),
      ...withSTPData(options.STPBankId, options.STPTerminalId),
      ...(options.expirationYYMM && withCardInfo({ ExpirationDate: options.expirationYYMM })),
      ...withECommerceData({ 'E-commerceIndicator': ECommerceIndicator.ECommerceUnverified }),
      ...withMerchantSpecificData({
        AcquirerCurrencyCode: convertCartCurrencyToDeprecatedNumericalValue(options.cart),
      }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
      }),
      ...withProcFlagsIndicators({
        PinlessRequest: BooleanString.YES,
        ...(options.partialCompletionExpected && {
          PartialAllowed: BooleanString.YES,
        }),
      }),
      ...(options.authorizationType && withAuthorizationType(options.authorizationType)),
      ...(options.userDefinedData && withUserDefinedData(options?.userDefinedData)),
      ...(options.partialCompletionExpected && withMultiClearingData('00', '99', false)),
      // Not for now...
      // ...withLevel3Data(options.cart, options.unitOfMeasureFunction),
      ...withLocalDateTime(),
    },
  }
}

const CURRENCY_MAPPING: Record<string, string> = {
  USD: '998',
}
function convertCartCurrencyToDeprecatedNumericalValue(cart: Cart) {
  return CURRENCY_MAPPING[cart.totalPrice.currencyCode]
}
