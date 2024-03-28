import { getMockCommercetoolsCart, getMockGiftCardPayment } from '../../mocks'
import { creditAuth } from '../../../flows'
import { AuthorizationType, validateCreditAuth } from '@gradientedge/worldpay-raft-messages'
import { UnitOfMeasure } from '../../../model'

describe('creditauth', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditauth message from cart and customer', () => {
    const cart = getMockCommercetoolsCart()
    const model = creditAuth({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      cart,
      STPBankId: '1340',
      STPTerminalId: '001',
      userDefinedData: {
        UserData1: '123',
        UserData2: '456',
        UserData3: '789',
      },
      partialCompletionExpected: false,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: '12321321',
        LocalDateTime: expect.any(String),
        AddressVerificationData: {
          AVSAddress: 'Delivery to store',
          AVSZipCode: 'SW1 1AA',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        MiscAmountsBalances: {
          TransactionAmount: '724.99',
        },
        ProcFlagsIndicators: {
          PinlessRequest: 'Y',
        },
        MerchantSpecificData: {
          AcquirerCurrencyCode: '998',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
        },
        TerminalData: {
          EntryMode: 'KEYED',
          POSConditionCode: '59',
          TerminalEntryCap: '9',
        },
        UserDefinedData: {
          UserData1: '123',
          UserData2: '456',
          UserData3: '789',
        },
        WorldPayMerchantID: '12311',
      },
    })
  })

  it('should deduct the gift card payments from the order total', () => {
    const cart = getMockCommercetoolsCart()
    cart.paymentInfo?.payments.push(
      getMockGiftCardPayment(
        { centAmount: 100, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
        '123123',
      ),
    )
    cart.paymentInfo?.payments.push(
      getMockGiftCardPayment(
        { centAmount: 150, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
        '123123',
      ),
    )
    const model = creditAuth({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      cart,
      STPBankId: '1340',
      STPTerminalId: '001',
      userDefinedData: {
        UserData1: '123',
        UserData2: '456',
        UserData3: '789',
      },
      partialCompletionExpected: false,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: '12321321',
        LocalDateTime: expect.any(String),
        AddressVerificationData: {
          AVSAddress: 'Delivery to store',
          AVSZipCode: 'SW1 1AA',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        MiscAmountsBalances: {
          TransactionAmount: '722.49',
        },
        ProcFlagsIndicators: {
          PinlessRequest: 'Y',
        },
        MerchantSpecificData: {
          AcquirerCurrencyCode: '998',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
        },
        TerminalData: {
          EntryMode: 'KEYED',
          POSConditionCode: '59',
          TerminalEntryCap: '9',
        },
        UserDefinedData: {
          UserData1: '123',
          UserData2: '456',
          UserData3: '789',
        },
        WorldPayMerchantID: '12311',
      },
    })
  })

  it('should invoke a custom UOM function', () => {
    const cart = getMockCommercetoolsCart()
    const model = creditAuth({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      cart,
      STPBankId: '1340',
      STPTerminalId: '001',
      unitOfMeasureFunction: (_lineItem) => UnitOfMeasure.Gram,
      authorizationType: AuthorizationType.ForcePost,
      partialCompletionExpected: true,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: '12321321',
        // Level3Data: [
        // {
        // ItemDescription: 'Icebreaker Adult Sierra Gloves Snos',
        // ItemDiscRateDecimal: '4',
        // ItemDiscountAmount: '000000000000',
        // ItemDiscountRate: '00000',
        // ItemQuantity: '000000000001',
        // ItemQuantityDecimal: '0',
        // ProductCode: '      103050854',
        // UnitOfMeasure: 'G',
        // UnitPrice: '000007190000',
        // UnitPriceDecimal: '4',
        // },
        // ],
        LocalDateTime: expect.any(String),
        AddressVerificationData: {
          AVSAddress: 'Delivery to store',
          AVSZipCode: 'SW1 1AA',
        },
        AuthorizationType: 'FP',
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        MiscAmountsBalances: {
          TransactionAmount: '724.99',
        },
        'Multi-clearingData': {
          FinalShipment: 'N',
          'SequenceCount_01-99': '99',
          'SequenceNumber_00-99': '00',
        },
        MerchantSpecificData: {
          AcquirerCurrencyCode: '998',
        },
        ProcFlagsIndicators: {
          PartialAllowed: 'Y',
          PinlessRequest: 'Y',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
        },
        TerminalData: {
          EntryMode: 'KEYED',
          POSConditionCode: '59',
          TerminalEntryCap: '9',
        },
        WorldPayMerchantID: '12311',
      },
    })
  })
})
