import { validateEnvVars } from '../env.validators'
import { ValidationError } from 'yup'

describe('validateEnvVars', () => {
  it('should pass if all constraints are met', () => {
    const envVars = {
      clientId: 'dummyEnvVarWith24LengthX',
      clientSecret: 'dummyEnvVarWith32LengthXXXXXXXXX',
      projectKey: 'dummyProjectKeyWithNumbers0123',
      scopes: 'moreThan2scope',
      region: 'us-central1.gcp',
      connectorUser: 'admin',
      connectorSecret: 'abcdefabcdef',
    }

    expect(validateEnvVars(envVars)).toBeTruthy()
  })

  it('should not fail if scope is not present', () => {
    const envVars = {
      clientId: 'dummyEnvVarWith24LengthX',
      clientSecret: 'dummyEnvVarWith32LengthXXXXXXXXX',
      projectKey: 'dummyProjectKeyWithNumbers0123',
      region: 'us-central1.gcp',
      connectorUser: 'admin',
      connectorSecret: 'abcdefabcdef',
    }

    expect(validateEnvVars(envVars)).toBeTruthy()
  })

  it('should fail if a required field is missing', async () => {
    const envVars = {
      clientSecret: 'dummyEnvVarWith32LengthXXXXXXXXX',
      projectKey: 'dummyProjectKeyWithNumbers0123',
      scopes: 'moreThan2scope',
      region: 'us-central1.gcp',
      connectorUser: 'admin',
      connectorSecret: 'abcdefabcdef',
    }

    expect(() => validateEnvVars(envVars)).toThrow(ValidationError)
  })

  it('should fail if a field does not comply with min length', () => {
    const envVars = {
      clientId: 'dummyEnvVarWith24LengthX',
      clientSecret: 'dummyEnvVarWith32LengthXXXXXXXXX',
      projectKey: 'dummyProjectKeyWithNumbers0123',
      scopes: '1',
      region: 'us-central1.gcp',
      connectorUser: 'admin',
      connectorSecret: 'abcdefabcdef',
    }

    expect(() => validateEnvVars(envVars)).toThrow(ValidationError)
  })

  it('should fail if a field does not comply with max length', () => {
    const envVars = {
      clientId: 'dummyEnvVarWith24LengthXXXXXXXX',
      clientSecret: 'dummyEnvVarWith32LengthXXXXXXXXX',
      projectKey: 'dummyProjectKeyWithNumbers0123',
      scopes: 'moreThan2scope',
      region: 'us-central1.gcp',
      connectorUser: 'admin',
      connectorSecret: 'abcdefabcdef',
    }

    expect(() => validateEnvVars(envVars)).toThrow(ValidationError)
  })

  it('should fail if a projectKey has incorrect characters', () => {
    const envVars = {
      clientId: 'dummyEnvVarWith24LengthX',
      clientSecret: 'dummyEnvVarWith32LengthXXXXXXXXX',
      projectKey: 'Incorrect#$%assdas(*&!',
      scopes: 'moreThan2scope',
      region: 'us-central1.gcp',
      connectorUser: 'admin',
      connectorSecret: 'abcdefabcdef',
    }

    expect(() => validateEnvVars(envVars)).toThrow(ValidationError)
  })
})
