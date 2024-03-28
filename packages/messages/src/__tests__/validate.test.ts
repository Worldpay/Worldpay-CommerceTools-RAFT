import {
  AccountSelected,
  BooleanString,
  CreditAuth,
  CreditCompletion,
  CreditPurchase,
  EntryMode,
  MiscAmountsBalances,
  TerminalType,
  validateCreditAuth,
  validateCreditCompletion,
  validateCreditPurchase,
  validateMiscAmountsBalances,
} from '../'

describe('Validation', () => {
  it('accepts proper number strings', () => {
    const numbers: MiscAmountsBalances = {
      TransactionAmount: '+1212121.99',
    }
    const result = validateMiscAmountsBalances(numbers)
    expect(result).toEqual({ TransactionAmount: '+1212121.99' })
  })

  it('accepts proper number strings without a sign and decimals', () => {
    const numbers: MiscAmountsBalances = {
      TransactionAmount: '1212121',
    }
    const result = validateMiscAmountsBalances(numbers)
    expect(result).toEqual({ TransactionAmount: '1212121' })
  })

  it('accepts negative number strings with decimals', () => {
    const numbers: MiscAmountsBalances = {
      TransactionAmount: '-00012345.25',
    }
    const result = validateMiscAmountsBalances(numbers)
    expect(result).toEqual({ TransactionAmount: '-00012345.25' })
  })

  it('does not accept number strings with alphabetic characters', () => {
    const numbers: MiscAmountsBalances = {
      TransactionAmount: '1212b121',
    }
    expect(() => validateMiscAmountsBalances(numbers)).toThrow(
      'String number must conform to "^[+-]?[0-9]{1,9}[.[0-9]{2}]]?$"',
    )
  })

  it('does not accept number strings over 9 digits on the dollar', () => {
    const numbers: MiscAmountsBalances = {
      TransactionAmount: '1234567890',
    }
    expect(() => validateMiscAmountsBalances(numbers)).toThrow(
      'String number must conform to "^[+-]?[0-9]{1,9}[.[0-9]{2}]]?$"',
    )
  })

  it('does not accept number strings with alphabetic characters on optional attributes either', () => {
    const numbers: MiscAmountsBalances = {
      TransactionAmount: '12124121',
      CashBackAmount: '1212b121',
      SurchargeAmount: '1212b121',
      ConvenienceFEE: '1212b121',
      TIPAmount: '1212b121',
      DispensedAmount: '1212b121',
      SalesTAXAmount: '1212b121',
      CumulativeAmount: '1212b121',
      PaymentTrailingAmt: '1212b121',
      OPTUMAmount: '1212b121',
    }
    expect(() => validateMiscAmountsBalances(numbers)).toThrow('9 errors occurred')
  })

  it('does support validating the sample CreditPurchase payload', () => {
    const creditPurchaseSample: CreditPurchase = {
      creditpurchase: {
        MiscAmountsBalances: {
          TransactionAmount: '1.00',
        },
        AccountCodesAndData: {
          FromAccountSelected: AccountSelected.CreditCard,
        },
        CardInfo: {
          TRACK_1: 'B1111222233334444^DOE/JON                   ^49121010000012300000',
          ExpirationDate: '4912',
        },
        TerminalData: {
          // Below you see two ways to use the enums:
          EntryMode: 'SWIPED' as EntryMode, // Casting, does not validate, if 'SWIPED' was a variable, it could violate the type
          TerminalType: TerminalType.POS, // Direct use of the enum
          TerminalNumber: '090335802001',
        },
        ProcFlagsIndicators: {
          PartialAllowed: BooleanString.YES,
          SignatureCapture: BooleanString.YES,
        },
        MerchantSpecificData: {
          LaneRegister: '005',
          Division: '0099',
        },
        ReferenceTraceNumbers: {
          RetrievalREFNumber: '200634200634',
        },
        WorldPayMerchantID: '123456789',
        APITransactionID: '2019120412271401',
        LocalDateTime: '2020-03-17T14:53:54',
      },
    }
    validateCreditPurchase(creditPurchaseSample)
  })

  it('does support validating the sample CreditAuthorization payload', () => {
    const authorizationSample: CreditAuth = {
      creditauth: {
        MiscAmountsBalances: {
          TransactionAmount: '10.00',
        },
        CardInfo: {
          TRACK_2: '1111222233334444=49121010000012300001',
          ExpirationDate: '4912',
        },
        ProcFlagsIndicators: {
          PartialAllowed: BooleanString.YES,
        },
        ReferenceTraceNumbers: {
          RetrievalREFNumber: '200634200634',
        },
        WorldPayMerchantID: '4445012345678',
        APITransactionID: '2019120412271401',
        LocalDateTime: '2020-03-17T14:53:54',
      },
    }
    validateCreditAuth(authorizationSample)
  })

  it('does support validating the sample CreditCompletion payload', () => {
    const completionSample: CreditCompletion = {
      creditcompletion: {
        MiscAmountsBalances: {
          TransactionAmount: '10.00',
          PreauthorizedAmount: '10.00',
        },
        CardInfo: {
          TRACK_2: '1111222233334444=49121010000012300001',
          ExpirationDate: '4912',
        },
        ProcFlagsIndicators: {
          PartialAllowed: BooleanString.YES,
        },
        ReferenceTraceNumbers: {
          RetrievalREFNumber: '200634200634',
        },
        WorldPayMerchantID: '4445012345678',
        APITransactionID: '2019120412271401',
        LocalDateTime: '2020-03-17T14:53:54',
      },
    }
    validateCreditCompletion(completionSample)
  })
})
