import { PaymentUpdateAction } from '@commercetools/platform-sdk'
import { SystemHealthcheck, validateSystemHealthcheck } from '@gradientedge/worldpay-raft-messages'
import { PaymentExtensionResponse } from '../../types'
import { Processor } from '../processor'
import { sendRaftMessage } from '../../raft-connector'
import {
  buildClearRequestAction,
  buildGeneralError,
  buildInterfaceInteraction,
  buildSuccess,
} from '../../commercetools'
import { AxiosResponse } from 'axios'
import log from '@gradientedge/logger'

const ENDPOINT = '/system/healthcheck'

export const SystemHealthcheckProcessor: Processor = {
  endpoint: ENDPOINT,
  handleMessage: handleMessage,
  validate: validate,
}

function validate(message: unknown): string[] {
  try {
    validateSystemHealthcheck(message)
  } catch (err) {
    return err.inner.map((error: { path: string; errors: string[] }) => `${error.path}: ${error.errors.join()}`)
  }
  return []
}

async function handleMessage(message: any): Promise<PaymentExtensionResponse> {
  log.debug('Handle message for system health check', message)

  try {
    const result = await sendRaftMessage(ENDPOINT, message)
    const actions = processRaftResponse(message, result)
    return buildSuccess(actions)
  } catch (err) {
    log.error(`Failed request to ${ENDPOINT}`, err)
    return buildGeneralError(`Failed request to ${ENDPOINT}: ${JSON.stringify(err)}`)
  }
}

function processRaftResponse(message: SystemHealthcheck, result: AxiosResponse): PaymentUpdateAction[] {
  const actions: PaymentUpdateAction[] = []
  actions.push(buildClearRequestAction())
  if (result) {
    actions.push(buildInterfaceInteraction(message, result?.data))
  }

  return actions
}
