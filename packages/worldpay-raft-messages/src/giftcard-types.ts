import * as yup from 'yup'
import {
  AccountCodesAndData,
  AccountCodesAndDataSchema,
  AdditionalFraudDataSchema,
  AdditionalFraudData_Resp,
  AdditionalPOSDataSchema,
  AddressVerificationData_Resp,
  AmountString,
  AmountStringType,
  AuthorizationTypeSchema,
  BooleanString,
  CardInfoSchema,
  CardVerificationDataSchema,
  CardVerificationData_Resp,
  CustomerInformation_Resp,
  DeviceInformationSchema,
  DynamicCurrConvInfoSchema,
  ECommerceDataSchema,
  ECommerceData_Resp,
  EMVData_Resp,
  EncryptionTokenDataSchema,
  EncryptionTokenData_Resp,
  ErrorInformation_Resp,
  FisLoyaltyDataSchema,
  FisLoyaltyData_Resp,
  GatewayRoutingIdSchema,
  MerchantSpecificDataSchema,
  OnlineBillToAddressSchema,
  OnlineOrderCustomerDataSchema,
  OnlineShipToAddressSchema,
  ProcFlagsIndicatorsSchema,
  ProcFlagsIndicators_Resp,
  RawNetworkData_Resp,
  ReferenceTraceNumbersSchema,
  ReferenceTraceNumbers_Resp,
  RegulationIndicator,
  ResponseCode,
  ReturnCode,
  STPDataSchema,
  STPData_Resp,
  TerminalDataSchema,
  UserDefinedData,
  UserDefinedDataSchema,
  WorldPayRoutingData_Resp,
} from './common-types'

// Gift card related message types, see https://developerengine.fisglobal.com/apis/native-raft/giftcard/api-specification#tag/Giftcard/operation/GiftcardRefund
// These types allow validation of the messages before sending them to RAFT, and simplify the access to the response properties.

const MiscAmountsBalancesGiftCardSchema = yup.object({
  TransactionAmount: AmountString.optional(),
  DispensedAmount: AmountString.optional(),
})

const MiscAmountsBalancesGiftCardWithTIPSchema = yup.object({
  TransactionAmount: AmountString.optional(),
  TIPAmount: AmountString.optional(),
  DispensedAmount: AmountString.optional(),
})

const MiscAmountsBalancesGiftCardCompletionSchema = yup.object({
  TransactionAmount: AmountString.optional(),
  DispensedAmount: AmountString.optional(),
  PreauthorizedAmount: AmountString.required(),
})

const GiftCardDataSchema = yup.object({
  GcSecurityCode: yup.string().max(12).required(), //This field authenticates the plastic used in the transaction. Similar to the CVV2 value, Worldpay denies the transaction if you use an invalid code. Additionally, three failed Security Code attempts place a lock on the card. You can only remove it with a successful transaction where the security code is not present and is not required. If the code is present, whether it is required or not, Worldpay validates it.
  // While setting up a new gift card program, the issuer must specify the security code length (4-12 digits) and conditions where the security code is required.
})

const GiftCardDataTransferSchema = yup.object({
  GcSecurityCode: yup.string().max(12).required(), //This field authenticates the plastic used in the transaction. Similar to the CVV2 value, Worldpay denies the transaction if you use an invalid code. Additionally, three failed Security Code attempts place a lock on the card. You can only remove it with a successful transaction where the security code is not present and is not required. If the code is present, whether it is required or not, Worldpay validates it.
  // While setting up a new gift card program, the issuer must specify the security code length (4-12 digits) and conditions where the security code is required.
  GiftCardALTPAN1: yup.string().max(20).default(undefined).optional(), // (GiftCardALTPAN1_Type) <= 20 characters Alternate Gift Card Primary Account Number 1.
  // - For mass transactions, this is the ending account number.
  // - For gift card transfers, this is the first account to transfer to.
  GiftCardALTPAN2: yup.string().max(20).default(undefined).optional(), // (GiftCardALTPAN2_Type) <= 20 characters Alternate Gift Card Primary Account Number 2. For gift card transfers, this is the second account to transfer to.
  GiftCardALTPAN3: yup.string().max(20).default(undefined).optional(), // (GiftCardALTPAN3_Type) <= 20 characters For gift card transfers, this is the third account to transfer to.
})

