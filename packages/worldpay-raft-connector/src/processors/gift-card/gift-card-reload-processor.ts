import { GiftCardReload, validateGiftCardReload } from '@gradientedge/worldpay-raft-messages'
import { Processor } from '../processor'
import { PaymentExtensionResponse } from '../../types'
import log from '@gradientedge/logger'
import { sendRaftMessage } from '../../raft-connector'
import { buildGeneralError, buildSuccess } from '../../commercetools'
import { Transaction } from '@commercetools/platform-sdk'

const ENDPOINT = '/giftcard/reload'

export const GiftCardReloadProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: any): string[] {
  try {
    validateGiftCardReload(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

async function handleMessage(
  _transaction: Transaction | undefined,
  message: GiftCardReload,
): Promise<PaymentExtensionResponse> {
  log.debug(`Handle message for giftcardreload with APITransactionID=${message?.giftcardreload?.APITransactionID}`)
  try {
    const result = await sendRaftMessage(ENDPOINT, message)
    const actions = processRaftResponse(message, result)
    return buildSuccess(actions)
  } catch (err) {
    log.error(`Failed request to ${ENDPOINT}`, err)
    return buildGeneralError(`Failed request to ${ENDPOINT}: ${JSON.stringify(err)}`)
  }
}

function processRaftResponse(_message: any, _result: any) {
  return []
}
