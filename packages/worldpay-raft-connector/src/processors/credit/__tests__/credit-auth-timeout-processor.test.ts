import { Payment } from '@commercetools/platform-sdk'
import { CreditAuthTimedOutProcessor } from '../'
import { getConfig, initialize } from '../../..'
import { getMockConfig } from '../../../__tests__/mocks'
import { getMockPendingPayment } from './mocks'
import { mocked } from 'jest-mock'

jest.mock('../../../raft-connector')
jest.mock('../../../config')

describe('credit-auth-timedout-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    initialize(getMockConfig(), false)
  })

  describe('handleTimedOutMessage', () => {
    it('should update a payment with an initial Pending transaction retry', async () => {
      const payment = getMockPendingPayment()
      const message = JSON.parse(payment.custom.fields.request)
      mocked(getConfig).mockReturnValue({ worldpayRaft: { maxRetries: 10 } })
      const transaction = payment.transactions[0]

      expect(CreditAuthTimedOutProcessor(payment, transaction, message)).toStrictEqual([
        { action: 'setTransactionCustomField', name: 'retryCount', transactionId: 'mock-transaction-1', value: 1 },
      ])
    })

    it('should update a payment with an incremented Pending transaction retry', async () => {
      const p = getMockPendingPayment()
      const payment: Payment = {
        ...p,
        transactions: [
          {
            ...p.transactions[0],
            custom: {
              ...p.transactions[0].custom,
              fields: {
                ...p.transactions[0].custom.fields,
                retryCount: 1,
              },
            },
          },
        ],
      }
      mocked(getConfig).mockReturnValue({ worldpayRaft: { maxRetries: 10 } })
      const message = JSON.parse(payment.custom.fields.request)
      const transaction = payment.transactions[0]

      expect(CreditAuthTimedOutProcessor(payment, transaction, message)).toStrictEqual([
        { action: 'setTransactionCustomField', name: 'retryCount', transactionId: 'mock-transaction-1', value: 2 },
      ])
    })

    it('should respond update a payment with a revert request after max attempts has been reached', async () => {
      const p = getMockPendingPayment()
      const payment: Payment = {
        ...p,
        transactions: [
          {
            ...p.transactions[0],
            custom: {
              ...p.transactions[0].custom,
              fields: {
                ...p.transactions[0].custom.fields,
                retryCount: 10,
              },
            },
          },
        ],
      }
      mocked(getConfig).mockReturnValue({ worldpayRaft: { maxRetries: 10 } })
      const message = JSON.parse(payment.custom.fields.request)
      const transaction = payment.transactions[0]

      const result = CreditAuthTimedOutProcessor(payment, transaction, message)
      // The new request is set with the AuthorizationType set to RV (Reverse)
      const request = payment.custom.fields.request
      const newRequest = request.replace('FP', 'RV')
      expect(result).toStrictEqual([
        {
          action: 'setCustomField',
          name: 'request',
          value: newRequest,
          // '{"creditauth":{" MiscAmountsBalances":{" TransactionAmount":" 10.00"}," CardInfo":{" TRACK_2":" 1111222233334444 = 49121010000012300001"," ExpirationDate":" 4912"}," ProcFlagsIndicators":{" PartialAllowed":" Y"}," ReferenceTraceNumbers":{" RetrievalREFNumber":" 200634200634"}," WorldPayMerchantID":" 01234567890123456789"," APITransactionID":" 2019120412271401"," LocalDateTime":" 2020 - 03 - 17 T14:53 : 54"," AuthorizationType":" RV"}}',
        },
        { action: 'setTransactionCustomField', name: 'retryCount', transactionId: 'mock-transaction-1', value: -1 },
      ])
    })
  })
})
