import { Cart, LineItem } from '@commercetools/platform-sdk'
import { toRaftPrice, zeroFill, stringFill, removeAccentedCharacters } from '../../utils'

export enum UnitOfMeasure {
  Celsius = 'C',
  Gram = 'G',
  Kelvin = 'K',
  Liter = 'L',
  Ounce = 'O',
  Pascal = 'P',
  Quantity = 'Q',
  Unit = 'U',
  Impedance = 'Z',
}

/**
 * A unit of measure conversion function can be passed in, to convert the internal shop's UOM into
 * the WorldPay RAFT one. If omitted, the value from the custom field unitOfMeasure is used, and if that
 * does not exist or is empty, the Quantity UOM value is used as default.
 */
export type UnitOfMeasureConversion = (lineItem: LineItem) => UnitOfMeasure

/**
 * A sample unit of measure conversion function, which assumes a custom field unitOfMeasure on the line item,
 * with a value already matching the RAFT values.
 * @param lineItem the commercetools line item from which to take the unit of measure
 * @returns the RAFT unit of measure
 */
export const sampleUOMConversion = (lineItem: LineItem): UnitOfMeasure => {
  return lineItem?.custom?.fields?.unitOfMeasure ?? defaultUOMConversion(lineItem)
}

/**
 * The default Unit Of Measure conversion always yields quantity
 */
export const defaultUOMConversion = (_lineItem: LineItem): UnitOfMeasure => UnitOfMeasure.Quantity

/**
 * Convert the cart's line items into Level3Data
 */
export function withLevel3Data(cart: Cart, uomConversion?: UnitOfMeasureConversion) {
  if (!cart.lineItems) {
    return undefined
  }
  return {
    Level3Data: [
      ...cart.lineItems.slice(0, 25).map((lineItem) => {
        return {
          ItemDescription: removeAccentedCharacters(
            stringFill((lineItem.name['en-US'] ?? lineItem.name.en)?.trimEnd()?.slice(0, 35), 35),
          ),
          UnitOfMeasure: uomConversion ? uomConversion(lineItem) : sampleUOMConversion(lineItem),
          UnitPrice: zeroFill(toRaftPrice(lineItem.price.value, 4), 12),
          UnitPriceDecimal: '4',
          ItemQuantity: zeroFill(lineItem.quantity.toString(), 12),
          ItemQuantityDecimal: '0',
          ProductCode: stringFill(lineItem.variant.key ?? 'unknown', 15),
          ItemDiscountAmount: zeroFill(toRaftPrice(lineItem.price.discounted?.value, 4) ?? '0', 12),
          ItemDiscountRate: zeroFill('0', 5),
          ItemDiscRateDecimal: '4',
        }
      }),
    ],
  }
}
