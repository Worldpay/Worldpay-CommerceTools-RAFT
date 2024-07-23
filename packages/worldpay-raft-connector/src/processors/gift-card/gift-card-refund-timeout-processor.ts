import { TimedOutMessageProcessor, generateTimedOutMessageProcessor } from '../timed-out-message-processor'
import { AuthorizationType, GiftCardRefund, validateGiftCardRefund } from '@gradientedge/worldpay-raft-messages'

function transformRequestToReversal(message: GiftCardRefund): GiftCardRefund {
  return {
    giftcardrefund: {
      ...message.giftcardrefund,
      AuthorizationType: AuthorizationType.Reversal,
    },
  }
}

export const GiftCardCompletionTimedOutProcessor: TimedOutMessageProcessor<GiftCardRefund> =
  generateTimedOutMessageProcessor(transformRequestToReversal, validateGiftCardRefund)
