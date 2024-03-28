import {
  Customer,
  Cart,
  Order,
  Payment,
  Transaction,
  PaymentReference,
  CentPrecisionMoney,
} from '@commercetools/platform-sdk'
import { WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD } from '@gradientedge/worldpay-raft-messages'

export const getMockCommercetoolsCart = () => {
  return {
    type: 'Cart',
    id: '4ea77273-3c9d-4541-8c44-a330eb6b55be',
    version: 28,
    versionModifiedAt: '2023-10-10T13:47:37.997Z',
    lastMessageSequenceNumber: 1,
    createdAt: '2023-10-10T13:24:55.111Z',
    lastModifiedAt: '2023-10-10T13:47:37.312Z',
    lastModifiedBy: {
      customer: {
        typeId: 'customer',
        id: '74a2a666-87e7-40f9-a49d-1e22b505773c',
      },
    },
    createdBy: {
      customer: {
        typeId: 'customer',
        id: '74a2a666-87e7-40f9-a49d-1e22b505773c',
      },
    },
    customerId: '74a2a666-87e7-40f9-a49d-1e22b505773c',
    customerEmail: 'wilco+2@gradientedge.com',
    paymentInfo: {
      payments: [],
    },
    lineItems: [
      {
        id: 'f6ae606b-9dd0-4158-b170-776e42a3b51a',
        productId: 'ff76db9d-57f8-44f0-aa8b-87c1134a7300',
        productKey: '103050850',
        name: {
          en: 'Icebreaker Adult Sierra Gloves Snöstorm',
        },
        productType: {
          typeId: 'product-type',
          id: '509c601d-1848-44a1-8f34-9b0807efe362',
        },
        productSlug: {
          en: '103050850',
        },
        variant: {
          id: 4,
          sku: '103050854',
          key: '103050854',
          prices: [],
          images: [
            {
              url: 'https://cdn.media.amplience.net/i/gradientedge/103050850-img-01-c1011',
              dimensions: {
                w: 0,
                h: 0,
              },
            },
          ],
          attributes: [
            {
              name: 'includedInStores',
              value: ['p1-uk', 'p1-us', 'p1-ca', 'p2-uk', 'p2-us', 'p2-ca', 'p1-au', 'p2-au'],
            },
            {
              name: 'variantAttribute1',
              value: 'color',
            },
            {
              name: 'variantAttribute2',
              value: 'sizeStandard',
            },
            {
              name: 'variantAttribute3',
              value: 'n/a',
            },
            {
              name: 'isDigital',
              value: false,
            },
            {
              name: 'provenanceAwareSlug',
              value: {
                en: '{"p1":"icebreaker-adult-sierra-gloves","p2":"icebreaker-adult-sierra-gloves"}',
              },
            },
            {
              name: 'outlet',
              value: false,
            },
            {
              name: 'packIndicator',
              value: false,
            },
            {
              name: 'provenanceAwareName',
              value: {
                en: '{"p1":"Icebreaker Adult Sierra Gloves","p2":"Icebreaker Adult Sierra Gloves"}',
              },
            },
            {
              name: 'subclassName',
              value: 'Gloves',
            },
            {
              name: 'hazardousCode',
              value: 'NONE',
            },
            {
              name: 'handlingSensitivityDescription',
              value: 'None',
            },
            {
              name: 'perishable',
              value: false,
            },
            {
              name: 'sellerBrand',
              value: 'ICEBREAKER',
            },
            {
              name: 'brandKey',
              value: 'icebreaker',
            },
            {
              name: 'isBulky',
              value: false,
            },
            {
              name: 'processingType',
              value: 'Normal Warehouse',
            },
            {
              name: 'ageRestricted',
              value: false,
            },
            {
              name: 'ageRange',
              value: {
                en: 'Adult',
              },
            },
            {
              name: 'primaryDiscipline',
              value: {
                en: 'Outdoors',
              },
            },
            {
              name: 'gender',
              value: {
                en: 'All',
              },
            },
            {
              name: 'loyaltyRestricted',
              value: false,
            },
            {
              name: 'isSearchable',
              value: true,
            },
            {
              name: 'isBrowsable',
              value: true,
            },
            {
              name: 'includedInSitemap',
              value: true,
            },
            {
              name: 'bestSeller',
              value: false,
            },
            {
              name: 'featureDescription',
              value: {
                en: '{"p1":"With a merino blend fabric, the Adult Sierra Gloves are designed for complete temperature and moisture regulation, trapping heat in colder climates and when warm, efficiently wicking away unwanted moisture for a fresh feel,\\r\\n \\r\\nTouchscreen tips on the thumb and index finger keep you interactive and with LYCRA® incorporated, they stretch perfectly to the shape of your hands.","p2":"With a merino blend fabric, the Adult Sierra Gloves are designed for complete temperature and moisture regulation, trapping heat in colder climates and when warm, efficiently wicking away unwanted moisture for a fresh feel,\\r\\n \\r\\nTouchscreen tips on the thumb and index finger keep you interactive and with LYCRA® incorporated, they stretch perfectly to the shape of your hands."}',
              },
            },
            {
              name: 'otherInformation',
              value:
                '{"p1":{"de":["88% Merinowolle 9% Nylon 3% Lycra"],"en":["88% Merino Wool 9% Nylon 3% Lycra"],"en-US":["88% Merino Wool 9% Nylon 3% Lycra"],"es":["88% Lana Merino 9% Nailon 3% Lycra"],"fr":["88% Laine Mérinos 9% Nylon 3% Lycra"],"ja":["88% メリノウール 9% ナイロン 3% ライクラ"]}}',
            },
            {
              name: 'topFeatures',
              value:
                '{"p1":{"de":["Corespun Gewebe für zusätzliche Strapazierfähigkeit","LYCRA-Anteil","Touchscreen-Technologie in Daumen- und Zeigefingerspitzen","Palme aus Wildlederimitat für verbesserten Halt","Clips zusammen speichern"],"en":["Corespun fabric for enhanced durability","Lycra content","Touchscreen technology in thumb and index fingertips","Faux suede palm for enhanced grip","Clips store together","Icebreaker only sources ethical merino wool directly from their chain of suppliers"],"en-US":["Corespun fabric for enhanced durability","Lycra content","Touchscreen technology in thumb and index fingertips","Faux suede palm for enhanced grip","Clips store together","Icebreaker only sources ethical merino wool directly from their chain of suppliers"],"es":["Tejido core-spun para una durabilidad mejorada","Contenido de LYCRA","Tecnología de pantalla táctil en las yemas de los dedos pulgar e índice","Palma de gamuza sintética para un mejor agarre","Los clips se almacenan juntos","Icebreaker solo obtiene lana merino ético directamente de su cadena de proveedores"],"ja":["コアスパン生地により、耐久性を向上","ライクラコンテンツ","親指と人差し指のタッチスクリーンテクノロジー","手のひらのパンチング加工済みスエードは透湿性があり、グリップ力も向上","クリップは一緒に保存されます"]},"p2":{"de":["Corespun Gewebe für zusätzliche Strapazierfähigkeit|LYCRA-Anteil|Touchscreen-Technologie in Daumen- "," und Zeigefingerspitzen|Palme aus Wildlederimitat für verbesserten Halt|Clips zusammen speichern"],"en":["Corespun fabric for enhanced durability","Lycra content","Touchscreen technology in thumb and index fingertips","Faux suede palm for enhanced grip","Clips store together","Icebreaker only sources ethical merino wool directly from their chain of suppliers"],"en-US":["Corespun fabric for enhanced durability","Lycra content","Touchscreen technology in thumb and index fingertips","Faux suede palm for enhanced grip","Clips store together","Icebreaker only sources ethical merino wool directly from their chain of suppliers"],"es":["Tejido core-spun para una durabilidad mejorada|Contenido de LYCRA|Tecnología de pantalla táctil en "," las yemas de los dedos pulgar e índice|Palma de gamuza sintética para un mejor agarre|Los clips se "," almacenan juntos|Icebreaker solo obtiene lana merino ético directamente de su cadena de proveedores"],"ja":["コアスパン生地により、耐久性を向上|ライクラコンテンツ|親指と人差し指のタッチスクリーンテクノロジー|手のひらのパンチング加工済みスエードは透湿性があり、グリップ力も向上|クリップは一緒に保存されます"]}}',
            },
            {
              name: 'discipline',
              value: [
                {
                  en: 'Outdoor',
                },
              ],
            },
            {
              name: 'sport',
              value: {
                en: 'Outdoor',
              },
            },
            {
              name: 'vpn',
              value: '104829001L',
            },
            {
              name: 'supplier',
              value: '41695552',
            },
            {
              name: 'preOrderable',
              value: false,
            },
            {
              name: 'productClassification',
              value: 'Core',
            },
            {
              name: 'netWeight',
              value: 0.2,
            },
            {
              name: 'upc',
              value: '9420062900888',
            },
            {
              name: 'taxCode',
              value: 'PC040122',
            },
            {
              name: 'commodityCode',
              value: '6216000000',
            },
            {
              name: 'returnable',
              value: true,
            },
            {
              name: 'fulfilmentLock',
              value: 'None',
            },
            {
              name: 'weight',
              value: 0.2,
            },
            {
              name: 'width',
              value: 0.1,
            },
            {
              name: 'height',
              value: 0.1,
            },
            {
              name: 'length',
              value: 0.1,
            },
            {
              name: 'manufacturerCountry',
              value: 'CN',
            },
            {
              name: 'color',
              value: {
                en: 'Black',
              },
            },
            {
              name: 'colorGroups',
              value: ['black'],
            },
            {
              name: 'colorHexCodes',
              value: ['#1c1a1c'],
            },
            {
              name: 'sizeStandard',
              value: {
                en: 'L',
              },
            },
            {
              name: 'status',
              value: 'active',
            },
            {
              name: 'sizeGuideKey',
              value: 'sg-2478-icebreaker-1',
            },
            {
              name: 'sortOrderHint',
              value: 4,
            },
            {
              name: 'priceLastUpdatedAt',
              value: '2023-06-03T00:00:00.000Z',
            },
            {
              name: 'totalReviewCount',
              value: '{"p1":5}',
            },
            {
              name: 'averageOverallRating',
              value: '{"p1":4.4}',
            },
            {
              name: 'rangeClassification',
              value: 'Core',
            },
            {
              name: 'isEnabled',
              value: true,
            },
          ],
          assets: [],
          availability: {
            isOnStock: true,
            restockableInDays: 1,
            availableQuantity: 9999,
            version: 1,
            id: 'd445c086-c020-4fc4-b63d-8c93d67ea971',
            channels: {
              'b78796de-ed13-47a8-8b6f-2802d8f09736': {
                isOnStock: true,
                restockableInDays: 1,
                availableQuantity: 5,
                version: 1,
                id: 'a3982d1d-11fb-43e1-98e1-a85d3f3cc1b6',
              },
            },
          },
        },
        price: {
          id: 'f160ad50-9982-4d0d-a877-e8e8f65fa89f',
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 71900,
            fractionDigits: 2,
          },
          channel: {
            typeId: 'channel',
            id: 'cae1a978-8f51-4520-80cc-f35db0d8580c',
          },
          validFrom: '2023-08-02T09:05:13.220Z',
          custom: {
            type: {
              typeId: 'type',
              id: 'b7bd7d08-9bcc-424e-a993-f63a8d7c3b57',
            },
            fields: {
              wasPrice: {
                type: 'centPrecision',
                currencyCode: 'USD',
                centAmount: 79090,
                fractionDigits: 2,
              },
            },
          },
        },
        quantity: 1,
        discountedPricePerQuantity: [],
        supplyChannel: {
          typeId: 'channel',
          id: 'b78796de-ed13-47a8-8b6f-2802d8f09736',
        },
        distributionChannel: {
          typeId: 'channel',
          id: 'cae1a978-8f51-4520-80cc-f35db0d8580c',
        },
        taxRate: {
          name: '20% VAT',
          amount: 0.2,
          includedInPrice: true,
          country: 'GB',
          id: '1-sNeSVV',
          subRates: [],
        },
        perMethodTaxRate: [],
        addedAt: '2023-10-10T13:24:55.092Z',
        lastModifiedAt: '2023-10-10T13:25:09.649Z',
        state: [
          {
            quantity: 1,
            state: {
              typeId: 'state',
              id: '8e8ad359-58d1-4892-950d-99783cf42bc4',
            },
          },
        ],
        priceMode: 'Platform',
        lineItemMode: 'Standard',
        totalPrice: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 71900,
          fractionDigits: 2,
        },
        taxedPrice: {
          totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 59917,
            fractionDigits: 2,
          },
          totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 71900,
            fractionDigits: 2,
          },
          totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 11983,
            fractionDigits: 2,
          },
        },
        taxedPricePortions: [],
        custom: {
          type: {
            typeId: 'type',
            id: '008395c5-c324-4d39-8eb3-51b20483ab29',
          },
          fields: {
            categoryHierarchy: '["Gloves","Accessories"]',
          },
        },
      },
    ],
    cartState: 'Ordered',
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 72499,
      fractionDigits: 2,
    },
    taxedPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 60416,
        fractionDigits: 2,
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 72499,
        fractionDigits: 2,
      },
      taxPortions: [
        {
          rate: 0.2,
          amount: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 12083,
            fractionDigits: 2,
          },
          name: '20% VAT',
        },
      ],
      totalTax: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 12083,
        fractionDigits: 2,
      },
    },
    taxedShippingPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 499,
        fractionDigits: 2,
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 599,
        fractionDigits: 2,
      },
      taxPortions: [
        {
          rate: 0.2,
          amount: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 100,
            fractionDigits: 2,
          },
          name: '20% VAT',
        },
      ],
      totalTax: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      },
    },
    shippingMode: 'Single',
    shippingInfo: {
      shippingMethodName: 'in-store',
      price: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 599,
        fractionDigits: 2,
      },
      shippingRate: {
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 599,
          fractionDigits: 2,
        },
        tiers: [],
      },
      taxRate: {
        name: '20% VAT',
        amount: 0.2,
        includedInPrice: true,
        country: 'GB',
        id: '1-sNeSVV',
        subRates: [],
      },
      taxCategory: {
        typeId: 'tax-category',
        id: 'f9d35498-30ab-47a7-a6b7-418112a33e83',
      },
      deliveries: [],
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 499,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 599,
          fractionDigits: 2,
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 100,
          fractionDigits: 2,
        },
      },
      shippingMethodState: 'MatchesCart',
    },
    shippingAddress: {
      firstName: 'Test',
      lastName: 'User',
      streetName: 'Delivery to store',
      additionalStreetInfo: '123 Fake street',
      postalCode: 'SW1 1AA',
      city: 'DUMMY_VALUE',
      region: '',
      state: 'DUMMY_VALUE',
      country: 'GB',
      phone: '1234567890',
      email: '',
      additionalAddressInfo: 'London',
    },
    shipping: [],
    customLineItems: [],
    discountCodes: [],
    directDiscounts: [],
    custom: {
      type: {
        typeId: 'type',
        id: '97988797-cd38-499f-a0a0-b4d9d1c323aa',
      },
      fields: {
        storeKey: 'p1-uk',
        provenance: 'p1',
        locale: 'en',
        siteKey: 'p1-uk',
      },
    },
    inventoryMode: 'None',
    taxMode: 'Platform',
    taxRoundingMode: 'HalfEven',
    taxCalculationMode: 'LineItemLevel',
    deleteDaysAfterLastModification: 90,
    refusedGifts: [],
    origin: 'Customer',
    itemShippingAddresses: [],
    store: {
      typeId: 'store',
      key: 'p1-uk',
    },
    totalLineItemQuantity: 1,
  } as unknown as Cart
}

