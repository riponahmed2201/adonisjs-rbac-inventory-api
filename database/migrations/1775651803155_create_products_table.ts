import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 160).notNullable()
      table.string('sku', 80).notNullable().unique()
      table.text('description').nullable()
      table.decimal('price', 12, 2).notNullable()
      table.integer('stock').notNullable().defaultTo(0)
      table.string('image_url').nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table
        .integer('subcategory_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('subcategories')
      table.integer('brand_id').unsigned().notNullable().references('id').inTable('brands')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
