import _ from 'lodash'
import { CreditCompletion } from '@gradientedge/worldpay-raft-messages'
import { CreditCompletionParams, creditCompletion } from './creditcompletion'
import { withCardInfo } from '../../model'

export interface CreditCompletionWithPANParams extends CreditCompletionParams {
  pan: string
}

/**
 * Create a creditcompletion message from the given input parameters
 * @param options - The entities required to build the message
 * @returns The creditcompletion message
 */
export function creditCompletionWithPAN_NOT_PCI_COMPLIANT(options: CreditCompletionWithPANParams): CreditCompletion {
  return _.merge(creditCompletion(options), {
    creditcompletion: {
      ...withCardInfo({ PAN: options.pan }),
    },
  })
}
