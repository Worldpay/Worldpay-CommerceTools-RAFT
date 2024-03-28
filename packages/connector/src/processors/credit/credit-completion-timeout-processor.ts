import { TimedOutMessageProcessor, generateTimedOutMessageProcessor } from '../timed-out-message-processor'
import { AuthorizationType, CreditCompletion, validateCreditCompletion } from '@gradientedge/worldpay-raft-messages'

function transformRequestToReversal(message: CreditCompletion): CreditCompletion {
  return {
    creditcompletion: {
      ...message.creditcompletion,
      AuthorizationType: AuthorizationType.Reversal,
    },
  }
}

export const CreditCompletionTimedOutProcessor: TimedOutMessageProcessor<CreditCompletion> =
  generateTimedOutMessageProcessor<CreditCompletion>(transformRequestToReversal, validateCreditCompletion)
