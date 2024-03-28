import { Cart } from '@commercetools/platform-sdk'
import { streetAndNumber } from '../../utils'

/**
 * Transforms the cart in a AddressVerificationData property
 */
export function withAddressVerificationData(cart: Cart) {
  if (cart.billingAddress === undefined && cart.shippingAddress === undefined) {
    return undefined
  }
  return {
    AddressVerificationData: {
      AVSZipCode: cart.billingAddress?.postalCode ?? cart.shippingAddress?.postalCode,
      AVSAddress: streetAndNumber(cart.billingAddress) ?? streetAndNumber(cart.shippingAddress),
    },
  }
}
