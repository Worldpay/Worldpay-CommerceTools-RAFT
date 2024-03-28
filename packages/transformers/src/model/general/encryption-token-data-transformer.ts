import { BooleanString } from '@gradientedge/worldpay-raft-messages'

export interface WithEncryptionTokenDataParams {
  P2PEncryptedTRACK_1?: string
  P2PEncryptedTRACK_2?: string
  P2PKeySequenceNumber?: string
  P2PEncryptedPAN?: string
  P2PEncryptedCVV2?: string
  P2PEncryptedEXPDate?: string
  P2PEncryptedPANExt?: string
  P2PEncryptedTRKExt?: string
  LowValueCVV2Token?: string
  P2PEncryptionMethod?: string
  P2PKeyData?: string
  TokenizationMethod?: string
  TokenDateTime?: string
  TokenizedPAN?: string
  TokenID?: string
  LowValueToken?: string
  WPTokenRequested?: BooleanString
  NTWKTokenRequest?: BooleanString
  ReturnClearPan?: BooleanString
  ReturnMaskedPan?: BooleanString
  ReturnPanLast4?: BooleanString
  ReturnTokenizedPan?: BooleanString
  CallIdToken?: string
  ReturnEmbeddedTMSData?: BooleanString
  BypassEmbeddedNetworkToken?: BooleanString
}

export function withEncryptionTokenData(options: WithEncryptionTokenDataParams) {
  return {
    EncryptionTokenData: {
      ...options,
    },
  }
}
