import { NextFunction, Request, Response } from 'express'

/**
 * Middleware for error handling
 * @param error The error object
 * @param _req The express request
 * @param res The Express response
 * @param next The Express nextFunction
 */
export const errorMiddleware = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  res?.status(500).send(`Internal server error: ${error || 'unknown error'}`)
  next(error)
}
