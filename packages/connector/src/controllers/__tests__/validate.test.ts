import { validate } from '../validate'
import { getMockCommercetoolsPaymentEvent } from '../../__tests__/mocks'

describe('validate', () => {
  it('should validate the payload object is correct', () => {
    expect(validate(getMockCommercetoolsPaymentEvent())).toBeTruthy()
  })

  it('should fail if the payload object is missing obj or the type is not payment', () => {
    let payload = getMockCommercetoolsPaymentEvent()
    delete payload.resource.obj
    expect(validate(payload)).toBeFalsy()

    payload = getMockCommercetoolsPaymentEvent()
    payload.resource.typeId = 'not a payment'
    expect(validate(payload)).toBeFalsy()
  })
})
