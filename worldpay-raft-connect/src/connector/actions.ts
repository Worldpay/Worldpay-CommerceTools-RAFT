import { ByProjectKeyRequestBuilder, StateDraft, TypeDraft } from '@commercetools/platform-sdk'
import { readConfiguration } from '../utils/config.utils'

const PAYMENT_UPDATE_EXTENSION_KEY = 'worldpay-raft-payment-extension'
const PAYMENT_TYPE_KEY = 'worldpay-raft-payment-type'

export async function registerConnectorEvents(
  apiRoot: ByProjectKeyRequestBuilder,
  applicationUrl: string,
): Promise<void> {
  await removeConnectorEvents(apiRoot)
  const base64EncodedData = Buffer.from(
    `${readConfiguration().connector.user}:${readConfiguration().connector.secret}`,
  ).toString('base64')
  await apiRoot
    .extensions()
    .post({
      body: {
        key: PAYMENT_UPDATE_EXTENSION_KEY,
        destination: {
          type: 'HTTP',
          url: applicationUrl,
          authentication: {
            type: 'AuthorizationHeader',
            headerValue: `Basic ${base64EncodedData}`,
          },
        },
        triggers: [
          {
            resourceTypeId: 'payment',
            actions: ['Create', 'Update'],
          },
        ],
      },
    })
    .execute()
}

export async function removeConnectorEvents(apiRoot: ByProjectKeyRequestBuilder): Promise<void> {
  const {
    body: { results: extensions },
  } = await apiRoot
    .extensions()
    .get({
      queryArgs: {
        where: `key = "${PAYMENT_UPDATE_EXTENSION_KEY}"`,
      },
    })
    .execute()

  if (extensions && extensions.length > 0) {
    await Promise.all(
      extensions.map(async (extension) => {
        return await apiRoot
          .extensions()
          .withKey({ key: extension.key || '' })
          .delete({
            queryArgs: {
              version: extension.version,
            },
          })
          .execute()
      }),
    )
  }
}

export async function loadConnectorCustomTypes(apiRoot: ByProjectKeyRequestBuilder): Promise<void> {
  // DON'T ADD THIS LINE BELOW, as deploying a new version of the connector will destroy all data before adding the model again
  // await unloadConnectorTypes(apiRoot)

  const paymentType: TypeDraft = {
    key: PAYMENT_TYPE_KEY,
    name: {
      en: 'Worldpay RAFT Payment',
    },
    resourceTypeIds: ['payment'],
    fieldDefinitions: [
      {
        name: 'request',
        label: {
          en: 'The request that was sent to Worldpay RAFT',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'MultiLine',
      },
      {
        name: 'cartId',
        label: {
          en: 'Cart ID of the cart that contains the payment',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'SingleLine',
      },
      {
        name: 'tokenizedPAN',
        label: {
          en: 'The tokenized PAN as returned from RAFT',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'SingleLine',
      },
      {
        name: 'STPReferenceNUM',
        label: {
          en: 'The STPData.STPReferenceNUM returned from RAFT',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'SingleLine',
      },
    ],
  }
  await createTypeIfNotExists(apiRoot, paymentType)

  const interfaceInteraction: TypeDraft = {
    key: 'worldpay-raft-interface-interaction',
    name: {
      en: 'Worldpay RAFT Payment Interaction',
    },
    resourceTypeIds: ['payment-interface-interaction'],
    fieldDefinitions: [
      {
        name: 'createdAt',
        label: {
          en: 'Date Created',
        },
        required: true,
        type: {
          name: 'DateTime',
        },
        inputHint: 'SingleLine',
      },
      {
        name: 'apiTransactionId',
        label: {
          en: 'API Transaction ID',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'SingleLine',
      },
      {
        name: 'request',
        label: {
          en: 'Worldpay RAFT Message that was sent',
        },
        required: true,
        type: {
          name: 'String',
        },
        inputHint: 'MultiLine',
      },
      {
        name: 'response',
        label: {
          en: 'Worldpay RAFT Response received',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'MultiLine',
      },
    ],
  }
  await createTypeIfNotExists(apiRoot, interfaceInteraction)

  const customerType: TypeDraft = {
    key: 'customer-tokenised-cards',
    name: {
      en: 'WorldPay RAFT card on file',
    },
    description: {
      en: 'CardOnFile payment methods for WorldPay RAFT payments',
    },
    resourceTypeIds: ['customer'],
    fieldDefinitions: [
      {
        name: 'cardOnFileTokens',
        label: {
          en: "The customer's tokenised cardOnFile",
        },
        required: false,
        type: {
          name: 'Set',
          elementType: {
            name: 'String',
          },
        },
      },
    ],
  }
  await createTypeIfNotExists(apiRoot, customerType)

  const paymentStates: StateDraft[] = [
    {
      key: 'payment-open',
      type: 'PaymentState',
      name: {
        en: 'Open',
      },
      description: {
        en: 'Payment is open (pending), waiting processing',
      },
      initial: true,
    },
    {
      key: 'payment-failed',
      type: 'PaymentState',
      name: {
        en: 'Failed',
      },
      description: {
        en: 'The payment failed',
      },
      initial: true,
    },
    {
      key: 'payment-paid',
      type: 'PaymentState',
      name: {
        en: 'Paid',
      },
      description: {
        en: 'The payment was successfully completed',
      },
      initial: true,
    },
    {
      key: 'payment-refunded',
      type: 'PaymentState',
      name: {
        en: 'Refunded',
      },
      description: {
        en: 'The payment was refunded',
      },
      initial: true,
    },
    {
      key: 'payment-cancelled',
      type: 'PaymentState',
      name: {
        en: 'Cancelled',
      },
      description: {
        en: 'The payment was cancelled',
      },
      initial: true,
    },
  ]
  paymentStates.forEach((stateDraft) => {
    createStateIfNotExists(apiRoot, stateDraft)
  })
}

async function createTypeIfNotExists(apiRoot: ByProjectKeyRequestBuilder, typeDraft: TypeDraft): Promise<void> {
  const {
    body: { results },
  } = await apiRoot
    .types()
    .get({
      queryArgs: {
        where: `key = "${typeDraft.key}"`,
      },
    })
    .execute()

  if (!results || results.length <= 0) {
    await apiRoot.types().post({ body: typeDraft }).execute()
  }
}

async function createStateIfNotExists(apiRoot: ByProjectKeyRequestBuilder, stateDraft: StateDraft): Promise<void> {
  const {
    body: { results },
  } = await apiRoot
    .states()
    .get({
      queryArgs: {
        where: `key = "${stateDraft.key}"`,
      },
    })
    .execute()

  if (!results || results.length <= 0) {
    await apiRoot.states().post({ body: stateDraft }).execute()
  }
}

export async function unloadConnectorTypes(apiRoot: ByProjectKeyRequestBuilder): Promise<void> {
  const {
    body: { results: types },
  } = await apiRoot
    .types()
    .get({
      queryArgs: {
        where: `key = "${PAYMENT_TYPE_KEY}"`,
      },
    })
    .execute()

  if (types && types.length > 0) {
    await Promise.all(
      types.map(async (type) => {
        await apiRoot
          .types()
          .withKey({ key: type.key })
          .delete({
            queryArgs: {
              version: type.version,
            },
          })
          .execute()
      }),
    )
  }
}
