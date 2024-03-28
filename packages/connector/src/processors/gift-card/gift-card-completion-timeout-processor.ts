import { TimedOutMessageProcessor, generateTimedOutMessageProcessor } from '../timed-out-message-processor'
import { AuthorizationType, GiftCardCompletion, validateGiftCardCompletion } from '@gradientedge/worldpay-raft-messages'

function transformRequestToReversal(message: GiftCardCompletion): GiftCardCompletion {
  return {
    giftcardcompletion: {
      ...message.giftcardcompletion,
      AuthorizationType: AuthorizationType.Reversal,
    },
  }
}

export const GiftCardCompletionTimedOutProcessor: TimedOutMessageProcessor<GiftCardCompletion> =
  generateTimedOutMessageProcessor<GiftCardCompletion>(transformRequestToReversal, validateGiftCardCompletion)