export enum ReversalAdviceReasonCdGiftCard {
  Normal = '000', // Normal Reversal
  Timeout = '002', // Timeout Reversal
  Syntax = '003', // Syntax
  ClerkCancel = '005', // Clerk Cancel
  CustomerCancel = '006', // Customer Cancel
  PreviouslyAuthorized = '010', // Previously Authorized
}

const ReversalAdviceReasonCdGiftCardSchema = yup
  .mixed<ReversalAdviceReasonCdGiftCard>()
  .oneOf(Object.values(ReversalAdviceReasonCdGiftCard))

export enum ForeignGiftCardTransactionTypeDesc {
  FastPINRequest = '001', // FASTPIN REQUEST
  SaleActiveRequest = '002', // SALEACTIVE REQUEST
  SaleInactiveRequest = '003', // SALEINACTIVE REQUEST
  UnlockLockDevice = '004', // UNLOCK/LOCK DEVICE
  Recharge = '005', // RECHARGE
  CreditInquiry = '006', // CREDIT INQUIRY}
}

export const ForeignGiftCardTransactionTypeDescSchema = yup
  .mixed<ForeignGiftCardTransactionTypeDesc>()
  .oneOf(Object.values(ForeignGiftCardTransactionTypeDesc))

const ForeignGiftCardDataSchema = yup.object({
  TransactionTypeDesc: ForeignGiftCardTransactionTypeDescSchema.default(undefined).optional(), // Incomm extended transaction code.
  TermsAndCondVersion: yup.string().max(2).default(undefined).optional(), // This field contains the Terms and Conditions Version number in the request data for InComm foreign Gift Card messages
  IncommPreauthActivation: yup.string().max(1).default(undefined).optional(), // Designates an Incomm activation as a preauth only.
})

export interface MiscAmountsBalancesGiftCard_Resp {
  AvailableBALFromAcct: AmountStringType // Available Balance: From Account
  LedgerBalanceFromAcct: AmountStringType // Ledger Balance: From Account
  OriginalAuthAmount: AmountStringType // Input Uses:
  // - For Fleet credit card completions, the acquirer passes in the originally authorized amount from the preauth.
  // - For POS debit purchases, this field contains the partially authorized amount.
  // Output Uses:
  // - For partial approvals, Worldpay will return the portion of the Transaction Amount that the issuer authorized the transaction for.
  // - For reversals, Worldpay can return the amount of the transaction that is settled in this field.
  // - For gift cards, Worldpay can return the authorized amount in this field.
  // - For transactions where gift card currency conversion has been applied, Worldpay will return the authorized amount from the database in this field.
}

export interface CardInfoGiftCard_Resp {
  PIDNConvertedPAN: string //  <= 20 characters Worldpay only populates this field if the POS device can receive the information. The PIDN (Premier Issue Dual Number) converted account number defines the account number held on the Vantiv database and is printed on the face of the gift card.
}

export interface GiftCardData_Resp {
  CurrencyCodeOnCard: string // <= 3 characters, If a gift card currency conversion was applied, this is the currency code of the card on the database.
  ConvertedDispensedAMT: string // <= 13 characters, If a gift card currency conversion was applied, this is the converted settlement amount charged to the customer.
}

export interface DynamicCurrConvInfoGiftCard_Resp {
  GiftCardCurrencyConv: BooleanString // Y/N flag indicating whether the gift card transaction was converted to the cardholder's currency.
  DCCConvertedAmount: string // <= 13 characters, Amount converted to the cardholder's currency (DCC processing)
  DCCAuthorizedAmount: string // <= 13 characters, Authorized amount in cardholder's currency (DCC processing)
  DCCConversionRate: string // <= 8 characters, Rate used to convert the currency.
  DCCCurrencyCode: string // <= 3 characters, Currency code of the cardholder.
  DCCSettlementAmount: string // <= 13 characters, Requested amount in cardholder's currency (DCC processing)
}

export interface SettlementDataGiftCard_Resp {
  FeeProgramIndicator: string // <= 3 characters, Data by the network to indicate the billing fee program assigned to the transaction.
  RegulationIndicator?: RegulationIndicator // <= 1 characters, This field contains data that indicates the regulation category in which the issuer's BIN participates.
  RegulationData: string // <= 10 characters, Data returned by the network to indicate the BIN regulation data applied to the transaction.
  SettlementNetwork?: string // <= 4 characters, The acquirer settlement entity that Worldpay logs for settlement purposes.
  SettlementDate?: string // <= 8 characters, The current date (YYYYMMDD format) for settlement of the transaction.
}

