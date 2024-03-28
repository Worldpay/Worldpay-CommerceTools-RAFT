import { getMockCommercetoolsPayment } from '../../mocks'
import { creditAuthCancel } from '../../..'
import { validateCreditAuth } from '@gradientedge/worldpay-raft-messages'

describe('creditauth-cancel', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditauth message for cancellation from a payment', () => {
    const payment = getMockCommercetoolsPayment()
    const model = creditAuthCancel({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)

    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        LocalDateTime: expect.any(String),
        AuthorizationType: 'RV',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        MiscAmountsBalances: {
          TransactionAmount: '441.00',
        },
        ProcFlagsIndicators: {
          PriorAuth: 'Y',
        },
        ReversalAdviceReasonCd: '000',
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

  it('should include a PinlessRequest flag a valid creditauth message for cancellation from a payment', () => {
    const payment = getMockCommercetoolsPayment()
    payment.custom!.fields.PinlessConverted = true
    const model = creditAuthCancel({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      payment,
    })

    // Should validate, throws if invalid
    validateCreditAuth(model)

    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        LocalDateTime: expect.any(String),
        AuthorizationType: 'RV',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        MiscAmountsBalances: {
          TransactionAmount: '441.00',
        },
        ProcFlagsIndicators: {
          PinlessRequest: 'Y',
          PriorAuth: 'Y',
        },
        ReversalAdviceReasonCd: '000',
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
