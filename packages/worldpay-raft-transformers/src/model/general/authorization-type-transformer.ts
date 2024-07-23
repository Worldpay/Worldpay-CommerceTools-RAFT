import { AuthorizationType } from '@gradientedge/worldpay-raft-messages'

export function withAuthorizationType(authorizationType: AuthorizationType) {
  return {
    AuthorizationType: authorizationType,
  }
}