export interface ForeignGiftCardData_Resp {
  TermsCondRespData: string // <= 510 characters, This field contains the data returned in response message for Terms and Conditions for InComm foreign Gift Card messages based on the Terms and Conditions Version in the request message
  DigitalDeliveryResp: string // <= 510 characters, This field contains the data returned in response message for Digital Delivery Data for InComm foreign Gift Card messages.
}

export interface MiniStatementDetail_Resp {
  MiniDetailItem01: string // <= 52 characters Mini Detail Item
  MiniDetailItem02: string // <= 52 characters Mini Detail Item
  MiniDetailItem03: string // <= 52 characters Mini Detail Item
  MiniDetailItem04: string // <= 52 characters Mini Detail Item
  MiniDetailItem05: string // <= 52 characters Mini Detail Item
  MiniDetailItem06: string // <= 52 characters Mini Detail Item
  MiniDetailItem07: string // <= 52 characters Mini Detail Item
  MiniDetailItem08: string // <= 52 characters Mini Detail Item
  MiniDetailItem09: string // <= 52 characters Mini Detail Item
  MiniDetailItem10: string // <= 52 characters Mini Detail Item
}

///////////////////////////////////////////////////////////////////////////////////////////
// Top level object defintions below
///////////////////////////////////////////////////////////////////////////////////////////

