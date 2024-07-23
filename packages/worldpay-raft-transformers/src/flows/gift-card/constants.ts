import { CentPrecisionMoney } from '@commercetools/platform-sdk'

export const RAFT_TEST_GIFT_CARD = '5858836401000004'
export const RAFT_TEST_CARD_SECURITY_CODE = '9999'

export const RAFT_TEST_GIFT_CARD_PRE_AUTH_AMOUNT: CentPrecisionMoney = {
  centAmount: 65,
  currencyCode: 'USD',
  fractionDigits: 2,
  type: 'centPrecision',
}

export const RAFT_TEST_GIFT_CARD_COMPLETION_AMOUNT: CentPrecisionMoney = {
  centAmount: 55,
  currencyCode: 'USD',
  fractionDigits: 2,
  type: 'centPrecision',
}

export const RAFT_TEST_GIFT_CARD_REFUND_AMOUNT: CentPrecisionMoney = {
  centAmount: 5,
  currencyCode: 'USD',
  fractionDigits: 2,
  type: 'centPrecision',
}
