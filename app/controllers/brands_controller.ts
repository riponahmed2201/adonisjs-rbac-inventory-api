import Brand from '#models/brand'
import { brandValidator } from '#validators/management'
import type { HttpContext } from '@adonisjs/core/http'

export default class BrandsController {
  async index() {
    return Brand.all()
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(brandValidator)
    const brand = await Brand.create(payload)
    return response.created(brand)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(brandValidator)
    const brand = await Brand.findOrFail(params.id)
    brand.merge(payload)
    await brand.save()
    return brand
  }

  async destroy({ params, response }: HttpContext) {
    const brand = await Brand.findOrFail(params.id)
    await brand.delete()
    return response.ok({ message: 'Brand deleted' })
  }
}