export const getMockCommercetoolsPayment = (): Payment => {
  return {
    id: 'mock-payment-id',
    version: 8,
    createdAt: '2023-12-13T11:23:01.184Z',
    lastModifiedAt: '2023-12-13T11:23:01.184Z',
    lastModifiedBy: {
      customer: {
        typeId: 'customer',
        id: 'mock-customer-id',
      },
    },
    createdBy: {
      customer: {
        typeId: 'customer',
        id: 'mock-customer-id',
      },
    },
    customer: {
      typeId: 'customer',
      id: 'mock-customer-id',
    },
    interfaceId: 'AD3nsATmTg75u0qI',
    amountPlanned: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 44100,
      fractionDigits: 2,
    },
    paymentMethodInfo: {
      paymentInterface: 'worldpay-raft',
      name: { en: 'Card' },
      method: 'Visa',
    },
    custom: {
      type: {
        typeId: 'type',
        id: 'e3246665-277c-4aa1-ac5d-34c7ee6bec9c',
      },
      fields: {
        tokenizedPAN: '4111114335161111',
        expirationDate: '2611',
      },
    },
    paymentStatus: {
      state: {
        typeId: 'state',
        id: 'b2a53d12-066a-4a9a-8d02-bb2214485b29',
      },
    },
    transactions: [
      {
        id: '47fd3e49-3bc1-4cae-9e00-03ee51bff588',
        timestamp: '2023-12-13T11:23:01.163Z',
        type: 'Authorization',
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 44100,
          fractionDigits: 2,
        },
        interactionId: '200100016',
        state: 'Success',
      },
    ],
    interfaceInteractions: [
      {
        type: {
          typeId: 'type',
          id: '6e538dc1-98b7-490e-ad37-e8cf90fe867d',
        },
        fields: {
          createdAt: '2023-12-13T11:23:01.163Z',
          apiTransactionId: 'AD3nsATmTg75u0qI',
          request:
            '{"creditauth":{"MiscAmountsBalances":{"TransactionAmount":"441"},"WorldPayMerchantID":"000038439802","APITransactionID":"AD3nsATmTg75u0qI","STPData":{"STPBankId":"1340","STPTerminalId":"001"},"E-commerceData":{"E-commerceIndicator":"01"},"MerchantSpecificData":{"AcquirerCurrencyCode":"998"},"LocalDateTime":"2023-12-13T11:22:59","EncryptionTokenData":{"LowValueToken":"6983049094628557264"},"CardVerificationData":{"Cvv2Cvc2CIDIndicator":"1"},"ProcFlagsIndicators":{"CardholderInitiatedTransaction":"Y"}}}',
          response:
            '{"creditauthresponse":{"ReturnCode":"0000","ReasonCode":"0000","CardInfo":{"CardProductCode":"A C"},"EncryptionTokenData":{"TokenizedPAN":"4111114335161111"},"ProcFlagsIndicators":{"CVV2FromReg-ID":"Y"},"VisaSpecificData":{"VisaSpendQualifier":"Q","VisaResponseCode":"00","VisaValidationCode":"1OX4","VisaCardLevelResults":"A ","VisaTransactionId":"233470112259266","VisaAuthCharId":"N"},"STPData":{"STPReferenceNUM":"200100016"},"ReferenceTraceNumbers":{"RetrievalREFNumber":"334711230061","DraftLocator":"00200100016","NetworkRefNumber":"334711230061","SystemTraceNumber":"278119","AuthorizationNumber":"670555"},"CustomerInformation":{"IssuerCountryCode":"752"},"SettlementData":{"SettlementDate":"20231213","SettlementNetwork":"OMPS","RegulationIndicator":"0"},"WorldPayRoutingData":{"NetworkId":"BASE"},"APITransactionID":"AD3nsATmTg75u0qI","ResponseCode":"000","AuthorizationSource":"5"}}',
        },
      },
    ],
  }
}

