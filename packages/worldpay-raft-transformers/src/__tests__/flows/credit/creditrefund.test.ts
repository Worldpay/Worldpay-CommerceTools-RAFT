import { getMockCommercetoolsPayment, getMockTransactionCharged } from '../../mocks'
import { creditRefund } from '../../..'
import { validateCreditRefund } from '@gradientedge/worldpay-raft-messages'
import { Payment, TypedMoney } from '@commercetools/platform-sdk'

describe('creditrefund', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const genericParams = {
    worldpayMerchantID: '12311',
    apiTransactionID: '6543210987654321',
    STPBankId: '1340',
    STPTerminalId: '001',
  }

  it('should generate a valid creditrefund message from an orderId', () => {
    const payment = getMockCommercetoolsPayment()
    payment.transactions.push(getMockTransactionCharged())
    const model = creditRefund({
      ...genericParams,
      payment,
    })

    // Should validate, throws if invalid
    validateCreditRefund(model)
    expect(model).toStrictEqual({
      creditrefund: {
        APITransactionID: '6543210987654321',
        CardInfo: {
          ExpirationDate: '2611',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          DispensedAmount: '441.00',
          TransactionAmount: '441.00',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        ProcFlagsIndicators: {
          PriorAuth: 'Y',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
          STPReferenceNUM: '200100027',
        },
        WorldPayMerchantID: '12311',
      },
    })
  })

  it('should generate a valid creditrefund message from adding all transactions with type charge and success state', () => {
    const payment = getMockCommercetoolsPayment()
    payment.transactions.push(getMockTransactionCharged(), getMockTransactionCharged())

    let model = creditRefund({
      ...genericParams,
      payment,
    })

    // Should validate, throws if invalid
    validateCreditRefund(model)
    expect(model.creditrefund.MiscAmountsBalances.TransactionAmount).toEqual('882.00')

    payment.transactions.push(getMockTransactionCharged())
    model = creditRefund({
      ...genericParams,
      payment,
    })
    expect(model.creditrefund.MiscAmountsBalances.TransactionAmount).toEqual('1323.00')
  })

  it('should generate a valid creditrefund message from an orderId with a set dispensedAmount', () => {
    const payment = getMockCommercetoolsPayment()
    payment.transactions.push(getMockTransactionCharged())
    const model = creditRefund({
      ...genericParams,
      payment,
      amount: {
        centAmount: 10000,
        type: 'centPrecision',
        fractionDigits: 2,
        currencyCode: 'USD',
      },
    })

    // Should validate, throws if invalid
    validateCreditRefund(model)
    expect(model).toStrictEqual({
      creditrefund: {
        APITransactionID: '6543210987654321',
        CardInfo: {
          ExpirationDate: '2611',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '100.00',
          DispensedAmount: '441.00',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        ProcFlagsIndicators: {
          PriorAuth: 'Y',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
          STPReferenceNUM: '200100027',
        },
        WorldPayMerchantID: '12311',
      },
    })
  })

  it('should include a PinlessRequest flag in a valid creditrefund message from an orderId', () => {
    const payment = getMockCommercetoolsPayment()
    payment.custom!.fields.PinlessConverted = true
    payment.transactions.push(getMockTransactionCharged())
    const model = creditRefund({
      ...genericParams,
      payment,
    })

    // Should validate, throws if invalid
    validateCreditRefund(model)
    expect(model).toStrictEqual({
      creditrefund: {
        APITransactionID: '6543210987654321',
        CardInfo: {
          ExpirationDate: '2611',
        },
        LocalDateTime: expect.any(String),
        MiscAmountsBalances: {
          TransactionAmount: '441.00',
          DispensedAmount: '441.00',
        },
        EncryptionTokenData: {
          TokenizedPAN: '4111114335161111',
        },
        ProcFlagsIndicators: {
          PriorAuth: 'Y',
          PinlessRequest: 'Y',
        },
        STPData: {
          STPBankId: '1340',
          STPTerminalId: '001',
          STPReferenceNUM: '200100027',
        },
        WorldPayMerchantID: '12311',
      },
    })
  })

  it('should generate a valid creditrefund message and allow to receive a function to calculate the refund amount', () => {
    const payment = getMockCommercetoolsPayment()
    payment.transactions.push(getMockTransactionCharged(), getMockTransactionCharged())

    let calculateRefundFunction: (payment: Payment) => TypedMoney = (payment: Payment): TypedMoney => {
      return payment.amountPlanned
    }

    let model = creditRefund({
      ...genericParams,
      calculateRefundFunction,
      payment,
    })

    expect(model.creditrefund.MiscAmountsBalances.TransactionAmount).toEqual('441.00')

    calculateRefundFunction = (payment: Payment): TypedMoney => {
      return {
        ...payment.amountPlanned,
        centAmount: 100,
      }
    }

    model = creditRefund({
      ...genericParams,
      calculateRefundFunction,
      payment,
    })

    expect(model.creditrefund.MiscAmountsBalances.TransactionAmount).toEqual('1.00')
  })
})
