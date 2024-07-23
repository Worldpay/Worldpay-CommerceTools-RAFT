import {
  PaymentAddInterfaceInteractionAction,
  PaymentAddTransactionAction,
  PaymentSetCustomFieldAction,
  PaymentSetInterfaceIdAction,
  PaymentSetMethodInfoMethodAction,
  PaymentSetMethodInfoNameAction,
  PaymentTransitionStateAction,
  StateResourceIdentifier,
  TransactionState,
  TransactionType,
  TypedMoney,
  PaymentChangeAmountPlannedAction,
  PaymentSetStatusInterfaceCodeAction,
  PaymentSetStatusInterfaceTextAction,
  Transaction,
  PaymentChangeTransactionStateAction,
  PaymentChangeTransactionTimestampAction,
  PaymentChangeTransactionInteractionIdAction,
  PaymentSetTransactionCustomFieldAction,
  PaymentSetTransactionCustomTypeAction,
} from '@commercetools/platform-sdk'

export type StateKey = 'payment-paid' | 'payment-open' | 'payment-refunded' | 'payment-cancelled' | 'payment-failed'
/**
 * Builds an interface interaction action
 * @param request The request that was sent to RAFT
 * @param response The response that was received from RAFT
 * @param apiTransactionId Optional transaction id, used by RAFT to identify subsequent transactions on an Authorised transaction
 */
export function buildInterfaceInteraction(
  request: object,
  response: object,
  apiTransactionId?: string,
): PaymentAddInterfaceInteractionAction {
  return {
    action: 'addInterfaceInteraction',
    type: {
      typeId: 'type',
      key: 'worldpay-raft-interface-interaction',
    },
    fields: {
      createdAt: new Date().toISOString(),
      ...(apiTransactionId && { apiTransactionId }),
      request: JSON.stringify(request),
      response: JSON.stringify(response),
    },
  }
}

/**
 * Builds an addTransaction action
 * @param amount The amount of the transaction as a string (adhering to WorldPay amount format)
 * @param type The type of the transaction
 * @param state The state of the transaction
 * @param interactionId The interactionId of the transaction
 * @param authorizationNumber The AuthorizationNumber returned by RAFT
 * @param retrievalREFNumber The RetrievalREFNumber returned by RAFT
 * @param currencyCode The currency code of the transaction, defaults to 'USD'
 */
export function buildAddTransaction(
  amount: string,
  type: TransactionType,
  state: TransactionState,
  interactionId: string,
  authorizationNumber?: string,
  retrievalREFNumber?: string,
  currencyCode = 'USD',
): PaymentAddTransactionAction {
  return {
    action: 'addTransaction',
    transaction: {
      type,
      amount: convertStringToAmount(amount, currencyCode),
      state,
      ...(interactionId && { interactionId }),
      timestamp: new Date().toISOString(),
      ...((authorizationNumber || retrievalREFNumber) && {
        custom: {
          type: {
            typeId: 'type',
            key: 'raft-transaction',
          },
          fields: {
            ...(authorizationNumber && { authorizationNumber: authorizationNumber }),
            ...(retrievalREFNumber && { retrievalREFNumber: retrievalREFNumber }),
          },
        },
      }),
    },
  }
}

/**
 * Builds the actions to modify an existing transaction
 * @param transaction The existing transaction
 * @param success True if the updated transaction was a success
 * interactionId The (new) interactionId
 */
export function buildChangeTransactionActions(
  transaction: Transaction,
  success: boolean,
  interactionId?: string,
): (
  | PaymentChangeTransactionStateAction
  | PaymentChangeTransactionTimestampAction
  | PaymentChangeTransactionInteractionIdAction
  | PaymentSetTransactionCustomFieldAction
)[] {
  const actions: (
    | PaymentChangeTransactionStateAction
    | PaymentChangeTransactionTimestampAction
    | PaymentChangeTransactionInteractionIdAction
    | PaymentSetTransactionCustomFieldAction
  )[] = [
    {
      action: 'changeTransactionState',
      transactionId: transaction.id,
      state: success ? 'Success' : 'Failure',
    },
    {
      action: 'changeTransactionTimestamp',
      transactionId: transaction.id,
      timestamp: new Date().toISOString(),
    },
  ]
  if (interactionId && transaction.interactionId !== interactionId) {
    actions.push({ action: 'changeTransactionInteractionId', transactionId: transaction.id, interactionId })
  }
  return actions
}

/**
 * Builds a payment status update transition action
 * @param stateKey The state key to transition to
 */
export function buildUpdatePaymentStateAction(stateKey: StateKey): PaymentTransitionStateAction {
  const state: StateResourceIdentifier = {
    typeId: 'state',
    key: stateKey,
  }
  return {
    action: 'transitionState',
    state,
  }
}

/**
 * Sets the PSP interface id for the payment
 */
export function buildPaymentInterfaceIdAction(interfaceId: string): PaymentSetInterfaceIdAction {
  return {
    action: 'setInterfaceId',
    interfaceId,
  }
}

/**
 * Sets the PSP status code for the payment
 */
export function buildPaymentStatusInterfaceCodeAction(code: string): PaymentSetStatusInterfaceCodeAction {
  return {
    action: 'setStatusInterfaceCode',
    interfaceCode: code,
  }
}

