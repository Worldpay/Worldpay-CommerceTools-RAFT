import * as yup from 'yup'

import {
  AccountCodesAndData,
  AccountCodesAndDataSchema,
  AdditionalFraudDataSchema,
  AdditionalFraudData_Resp,
  AdditionalPOSDataSchema,
  AddressVerificationData_Resp,
  AmazonPayDataSchema,
  AmountString,
  AssuredPaymentsGeneralDataSchema,
  AssuredPaymentsItemSchema,
  AssuredPaymentsMembershipDataSchema,
  AssuredPaymentsPurchaseInformationSchema,
  AssuredPaymentsUserAccountDataSchema,
  AssuredSellerDataSchema,
  AssuredSubscriptionDataSchema,
  AuthorizationTypeSchema,
  BenefitCardServicesDataSchema,
  BooleanString,
  BooleanStringSchema,
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
  LodgingDataSchema,
  MerchantSpecificDataSchema,
  MiscAmountsBalancesSchema,
  MultiClearingDataSchema,
  OnlineBillToAddressSchema,
  OnlineOrderCustomerDataSchema,
  OnlineShipToAddressSchema,
  ProcFlagsIndicatorsSchema,
  ProcFlagsIndicators_Resp,
  RawNetworkData_Resp,
  ReferenceTraceNumbersSchema,
  ReferenceTraceNumbers_Resp,
  ResponseCode,
  ReturnCode,
  STPDataSchema,
  STPData_Resp,
  SettlementData_Resp,
  SyncPromoNeededResult,
  SynchronyDataSchema,
  TerminalDataSchema,
  TerminalData_Resp,
  UserDefinedData,
  UserDefinedDataSchema,
  VehicleRentalDataSchema,
  WorldPayRoutingData_Resp,
} from './common-types'

export type AuthorizationSource =
  | ' ' //- NOT SET
  | '0' //- ADVICE OF EXCEPTION FILE CHANGE
  | '1' //- REQUEST TIMED OUT BY SWITCH
  | '2' //- TRANSACTION AMT BELOW ISSUER LIMIT
  | '3' //- ISSUER CENTER IN STAND IN MODE
  | '4' //- ISSUER CENTER UNAVAILABLE
  | '5' //- TRANSACTION SWITCHED FOR AUTH
  | '6' //- FORCED STAND IN BY ISSUER PROCESSOR
  | '7' //- POTENTIAL DUPLICATE
  | '8' //- DUPLICATE AUTHORIZATION
  | '9' //- AUTOMATED REFERRAL SERVICE BACKUP CENTER
  | 'A' //- ACQUIRER ADVICE
  | 'B' //- EXCEEDS AFD FRAUD THRESHOLD
  | 'C' //- FOR CONDITIONS NOT LISTED
  | 'T' //- ADVICE OF A TELECODE FILE CHANGE
  | 'U' //- BAD TELECODE ATTEMPT: THRESHOLD EXCEEDED
  | 'V' //- MAX TELECODE USAGE: THRESHOLD EXCEEDED
