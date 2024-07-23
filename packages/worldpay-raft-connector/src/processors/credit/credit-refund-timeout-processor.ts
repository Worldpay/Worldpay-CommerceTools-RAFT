import { TimedOutMessageProcessor, generateTimedOutMessageProcessor } from '../timed-out-message-processor'
import { AuthorizationType, CreditRefund, validateCreditRefund } from '@gradientedge/worldpay-raft-messages'

function transformRequestToReversal(message: CreditRefund): CreditRefund {
  return {
    creditrefund: {
      ...message.creditrefund,
      AuthorizationType: AuthorizationType.Reversal,
    },
  }
}

export const CreditRefundTimedOutProcessor: TimedOutMessageProcessor<CreditRefund> =
  generateTimedOutMessageProcessor<CreditRefund>(transformRequestToReversal, validateCreditRefund)
