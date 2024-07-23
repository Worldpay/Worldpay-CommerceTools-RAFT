import * as yup from 'yup'

/**
 * The boolean string representing yes/no or true/false
 */
export enum BooleanString {
  YES = 'Y',
  NO = 'N',
}

export const BooleanStringSchema = yup.mixed<BooleanString>().oneOf(Object.values(BooleanString)).optional()

export type ResponseCode =
  | '000' // APPROVE
  | '001' // REFER TO ISSUER
  | '002' // VOID UNSUCCESSFUL
  | '003' // HONOR WITH ID
  | '004' // CARD EXPIRED
  | '005' // DO NOT HONOR
  | '006' // PIN TRY LIMIT EXCEEDED
  | '007' // INVALID MERCHANT ID
  | '008' // INVALID AMOUNT
  | '009' // INVALID ACCOUNT
  | '010' // PARTIAL APPROVAL
  | '011' // INVALID TRANSACTION
  | '012' // INVALID PIN
  | '013' // INVALID CARD SECURITY CODE
  | '014' // NETWORK UNAVAILABLE
  | '015' // INVALID CURRENCY CODE
  | '016' // DECLINE - PICK UP CARD
  | '017' // DECLINE - PICK UP CARD - FRAUD
  | '018' // INVALID CARD NUMBER
  | '019' // SUSPECTED FRAUD - CALL CENTER
  | '020' // RESTRICTED CARD
  | '021' // DECLINE - PICK UP LOST CARD
  | '022' // DECLINE - PICK UP STOLEN CARD
  | '023' // DECLINED - OVER LIMIT - ACCOUNT
  | '024' // INVALID TERMINAL ID
  | '025' // DO NOT HONOR - SUSPECTED FRAUD
  | '026' // EXCEEDS WITHDRAWAL LIMIT
  | '027' // NO DATA AVAILABLE
  | '028' // SECURITY VIOLATION
  | '029' // ORIGINAL AMOUNT INCORRECT
  | '030' // FORMAT ERROR
  | '031' // EXCEEDS WITHDRAWAL COUNT LIMIT
  | '032' // HARD CAPTURE
  | '033' // RESPONSE RECEIVED TOO LATE
  | '034' // UNABLE TO ROUTE TRANSACTION
  | '035' // DECLINED - TRANSACTION IN VIOLATION OF LAW
  | '036' // DUPLICATE REQUEST
  | '037' // DUPLICATE REVERSAL
  | '038' // NO SUCH ISSUER
  | '039' // INSUFFICIENT FUNDS
  | '040' // EXCEEDS PURCHASE LIMITS
  | '041' // RE-ENTER
  | '042' // CALL CENTER
  | '043' // ENTER DOB AND RE-SEND
  | '044' // CAN'T CONVERT CHECK
  | '045' // INVALID DATE
  | '046' // CRYPTOGRAPHIC ERROR FOUND IN PIN OR CVV
  | '047' // TIME LIMIT FOR A PRE-AUTH IS TOO LONG
  | '048' // SYSTEM MALFUNCTION
  | '049' // PIN MISSING
  | '050' // SWITCH COMMUNICATION ERROR
  | '051' // UNABLE TO LOCATE A MATCHING ORIGINAL TRANSACTION
  | '052' // CARD NOT ACTIVATED YET
  | '053' // CARD ALREADY ACTIVATED
  | '054' // VELOCITY: EXCEEDS COUNT
  | '055' // VELOCITY: EXCEEDS AMOUNT
  | '056' // VELOCITY: EXCEEDS COUNT AND AMOUNT
  | '057' // VELOCITY: VELOCITY NEGATIVE
  | '058' // VELOCITY: VELOCITY FRAUD RECORD
  | '059' // VELOCITY: NO ZIP CODE MATCH
  | '060' // CARD ESCHEATED
  | '061' // MERCHANT DEPLETED
  | '062' // FRAUD SYSTEM DETECTED UNUSUAL ACTIVITY
  | '063' // EMV MISSING OR INVALID TAG DATA
  | '064' // LINE TYPE NOT VALID FOR THIS TERMINAL
  | '065' // DECRYPTION/TOKENIZATION ERROR
  | '066' // REGISTRATION EVENT
  | '067' // APPLICATION TRANSACTION COUNTER ERROR
  | '068' // CARDHOLDER VERIFICATION FAILURE - TVR
  | '069' // ERROR IDENTIFYING CHIP APPLICATION
  | '070' // MAC NOT DETECTED
  | '071' // INTERNAL MAC PROCESSING ERROR
  | '072' // INVALID MAC DETECTED
  | '073' // DECRYPTION NOT POSSIBLE - MERCHANT
  | '074' // DECRYPTION NOT POSSIBLE - WORLDPAY
  | '075' // PROBLEM CALLING ENCRYPTION
  | '076' // MALFORMED MESSAGE RECEIVED
  | '077' // POSSIBLE DECRYPTION FAILURE
  | '078' // DETOKENIZATION FAILED
  | '079' // LOW TOKEN CONVERSION ERROR
  | '080' // RESERVED
  | '100' // IDEMPOTENCY DETECTED A DUPLICATE REQUEST BUT THERE WAS A MESSAGE TYPE MISMATCH BETWEEN WHAT IT LOCATED AND WHAT WAS SENT IN.
  | '101' // A REQUEST FOR PINLESS CONVERSION FAILED TO FIND A VALID ROUTING OPTION.
  | string

export enum ReturnCode {
  Successful = '0000',
  EditErrorOnInput = '0004',
  LogicError = '0008',
  SystemIssue = '0012',
}

export const AmountString = yup
  .string()
  .max(13)
  .test(
    'Amount_Type',
    'String number must conform to "^[+-]?[0-9]{1,9}[.[0-9]{2}]]?$"',
    (value) => value === undefined || /^[+-]?[0-9]{1,9}(\.[0-9]{2})?$/.test(value),
  )
export type AmountStringType = yup.InferType<typeof AmountString>

export const DynamicCurrConvInfoSchema = yup.object({
  USEConvertedCurrency: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the customer at the terminal wishes to use the rates returned to the terminal.
  DCCRateRequestFirst: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether a DCC rate request should be performed before attempting to complete the current transaction.
  DCCConvertedAmount: yup.string().max(13).optional(), // <= 13 characters, Amount converted to the cardholder's currency (DCC processing)
  DCCConversionRate: yup.string().max(8).optional(), // <= 8 characters, Rate used to convert the currency.
  DCCCurrencyCode: yup.string().max(3).optional(), // <= 3 characters, Currency code of the cardholder.
})
export type DynamicCurrConvInfo = yup.InferType<typeof DynamicCurrConvInfoSchema>

