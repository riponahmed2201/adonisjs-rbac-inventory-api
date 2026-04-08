import { Exception } from '@adonisjs/core/exceptions'

export default class AiServiceException extends Exception {
  static status = 502
  static code = 'E_AI_SERVICE_ERROR'

  constructor(message = 'AI service is temporarily unavailable') {
    super(message, { status: 502, code: 'E_AI_SERVICE_ERROR' })
  }
}
