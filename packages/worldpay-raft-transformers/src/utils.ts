import { BaseAddress, TypedMoney } from '@commercetools/platform-sdk'

export function toRaftPrice(amount?: TypedMoney, fractionDigits: number = 0): string {
  if (!amount) {
    return '0'
  }
  const floatAmount = amount.centAmount / Math.pow(10, amount.fractionDigits - fractionDigits)
  return floatAmount % 1 === 0 ? floatAmount.toString() + '.00' : floatAmount.toFixed(2)
}

/**
 * If the address is defined and has a street, return that.
 * Return undefined otherwise.
 */
export function streetAndNumber(address: BaseAddress | undefined) {
  if (!address?.streetName) {
    return undefined
  }
  return (address.streetName + (address.streetNumber ? address.streetNumber : ''))?.slice(0, 19)
}

/**
 * Take a string and pad it to the given length with 0's
 * @param s The string to pad
 * @param len The length to pad to
 */
export function zeroFill(s: string, len: number) {
  return fill(s, len, '0')
}

/**
 * Take a string and pad it to the given length with _'s
 * @param s The string to pad
 * @param len The length to pad to
 */
export function stringFill(s: string, len: number) {
  return fill(s, len, ' ')
}

/**
 * Take a string and pad it to the given length with the given characters
 * @param s The string to pad
 * @param len The length to pad to
 * @param c The string to pad with (usually a single character)
 */
function fill(s: string, len: number, c: string) {
  return s.padStart(len, c)
}

/**
 * Remove any accented characters from a string, replacing them with the unaccented version.
 * I.e. Crème Brulée becomes Creme Brulee
 */
export function removeAccentedCharacters(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
