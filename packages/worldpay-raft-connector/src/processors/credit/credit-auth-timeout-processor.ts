import { TimedOutMessageProcessor, generateTimedOutMessageProcessor } from '../timed-out-message-processor'
import { RevertFunction } from '../timed-out-message-processor'
import { AuthorizationType, CreditAuth, validateCreditAuth } from '@gradientedge/worldpay-raft-messages'

const transformRequestToReversal: RevertFunction<CreditAuth> = (message: CreditAuth): CreditAuth => {
  return {
    creditauth: {
      ...message.creditauth,
      AuthorizationType: AuthorizationType.Reversal,
    },
  }
}

export const CreditAuthTimedOutProcessor: TimedOutMessageProcessor<CreditAuth> =
  generateTimedOutMessageProcessor<CreditAuth>(transformRequestToReversal, validateCreditAuth)
