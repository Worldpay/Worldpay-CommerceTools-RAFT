import _ from 'lodash'
import { withAccountCodesAndData, withCardInfo, withEncryptionTokenData, withProcFlagsIndicators } from '../../model'
import { CreditAuthParams, creditAuth } from './creditauth'
import { AccountSelected, BooleanString } from '@gradientedge/worldpay-raft-messages'

export interface CreditAuthWithLowValueTokenParams extends CreditAuthParams {
  lowValueToken: string
  partialCompletionExpected: boolean
}

/**
 * Create a creditauth message from the given input parameters
 * @param options The parameters for the creditauth with LowValueToken message
 * @returns The creditauth message
 */
export function creditAuthWithLowValueToken(options: CreditAuthWithLowValueTokenParams) {
  return _.merge(creditAuth(options), {
    creditauth: {
      ...withAccountCodesAndData({ FromAccountSelected: AccountSelected.CreditCard }),
      ...(options.expirationYYMM && withCardInfo({ ExpirationDate: options.expirationYYMM })),
      ...withEncryptionTokenData({ LowValueToken: options.lowValueToken, ReturnTokenizedPan: BooleanString.YES }),
      ...withProcFlagsIndicators({
        CardholderInitiatedTransaction: BooleanString.YES,
        PinlessRequest: BooleanString.YES,
      }),
    },
  })
}
