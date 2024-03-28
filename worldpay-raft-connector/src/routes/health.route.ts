import { Router } from 'express'

const healthRouter = Router()

healthRouter.get('/', async (req, res) => {
  return res.status(200).send()
})

export default healthRouter
