import { Cvv2Cvc2CIDIndicator } from '@gradientedge/worldpay-raft-messages'

export interface CardVerificationDataParams {
  Cvv2Cvc2CIDValue?: string
  Cvv2Cvc2CIDIndicator?: Cvv2Cvc2CIDIndicator
}

export function withCardVerificationData(options: CardVerificationDataParams) {
  return {
    CardVerificationData: {
      ...options,
    },
  }
}
