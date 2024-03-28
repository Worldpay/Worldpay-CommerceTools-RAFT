import { Customer, Order } from '@commercetools/platform-sdk'

export function withOnlineOrderCustomerData(
  customer: Customer,
  order: Order,
  shippingMethod: string | undefined = undefined,
) {
  return {
    OnlineOrderCustomerData: {
      OnlineOrderCustomerId: customer.id,
      OnlineOrderCustomerOrderId: order.orderNumber,
      OnlineOrderEmailAddress: order.customerEmail,
      OnlineOrderPhoneNumber: order.shippingAddress?.phone ?? order.billingAddress?.phone,
      OnlineOrderIPAddress: order.custom?.fields?.customerIPAddress,
      OnlineOrderWebSessionID: order.custom?.fields?.webSessionId,
      OnlineOrderShippingMethod: shippingMethod,
    },
  }
}
