export interface WithCardInfoParams {
  PAN?: string
  TRACK_2?: string
  TRACK_1?: string
  ExpirationDate?: string
  CardSequenceNumber?: string
  CreditCardProdType?: string
}

export function withCardInfo(cardInfo: WithCardInfoParams) {
  return {
    CardInfo: {
      ...cardInfo,
    },
  }
}
