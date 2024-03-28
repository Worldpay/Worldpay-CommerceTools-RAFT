import { handleRaftRequest } from '../raft-contoller'
import { getMockCommercetoolsPaymentEvent } from '../../__tests__/mocks'
import { CreditHandler } from '../../handlers'
import { mocked } from 'jest-mock'
import log from '@gradientedge/logger'

jest.mock('../../handlers')
jest.mock('@gradientedge/logger')

describe('handleRaftRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should handle a payment event correctly', async () => {
    mocked(CreditHandler.handle).mockResolvedValue({
      responseType: 'UpdateRequest',
    })
    await handleRaftRequest(getMockCommercetoolsPaymentEvent())

    expect(CreditHandler.handle).toHaveBeenCalled()
  })

  it('should return an error if the payload does not contain requestType', async () => {
    const payload = getMockCommercetoolsPaymentEvent()
    delete payload?.resource?.obj?.custom?.fields?.request

    expect(await handleRaftRequest(payload)).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })
  })

  it('should return an empty update request', async () => {
    mocked(log.warn)

    const returnActions = await handleRaftRequest({})

    expect(returnActions).toStrictEqual({
      responseType: 'UpdateRequest',
      actions: [],
    })

    expect(log.warn).toHaveBeenCalled()
  })
})
