import { getMockCommercetoolsPayment } from '../../mocks'
import { creditCompletion } from '../../..'
import { validateCreditCompletion } from '@gradientedge/worldpay-raft-messages'

describe('creditcompletion', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditcompletion message from an orderId', () => {
    const payment = getMockCommercetoolsPayment()
    const model = creditCompletion({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment,
    })

    // Should validate, throws if invalid
    validateCreditCompletion(model)

    expect(model).toStrictEqual({
      creditcompletion: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        AccountCodesAndData: {
          FromAccountSelected: 'CC',
        },
        AuthorizationType: 'FP',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          PreauthorizedAmount: '441.00',
          TransactionAmount: '441.00',
        },
        ProcFlagsIndicators: {
          PriorAuth: 'Y',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
          STPReferenceNUM: '200100016',
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

  it('should include the PINless flag if the payment auth was PinlessConverted', () => {
    const payment = getMockCommercetoolsPayment()
    payment.custom!.fields.PinlessConverted = true
    const model = creditCompletion({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment,
    })

    // Should validate, throws if invalid
    validateCreditCompletion(model)

    expect(model).toStrictEqual({
      creditcompletion: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        AccountCodesAndData: {
          FromAccountSelected: 'CC',
        },
        AuthorizationType: 'FP',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '441.00',
          PreauthorizedAmount: '441.00',
        },
        ProcFlagsIndicators: {
          PinlessRequest: 'Y',
          PriorAuth: 'Y',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
          STPReferenceNUM: '200100016',
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