let giftCardId = 0
export const getMockGiftCardPayment = (amount: CentPrecisionMoney, pan: string): PaymentReference => {
  giftCardId += 1
  const paymentId = `mock-gift-card-payment-id-${giftCardId}`
  return {
    typeId: 'payment',
    id: paymentId,
    obj: {
      id: paymentId,
      version: 8,
      createdAt: '2023-12-13T11:23:01.184Z',
      lastModifiedAt: '2023-12-13T11:23:01.184Z',
      lastModifiedBy: {
        customer: {
          typeId: 'customer',
          id: 'mock-customer-id',
        },
      },
      createdBy: {
        customer: {
          typeId: 'customer',
          id: 'mock-customer-id',
        },
      },
      customer: {
        typeId: 'customer',
        id: 'mock-customer-id',
      },
      interfaceId: 'AD3nsATmTg75u0qI',
      amountPlanned: amount,
      paymentMethodInfo: {
        paymentInterface: 'worldpay-raft',
        name: { en: WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD },
        method: WORLDPAY_RAFT_PAYMENT_METHOD_GIFT_CARD,
      },
      custom: {
        type: {
          typeId: 'type',
          id: 'e3246665-277c-4aa1-ac5d-34c7ee6bec9c',
        },
        fields: {
          tokenizedPAN: pan,
          expirationDate: '4912',
          gcSecurityCode: '1234',
        },
      },
      paymentStatus: {
        state: {
          typeId: 'state',
          id: 'b2a53d12-066a-4a9a-8d02-bb2214485b29',
        },
      },
      transactions: [],
      interfaceInteractions: [],
    },
  }
}

