import _ from 'lodash'
import {
  withCardInfo,
  withCardVerificationData,
  withECommerceData,
  withEncryptionTokenData,
  withProcFlagsIndicators,
  withReferenceTraceNumbers,
  withTerminalData,
} from '../../model'
import { CreditAuthParams, creditAuth } from './creditauth'
import {
  BooleanString,
  Cvv2Cvc2CIDIndicator,
  ECommerceIndicator,
  EntryMode,
  POSConditionCode,
  TerminalEntryCap,
} from '@gradientedge/worldpay-raft-messages'

export interface creditAuthWithPAN_NOT_PCI_COMPLIANT_Params extends CreditAuthParams {
  pan: string
  ccv?: string
  avsOnly?: boolean
  authorizationNumber?: string
}

/**
 * Create a creditauth message from the given input parameters
 * @param options The parameters for the creditauth with LowValueToken message
 * @returns The creditauth message
 */
export function creditAuthWithPAN_NOT_PCI_COMPLIANT(options: creditAuthWithPAN_NOT_PCI_COMPLIANT_Params) {
  const date = new Date()
  date.setDate(new Date().getDate() + 365)

  return _.merge(creditAuth(options), {
    creditauth: {
      ...withCardInfo({
        PAN: options.pan,
        ExpirationDate:
          (date.getUTCFullYear() % 100).toString().padStart(2, '0') +
          (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      }),
      ...withECommerceData({ 'E-commerceIndicator': ECommerceIndicator.ECommerceUnverified }),
      ...withTerminalData({
        EntryMode: EntryMode.KEYED,
        POSConditionCode:
          options.avsOnly === true
            ? POSConditionCode.VERIFICATION_ONLY_REQUEST
            : POSConditionCode.ELECTRONIC_COMMERCE_TRANSACTION,
        TerminalEntryCap: TerminalEntryCap.NotCapableOfReadingCardData,
      }),
      ...withEncryptionTokenData({ ReturnTokenizedPan: BooleanString.YES }),
      ...(options.authorizationNumber &&
        withReferenceTraceNumbers({ AuthorizationNumber: options.authorizationNumber })),
      ...(options.ccv &&
        withCardVerificationData({
          Cvv2Cvc2CIDValue: options.ccv,
          Cvv2Cvc2CIDIndicator: Cvv2Cvc2CIDIndicator.Present,
        })),
      ...withProcFlagsIndicators({ CardholderInitiatedTransaction: BooleanString.YES }),
    },
  })
}