export enum PrestigiousPropertyIND {
  Unspecified = '',
  FiveHundredDollar = 'D',
  ThousandDollar = 'B',
  FifteenHundredDollar = 'S',
}
const PrestigiousPropertyINDSchema = yup.mixed<PrestigiousPropertyIND>().oneOf(Object.values(PrestigiousPropertyIND)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export enum ReversalAdviceReasonCd {
  NormalReversal = '000',
  TimeoutReversal = '002',
  Syntax = '003',
  ClerkCancel = '005',
  CustomerCancel = '006',
  PreviouslyAuthorized = '010',
}
const ReversalAdviceReasonCdSchema = yup.mixed<ReversalAdviceReasonCd>().oneOf(Object.values(ReversalAdviceReasonCd)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

const MiscAmountsBalancesCompletionSchema = yup.object({
  TransactionAmount: AmountString.required(),
  CashBackAmount: AmountString.optional(),
  SurchargeAmount: AmountString.optional(),
  ConvenienceFEE: AmountString.optional(),
  DispensedAmount: AmountString.optional(),
  SalesTAXAmount: AmountString.optional(),
  PreauthorizedAmount: AmountString.required(),
  PaymentTrailingAmt: AmountString.optional(),
  OPTUMAmount: AmountString.optional(),
})
export type MiscAmountsBalancesCompletion = yup.InferType<typeof MiscAmountsBalancesCompletionSchema>

const MiscAmountsBalances_RespSchema = yup.object({
  OriginalAuthAmount: AmountString.required(), // <= 13 characters Input Uses:
  // - For Fleet credit card completions, the acquirer passes in the originally authorized amount from the preauth.
  // - For POS debit purchases, this field contains the partially authorized amount.
  // Output Uses:
  // - For partial approvals, Worldpay will return the portion of the Transaction Amount that the issuer authorized the transaction for.
  // - For reversals, Worldpay can return the amount of the transaction that is settled in this field.
  // - For gift cards, Worldpay can return the authorized amount in this field.
  // - For transactions where gift card currency conversion has been applied, Worldpay will return the authorized amount from the database in this field.
})
export type MiscAmountsBalances_Resp = yup.InferType<typeof MiscAmountsBalances_RespSchema>

export interface CreditauthProcFlagsIndicators {
  PartialAllowed: string
}

const SoftDescriptorDataSchema = yup.object({
  SdMerchantName: yup.string().max(25).optional(), // <= 25 characters, Merchant Name
  SdMerchantCity: yup.string().max(13).optional(), // <= 13 characters, Merchant City
  SdMerchantState: yup.string().max(2).optional(), // <= 2 characters, Merchant State
})
export type SoftDescriptorData = yup.InferType<typeof SoftDescriptorDataSchema>

const CustomerInformationSchema = yup.object({
  'SocialSecurity#': yup.string().max(9).optional(), // <= 9 characters, Social Security Number
  DateOfBirth: yup.string().max(8).optional(), //  <= 8 characters, Date of Birth
  ZIPCode: yup.string().max(9).optional(), // <= 9 characters, Postal Code
  CardholderFirstName: yup.string().max(25).optional(), // <= 25 characters, First Name
  CardholderLastName: yup.string().max(30).optional(), // <= 30 characters, Last Name
  CardholderAddress1: yup.string().max(35).optional(), // <= 35 characters, Street Address
  CardholderAddress2: yup.string().max(35).optional(), // <= 35 characters, Continuation of street address, if needed
  CardholderCity: yup.string().max(20).optional(), // <= 20 characters, City
  CardholderState: yup.string().max(3).optional(), // <= 3 characters, State
  CardholderCountryCode: yup.string().max(3).optional(), // <= 3 characters, Shipping Country Code
  CardholderFullName: yup.string().max(50).optional(), // <= 50 characters, Full Name
})
export type CustomerInformation = yup.InferType<typeof CustomerInformationSchema>

const AlternateMerchantPRODSchema = yup.string().oneOf(['CP']) //ChasePay
export type AlternateMerchantPROD = yup.InferType<typeof AlternateMerchantPRODSchema>

const AlternateMerchantIDSchema = yup.object({
  AlternateMerchantID: yup.string().max(20).optional(), // <= 20 characters, Alternate (External) Merchant ID
  AlternateMerchantPROD: AlternateMerchantPRODSchema.default(undefined).optional(), // <= 2 characters, Indicates what the Merchant ID pertains to (type of Product).
})
export type AlternateMerchantID = yup.InferType<typeof AlternateMerchantIDSchema>

export interface DynamicCurrConvInfo_Resp {
  DCCConvertedAmount?: string // <= 13 characters, Amount converted to the cardholder's currency (DCC processing)
  DCCAuthorizedAmount?: string // <= 13 characters, Authorized amount in cardholder's currency (DCC processing)
  DCCConversionRate?: string // <= 8 characters, Rate used to convert the currency.
  DCCCurrencyCode?: string // <= 3 characters, Currency code of the cardholder.
  DCCSettlementAmount?: string // <= 13 characters, Requested amount in cardholder's currency (DCC processing)
}

const Level3DataSchema = yup.object({
  ItemDescription: yup.string().max(35).optional(), // <= 35 characters, This contains a description of the item purchased. You cannot space or zero fill it.
  UnitOfMeasure: yup.string().max(35).optional(), // <= 12 characters, This includes measurements such as gallon, gram, kilogram, and so on. It defaults to NMB (Number) when unknown.
  UnitPrice: yup.string().max(35).optional(), // <= 12 characters, The unit price of the item listed in the description.
  UnitPriceDecimal: yup.string().max(35).optional(), // <= 1 characters, Number of decimals in the unit price. Note: Visa only supports 4 decimals.
  ItemQuantity: yup.string().max(35).optional(), // <= 12 characters, The quantity of the item listed in the description.
  ItemQuantityDecimal: yup.string().max(35).optional(), // <= 1 characters, Number of decimals in the item quantity. Note: Visa only supports 4 decimals.
  ProductCode: yup.string().max(35).optional(), // <= 15 characters, This is a description of the item purchased. You cannot space or zero fill it.
  ItemDiscountAmount: yup.string().max(35).optional(), // <= 12 characters, This is conditional on whether the discount is applied to the line item. Zero fill if not applicable.
  ItemDiscountRate: yup.string().max(35).optional(), // <= 5 characters, This is conditional on whether the discount is applied to the line item. Zero fill if not applicable.
  ItemDiscRateDecimal: yup.string().max(35).optional(), // <= 1 characters, Number of decimals in the item discount rate. Note: Visa only supports 2 decimals.
})
export type Level3Data = yup.InferType<typeof Level3DataSchema>

export enum SenderTranType {
  AccountToAccount = 'VAA',
  BusinessToBusiness = 'VBB',
  MoneyTransfer_BankInitiated = 'VBI',
  NonCardBillPayment = 'VBP',
  CashClaim = 'VCC',
  CashIn = 'VCI',
  CashOut = 'VCO',
  CardBillPayment = 'VCP',
  FundsDisbursement = 'VFD',
  GovernmentDisbursement = 'VGD',
  GamblingPayout = 'VGP',
  LoyaltyAndOffers = 'VLO',
  MobileAirTimePayment = 'VMA',
  MerchantDisbursement = 'VMD',
  MoneyTransfer_MerchantInitiated = 'VMI',
  FaceToFaceMerchantPayment4 = 'VMP',
  OnlineGamblingPayout = 'VOG',
  Payroll_PensionDisbursement = 'VPD',
  PaymentToGovernment = 'VPG',
  PersonToPerson = 'VPP',
  PaymentForGoodsAndServices = 'VPS',
  TopUpForEnhancedPrepaidLoads = 'VTU',
  WalletTransfer = 'VWT',
}
const SenderTranTypeSchema = yup.mixed<SenderTranType>().oneOf(Object.values(SenderTranType)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export enum SenderFundingType {
  CreditCardAccount = 'V01',
  DebitCardAccount = 'V02',
  PrepaidCardAccount = 'V03',
  Cash = 'V04',
  DepositAccessAccount = 'V05',
}
const SenderFundingTypeSchema = yup.mixed<SenderFundingType>().oneOf(Object.values(SenderFundingType)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export enum SenderAccountType {
  Other = '00',
  RtnBankAccount = '01',
  Iban = '02',
  CardAccount = '03',
  Email = '04',
  PhoneNumber = '05',
  BanBic = '06',
  WalletId = '07',
  SocialNetworkId = '08',
}
const SenderAccountTypeSchema = yup.mixed<SenderAccountType>().oneOf(Object.values(SenderAccountType)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

const PaymentSenderDataSchema = yup.object({
  SenderName: yup.string().max(30).optional(), // <= 30 characters, Contains the name of the entity funding the transaction
  SenderAddress: yup.string().max(50).optional(), // <= 50 characters, Contains the street address of the entity funding the transaction
  SenderCity: yup.string().max(25).optional(), // <= 25 characters, Contains the city of the entity funding the transaction
  SenderState: yup.string().max(3).optional(), // <= 3 characters, Contains the state/providence of the entity funding the transaction.
  SenderCountry: yup.string().max(3).optional(), // <= 3 characters, Contains the country code of the entity funding the transaction
  SenderZIPCode: yup.string().max(10).optional(), // <= 10 characters, Contains the zip code of the entity funding the transaction
  SenderTranType: SenderTranTypeSchema.default(undefined).optional(), // <= 4 characters, Contains the type of funds transfer transaction to take place. Accepted values depend on the network and transaction type selected.
  // Note: The network specifications should be referenced to see if values have been added or changed. Worldpay does not do editing on the values.
  SenderAdditionalData: yup.string().max(65).optional(), // <= 65 characters, Contains additional address information in regard to the payment transaction
  SenderAccountNumber: yup.string().max(34).optional(), // <= 34 characters, Account number associated with the sender.
  SenderFundingType: SenderFundingTypeSchema.default(undefined).optional(), // <= 3 characters, Contains the type of account associated with the entity funding the transaction.
  SenderAccountType: SenderAccountTypeSchema.default(undefined).optional(), // <= 2 characters, The account type associated to the Sender Account Number.
  SenderReferenceNumber: yup.string().max(16).optional(), // <= 16 characters, Reference number assigned to this payment
})
export type PaymentSenderData = yup.InferType<typeof PaymentSenderDataSchema>

export enum SynchronyPrivateData_PaymentSource {
  Unknown = '00',
  Teller = '01',
  ATM = '02',
  Retailer = '03',
  OnlineBanking = '04',
  Mail = '05',
  WesternUnion = '06',
}

export enum SynchronyPrivateData_PaymentType {
  Unknown = '00', // (default)
  Check = '01',
  MoneyOrder = '02',
  Cash = '03',
  CreditCard = '04',
  DebitCard = '05',
  ElectronicFundsTransfer = '06',
  WireTransfer = '07',
  Coupon = '08',
  MixedTender = '09',
  ACHCheck = '10',
  DroptoDraftCheck = '11',
}

export type CardProgramType =
  | 'T' // - Contractor
  | 'M' // - Commercial
  | 'O' // - Other

export interface PrivateLabelData_Resp {
  CAPOneSequenceNumber?: string // <= 4 characters, Capital One-specific sequence number.
  CAPOneTrackingID?: string // <= 12 characters, Capital One ID that is used in matching authorizations to settlement
  CardProgramType?: CardProgramType // <= 1 characters, Identifies the type of program that the private label card applies to. Valid values are:
  TranDenialErrorCode?: string // <= 2 characters, Provides denial and error code information to reflect the disposition of the authorization. Refer to the Capital One Financial message specifications for a list of valid values.
  TenderType?: string // <= 2 characters, Identifies the payment type the cardholder is using to perform the transaction. Refer to the Capital One Financial message specifications for a list of valid values.
}

const PrivateLabelDataSchema = yup.object({
  SynchronyPOSData: yup.string().max(19).optional(), // <= 19 characters, POS Data specific to Synchrony
  SynchronyPrivateData: yup.string().max(255).optional(), // <= 255 characters, Use this field to provide additional Synchrony data dependent on specific transaction requirements. Refer to the Synchrony Message Specifications for an up to date listing of valid values.
  // Usage 1: For credit card bill payments, the following data can be sent.
  // Positions 1-2 = Payment Source (see SynchronyPrivateData_PaymentSource )
  // Positions 3-4 = Payment Type (see SynchronyPrivateData_PaymentType )
  CAPOneSequenceNumber: yup.string().max(4).optional(), // <= 4 characters, Capital One-specific sequence number.
  CAPOneTrackingID: yup.string().max(12).optional(), // <= 12 characters, Capital One ID that is used in matching authorizations to settlement
  TenderType: yup.string().max(2).optional(), // <= 2 characters, Identifies the payment type the cardholder is using to perform the transaction. Refer to the Capital One Financial message specifications for a list of valid values.
})
export type PrivateLabelData = yup.InferType<typeof PrivateLabelDataSchema>

export interface CreditResponse {
  ReturnCode: string
  ReasonCode: string
  CardInfo: CreditauthresponseCardInfo
  ReferenceTraceNumbers: CreditauthresponseReferenceTraceNumbers
  SettlementData: SettlementData
  WorldPayRoutingData: WorldPayRoutingData
  APITransactionID: string
  ResponseCode: string
  AuthorizationSource?: string
  MiscAmountsBalances?: CreditauthresponseMiscAmountsBalances
  VisaSpecificData?: CreditauthresponseVisaSpecificData
  MarketSpecificData?: MarketSpecificData
  HealthcareData?: CreditauthresponseHealthcareData
  SignatureCaptureToken?: string
  DiscSpecificData?: DiscSpecificData_TODO
}

export interface CreditauthresponseCardInfo {
  CardProductCode: string
}

export interface DiscSpecificData_TODO {
  DiscProcessingCode: string
  DiscTrackStatusCode: string
  DiscPINCapability: string
  DiscTransactionId: string
  DiscEntryMode: string
  DiscResponseCode: string
  DiscPOSDataCodes: string
  DiscTraceNumber: string
}

export interface CreditauthresponseHealthcareData {
  TransSpecificData: string
  TransSpecificSource: string
}

export interface CreditauthresponseMiscAmountsBalances {
  AvailableBALFromAcct: string
  OriginalAuthAmount?: string
}

export interface CreditauthresponseReferenceTraceNumbers {
  RetrievalREFNumber: string
  NetworkRefNumber: string
  AuthorizationNumber: string
}

export enum SettlementNetwork {
  Ntwk = 'NTWK',
}

export interface SettlementData {
  SettlementDate: string
  SettlementNetwork: SettlementNetwork
  RegulationIndicator: string
}

export interface CreditauthresponseVisaSpecificData {
  VisaCardLevelResults: VisaCardLevelResults
  VisaResponseCode?: string
  VisaValidationCode?: string
  VisaTransactionId?: string
  VisaAuthCharId?: string
}

export enum VisaCardLevelResults {
  A = 'A ',
  F = 'F ',
}

export interface WorldPayRoutingData {
  NetworkId: NetworkID
}

export type AccountStatus =
  | 'A' // Account Number change. The account number or account number and expiration date are being updated.
  | 'C' // Closed Account
  | 'E' // Expiration Date updated
  | 'Q' // Contact Cardholder

export type ErrorCodes =
  | 'VAU001' // Transaction did not qualify because the transaction contains token
  | 'VAU002' // Real Time AU is supported only for branded PAN
  | 'VAU003' // Real Time AU is not supported for this network
  | 'VAU004' // Transaction is not original purchase or bill payment
  | 'VAU005' // Transaction contains CVV2
  | 'VAU006' // Transaction is not a qualifying transaction type
  | 'VAU007' // Real Time AU is not supported for this Merchant Category Code (MCC)
  | 'VAU008' // Acquirer of processor is not activated for Real Time VAU
  | 'VAU009' // Issuer does not support Real Time AU
  | 'VAU010' // Issuer or Visa blocked the merchant
  | 'VAU011' // Pre-authorized Payment Cancellation Service (PPCS) stop payment order for this transaction
  | 'VAU012' // Credentials in the authorization request is the latest AU data

export interface AccountUpdaterData_Resp {
  ReplacementPAN?: string // <= 20 characters, This field contains the replacement PAN
  ReplacementExpDate?: string // (ReplacementExpDate) <= 4 characters, This field contains the replacement expiration date of the cardholder.
  AccountStatus?: AccountStatus // <= 1 characters, This field contains one of the following values from the network if available:
  ErrorCodes?: ErrorCodes // <= 6 characters, This field contains one of the following error codes from the network if available:
  // Note: Values could be added at any time and the acquiring entity should not throw an exception for unknown values.
  AccountUpdaterToken?: string // <= 20 characters, When we receive a transaction that wants to use the account updater, if we receive a new card number back in the transaction, this will be the token of the new card number when requested.
  AccountUpdaterUsageIndicator?: BooleanString // <= 1 characters, Y/N flag for account updater transactions. Worldpay will resubmit the transaction request with the new card if the original request was denied (MasterCard only) and respond with this field if we attempted resubmission.
}

export type SyncPromoAPRFlag =
  | '00' // Fixed
  | '01' // Variable

export type SyncAfterPromoFlag =
  | '00' // Fixed
  | '01' // Variable

export interface SynchronyData_Resp {
  SyncPromoNeededResult?: SyncPromoNeededResult // <= 2 characters, Promo Needed/Result
  SyncPromoAPRFlag?: SyncPromoAPRFlag // <= 2 characters, Promo APR Flag
  SyncAfterPromoFlag?: SyncAfterPromoFlag // <= 2 characters, After Promo Flag
  SyncDuringPromoAPR?: string // <= 6 characters, During Promo APR
  // 6 Digits implied decimal -> 199000 = 19.9 %
  SyncAfterPromoAPR?: string // <= 6 characters, After Promo APR
  // 6 Digits implied decimal -> 199000 = 19.9 %
  SyncPromoDuration?: string // <= 40 characters, Promo Duration
  // Example: PROMO Duration
  SyncPromoDescription?: string // <= 40 characters, Promo Description
  // Example: PROMO RATE 1
}

export type AmazonPayClosedOpenLoopIndicator =
  | 'C' // Closed Loop
  | 'O' // Open Loop

export type AmazonPayReasonCode =
  | '00' // Successful detokenization with Amazon
  | '01' // Merchant missing Amazon pay merchant ID
  | '02' // No STAN provided
  | '03' // Error contacting Amazon service (timeout)
  | '04' // Invalid Amazon pay token
  | '05' // Duplicate Charge ID detected
  | '06' // Charge ID/PAN Mapping not found on refund/completion
  | '07' // Merchant not enrolled in Amazon pay with FIS
  | '08' // Amazon Declined transaction
  | '09' // Merchant Order number missing
  | '99' // Internal Error

export interface AmazonPayData_Resp {
  AmazonPayChargeID?: string // <= 27 characters, ID of the Charge?: created at Amazon Pay. It should be passed on every subsequent request for this transaction.
  AmazonPayClosedOpenLoopIndicator?: AmazonPayClosedOpenLoopIndicator // <= 1 characters, Value indicating whether the transaction registers as a closed or open loop authorization.
  AmazonPayReasonCode?: AmazonPayReasonCode // <= 2 characters, Returned by Worldpay indicating the status of the detokenization process with Amazon.
}

export interface BenefitCardServicesData_Resp {
  RequestedOTCAmount?: string // <= 13 characters, Requested amount to be taken from OTC purse.
  ApprovedOTCAmount?: string // <= 13 characters, Approved amount to be taken from OTC purse.
  BalanceOTCAmount?: string // <= 13 characters, Remaining balance amount for OTC purse.
  RequestedFoodAmount?: string // <= 13 characters, Requested amount to be taken from Food purse.
  ApprovedFoodAmount?: string // <= 13 characters, Approved amount to be taken from Food purse.
  BalanceFoodAmount?: string // <= 13 characters, Remaining balance amount for Food purse.
  ProgramDiscountAmount?: string // <= 13 characters, Aggregate off all applicable individual discounts for the given product data.
  ProgramCouponAmount?: string // <= 13 characters, Aggregate discount amount offered to the benefit program consumer at the POS.
  OtherAmount?: string // <= 13 characters, Other amount can be sent back on replies for the following reasons:
  // - Transaction amount remainder as the difference between the amount requested in the TransactionAmount field and the total qualified benefit amounts.
  // - Amounts for which no UPC/PLU data was delivered from the merchant to Worldpay.
  // - Amounts for which no qualified benefit program was identified when evaluating the Approved Product List (APL) for the available benefits assigned to the BIN.
  ExceedsBenefitAmount?: string // <= 13 characters, Amount greater than available benefit coverage
  BenefitCardServicesPassThruData1?: string // <= 999 characters, A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
  BenefitCardServicesPassThruData2?: string // <= 999 characters, A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
  BenefitCardServicesPassThruData3?: string // <= 999 characters, A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
  BenefitCardServicesPassThruData4?: string // <= 999 characters, A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
}

export enum NetworkID {
  Base = 'BASE',
  Disc = 'DISC',
}

const BillPaymentDataSchema = yup.object({
  BillPaymentType: yup.string().oneOf(['B']).required(), // <= 1 characters, Valid values are:
  // B - Standard bill payment
})
export type BillPaymentData = yup.InferType<typeof BillPaymentDataSchema>

export interface CreditBillPaymentResponse {
  ReturnCode: string
  ReasonCode: string
  CardInfo: CreditauthresponseCardInfo
  ReferenceTraceNumbers: CreditbillpaymentresponseReferenceTraceNumbers
  SettlementData: SettlementData
  WorldPayRoutingData: WorldPayRoutingData
  APITransactionID: string
  ResponseCode: string
  AuthorizationSource: string
}

export interface CreditbillpaymentresponseReferenceTraceNumbers {
  RetrievalREFNumber: string
  AuthorizationNumber: string
}

export interface CreditcompletionHealthcareData {
  HealthcareAmount: string
  PrescriptionAmount: string
  VisionAmount: string
  ClinicAmount: string
  DentalAmount: string
}

const SubsequentReasonCodeValues = [
  '13', // Below floor limit
  '17', // VRU Approved
  '40', // Incremental Authorization
  '41', // Resubmission
  '42', // Delayed Charge
  '43', // Reauthorization
  '44', // No Show
  '45', // Deferred Authorization
  '50', // Offline Chip Approval
]
const SubsequentReasonCodeSchema = yup.string().oneOf(SubsequentReasonCodeValues)

const VisaSecureTokenValues = [
  // <= 3 characters, Visa Secure Credential Framework Token. Valid values are:
  'VSR', // Request Visa Secure Token
  'VSY', // If returned, Visa Secure Token is present
  'VSN', // If returned, Visa Secure Token is not present
]
const VisaSecureTokenSchema = yup.string().oneOf(VisaSecureTokenValues)

const VisaSpecificDataSchema = yup.object({
  VisaValidationCode: yup.string().max(4).optional(), // <= 4 characters, Contains a Visa calculated code to ensure that key fields in the authorization request matches their respective fields in the BASE II deferred clearing message.
  VisaTransactionId: yup.string().max(15).optional(), // <= 15 characters, Contains the reference number assigned by Visa.
  VisaAuthCharId: yup.string().max(1).optional(), // <= 1 characters, Contains a code that the acquirer uses to request CPS qualification.
  VisaResponseCode: yup.string().max(2).optional(), // <= 2 characters, Response code assigned to the transaction by Visa.
  VisaSubsequentTransactionReasonCode: SubsequentReasonCodeSchema.default(undefined).optional(), // <= 2 characters, Value used to identify the reason for sending up a subsequent transaction. Valid values are:
  VisaSecureToken: VisaSecureTokenSchema.default(undefined).optional(), // <= 3 characters, Visa Secure Credential Framework Token. Valid values are:
  VisaMerchantIdentifier: yup.string().max(8).optional(), // <= 8 characters, This field contains a unique identifier value assigned by Visa for each merchant included in the identification program.
})
export type VisaSpecificData = yup.InferType<typeof VisaSpecificDataSchema>

export type VisaAdditionalTokenInfo =
  | ' ' // Not Applicable
  | '1' // Token Program

export interface VisaSpecificData_Resp {
  VisaValidationCode?: string // <= 4 characters, Contains a Visa calculated code to ensure that key fields in the authorization request matches their respective fields in the BASE II deferred clearing message.
  VisaTransactionId?: string // <= 15 characters, Contains the reference number assigned by Visa.
  VisaBusinessAPPId?: string // <= 2 characters, Visa Business Application ID
  VisaAuthCharId?: string // <= 1 characters, Contains a code that the acquirer uses to request CPS qualification.
  VisaCardLevelResults?: string // <= 2 characters, Visa populates this field with a product identification value using issuer-supplied data on file in the Cardholder Database or the product ID on the account range. Using these values, you track card-level activity by individual account number.
  VisaResponseCode?: string // <= 2 characters, Response code assigned to the transaction by Visa.
  VisaSpendQualifier?: string // <= 1 characters, Visa Spend Qualifier
  VisaSecureToken?: string // <= 3 characters, Visa Secure Credential Framework Token. Valid values are:
  VisaAdditionalTokenInfo?: VisaAdditionalTokenInfo // <= 1 characters, This field contains a value that can identify transactions that are eligible for token services. Acquirers can retain the value in this field from the authorization and send it in clearing transactions. Refer to the Visa specifications for Field 44.3 for the most recent list of valid values.
}

const McrdSpecificDataSchema = yup.object({
  McrdBanknetREFNUM: yup.string().max(9).optional(), // <= 9 characters, MasterCard Banknet Reference Number
  McrdBanknetSettleDate: yup
    .string()
    .test(
      'Invalid McrdBanknetSettleData',
      'Must be in MMDD format',
      (value) => value === undefined || /[0-1][0-9][0-3][0-9]/.test(value),
    )
    .optional(), // <= 4 characters, MasterCard Settlement Date (MMDD format)
  McrdSubsequentTransactionReasonCode: SubsequentReasonCodeSchema.default(undefined).optional(), // <= 2 characters, Value used to identify the reason for sending up a subsequent transaction. Valid values are:
  McrdRewardsReq: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the customer requests MasterCard Rewards information from the network.
})
export type McrdSpecificData = yup.InferType<typeof McrdSpecificDataSchema>

export type MastercardMerchantAdviceCode = // <= 2 characters, Merchant Advice Codes returned from Mastercard in DE48 SE84. The data must be requested using the appropriate processing flag (MastercardAdviceCodeIndicator).

    | '01' // Updated/additional information needed
    | '02' // Cannot approve at this time, try later
    | '03' // Do not try again
    | '21' // Payment Cancellation

export interface McrdSpecificData_Resp {
  McrdBanknetREFNUM?: string // <= 9 characters, MasterCard Banknet Reference Number
  McrdBanknetSettleDate?: string // <= 4 characters, MasterCard Settlement Date (MMDD format)
  MastercardMerchantAdviceCode?: MastercardMerchantAdviceCode
  McrdRewardsText?: string // <= 199 characters, MasterCard Rewards Text
  McrdIntegrityClass?: string // <= 2 characters, Contains the Mastercard provided Transaction Integrity Classification for Point of Sale (POS) Purchase and Purchase with Cash Back transactions initiated on the Authorization Platform.
}

const DiscSpecificDataSchema = yup.object({
  DiscTransactionId: yup.string().max(15).optional(), // <= 15 characters, Discover Reference Number
  DiscSubsequentTransactionReasonCode: SubsequentReasonCodeSchema.default(undefined).optional(), // <= 2 characters
})
export type DiscSpecificData = yup.InferType<typeof DiscSpecificDataSchema>

export interface DiscSpecificData_Resp {
  DiscTransactionId?: string // <= 15 characters, Discover Reference Number
  DiscProcessingCode?: string // <= 6 characters, Discover Processing Code
  DiscTraceNumber?: string // <= 6 characters, Discover Sequence Number
  DiscEntryMode?: string // <= 2 characters, Discover Entry Mode
  DiscPINCapability?: string // <= 1 characters, Discover PIN Capability
  DiscTrackStatusCode?: string // <= 2 characters, Discover Track Status Code
  DiscPOSDataCodes?: string // <= 13 characters, Discover POS Data Codes
  DiscResponseCode?: string // <= 2 characters, Discover Response Code
}

export interface AmexSpecificData_Resp {
  AmexTransactionId?: string // <= 15 characters, This field contains a 15-character transaction ID that American Express assigns. Worldpay only returns this for American Express transactions.
  AmexPOSDataCodes?: string // <= 12 characters, This field contains a series of values indicating the terminal and cardholder operating environment. Worldpay only returns this for American Express transactions.
}

const AmexSpecificDataSchema = yup.object({
  AmexTransactionId: yup.string().max(15).optional(), // <= 15 characters, This field contains a 15-character transaction ID that American Express assigns. Worldpay only returns this for American Express transactions.
  AmexSellerId: yup.string().max(20).optional(), // <= 20 characters, This field contains the 20-character Seller ID for American Express transactions
  AmexSubsequentTransactionReasonCode: yup.string().max(2).optional(), // <= 2 characters, Value used to identify the reason for sending up a subsequent transaction.
})
export type AmexSpecificData = yup.InferType<typeof AmexSpecificDataSchema>

export enum MarketSpecificData {
  Unspecified = '',
  AutoRental = 'A',
  Payment = 'B',
  ElectronicCommerceTransactionAggregation = 'E',
  Hotel = 'H',
  Healthcare = 'M',
}
const MarketSpecificDataSchema = yup.mixed<MarketSpecificData>().oneOf(Object.values(MarketSpecificData)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

const EMVDataSchema = yup.object({
  EMVICCData: yup.string().max(1020).optional(), // <= 1020 characters, This field supports ICC Data captured by the merchant terminal in TLV format. This data is sent on to the network.
  EMVOfflineTrans: BooleanStringSchema.default(undefined).optional(), // <= 1 characters, Y/N flag indicating if the EMV transaction was authorized offline.
})
export type EMVData = yup.InferType<typeof EMVDataSchema>

const AddressVerificationDataSchema = yup.object({
  AVSZIPCode: yup.string().max(9).optional(), // <= 9 characters, Cardholder's Zip Code
  AVSAddress: yup.string().max(20).optional(), // <= 20 characters, Cardholder's Address
})
export type AddressVerificationData = yup.InferType<typeof AddressVerificationDataSchema>

const PINProcessingDataSchema = yup.object({
  PINBlock: yup.string().max(16).optional(), // <= 16 characters, PIN Block
  KEYSequenceNumber: yup.string().max(20).optional(), // <= 20 characters, Key Sequence Number (KSN)
  MasterKeyIndex: yup.string().max(3).optional(), // <= 3 characters, This provides a means to generate multiple master keys for a particular Key Label. If this value is provided during key exchange processing, it must be sent on all successive authorizations. By default, index 001 will be used.
  WorkingKeyIndex: yup.string().max(3).optional(), // <= 3 characters, This provides a means to generate multiple working keys for a particular Key Label. If this value is provided during key exchange processing, it must be sent on all successive authorizations. By default, index 001 will be used.
  KeyLabelAcro: yup.string().max(4).optional(), // <= 4 characters, This is the label that will be associated with all processing with the requested master key and working key sessions. If this value is provided during key exchange processing, it must be sent on all successive authorizations.
})
export type PINProcessingData = yup.InferType<typeof PINProcessingDataSchema>

export interface CardInfo_Resp {
  PAN?: string // <= 20 characters, This field contains the series of digits identifying a customer account or relationship.
  // For P2P transactions, omit this field and use the P2P version of the field.
  // For Worldpay token-initiated transactions, include the token and token ID fields instead of submitting a clear PAN in this field.
  // For network payment token initiated transactions, include the network token in this field and cryptogram in 3dSecureData if applicable.
  CardProductCode?: string // <= 3 characters, The field indicates the network brand's product for the selected BIN.
}

export interface Fault {
  faultType: string
  faultDescription: string
  detail?: FaultDetail
}

/**
 * Manually added start
 */
export interface RequestUnauthorized {
  response: 401
  fault: Fault
}

export interface RequestRefused {
  response: 403
  fault: Fault
}

export interface NotFound {
  response: 404
  fault: Fault
}

export interface MethodNotAllowed {
  response: 405
  fault: Fault
}

export interface ServerError {
  response: 500
  fault: Fault
}

export interface FaultDetail {
  stackTrace: string
}

const CreditPurchaseSchema = yup.object({
  creditpurchase: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      'Multi-clearingData': MultiClearingDataSchema.default(undefined).optional(),
      EMVData: EMVDataSchema.default(undefined).optional(),
      AddressVerificationData: AddressVerificationDataSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      PINProcessingData: PINProcessingDataSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      'E-commerceData': ECommerceDataSchema.default(undefined).optional(),
      BillPaymentData: BillPaymentDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters,
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(),
      VisaSpecificData: VisaSpecificDataSchema.default(undefined).optional(),
      McrdSpecificData: McrdSpecificDataSchema.default(undefined).optional(),
      DiscSpecificData: DiscSpecificDataSchema.default(undefined).optional(),
      AmexSpecificData: AmexSpecificDataSchema.default(undefined).optional(),
      MarketSpecificData: MarketSpecificDataSchema.default(undefined).optional(),
      Duration: yup.string().max(2).optional(), // <= 2 characters Hotel/Auto Rental duration.,
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      SoftDescriptorData: SoftDescriptorDataSchema.default(undefined).optional(),
      WalletId: yup.string().max(3).optional(), // <= 3 characters, MasterCard-assigned Wallet ID.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      LodgingData: LodgingDataSchema.default(undefined).optional(),
      VehicleRentalData: VehicleRentalDataSchema.default(undefined).optional(),
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      SynchronyData: SynchronyDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      AmazonPayData: AmazonPayDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      BenefitCardServicesData: BenefitCardServicesDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      MastercardDSRPCryptogram: yup.string().max(28).optional(), // <= 28 characters, Base64 encoded cryptogram data
      MastercardRemoteCommerceAcceptorIdentifier: yup.string().max(150).optional(), // <= 150 characters, Business website URL or reverse domain name as presented to the consumer during checkout. Base64 encoded.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
      AssuredPaymentsUserAccountData: AssuredPaymentsUserAccountDataSchema.default(undefined).optional(), //  (AssuredPaymentsUserAccountData_0301)
      AssuredPaymentsPurchaseInformation: AssuredPaymentsPurchaseInformationSchema.default(undefined).optional(), // (AssuredPaymentsPurchaseInformation_0301)
      AssuredPaymentsItemData: yup.array().max(10).of(AssuredPaymentsItemSchema).optional(), // Array of (AssuredPaymentsItemData_0301) [ 0 .. 10 ] items
      AssuredPaymentsGeneralData: AssuredPaymentsGeneralDataSchema.default(undefined).optional(), // (AssuredPaymentsGeneralData_0301)
      AssuredPaymentsMembershipData: AssuredPaymentsMembershipDataSchema.default(undefined).optional(), //  (AssuredPaymentsMembershipData_0301)
      AssuredSellerData: AssuredSellerDataSchema.default(undefined).optional(), // (AssuredSellerData_0301)
      AssuredSubscriptionData: AssuredSubscriptionDataSchema.default(undefined).optional(), // (AssuredSubscriptionData_0301)
    })
    .required(),
})
export type CreditPurchase = yup.InferType<typeof CreditPurchaseSchema>

/**
 * Validate that a credit purchase object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateCreditPurchase(creditPurchase: CreditPurchase) {
  return CreditPurchaseSchema.validateSync(creditPurchase, { abortEarly: false })
}

export interface CreditPurchaseResponse {
  creditpurchaseresponse: {
    ReturnCode: ReturnCode
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalances_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfo_Resp
    EMVData?: EMVData_Resp
    AddressVerificationData?: AddressVerificationData_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    TerminalData?: TerminalData_Resp
    'E-commerceData'?: ECommerceData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    VisaSpecificData?: VisaSpecificData_Resp
    McrdSpecificData?: McrdSpecificData_Resp
    DiscSpecificData?: DiscSpecificData_Resp
    AmexSpecificData?: AmexSpecificData_Resp
    MarketSpecificData?: MarketSpecificData // <= 1 characters, This field indicates market type (vertical) of the merchant.
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    CustomerInformation?: CustomerInformation_Resp
    SignatureCaptureToken?: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfo_Resp
    SettlementData?: SettlementData_Resp
    PrivateLabelData?: PrivateLabelData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    AuthorizationSource?: AuthorizationSource // 1 character, Source of authorizing entity
    // Note: Values could be added at any time and the acquiring entity should not throw an exception for unknown values.
    AccountUpdaterData?: AccountUpdaterData_Resp
    SynchronyData?: SynchronyData_Resp
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AmazonPayData?: AmazonPayData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    BenefitCardServicesData?: BenefitCardServicesData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const CreditAuthSchema = yup.object({
  creditauth: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      'Multi-clearingData': MultiClearingDataSchema.default(undefined).optional(),
      EMVData: EMVDataSchema.default(undefined).optional(),
      AddressVerificationData: AddressVerificationDataSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      PINProcessingData: PINProcessingDataSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      'E-commerceData': ECommerceDataSchema.default(undefined).optional(),
      BillPaymentData: BillPaymentDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(),
      VisaSpecificData: VisaSpecificDataSchema.default(undefined).optional(),
      McrdSpecificData: McrdSpecificDataSchema.default(undefined).optional(),
      DiscSpecificData: DiscSpecificDataSchema.default(undefined).optional(),
      AmexSpecificData: AmexSpecificDataSchema.default(undefined).optional(),
      MarketSpecificData: MarketSpecificDataSchema.default(undefined).optional(),
      Duration: yup.string().max(2).optional(), // <= 2 characters Hotel/Auto Rental duration.
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().required(),
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      SoftDescriptorData: SoftDescriptorDataSchema.default(undefined).optional(),
      WalletId: yup.string().max(3).optional(), // <= 3 characters, MasterCard-assigned Wallet ID.
      OperatorEmployee: yup.string().max(9).optional(), // <= 9 characters, Employee Number/Clerk ID/Operator ID
      BatchNumber: yup.string().max(6).optional(), // <= 6 characters, Number representing a grouping (batch) of transactions.
      CustomerInformation: CustomerInformationSchema.default(undefined).optional(),
      PrestigiousPropertyIND: PrestigiousPropertyINDSchema.default(undefined).optional(), // <= 1 characters, Prestigious Property Indicator. Valid values are:
      ReversalAdviceReasonCd: ReversalAdviceReasonCdSchema.default(undefined).optional(), // <= 3 characters, For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      AlternateMerchantID: AlternateMerchantIDSchema.default(undefined).optional(),
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      Level3Data: yup.array().max(25).of(Level3DataSchema), // [ 0 .. 25 ] items
      PaymentSenderData: PaymentSenderDataSchema.default(undefined).optional(),
      PrivateLabelData: PrivateLabelDataSchema.default(undefined).optional(),
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // <= 2 characters, Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      LodgingData: LodgingDataSchema.default(undefined).optional(),
      VehicleRentalData: VehicleRentalDataSchema.default(undefined).optional(),
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      SynchronyData: SynchronyDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      AmazonPayData: AmazonPayDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      BenefitCardServicesData: BenefitCardServicesDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys. The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      MastercardDSRPCryptogram: yup.string().max(28).optional(), // <= 28 characters, Base64 encoded cryptogram data
      MastercardRemoteCommerceAcceptorIdentifier: yup.string().max(150).optional(), // <= 150 characters, Business website URL or reverse domain name as presented to the consumer during checkout. Base64 encoded.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
      AssuredPaymentsUserAccountData: AssuredPaymentsUserAccountDataSchema.default(undefined).optional(), //  (AssuredPaymentsUserAccountData_0301)
      AssuredPaymentsPurchaseInformation: AssuredPaymentsPurchaseInformationSchema.default(undefined).optional(), // (AssuredPaymentsPurchaseInformation_0301)
      AssuredPaymentsItemData: yup.array().max(10).of(AssuredPaymentsItemSchema).optional(), // Array of (AssuredPaymentsItemData_0301) [ 0 .. 10 ] items
      AssuredPaymentsGeneralData: AssuredPaymentsGeneralDataSchema.default(undefined).optional(), // (AssuredPaymentsGeneralData_0301)
      AssuredPaymentsMembershipData: AssuredPaymentsMembershipDataSchema.default(undefined).optional(), //  (AssuredPaymentsMembershipData_0301)
      AssuredSellerData: AssuredSellerDataSchema.default(undefined).optional(), // (AssuredSellerData_0301)
      AssuredSubscriptionData: AssuredSubscriptionDataSchema.default(undefined).optional(), // (AssuredSubscriptionData_0301)
    })
    .required(),
})

export type CreditAuth = yup.InferType<typeof CreditAuthSchema>

/**
 * Validate that a credit authorization object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateCreditAuth(creditAuth: CreditAuth) {
  return CreditAuthSchema.validateSync(creditAuth, { abortEarly: false })
}

export interface CreditAuthResponse {
  creditauthresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalances_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfo_Resp
    EMVData?: EMVData_Resp
    AddressVerificationData?: AddressVerificationData_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    TerminalData?: TerminalData_Resp
    'E-commerceData'?: ECommerceData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    VisaSpecificData?: VisaSpecificData_Resp
    McrdSpecificData?: McrdSpecificData_Resp
    DiscSpecificData?: DiscSpecificData_Resp
    AmexSpecificData?: AmexSpecificData_Resp
    MarketSpecificData?: MarketSpecificData // <= 1 characters, This field indicates market type (vertical) of the merchant. Valid values are:
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    CustomerInformation?: CustomerInformation_Resp
    SignatureCaptureToken?: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfo_Resp
    SettlementData?: SettlementData_Resp
    PrivateLabelData?: PrivateLabelData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    AuthorizationSource?: AuthorizationSource // <= 1 characters, Source of authorizing entity
    // Note: Values could be added at any time and the acquiring entity should not throw an exception for unknown values.
    AccountUpdaterData?: AccountUpdaterData_Resp
    SynchronyData?: SynchronyData_Resp
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AmazonPayData?: AmazonPayData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    BenefitCardServicesData?: BenefitCardServicesData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    CheckpointInformation?: string // <= 46 characters, This field is returned when we receive a credit card pre-auth EMD settlement request that gets converted to debit. This checkpoint information must be returned in the EMD settlement file for each shipment/completion to be processed.
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const CreditCompletionSchema = yup.object({
  creditcompletion: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesCompletionSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      'Multi-clearingData': MultiClearingDataSchema.default(undefined).optional(),
      EMVData: EMVDataSchema.default(undefined).optional(),
      AddressVerificationData: AddressVerificationDataSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      'E-commerceData': ECommerceDataSchema.default(undefined).optional(),
      BillPaymentData: BillPaymentDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // <= 4 characters, Value used to force the transaction to a specific entity.Schema.optional(),
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(),
      VisaSpecificData: VisaSpecificDataSchema.default(undefined).optional(),
      McrdSpecificData: McrdSpecificDataSchema.default(undefined).optional(),
      DiscSpecificData: DiscSpecificDataSchema.default(undefined).optional(),
      AmexSpecificData: AmexSpecificDataSchema.default(undefined).optional(),
      MarketSpecificData: MarketSpecificDataSchema.default(undefined).optional(), //  <= 1 characters This field indicates market type (vertical) of the merchant. Valid values are:
      Duration: yup.string().max(2).optional(), // <= 2 characters, Hotel/Auto Rental duration.
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().max(20).optional(), // <= 20 characters, The full Merchant ID assigned by Worldpay (i.e. MID). For STP transactions, this is the 12-digit assigned STP MID; otherwise, the full MID should be sent.
      // Note: 9-digit MIDs are grandfathered and will be appended with 4445 by Worldpay during processing.
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      SoftDescriptorData: SoftDescriptorDataSchema.default(undefined).optional(),
      WalletId: yup.string().max(3).optional(), // <= 3 characters, MasterCard-assigned Wallet ID.
      OperatorEmployee: yup.string().max(9).optional(), // <= 9 characters, Employee Number/Clerk ID/Operator ID
      BatchNumber: yup.string().max(6).optional(), // <= 6 characters, Number representing a grouping (batch) of transactions.
      CustomerInformation: CustomerInformationSchema.default(undefined).optional(),
      PrestigiousPropertyIND: PrestigiousPropertyINDSchema.default(undefined).optional(), //  <= 1 characters, Prestigious Property Indicator. Valid values are:
      // Blank - Unspecified
      // D - $500 Limit
      // B - $1000 Limit
      // S - $1500 Limit

      ReversalAdviceReasonCd: ReversalAdviceReasonCdSchema.default(undefined).optional(), // <= 3 characters For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      // Valid values are:
      // 000 - Normal Reversal
      // 002 - Timeout Reversal
      // 003 - Syntax
      // 005 - Clerk Cancel
      // 006 - Customer Cancel
      // 010 - Previously Authorized

      AlternateMerchantID: AlternateMerchantIDSchema.default(undefined).optional(),
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      Level3Data: yup.array().max(25).of(Level3DataSchema).optional(), // [ 0 .. 25 ] items
      PaymentSenderData: PaymentSenderDataSchema.default(undefined).optional(),
      PrivateLabelData: PrivateLabelDataSchema.default(undefined).optional(),
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // <= 2 characters, Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      // Valid values are:
      // FP - Force Post (Host Capture Advice completions, credit card completions, etc.)
      // RV - Reversal
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).optional(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      LodgingData: LodgingDataSchema.default(undefined).optional(),
      VehicleRentalData: VehicleRentalDataSchema.default(undefined).optional(),
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      SynchronyData: SynchronyDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      AmazonPayData: AmazonPayDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      BenefitCardServicesData: BenefitCardServicesDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys.
      // The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      MastercardDSRPCryptogram: yup.string().max(28).optional(), // <= 28 characters, Base64 encoded cryptogram data
      MastercardRemoteCommerceAcceptorIdentifier: yup.string().max(150).optional(), // <= 150 characters, Business website URL or reverse domain name as presented to the consumer during checkout. Base64 encoded.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
      AssuredPaymentsUserAccountData: AssuredPaymentsUserAccountDataSchema.default(undefined).optional(),
      AssuredPaymentsPurchaseInformation: AssuredPaymentsPurchaseInformationSchema.default(undefined).optional(),
      AssuredPaymentsItemData: yup.array().max(10).of(AssuredPaymentsItemSchema).optional(), // [ 0 .. 10 ] items
      AssuredPaymentsGeneralData: AssuredPaymentsGeneralDataSchema.default(undefined).optional(),
      AssuredPaymentsMembershipData: AssuredPaymentsMembershipDataSchema.default(undefined).optional(),
      AssuredSellerData: AssuredSellerDataSchema.default(undefined).optional(),
      AssuredSubscriptionData: AssuredSubscriptionDataSchema.default(undefined).optional(),
    })
    .required(),
})

export type CreditCompletion = yup.InferType<typeof CreditCompletionSchema>

/**
 * Validate that a credit completion object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateCreditCompletion(creditCompletion: CreditCompletion) {
  return CreditCompletionSchema.validateSync(creditCompletion, { abortEarly: false })
}

export interface CreditCompletionResponse {
  creditcompletionresponse: {
    ReturnCode: ReturnCode // <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalances_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfo_Resp
    EMVData?: EMVData_Resp
    AddressVerificationData?: AddressVerificationData_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    'E-commerceData'?: ECommerceData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    VisaSpecificData?: VisaSpecificData_Resp
    McrdSpecificData?: McrdSpecificData_Resp
    DiscSpecificData?: DiscSpecificData_Resp
    AmexSpecificData?: AmexSpecificData_Resp
    MarketSpecificData?: MarketSpecificData //  <= 1 characters, This field indicates market type (vertical) of the merchant. Valid values are:
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    CustomerInformation?: CustomerInformation_Resp
    SignatureCaptureToken?: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfo_Resp
    SettlementData?: SettlementData_Resp
    PrivateLabelData?: PrivateLabelData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters, This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    AuthorizationSource?: AuthorizationSource // <= 1 characters, Source of authorizing entity
    // Note: Values could be added at any time and the acquiring entity should not throw an exception for unknown values.
    AccountUpdaterData?: AccountUpdaterData_Resp
    SynchronyData?: SynchronyData_Resp
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AmazonPayData?: AmazonPayData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    BenefitCardServicesData?: BenefitCardServicesData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}

const CreditRefundSchema = yup.object({
  creditrefund: yup
    .object({
      MiscAmountsBalances: MiscAmountsBalancesSchema.required(),
      AccountCodesAndData: AccountCodesAndDataSchema.default(undefined).optional(),
      CardInfo: CardInfoSchema.default(undefined).optional(),
      'Multi-clearingData': MultiClearingDataSchema.default(undefined).optional(),
      EMVData: EMVDataSchema.default(undefined).optional(),
      AddressVerificationData: AddressVerificationDataSchema.default(undefined).optional(),
      CardVerificationData: CardVerificationDataSchema.default(undefined).optional(),
      EncryptionTokenData: EncryptionTokenDataSchema.default(undefined).optional(),
      DeviceInformation: DeviceInformationSchema.default(undefined).optional(),
      PINProcessingData: PINProcessingDataSchema.default(undefined).optional(),
      TerminalData: TerminalDataSchema.default(undefined).optional(),
      'E-commerceData': ECommerceDataSchema.default(undefined).optional(),
      BillPaymentData: BillPaymentDataSchema.default(undefined).optional(),
      GatewayRoutingId: GatewayRoutingIdSchema.default(undefined).optional(), // (GatewayRoutingId_Type) <= 4 characters, Value used to force the transaction to a specific entity.
      ProcFlagsIndicators: ProcFlagsIndicatorsSchema.default(undefined).optional(),
      VisaSpecificData: VisaSpecificDataSchema.default(undefined).optional(),
      McrdSpecificData: McrdSpecificDataSchema.default(undefined).optional(),
      DiscSpecificData: DiscSpecificDataSchema.default(undefined).optional(),
      AmexSpecificData: AmexSpecificDataSchema.default(undefined).optional(),
      MarketSpecificData: MarketSpecificDataSchema.default(undefined).optional(), // <= 1 characters, This field indicates market type (vertical) of the merchant. Valid values are:
      Duration: yup.string().max(2).optional(), // <= 2 characters, Hotel/Auto Rental duration.
      STPData: STPDataSchema.default(undefined).optional(),
      MerchantSpecificData: MerchantSpecificDataSchema.default(undefined).optional(),
      ReferenceTraceNumbers: ReferenceTraceNumbersSchema.default(undefined).optional(),
      WorldPayMerchantID: yup.string().max(20).required(), // <= 20 characters, The full Merchant ID assigned by Worldpay (i.e. MID). For STP transactions, this is the 12-digit assigned STP MID; otherwise, the full MID should be sent.
      // Note: 9-digit MIDs are grandfathered and will be appended with 4445 by Worldpay during processing.
      UserDefinedData: UserDefinedDataSchema.default(undefined).optional(),
      SoftDescriptorData: SoftDescriptorDataSchema.default(undefined).optional(),
      WalletId: yup.string().max(3).optional(), // <= 3 characters, MasterCard-assigned Wallet ID.
      OperatorEmployee: yup.string().max(9).optional(), // <= 9 characters, Employee Number/Clerk ID/Operator ID
      BatchNumber: yup.string().max(6).optional(), // <= 6 characters, Number representing a grouping (batch) of transactions.
      CustomerInformation: CustomerInformationSchema.default(undefined).optional(),
      PrestigiousPropertyIND: PrestigiousPropertyINDSchema.default(undefined).optional(), // <= 1 characters, Prestigious Property Indicator. Valid values are:
      ReversalAdviceReasonCd: ReversalAdviceReasonCdSchema.default(undefined).optional(), // <= 3 characters, For reversal messages, this field contains the reason the reversal was generated. For advice messages, it contains the reason or nature of the advice. If a value is not provided, Worldpay will use default values.
      AlternateMerchantID: AlternateMerchantIDSchema.default(undefined).optional(),
      DynamicCurrConvInfo: DynamicCurrConvInfoSchema.default(undefined).optional(),
      Level3Data: yup.array().of(Level3DataSchema).optional(), //  [ 0 .. 25 ] items
      PaymentSenderData: PaymentSenderDataSchema.default(undefined).optional(),
      PrivateLabelData: PrivateLabelDataSchema.default(undefined).optional(),
      AuthorizationType: AuthorizationTypeSchema.default(undefined).optional(), // <= 2 characters, Provides a means for the transaction disposition to be changed from standard authorization to forced conditions.
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
      // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
      // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
      LocalDateTime: yup.string().max(19).optional(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      LodgingData: LodgingDataSchema.default(undefined).optional(),
      VehicleRentalData: VehicleRentalDataSchema.default(undefined).optional(),
      OnlineShipToAddress: OnlineShipToAddressSchema.default(undefined).optional(),
      OnlineBillToAddress: OnlineBillToAddressSchema.default(undefined).optional(),
      OnlineOrderCustomerData: OnlineOrderCustomerDataSchema.default(undefined).optional(),
      SynchronyData: SynchronyDataSchema.default(undefined).optional(),
      FisLoyaltyData: FisLoyaltyDataSchema.default(undefined).optional(),
      AmazonPayData: AmazonPayDataSchema.default(undefined).optional(),
      PriorityRouting: yup.string().max(400).optional(), // <= 400 characters, Acquirers use this field to indicate the order in which a transaction can choose to route to networks. It contains a series of 4 character acronyms that can be selected for the transaction. Each acronym should be padded on the right with blanks if necessary. For a listing of available networks, please contact your Worldpay Relationship Manager.
      AdditionalFraudData: AdditionalFraudDataSchema.default(undefined).optional(),
      BenefitCardServicesData: BenefitCardServicesDataSchema.default(undefined).optional(),
      EncryptedData: yup.string().max(8000).optional(), // <= 8000 characters, Contains encrypted JSON fields in the form of a JWE Token using RSA asymmetric encryption. Requires exchange of public keys.
      // The Authentication HTTP header with a valid AuthID is required for any request messages containing this field.
      TraceData: yup.string().max(255).optional(), // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
      // Use 1:
      // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
      MastercardDSRPCryptogram: yup.string().max(28).optional(), // <= 28 characters, Base64 encoded cryptogram data
      MastercardRemoteCommerceAcceptorIdentifier: yup.string().max(150).optional(), // <= 150 characters, Business website URL or reverse domain name as presented to the consumer during checkout. Base64 encoded.
      AdditionalPOSData: AdditionalPOSDataSchema.default(undefined).optional(),
      AssuredPaymentsUserAccountData: AssuredPaymentsUserAccountDataSchema.default(undefined).optional(),
      AssuredPaymentsPurchaseInformation: AssuredPaymentsPurchaseInformationSchema.default(undefined).optional(),
      AssuredPaymentsItemData: yup.array().of(AssuredPaymentsItemSchema).max(10).optional(), //  [ 0 .. 10 ] items
      AssuredPaymentsGeneralData: AssuredPaymentsGeneralDataSchema.default(undefined).optional(),
      AssuredPaymentsMembershipData: AssuredPaymentsMembershipDataSchema.default(undefined).optional(),
      AssuredSellerData: AssuredSellerDataSchema.default(undefined).optional(),
      AssuredSubscriptionData: AssuredSubscriptionDataSchema.default(undefined).optional(),
    })
    .required(),
})
export type CreditRefund = yup.InferType<typeof CreditRefundSchema>

/**
 * Validate that a credit refund object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateCreditRefund(creditRefund: CreditRefund) {
  return CreditRefundSchema.validateSync(creditRefund, { abortEarly: false })
}

export interface CreditRefundResponse {
  creditrefundresponse: {
    ReturnCode: ReturnCode //  <= 4 characters, This parameter indicates the success of the message. Any non-zero value means the transactions failed.
    ReasonCode: string // <= 4 characters, This parameter contains a value you can use to pinpoint exactly where the error occurred.
    ReturnText?: string // <= 60 characters, This field is only present when ReturnCode contains a value other than zero. When present, it describes the transaction's failure or error. This field is informational only. Worldpay can change the text at any time. It should not be used as a key in transaction processing.
    MiscAmountsBalances?: MiscAmountsBalances_Resp
    AccountCodesAndData?: AccountCodesAndData
    CardInfo?: CardInfo_Resp
    EMVData?: EMVData_Resp
    AddressVerificationData?: AddressVerificationData_Resp
    CardVerificationData?: CardVerificationData_Resp
    EncryptionTokenData?: EncryptionTokenData_Resp
    TerminalData?: TerminalData_Resp
    'E-commerceData'?: ECommerceData_Resp
    ProcFlagsIndicators?: ProcFlagsIndicators_Resp
    VisaSpecificData?: VisaSpecificData_Resp
    McrdSpecificData?: McrdSpecificData_Resp
    DiscSpecificData?: DiscSpecificData_Resp
    AmexSpecificData?: AmexSpecificData_Resp
    MarketSpecificData?: MarketSpecificData // <= 1 characters, This field indicates market type (vertical) of the merchant. Valid values are:
    STPData?: STPData_Resp
    ReferenceTraceNumbers?: ReferenceTraceNumbers_Resp
    UserDefinedData?: UserDefinedData
    CustomerInformation?: CustomerInformation_Resp
    SignatureCaptureToken?: string // <= 8 characters, Signature Capture Token
    DynamicCurrConvInfo?: DynamicCurrConvInfo_Resp
    SettlementData?: SettlementData_Resp
    PrivateLabelData?: PrivateLabelData_Resp
    WorldPayRoutingData?: WorldPayRoutingData_Resp
    APITransactionID?: string // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
    // Note: Worldpay uses this value explicitly for idempotency. If the API Transaction ID matches back to an original transaction, and it's not part of a specifically coded transaction sequence (auth/completion, multi-clearing, auth/reversal, etc.), then Worldpay will assume that the transaction is the same transaction as a previous one and send back the exact same response. Worldpay does no other edits on the message to validate the transaction is a duplicate resubmitted request.
    // This value should not be repeated within a 30-day period to ensure that transactions are not erroneously matched via idempotency.
    // This is a fixed length 16 field, Worldpay will pad on the left with zeros.
    ResponseCode?: ResponseCode // <= 3 characters, This field indicates the result of a request, approval or decline if the transaction is able to be fully processed.
    // Note: Worldpay can add response codes at any time. Any response code not recognized should be treated as a decline.
    AuthorizationSource?: AuthorizationSource // <= 1 characters, Source of authorizing entity
    // Note: Values could be added at any time and the acquiring entity should not throw an exception for unknown values.
    AccountUpdaterData?: AccountUpdaterData_Resp
    SynchronyData?: SynchronyData_Resp
    TransactionReceiptText?: string // <= 1000 characters, This field contains product specific receipt data formatted specifically for that product.
    FisLoyaltyData?: FisLoyaltyData_Resp
    AmazonPayData?: AmazonPayData_Resp
    AdditionalFraudData?: AdditionalFraudData_Resp
    BenefitCardServicesData?: BenefitCardServicesData_Resp
    ErrorInformation?: ErrorInformation_Resp
    RawNetworkData?: RawNetworkData_Resp
    TraceData?: string // <= 255 characters, The trace data provides a means to pass data back and forth between acquirer and processor. Each specific use case is listed below.
    // Use 1:
    // EBT processors can return specific information pertaining to the disposition of the transaction such as response text and transaction identifiers. For SNAP and online cash EBT returns, this value must be retained on purchases and provided on the return to allow the EBT network to match the transactions.
  }
}
