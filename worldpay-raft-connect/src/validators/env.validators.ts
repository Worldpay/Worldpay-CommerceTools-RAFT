import { object, string } from 'yup'

const VALID_REGIONS = [
  'us-central1.gcp',
  'us-east-2.aws',
  'europe-west1.gcp',
  'eu-central-1.aws',
  'australia-southeast1.gcp',
]

export function validateEnvVars(envVars: unknown) {
  const envVarsSchema = object({
    commercetools: object({
      clientId: string().required().min(24).max(24),
      clientSecret: string().required().min(32).max(32),
      projectKey: string()
        .required()
        .min(2)
        .test('String number must conform to "/^[a-zA-Z0-9-_]+$"', (value) => /^[a-zA-Z0-9-_]+$/.test(value)),
      scopes: string().optional().min(2),
      region: string().required().oneOf(VALID_REGIONS),
    }),
    connector: object({
      user: string().required().min(5),
      secret: string().required().min(10),
    }),
  })

  return envVarsSchema.validateSync(envVars)
}
