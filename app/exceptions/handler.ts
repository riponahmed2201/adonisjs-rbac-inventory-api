import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const maybeError = error as {
      status?: number
      code?: string
      message?: string
      messages?: unknown
    }

    if (maybeError?.code === 'E_VALIDATION_ERROR') {
      return ctx.response.status(422).send({
        success: false,
        message: 'Validation failed',
        errors: maybeError.messages ?? [],
      })
    }

    if (maybeError?.status === 401) {
      return ctx.response.status(401).send({
        success: false,
        message: maybeError.message ?? 'Unauthorized',
      })
    }

    if (maybeError?.code === 'E_ROW_NOT_FOUND' || maybeError?.status === 404) {
      return ctx.response.status(404).send({
        success: false,
        message: 'Resource not found',
      })
    }

    if (maybeError?.status === 403) {
      return ctx.response.status(403).send({
        success: false,
        message: maybeError.message ?? 'Forbidden',
      })
    }

    if (maybeError?.status && maybeError.status < 500) {
      return ctx.response.status(maybeError.status).send({
        success: false,
        message: maybeError.message ?? 'Request failed',
      })
    }

    if (this.debug) {
      return super.handle(error, ctx)
    }

    return ctx.response.status(500).send({
      success: false,
      message: 'Internal server error',
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
