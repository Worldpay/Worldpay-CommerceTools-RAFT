import { BooleanString, ECommerceIndicator } from '@gradientedge/worldpay-raft-messages'

export interface EcommerceDataParams {
  'E-commerceIndicator': ECommerceIndicator
  '3dSecureData'?: string
  'E-commerceOrderNum'?: string
  'E-commerceIPAddress'?: string
  LoginStatus?: string
  ItemDepartment?: string
  OriginalChainID?: string
  'ReturnE-commerceIndicator'?: string
  ReturnUCAFIndicator?: BooleanString
  ReturnEcommerceSecurityLevelIndicator?: BooleanString
  ReturnUCAFAAVData?: string
  '3DSecureProgramProtocol'?: string
  '3DSecureDirectoryServerTransactionID'?: string
}

export function withECommerceData(options: EcommerceDataParams) {
  return {
    'E-commerceData': {
      ...options,
    },
  }
}