export const getMockTransactionCharged = (): Transaction => ({
  id: '47fd3e49-3bc1-4cae-9e00-03ee51bff599',
  timestamp: '2023-12-13T11:23:01.163Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 44100,
    fractionDigits: 2,
  },
  interactionId: '200100027',
  state: 'Success',
})

export const getMockCommercetoolsOrder = () => {
  return {
    type: 'Order',
    id: 'fb62d67e-26bb-4dc2-af67-a2c48eaf5375',
    version: 1,
    versionModifiedAt: '2023-12-12T12:02:26.781Z',
    lastMessageSequenceNumber: 1,
    createdAt: '2023-12-12T12:02:25.971Z',
    lastModifiedAt: '2023-12-12T12:02:25.971Z',
    lastModifiedBy: {
      customer: {
        typeId: 'customer',
        id: 'd030ed84-3246-49d4-aab1-114f5ec303f3',
      },
    },
    createdBy: {
      customer: {
        typeId: 'customer',
        id: 'd030ed84-3246-49d4-aab1-114f5ec303f3',
      },
    },
    orderNumber: 'MP123000000256D',
    customerId: 'd030ed84-3246-49d4-aab1-114f5ec303f3',
    customerEmail: 'wilco+2@gradientedge.com',
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 79700,
      fractionDigits: 2,
    },
    taxedPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 72455,
        fractionDigits: 2,
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 79700,
        fractionDigits: 2,
      },
      taxPortions: [
        {
          rate: 0.1,
          amount: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 7245,
            fractionDigits: 2,
          },
          name: '10% Sales Tax',
        },
      ],
      totalTax: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 7245,
        fractionDigits: 2,
      },
    },
    orderState: 'Open',
    syncInfo: [],
    returnInfo: [],
    taxMode: 'Platform',
    inventoryMode: 'None',
    taxRoundingMode: 'HalfEven',
    taxCalculationMode: 'LineItemLevel',
    origin: 'Customer',
    shippingMode: 'Single',
    shippingInfo: {
      shippingMethodName: 'STANDARD',
      price: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 0,
        fractionDigits: 2,
      },
      shippingRate: {
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 0,
          fractionDigits: 2,
        },
        tiers: [],
      },
      taxRate: {
        name: '10% Sales Tax',
        amount: 0.1,
        includedInPrice: true,
        country: 'US',
        id: 'RR0XUe4_',
        subRates: [],
      },
      taxCategory: {
        typeId: 'tax-category',
        id: '9aebf918-1029-4908-b35a-5f0a27176fb5',
      },
      deliveries: [],
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 0,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 0,
          fractionDigits: 2,
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 0,
          fractionDigits: 2,
        },
      },
      shippingMethodState: 'MatchesCart',
    },
    shippingAddress: {
      id: 'HcvxAcEX',
      firstName: 'Wilco',
      lastName: 'Boumans',
      streetName: '9020 Aviation Boulevard',
      additionalStreetInfo: '',
      postalCode: '90301',
      city: 'Inglewood',
      region: '',
      state: 'CA',
      country: 'US',
      phone: '+1 23947239487298',
      email: 'wilco+2@gradientedge.com',
      additionalAddressInfo: '',
      key: '1702309847157',
    },
    shipping: [],
    lineItems: [
      {
        id: 'c1fbe461-a2fa-4d6a-98bd-4e548cd0994a',
        productId: 'bab199f5-78d6-456c-aab1-423c906a46cc',
        productKey: '106471339',
        name: {
          en: "Salomon Women's Cross Over Chukka Gore-Tex Shoes",
          'en-US': "Salomon Women's Cross Over Chukka Gore-Tex Shoes",
        },
        productType: {
          typeId: 'product-type',
          id: '1bf981d0-3c93-494c-9b50-32903d047be0',
          version: 1,
        },
        productSlug: {
          en: '106471339',
        },
        variant: {
          id: 7,
          sku: '106471599',
          key: '106471599',
          prices: [],
          attributes: [
            {
              name: 'variantAttribute1',
              value: 'color',
            },
            {
              name: 'variantAttribute2',
              value: 'adultUKShoeSizes',
            },
            {
              name: 'variantAttribute3',
              value: 'n/a',
            },
            {
              name: 'sortOrderHint',
              value: 7,
            },
            {
              name: 'subclassName',
              value: 'Walking Shoes',
            },
            {
              name: 'hazardousCode',
              value: 'NONE',
            },
            {
              name: 'handlingSensitivityDescription',
              value: 'None',
            },
            {
              name: 'vpn',
              value: 'L41283300UK 7',
            },
            {
              name: 'perishable',
              value: false,
            },
            {
              name: 'sellerBrand',
              value: 'SALOMON',
            },
            {
              name: 'brandKey',
              value: 'salomon',
            },
            {
              name: 'provenanceAwareName',
              value: {
                en: '{"p1":"Salomon Women\'s Cross Over Chukka Gore-Tex Shoes","p2":"Salomon Women\'s Cross Over Chukka Gore-Tex Shoes"}',
                'en-US':
                  '{"p1":"Salomon Women\'s Cross Over Chukka Gore-Tex Shoes","p2":"Salomon Women\'s Cross Over Chukka Gore-Tex Shoes"}',
              },
            },
            {
              name: 'provenanceAwareSlug',
              value: {
                en: '{"p1":"salomon-womens-cross-over-chukka-gore-tex-shoes","p2":"salomon-womens-cross-over-chukka-gore-tex-shoes"}',
                'en-US':
                  '{"p1":"salomon-womens-cross-over-chukka-gore-tex-shoes","p2":"salomon-womens-cross-over-chukka-gore-tex-shoes"}',
              },
            },
            {
              name: 'supplier',
              value: '470',
            },
            {
              name: 'packIndicator',
              value: false,
            },
            {
              name: 'isBulky',
              value: false,
            },
            {
              name: 'preOrderable',
              value: false,
            },
            {
              name: 'productClassification',
              value: 'Terminal',
            },
            {
              name: 'processingType',
              value: 'Normal Warehouse',
            },
            {
              name: 'ageRestricted',
              value: false,
            },
            {
              name: 'ageRange',
              value: {
                en: 'Adult',
              },
            },
            {
              name: 'primaryDiscipline',
              value: {
                en: 'Outdoors',
              },
            },
            {
              name: 'gender',
              value: {
                en: 'Female',
              },
            },
            {
              name: 'includedInStores',
              value: ['p1-uk', 'p1-us'],
            },
            {
              name: 'loyaltyRestricted',
              value: false,
            },
            {
              name: 'isSearchable',
              value: true,
            },
            {
              name: 'isBrowsable',
              value: true,
            },
            {
              name: 'includedInSitemap',
              value: true,
            },
            {
              name: 'outlet',
              value: false,
            },
            {
              name: 'bestSeller',
              value: false,
            },
            {
              name: 'featureDescription',
              value: {
                en: '{"p1":"Inspired by the iconic Speedcross trail-running shoe, the Salomon Women\'s Cross Over Chukka Gore-Tex Shoes have been designed especially for hiking and combine premium waterproof protection with an aggresstive, durable grip to keep you fast and agile on even the muddiest terrain. A Gore-Tex membrane and PFC-free water repellent finish ensure every ounce of water is kept out, all the while feet are kept light with a seamless construction, and the anti-debris mesh ensures no dirt creeps in. The reinforced toecap and mudguard, alongside the slightly higher cut also work hard to protect your feet.\\r\\n \\r\\nAdditionally, comfort is optimised by the EnergyCell midsole and OrthoLite® diecut sockliner to lend cushioning and support all day long. Plus, a Contagrip® TA outsole that uses deep, sharp lugs offers maximum grip on loose, soft, rugged, and uneven surfaces.","p2":"Inspired by the iconic Speedcross trail-running shoe, the Salomon Women\'s Cross Over Chukka Gore-Tex Shoes have been designed especially for hiking and combine premium waterproof protection with an aggresstive, durable grip to keep you fast and agile on even the muddiest terrain. A Gore-Tex membrane and PFC-free water repellent finish ensure every ounce of water is kept out, all the while feet are kept light with a seamless construction, and the anti-debris mesh ensures no dirt creeps in. The reinforced toecap and mudguard, alongside the slightly higher cut also work hard to protect your feet.\\r\\n \\r\\nAdditionally, comfort is optimised by the EnergyCell midsole and OrthoLite® diecut sockliner to lend cushioning and support all day long. Plus, a Contagrip® TA outsole that uses deep, sharp lugs offers maximum grip on loose, soft, rugged, and uneven surfaces."}',
                'en-US':
                  '{"p1":"Inspired by the iconic Speedcross trail-running shoe, the Salomon Women\'s Cross Over Chukka Gore-Tex Shoes have been designed especially for hiking and combine premium waterproof protection with an aggresstive, durable grip to keep you fast and agile on even the muddiest terrain. A Gore-Tex membrane and PFC-free water repellent finish ensure every ounce of water is kept out, all the while feet are kept light with a seamless construction, and the anti-debris mesh ensures no dirt creeps in. The reinforced toecap and mudguard, alongside the slightly higher cut also work hard to protect your feet.\\r\\n \\r\\nAdditionally, comfort is optimized by the EnergyCell midsole and OrthoLite® diecut sockliner to lend cushioning and support all day long. Plus, a Contagrip® TA outsole that uses deep, sharp lugs offers maximum grip on loose, soft, rugged, and uneven surfaces.","p2":"Inspired by the iconic Speedcross trail-running shoe, the Salomon Women\'s Cross Over Chukka Gore-Tex Shoes have been designed especially for hiking and combine premium waterproof protection with an aggresstive, durable grip to keep you fast and agile on even the muddiest terrain. A Gore-Tex membrane and PFC-free water repellent finish ensure every ounce of water is kept out, all the while feet are kept light with a seamless construction, and the anti-debris mesh ensures no dirt creeps in. The reinforced toecap and mudguard, alongside the slightly higher cut also work hard to protect your feet.\\r\\n \\r\\nAdditionally, comfort is optimized by the EnergyCell midsole and OrthoLite® diecut sockliner to lend cushioning and support all day long. Plus, a Contagrip® TA outsole that uses deep, sharp lugs offers maximum grip on loose, soft, rugged, and uneven surfaces."}',
              },
            },
            {
              name: 'weight',
              value: 0.26,
            },
            {
              name: 'netWeight',
              value: 0.26,
            },
            {
              name: 'width',
              value: 0.2,
            },
            {
              name: 'length',
              value: 0.25,
            },
            {
              name: 'height',
              value: 0.2,
            },
            {
              name: 'color',
              value: {
                en: 'Black/Magnet/Black',
              },
            },
            {
              name: 'colorHexCodes',
              value: ['#343434'],
            },
            {
              name: 'colorGroups',
              value: ['black', 'grey'],
            },
            {
              name: 'upc',
              value: '0193128551025',
            },
            {
              name: 'taxCode',
              value: 'PC040144',
            },
            {
              name: 'commodityCode',
              value: '6404199000',
            },
            {
              name: 'returnable',
              value: true,
            },
            {
              name: 'rangeClassification',
              value: 'Terminal',
            },
            {
              name: 'sizeGuideKey',
              value: 'sg-707-salomon-womens-1',
            },
            {
              name: 'topFeatures',
              value:
                '{"p1":{"de":["Wasserdichte, atmungsaktive Gore-Tex-Membran","Anti-Schmutz-Netzgewebe mit wasserabweisender PFC-freier Beschichtung","Nahtlose Konstruktion mit geschweißtem Obermaterial","Schützende Zehenschutzkappe und Schmutzschutz; Reguläre Schnürsenkel mit fixierter Zunge","EnergyCell Zwischensohle","OrthoLite® gestanztes Fußbett","Schaft-Gestell","Contagrip® TA-Laufsohle mit tiefen, scharfen Stollen","Hergestellt aus nachhaltigen PFC-freien Materialien; Sprengung: 10 mm; Gewicht: 330 g","Aufgrund der schmaleren Gore-Tex Membran Konstruktion, könnte die Passform dieser Schuhe etwas "," enger ausfallen als üblich. Wiggle empfiehlt daher eine Nummer größer für ausreichend Platz zu "," wählen."],"en":["Breathable, waterproof Gore-Tex membrane","Anti-debris mesh with water repellent PFC-free finish","Seamless construction with welded upper","Protective toecap and mudguard; Regular flat laces with gusseted tongue","EnergyCell midsole","OrthoLite® diecut sockliner","Shank chassis","Contagrip® TA outsole with deep, sharp lugs","Made with sustainable PFC-free materials; Drop: 10mm; Weight: 330g","Due to the narrower construction of the Gore-Tex membrane these shoes may have a tighter fit than "," your usual size, Wiggle recommends sizing up for extra room"],"en-US":["Breathable, waterproof Gore-Tex membrane","Anti-debris mesh with water repellent PFC-free finish","Seamless construction with welded upper","Protective toecap and mudguard; Regular flat laces with gusseted tongue","EnergyCell midsole","OrthoLite® diecut sockliner","Shank chassis","Contagrip® TA outsole with deep, sharp lugs","Made with sustainable PFC-free materials; Drop: 10mm; Weight: 330g","Due to the narrower construction of the Gore-Tex membrane these shoes may have a tighter fit than "," your usual size, Wiggle recommends sizing up for extra room"],"es":["Membrana Gore-Tex transpirable e impermeable","Malla anti-escombros con acabado repelente al agua sin PFC","Construcción sin costuras con parte superior soldada","Puntera protectora y guardabarros; Cordones planos regulares con lengüeta reforzada","Entresuela EnergyCell","Plantilla troquelada OrthoLite®","Chasis de cambrillón","Suela Contagrip® TA con tacos profundos y afilados","Fabricado con materiales sostenibles sin PFC; Caída: 10 mm; Peso: 330 g","Debido a la construcción más estrecha de la membrana Gore-Tex, estas zapatillas pueden tener un "," ajuste más ceñido que tu talla habitual, Wiggle recomienda una talla más grande para tener más "," espacio"]},"p2":{"de":["Atmungsaktive, wasserdichte Gore-Tex-Membran|Anti-Schmutz-Netz mit wasserabweisendem, PFC-freiem "," Finish|Nahtlose Verarbeitung mit geschweißtem Obermaterial|Schützende Zehenkappe und "," Spritzschutz|Normale, flache Schnürsenkel mit vernähter Zunge|EnergyCell-Zwischensohle|OrthoLite® "," gestanzte Einlegesohle|Gelenkfedergestelle|Contagrip ® TA-Außensohle mit tiefem, scharfem "," Profil|Hergestellt aus nachhaltigen, PFC-freien Materialien; Normale Passform; Sprengung: 10 mm; "," Gewicht: 330 g"],"en":["Breathable, waterproof Gore-Tex membrane","Anti-debris mesh with water repellent PFC-free finish","Seamless construction with welded upper","Protective toecap and mudguard; Regular flat laces with gusseted tongue","EnergyCell midsole","OrthoLite® diecut sockliner","Shank chassis","Contagrip® TA outsole with deep, sharp lugs","Made with sustainable PFC-free materials; Drop: 10mm; Weight: 330g","Due to the narrower construction of the Gore-Tex membrane these shoes may have a tighter fit than "," your usual size, Wiggle recommends sizing up for extra room"],"en-US":["Breathable, waterproof Gore-Tex membrane","Anti-debris mesh with water repellent PFC-free finish","Seamless construction with welded upper","Protective toecap and mudguard; Regular flat laces with gusseted tongue","EnergyCell midsole","OrthoLite® diecut sockliner","Shank chassis","Contagrip® TA outsole with deep, sharp lugs","Made with sustainable PFC-free materials; Drop: 10mm; Weight: 330g","Due to the narrower construction of the Gore-Tex membrane these shoes may have a tighter fit than "," your usual size, Wiggle recommends sizing up for extra room"],"es":["Membrana Gore-Tex transpirable e impermeable|Malla anti-escombros con acabado repelente al agua sin "," PFC|Construcción sin costuras con parte superior soldada|Puntera protectora y guardabarros; "," Cordones planos regulares con lengüeta reforzada|Entresuela EnergyCell|Plantilla troquelada "," OrthoLite®|Chasis de cambrillón|Suela Contagrip® TA con tacos profundos y afilados|Fabricado con "," materiales sostenibles sin PFC; Caída: 10 mm; Peso: 330 g|Debido a la construcción más estrecha de "," la membrana Gore-Tex, estas zapatillas pueden tener un ajuste más ceñido que tu talla habitual, "," Wiggle recomienda una talla más grande para tener más espacio"]}}',
            },
            {
              name: 'fulfilmentLock',
              value: 'None',
            },
            {
              name: 'isDigital',
              value: false,
            },
            {
              name: 'status',
              value: 'discontinued',
            },
            {
              name: 'discipline',
              value: [
                {
                  en: 'Outdoor',
                },
              ],
            },
            {
              name: 'manufacturerCountry',
              value: 'VN',
            },
            {
              name: 'isEnabled',
              value: true,
            },
            {
              name: 'adultUKShoeSizes',
              value: {
                en: 'UK 7',
              },
            },
          ],
          assets: [],
          availability: {
            channels: {
              '6c3a3fc6-cb15-49ab-a573-3dc119180bde': {
                isOnStock: true,
                restockableInDays: 1,
                availableQuantity: 9999,
                version: 1,
                id: 'f6240fae-3f30-4387-b6e8-ab33b3d33afa',
              },
            },
          },
        },
        price: {
          id: 'c00be402-cdb0-40d8-819f-bade7b456e22',
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 79700,
            fractionDigits: 2,
          },
          channel: {
            typeId: 'channel',
            id: 'be9dfbc6-9fb3-434b-8308-a9f1a3fcc2b1',
          },
          validFrom: '2023-11-10T09:50:17.228Z',
          custom: {
            type: {
              typeId: 'type',
              id: 'c5a9e064-a035-4401-949b-99a251a7568a',
            },
            fields: {
              wasPrice: {
                type: 'centPrecision',
                currencyCode: 'USD',
                centAmount: 87670,
                fractionDigits: 2,
              },
            },
          },
        },
        quantity: 1,
        discountedPricePerQuantity: [],
        supplyChannel: {
          typeId: 'channel',
          id: '6c3a3fc6-cb15-49ab-a573-3dc119180bde',
        },
        distributionChannel: {
          typeId: 'channel',
          id: 'be9dfbc6-9fb3-434b-8308-a9f1a3fcc2b1',
        },
        taxRate: {
          name: '10% Sales Tax',
          amount: 0.1,
          includedInPrice: true,
          country: 'US',
          id: 'RR0XUe4_',
          subRates: [],
        },
        perMethodTaxRate: [],
        addedAt: '2023-12-12T12:01:21.359Z',
        lastModifiedAt: '2023-12-12T12:01:21.359Z',
        state: [
          {
            quantity: 1,
            state: {
              typeId: 'state',
              id: 'fde446e0-c19c-4354-86d6-9e3fc72852a4',
            },
          },
        ],
        priceMode: 'Platform',
        lineItemMode: 'Standard',
        totalPrice: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 79700,
          fractionDigits: 2,
        },
        taxedPrice: {
          totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 72455,
            fractionDigits: 2,
          },
          totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 79700,
            fractionDigits: 2,
          },
          totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 7245,
            fractionDigits: 2,
          },
        },
        taxedPricePortions: [],
        custom: {
          type: {
            typeId: 'type',
            id: '3f505805-42c5-4bcf-a22f-a16c54e29450',
          },
          fields: {
            categoryHierarchy: '[]',
          },
        },
      },
    ],
    customLineItems: [],
    transactionFee: true,
    discountCodes: [],
    directDiscounts: [],
    cart: {
      typeId: 'cart',
      id: 'a5b00bff-c1f5-471c-b6d5-fee1f6f278d6',
    },
    custom: {
      type: {
        typeId: 'type',
        id: 'd5b44dea-78f8-41d8-950b-df7a449239c1',
      },
      fields: {
        storeKey: 'p1-us',
        provenance: 'p1',
        locale: 'en-US',
        siteKey: 'p1-us',
      },
    },
    paymentInfo: {
      payments: [
        { typeId: 'payment', id: 'mock-payment-id', obj: getMockCommercetoolsPayment() },
        {
          typeId: 'payment',
          id: 'mock-gift-card-paymend-id',
          obj: getMockGiftCardPayment(
            {
              centAmount: 65,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
            '444332222',
          ),
        },
      ],
    },
    itemShippingAddresses: [],
    refusedGifts: [],
    store: {
      typeId: 'store',
      key: 'p1-us',
    },
  } as unknown as Order
}

