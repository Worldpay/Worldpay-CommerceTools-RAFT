import { validateCreditAuth } from '@gradientedge/worldpay-raft-messages'
import { creditAuthCancelPartial } from '../../../'
import { getMockCommercetoolsPayment } from '../../mocks'

describe('creditauthCancelPartial', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a valid creditauth cancel message with partial information', () => {
    const payment = getMockCommercetoolsPayment()
    const model = creditAuthCancelPartial({
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
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        AuthorizationType: 'RV',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          DispensedAmount: '441.00',
          TransactionAmount: '10.10',
        },
        ProcFlagsIndicators: {
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

  it('should include the Pinless flag in the creditauth cancel partial if the payment auth was PinlessConverted', () => {
    const payment = getMockCommercetoolsPayment()
    payment.custom!.fields.PinlessConverted = true
    const model = creditAuthCancelPartial({
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
    validateCreditAuth(model)
    expect(model).toStrictEqual({
      creditauth: {
        APITransactionID: 'AD3nsATmTg75u0qI',
        AuthorizationType: 'RV',
        CardInfo: {
          ExpirationDate: '2611',
        },
        'E-commerceData': {
          'E-commerceIndicator': '07',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          DispensedAmount: '441.00',
          TransactionAmount: '10.10',
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
