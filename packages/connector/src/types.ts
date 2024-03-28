import { PaymentUpdateAction } from '@commercetools/platform-sdk'

// IETF BCP 47 Language Tag
export type Locale = string
export type LocalizedString = Record<Locale, string>

export type ExtensionErrorCode = // 400 Bad Request

    | 'AnonymousIdAlreadyInUse'
    | 'DuplicateField'
    | 'DuplicateFieldWithConflictingResource'
    | 'FeatureRemoved'
    | 'InvalidInput'
    | 'InvalidJsonInput'
    | 'InvalidOperation'
    | 'InvalidField'
    | 'InternalConstraintViolated'
    | 'MaxResourceLimitExceeded'
    | 'MoneyOverflow'
    | 'ObjectNotFound'
    | 'ReferenceExists'
    | 'ReferencedResourceNotFound'
    | 'RequiredField'
    | 'ResourceSizeLimitExceeded'
    | 'SemanticError'
    | 'SyntaxError'
    | 'QueryTimedOut'
    // 404 Not Found
    | 'ResourceNotFound'
    // 409 Conflict
    | 'ConcurrentModification'
    // 413 Content Too Large
    | 'ContentTooLarge'
    // 500 Internal Server Error
    | 'General'
    // 502 Bad Gateway
    | 'BadGateway'
    // 503 Service Unavailable
    | 'OverCapacity'
    | 'PendingOperation'

export interface ExtensionError {
  code: ExtensionErrorCode
  message: string
  localizedMessage?: LocalizedString
  extensionExtraInfo?: object
}

export interface PaymentExtensionResponse {
  responseType: 'FailedValidation' | 'UpdateRequest'
  errors?: ExtensionError[]
  actions?: PaymentUpdateAction[]
}

export interface PaymentResponseWithId extends PaymentExtensionResponse {
  paymentId: string
  version: number
}
