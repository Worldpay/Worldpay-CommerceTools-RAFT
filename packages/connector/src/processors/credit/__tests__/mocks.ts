import { Status } from '@reflet/http'
import { AxiosResponse } from 'axios'
import { ReturnCode } from '@gradientedge/worldpay-raft-messages'
import { Payment } from '@commercetools/platform-sdk'

export const getMockCreditAuthSuccess = () => ({
  creditauthresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    CardInfo: {
      CardProductCode: '001',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '934311091236',
      NetworkRefNumber: '934311091236',
      AuthorizationNumber: '904328',
    },
    EncryptionTokenData: {
      TokenizedPAN: '4111114335161111',
    },
    SettlementData: {
      SettlementDate: '20191210',
      SettlementNetwork: 'NTWK',
      RegulationIndicator: '0',
    },
    WorldPayRoutingData: {
      NetworkId: 'DISC',
    },
    STPData: {
      STPReferenceNUM: '23456746768',
    },
    APITransactionID: '2019120412271401',
    ResponseCode: '000',
    AuthorizationSource: '5',
  },
})

export const getMockAxiosCreditAuthSuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockCreditAuthSuccess(),
  headers: {},
  config: undefined,
})

export const getMockCreditAuthError = () => {
  const creditAuthError = { ...getMockCreditAuthSuccess() }
  creditAuthError.creditauthresponse.ReturnCode = ReturnCode.LogicError
  creditAuthError.creditauthresponse.STPData.STPReferenceNUM = undefined
  creditAuthError.creditauthresponse.STPData = undefined
  return creditAuthError
}

export const getMockAxiosCreditAuthError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: { ...getMockCreditAuthError() },
  headers: {},
  config: undefined,
})

export const getMockCreditCompletionSuccess = () => ({
  creditcompletionresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    MiscAmountsBalances: {
      AvailableBALFromAcct: '2008.53',
    },
    CardInfo: {
      CardProductCode: 'A C',
    },
    STPData: {
      STPReferenceNUM: '200100030',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
      NetworkRefNumber: '200634200634',
      AuthorizationNumber: 'A12345',
    },
    SettlementData: {
      SettlementDate: '20191210',
      SettlementNetwork: 'NTWK',
      RegulationIndicator: '0',
    },
    WorldPayRoutingData: {
      NetworkId: 'BASE',
    },
    APITransactionID: '2019120913221401',
    ResponseCode: '000',
    AuthorizationSource: '5',
  },
})

export const getMockAxiosCreditCompletionSuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockCreditCompletionSuccess(),
  headers: {},
  config: undefined,
})

export const getMockCreditCompletionError = () => {
  const creditAuthError = getMockCreditCompletionSuccess()
  creditAuthError.creditcompletionresponse.ReturnCode = ReturnCode.LogicError
  return creditAuthError
}

export const getMockAxiosCreditCompletionError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockCreditCompletionError(),
  headers: {},
  config: undefined,
})

export const getMockCreditRefundSuccess = () => ({
  creditrefundresponse: {
    ReturnCode: '0000',
    ReasonCode: '0000',
    CardInfo: {
      CardProductCode: '001',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '934311091236',
      NetworkRefNumber: '934311091236',
      AuthorizationNumber: '904328',
    },
    EncryptionTokenData: {
      TokenizedPAN: '4111114335161111',
    },
    SettlementData: {
      SettlementDate: '20191210',
      SettlementNetwork: 'NTWK',
      RegulationIndicator: '0',
    },
    WorldPayRoutingData: {
      NetworkId: 'DISC',
    },
    STPData: {
      STPReferenceNUM: '123424232',
    },
    APITransactionID: '2019120412271401',
    ResponseCode: '000',
    AuthorizationSource: '5',
  },
})

export const getMockAxiosCreditRefundSuccess = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockCreditRefundSuccess(),
  headers: {},
  config: undefined,
})

export const getMockCreditRefundError = () => {
  const creditAuthError = getMockCreditRefundSuccess()
  creditAuthError.creditrefundresponse.ReturnCode = ReturnCode.LogicError
  return creditAuthError
}

export const getMockAxiosCreditRefundError = (): AxiosResponse => ({
  status: Status.Ok,
  statusText: 'Success',
  data: getMockCreditRefundError(),
  headers: {},
  config: undefined,
})

export const getMockPendingPayment = (): Payment => ({
  id: 'b37f2f05-3797-4a58-a78e-1ca4b93c4c8d',
  version: 1,
  createdAt: '1970-01-01T00:00:00.000Z',
  lastModifiedAt: '1970-01-01T00:00:00.000Z',
  lastModifiedBy: {
    customer: {
      typeId: 'customer',
      id: '883c633a-576b-4798-b249-4e9823ba8610',
    },
  },
  createdBy: {
    customer: {
      typeId: 'customer',
      id: '883c633a-576b-4798-b249-4e9823ba8610',
    },
  },
  customer: {
    typeId: 'customer',
    id: '883c633a-576b-4798-b249-4e9823ba8610',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'GBP',
    centAmount: 7300,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'ctp-worldpay-raft-integration',
    method: 'card',
  },
  custom: {
    type: {
      typeId: 'type',
      id: '472d9208-1eaa-4af6-bfbf-a42ec769753e',
    },
    fields: {
      cartId: '954b3f20-4753-48c5-8d9d-c1731dbcf832',
      request:
        '{"creditauth":{"MiscAmountsBalances":{"TransactionAmount":"10.00"},"CardInfo":{"TRACK_2":"1111222233334444=49121010000012300001","ExpirationDate":"4912"},"ProcFlagsIndicators":{"PartialAllowed":"Y"},"ReferenceTraceNumbers":{"RetrievalREFNumber":"200634200634"},"WorldPayMerchantID":"4445012345678","AuthorizationType":"FP","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'mock-transaction-1',
      amount: {
        centAmount: 2000,
        fractionDigits: 2,
        currencyCode: 'USD',
        type: 'centPrecision',
      },
      state: 'Pending',
      type: 'Authorization',
      custom: {
        type: {
          typeId: 'type',
          id: '2a7d71ec-76d8-41aa-b3b3-590ed07129da',
        },
        fields: {
          retryCount: undefined,
        },
      },
    },
  ],
  interfaceInteractions: [],
})
