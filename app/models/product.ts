import Category from '#models/category'
import Subcategory from '#models/subcategory'
import Brand from '#models/brand'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare sku: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare imageUrl: string | null

  @column()
  declare isActive: boolean

  @column()
  declare categoryId: number

  @column()
  declare subcategoryId: number | null

  @column()
  declare brandId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Subcategory)
  declare subcategory: BelongsTo<typeof Subcategory>

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>
}
