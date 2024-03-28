import { getMockCommercetoolsCart } from '../../mocks'
import { creditAuthWithLowValueCVV2Token } from '../../..'
import { validateCreditAuth } from '@gradientedge/worldpay-raft-messages'

describe('creditauth-with-low-value-token', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditauth message from cart and customer and low value token', () => {
    const cart = getMockCommercetoolsCart()
    const model = creditAuthWithLowValueCVV2Token({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      tokenizedPAN: 'toktoktok',
      lowValueCVV2Token: '2342',
      cart,
      STPBankId: '1340',
      STPTerminalId: '001',
      expirationYYMM: '2401',
      partialCompletionExpected: true,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: '12321321',
        AddressVerificationData: {
          AVSAddress: 'Delivery to store',
          AVSZipCode: 'SW1 1AA',
        },
        CardInfo: {
          ExpirationDate: '2401',
        },
        CardVerificationData: {
          Cvv2Cvc2CIDIndicator: '1',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        EncryptionTokenData: {
          LowValueCVV2Token: '2342',
          ReturnTokenizedPan: 'Y',
          TokenizedPAN: 'toktoktok',
        },
        LocalDateTime: expect.any(String),
        MerchantSpecificData: {
          AcquirerCurrencyCode: '998',
        },
        MiscAmountsBalances: {
          TransactionAmount: '724.99',
        },
        'Multi-clearingData': {
          FinalShipment: 'N',
          'SequenceCount_01-99': '99',
          'SequenceNumber_00-99': '00',
        },
        ProcFlagsIndicators: {
          CardholderInitiatedTransaction: 'Y',
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
