import { Status } from '@reflet/http'
import { AxiosResponse } from 'axios'
import { ReturnCode } from '@gradientedge/worldpay-raft-messages'

export const getMockGiftCardInquirySuccess = () => ({
  giftcardinquiryresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    MiscAmountsBalances: {
      AvailableBALFromAcct: '2.00',
      LedgerBalanceFromAcct: '0.00',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
      AuthorizationNumber: '001004',
    },
    SettlementData: {
      SettlementDate: '20190820',
      SettlementNetwork: 'NTWK',
      RegulationIndicator: '0',
    },
    WorldPayRoutingData: {
      NetworkId: 'GIFT',
    },
    APITransactionID: '2019120412271401',
    ResponseCode: '000',
  },
})

export const getMockAxiosGiftCardInquirySuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardInquirySuccess(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardInquiryError = () => {
  const giftCardInquiryError = getMockGiftCardInquirySuccess()
  giftCardInquiryError.giftcardinquiryresponse.ReturnCode = ReturnCode.LogicError
  return giftCardInquiryError
}

export const getMockAxiosGiftCardInquiryError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardInquiryError(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardPreAuthSuccess = () => ({
  giftcardpreauthresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    MiscAmountsBalances: { OriginalAuthAmount: '0.65', AvailableBALFromAcct: '0.30' },
    STPData: { STPReferenceNUM: '200100024' },
    ReferenceTraceNumbers: { DraftLocator: '00200100024', SystemTraceNumber: '279882', AuthorizationNumber: 'DEMO19' },
    SettlementData: { SettlementDate: '20240229', SettlementNetwork: 'ISVP', RegulationIndicator: '0' },
    WorldPayRoutingData: { NetworkId: 'GIFT' },
    APITransactionID: 'vBLaArrWtTgxpdSm',
    ResponseCode: '000',
    AuthorizationSource: '5',
  },
})

export const getMockAxiosGiftCardPreAuthSuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardPreAuthSuccess(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardPreAuthError = () => {
  const giftCardPreAuthError = getMockGiftCardPreAuthSuccess()
  giftCardPreAuthError.giftcardpreauthresponse.ReturnCode = ReturnCode.LogicError
  return giftCardPreAuthError
}

export const getMockAxiosGiftCardPreAuthError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardPreAuthError(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardCompletionSuccess = () => ({
  giftcardcompletionresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    MiscAmountsBalances: { OriginalAuthAmount: '0.65', AvailableBALFromAcct: '0.30' },
    STPData: { STPReferenceNUM: '200100024' },
    ReferenceTraceNumbers: { DraftLocator: '00200100024', SystemTraceNumber: '279882', AuthorizationNumber: 'DEMO19' },
    SettlementData: { SettlementDate: '20240229', SettlementNetwork: 'ISVP', RegulationIndicator: '0' },
    WorldPayRoutingData: { NetworkId: 'GIFT' },
    APITransactionID: 'vBLaArrWtTgxpdSm',
    ResponseCode: '000',
    AuthorizationSource: '5',
  },
})

export const getMockAxiosGiftCardCompletionSuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardCompletionSuccess(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardCompletionError = () => {
  const giftCardCompletionError = getMockGiftCardCompletionSuccess()
  giftCardCompletionError.giftcardcompletionresponse.ReturnCode = ReturnCode.LogicError
  return giftCardCompletionError
}

export const getMockAxiosGiftCardCompletionError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardCompletionError(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardRefundSuccess = () => ({
  giftcardrefundresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    MiscAmountsBalances: { OriginalAuthAmount: '0.65', AvailableBALFromAcct: '0.30' },
    STPData: { STPReferenceNUM: '200100024' },
    ReferenceTraceNumbers: { DraftLocator: '00200100024', SystemTraceNumber: '279882', AuthorizationNumber: 'DEMO19' },
    SettlementData: { SettlementDate: '20240229', SettlementNetwork: 'ISVP', RegulationIndicator: '0' },
    WorldPayRoutingData: { NetworkId: 'GIFT' },
    APITransactionID: 'vBLaArrWtTgxpdSm',
    ResponseCode: '000',
    AuthorizationSource: '5',
  },
})

export const getMockAxiosGiftCardRefundSuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardRefundSuccess(),
  headers: {},
  config: undefined,
})

export const getMockGiftCardRefundError = () => {
  const giftCardRefundError = getMockGiftCardRefundSuccess()
  giftCardRefundError.giftcardrefundresponse.ReturnCode = ReturnCode.LogicError
  return giftCardRefundError
}

export const getMockAxiosGiftCardRefundError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockGiftCardRefundError(),
  headers: {},
  config: undefined,
})
