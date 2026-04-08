import Product from '#models/product'
import { productValidator } from '#validators/management'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import AiProductService from '#services/ai_product_service'

export default class ProductsController {
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const search = request.input('search')
    const categoryId = request.input('categoryId')
    const brandId = request.input('brandId')

    const query = Product.query()
      .preload('category')
      .preload('subcategory')
      .preload('brand')
      .orderBy('id', 'desc')

    if (search) {
      query.where((builder) => {
        builder.whereILike('name', `%${search}%`).orWhereILike('sku', `%${search}%`)
      })
    }
    if (categoryId) query.where('category_id', categoryId)
    if (brandId) query.where('brand_id', brandId)

    return query.paginate(page, limit)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(productValidator)
    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let imagePath: string | null = null
    if (image) {
      const fileName = `${Date.now()}-${image.clientName}`
      await image.move(app.makePath('storage/products'), { name: fileName })
      imagePath = `storage/products/${fileName}`
    }

    const product = await Product.create({ ...payload, imageUrl: imagePath })
    return response.created(product)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(productValidator)
    const product = await Product.findOrFail(params.id)
    product.merge(payload)
    await product.save()
    return product
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.ok({ message: 'Product deleted' })
  }

  async aiSummary({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const summary = await AiProductService.generateSummary(product)
    return { summary }
  }
}
