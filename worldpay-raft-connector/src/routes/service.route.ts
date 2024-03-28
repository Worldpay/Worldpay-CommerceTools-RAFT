import { Router } from 'express'
import { logger } from '../utils/logger.utils'
import { apiSuccess } from '../api/success.api'
import { paymentController } from '../controllers/payment.controller'
import { isSuccess } from '../response/custom.response'
import { Status } from '@reflet/http'

const serviceRouter = Router()

serviceRouter.post('/', async (req, res) => {
  //
  // Deserialize the action and resource from the body
  const { action, resource } = req.body
  if (!action || !resource) {
    logger.error(
      `Update extension Bad Request, invoked with action [${action}] and resource: { type: ${resource?.typeId}, ...?`,
    )
    return res.status(400).send('Bad request - Missing body parameters.')
  }

  // Identify the type of resource in order to redirect to the correct controller
  switch (resource.typeId) {
    case 'payment': {
      const result = await paymentController(req.body)
      if (isSuccess(result)) {
        return apiSuccess(result.statusCode, result.actions, res)
      }
      return res
        .status(result?.statusCode || Status.BadRequest)
        .json({ message: result?.message, errors: result?.errors })
    }
    default:
      return res
        .status(Status.InternalServerError)
        .send(
          `Internal Server Error - Resource typeId [${resource?.typeId}] not recognized. Allowed values are 'payment'.`,
        )
  }
})

export default serviceRouter
