import { getMockGiftCardPayment } from '../../mocks'
import { giftCardRefund } from '../../../flows'
import {
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
  validateGiftCardRefund,
} from '@gradientedge/worldpay-raft-messages'

describe('gift-card-refund', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid giftcardrefund message', () => {
    const model = giftCardRefund({
      worldpayMerchantID: '12311',
      apiTransactionID: '4324324323',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment: getMockGiftCardPayment(
        { centAmount: 12300, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
        '999baba999',
      ).obj!,
    })

    // Should validate, throws if invalid
    validateGiftCardRefund(model)
    expect(model).toStrictEqual({
      giftcardrefund: {
        APITransactionID: '4324324323',
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '123.00',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
        },
        TerminalData: {
          EntryMode: EntryMode.KEYED,
          POSConditionCode: POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
          TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
        },
        WorldPayMerchantID: '12311',
        AccountCodesAndData: {
          FromAccountSelected: 'GC',
          ToAccountSelected: 'GC',
        },
        CardInfo: {
          ExpirationDate: '4912',
          PAN: '999baba999',
        },
        GiftCardData: {
          GcSecurityCode: '1234',
        },
      },
    })
  })
})
