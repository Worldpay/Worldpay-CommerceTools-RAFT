import { getMockCreditCompletionRequest } from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import {
  getMockAxiosCreditCompletionError,
  getMockAxiosCreditCompletionSuccess,
  getMockCreditCompletionError,
  getMockCreditCompletionSuccess,
} from './mocks'
import { CreditCompletionProcessor } from '../credit-completion-processor'

jest.mock('../../../raft-connector')
describe('credit-completion-processor', () => {
  describe('validate', () => {
    it('should validate the payload object is failing validation', () => {
      const payload = {}

      expect(CreditCompletionProcessor.validate(payload)).toStrictEqual([
        'creditcompletion.MiscAmountsBalances.TransactionAmount: creditcompletion.MiscAmountsBalances.TransactionAmount is a required field',
        'creditcompletion.MiscAmountsBalances.PreauthorizedAmount: creditcompletion.MiscAmountsBalances.PreauthorizedAmount is a required field',
        'creditcompletion.APITransactionID: creditcompletion.APITransactionID is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(CreditCompletionProcessor.validate(getMockCreditCompletionRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('should call RAFT with the message', async () => {
      const message = getMockCreditCompletionRequest()

      expect(await CreditCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'UpdateRequest',
        actions: [
          {
            action: 'setCustomField',
            name: 'request',
            value: null,
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditCompletionProcessor.endpoint, message)
    })

    it('should respond with update actions on successful creditCompletion call to RAFT', async () => {
      const message = getMockCreditCompletionRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditCompletionSuccess())

      expect(await CreditCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockCreditCompletionSuccess()),
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
              interactionId: '200100030',
              state: 'Success',
              timestamp: expect.any(String),
              type: 'Charge',
            },
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-paid',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditCompletionProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockCreditCompletionRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditCompletionError())

      expect(await CreditCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockCreditCompletionError()),
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
              interactionId: '200100030',
              state: 'Failure',
              timestamp: expect.any(String),
              type: 'Charge',
            },
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-failed',
              typeId: 'state',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditCompletionProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockCreditCompletionRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await CreditCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /credit/completion: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditCompletionProcessor.endpoint, message)
    })
  })
})
