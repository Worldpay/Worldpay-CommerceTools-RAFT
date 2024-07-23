import { Status } from '@reflet/http'

type ErrorItem = {
  statusCode: number
  message: string
  referencedBy?: string
}

export class CustomError extends Error {
  statusCode: number
  message: string
  errors?: ErrorItem[]

  constructor(options: { statusCode: number; message: string; errors?: ErrorItem[] }) {
    super(options.message)
    const { statusCode, message, errors } = options
    this.statusCode = statusCode
    this.message = message
    if (errors) {
      this.errors = errors
    }
  }
}

export class Success<T> {
  statusCode = Status.Ok
  actions: T

  constructor(actions: T) {
    this.actions = actions
  }
}

export type CustomResponse<T> = Success<T> | CustomError

export function isSuccess<T>(obj: CustomResponse<T> | undefined): obj is Success<T> {
  return obj !== undefined && obj.statusCode === Status.Ok
}
