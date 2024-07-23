import { GiftCardPreAuthProcessor } from '../gift-card-pre-auth-processor'
import { getMockGiftCardPreAuthRequest } from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import { initialize } from '../../..'
import { getMockConfig } from '../../../__tests__/mocks'
import {
  getMockAxiosGiftCardPreAuthError,
  getMockAxiosGiftCardPreAuthSuccess,
  getMockGiftCardPreAuthError,
  getMockGiftCardPreAuthSuccess,
} from './mocks'

jest.mock('../../../raft-connector')

describe('gift-card-pre-auth-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    initialize(getMockConfig(), false)
  })

  describe('validate', () => {
    it('should validate the payload object is failing validation', () => {
      const payload = {}

      expect(GiftCardPreAuthProcessor.validate(payload)).toStrictEqual([
        'giftcardpreauth.WorldPayMerchantID: giftcardpreauth.WorldPayMerchantID is a required field',
        'giftcardpreauth.APITransactionID: giftcardpreauth.APITransactionID is a required field',
        'giftcardpreauth.LocalDateTime: giftcardpreauth.LocalDateTime is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(GiftCardPreAuthProcessor.validate(getMockGiftCardPreAuthRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('gift card pre-auth should call RAFT with the message', async () => {
      const message = getMockGiftCardPreAuthRequest()

      expect(await GiftCardPreAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
                '{"giftcardpreauth":{"MiscAmountsBalances":{"TransactionAmount":"10.00"},"CardInfo":{"PAN":"1111222233334444","ExpirationDate":"4912"},"STPData":{"STPBankId":"1340","STPTerminalId":"001"},"GiftCardData":{"GcSecurityCode":"1234"},"ProcFlagsIndicators":{"PartialAllowed":"Y"},"WorldPayMerchantID":"01234567890123456789","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
              response: undefined,
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Gift Card',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Gift Card',
            },
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardPreAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful giftCardPreAuth call to RAFT', async () => {
      const message = getMockGiftCardPreAuthRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardPreAuthSuccess())

      expect(await GiftCardPreAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockGiftCardPreAuthSuccess()),
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Gift Card',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Gift Card',
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
                  authorizationNumber: 'DEMO19',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              interactionId: '200100024',
              state: 'Success',
              timestamp: expect.any(String),
              type: 'Authorization',
            },
          },
          {
            action: 'setCustomField',
            name: 'STPReferenceNUM',
            value: '200100024',
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
            name: 'expirationDate',
            value: '4912',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardPreAuthProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockGiftCardPreAuthRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardPreAuthError())

      expect(await GiftCardPreAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request: JSON.stringify(message),
              response: JSON.stringify(getMockGiftCardPreAuthError()),
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Gift Card',
          },
          {
            action: 'setMethodInfoName',
            name: {
              en: 'Gift Card',
            },
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
                  authorizationNumber: 'DEMO19',
                },
                type: {
                  key: 'raft-transaction',
                  typeId: 'type',
                },
              },
              interactionId: '200100024',
              state: 'Failure',
              timestamp: expect.any(String),
              type: 'Authorization',
            },
          },
          {
            action: 'setCustomField',
            name: 'STPReferenceNUM',
            value: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardPreAuthProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockGiftCardPreAuthRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await GiftCardPreAuthProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /giftcard/preauth: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardPreAuthProcessor.endpoint, message)
    })
  })
})
