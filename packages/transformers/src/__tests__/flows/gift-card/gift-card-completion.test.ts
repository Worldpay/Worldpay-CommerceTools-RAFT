import { getMockGiftCardPayment } from '../../mocks'
import { giftCardCompletion } from '../../../flows'
import {
  AuthorizationType,
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
  validateGiftCardCompletion,
} from '@gradientedge/worldpay-raft-messages'

describe('gift-card-completion', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid giftcardcompletion message', () => {
    const payment = getMockGiftCardPayment(
      { centAmount: 12300, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
      '999baba999',
    ).obj!
    payment.transactions.push({
      id: 'pre-auth-id',
      amount: {
        centAmount: 12300,
        currencyCode: 'USD',
        fractionDigits: 2,
        type: 'centPrecision',
      },
      type: 'Authorization',
      state: 'Success',
    })

    const model = giftCardCompletion({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment,
    })

    // Should validate, throws if invalid
    validateGiftCardCompletion(model)
    expect(model).toStrictEqual({
      giftcardcompletion: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          PreauthorizedAmount: '123.00',
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
        AuthorizationType: AuthorizationType.ForcePost,
      },
    })
  })
})
