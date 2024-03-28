import { TimedOutMessageProcessor, generateTimedOutMessageProcessor } from '../timed-out-message-processor'
import { AuthorizationType, GiftCardPreAuth, validateGiftCardPreAuth } from '@gradientedge/worldpay-raft-messages'

function transformRequestToReversal(message: GiftCardPreAuth): GiftCardPreAuth {
  return {
    giftcardpreauth: {
      ...message.giftcardpreauth,
      AuthorizationType: AuthorizationType.Reversal,
    },
  }
}

export const GiftCardPreAuthTimedOutProcessor: TimedOutMessageProcessor<GiftCardPreAuth> =
  generateTimedOutMessageProcessor(transformRequestToReversal, validateGiftCardPreAuth)
