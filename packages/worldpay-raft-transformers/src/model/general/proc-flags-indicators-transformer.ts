import { BooleanString, SalesTaxIndicator } from '@gradientedge/worldpay-raft-messages'

export interface ProcFlagsIndicatorType {
  PinlessRequest?: BooleanString
  PartialAllowed?: BooleanString
  MerchantStandin?: BooleanString
  RecurringBillPay?: BooleanString
  PaymentExistingDebt?: BooleanString
  PANMappingRequest?: BooleanString
  SignatureCapture?: BooleanString
  HostCaptureAdvice?: BooleanString
  SalesTaxIndicator?: SalesTaxIndicator
  EMDSettlement?: BooleanString
  SplitShipment?: BooleanString
  IncrementalAuth?: BooleanString
  PriorAuth?: BooleanString
  AccountUpdaterRequest?: BooleanString
  AccountUpdaterTokenRequest?: 'T'
  ReauthShipment?: BooleanString
  MerchantFraudRiskData?: BooleanString
  BenefitCardServicesRequest?: BooleanString
  RawNetworkDataRequest?: BooleanString
  ExtendedNetworkRoutingDataRequest?: BooleanString
  DigitalSecureRemotePaymentIndicator?: BooleanString
  MastercardAdviceCodeIndicator?: BooleanString
  InitialApplyAndBuy?: BooleanString
  ForeignPartialAllowed?: BooleanString
  ReturnPanReferenceId?: BooleanString
  CardholderInitiatedTransaction?: BooleanString
  MerchantInitiatedTransaction?: BooleanString
  DeferredBillingIndicator?: BooleanString
  PinlessConversionRequestOnly?: BooleanString
  SoftPosDeviceType?: '1'
}

export function withProcFlagsIndicators(options: ProcFlagsIndicatorType) {
  return {
    ProcFlagsIndicators: {
      ...options,
    },
  }
}
