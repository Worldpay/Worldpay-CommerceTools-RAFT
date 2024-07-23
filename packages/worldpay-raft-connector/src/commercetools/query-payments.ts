import { WORLDPAY_RAFT_PAYMENT_INTERFACE } from '@gradientedge/worldpay-raft-messages'

export async function queryPayments(apiRoot: any) {
  return await apiRoot
    .payments()
    .get({
      queryArgs: {
        withTotal: false,
        where: `paymentMethodInfo(paymentInterface="${WORLDPAY_RAFT_PAYMENT_INTERFACE}") and transactions(state="Pending")`,
        limit: 100,
      },
    })
    .execute()
}
