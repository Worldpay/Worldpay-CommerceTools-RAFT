export function validate(payload: any): boolean {
  return payload?.resource?.obj && payload?.resource?.typeId === 'payment'
}
