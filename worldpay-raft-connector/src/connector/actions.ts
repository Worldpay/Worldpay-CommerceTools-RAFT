import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder'
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
  await apiRoot
    .types()
    .post({
      body: {
        key: PAYMENT_TYPE_KEY,
        name: {
          en: 'The RAFT CreditAuth request as a JSON string',
        },
        resourceTypeIds: ['payment'],
        fieldDefinitions: [
          {
            type: {
              name: 'String',
            },
            name: 'creditAuthRequest',
            label: {
              en: 'RAFT CreditAuth request',
            },
            required: false,
          },
        ],
      },
    })
    .execute()
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
