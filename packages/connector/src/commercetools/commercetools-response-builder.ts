import { ExtensionError, PaymentExtensionResponse, PaymentResponseWithId } from '../types'
import { PaymentUpdateAction } from '@commercetools/platform-sdk'

/**
 * Build a general error response for commercetools, using a single 'General' error with a message
 * @param message The error message
 */
export function buildGeneralError(message: string): PaymentExtensionResponse {
  return buildError({ code: 'General', message: message })
}

/**
 * Build an error response for commercetools, with a single error
 * @param error The error
 */
export function buildError(error: ExtensionError): PaymentExtensionResponse {
  return buildErrors([error])
}

/**
 * Build an error response for commercetools, containing multiple errors
 * @param errors The errors to include in the response
 * @returns The commercetools error response
 */
export function buildErrors(errors: ExtensionError[]): PaymentExtensionResponse {
  return {
    responseType: 'FailedValidation',
    errors: errors,
  }
}

/**
 * Build a success response for commercetools, allowing the update to be persisted.
 * The list of actions is empty, meaning not changes caused by the connector.
 * @returns The commercetools success response
 */
export function buildEmptySuccess(): PaymentExtensionResponse {
  return buildSuccess([])
}

/**
 * Build a success response for commercetools, including a number of actions to persist
 * on the payment object.
 * @param actions The actions to persist on the payment object
 * @returns The commercetools success response
 */
export function buildSuccess(actions: PaymentUpdateAction[]): PaymentExtensionResponse {
  return {
    responseType: 'UpdateRequest',
    actions,
  }
}

/**
 * Build a success response with id, allowing the update to be persisted.
 * The list of actions is empty, meaning not changes caused by the connector.
 * @returns The commercetools success response
 */
export function buildEmptySuccessWithId(paymentId: string, version: number): PaymentResponseWithId {
  return buildSuccessWithId([], paymentId, version)
}

/**
 * Build a success response for commercetools, including a number of actions to persist
 * on the payment object.
 * @param actions The actions to persist on the payment object
 * @param paymentId The id of the payment that needs to be updated
 * @returns The commercetools success response
 */
export function buildSuccessWithId(
  actions: PaymentUpdateAction[],
  paymentId: string,
  version: number,
): PaymentResponseWithId {
  return {
    responseType: 'UpdateRequest',
    actions,
    paymentId,
    version,
  }
}

/**
 * Build a general error response with id, using a single 'General' error with a message
 * @param message The error message
 */
export function buildGeneralErrorWithId(message: string, paymentId: string, version: number): PaymentResponseWithId {
  return {
    responseType: 'FailedValidation',
    errors: [{ code: 'General', message: message }],
    paymentId,
    version,
  }
}
