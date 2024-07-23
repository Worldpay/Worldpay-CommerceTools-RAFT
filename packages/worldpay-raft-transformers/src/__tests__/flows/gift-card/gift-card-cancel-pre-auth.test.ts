import { getMockGiftCardPayment } from '../../../__tests__/mocks'
import { giftCardCancelPreAuth } from '../../../flows'
import { validateGiftCardPreAuth } from '@gradientedge/worldpay-raft-messages'
describe('gift-card-carcel-pre-auth', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid giftcardpreauth cancellation message', () => {
    const payment = {
      ...getMockGiftCardPayment(
        {
          centAmount: 65,
          currencyCode: 'USD',
          fractionDigits: 2,
          type: 'centPrecision',
        },
        '444332222',
      ).obj!,
      interfaceId: 'mock-int-id',
    }

    payment.transactions.push({
      id: '77359740-7b0d-4b53-b916-fa239843ea13',
      timestamp: '2024-03-01T14:20:07.606Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 65,
        fractionDigits: 2,
      },
      interactionId: '200100011',
      state: 'Success',
      custom: {
        type: {
          typeId: 'type',
          id: '2a7d71ec-76d8-41aa-b3b3-590ed07129da',
        },
        fields: {
          authorizationNumber: '006464',
        },
      },
    })

    const model = giftCardCancelPreAuth({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment,
    })

    // Should validate, throws if invalid
    validateGiftCardPreAuth(model)
    expect(model).toStrictEqual({
      giftcardpreauth: {
        APITransactionID: 'mock-int-id',
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '0.65',
        },
        ReferenceTraceNumbers: {
          AuthorizationNumber: '006464',
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
        AuthorizationType: 'RV',
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
