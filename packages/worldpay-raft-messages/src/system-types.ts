import * as yup from 'yup'

const SystemHealthcheckSchema = yup.object({
  systemhealthcheck: yup
    .object({
      WorldPayMerchantID: yup.string().required(),
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      TraceData: yup.string().max(255).default(undefined).optional(),
    })
    .required(),
})

export type SystemHealthcheck = yup.InferType<typeof SystemHealthcheckSchema>

/**
 * Validate that a system healthcheck object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateSystemHealthcheck(systemHealthcheck: SystemHealthcheck) {
  return SystemHealthcheckSchema.validateSync(systemHealthcheck, { abortEarly: false })
}

const SystemHealthcheckResponseSchema = yup.object({
  systemhealthcheckresponse: yup
    .object({
      ReturnCode: yup.string().max(4).required(), // This parameter indicates the success of the message. Any non-zero value means the transactions failed.
      // Values are:
      // 0000 - Successful
      // 0004 - Edit error on input
      // 0008 - Logic error
      // 0012 - System issue

      ReasonCode: yup.string().max(4).required(), // This parameter contains a value you can use to pinpoint exactly where the error occurred.

      SystemHealthCheckData: yup
        .object({
          SystemConnectedTo: yup.string().max(8).default(undefined).optional(),
          SystemHealthStatus: yup.string().max(20).default(undefined).optional(),
        })
        .optional(),
      ErrorInformation: yup
        .object({
          FieldInError: yup.string().max(50).optional(), // Field flagged in error during transaction processing
          ErrorText: yup.string().max(20).optional(), // Portion of the field data detected as being in error
        })
        .optional(),
      TraceData: yup.string().max(255).default(undefined).optional(),
    })
    .required(),
})

export type SystemHealthcheckResponse = yup.InferType<typeof SystemHealthcheckResponseSchema>

const SystemGenerateAuthIdSchema = yup.object({
  systemgenerateauthid: yup
    .object({
      WorldPayMerchantID: yup.string().required(),
      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      LocalDateTime: yup.string().max(19).required(), // <= 19 characters, This field contains the merchant's local date and time in a YYYY-MM-DDTHH:mm:ss format. For example, 4:15 PM on October 31st of 2018 would be 2018-10-31T16:15:00. Any follow-up type messages for gift cards (completions, reversals, etc.) should contain the original local date/time for matching purposes.
      ClientID: yup.string().max(999).required(),
      TraceData: yup.string().max(255).default(undefined).optional(),
    })
    .required(),
})

export type SystemGenerateAuthId = yup.InferType<typeof SystemGenerateAuthIdSchema>

const SystemGenerateAuthIdResponseSchema = yup.object({
  systemgenerateauthid: yup
    .object({
      ReturnCode: yup.string().max(4).required(), // This parameter indicates the success of the message. Any non-zero value means the transactions failed.
      // Values are:
      // 0000 - Successful
      // 0004 - Edit error on input
      // 0008 - Logic error
      // 0012 - System issue

      ReasonCode: yup.string().max(4).required(), // This parameter contains a value you can use to pinpoint exactly where the error occurred.

      APITransactionID: yup.string().max(16).required(), // <= 16 characters, Worldpay uses this for transaction matching (reversals, completions, and so on) and tracking. If you are initiating a subsequent message that ties back to an original request, provide the APItransactionID of the original transaction. Cross-format matching is also supported in the ISO and 610 formats, matching to field Native RAFT API Transaction ID.
      ErrorInformation: yup
        .object({
          FieldInError: yup.string().max(50).optional(), // Field flagged in error during transaction processing
          ErrorText: yup.string().max(20).optional(), // Portion of the field data detected as being in error
        })
        .optional(),
      AuthID: yup.string().max(999).default(undefined).optional(),
      TraceData: yup.string().max(255).default(undefined).optional(),
    })
    .required(),
})

export type SystemGenerateAuthIdResponse = yup.InferType<typeof SystemGenerateAuthIdResponseSchema>

/**
 * Validate that a system generateauthid object adheres to the expected schema
 * @throws Error object holding the ValidationErrors in case the validation fails
 */
export function validateSystemGenerateAuthId(systemGenerateAuthId: SystemGenerateAuthId) {
  return SystemGenerateAuthIdSchema.validateSync(systemGenerateAuthId, { abortEarly: false })
}