const GiftCardActivationSchema = yup.object({
  giftcardactivation: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardActivation = yup.InferType<typeof GiftCardActivationSchema>

/**
 * Validate that a Gift Card Activation object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardActivation(giftCardActivation: GiftCardActivation) {
  return GiftCardActivationSchema.validateSync(giftCardActivation, { abortEarly: false })
}

export interface GiftCardActivationResponse {
  giftcardactivationresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfoGiftCard_Resp
    EMVData?: EMVData_Resp
    AddressVerificationData?: AddressVerificationData_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardUnloadSchema = yup.object({
  giftcardunload: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardUnload = yup.InferType<typeof GiftCardUnloadSchema>

/**
 * Validate that a Gift Card Unload object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardUnload(giftCardUnload: GiftCardUnload) {
  return GiftCardUnloadSchema.validateSync(giftCardUnload, { abortEarly: false })
}

export interface GiftCardUnloadResponse {
  giftcardunloadresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfoGiftCard_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardReloadSchema = yup.object({
  giftcardreload: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardReload = yup.InferType<typeof GiftCardReloadSchema>

/**
 * Validate that a Gift Card Reload object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardReload(giftCardReload: GiftCardReload) {
  return GiftCardReloadSchema.validateSync(giftCardReload, { abortEarly: false })
}

export interface GiftCardReloadResponse {
  giftcardreloadresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfoGiftCard_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardCloseSchema = yup.object({
  giftcardclose: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardClose = yup.InferType<typeof GiftCardCloseSchema>

/**
 * Validate that a Gift Card Close object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardClose(giftCardClose: GiftCardClose) {
  return GiftCardCloseSchema.validateSync(giftCardClose, { abortEarly: false })
}

export interface GiftCardCloseResponse {
  giftcardcloseresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfoGiftCard_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardPurchaseSchema = yup.object({
  giftcardpurchase: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardWithTIPSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardPurchase = yup.InferType<typeof GiftCardPurchaseSchema>

/**
 * Validate that a Gift Card Purchase object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardPurchase(giftCardPurchase: GiftCardPurchase) {
  return GiftCardPurchaseSchema.validateSync(giftCardPurchase, { abortEarly: false })
}

export interface GiftCardPurchaseResponse {
  giftcardpurchaseresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfoGiftCard_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    CustomerInformation: CustomerInformation_Resp
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardRefundSchema = yup.object({
  giftcardrefund: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardWithTIPSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardRefund = yup.InferType<typeof GiftCardRefundSchema>

/**
 * Validate that a Gift Card Refund object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardRefund(giftCardRefund: GiftCardRefund) {
  return GiftCardRefundSchema.validateSync(giftCardRefund, { abortEarly: false })
}

export interface GiftCardRefundResponse {
  giftcardrefundresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    CustomerInformation: CustomerInformation_Resp
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardPreAuthSchema = yup.object({
  giftcardpreauth: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardWithTIPSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardPreAuth = yup.InferType<typeof GiftCardPreAuthSchema>

/**
 * Validate that a Gift Card PreAuth object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardPreAuth(giftCardPreAuth: GiftCardPreAuth) {
  return GiftCardPreAuthSchema.validateSync(giftCardPreAuth, { abortEarly: false })
}

export interface GiftCardPreAuthResponse {
  giftcardpreauthresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    CustomerInformation: CustomerInformation_Resp
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardCompletionSchema = yup.object({
  giftcardcompletion: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardCompletionSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardCompletion = yup.InferType<typeof GiftCardCompletionSchema>

/**
 * Validate that a Gift Card Completion object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardCompletion(giftCardCompletion: GiftCardCompletion) {
  return GiftCardCompletionSchema.validateSync(giftCardCompletion, { abortEarly: false })
}

export interface GiftCardCompletionResponse {
  giftcardcompletionresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    CustomerInformation: CustomerInformation_Resp
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardMiniStatementSchema = yup.object({
  giftcardministatement: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardMiniStatement = yup.InferType<typeof GiftCardMiniStatementSchema>

/**
 * Validate that a Gift Card MiniStatement object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardMiniStatement(giftCardMiniStatement: GiftCardMiniStatement) {
  return GiftCardMiniStatementSchema.validateSync(giftCardMiniStatement, { abortEarly: false })
}

export interface GiftCardMiniStatementResponse {
  giftcardministatementresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    'Mini-statementDetail': MiniStatementDetail_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardInquirySchema = yup.object({
  giftcardinquiry: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.optional(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardInquiry = yup.InferType<typeof GiftCardInquirySchema>

/**
 * Validate that a Gift Card Inquiry object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardInquiry(giftCardInquiry: GiftCardInquiry) {
  return GiftCardInquirySchema.validateSync(giftCardInquiry, { abortEarly: false })
}

export interface GiftCardInquiryResponse {
  giftcardinquiryresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardTransferSchema = yup.object({
  giftcardtransfer: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardWithTIPSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataTransferSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardTransfer = yup.InferType<typeof GiftCardTransferSchema>

/**
 * Validate that a Gift Card Transfer object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardTransfer(giftCardTransfer: GiftCardTransfer) {
  return GiftCardTransferSchema.validateSync(giftCardTransfer, { abortEarly: false })
}

export interface GiftCardTransferResponse {
  giftcardtransferresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardVirtualCardSchema = yup.object({
  giftcardvirtualcard: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataTransferSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      'E-commerceData': ECommerceDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardVirtualCard = yup.InferType<typeof GiftCardVirtualCardSchema>

/**
 * Validate that a Gift Card VirtualCard object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardVirtualCard(giftCardVirtualCard: GiftCardVirtualCard) {
  return GiftCardVirtualCardSchema.validateSync(giftCardVirtualCard, { abortEarly: false })
}

export interface GiftCardVirtualCardResponse {
  giftcardvirtualcardresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    'E-commerceData': ECommerceData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const GiftCardStatusCardSchema = yup.object({
  giftcardstatuscard: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesGiftCardWithTIPSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      GiftCardData: GiftCardDataTransferSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(), // Beware that not all values in the scheme are allowed for giftcards
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      OperatorEmployee: yup.string().max(9).default(undefined).optional(),
      BatchNumber: yup.string().max(6).default(undefined).optional(),
      UPCData: yup.string().max(15).default(undefined).optional(), // Used in POSA transactions, the UPC (bar code data).
      ReversalAdviceReasonCd: ReversalAdviceReasonCdGiftCardSchema.default(undefined).optional(), // For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      ForeignGiftCardData: ForeignGiftCardDataSchema.default(undefined).optional(), //
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type GiftCardStatusCard = yup.InferType<typeof GiftCardStatusCardSchema>

/**
 * Validate that a Gift Card StatusCard object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateGiftCardStatusCard(giftCardStatusCard: GiftCardStatusCard) {
  return GiftCardStatusCardSchema.validateSync(giftCardStatusCard, { abortEarly: false })
}

export interface GiftCardStatusCardResponse {
  giftcardstatuscardresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalancesGiftCard_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfoGiftCard_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    GiftCardData: GiftCardData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    BatchNumber?: string
    CustomerInformation?: CustomerInformation_Resp
    SignatureCaptureToken: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfoGiftCard_Resp
    SettlementData?: SettlementDataGiftCard_Resp
    ForeignGiftCardData: ForeignGiftCardData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}
