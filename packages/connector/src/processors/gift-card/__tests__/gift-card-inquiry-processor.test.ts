import { GiftCardInquiryProcessor } from '../gift-card-inquiry-processor'
import { getMockGiftCardInquiryRequest } from '../../../__tests__/mocks'
import { sendRaftMessage } from '../../../raft-connector'
import { mocked } from 'jest-mock'
import { initialize } from '../../..'
import { getMockConfig } from '../../../__tests__/mocks'
import {
  getMockAxiosGiftCardInquiryError,
  getMockAxiosGiftCardInquirySuccess,
  getMockGiftCardInquiryError,
  getMockGiftCardInquirySuccess,
} from './mocks'

jest.mock('../../../raft-connector')

describe('gift-card-inquiry-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    initialize(getMockConfig(), false)
  })

  describe('validate', () => {
    it('should validate the payload object is failing validation', () => {
      const payload = {}

      expect(GiftCardInquiryProcessor.validate(payload)).toStrictEqual([
        'giftcardinquiry.WorldPayMerchantID: giftcardinquiry.WorldPayMerchantID is a required field',
        'giftcardinquiry.APITransactionID: giftcardinquiry.APITransactionID is a required field',
        'giftcardinquiry.LocalDateTime: giftcardinquiry.LocalDateTime is a required field',
      ])
    })

    it('should validate the payload object is correct', () => {
      expect(GiftCardInquiryProcessor.validate(getMockGiftCardInquiryRequest())).toStrictEqual([])
    })
  })

  describe('handleMessage', () => {
    it('gift card inquiry should call RAFT with the message', async () => {
      const message = getMockGiftCardInquiryRequest()

      expect(await GiftCardInquiryProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              request:
                '{"giftcardinquiry":{"MiscAmountsBalances":{"TransactionAmount":"0.00"},"CardInfo":{"PAN":"49121010000012300001","ExpirationDate":"2612"},"GiftCardData":{"GcSecurityCode":"9999"},"STPData":{"STPBankId":"1340","STPTerminalId":"001"},"ProcFlagsIndicators":{"PartialAllowed":"Y"},"ReferenceTraceNumbers":{"RetrievalREFNumber":"200634200634"},"WorldPayMerchantID":"4445012345678","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
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
          {
            action: 'changeAmountPlanned',
            amount: {
              centAmount: 0,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-failed',
              typeId: 'state',
            },
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardInquiryProcessor.endpoint, message)
    })

    it('should respond with update actions on successful giftCardInquiry call to RAFT', async () => {
      const message = getMockGiftCardInquiryRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardInquirySuccess())

      expect(await GiftCardInquiryProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardInquirySuccess()),
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
            action: 'setStatusInterfaceCode',
            interfaceCode: '0000',
          },
          {
            action: 'setStatusInterfaceText',
            interfaceText: '0000',
          },
          {
            action: 'changeAmountPlanned',
            amount: {
              centAmount: 200,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-open',
              typeId: 'state',
            },
          },
          {
            action: 'setCustomField',
            name: 'tokenizedPAN',
            value: '49121010000012300001',
          },
          {
            action: 'setCustomField',
            name: 'expirationDate',
            value: '2612',
          },
          {
            action: 'setCustomField',
            name: 'gcSecurityCode',
            value: '9999',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardInquiryProcessor.endpoint, message)
    })

    it('should respond with update actions on successful call to RAFT but returns error code', async () => {
      const message = getMockGiftCardInquiryRequest()
      mocked(sendRaftMessage).mockResolvedValue(getMockAxiosGiftCardInquiryError())

      expect(await GiftCardInquiryProcessor.handleMessage(undefined, message)).toStrictEqual({
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
              response: JSON.stringify(getMockGiftCardInquiryError()),
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
            action: 'setStatusInterfaceCode',
            interfaceCode: '0008',
          },
          {
            action: 'setStatusInterfaceText',
            interfaceText: '0000',
          },
          {
            action: 'changeAmountPlanned',
            amount: {
              centAmount: 0,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
          },
          {
            action: 'transitionState',
            state: {
              key: 'payment-failed',
              typeId: 'state',
            },
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardInquiryProcessor.endpoint, message)
    })

    it('should call RAFT with the message and respond with an error on failure', async () => {
      const message = getMockGiftCardInquiryRequest()
      mocked(sendRaftMessage).mockRejectedValueOnce({ status: 401, statusMessage: 'Unauthorized' })

      expect(await GiftCardInquiryProcessor.handleMessage(undefined, message)).toStrictEqual({
        responseType: 'FailedValidation',
        errors: [
          {
            code: 'General',
            message: 'Failed request to /giftcard/inquiry: {"status":401,"statusMessage":"Unauthorized"}',
          },
        ],
      })
      expect(sendRaftMessage).toHaveBeenCalledWith(GiftCardInquiryProcessor.endpoint, message)
    })
  })
})
