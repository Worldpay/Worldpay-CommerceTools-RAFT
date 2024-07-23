import { getMockCreditRefundRequest } from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import {
  getMockAxiosCreditRefundError,
  getMockAxiosCreditRefundSuccess,
  getMockCreditRefundError,
  getMockCreditRefundSuccess,
} from './mocks'
import { CreditRefundProcessor } from '../credit-refund-processor'

jest.mock('../../../raft-connector')

describe('credit-refund-processor', () => {
  describe('validate', () => {
    it('should validate the payload object is failing validation', () => {
      const payload = {}

      expect(CreditRefundProcessor.validate(payload)).toStrictEqual([
        'creditrefund.MiscAmountsBalances.TransactionAmount: creditrefund.MiscAmountsBalances.TransactionAmount is a required field',
        'creditrefund.WorldPayMerchantID: creditrefund.WorldPayMerchantID is a required field',
        'creditrefund.APITransactionID: creditrefund.APITransactionID is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(CreditRefundProcessor.validate(getMockCreditRefundRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('should call RAFT with the message', async () => {
      const message = getMockCreditRefundRequest()

      expect(await CreditRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'UpdateRequest',
        actions: [
          {
            action: 'setCustomField',
            name: 'request',
            value: null,
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditRefundProcessor.endpoint, message)
    })

    it('should respond with update actions on successful creditRefund call to RAFT', async () => {
      const message = getMockCreditRefundRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditRefundSuccess())

      expect(await CreditRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'UpdateRequest',
        actions: [
          {
            action: 'setCustomField',
            name: 'request',
            value: null,
          },
          {
            action: 'addInterfaceInteraction',
            fields: {
              createdAt: expect.any(String),
              apiTransactionId: '2019120412271401',
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditRefundSuccess()),
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 100,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              interactionId: '123424232',
              state: 'Success',
              timestamp: expect.any(String),
              type: 'Refund',
            },
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-refunded',
              typeId: 'state',
            },
          },
          {
            action: 'setStatusInterfaceCode',
            interfaceCode: '0000',
          },
          {
            action: 'setStatusInterfaceText',
            interfaceText: '0000',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditRefundProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockCreditRefundRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditRefundError())

      expect(await CreditRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'UpdateRequest',
        actions: [
          {
            action: 'setCustomField',
            name: 'request',
            value: null,
          },
          {
            action: 'addInterfaceInteraction',
            fields: {
              createdAt: expect.any(String),
              apiTransactionId: '2019120412271401',
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditRefundError()),
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 100,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              interactionId: '123424232',
              state: 'Failure',
              timestamp: expect.any(String),
              type: 'Refund',
            },
          },
          {
            action: 'setStatusInterfaceCode',
            interfaceCode: '0008',
          },
          {
            action: 'setStatusInterfaceText',
            interfaceText: '0000',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditRefundProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockCreditRefundRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await CreditRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /credit/refund: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditRefundProcessor.endpoint, message)
    })
  })
})
