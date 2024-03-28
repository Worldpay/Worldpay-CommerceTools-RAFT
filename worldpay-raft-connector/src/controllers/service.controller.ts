import { Request, Response } from 'express'
import { apiSuccess } from '../api/success.api'
import { paymentController } from './payment.controller'
import { isSuccess } from '../response/custom.response'
import { Status } from '@reflet/http'

/**
 * Exposed service endpoint.
 * - Receives a POST request, parses the action and the controller and returns it to the correct controller.
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 */
export const handlePost = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const payload = request.body

  if (!payload) {
    return response.status(400).send('Bad request - Missing body parameters.')
  }

  // Identify the type of resource in order to redirect
  // to the correct controller
  switch (payload.resource.typeId) {
    case 'payment': {
      const result = await paymentController(payload)
      if (isSuccess(result)) {
        return apiSuccess(200, result.actions, response)
      }

      return response.status(result?.statusCode || Status.BadRequest).json({ errors: result?.errors })
    }
    default:
      return response.status(500).send(`Internal Server Error - Resource not recognized. Allowed values are 'payment'.`)
  }
}
