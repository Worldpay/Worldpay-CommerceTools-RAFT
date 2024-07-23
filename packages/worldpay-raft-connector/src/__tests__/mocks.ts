import { PaymentCreatedMessage, Transaction } from '@commercetools/platform-sdk'
import { BooleanString, GiftCardCompletion } from '@gradientedge/worldpay-raft-messages'

export const getMockConfig = () => ({
  worldpayRaft: {
    license: 'fake-license',
    path: 'fake/path',
    maxRetries: 4,
    reverseMaxRetries: 4,
  },
  commercetools: {
    projectKey: 'mock-key',
    clientId: 'mock-id',
    clientSecret: 'mock-secret',
    region: 'europe-west1.gcp',
    timeoutMs: 2000,
  },
})

export const getMockCommercetoolsPaymentEvent = (): PaymentCreatedMessage =>
  ({
    action: 'Create',
    resource: {
      typeId: 'payment',
      id: 'b37f2f05-3797-4a58-a78e-1ca4b93c4c8d',
      obj: {
        id: 'b37f2f05-3797-4a58-a78e-1ca4b93c4c8d',
        version: 1,
        lastMessageSequenceNumber: 1,
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
              '{"creditauth":{"MiscAmountsBalances":{"TransactionAmount":"10.00"},"CardInfo":{"TRACK_2":"1111222233334444=49121010000012300001","ExpirationDate":"4912"},"ProcFlagsIndicators":{"PartialAllowed":"Y"},"ReferenceTraceNumbers":{"RetrievalREFNumber":"200634200634"},"WorldPayMerchantID":"01234567890123456789","APITransactionID":"2019120412271401","LocalDateTime":"2020-03-17T14:53:54"}}',
          },
        },
        paymentStatus: {},
        transactions: [],
        interfaceInteractions: [],
      },
    },
  }) as unknown as PaymentCreatedMessage

export const getMockCreditAuthRequest = () => ({
  creditauth: {
    MiscAmountsBalances: {
      TransactionAmount: '10.00',
    },
    CardInfo: {
      TRACK_2: '1111222233334444=49121010000012300001',
      ExpirationDate: '4912',
    },
    STPData: {
      STPBankId: '1340',
      STPTerminalId: '001',
    },
    ProcFlagsIndicators: {
      PartialAllowed: 'Y',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
    },
    WorldPayMerchantID: '01234567890123456789',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockCreditAuthCancelRequest = () => ({
  creditauth: {
    AuthorizationType: 'RV',
    EncryptionTokenData: {
      TokenizedPAN: '4111114335161111',
    },
    MiscAmountsBalances: {
      TransactionAmount: '441',
      PreauthorizedAmount: '441',
    },
    CardInfo: {
      TRACK_2: '1111222233334444=49121010000012300001',
      ExpirationDate: '4912',
    },
    ProcFlagsIndicators: {
      PriorAuth: 'Y',
    },
    ReversalAdviceReasonCd: '000',
    STPData: {
      STPBankId: '1340',
      STPTerminalId: '001',
      STPReferenceNUM: '200100016',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
    },
    WorldPayMerchantID: '01234567890123456789',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockCreditCompletionRequest = () => ({
  creditcompletion: {
    MiscAmountsBalances: {
      TransactionAmount: '1.00',
      PreauthorizedAmount: '1.00',
    },
    AccountCodesAndData: {
      FromAccountSelected: 'CC',
    },
    CardInfo: {
      TRACK_2: '1111222233334444=49121010000012300001',
      ExpirationDate: '4912',
    },
    TerminalData: {
      EntryMode: 'SWIPED',
      TerminalType: 'POS',
      TerminalNumber: '090335802001',
    },
    MerchantSpecificData: {
      LaneRegister: '001',
      Division: '0099',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
      AuthorizationNumber: 'A12345',
    },
    WorldPayMerchantID: '01234567890123456789',
    AuthorizationType: 'FP',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockCreditRefundRequest = () => ({
  creditrefund: {
    MiscAmountsBalances: {
      TransactionAmount: '1.00',
    },
    AccountCodesAndData: {
      FromAccountSelected: 'CC',
    },
    CardInfo: {
      TRACK_2: '1111222233334444=49121010000012300001',
      ExpirationDate: '4912',
    },
    TerminalData: {
      EntryMode: 'SWIPED',
      TerminalType: 'POS',
      TerminalNumber: '090335802001',
    },
    MerchantSpecificData: {
      LaneRegister: '001',
      Division: '0099',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
      AuthorizationNumber: 'A12345',
    },
    WorldPayMerchantID: '01234567890123456789',
    AuthorizationType: 'FP',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockPendingTransaction = (): Transaction => ({
  id: 'mock-transaction-id',
  timestamp: '2024-02-01T13:38:04.000Z',
  type: 'Authorization',
  amount: {
    centAmount: 10000,
    currencyCode: 'USD',
    fractionDigits: 2,
    type: 'centPrecision',
  },
  interactionId: '123',
  state: 'Pending',
})

export const getMockGiftCardInquiryRequest = () => ({
  giftcardinquiry: {
    MiscAmountsBalances: {
      TransactionAmount: '0.00',
    },
    CardInfo: {
      PAN: '49121010000012300001',
      ExpirationDate: '2612',
    },
    GiftCardData: {
      GcSecurityCode: '9999',
    },
    STPData: {
      STPBankId: '1340',
      STPTerminalId: '001',
    },
    ProcFlagsIndicators: {
      PartialAllowed: 'Y',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
    },
    WorldPayMerchantID: '01234567890123456789',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockGiftCardPreAuthRequest = () => ({
  giftcardpreauth: {
    MiscAmountsBalances: {
      TransactionAmount: '10.00',
    },
    CardInfo: {
      PAN: '1111222233334444',
      ExpirationDate: '4912',
    },
    STPData: {
      STPBankId: '1340',
      STPTerminalId: '001',
    },
    GiftCardData: {
      GcSecurityCode: '1234',
    },
    ProcFlagsIndicators: {
      PartialAllowed: 'Y',
    },
    WorldPayMerchantID: '01234567890123456789',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockGiftCardCompletionRequest = (): GiftCardCompletion => ({
  giftcardcompletion: {
    MiscAmountsBalances: {
      TransactionAmount: '10.00',
      PreauthorizedAmount: '10.00',
    },
    CardInfo: {
      PAN: '1111222233334444',
      ExpirationDate: '4912',
    },
    STPData: {
      STPBankId: '1340',
      STPTerminalId: '001',
    },
    GiftCardData: {
      GcSecurityCode: '1234',
    },
    ProcFlagsIndicators: {
      PartialAllowed: BooleanString.YES,
    },
    WorldPayMerchantID: '01234567890123456789',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})

export const getMockGiftCardRefundRequest = () => ({
  giftcardrefund: {
    MiscAmountsBalances: {
      TransactionAmount: '1.00',
    },
    AccountCodesAndData: {
      FromAccountSelected: 'GC',
    },
    CardInfo: {
      PAN: '1111222233334444',
      ExpirationDate: '4912',
    },
    GiftCardData: {
      GcSecurityCode: '1234',
    },
    TerminalData: {
      EntryMode: 'SWIPED',
      TerminalType: 'POS',
      TerminalNumber: '090335802001',
    },
    ReferenceTraceNumbers: {
      RetrievalREFNumber: '200634200634',
      AuthorizationNumber: 'A12345',
    },
    WorldPayMerchantID: '01234567890123456789',
    AuthorizationType: 'FP',
    APITransactionID: '2019120412271401',
    LocalDateTime: '2020-03-17T14:53:54',
  },
})
