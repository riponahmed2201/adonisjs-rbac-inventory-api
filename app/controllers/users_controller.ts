import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/management'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const search = request.input('search')

    const query = User.query().preload('roles')
    if (search) {
      query.where((builder) => {
        builder.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
      })
    }

    return query.paginate(page, limit)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const { roleIds, ...userData } = payload
    const user = await User.create(userData)
    await user.related('roles').sync(roleIds)
    await user.load('roles')

    return response.created(user)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const user = await User.findOrFail(params.id)
    const { roleIds, ...userData } = payload
    user.merge(userData)
    await user.save()

    if (roleIds) {
      await user.related('roles').sync(roleIds)
    }

    await user.load('roles')
    return user
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.ok({ message: 'User deleted' })
  }
}
