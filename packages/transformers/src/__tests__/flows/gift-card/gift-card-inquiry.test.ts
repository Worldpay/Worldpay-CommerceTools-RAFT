import { giftCardInquiry } from '../../../flows'
import { validateGiftCardInquiry } from '@gradientedge/worldpay-raft-messages'
describe('gift-card-inquiry', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid giftcardinquiry message', () => {
    const model = giftCardInquiry({
      worldpayMerchantID: '12311',
      apiTransactionID: '12321321',
      STPBankId: '1340',
      STPTerminalId: '001',
      pan: '9999222266668888',
      expirationDate: '2612',
      gcSecurityCode: '9999',
    })

    // Should validate, throws if invalid
    validateGiftCardInquiry(model)
    expect(model).toStrictEqual({
      giftcardinquiry: {
        APITransactionID: '12321321',
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '0.00',
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
          ExpirationDate: '2612',
          PAN: '9999222266668888',
        },
        GiftCardData: {
          GcSecurityCode: '9999',
        },
      },
    })
  })
})
