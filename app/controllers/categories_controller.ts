import Category from '#models/category'
import Subcategory from '#models/subcategory'
import { categoryValidator, subcategoryValidator } from '#validators/management'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index() {
    return Category.query().preload('subcategories')
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(categoryValidator)
    const category = await Category.create(payload)
    return response.created(category)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(categoryValidator)
    const category = await Category.findOrFail(params.id)
    category.merge(payload)
    await category.save()
    return category
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.ok({ message: 'Category deleted' })
  }

  async storeSubcategory({ request, response }: HttpContext) {
    const payload = await request.validateUsing(subcategoryValidator)
    const subcategory = await Subcategory.create(payload)
    return response.created(subcategory)
  }
}
