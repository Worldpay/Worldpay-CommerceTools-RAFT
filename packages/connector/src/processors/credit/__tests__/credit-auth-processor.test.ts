import { CreditAuthProcessor } from '../credit-auth-processor'
import {
  getMockCreditAuthCancelRequest,
  getMockCreditAuthRequest,
  getMockPendingTransaction,
} from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import { initialize } from '../../..'
import { getMockConfig } from '../../../__tests__/mocks'
import {
  getMockAxiosCreditAuthError,
  getMockAxiosCreditAuthSuccess,
  getMockCreditAuthError,
  getMockCreditAuthSuccess,
} from './mocks'

jest.mock('../../../raft-connector')

describe('credit-auth-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    initialize(getMockConfig(), false)
  })

  describe('validate', () => {
    it('should validate the payload object is failing validation', () => {
      const payload = {}

      expect(CreditAuthProcessor.validate(payload)).toStrictEqual([
        'creditauth.MiscAmountsBalances.TransactionAmount: creditauth.MiscAmountsBalances.TransactionAmount is a required field',
        'creditauth.WorldPayMerchantID: creditauth.WorldPayMerchantID is a required field',
        'creditauth.APITransactionID: creditauth.APITransactionID is a required field',
        'creditauth.LocalDateTime: creditauth.LocalDateTime is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(CreditAuthProcessor.validate(getMockCreditAuthRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('should call RAFT with the message', async () => {
      const message = getMockCreditAuthRequest()

      expect(await CreditAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              apiTransactionId: '2019120412271401',
              createdAt: expect.any(String),
              request:
                '{"creditauth":{"MiscAmountsBalances":{"TransactionAmount":"10.00"},"CardInfo":{"TRACK_2":"1111222233334444=49121010000012300001","ExpirationDate":"4912"},"STPData":{"STPBankId":"1340","STPTerminalId":"001"},"ProcFlagsIndicators":{"PartialAllowed":"Y"},"ReferenceTraceNumbers":{"RetrievalREFNumber":"200634200634"},"WorldPayMerchantID":"4445012345678","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
              response: undefined,
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'setInterfaceId',
            interfaceId: '2019120412271401',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful creditAuth call to RAFT', async () => {
      const message = getMockCreditAuthRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditAuthSuccess())

      expect(await CreditAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditAuthSuccess()),
              apiTransactionId: '2019120412271401',
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'setInterfaceId',
            interfaceId: '2019120412271401',
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 1000,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              custom: {
                fields: {
                  authorizationNumber: '904328',
                  retrievalREFNumber: '934311091236',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              interactionId: '23456746768',
              state: 'Success',
              timestamp: expect.any(String),
              type: 'Authorization',
            },
          },
          {
            action: 'setCustomField',
            name: 'STPReferenceNUM',
            value: '23456746768',
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-open',
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
          {
            action: 'setCustomField',
            name: 'tokenizedPAN',
            value: '4111114335161111',
          },
          {
            action: 'setCustomField',
            name: 'expirationDate',
            value: '4912',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should respond with update actions for the existing transaction on successful call to RAFT after a previous timeout', async () => {
      const message = getMockCreditAuthRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditAuthSuccess())

      const transaction = getMockPendingTransaction()
      expect(await CreditAuthProcessor.handleMessage(transaction, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditAuthSuccess()),
              apiTransactionId: '2019120412271401',
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'changeTransactionState',
            state: 'Success',
            transactionId: 'mock-transaction-id',
          },
          {
            action: 'changeTransactionTimestamp',
            timestamp: expect.any(String),
            transactionId: 'mock-transaction-id',
          },
          {
            action: 'setCustomField',
            name: 'STPReferenceNUM',
            value: '23456746768',
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-open',
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
          {
            action: 'setCustomField',
            name: 'tokenizedPAN',
            value: '4111114335161111',
          },
          {
            action: 'setCustomField',
            name: 'expirationDate',
            value: '4912',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT with PinlessConverted', async () => {
      const message = getMockCreditAuthRequest()
      const mockResponseFromRAFT = getMockAxiosCreditAuthSuccess()
      mockResponseFromRAFT.data.creditauthresponse.ProcFlagsIndicators = { PinlessConverted: 'Y' }
      mocked(sendRaftMessage).mockResolvedValue(mockResponseFromRAFT)

      const response = await CreditAuthProcessor.handleMessage(undefined, message)
      expect(response).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(mockResponseFromRAFT.data),
              apiTransactionId: '2019120412271401',
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'setInterfaceId',
            interfaceId: '2019120412271401',
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 1000,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              custom: {
                fields: {
                  authorizationNumber: '904328',
                  retrievalREFNumber: '934311091236',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              interactionId: '23456746768',
              state: 'Success',
              timestamp: expect.any(String),
              type: 'Authorization',
            },
          },
          {
            action: 'setCustomField',
            name: 'STPReferenceNUM',
            value: '23456746768',
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-open',
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
          {
            action: 'setCustomField',
            name: 'PinlessConverted',
            value: true,
          },
          {
            action: 'setCustomField',
            name: 'tokenizedPAN',
            value: '4111114335161111',
          },
          {
            action: 'setCustomField',
            name: 'expirationDate',
            value: '4912',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockCreditAuthRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditAuthError())

      expect(await CreditAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditAuthError()),
              apiTransactionId: '2019120412271401',
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'setInterfaceId',
            interfaceId: '2019120412271401',
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 1000,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              custom: {
                fields: {
                  authorizationNumber: '904328',
                  retrievalREFNumber: '934311091236',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              state: 'Failure',
              timestamp: expect.any(String),
              type: 'Authorization',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockCreditAuthRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await CreditAuthProcessor.handleMessage(undefined, message)).toMatchObject({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /credit/authorization: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT with cancel authorization', async () => {
      const message = getMockCreditAuthCancelRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditAuthSuccess())

      expect(await CreditAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditAuthSuccess()),
              apiTransactionId: '2019120412271401',
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 44100,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              custom: {
                fields: {
                  authorizationNumber: '904328',
                  retrievalREFNumber: '934311091236',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              interactionId: '23456746768',
              state: 'Success',
              timestamp: expect.any(String),
              type: 'CancelAuthorization',
            },
          },
          {
            action: 'setCustomField',
            name: 'STPReferenceNUM',
            value: '23456746768',
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-cancelled',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT for cancel authorization with error code', async () => {
      const message = getMockCreditAuthCancelRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosCreditAuthError())

      expect(await CreditAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockCreditAuthError()),
              apiTransactionId: '2019120412271401',
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Other',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Card',
            },
          },
          {
            action: 'addTransaction',
            transaction: {
              amount: {
                centAmount: 44100,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              custom: {
                fields: {
                  authorizationNumber: '904328',
                  retrievalREFNumber: '934311091236',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              state: 'Failure',
              timestamp: expect.any(String),
              type: 'CancelAuthorization',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(CreditAuthProcessor.endpoint, message)
    })
  })
})
