export interface ReferenceTraceNumbersParams {
  RetrievalREFNumber?: string
  CorrelationID?: string
  AuthorizationNumber?: string
  RefInvoiceNumber?: string
  DraftLocator?: string
}

export function withReferenceTraceNumbers(options: ReferenceTraceNumbersParams) {
  return {
    ReferenceTraceNumbers: {
      ...options,
    },
  }
}