/**
 * Sets the PSP status code for the payment
 */
export function buildPaymentStatusInterfaceTextAction(text: string): PaymentSetStatusInterfaceTextAction {
  return {
    action: 'setStatusInterfaceText',
    interfaceText: text,
  }
}

/**
 * Sets the payment method 'method'
 * @param method The payment method
 */
export function buildPaymentMethodAction(method: string): PaymentSetMethodInfoMethodAction {
  return {
    action: 'setMethodInfoMethod',
    method,
  }
}

/**
 * Sets the payment method name
 * @param name The English payment method name
 */
export function buildPaymentMethodNameAction(name: string): PaymentSetMethodInfoNameAction {
  return {
    action: 'setMethodInfoName',
    name: {
      en: name,
    },
  }
}

/**
 * Set the amountPlanned of the payment to the balance of a gift card
 */
export function buildAmountPlannedAction(amount: string): PaymentChangeAmountPlannedAction {
  return {
    action: 'changeAmountPlanned',
    amount: convertStringToAmount(amount, 'USD'),
  }
}
/**
 * Clears the request custom field, so the next update to the payment doesn't unintentionally
 * resend the previous request to Worldpay RAFT
 */
export function buildClearRequestAction(): PaymentSetCustomFieldAction {
  return {
    action: 'setCustomField',
    name: 'request',
    value: null,
  }
}

/**
 * Adds the tokenized PAN to the payment
 * @param tokenizedPAN: The tokenized PAN, that can be used for subsequent actions and card-on-file
 */
export function buildAddTokenizedPANAction(tokenizedPAN: string): PaymentSetCustomFieldAction {
  return buildCustomFieldAction('tokenizedPAN', tokenizedPAN)
}

/**
 * Adds the STPReferenceNUM to the payment
 * @param stpReferenceNUM: The STPReferenceNUM, that can be used for subsequent requests
 */
export function buildAddSTPReferenceNUMAction(stpReferenceNUM: string): PaymentSetCustomFieldAction {
  return buildCustomFieldAction('STPReferenceNUM', stpReferenceNUM)
}

/**
 * Adds the PinlessConverted flag to the payment
 * @param pinlessConverted: Optional flag, defaulting to true
 */
export function buildAddPinlessConvertedAction(pinlessConverted = true): PaymentSetCustomFieldAction {
  return buildCustomFieldAction('PinlessConverted', pinlessConverted)
}

/**
 * Adds the expiration date to the payment
 * @param expirationDate: The expiration date, that can be used for subsequent actions and card-on-file
 */
export function buildAddExpirationDateAction(expirationDate: string): PaymentSetCustomFieldAction {
  return buildCustomFieldAction('expirationDate', expirationDate)
}

export function buildAddSecurityCodeAction(gcSecurityCode: string): PaymentSetCustomFieldAction {
  return buildCustomFieldAction('gcSecurityCode', gcSecurityCode)
}

/**
 * Internal function to add custom fields
 * @param fieldName The name of the field
 * @param fieldValue The value of the field
 */
function buildCustomFieldAction(fieldName: string, fieldValue?: any): PaymentSetCustomFieldAction {
  return {
    action: 'setCustomField',
    name: fieldName,
    value: fieldValue,
  }
}

/**
 * Sets the request custom field
 * @param request The new value for the request
 * @returns The commercetools action to set the request field
 */
export function buildSetRequestAction(request: string): PaymentSetCustomFieldAction {
  return {
    action: 'setCustomField',
    name: 'request',
    value: request,
  }
}

/**
 * Sets the retryCount custom field for a transaction
 * @param transaction The transaction on which to set the count
 * @param count The new value for the count - use negative for reversal
 */
export function buildSetRetryCountAction(
  transaction: Transaction,
  count: number,
): PaymentSetTransactionCustomFieldAction | PaymentSetTransactionCustomTypeAction {
  if (transaction.custom) {
    return {
      action: 'setTransactionCustomField',
      name: 'retryCount',
      value: count,
      transactionId: transaction.id,
    }
  }
  return {
    action: 'setTransactionCustomType',
    type: {
      key: 'raft-transaction',
      typeId: 'type',
    },
    fields: {
      retryCount: count,
    },
    transactionId: transaction.id,
  }
}

/**
 * Converts a WorldPay RAFT amount from string to commercetools TypedMoney
 * @param amount The amount as a string
 * @param currencyCode The currencyCode as a string
 * @returns A commercetools object representing the amount with centAmount, currencyCode and fractionDigits
 */
function convertStringToAmount(amount: string, currencyCode: string): TypedMoney {
  return {
    centAmount: getCentAmount(amount),
    currencyCode,
    fractionDigits: 2,
    type: 'centPrecision',
  }
}

/**
 * Converts a string to an integer number representing the amount in cents
 */
function getCentAmount(amount: string) {
  return truncate(parseFloat(amount) * 100)
}

/**
 * Truncates a number to an integer
 * @param value The number to truncate
 * @returns The truncated number
 */
function truncate(value: number) {
  if (value < 0) {
    return Math.ceil(value)
  }
  return Math.floor(value)
}
