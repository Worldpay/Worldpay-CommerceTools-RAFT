import { GiftCardHandler } from '..'
import { mocked } from 'jest-mock'
import { GiftCardPreAuthProcessor, GiftCardCompletionProcessor, GiftCardRefundProcessor } from '../../processors'
import { getMockGiftCardPreAuthRequest, getMockGiftCardRefundRequest } from '../../__tests__/mocks'

jest.mock('../../processors/gift-card/gift-card-pre-auth-processor')
jest.mock('../../processors/gift-card/gift-card-completion-processor')
jest.mock('../../processors/gift-card/gift-card-refund-processor')

describe('GiftCardHandler', () => {
  afterEach(() => jest.resetAllMocks())

  it('should handle a giftcardpreauth message correctly', async () => {
    mocked(GiftCardPreAuthProcessor.validate).mockReturnValue([])
    mocked(GiftCardPreAuthProcessor.handleMessage).mockResolvedValue({
      responseType: 'UpdateRequest',
      actions: [],
    })
    const message = getMockGiftCardPreAuthRequest()

    expect(await GiftCardHandler.handle(null, message, 'giftcardpreauth')).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
    expect(GiftCardPreAuthProcessor.handleMessage).toHaveBeenCalledWith(undefined, message)
  })

  it('should handle a giftcardcompletion message correctly', async () => {
    mocked(GiftCardCompletionProcessor.validate).mockReturnValue([])
    mocked(GiftCardCompletionProcessor.handleMessage).mockResolvedValue({
      responseType: 'UpdateRequest',
      actions: [],
    })
    const message = getMockGiftCardPreAuthRequest()

    expect(await GiftCardHandler.handle(null, message, 'giftcardcompletion')).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
    expect(GiftCardCompletionProcessor.handleMessage).toHaveBeenCalledWith(undefined, message)
  })

  it('should handle a invalid giftcardpreauth message correctly', async () => {
    mocked(GiftCardPreAuthProcessor.validate).mockReturnValue([
      'giftcardpreauth.MiscAmountsBalances.TransactionAmount: giftcardpreauth.MiscAmountsBalances.TransactionAmount is a required field',
    ])
    const message = getMockGiftCardPreAuthRequest()
    delete message.giftcardpreauth.MiscAmountsBalances.TransactionAmount

    const actions = await GiftCardHandler.handle(null, message, 'giftcardpreauth')
    expect(actions).toStrictEqual({
      responseType: 'FailedValidation',
      errors: [
        {
          code: 'InvalidInput',
          message:
            'giftcardpreauth.MiscAmountsBalances.TransactionAmount: giftcardpreauth.MiscAmountsBalances.TransactionAmount is a required field',
        },
      ],
    })
  })

  it('should handle a giftcardrefund message correctly', async () => {
    mocked(GiftCardRefundProcessor.validate).mockReturnValue([])
    mocked(GiftCardRefundProcessor.handleMessage).mockResolvedValue({
      responseType: 'UpdateRequest',
      actions: [],
    })
    const message = getMockGiftCardRefundRequest()

    expect(await GiftCardHandler.handle(null, message, 'giftcardrefund')).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
    expect(GiftCardRefundProcessor.handleMessage).toHaveBeenCalledWith(undefined, message)
  })

  it('should handle a invalid giftcardrefund message correctly', async () => {
    mocked(GiftCardRefundProcessor.validate).mockReturnValue([
      'giftcardrefund.MiscAmountsBalances.TransactionAmount: giftcardpreauth.MiscAmountsBalances.TransactionAmount is a required field',
    ])
    const message = getMockGiftCardRefundRequest()
    delete message.giftcardrefund.MiscAmountsBalances.TransactionAmount

    const actions = await GiftCardHandler.handle(null, message, 'giftcardrefund')
    expect(actions).toStrictEqual({
      responseType: 'FailedValidation',
      errors: [
        {
          code: 'InvalidInput',
          message:
            'giftcardrefund.MiscAmountsBalances.TransactionAmount: giftcardpreauth.MiscAmountsBalances.TransactionAmount is a required field',
        },
      ],
    })
  })

  it('should handle a incorrectMessageType message correctly', async () => {
    expect(await GiftCardHandler.handle(null, {}, 'incorrectMessageType')).toStrictEqual({
      responseType: 'FailedValidation',
      errors: [
        {
          code: 'General',
          message: 'No Gift Card request processor for incorrectMessageType',
        },
      ],
    })
  })
})
