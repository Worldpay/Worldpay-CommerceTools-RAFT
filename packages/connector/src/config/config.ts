import * as yup from 'yup'

const StringOrUndefinedWithDefaultSchema = (def: string) =>
  yup.lazy((value) => {
    switch (typeof value) {
      case 'undefined':
        return yup.string().default(def)
      case 'string':
        return yup.string()
      default:
        throw new yup.ValidationError('Value must be a string or `undefined`')
    }
  })

// The schema that defines the properties required on the WorldPay RAFT
const WorldpayConfigSchema = yup
  .object({
    URL: StringOrUndefinedWithDefaultSchema('https://ws-cert.vantiv.com'),
    path: StringOrUndefinedWithDefaultSchema('/merchant/servicing/apitransactions/NativeRaftApi/v1'),
    license: yup.string().required(),
    timeoutMs: yup.number().min(0).max(15000).integer().default(5000),
    maxRetries: yup.number().min(0).max(100).integer().default(3),
    reverseMaxRetries: yup.number().min(1).max(100).integer().default(5),
  })
  .required()

// The schema that defines the properties required on the WorldPay timeout handler
const TimeoutHandlerConfigSchema = yup.object({
  worldpayRaft: WorldpayConfigSchema.required(),
  commercetools: yup
    .object({
      clientId: yup.string().required(),
      clientSecret: yup.string().required(),
      projectKey: yup.string().required(),
      region: yup.string().required(),
      timeoutMs: yup.number().positive().required(),
      scopes: yup.string().optional(),
    })
    .required(),
})

// The schema that defines the properties required on the WorldPay RAFT connector
const ConnectorConfigSchema = yup.object({
  worldpayRaft: WorldpayConfigSchema.required(),
})

// The Config type, derived from the schema
export type Config = yup.InferType<typeof TimeoutHandlerConfigSchema>

let _config: Config = undefined

/**
 * Initialize and validate the configuration for the WorldPay RAFT connector
 * @param config The Config object holding the properties for the configuration
 * @throws Error if the configuration is invalid
 */
export function initializeConfig(config: Config, requiresCommercetoolsAccess: boolean) {
  _config = config
  if (requiresCommercetoolsAccess) {
    TimeoutHandlerConfigSchema.validateSync(config)
  } else {
    ConnectorConfigSchema.validateSync(config)
  }
}

/**
 * Retrieve the configuration for the WorldPay RAFT connector
 * @returns The configuration that was received via the initialize function
 * @throws Error if the configuration has not been initialized
 */
export function getConfig(): Config {
  if (_config === undefined) {
    throw new Error(
      'Please initialize the connector by invoking the initialize(config) function with the appropriate configuration',
    )
  }
  return _config
}
