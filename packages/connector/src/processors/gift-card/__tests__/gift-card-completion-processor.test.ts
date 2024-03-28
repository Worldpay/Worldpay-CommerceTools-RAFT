import { GiftCardCompletionProcessor } from '../gift-card-completion-processor'
import { getMockGiftCardCompletionRequest } from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import { initialize } from '../../..'
import { getMockConfig } from '../../../__tests__/mocks'
import {
  getMockAxiosGiftCardCompletionError,
  getMockAxiosGiftCardCompletionSuccess,
  getMockGiftCardCompletionError,
  getMockGiftCardCompletionSuccess,
} from './mocks'
import { AuthorizationType } from '@gradientedge/worldpay-raft-messages'

jest.mock('../../../raft-connector')

describe('gift-card-completion-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    initialize(getMockConfig(), false)
  })

  describe('validate', () => {
    it('gift card completion should validate the payload object is failing validation', () => {
      const payload = {}

      expect(GiftCardCompletionProcessor.validate(payload)).toStrictEqual([
        'giftcardcompletion.MiscAmountsBalances.PreauthorizedAmount: giftcardcompletion.MiscAmountsBalances.PreauthorizedAmount is a required field',
        'giftcardcompletion.WorldPayMerchantID: giftcardcompletion.WorldPayMerchantID is a required field',
        'giftcardcompletion.APITransactionID: giftcardcompletion.APITransactionID is a required field',
        'giftcardcompletion.LocalDateTime: giftcardcompletion.LocalDateTime is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(GiftCardCompletionProcessor.validate(getMockGiftCardCompletionRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('should call RAFT with the message', async () => {
      const message = getMockGiftCardCompletionRequest()

      expect(await GiftCardCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
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
                '{"giftcardcompletion":{"MiscAmountsBalances":{"TransactionAmount":"10.00","PreauthorizedAmount":"10.00"},"CardInfo":{"PAN":"1111222233334444","ExpirationDate":"4912"},"STPData":{"STPBankId":"1340","STPTerminalId":"001"},"GiftCardData":{"GcSecurityCode":"1234"},"ProcFlagsIndicators":{"PartialAllowed":"Y"},"WorldPayMerchantID":"4445012345678","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
              response: undefined,
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardCompletionProcessor.endpoint, message)
    })

    it('should respond with update actions on successful giftCardCompletion call to RAFT', async () => {
      const message = getMockGiftCardCompletionRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardCompletionSuccess())

      expect(await GiftCardCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardCompletionSuccess()),
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
                centAmount: 1000,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              interactionId: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardCompletionProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockGiftCardCompletionRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardCompletionError())

      expect(await GiftCardCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardCompletionError()),
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
                centAmount: 1000,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              interactionId: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardCompletionProcessor.endpoint, message)
    })

    it('should respond with update actions with a negative amount on successful reversal of a giftCardCompletion call to RAFT', async () => {
      const message = getMockGiftCardCompletionRequest()
      message.giftcardcompletion.AuthorizationType = AuthorizationType.Reversal
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardCompletionSuccess())

      expect(await GiftCardCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardCompletionSuccess()),
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
                centAmount: -1000,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              interactionId: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardCompletionProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockGiftCardCompletionRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await GiftCardCompletionProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /giftcard/completion: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardCompletionProcessor.endpoint, message)
    })
  })
})
