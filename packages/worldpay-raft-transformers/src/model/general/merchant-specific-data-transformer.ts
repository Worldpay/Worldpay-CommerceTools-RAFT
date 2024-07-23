export interface MerchantSpecificDataParams {
  MerchantCategoryCode?: string
  LaneRegister?: string
  Division?: string
  AcquirerCountryCode?: string
  MerchantSellerEmail?: string
  MerchantSellerPhone?: string
  AcquirerCurrencyCode?: string
  CardAcceptorNameLocation?: string
  CardAcceptorCity?: string
  CardAcceptorState?: string
  CardAcceptorZipCode?: string
  SoftPosId?: string
}

export function withMerchantSpecificData(options: MerchantSpecificDataParams) {
  return {
    MerchantSpecificData: {
      ...options,
    },
  }
}
