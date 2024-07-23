import { UpdateAction } from '@commercetools/sdk-client-v2'
import { Payload } from '../interfaces/resource.interface'
import { logger } from '../utils/logger.utils'
import { Status } from '@reflet/http'
import { CustomResponse, Success, CustomError } from '../response/custom.response'
import { handleRaftRequest } from '@gradientedge/worldpay-raft-connector'

/**
 * Handle the create or update action of a payment
 *
 * @param {Payload} payload The resource from the request body
 */
async function processRequest(payload: Payload): Promise<CustomResponse<UpdateAction[]>> {
  try {
    // Deserialize the resource to a PaymentDraft
    const paymentDraft = JSON.parse(JSON.stringify(payload))
    logger.debug('Received payment: ', paymentDraft)

    const response = await handleRaftRequest(payload)

    if (response.responseType !== 'UpdateRequest') {
      return new CustomError({
        statusCode: Status.BadRequest,
        message: response.responseType,
        errors: response.errors?.map((err: any) => ({ statusCode: Status.BadRequest, message: err.message })),
      })
    }
    return new Success(response.actions!)
  } catch (error: any) {
    if (error?.inner !== undefined) {
      return new CustomError({
        statusCode: Status.BadRequest,
        message: `Validation error on request`,
        errors: error?.inner?.map((err: any) => ({ statusCode: Status.BadRequest, message: err.message })),
      })
    }
    return new CustomError({ statusCode: Status.InternalServerError, message: `${error}` })
  }
}

/**
 * Handle the payment controller according to the action
 *
 * @param {Payload} payload The payload from the request body
 * @returns {Promise<object>} The data from the method that handles the action
 */
export async function paymentController(payload: Payload): Promise<CustomResponse<UpdateAction[]> | undefined> {
  switch (payload.action) {
    case 'Update':
    case 'Create': {
      return await processRequest(payload)
    }

    default:
      return new CustomError({
        statusCode: Status.BadRequest,
        message: `Internal Server Error - Resource action [${payload}] not recognized. Allowed values are 'Create' and 'Update'.`,
      })
  }
}
