import { CreditHandler } from '../credit-handler'
import { mocked } from 'jest-mock'
import { CreditAuthProcessor, CreditCompletionProcessor, CreditRefundProcessor } from '../../processors'
import { getMockCreditAuthRequest, getMockCreditRefundRequest } from '../../__tests__/mocks'

jest.mock('../../processors/credit/credit-auth-processor')
jest.mock('../../processors/credit/credit-completion-processor')
jest.mock('../../processors/credit/credit-refund-processor')

describe('CreditHandler', () => {
  afterEach(() => jest.resetAllMocks())

  it('should handle a creditauth message correctly', async () => {
    mocked(CreditAuthProcessor.validate).mockReturnValue([])
    mocked(CreditAuthProcessor.handleMessage).mockResolvedValue({
      responseType: 'UpdateRequest',
      actions: [],
    })
    const message = getMockCreditAuthRequest()

    expect(await CreditHandler.handle(null, message, 'creditauth')).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
    expect(CreditAuthProcessor.handleMessage).toHaveBeenCalledWith(undefined, message)
  })

  it('should handle a creditcompletion message correctly', async () => {
    mocked(CreditCompletionProcessor.validate).mockReturnValue([])
    mocked(CreditCompletionProcessor.handleMessage).mockResolvedValue({
      responseType: 'UpdateRequest',
      actions: [],
    })
    const message = getMockCreditAuthRequest()

    expect(await CreditHandler.handle(null, message, 'creditcompletion')).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
    expect(CreditCompletionProcessor.handleMessage).toHaveBeenCalledWith(undefined, message)
  })

  it('should handle a invalid creditauth message correctly', async () => {
    mocked(CreditAuthProcessor.validate).mockReturnValue([
      'creditauth.MiscAmountsBalances.TransactionAmount: creditauth.MiscAmountsBalances.TransactionAmount is a required field',
    ])
    const message = getMockCreditAuthRequest()
    delete message.creditauth.MiscAmountsBalances.TransactionAmount

    const actions = await CreditHandler.handle(null, message, 'creditauth')
    expect(actions).toStrictEqual({
      responseType: 'FailedValidation',
      errors: [
        {
          code: 'InvalidInput',
          message:
            'creditauth.MiscAmountsBalances.TransactionAmount: creditauth.MiscAmountsBalances.TransactionAmount is a required field',
        },
      ],
    })
  })

  it('should handle a creditrefund message correctly', async () => {
    mocked(CreditRefundProcessor.validate).mockReturnValue([])
    mocked(CreditRefundProcessor.handleMessage).mockResolvedValue({
      responseType: 'UpdateRequest',
      actions: [],
    })
    const message = getMockCreditRefundRequest()

    expect(await CreditHandler.handle(null, message, 'creditrefund')).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
    expect(CreditRefundProcessor.handleMessage).toHaveBeenCalledWith(undefined, message)
  })

  it('should handle a invalid creditrefund message correctly', async () => {
    mocked(CreditRefundProcessor.validate).mockReturnValue([
      'creditrefund.MiscAmountsBalances.TransactionAmount: creditauth.MiscAmountsBalances.TransactionAmount is a required field',
    ])
    const message = getMockCreditRefundRequest()
    delete message.creditrefund.MiscAmountsBalances.TransactionAmount

    const actions = await CreditHandler.handle(null, message, 'creditrefund')
    expect(actions).toStrictEqual({
      responseType: 'FailedValidation',
      errors: [
        {
          code: 'InvalidInput',
          message:
            'creditrefund.MiscAmountsBalances.TransactionAmount: creditauth.MiscAmountsBalances.TransactionAmount is a required field',
        },
      ],
    })
  })

  it('should handle a incorrectMessageType message correctly', async () => {
    expect(await CreditHandler.handle(null, {}, 'incorrectMessageType')).toStrictEqual({
      responseType: 'FailedValidation',
      errors: [
        {
          code: 'General',
          message: 'No Credit request processor for incorrectMessageType',
        },
      ],
    })
  })
})
