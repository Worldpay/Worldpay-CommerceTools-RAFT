import { getMockCommercetoolsPayment } from '../../mocks'
import { validateCreditCompletion } from '@gradientedge/worldpay-raft-messages'
import { creditCompletionPartial } from '../../../flows'

describe('creditcompletionPartial', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditcompletion message with partial information', () => {
    const payment = getMockCommercetoolsPayment()
    const model = creditCompletionPartial({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      transactionAmount: { centAmount: 1010, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
      paymentSequenceNumber: '01',
      paymentSequenceCount: '02',
      isFinalShipment: false,
      payment,
    })

    // Should validate, throws if invalid
    validateCreditCompletion(model)
    expect(model).toStrictEqual({
      creditcompletion: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        AuthorizationType: 'FP',
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
          PreauthorizedAmount: '441.00',
          TransactionAmount: '10.10',
        },
        LocalDateTime: expect.any(String),
        ProcFlagsIndicators: {
          PriorAuth: 'Y',
        },
        'Multi-clearingData': {
          'SequenceNumber_00-99': '01',
          'SequenceCount_01-99': '02',
          FinalShipment: 'N',
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

  it('should include the PINless flag if the payment auth was PinlessConverted partial', () => {
    const payment = getMockCommercetoolsPayment()
    payment.custom!.fields.PinlessConverted = true
    const model = creditCompletionPartial({
      worldpayMerchantID: '12311',
      STPBankId: '1340',
      STPTerminalId: '001',
      transactionAmount: { centAmount: 1010, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
      paymentSequenceNumber: '01',
      paymentSequenceCount: '02',
      isFinalShipment: false,
      payment,
    })

    // Should validate, throws if invalid
    validateCreditCompletion(model)
    expect(model).toStrictEqual({
      creditcompletion: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        AuthorizationType: 'FP',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '10.10',
          PreauthorizedAmount: '441.00',
        },
        ProcFlagsIndicators: {
          PinlessRequest: 'Y',
          PriorAuth: 'Y',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        'Multi-clearingData': {
          'SequenceNumber_00-99': '01',
          'SequenceCount_01-99': '02',
          FinalShipment: 'N',
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