export enum AuthorizationType {
  ForcePost = 'FP', // Force Post (Host Capture Advice completions, credit card completions, etc.)
  Reversal = 'RV', // Reversal
}
export const AuthorizationTypeSchema = yup.mixed<AuthorizationType>().oneOf(Object.values(AuthorizationType)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export const MiscAmountsBalancesSchema = yup.object({
  TransactionAmount: AmountString.required(),
  CashBackAmount: AmountString.optional(),
  SurchargeAmount: AmountString.optional(),
  ConvenienceFEE: AmountString.optional(),
  TIPAmount: AmountString.optional(),
  DispensedAmount: AmountString.optional(),
  SalesTAXAmount: AmountString.optional(),
  CumulativeAmount: AmountString.optional(),
  PaymentTrailingAmt: AmountString.optional(),
  OPTUMAmount: AmountString.optional(),
})

export const CardInfoSchema = yup.object({
  PAN: yup.string().optional(),
  TRACK_2: yup.string().optional(),
  TRACK_1: yup.string().optional(),
  ExpirationDate: yup
    .string()
    .test('YYMM format', 'Format must be YYMM', (value) => value === undefined || /[0-9][0-9][01][0-9]/.test(value))
    .optional(), // YYMM
  CardSequenceNumber: yup.string().optional(),
  CreditCardProdType: yup.string().optional(),
})

export type CardInfo = yup.InferType<typeof CardInfoSchema>

export const MultiClearingDataSchema = yup.object({
  'SequenceNumber_00-99': yup
    .string()
    .test('Numerical', 'Must be number 00-99', (value) => value !== undefined && /[0-9]{2}/.test(value))
    .required(),
  'SequenceCount_01-99': yup
    .string()
    .test('Numerical', 'Must be number 01-99', (value) => value !== undefined && /([1-9][0-9])|(0[1-9])/.test(value))
    .required(),
  FinalShipment: BooleanStringSchema, // Y/N
})

export enum AccountSelected {
  CreditCard = 'CC', // Credit card
  Checkint = 'CK', // Checking
  CashBenefits = 'CS', // Cash Benefits
  Default = 'DE', // Default
  FoodStamps = 'FS', // Food Stamps
  GiftCard = 'GC', // Gift Card
  Savings = 'SV', // Savings
  WIC = 'WI', // WIC
}
const AccountSelectedSchema = yup.string().oneOf(Object.values(AccountSelected))

export const AccountCodesAndDataSchema = yup.object({
  FromAccountSelected: AccountSelectedSchema.default(undefined).optional(),
  ToAccountSelected: AccountSelectedSchema.default(undefined).optional(),
})
export type AccountCodesAndData = yup.InferType<typeof AccountCodesAndDataSchema>

export enum Cvv2Cvc2CIDIndicator {
  BypassedOrNotGiven = '0', // The CVV2/CVC2/CID value was bypassed or not given.
  Present = '1', // The CVV2/CVC2/CID value is present.
  Illegible = '2', // The CVV2/CVC2/CID value is illegible.
  NotOnCard = '9', // The CVV2/CVC2/CID value is not on the card.
}
export const Cvv2Cvc2CIDIndicatorSchema = yup.mixed<Cvv2Cvc2CIDIndicator>().oneOf(Object.values(Cvv2Cvc2CIDIndicator)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export const P2PEncryptionMethodValues = [
  'A', // Voltage/Default Encryption
  'D', // DUKPT Field Encryption
  'E', // Verifone ADE
  'L', // Verifone Level 4
  'O', // On Guard
  'U', // Verifone
  'V', // Voltage
  'P', // Onguard SDE
]
export type EncryptionTokenData = yup.InferType<typeof EncryptionTokenDataSchema>

export type DeviceInformation = yup.InferType<typeof DeviceInformationSchema>

export type MultiClearingData = yup.InferType<typeof MultiClearingDataSchema>

export const CardVerificationDataSchema = yup.object({
  Cvv2Cvc2CIDValue: yup.string().max(4).optional(), // <= 4 characters, The value embossed on the card for security purposes.
  Cvv2Cvc2CIDIndicator: Cvv2Cvc2CIDIndicatorSchema.default(undefined).optional(),
})
export type CardVerificationData = yup.InferType<typeof CardVerificationDataSchema>

export const P2PEncryptionMethodSchema = yup.string().oneOf(P2PEncryptionMethodValues)

export const EncryptionTokenDataSchema = yup.object({
  P2PEncryptedTRACK_1: yup.string().max(80).optional(), // <= 80 characters, This field is used to transmit the encrypted version of the Track 1
  P2PEncryptedTRACK_2: yup.string().max(80).optional(), // <= 80 characters, This field is used to transmit the encrypted version of the Track 2
  P2PKeySequenceNumber: yup.string().max(20).optional(), // <= 20 characters, This field contains the KSN used for field encryption. DUKPT Field Encryption only.
  P2PEncryptedPAN: yup.string().max(20).optional(), // <= 20 characters, This field is used to transmit the encrypted version of the PAN
  P2PEncryptedCVV2: yup.string().max(25).optional(), // <= 25 characters, Voltage and OnGuard Only. This field contains the encrypted version of the CVV2.
  // Voltage: This is a numeric string up to 16 digits in length, like 2484728956105345.
  // OnGuard: This would be 3 or 4 digits, just like a regular CVV2 / CID value (274 or 3751).
  P2PEncryptedEXPDate: yup.string().max(4).optional(), // <= 4 characters, OnGuard Only. This field contains the encrypted version of the expiration date.
  P2PEncryptedPANExt: yup.string().max(240).optional(), // <= 240 characters, This field is used in place of the P2P Encrypted PAN and Track fields for transaction authorization. DUKPT Field Encryption Only.
  P2PEncryptedTRKExt: yup.string().max(240).optional(), // <= 240 characters, This field is used in place of the P2P Encrypted PAN and Track fields for transaction authorization. DUKPT Field Encryption Only.
  LowValueCVV2Token: yup.string().max(18).optional(), // <= 18 characters, This is a temporary token with expiration time that used in conjunction with eProtect (a card not present or eComm security product). In a card not present online environment a Low Value token/registration ID is presented in lieu of PAN and optional CVV information.
  P2PEncryptionMethod: P2PEncryptionMethodSchema.default(undefined).optional(), // <= 1 characters, This field identifies the field encryption vendor/product.
  P2PKeyData: yup.string().max(500).optional(), // <= 500 characters, The field contains the key data used to encrypt P2P encrypted fields.
  // For Voltage transactions, this field contains the Voltage encryption key, presented in binary format.
  // For Verifone VTP non-transparent encryption, this field contains the eparms data used for field encryption, which is presented in character format.
  // For OnGuard encryption, this field contains the character representation of the KSN used for field encryption.
  TokenizationMethod: yup.string().max(1).optional(), // <= 1 characters, The type of Worldpay tokenization to use.
  // Valid Values:
  // A - Voltage
  TokenDateTime: yup.string().max(14).optional(), // <= 14 characters, For stand-alone token-from-card and card-from-token transactions, you can use the token date and time in place of a token ID. This applies to Worldpay Legacy Reverse Crypto only. A new OmniToken does not require a token date and ID.
  TokenizedPAN: yup.string().max(22).optional(), // <= 22 characters, This field contains the tokenized PAN. When you initiate a transaction using a token, the PAN is not included in the regular PAN field. Worldpay recommends that merchants provide the expiration date with every transaction that is initiated with a token. Using the expiration date is one of the simplest methods for fraud prevention in place, because they are mandated by operating agreements with card brands to help protect against fraud. Issuing banks may likely decline online purchases and purchases over the phone that do not contain expiration date. For high value token to low value token transactions, Worldpay requires this field.
  TokenID: yup.string().max(6).optional(), // <= 6 characters, The field contains the token ID, which is included with the token in responses for Worldpay Legacy Reverse Crypto merchants only. Token initiated request messages may or may not include it. For merchants using the new OmniToken, response messages only use the token ID to indicate a tokenization failure. In this case, the token value is not present, and the token ID contains ZZZZZZ.
  LowValueToken: yup.string().max(20).optional(), // <= 20 characters, The field contains a temporary token with an expiration time used with eProtect (a card not present or eComm security product). In a card not present online environment a low value token is presented in lieu of PAN and optional CVV information.
  WPTokenRequested: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the merchant would like a Worldpay token generated for the transaction.
  // Token ID is for Worldpay Legacy Crypto only. Token ID is not included with the new OmniToken.
  NTWKTokenRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the merchant would like to receive network token information returned in the response.
  ReturnClearPan: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the merchant would like the requested card results to be returned as a clear PAN.
  // This is typically used in conjunction with Worldpay encryption services products.
  ReturnMaskedPan: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the merchant would like the requested card results to be returned as a masked PAN.
  // This is typically used in conjunction with Worldpay encryption services products.
  ReturnPanLast4: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the merchant would like the requested card results to be returned with the last 4 digits of the PAN.
  // This is typically used in conjunction with Worldpay encryption services products. However, it can also be used to restrict the PAN Mapping PAN from being returned to the merchant should they not wish to receive it.
  ReturnTokenizedPan: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the merchant would like the requested card results to be returned as a tokenized PAN.
  // This is typically used in conjunction with Worldpay encryption services products.
  CallIdToken: yup.string().max(999).optional(), // <= 999 characters, Specialized token ID used for registering and retrieving accounts with external processors. Please contact your Worldpay representative for specific uses.
  ReturnEmbeddedTMSData: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the merchant would like to receive all available data associated with the Worldpay embedded or intelligent scheme token management service (TMS) if applicable.
  // The list of fields include:
  // - EmbeddedNetworkToken
  // - EmbeddedNetworkTokenCryptogram
  // - VisaAdditionalTokenInfo
  // - EmbeddedNetworkTokenResult

  // Note: The merchant must be signed up for the Worldpay TMS product.
  BypassEmbeddedNetworkToken: BooleanStringSchema, // <= 1 characters, Y/N flag indicating that the merchant would like to bypass the Worldpay embedded or intelligent scheme token management service (TMS) on this transaction only if applicable.
  // Note: The merchant must be signed up for the Worldpay TMS product.
})

export const DeviceInformationSchema = yup.object({
  VARName: yup.string().max(6).optional(), // <= 6 characters, VAR Name
  VARVersion: yup.string().max(6).optional(), // <= 6 characters, VAR Version
  GatewayName: yup.string().max(6).optional(), // <= 6 characters, Gateway Name
  GatewayVersion: yup.string().max(6).optional(), // <= 6 characters, Gateway Version
  POSAPPName: yup.string().max(10).optional(), // <= 10 characters, POS Application Name
  POSAPPVersion: yup.string().max(6).optional(), // <= 6 characters, POS Application Version
  TerminalModelName: yup.string().max(10).optional(), // <= 10 characters, Terminal Model Name
  TerminalAPPName: yup.string().max(10).optional(), // <= 10 characters, Terminal Application Name
  TerminalAPPVersion: yup.string().max(6).optional(), // <= 6 characters, Terminal Application Version
  TerminalSerialNUM: yup.string().max(16).optional(), // <= 16 characters, Terminal Serial Number
})

/**
 * indicates the entry mode for the transaction.
 */
export enum EntryMode {
  SWIPED = 'SWIPED', // Magnetic Stripe Swiped
  UNSPEC = 'UNSPEC', // Unspecified
  KEYED = 'KEYED', // Manual Entry
  CARDNOTK = 'CARDNOTK', // Card Present but No Track
  BARCODE = 'BARCODE', // Bar Code
  OCRCODE = 'OCRCODE', // OCR Code
  EMVCHIP = 'EMVCHIP', // EMV Chip Read
  CONTCHIP = 'CONTCHIP', // Contactless Chip
  CONTMAG = 'CONTMAG', // Contactless Magnetic Stripe
  CHIPSEC = 'CHIPSEC', // Chip Secured Remote Payment
  FALLBMAN = 'FALLBMAN', // Chip Card/Chip Terminal //> Fallback to Manual
  FALLBMAG = 'FALLBMAG', // Chip Card/Chip Terminal //> Fallback to Magnetic Stripe
  E_COMM = 'E-COMM', // Electronic Commerce/In application 3D secure processing
  CREDONFL = 'CREDONFL', // Credentials On File (COF)
  SWIPMICR = 'SWIPMICR', // Swiped MICR
  IN_APP = 'IN-APP', // In application 3D secure processing
  IN_STORE = 'IN-STORE', // In store 3D secure processing
}

export enum TerminalType {
  ATMON = 'ATMON', // On premise ATM
  ATM = 'ATM', // On premise ATM
  ATMOFF = 'ATMOFF', // Off premise ATM
  POS = 'POS', // Point of Sale
  DIALPOS = 'DIALPOS', // Dial POS device
  SCRIP = 'SCRIP', // Scrip device
  TELEPHON = 'TELEPHON', // Telephone but not a Home Banking Transaction
  HOMEBANK = 'HOMEBANK', // home Banking Device
  INTERNET = 'INTERNET', // Internet Banking
  MOBIBANK = 'MOBIBANK', // Mobile Banking
  VENDING = 'VENDING', // Vending Machine
  DVRS = 'DVRS', // Audio (Dialogic Voice Response System)
  MPOS = 'MPOS', // MPOS Device
  LIMITAMT = 'LIMITAMT', // Limited Amount Terminal
  CAT = 'CAT', // Cardholder Activated Terminal
  VIRTTERM = 'VIRTTERM', // Virtual Terminal
  SOFTPOS = 'SOFTPOS', // Soft POS Device (Tap To Pay)
}

export enum POSConditionCode {
  NORMAL = '00', // Normal Transaction of This Type
  CUSTOMER_NOT_PRESENT = '01', // Customer Not Present
  UNATTENDED_TERMINAL = '02', // Unattended terminal, customer Operated
  MERCHANT_SUSPICIOUS = '03', // Merchant Suspicious of Transaction
  CUSTOMER_PRESENT_CARD_NOT_PRESENT = '05', // Customer Present, Card not Present
  PREVIOUSLY_AUTHORIZED = '06', // Previously authorized
  MAIL_TELEPHONE_ORDER = '08', // Mail/Telephone Order
  CUSTOMER_IDENTIFY_VERIFIED = '10', // Customer Identity Verified
  VERIFICATION_ONLY_REQUEST = '51', // Verification-Only Request, the transaction amount must be zero.
  ELECTRONIC_COMMERCE_TRANSACTION = '59', // Electronic Commerce Transaction
}

export enum POSEnvironment {
  CredentialOnFile = 'C', // Credential on File transaction
  FinalAuthorizationMastercard = 'F', // 'Final Authorization' transaction for MasterCard
  NotFinalAuthorizationMastercard = 'P', // Not a 'Final Authorization' transaction for MasterCard
  RecurringVisa = 'R', // Recurring transaction for Visa
  InstallmentVisa = 'I', // Installment transaction for Visa
}

export enum TerminalEntryCap {
  Unspecified = '0',
  TerminalNotUsed = '1',
  MagneticStripeReadCapable = '2',
  BarCode = '3',
  OCR = '4',
  IntegratedCircuitCard = '5',
  ContactlessMagneticChip = '6',
  ContactlessMagneticStripe = '7',
  DefaultOrUnknown = '8',
  NotCapableOfReadingCardData = '9',
  MagneticStripeReadAndManualEntryCapable = 'S',
  MagneticStripeReadManualEntryAndIntegratedCircuitCardCapable = 'T',
}

export interface TerminalData_Resp {
  EntryMode?: EntryMode
  TerminalNumber?: string // <= 15 characters, The terminal number that the acquirer assigns. If a value is not provided, it defaults to the Worldpay Merchant ID.
  POSConditionCode?: string
}

export const OperatingEnvironmentValues = [
  '0', // No terminal used
  '1', // On premise of card acceptor, attended device
  '2', // On premise of card acceptor, unattended device
  '3', // Off premise of card acceptor, attended device
  '4', // Off premise of card acceptor, unattended device
  '5', // On premise of card holder, unattended device
]
export type TerminalData = yup.InferType<typeof TerminalDataSchema>

export const EntryModeSchema = yup.mixed<EntryMode>().oneOf(Object.values(EntryMode)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:
export const TerminalTypeSchema = yup.mixed<TerminalType>().oneOf(Object.values(TerminalType)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:
export const POSConditionCodeSchema = yup.string().oneOf(Object.values(POSConditionCode))
export const POSEnvironmentSchema = yup.mixed<POSEnvironment>().oneOf(Object.values(POSEnvironment)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:
export const TerminalEntryCapSchema = yup.mixed<TerminalEntryCap>().oneOf(Object.values(TerminalEntryCap)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:
export const OperatingEnvironmentSchema = yup.string().oneOf(OperatingEnvironmentValues)

export const TerminalDataSchema = yup.object({
  EntryMode: EntryModeSchema.default(undefined).optional(),
  TerminalType: TerminalTypeSchema.default(undefined).optional(),
  TerminalNumber: yup.string().max(15).optional(), // <= 15 characters, The terminal number that the acquirer assigns. If a value is not provided, it defaults to the Worldpay Merchant ID.
  POSConditionCode: POSConditionCodeSchema.default(undefined).optional(),
  POSEnvironment: POSEnvironmentSchema.default(undefined).optional(),
  TerminalEntryCap: TerminalEntryCapSchema.default(undefined).optional(),
  AttendedDevice: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the device is attended or not.
  OperatingEnvironment: OperatingEnvironmentSchema.default(undefined).optional(), // <= 1 characters, This identifies the type of environment the transaction is being executed in.
})

export enum ECommerceIndicator {
  SingleTransaction = '01', // Single transaction - default for Bill Payments
  RecurringTransaction = '02', // Recurring Transaction
  InstallmentPayment = '03', // Installment Payment
  VisaMcrdDiscoverAuthenticated = '05', // Verified by Visa authenticated/MasterCard SecureCode with AAV data/Discover with CAVV data.
  VisaMcrdDiscoverPossible = '06', // Verified by Visa attempts processing/MasterCard SecureCode with or without AAV data/Discover with or without CAVV data.
  ECommerceUnverified = '07', // eCommerce, but neither Verified by Visa, nor MasterCard SecureCode.
  NoSecurityMethod = '08', // The cardholder's payment card data was transmitted to the merchant using no security method.
  NonUSMerchant = '09', // Used by non-U.S. merchants to designate Secure Electronic Transaction (SET) purchases. U.S. Issuers should not receive ECI of 9, unless the value was the result of a processing error or a miscoded value.
  RecurringTransactionFirst = '10', // Recurring transaction (first transaction of a recurring payment series)
  TokenInitiated = '20', // Token Initiated (AMEX only)
}
const ECommerceIndicatorSchema = yup.mixed<ECommerceIndicator>().oneOf(Object.values(ECommerceIndicator))
export const ThreeDSecureProgramProtocol = [
  '1', // 3D Secure Version 1.0 (3DS 1.0)
  '2', // EMV 3D Secure (3DS 2.0)
]
export const ThreeDSecureProgramProtocolSchema = yup.string().oneOf(ThreeDSecureProgramProtocol)

export const ECommerceDataSchema = yup.object({
  'E-commerceIndicator': ECommerceIndicatorSchema.required(), // All electronic commerce transactions must include this field to indicate the type of transaction being performed. It can also be used to distinguish various types of Bill Payment transactions.
  '3dSecureData': yup.string().max(100).optional(), // <= 100 characters
  // Network-specific 3DS and mobile pay data. All data is expected to be base64 encoded. If multiple base64 fields are concatenated, they must each be padded out to a length which is a multiple of 4 with equal signs.
  // Visa - CAVV + XID (optional)
  // MasterCard - AAV
  // Discover - CAVV
  // American Express - AEVV + XID (optional)

  // Note: If the transaction is initiated with a network token instead of a PAN, then the network cryptogram should be provided in this field if applicable.
  'E-commerceOrderNum': yup.string().max(13).optional(), // <= 13 characters, E-Commerce Order Number
  'E-commerceIPAddress': yup.string().max(39).optional(), // <= 39 characters, E-Commerce IP Address
  LoginStatus: yup.string().max(1).optional(), // <= 1 characters, Login Status
  ItemDepartment: yup.string().max(27).optional(), // <= 27 characters, Item Department
  OriginalChainID: yup.string().max(1).optional(), // <= 1 characters, Original Chain ID
  'ReturnE-commerceIndicator': yup.string().max(2).optional(), // <= 2 characters, If the network changes the E-commerce indicator for any reason (downgrades, etc.), the new value will be returned in this field.
  ReturnUCAFIndicator: BooleanStringSchema, // <= 1 characters, If the network changes the UCAF indicator for any reason (downgrades, etc.), the new value will be returned in this field.
  ReturnEcommerceSecurityLevelIndicator: yup.string().max(2).optional(), // <= 2 characters, This value contains security protocol and cardholder authentication data (SLI) for the network. It will contain either the value that Worldpay sent to the network or the modified network value should they change it in the authorization response. For follow-up messages such as completions and reversals, Worldpay will attempt to retrieve the original value, but this data can be sent back up to ensure it is logged for settlement reasons.
  ReturnUCAFAAVData: yup.string().max(32).optional(), // <= 32 characters, This value contains the UCAF/AAV value that Worldpay provided to the network for authorization. For follow-up messages such as completions and reversals, Worldpay will attempt to retrieve the original value, but this data can be sent back up to ensure it is logged for settlement reasons.
  '3DSecureProgramProtocol': ThreeDSecureProgramProtocolSchema.default(undefined).optional(), // <= 1 characters, This value contains the current version of 3D secure software being used. Refer to the Mastercard processing specifications for a full list of valid values. Common values:
  '3DSecureDirectoryServerTransactionID': yup.string().max(36).optional(), // <= 36 characters, This value is generated by the 3D secure server during the authentication transaction and passed back to the merchant along with the authentication results.
})
export type ECommerceData = yup.InferType<typeof ECommerceDataSchema>

export type ThreeDSecureResult =
  | '' // not set
  | '0' // CAVV AUTH RESULTS INVALID
  | '1' // CAVV AUTH RESULTS FAILED
  | '2' // CAVV AUTH RESULTS PASSED
  | '3' // CAVV ATTEMPT PASSED
  | '4' // CAVV ATTEMPT FAILED
  | '5' // NOT APPLICABLE
  | '6' // ISSUER NOT PARTICIPATING
  | '7' // FAILED VALIDATION (US)
  | '8' // PASSED VALIDATION (US)
  | '9' // FAILED VALID. ACS U/A
  | 'A' // PASSED VALID. ACS U/A
  | 'B' // PASSED VALID. INFO ONLY
  | 'C' // ATTEMPT BYPASSED (NO KEY)
  | 'D' // AUTH BYPASSED (NO KEYS)
export type ProcFlagsIndicators = yup.InferType<typeof ProcFlagsIndicatorsSchema>

export interface ECommerceData_Resp {
  '3dSecureResult'?: ThreeDSecureResult // <= 1 characters, Results of performing secure transaction authorization via e-commerce.
  'ReturnE-commerceIndicator'?: string // <= 2 characters, If the network changes the E-commerce indicator for any reason (downgrades, etc.), the new value will be returned in this field.
  ReturnUCAFIndicator?: string // <= 1 characters, If the network changes the UCAF indicator for any reason (downgrades, etc.), the new value will be returned in this field.
  ReturnEcommerceSecurityLevelIndicator?: string // <= 2 characters, This value contains security protocol and cardholder authentication data (SLI) for the network. It will contain either the value that Worldpay sent to the network or the modified network value should they change it in the authorization response. For follow-up messages such as completions and reversals, Worldpay will attempt to retrieve the original value, but this data can be sent back up to ensure it is logged for settlement reasons.
  ReturnUCAFAAVData?: string // <= 32 characters, This value contains the UCAF/AAV value that Worldpay provided to the network for authorization. For follow-up messages such as completions and reversals, Worldpay will attempt to retrieve the original value, but this data can be sent back up to ensure it is logged for settlement reasons.
}

export enum SalesTaxIndicator {
  NotPresent = '0', // Sales tax amount not present
  Present = '1', // Sales tax amount present (default if a sales tax is present)
  Exempt = '2', // Sales tax exempt
}
export const SalesTaxIndicatorSchema = yup.mixed<SalesTaxIndicator>().oneOf(Object.values(SalesTaxIndicator)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export enum GatewayRoutingId {
  AliPay = 'ALIP',
  StoredValueSystems = 'FGFT',
  GreenDot = 'GDOT',
  GreenDotAlternate = 'GDT2',
  Incomm = 'ICOM',
  MasterCardRepower = 'MPLN',
  NET1PINTranslation = 'NET1',
  Netspend = 'NSPD',
  SafewayBlackhawk = 'SWAY',
  TSY1PINTranslation = 'TSY1',
  VisaPrepaidLoadNetworkReadyLink = 'VPLN',
}

export const STPProcessingModeValues = [
  '1', // Host Data Capture (Default)
  '2', // Terminal Capture
]

export type STPData = yup.InferType<typeof STPDataSchema>
export const GatewayRoutingIdSchema = yup.mixed<GatewayRoutingId>().oneOf(Object.values(GatewayRoutingId)) // <= 1 characters, This field contains the CVV2, CVC2, or CID Presence Indicator. Use one of the following values:

export const AccountUpdaterTokenRequestSchema = yup.string().oneOf(['T']) // Indicator for transactions that use the account updater to send back a token on the new card number (if available).

export const SoftPosDeviceTypeSchema = yup.string().oneOf(['1']) //  Apple Tap To Pay Device

export const ProcFlagsIndicatorsSchema = yup.object({
  PinlessRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the customer would like Worldpay to attempt a PINLess conversion from signature to debit.
  // Notes:
  // - Please coordinate this with your Worldpay Relationship Manager before utilizing this flag as special setup needs to be in place to allow the product to work.
  // - All transactions in a sequence of transactions following the original PINLess conversion request must contain this value to ensure they flow down the same network path (completion, reversal, etc).
  // - Any other data that is pertinent to allowing the initial PINLess transaction to work must be included in the follow-up messages. Fields such as TransactionAmount, POSConditionCode and E-commerceIndicator are typically needed to ensure the conversions work similarly within a transaction sequence.
  PartialAllowed: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the customer allows partial authorizations.
  MerchantStandin: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the transaction was authorized by the merchant in standin.
  RecurringBillPay: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the transaction is a recurring bill payment.
  PaymentExistingDebt: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction qualifies as a payment exist debt.
  PANMappingRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the acquirer wishes to receive PAN Mapping data.
  SignatureCapture: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the acquirer wishes to receive a signature capture token.
  HostCaptureAdvice: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction is part of a host capture advice sequence such as tip processing. Each message in the sequence including the original authorization will contain this value so that appropriate processing can take place at each stage of the authorization life cycle.
  SalesTaxIndicator: SalesTaxIndicatorSchema.default(undefined).optional(), // <= 1 characters Indicator to provide the status of sales tax for the transaction.
  EMDSettlement: BooleanStringSchema, // <= 1 characters, Y/N flag indicating that the transaction will be settled via an EMD file submission.
  SplitShipment: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction is part of a split shipment.
  IncrementalAuth: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction is part of an incremental authorization.
  PriorAuth: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction is a prior authorized transaction.
  AccountUpdaterRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction supports Account Updater information in the response.
  AccountUpdaterTokenRequest: AccountUpdaterTokenRequestSchema.default(undefined).optional(), // <= 1 characters Account Updater Request Flags. Valid values are:
  ReauthShipment: BooleanStringSchema, // <= 1 characters, Y/N flag indicating if the transaction is a reauthorization of a prior shipment auth.
  MerchantFraudRiskData: BooleanStringSchema, // <= 1 characters, Request Merchant Fraudsight Risk Data in the response.
  BenefitCardServicesRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the transaction is a Benefit Card Services request.
  RawNetworkDataRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the acquirer would like the Raw Network Data returned in the response if available.
  ExtendedNetworkRoutingDataRequest: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the acquirer would like the Extended Network Routing Data returned in the response if available.
  DigitalSecureRemotePaymentIndicator: BooleanStringSchema, // <= 1 characters, Y/N flag indicating that the transaction qualifies as a digital secure remote payment.
  MastercardAdviceCodeIndicator: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the customer wishes to receive the Mastercard Merchant Advice Code in the response.
  InitialApplyAndBuy: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the transaction is the initial one in an Apply and Buy transaction sequence.
  ForeignPartialAllowed: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the customer allows partial authorizations for foreign and US currencies.
  ReturnPanReferenceId: BooleanStringSchema, // <= 1 characters, Y/N flag indicating the merchant would like a PAN Reference ID from Discover returned.
  CardholderInitiatedTransaction: BooleanStringSchema, // <= 1 characters, Y/N flag indicating that the cardholder is the entity that initiated the transaction.
  MerchantInitiatedTransaction: BooleanStringSchema, // <= 1 characters, Y/N flag indicating that the merchant is the entity that initiated the transaction on behalf of the cardholder.
  DeferredBillingIndicator: BooleanStringSchema, // <= 1 characters, Y/N flag indicating that deferred billing is in effect, and the network should be notified as such.
  PinlessConversionRequestOnly: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the customer would like Worldpay to attempt a PINLess conversion from signature to debit. If the transaction fails to convert, then the transaction will be declined rather than being allowed to continue. If the reason for decline is a failed conversion, Worldpay will send back a value of 101 in the ResponseCode field; otherwise, the appropriate decline reason will be provided.
  // Please refer to the rules for PinlessRequest for processing expectations.
  SoftPosDeviceType: SoftPosDeviceTypeSchema.default(undefined).optional(), // <= 1 characters Soft POS Device Type. Valid values are:
})

export const STPProcessingModeSchema = yup.string().oneOf(STPProcessingModeValues)

export const STPDataSchema = yup.object({
  STPBankId: yup.string().max(4).optional(), // <= 4 characters, Contains the 4-digit bank id assigned by Worldpay during boarding.
  STPTerminalId: yup.string().max(3).optional(), // <= 3 characters, Contains the 3-digit terminal id assigned by Worldpay during boarding.
  STPReferenceNUM: yup.string().max(9).optional(), // <= 9 characters, Worldpay assigned reference number on each transaction that is returned to the terminal. Sent by the terminal on follow-up messages in order to match back to the original transaction.
  AdjustableBatch: BooleanStringSchema, // <= 1 characters, Y/N flag indicating If the batch will contain any transactions that require future adjustments (i.e. tip adjustments). This will keep the batch from auto-closing. See HostCaptureAdvice for additional processing.
  MaskedPAN: yup.string().max(20).optional(), // <= 20 characters, Masked PAN for use in follow-up messages such as tip adjustments and reversals so the terminal does not have to keep PAN data resident.
  'E-commerceTerminal': BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether a terminal is an Internet/E-commerce type terminal. This allows for an override of Worldpay terminal specific settings on a transaction per transaction basis.
  BatchUploadDetail: BooleanStringSchema, // <= 1 characters, Y/N flag indicating whether the transaction is a detail record that is part of a batch upload.
  UploadSequenceNum: yup.string().max(6).optional(), // <= 6 characters, Sequence number of the batch upload detail
  STPProcessingMode: STPProcessingModeSchema.default(undefined).optional(), // <= 1 characters, Dictates the type of processing that the terminal is expected to perform on each transaction. Valid Values:
})
export type MiscAmountsBalances = yup.InferType<typeof MiscAmountsBalancesSchema>

export function validateMiscAmountsBalances(miscAmountsBalances: MiscAmountsBalances) {
  return MiscAmountsBalancesSchema.validateSync(miscAmountsBalances, { abortEarly: false })
}

export const MerchantSpecificDataSchema = yup.object({
  MerchantCategoryCode: yup.string().max(4).optional(), // <= 4 characters, Merchant Category Code (MCC/SIC)
  LaneRegister: yup.string().max(3).optional(), // <= 3 characters, Lane/Register Number
  Division: yup.string().max(4).optional(), // <= 4 characters, Division Number
  AcquirerCountryCode: yup.string().max(3).optional(), // <= 3 characters, Acquirer Country Code
  MerchantSellerEmail: yup.string().max(64).optional(), // <= 64 characters, Merchant Seller Email. For American Express transactions, this represents the Email of the Payment Aggregators or OptBlue Participant's Seller.
  MerchantSellerPhone: yup.string().max(20).optional(), // <= 20 characters, Merchant Seller Phone. For American Express transactions, this represents the Telephone number of the Payment Aggregators or OptBlue Participant's Seller.
  AcquirerCurrencyCode: yup.string().max(3).optional(), // <= 3 characters, Acquirer Currency Code
  CardAcceptorNameLocation: yup.string().max(27).optional(), //  <= 27 characters, The merchant name or location where the transaction occurred or the sender information for money transfer type transactions.
  CardAcceptorCity: yup.string().max(15).optional(), // <= 15 characters, The name of the city where the transaction occurred.
  CardAcceptorState: yup.string().max(2).optional(), // <= 2 characters, The state where the transaction occurred.
  CardAcceptorZipCode: yup.string().max(10).optional(), // <= 10 characters, The zip code where the transaction occurred.
  SoftPosId: yup.string().max(32).optional(), // <= 32 characters, Used to identify a softPOS Mobile Application on an Enabled Device that is used to conduct a transaction (regardless of whether it is declined or subject to adjustment, return, or chargeback) during the relevant calendar day. Multiple Active Virtual Terminals exist on a single Enabled Device.
})
export type MerchantSpecificData = yup.InferType<typeof MerchantSpecificDataSchema>

export const ReferenceTraceNumbersSchema = yup.object({
  RetrievalREFNumber: yup.string().max(12).optional(), // <= 12 characters, This field yields a value generated by the message originator to associate a unique identifier to a given transaction. You can use this value to identify the transaction throughout the transaction's life cycle (authorization, reversal, and so on). This value can be generated by Worldpay if not sent by the originator and required by the specific network.

  // Note: This data element can contain up to 12 alphanumeric characters. Worldpay recommends the following layout, although it is not required to be in this format.

  // - Position 1-4 = Julian date (YDDD)
  // - Position 5-12 = Actual terminal sequence number

  CorrelationID: yup.string().max(25).optional(), // <= 25 characters, A value that can be generated by the acquirer to associate transactions in reporting and research.
  AuthorizationNumber: yup.string().max(6).optional(), // <= 6 characters, This field contains a value generated by the authorizing processor to indicate their acceptance of the transaction. If a value is not generated by either Worldpay or the network on approved transactions, Worldpay will generate one and return it to the merchant.
  RefInvoiceNumber: yup.string().max(20).optional(), // <= 20 characters, The field contains customer the code for Level 2 or Level 3 interchange rates. It identifies the purchase to the issuer and cardholder. This is a customer-supplied code that is typically a project number, cost center, or general ledger code. If you do not require it, Worldpay recommends using a value of NONE.
  DraftLocator: yup.string().max(11).optional(), // <= 11 characters, This field allows merchants to include the draft locator so that it can be logged and eventually presented in reporting utilities.
})
export type ReferenceTraceNumbers = yup.InferType<typeof ReferenceTraceNumbersSchema>

export const UserDefinedDataSchema = yup.object({
  UserData1: yup.string().max(35).required(), // <= 35 characters, User Data 1
  UserData2: yup.string().max(20).optional(), // <= 20 characters, User Data 2
  UserData3: yup.string().max(20).optional(), // <= 20 characters, User Data 3
})

export type UserDefinedData = yup.InferType<typeof UserDefinedDataSchema>

export const OnlineShipToAddressSchema = yup.object({
  OnlineShipToAddressLine1: yup.string().max(40).required(), // <= 40 characters, Address Line 1
  OnlineShipToAddressLine2: yup.string().max(40).optional(), // <= 40 characters, Address Line 2
  OnlineShipToCity: yup.string().max(18).required(), // <= 18 characters, City
  OnlineShipToZipCode: yup.string().max(9).required(), // <= 9 characters, Zip Code
  OnlineShipToState: yup.string().max(2).required(), // <= 2 characters, State
  OnlineShipToCountry: yup.string().max(3).required(), // <= 3 characters, Country
})
export type OnlineShipToAddress = yup.InferType<typeof OnlineShipToAddressSchema>

export const OnlineBillToAddressSchema = yup.object({
  OnlineBillToAddressLine1: yup.string().max(40).required(), // <= 40 characters, Address Line 1
  OnlineBillToAddressLine2: yup.string().max(40).optional(), // <= 40 characters, Address Line 2
  OnlineBillToCity: yup.string().max(40).required(), // <= 18 characters, City
  OnlineBillToZipCode: yup.string().max(40).required(), // <= 9 characters, Zip Code
  OnlineBillToState: yup.string().max(40).required(), // <= 2 characters, State
  OnlineBillToCountry: yup.string().max(40).required(), // <= 3 characters, Country
})
export type OnlineBillToAddress = yup.InferType<typeof OnlineBillToAddressSchema>

export const OnlineOrderCustomerDataSchema = yup.object({
  OnlineOrderCustomerID: yup.string().max(50).optional(), // <= 50 characters, Customer ID
  OnlineOrderCustomerOrderID: yup.string().max(32).optional(), // <= 32 characters, Customer Order ID
  OnlineOrderEmailAddress: yup.string().max(64).optional(), // <= 64 characters, Email Address
  OnlineOrderPhoneNumber: yup.string().max(10).optional(), // <= 10 characters, Phone Number
  OnlineOrderIPAddress: yup.string().max(15).optional(), // <= 15 characters, IP Address
  OnlineOrderWebSessionID: yup.string().max(128).optional(), // <= 128 characters, Web Session ID
  OnlineOrderShippingMethod: yup.string().max(2).optional(), // <= 2 characters, Shipping Method
})
export type OnlineOrderCustomerData = yup.InferType<typeof OnlineOrderCustomerDataSchema>

export enum NoShowIndicator {
  NotApplicable = '0',
  NoShow = '1',
}
const NoShowIndicatorSchema = yup.mixed<NoShowIndicator>().oneOf(Object.values(NoShowIndicator))

// This is a 6-digit value that identifies any additional charges that are added to the customer's card after checkout. Left justify and zero fill the value after adding one of the following values:
export enum ChargeDescriptorCode {
  NoExtraCharges = '000000',
  Reserved = '000001',
  Restaurant = '000002',
  GiftShop = '000003',
  MiniBar = '000004',
  Telephone = '000005',
  Other = '000006',
  Laundry = '000007',
}
const ChargeDescriptorCodeSchema = yup.mixed<ChargeDescriptorCode>().oneOf(Object.values(ChargeDescriptorCode))

export const LodgingDataSchema = yup.object({
  NoShowIndicator: NoShowIndicatorSchema.optional(),
  ChargeDescriptorCode: ChargeDescriptorCodeSchema.optional(), // <= 6 characters
  LodgingDate: yup.string().max(8).default(undefined).optional(), // (LodgingDate_Type) <= 8 characters
  DepartureDate: yup.string().max(8).default(undefined).optional(), // (DepartureDate_Type) <= 8 characters
  LodgingFolioNumber: yup.string().max(25).default(undefined).optional(), // (LodgingFolioNumber_Type) <= 25 characters
  RoomRate: yup.string().max(13).default(undefined).optional(), // (RoomRate_Type) <= 13 characters
  PropertyPhoneNumber: yup.string().max(10).default(undefined).optional(), // (PropertyPhoneNumber_Type) <= 10 characters
  CustomerServicePhoneNumber: yup.string().max(10).default(undefined).optional(), // (CustomerServicePhoneNumber_Type) <= 10 characters
  SpecialProgramCode: yup.string().max(1).default(undefined).optional(), // (SpecialProgramCode_Type) <= 1 characters // American Express special program code
  FireAndSafety: BooleanStringSchema, // A code that identifies whether the facility is in compliance with the Hotel and Motel Fire Safety Act of 1990 (PL101- 391), or similar legislation.
  // Valid values are:
  // Y = Yes, the facility is in compliance
  // N = No, the facility is not in compliance
  NumberOfAdults: yup.string().max(2).default(undefined).optional(), // (NumberOfAdults_Type) <= 2 characters
  NumberOfRoomNights: yup.string().max(2).default(undefined).optional(), // (NumberOfRoomNights_Type) <= 2 characters
  HotelTaxCharge: AmountString.default(undefined).optional(), // (HotelTaxCharge_Type) <= 13 characters
  FoodCharge: AmountString.default(undefined).optional(), // (FoodCharge_Type) <= 13 characters
  FoodBeverageCharge: AmountString.default(undefined).optional(), // (FoodBeverageCharge_Type) <= 13 characters
  BeverageCharge: AmountString.default(undefined).optional(), // (BeverageCharge_Type) <= 13 characters
  BarMinibarCharge: AmountString.default(undefined).optional(), // (BarMinibarCharge_Type) <= 13 characters
  PhoneCharge: AmountString.default(undefined).optional(), // (PhoneCharge_Type) <= 13 characters
  MoviesPayPerView: AmountString.default(undefined).optional(), // (MoviesPayPerView_Type) <= 13 characters
  LaundryDryCleaning: AmountString.default(undefined).optional(), // (LaundryDryCleaning_Type) <= 13 characters
  HealthAndFitness: AmountString.default(undefined).optional(), // (HealthAndFitness_Type) <= 13 characters
  GiftShopCharge: AmountString.default(undefined).optional(), // (GiftShopCharge_Type) <= 13 characters
  ParkingFee: AmountString.default(undefined).optional(), // (ParkingFee_Type) <= 13 characters
  BusinessCenterCharge: AmountString.default(undefined).optional(), // (BusinessCenterCharge_Type) <= 13 characters
  ConventionCenterCharge: AmountString.default(undefined).optional(), // (ConventionCenterCharge_Type) <= 13 characters
  CancellationAdjustment: AmountString.default(undefined).optional(), // (CancellationAdjustment_Type) <= 13 characters
  OtherCharge: AmountString.default(undefined).optional(), // (OtherCharge_Type) <= 13 characters
})

/*
 * This is a 6-digit value that identifies any additional charges that are added to the customer's card after the car return. Left justify and zero fill the value with each position containing one of the following values:
 */
export enum ChargeDescriptorCodeVeh {
  NoExtraCharges = '000000',
  Gasoline = '000001',
  ExtraMileage = '000002',
  LateReturn = '000003',
  OneWayServiceFee = '000004',
  ParkingOrMovingViolation = '000005',
}
const ChargeDescriptorCodeVehSchema = yup.mixed<ChargeDescriptorCodeVeh>().oneOf(Object.values(ChargeDescriptorCodeVeh))

export const VehicleRentalDataSchema = yup.object({
  NoShowIndicatorVeh: NoShowIndicatorSchema.default(undefined).optional(),
  ChargeDescriptorCodeVeh: ChargeDescriptorCodeVehSchema.default(undefined).optional(),
  RentalDate: yup.string().max(8).default(undefined).optional(), //string (RentalDate_Type) <= 8 characters Rental Date
  RentalAgreementNumber: yup.string().max(25).default(undefined).optional(), //string (RentalAgreementNumber_Type) <= 25 characters Rental Agreement Number
  RentersName: yup.string().max(20).default(undefined).optional(), //string (RentersName_Type) <= 20 characters Renter's Name
  VehicleReturnCity: yup.string().max(18).default(undefined).optional(), //string (VehicleReturnCity_Type) <= 18 characters Vehicle Return City
  VehicleReturnCountryState: yup.string().max(3).default(undefined).optional(), //string (VehicleReturnCountryState_Type) <= 3 characters Vehicle Return Country/State
  VehicleReturnState: yup.string().max(2).default(undefined).optional(), //string (VehicleReturnState_Type) <= 2 characters Vehicle Return State
  VehicleReturnLocationID: yup.string().max(10).default(undefined).optional(), //string (VehicleReturnLocationID_Type) <= 10 characters Vehicle Return Location ID
  ReturnDate: yup.string().max(8).default(undefined).optional(), //string (ReturnDate_Type) <= 8 characters Return Date
  DailyRentalRate: AmountString.default(undefined).optional(), //string (DailyRentalRate_Type) <= 13 characters Daily Rental Rate
  InsurancePurchased: AmountString.default(undefined).optional(), //string (InsurancePurchased_Type) <= 13 characters Insurance Purchased
  AdjustmentAmount: AmountString.default(undefined).optional(), //string (AdjustmentAmount_Type) <= 13 characters Adjustment Amount
  OtherChargeVeh: AmountString.default(undefined).optional(), //string (OtherChargeVeh_Type) <= 13 characters Other Charge
})

export enum SyncPromoNeededResult {
  Yes = '00',
  No = '01',
  Lite = '02',
  Error = '08',
}
const SyncPromoNeededResultSchema = yup.mixed<SyncPromoNeededResult>().oneOf(Object.values(SyncPromoNeededResult))

export enum ETCTransactionType {
  NonETCMerchant = '00',
  AuthorizationAndTicket = '71',
  Return = '72',
  TicketOnly = '73',
  AuthorizationOnly = '74',
  ReversalOfAuthorizationAndTicket = '75',
  ReversalOfAReturn = '76',
  ReversalOfATicketOnly = '77',
}
const ETCTransactionTypeSchema = yup.mixed<ETCTransactionType>().oneOf(Object.values(ETCTransactionType))

export enum ETCMotoEcommIndicator {
  NotApplicable = '00',
  MailTelephoneOrderSingleTransaction = '01',
  RecurringTransaction = '02',
  InstallmentPayment = '03',
  UnknownClassification = '04',
  SETWithCardholderCertificate = '05',
  SETWithoutCardholderCertificate = '06',
  ChannelEncryptedTransaction = '07',
  NonSecureTransaction = '08',
}
const ETCMotoEcommIndicatorSchema = yup.mixed<ETCTransactionType>().oneOf(Object.values(ETCTransactionType))

export enum SyncCashOverAcceptanceIndicator {
  PartialCashDisbursementIsNotAcceptable = ' ',
  PartialCashDisbursementIsNotAcceptable0 = '0',
  PartialCashDisbursementIsAcceptable = '1',
}
const SyncCashOverAcceptanceIndicatorSchema = yup
  .mixed<SyncCashOverAcceptanceIndicator>()
  .oneOf(Object.values(SyncCashOverAcceptanceIndicator))

export const SynchronyDataSchema = yup.object({
  SyncPromoNeededResult: SyncPromoNeededResultSchema.default(undefined).optional(), //string (SyncPromoNeededResult_Type) <= 2 characters Promo Needed/Result
  SyncETCTransactionType: ETCTransactionTypeSchema.default(undefined).optional(), //	string (SyncETCTransactionType_Type) <= 2 characters
  SyncETCDescriptorCode: yup.string().max(8).default(undefined).optional(), // (SyncETCDescriptorCode_Type) <= 8 characters ETC Descriptor Code
  SyncTicketTermsPromoCodeInvoice: yup.string().max(6).default(undefined).optional(), //string (SyncTicketTermsPromoCodeInvoice_Type) <= 6 characters ETC Ticket Terms/Promotional Codes or invoice number Optional, 6 digits Left justified, space filled
  SyncCashOverAcceptanceIndicator: SyncCashOverAcceptanceIndicatorSchema.default(undefined).optional(), // string (SyncCashOverAcceptanceIndicator_Type) <= 1 characters Cash Over Partial Authorization Partial Cash Acceptance Indicator
  SyncEtcMotoEcommIndicator: ETCMotoEcommIndicatorSchema.default(undefined).optional(), //	string (SyncEtcMotoEcommIndicator_Type) <= 2 characters Mail/Order/Electronic Commerce Indicator
})

export const FisLoyaltyDataSchema = yup.object({
  FisDiscountedAmount: AmountString.default(undefined).optional(), // string (FisDiscountedAmount_Type) <= 13 characters The actual discounted amount returned to the terminal so the customer can determine whether to opt in/out.
  FisLoyaltyEligibility: BooleanStringSchema, // (FisLoyaltyEligibility_Type) <= 1 characters Y/N flag indicating the merchant's ability to accept Loyalty transactions.
  FisLoyaltyOptIn: BooleanStringSchema, // (FisLoyaltyOptIn_Type) <= 1 characters Y/N flag on the follow-up message to indicate whether the customer accepts the discounted amount.
  FisLoyaltyTransactionID: yup.string().max(26).default(undefined).optional(), // (FisLoyaltyTransactionID_Type) <= 26 characters The FIS transaction ID that ties requests together. It should be sent on any follow-up messages.
  FisLoyaltyRewardID: yup.string().max(12).default(undefined).optional(), // (FisLoyaltyRewardID_Type) <= 12 characters This field contains the reward ID associated with the transaction.
  FisLoyaltyPromoID: yup.string().max(11).default(undefined).optional(), // (FisLoyaltyPromoID_Type) <= 11 characters This field contains the loyalty program associated with the transaction.
  FisLoyaltySequenceNumber: yup.string().max(25).default(undefined).optional(), // (FisLoyaltySequenceNumber_Type) <= 25 characters This field contains the loyalty sequence number that must be submitted on subsequent loyalty transactions.
  FisLoyaltyReservationID: yup.string().max(20).default(undefined).optional(), // (FisLoyaltyReservationID_Type) <= 20 characters This contains the reservation ID used with the loyalty system to reserve/finalize e-comm Premium Payback transactions.
  FisLoyaltyPSPID: yup.string().max(20).default(undefined).optional(), // (FisLoyaltyPSPID_Type) <= 20 characters This contains the PSP identifier associated with the processor who holds the loyalty reservation. It will be ignored without a Loyalty Reservation ID.
})

export const AmazonPayDataSchema = yup.object({
  AmazonPayChargeID: yup.string().max(27).default(undefined).optional(), // (AmazonPayChargeID_Type) <= 27 characters ID of the Charge object created at Amazon Pay. It should be passed on every subsequent request for this transaction.
  AmazonPayToken: yup.string().max(16).default(undefined).optional(), // (AmazonPayToken_Type) <= 16 characters This field represents the high value token for the transaction.
  AmazonPayBillingDescriptor: yup.string().max(22).default(undefined).optional(), // (AmazonPayBillingDescriptor_Type) <= 22 characters The description to be shown on the buyer's payment statement. For a payment, it should be passed either during authorization or capture.
  AmazonPayMerchantOrderNumber: yup.string().max(255).default(undefined).optional(), // (AmazonPayMerchantOrderNumber_Type) <= 255 characters This field contains the order number associated with the transaction. Any inquiries regarding the transactions should use this value.
  AmazonPayMerchantID: yup.string().max(255).default(undefined).optional(), // (AmazonPayMerchantID_Type) <= 255 characters Amazon will use this value to verify the ownership of the Amazon Pay token. })
})

export const BenefitCardServicesDataSchema = yup.object({
  RequestedOTCAmount: AmountString.default(undefined).optional(), // (RequestedOTCAmount_Type) <= 13 characters Requested amount to be taken from OTC purse.
  ApprovedOTCAmount: AmountString.default(undefined).optional(), // (ApprovedOTCAmount_Type) <= 13 characters Approved amount to be taken from OTC purse.
  BalanceOTCAmount: AmountString.default(undefined).optional(), // (BalanceOTCAmount_Type) <= 13 characters Remaining balance amount for OTC purse.
  RequestedFoodAmount: AmountString.default(undefined).optional(), // (RequestedFoodAmount_Type) <= 13 characters Requested amount to be taken from Food purse.
  ApprovedFoodAmount: AmountString.default(undefined).optional(), // (ApprovedFoodAmount_Type) <= 13 characters Approved amount to be taken from Food purse.
  BalanceFoodAmount: AmountString.default(undefined).optional(), // (BalanceFoodAmount_Type) <= 13 characters Remaining balance amount for Food purse.
  ProgramDiscountAmount: AmountString.default(undefined).optional(), // (ProgramDiscountAmount_Type) <= 13 characters Aggregate off all applicable individual discounts for the given product data.
  ProgramCouponAmount: AmountString.default(undefined).optional(), // (ProgramCouponAmount_Type) <= 13 characters Aggregate discount amount offered to the benefit program consumer at the POS.
  OtherAmount: AmountString.default(undefined).optional(), // (OtherAmount_Type) <= 13 characters
  // Other amount can be sent back on replies for the following reasons:
  // - Transaction amount remainder as the difference between the amount requested in the TransactionAmount field and the total qualified benefit amounts.
  // - Amounts for which no UPC/PLU data was delivered from the merchant to Worldpay.
  // - Amounts for which no qualified benefit program was identified when evaluating the Approved Product List (APL) for the available benefits assigned to the BIN.
  ExceedsBenefitAmount: AmountString.default(undefined).optional(), // (ExceedsBenefitAmount_Type) <= 13 characters Amount greater than available benefit coverage
  BenefitCardServicesPassThruData1: yup.string().max(999).default(undefined).optional(), // (BenefitCardServicesPassThruData1_Type) <= 999 characters A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
  BenefitCardServicesPassThruData2: yup.string().max(999).default(undefined).optional(), // (BenefitCardServicesPassThruData2_Type) <= 999 characters A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
  BenefitCardServicesPassThruData3: yup.string().max(999).default(undefined).optional(), // (BenefitCardServicesPassThruData3_Type) <= 999 characters A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
  BenefitCardServicesPassThruData4: yup.string().max(999).default(undefined).optional(), // (BenefitCardServicesPassThruData4_Type) <= 999 characters A variable length field that contains UPC/PLU information to validate products against an Approved Product List (APL)
})

export const AssuredPaymentsUserAccountDataSchema = yup.object({
  AssuredUserAccountNumber: yup.string().max(40).default(undefined).optional(), // (AssuredUserAccountNumber_Type) <= 40 characters Account number for user
  AssuredUserAccountCreationDate: yup.string().max(19).default(undefined).optional(), // (AssuredUserAccountCreationDate_Type) <= 19 characters Date account was created
  'AssuredUserAccountE-mail': yup.string().max(40).default(undefined).optional(), // (AssuredUserAccountE-mail_Type) <= 40 characters E-mail address for user associated with account
  AssuredUserAccountName: yup.string().max(40).default(undefined).optional(), // (AssuredUserAccountName_Type) <= 40 characters Username on account
  AssuredUserAccountPhoneNumber: yup.string().max(15).default(undefined).optional(), // (AssuredUserAccountPhoneNumber_Type) <= 15 characters Phone number on account
  AssuredUserAggregateOrderCount: yup.string().max(10).default(undefined).optional(), // (AssuredUserAggregateOrderCount_Type) <= 10 characters Order count
  AssuredUserAggregateOrderDollarAmount: AmountString.default(undefined).optional(), // (AssuredUserAggregateOrderDollarAmount_Type) <= 13 characters Amount for order
  AssuredUserLastUpdateDate: yup.string().max(19).default(undefined).optional(), // (AssuredUserLastUpdateDate_Type) <= 19 characters Date account was late updated
  AssuredUserLastOrderID: yup.string().max(32).default(undefined).optional(), // (AssuredUserLastOrderID_Type) <= 32 characters Last order ID used
  AssuredUserLastEmailUpdateDate: yup.string().max(19).default(undefined).optional(), // (AssuredUserLastEmailUpdateDate_Type) <= 19 characters Date account email was last updated
  AssuredUserLastPhoneUpdateDate: yup.string().max(19).default(undefined).optional(), // (AssuredUserLastPhoneUpdateDate_Type) <= 19 characters Date account phone was last updated
  AssuredUserLastPasswordUpdateDate: yup.string().max(19).default(undefined).optional(), // (AssuredUserLastPasswordUpdateDate_Type) <= 19 characters Date password was last updated
})

export enum AssuredOrderChannel {
  InStoreKiosk = 'ISK',
  MIT = 'MIT',
  Marketplace = 'MKT',
  MobileApp = 'MOB',
  Phone = 'PHO',
  ScanAndGo = 'SGO',
  Social = 'SOC',
  SmartTV = 'STV',
  Web = 'WEB',
}
const AssuredOrderChannelSchema = yup.mixed<AssuredOrderChannel>().oneOf(Object.values(AssuredOrderChannel))

export enum AssuredFulfillmentMethod {
  DeliveryLtBr = 'DEL',
  CounterPickup = 'CPU',
  CurbsidePickup = 'CBS',
  LockerPickup = 'LKP',
  StandardShipping = 'SDS',
  ExpeditedShipping = 'EDS',
}
const AssuredFulfillmentSchema = yup.mixed<AssuredFulfillmentMethod>().oneOf(Object.values(AssuredFulfillmentMethod))

export const AssuredPaymentsPurchaseInformationSchema = yup.object({
  AssuredOrderChannel: AssuredOrderChannelSchema.default(undefined).optional(), // string (AssuredOrderChannel_Type) <= 3 characters
  AssuredCarrier: yup.string().max(10).default(undefined).optional(), // (AssuredCarrier_Type) <= 10 characters Carrier information
  AssuredShippingCost: AmountString.default(undefined).optional(), // string (AssuredShippingCost_Type) <= 13 characters Cost of shipping
  AssuredShiptoName: yup.string().max(40).default(undefined).optional(), // (AssuredShiptoName_Type) <= 40 characters Name where purchase is being shipped
  AssuredAccountHolderName: yup.string().max(40).default(undefined).optional(), // (AssuredAccountHolderName_Type) <= 40 characters Name of account holder
  AssuredShippingDestinationEmail: yup.string().max(40).default(undefined).optional(), // (AssuredShippingDestinationEmail_Type) <= 40 characters E-mail address of shipping destination
  AssuredShipperOriginStreet: yup.string().max(50).default(undefined).optional(), // (AssuredShipperOriginStreet_Type) <= 50 characters Street address of origin
  AssuredShipperOriginCity: yup.string().max(13).default(undefined).optional(), // (AssuredShipperOriginCity_Type) <= 13 characters City of origin
  AssuredShipperOriginPostal: yup.string().max(10).default(undefined).optional(), // (AssuredShipperOriginPostal_Type) <= 10 characters Postal code of origin
  AssuredDiscountAmount: AmountString.default(undefined).optional(), // (AssuredDiscountAmount_Type) <= 13 characters Discounted amount
  AssuredDiscountPercentage: yup.string().max(3).default(undefined).optional(), // (AssuredDiscountPercentage_Type) <= 3 characters Percentage discount
  AssuredDiscountCode: yup.string().max(20).default(undefined).optional(), // (AssuredDiscountCode_Type) <= 20 characters Discount code
  AssuredFulfillmentMethod: AssuredFulfillmentSchema.default(undefined).optional(), // string (AssuredFulfillmentMethod_Type) <= 3 characters Fulfillment method
})

export const AssuredPaymentsItemSchema = yup.object({
  AssuredItemCategory: yup.string().max(40).default(undefined).optional(), // (AssuredItemCategory_Type) <= 40 characters Item category
  AssuredItemID: yup.string().max(40).default(undefined).optional(), // (AssuredItemID_Type) <= 40 characters Item ID
  AssuredDigitalIndicator: BooleanStringSchema, // string (AssuredDigitalIndicator_Type) <= 1 characters Digital indicator (Y/N)
  AssuredItemName: yup.string().max(40).default(undefined).optional(), // (AssuredItemName_Type) <= 40 characters Item name
  AssuredItemPrice: yup.string().max(8).default(undefined).optional(), // (AssuredItemPrice_Type) <= 8 characters Item price
  AssuredItemQuantity: yup.string().max(3).default(undefined).optional(), // (AssuredItemQuantity_Type) <= 3 characters Item quantity
  AssuredItemSubcatagory: yup.string().max(40).default(undefined).optional(), // (AssuredItemSubcategory_Type) <= 40 characters Item subcategory
  AssuredItemWeight: yup.string().max(8).default(undefined).optional(), // (AssuredItemWeight_Type) <= 8 characters Item weight
  AssuredShipmentID: yup.string().max(20).default(undefined).optional(), // (AssuredShipmentID_Type) <= 20 characters Shipment ID
  AssuredItemImageUrl: yup.string().max(100).default(undefined).optional(), // (AssuredItemImageUrl_Type) <= 100 characters URL of item image
  AssuredItemUrl: yup.string().max(100).default(undefined).optional(), // (AssuredItemUrl_Type) <= 100 characters URL of item
})

export const AssuredPaymentsGeneralDataSchema = yup.object({
  AssuredCheckoutID: yup.string().max(20).default(undefined).optional(), // (AssuredCheckoutID_Type) <= 20 characters Checkout ID
  AssuredDiscretionaryData: yup.string().max(15).default(undefined).optional(), // (AssuredDiscretionaryData_Type) <= 15 characters Discretionary data
})

export const AssuredPaymentsMembershipDataSchema = yup.object({
  AssuredEmailAddress: yup.string().max(40).default(undefined).optional(), // (AssuredEmailAddress_Type) <= 40 characters E-mail address of member
  AssuredMembershipID: yup.string().max(30).default(undefined).optional(), // (AssuredMembershipID_Type) <= 30 characters Membership ID
  AssuredMembershipName: yup.string().max(40).default(undefined).optional(), // (AssuredMembershipName_Type) <= 40 characters Membership name
  AssuredMembershipPhoneNumber: yup.string().max(15).default(undefined).optional(), // (AssuredMembershipPhoneNumber_Type) <= 15 characters Membership phone number
})

export const AssuredSellerDataSchema = yup.object({
  AssuredSellerAccountNumber: yup.string().max(40).default(undefined).optional(), // (AssuredSellerAccountNumber_Type) <= 40 characters Account number
  AssuredSellerAddressLine1: yup.string().max(40).default(undefined).optional(), // (AssuredSellerAddressLine1_Type) <= 40 characters Address line 1
  AssuredSellerAddressLine2: yup.string().max(40).default(undefined).optional(), // (AssuredSellerAddressLine2_Type) <= 40 characters Address line 2
  AssuredSellerCity: yup.string().max(18).default(undefined).optional(), // (AssuredSellerCity_Type) <= 18 characters City
  AssuredSellerState: yup.string().max(2).default(undefined).optional(), // (AssuredSellerState_Type) <= 2 characters State
  AssuredSellerPostalCode: yup.string().max(10).default(undefined).optional(), // (AssuredSellerPostalCode_Type) <= 10 characters Postal code
  AssuredSellerCountry: yup.string().max(3).default(undefined).optional(), // (AssuredSellerCountry_Type) <= 3 characters Country
  AssuredSellerCreateDate: yup.string().max(19).default(undefined).optional(), // (AssuredSellerCreateDate_Type) <= 19 characters Assured seller create date
  AssuredSellerDomain: yup.string().max(40).default(undefined).optional(), // (AssuredSellerDomain_Type) <= 40 characters Assured seller domain
  AssuredSellerEmail: yup.string().max(40).default(undefined).optional(), // (AssuredSellerEmail_Type) <= 40 characters Seller e-mail address
  AssuredSellerLastUpdateDate: yup.string().max(19).default(undefined).optional(), // (AssuredSellerLastUpdateDate_Type) <= 19 characters Assured seller last update date
  AssuredSellerName: yup.string().max(40).default(undefined).optional(), // (AssuredSellerName_Type) <= 40 characters Assured seller name
  AssuredSellerOnboardEmail: yup.string().max(40).default(undefined).optional(), // (AssuredSellerOnboardEmail_Type) <= 40 characters Onboard e-mail address
  AssuredSellerOnboardIP: yup.string().max(15).default(undefined).optional(), // (AssuredSellerOnboardIP_Type) <= 15 characters Onboard IP address
  AssuredSellerOnboardPhone: yup.string().max(15).default(undefined).optional(), // (AssuredSellerOnboardPhone_Type) <= 15 characters Onboard phone number
  AssuredSellerTag01: yup.string().max(100).default(undefined).optional(), // (AssuredSellerTag01_Type) <= 100 characters Tag 01
  AssuredSellerTag02: yup.string().max(100).default(undefined).optional(), // (AssuredSellerTag02_Type) <= 100 characters Tag 02
  AssuredSellerTag03: yup.string().max(100).default(undefined).optional(), // (AssuredSellerTag03_Type) <= 100 characters Tag 03
  AssuredSellerTag04: yup.string().max(100).default(undefined).optional(), // (AssuredSellerTag04_Type) <= 100 characters Tag 04
  AssuredSellerTag05: yup.string().max(100).default(undefined).optional(), // (AssuredSellerTag05_Type) <= 100 characters Seller tag 05
  AssuredSellerUserName: yup.string().max(40).default(undefined).optional(), // (AssuredSellerUserName_Type) <= 40 characters User name
  AssuredSellerOrderCount: yup.string().max(10).default(undefined).optional(), // (AssuredSellerOrderCount_Type) <= 10 characters Order count
  AssuredSellerOrderAmount: AmountString.default(undefined).optional(), // string (AssuredSellerOrderAmount_Type) <= 13 characters Order amount
})

export enum AssuredSubscriptionFrequency {
  Weekly = 'WEK',
  Monthly = 'MTH',
  Quarterly = 'QTR',
  Yearly = 'YER',
}
const AssuredFulfillmentMethodSchema = yup
  .mixed<AssuredFulfillmentMethod>()
  .oneOf(Object.values(AssuredFulfillmentMethod))

export const AssuredSubscriptionDataSchema = yup.object({
  AssuredSubscriptionID: yup.string().max(40).default(undefined).optional(), // (AssuredSubscriptionID_Type) <= 40 characters Subscription ID
  AssuredSubscriptionNextDeliveryDate: yup.string().max(10).default(undefined).optional(), // (AssuredSubscriptionNextDeliveryDate_Type) <= 10 characters Subscription next delivery date
  AssuredSubscriptionFrequency: AssuredFulfillmentMethodSchema.default(undefined).optional(), // string (AssuredSubscriptionFrequency_Type) <= 3 characters Subscription frequency AssuredSubscriptionItemNumber string (AssuredSubscriptionItemNumber_Type) <= 3 characters Subscription number of items
  AssuredSubscriptionItemPrice: AmountString.default(undefined).optional(), // (AssuredSubscriptionItemPrice_Type) <= 13 characters Subscription item price
  AssuredSubscriptionPeriod: yup.string().max(3).default(undefined).optional(), // (AssuredSubscriptionPeriod_Type) <= 3 characters Subscription period
})

export const AdditionalFraudDataSchema = yup.object({
  CardholderName: yup.string().max(20).required(), // <= 20 characters, 20 character name on card to be passed to merchant fraudsight
})
export type AdditionalFraudData = yup.InferType<typeof AdditionalFraudDataSchema>

const TerminalClassificationCodeValues = [
  'AC', // mPOS Accessory/dongle with contact and contactless interfaces with or without PIN pad
  'AS', // mPOS Accessory/dongle with contact and contactless interfaces and PIN on Glass support (SCRP, Sofware-base PIN on COTS)
  'CC', // Contactless Payment of COTS (CPoc) - Mobile device based contactless only mPOS without PIN support
  'CS', // Contactless Payment of COTS (CPoc) - Mobile device based contactless only mPOS with PIN on Glass Support
]
const TerminalClassificationCodeSchema = yup.string().oneOf(TerminalClassificationCodeValues)

export const AdditionalPOSDataSchema = yup.object({
  POSApplicationID: yup.string().max(6).optional(), // <= 6 characters, The application ID associated with the installed POS software.
  POSApplicationName: yup.string().max(50).optional(), // <= 50 characters, The application name associated with the installed POS software.
  POSApplicationVersion: yup.string().max(50).optional(), // <= 50 characters, The application version associated with the installed POS software.
  POSCustomerReferenceNumber: yup.string().max(20).optional(), // <= 20 characters, Customer specific reference/ticket number used for tracking transactions
  POSGatewayTransactionID: yup.string().max(20).optional(), // <= 20 characters, Gateway specific transaction ID used for tracking transactions.
  TerminalClassificationCode: TerminalClassificationCodeSchema.default(undefined).optional(), // <= 2 characters, Terminal Classification Code which applies to transactions that originated using a mobile device. Valid Values:
})
export type AdditionalPOSData = yup.InferType<typeof AdditionalPOSDataSchema>

export enum RiskStatus { // <= 1 characters, If requested, the current risk status from Merchant Fraudsight will be returned.
  Pass = '0', // - Pass
  Review = '1', // - Review
  Fail = '2', // - Fail
  Unknown = '3', // - Unknown
  FailButApproved = '4', // - Fail, informational only: Transaction approved
}
export interface AdditionalFraudData_Resp {
  RiskStatus?: RiskStatus
  RiskScore?: string // <= 6 characters, If requested, the current risk score from Merchant Fraudsight will be returned where the risk score is between 0.0000 and 1.0000.
}

export type AVSResult =
  | 'A' // Address Matches, ZIP does not
  | 'B' // Address Matches, ZIP not verified
  | 'C' // Address an ZIP not verified
  | 'D' // Address and postal code match, international AVS only
  | 'E' // Edit Error or ineligible
  | 'F' // Address and ZIP match - UK only
  | 'G' // Address not verified - international
  | 'I' // Address not verified
  | 'M' // Address and postal code match, international AVS only
  | 'N' // Neither address nor ZIP match
  | 'P' // Codes match, addresses not verified
  | 'R' // System unavailable or time-out
  | 'S' // AVS not supported
  | 'U' // Address info N/A
  | 'W' // Nine digit zip matches, not address
  | 'X' // Address and nine digit zip match, domestic AVS only
  | 'Y' // Address and five digit zip match, domestic AVS only
  | 'Z' // ZIP matches, address does not

export interface AddressVerificationData_Resp {
  AVSResult: AVSResult // <= 1 characters, Worldpay returns this field in the response message if the authorization request included AVSZipCode or AVSAddress.
}

export enum Cvv2Cvc2CIDResult {
  UnpredictableNumberError = 'E', // PAYPASS - UNPREDICTABLE NUMBER ERROR
  Matches = 'M', // CVV2/CVC2/CID VALUE MATCHES
  DoesNotMatch = 'N', // CVV2/CVC2/CID VALUE DOES NOT MATCH
  NotProcessed = 'P', // CVV2/CVC2/CID VALUE NOT PROCESSED
  OnCardNotRequest = 'S', // CVV2/CVC2/CID ON CARD, NOT REQUEST
  NotApplicable = 'U', // CVV2/CVC2/CID VALIDATION N/A
  CVS1_3Error = 'Y', // SWIPED AND PAYPASS - CVC1/3 ERROR
}

export interface CardVerificationData_Resp {
  Cvv2Cvc2CIDResult: Cvv2Cvc2CIDResult // <= 1 characters If the authorization request included CVV2, CVC2, or CID, the following values are returned:
}

export interface EMVData_Resp {
  EMVICCData?: string // <= 1020 characters, This field supports ICC Data captured by the merchant terminal in TLV format. This data is sent on to the network.
}

export type EmbeddedNetworkTokenResult =
  | 'S' // Attempted/Successfully Retrieved Network Token
  | 'F' // Attempted/Failed to Retrieve a Network Token on this Transaction
  | 'N' // Not Attempted

export interface EncryptionTokenData_Resp {
  TokenizedPAN?: string // <= 22 characters, This field contains the tokenized PAN. When you initiate a transaction using a token, the PAN is not included in the regular PAN field. Worldpay recommends that merchants provide the expiration date with every transaction that is initiated with a token. Using the expiration date is one of the simplest methods for fraud prevention in place, because they are mandated by operating agreements with card brands to help protect against fraud. Issuing banks may likely decline online purchases and purchases over the phone that do not contain expiration date. For high value token to low value token transactions, Worldpay requires this field.
  TokenID?: string // <= 6 characters, The field contains the token ID, which is included with the token in responses for Worldpay Legacy Reverse Crypto merchants only. Token initiated request messages may or may not include it. For merchants using the new OmniToken, response messages only use the token ID to indicate a tokenization failure. In this case, the token value is not present, and the token ID contains ZZZZZZ.
  CardResultsPAN?: string // <= 20 characters, This field contains the clear PAN returned from encryption services.
  PANMappingPAN?: string // <= 20 characters, This field contains the PAN resulting from the PAN mapping network process.
  // This can be returned if PANMappingRequest or NTWKTokenRequest are sent in the request message.
  'PAN-Last4'?: string // <= 4 characters, This field contains the last 4 digits of the PAN either from encryption services or network tokenization processing.
  // If PANMappingRequest or NTWKTokenRequest are sent in the request message, the network can provide the last 4 digits of the primary account number.
  // If ReturnPanLast4 is sent in the request message, then either the last 4 of the account number passed in or the clear PAN returned via encryption services can be returned.
  // On AccountRetrieve transactions, if the last 4 of the primary account number is available in the vault, Worldpay will return it by default without it needing to be requested.
  PANMappingEXPDate?: string // <= 4 characters, PAN Mapping - Expiration Date
  // This can be returned if PANMappingRequest is sent in the request message.
  LowValueToken?: string // <= 20 characters, The field contains a temporary token with an expiration time used with eProtect (a card not present or eComm security product). In a card not present online environment a low value token is presented in lieu of PAN and optional CVV information.
  TokenAssuranceLevel?: string // <= 2 characters, Contains a value indicating the confidence level of the token to PAN/cardholder binding.
  // 00 - 99, where 00 indicates that no ID and Verification was performed on the Payment Token and where 99 indicates the highest possible assurance.
  // This can be returned if NTWKTokenRequest is sent in the request message.
  TokenRequestorID?: string // <= 11 characters, Contains the ID assigned by the Token Service Provider to the Token Requestor.
  // This can be returned if NTWKTokenRequest is sent in the request message.
  PANMappingProduct?: string // <= 3 characters, Contains the PAN mapping product associated with the PAN being mapped.
  // This can be returned if PANMappingRequest is sent in the request message.
  PANMappingIndicator?: string // <= 1 characters, Indicates the type of PAN mapping account.
  // This can be returned if PANMappingRequest is sent in the request message.
  TokenMaskedPAN?: string // <= 20 characters, This field contains the masked PAN returned from encryption services.
  EmbeddedNetworkToken?: string // <= 16 characters, If Worldpay has a network token provisioned for the Primary Account Number utilized for the transaction and the transaction meets the criteria for using the token, it will return the token in this field if requested.
  EmbeddedNetworkTokenCryptogram?: string // <= 40 characters, If Worldpay has a network token provisioned for the Primary Account Number utilized for the transaction and the transaction meets the criteria for using the token, it will return the token cryptogram in this field if requested and available.
  // Note: The merchant must be signed up for the Worldpay TMS product.
  EmbeddedNetworkTokenResult?: EmbeddedNetworkTokenResult // <= 1 characters, Result of the Worldpay embedded or intelligent scheme token management service (TMS) on this transaction if applicable.
  // Note: The merchant must be signed up for the Worldpay TMS product.
}

export interface ErrorInformation_Resp {
  FieldInError?: string // <= 50 characters, Field flagged in error during transaction processing
  ErrorText?: string // <= 20 characters, Portion of the field data detected as being in error
}

export interface FisLoyaltyData_Resp {
  FisDiscountedAmount?: string // <= 13 characters, The actual discounted amount returned to the terminal so the customer can determine whether to opt in/out.
  FisLoyaltyTransactionID?: string // <= 26 characters, The FIS transaction ID that ties requests together. It should be sent on any follow-up messages.
  FisLoyaltyRewardID?: string // <= 12 characters, This field contains the reward ID associated with the transaction.
  FisLoyaltyPromoID?: string // <= 11 characters, This field contains the loyalty program associated with the transaction.
  FisLoyaltySequenceNumber?: string // <= 25 characters, This field contains the loyalty sequence number that must be submitted on subsequent loyalty transactions.
  FisLoyaltyReservationID?: string // <= 20 characters, This contains the reservation ID used with the loyalty system to reserve/finalize e-comm Premium Payback transactions.
  FisLoyaltyPSPID?: string // <= 20 characters, This contains the PSP identifier associated with the processor who holds the loyalty reservation. It will be ignored without a Loyalty Reservation ID.
}

export interface ProcFlagsIndicators_Resp {
  PinlessConverted?: string // <= 1 characters, Y/N flag indicating whether Worldpay was able to successfully perform a PINLess conversion.
  'CVV2FromReg-ID'?: string // <= 1 characters, Y/N flag indicating if a CVV2 was generated from a low value token.
}

export interface RawNetworkData_Resp {
  RawResponseCode?: string // <= 5 characters, The actual response code returned by the network.
  RawAVSResult?: string // <= 1 characters, The actual AVS result returned by the network.
  RawCvvCvcCIDResult?: string // <= 1 characters, The actual CVV/CVC/CID result returned by the network.
  RawRecurringPaymentResult?: string // <= 1 characters, The actual recurring payment result returned by the network.
  Raw3DSecureResult?: string // <= 1 characters, The actual e-commerce 3D Secure result returned by the network.
  RawAdditionalAmount1?: string // <= 20 characters, The actual additional amount returned from the network.
  RawAdditionalAmount2?: string // <= 20 characters, The actual additional amount returned from the network.
  RawAdditionalAmount3?: string // <= 20 characters, The actual additional amount returned from the network.
  RawAdditionalAmount4?: string // <= 20 characters, The actual additional amount returned from the network.
  RawAdditionalAmount5?: string // <= 20 characters, The actual additional amount returned from the network.
  RawAdditionalAmount6?: string // <= 20 characters, The actual additional amount returned from the network.
  RawEntryMode?: string // <= 2 characters, The actual entry mode that was sent to the network.
  RawPinEntryCapability?: string // <= 1 characters, The actual PIN entry capability that was sent to the network.
}

export interface ReferenceTraceNumbers_Resp {
  SystemTraceNumber?: string // <= 6 characters, This field contains a transaction sequence number associated with the acquiring terminal that identifies this transaction to the acquiring terminal. This value will be generated by Worldpay.
  RetrievalREFNumber?: string // <= 12 characters, This field yields a value generated by the message originator to associate a unique identifier to a given transaction. You can use this value to identify the transaction throughout the transaction's life cycle (authorization, reversal, and so on). This value can be generated by Worldpay if not sent by the originator and required by the specific network.
  // Note: This data element can contain up to 12 alphanumeric characters. Worldpay recommends the following layout, although it is not required to be in this format.
  // - Position 1-4 = Julian date (YDDD)
  // - Position 5-12 = Actual terminal sequence number
  CorrelationID?: string // <= 25 characters, A value that can be generated by the acquirer to associate transactions in reporting and research.
  AuthorizationNumber?: string // <= 6 characters, This field contains a value generated by the authorizing processor to indicate their acceptance of the transaction. If a value is not generated by either Worldpay or the network on approved transactions, Worldpay will generate one and return it to the merchant.
  DraftLocator?: string // <= 11 characters, This field allows merchants to include the draft locator so that it can be logged and eventually presented in reporting utilities.
  PaymentAcctREFNumber?: string // <= 35 characters, A PAR is a unique value associated with a single PAN and attributed to all tokens associated with that PAN. A PAR can be used to link transactions containing PANs or tokens associated with the same underlying payment account
  NetworkTraceNumber?: string // <= 6 characters, The system trace number that was used between Worldpay and the network.
  NetworkRefNumber?: string // <= 12 characters, The Retrieval Reference Number that was used between Worldpay and the network.
  PanReferenceID?: string // <= 35 characters, A unique non-financial reference number assigned to a given PAN.
}

export interface STPData_Resp {
  STPReferenceNUM: string // <= 9 characters, Worldpay assigned reference number on each transaction that is returned to the terminal. Sent by the terminal on follow-up messages in order to match back to the original transaction.
}

export type RegulationIndicator =
  | ' ' // Unknown
  | '0' // Not regulated
  | '1' // Regulated
  | '2' // Regulated with fraud adjustment
  | '3' // Not regulated, preferred
  | '4' // Regulated, preferred
  | '5' // Regulated with fraud adjustment, preferred

export interface SettlementData_Resp {
  RegulationIndicator?: RegulationIndicator // <= 1 characters, This field contains data that indicates the regulation category in which the issuer's BIN participates.
  SettlementNetwork?: string // <= 4 characters, The acquirer settlement entity that Worldpay logs for settlement purposes.
  SettlementDate?: string // <= 8 characters, The current date (YYYYMMDD format) for settlement of the transaction.
}

export interface WorldPayRoutingData_Resp {
  NetworkId?: string // <= 4 characters, The ID for the network to which Worldpay sent the transaction to.
  EMVAIDRoutingDone?: BooleanString // <= 1 characters, Y/N flag indicating whether Worldpay performed EMV AID routing for the transaction.
  DCCEligibleBin?: BooleanString // <= 1 characters, Y/N flag indicating whether the BIN is DCC eligible
  NetworkDescription?: string // <= 25 characters, The description of the network to which Worldpay sent the transaction to. This is included if the Extended Network Routing Flag (ExtendedNetworkRoutingDataRequest) is passed in and the data is available.
}

export interface CustomerInformation_Resp {
  IssuerCountryCode: string // <= 3 characters, Issuer (Bank) Country Code
}