export const getMockCommercetoolsCustomer = () => {
  return {
    id: '74a2a666-87e7-40f9-a49d-1e22b505773c',
    version: 20,
    versionModifiedAt: '2023-10-11T10:37:06.654Z',
    lastMessageSequenceNumber: 8,
    createdAt: '2023-07-12T12:48:22.980Z',
    lastModifiedAt: '2023-10-11T10:37:06.654Z',
    lastModifiedBy: {
      customer: {
        typeId: 'customer',
        id: '74a2a666-87e7-40f9-a49d-1e22b505773c',
      },
    },
    createdBy: {
      clientId: 'SJmxT-86PH9VM02FRxohFlyc',
      isPlatformClient: false,
    },
    email: 'wilco+2@gradientedge.com',
    firstName: 'Wilco',
    lastName: 'Boumans',
    middleName: '',
    title: '',
    salutation: '',
    addresses: [
      {
        id: 'RreB2rcK',
        firstName: 'Wilco',
        lastName: 'Boumans',
        streetName: 'Mangrove Lane 12',
        additionalStreetInfo: '',
        postalCode: 'SG138QQ',
        city: 'Hertford',
        state: 'Hertfordshire',
        country: 'GB',
        phone: '+44 2398472987',
        key: '1689166651803',
      },
      {
        id: 'K-4Qj1B_',
        firstName: 'Peter',
        lastName: 'Freemond',
        streetName: '12 Livingstone ave',
        additionalStreetInfo: '',
        postalCode: 'SR238Q',
        city: 'Londen',
        state: 'London',
        country: 'GB',
        phone: '+44 8273498279',
        email: 'wilco+2@gradientedge.com',
        key: '1690484287073',
      },
      {
        id: 'UA9K2GzM',
        firstName: 'Mad',
        lastName: 'Max',
        streetName: 'Bondi Beach',
        additionalStreetInfo: '',
        postalCode: '2026',
        city: 'Bondi Beach',
        state: 'NSW',
        country: 'AU',
        phone: '+61 23457298734',
        email: 'wilco+2@gradientedge.com',
        key: '1697020626608',
      },
    ],
    shippingAddressIds: ['UA9K2GzM', 'K-4Qj1B_', 'RreB2rcK'],
    billingAddressIds: ['UA9K2GzM', 'K-4Qj1B_', 'RreB2rcK'],
    isEmailVerified: false,
    externalId: 'auth0|64aea115485b020816d36853',
    custom: {
      type: {
        typeId: 'type',
        id: '578d018d-7958-44e6-87d2-9904d49c3f8e',
      },
      fields: {
        provenance: 'p1',
        defaultAddressesByStore:
          '{"delivery":{"p1-uk":"1689166651803","p1-au":"1697020626608"},"billing":{"p1-uk":"1689166651803","p1-au":"1697020626608"}}',
      },
    },
    stores: [
      {
        typeId: 'store',
        key: 'p1-uk',
      },
      {
        typeId: 'store',
        key: 'p1-us',
      },
    ],
    authenticationMode: 'ExternalAuth',
  } as unknown as Customer
}
