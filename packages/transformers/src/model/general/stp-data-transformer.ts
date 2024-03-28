export function withSTPData(STPBankId: string, STPTerminalId: string, STPReferenceNUM?: string) {
  return {
    STPData: {
      STPBankId,
      STPTerminalId,
      ...(STPReferenceNUM && { STPReferenceNUM }),
    },
  }
}
