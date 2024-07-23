import { PaymentExtensionResponse } from '../types'
import { Handler } from './handler'
import {
  GiftCardActivationProcessor,
  Processor,
  NotImplementedYetProcessor,
  GiftCardReloadProcessor,
  GiftCardUnloadProcessor,
  GiftCardCloseProcessor,
  GiftCardPurchaseProcessor,
  GiftCardPreAuthProcessor,
  GiftCardRefundProcessor,
  GiftCardCompletionProcessor,
  GiftCardMiniStatementProcessor,
  GiftCardInquiryProcessor,
  GiftCardTransferProcessor,
  GiftCardVirtualCardProcessor,
  GiftCardStatusCardProcessor,
} from '../processors'
import { buildGeneralError, buildErrors } from '../commercetools'
import log from '@gradientedge/logger'
import { Payment } from '@commercetools/platform-sdk'

/**
 * The processors that are supported by this handler.
 * They are API endpoints of the RAFT Gift Card API, but not all endpoints are supported.
 */
const PROCESSORS: Record<string, Processor> = {
  giftcardactiviation: GiftCardActivationProcessor,
  giftcardreload: GiftCardReloadProcessor,
  giftcardunload: GiftCardUnloadProcessor,
  giftcardclose: GiftCardCloseProcessor,
  giftcardpurchase: GiftCardPurchaseProcessor,
  giftcardrefund: GiftCardRefundProcessor,
  giftcardpreauth: GiftCardPreAuthProcessor,
  giftcardcompletion: GiftCardCompletionProcessor,
  giftcardministatement: GiftCardMiniStatementProcessor,
  giftcardinquiry: GiftCardInquiryProcessor,
  giftcardtransfer: GiftCardTransferProcessor,
  giftcardvirtualcard: GiftCardVirtualCardProcessor,
  giftcardstatuscard: GiftCardStatusCardProcessor,
  giftcardmassactivation: NotImplementedYetProcessor('/giftcard/massactivation'),
  giftcardmassreload: NotImplementedYetProcessor('/giftcard/massreload'),
  giftcardmassunload: NotImplementedYetProcessor('/giftcard/massunload'),
  giftcardmassclose: NotImplementedYetProcessor('/giftcard/massclose'),
  giftcardmassinquiry: NotImplementedYetProcessor('/giftcard/massinquiry'),
}

/**
 * The GiftCardHandler definitions, which handles all giftcardj* endpoints
 */
export const GiftCardHandler: Handler = {
  handle: (paymentObject: any, message: any, requestType: string) =>
    handleGiftCard(paymentObject, message, requestType),
}

/**
 * Handle a gift card request message, by passing it on to the appropriate processor
 * @param payment The payment object from commercetools
 * @param message The message to RAFT as parsed from the payment object's custom property
 * @param requestType The request type, i.e. giftcardpreauth
 * @returns A commercetools response with updates to the payment object (or error)
 */
async function handleGiftCard(payment: Payment, message: any, requestType: string): Promise<PaymentExtensionResponse> {
  const processor = PROCESSORS[requestType]
  if (processor === undefined || processor === null) {
    log.debug(`Gift Card handler found no processor for [${requestType}]`)
    return buildGeneralError(
      processor === null
        ? `Not implemented yet processor ${requestType}`
        : `No Gift Card request processor for ${requestType}`,
    )
  }

  log.debug(`Gift Card handler processing [${requestType}]`)
  // Validate the RAFT message before sending it to RAFT
  const validationErrors = processor.validate(message)
  if (validationErrors.length > 0) {
    log.error('Failed validation of RAFT request message', { validationErrors })
    return buildErrors(
      validationErrors.map((message) => ({
        code: 'InvalidInput',
        message,
      })),
    )
  }

  // Send the message to RAFT, process the response. Return the generated update actions or error.
  const transaction = payment?.transactions?.find((t) => t.state === 'Pending')
  return await processor.handleMessage(transaction, message)
}
