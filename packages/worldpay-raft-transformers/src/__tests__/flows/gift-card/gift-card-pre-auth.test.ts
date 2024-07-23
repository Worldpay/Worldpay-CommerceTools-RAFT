import { getMockCommercetoolsOrder, getMockGiftCardPayment } from '../../../__tests__/mocks'
import { giftCardPreAuth } from '../../../flows'
import { validateGiftCardPreAuth } from '@gradientedge/worldpay-raft-messages'
describe('gift-card-pre-auth', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid giftcardpreauth message', () => {
    const model = giftCardPreAuth({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment: getMockGiftCardPayment(
        {
          centAmount: 65,
          currencyCode: 'USD',
          fractionDigits: 2,
          type: 'centPrecision',
        },
        '444332222',
      ).obj!,
      order: getMockCommercetoolsOrder(),
    })

    // Should validate, throws if invalid
    validateGiftCardPreAuth(model)
    expect(model).toStrictEqual({
      giftcardpreauth: {
        APITransactionID: '12321321',
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '0.65',
        },
        ProcFlagsIndicators: {
          PartialAllowed: 'Y',
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
        AccountCodesAndData: {
          FromAccountSelected: 'GC',
          ToAccountSelected: 'GC',
        },
        CardInfo: {
          ExpirationDate: '4912',
          PAN: '444332222',
        },
        GiftCardData: {
          GcSecurityCode: '1234',
        },
      },
    })
  })
})
