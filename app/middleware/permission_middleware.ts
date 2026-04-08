import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { permission: string }) {
    const user = ctx.auth.getUserOrFail()
    const allowed = await user.hasPermission(options.permission)

    if (!allowed) {
      return ctx.response.forbidden({
        message: `Missing permission: ${options.permission}`,
      })
    }

    return next()
  }
}
