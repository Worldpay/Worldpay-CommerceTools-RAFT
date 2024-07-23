import { AccountSelected } from '@gradientedge/worldpay-raft-messages'

export function withAccountCodesAndData(options: {
  FromAccountSelected?: AccountSelected
  ToAccountSelected?: AccountSelected
}) {
  if (options.FromAccountSelected === undefined && options.ToAccountSelected === undefined) {
    return undefined
  }
  return {
    AccountCodesAndData: {
      ...(options.FromAccountSelected && { FromAccountSelected: options.FromAccountSelected }),
      ...(options.ToAccountSelected && { ToAccountSelected: options.ToAccountSelected }),
    },
  }
}
