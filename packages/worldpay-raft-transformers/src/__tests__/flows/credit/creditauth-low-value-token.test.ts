import { getMockCommercetoolsCart } from '../../mocks'
import { creditAuthWithLowValueToken } from '../../..'
import { validateCreditAuth } from '@gradientedge/worldpay-raft-messages'

describe('creditauth-with-low-value-token', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditauth message from cart and customer and low value token', () => {
    const cart = getMockCommercetoolsCart()
    const model = creditAuthWithLowValueToken({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      cart,
      lowValueToken: '1241413242342',
      STPBankId: '1340',
      STPTerminalId: '001',
      expirationYYMM: '2401',
      partialCompletionExpected: false,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: '12321321',
        AccountCodesAndData: {
          FromAccountSelected: 'CC',
        },
        AddressVerificationData: {
          AVSAddress: 'Delivery to store',
          AVSZipCode: 'SW1 1AA',
        },
        CardInfo: {
          ExpirationDate: '2401',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        EncryptionTokenData: {
          LowValueToken: '1241413242342',
          ReturnTokenizedPan: 'Y',
        },
        LocalDateTime: expect.any(String),
        MerchantSpecificData: {
          AcquirerCurrencyCode: '998',
        },
        MiscAmountsBalances: {
          TransactionAmount: '724.99',
        },
        ProcFlagsIndicators: {
          CardholderInitiatedTransaction: 'Y',
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
