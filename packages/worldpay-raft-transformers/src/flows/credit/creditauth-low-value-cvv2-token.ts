import _ from 'lodash'
import { withCardInfo, withEncryptionTokenData, withCardVerificationData, withProcFlagsIndicators } from '../../model'
import { CreditAuthParams, creditAuth } from './creditauth'
import { BooleanString, Cvv2Cvc2CIDIndicator } from '@gradientedge/worldpay-raft-messages'

export interface CreditAuthWithLowValueCVV2TokenParams extends CreditAuthParams {
  lowValueCVV2Token: string
  tokenizedPAN: string
  expirationYYMM: string
  partialCompletionExpected: boolean
}

/**
 * Create a creditauth message from the given input parameters.
 *
 * @param options The parameters for the creditauth with LowValueCVV2Token and TokenizedPAN from a tokenized card
 * @returns The creditauth message
 */
export function creditAuthWithLowValueCVV2Token(options: CreditAuthWithLowValueCVV2TokenParams) {
  return _.merge(creditAuth(options), {
    creditauth: {
      ...withEncryptionTokenData({
        LowValueCVV2Token: options.lowValueCVV2Token,
        TokenizedPAN: options.tokenizedPAN,
        ReturnTokenizedPan: BooleanString.YES,
      }),
      ...withCardInfo({ ExpirationDate: options.expirationYYMM }),
      ...withCardVerificationData({ Cvv2Cvc2CIDIndicator: Cvv2Cvc2CIDIndicator.Present }),
      ...withProcFlagsIndicators({
        CardholderInitiatedTransaction: BooleanString.YES,
        PinlessRequest: BooleanString.YES,
      }),
    },
  })
}
