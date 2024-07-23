import { GiftCardRefundProcessor } from '../gift-card-refund-processor'
import { getMockGiftCardRefundRequest } from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import { initialize } from '../../..'
import { getMockConfig } from '../../../__tests__/mocks'
import {
  getMockAxiosGiftCardRefundError,
  getMockAxiosGiftCardRefundSuccess,
  getMockGiftCardRefundError,
  getMockGiftCardRefundSuccess,
} from './mocks'
import { AuthorizationType } from '@gradientedge/worldpay-raft-messages'

jest.mock('../../../raft-connector')

describe('gift-card-refund-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    initialize(getMockConfig(), false)
  })

  describe('validate', () => {
    it('should validate the payload object is failing validation', () => {
      const payload = {}

      expect(GiftCardRefundProcessor.validate(payload)).toStrictEqual([
        'giftcardrefund.WorldPayMerchantID: giftcardrefund.WorldPayMerchantID is a required field',
        'giftcardrefund.APITransactionID: giftcardrefund.APITransactionID is a required field',
        'giftcardrefund.LocalDateTime: giftcardrefund.LocalDateTime is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(GiftCardRefundProcessor.validate(getMockGiftCardRefundRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('should call RAFT with the message', async () => {
      const message = getMockGiftCardRefundRequest()

      expect(await GiftCardRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
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
                '{"giftcardrefund":{"MiscAmountsBalances":{"TransactionAmount":"1.00"},"AccountCodesAndData":{"FromAccountSelected":"GC"},"CardInfo":{"PAN":"1111222233334444","ExpirationDate":"4912"},"GiftCardData":{"GcSecurityCode":"1234"},"TerminalData":{"EntryMode":"SWIPED","TerminalType":"POS","TerminalNumber":"090335802001"},"ReferenceTraceNumbers":{"RetrievalREFNumber":"200634200634","AuthorizationNumber":"A12345"},"WorldPayMerchantID":"01234567890123456789","AuthorizationType":"FP","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
              response: undefined,
            },
            type: {
              key: 'worldpay-raft-interface-interaction',
              typeId: 'type',
            },
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardRefundProcessor.endpoint, message)
    })

    it('should respond with update actions on successful giftCardRefund call to RAFT', async () => {
      const message = getMockGiftCardRefundRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardRefundSuccess())

      expect(await GiftCardRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardRefundSuccess()),
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
              interactionId: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardRefundProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockGiftCardRefundRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardRefundError())

      expect(await GiftCardRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardRefundError()),
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
              interactionId: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardRefundProcessor.endpoint, message)
    })

    it('should respond with update actions with a negative amount on successful reversal call to RAFT but returns error code', async () => {
      const message = getMockGiftCardRefundRequest()
      message.giftcardrefund.AuthorizationType = AuthorizationType.Reversal
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardRefundError())

      expect(await GiftCardRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardRefundError()),
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
                centAmount: -100,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
              interactionId: '200100024',
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
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardRefundProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockGiftCardRefundRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await GiftCardRefundProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /giftcard/refund: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardRefundProcessor.endpoint, message)
    })
  })
})
