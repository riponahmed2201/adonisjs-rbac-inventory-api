import vine from '@vinejs/vine'

export const createUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2),
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(32),
  roleIds: vine.array(vine.number().positive()),
})

export const updateUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2).optional(),
  email: vine.string().email().optional(),
  password: vine.string().minLength(8).maxLength(32).optional(),
  isActive: vine.boolean().optional(),
  roleIds: vine.array(vine.number().positive()).optional(),
})

export const categoryValidator = vine.create({
  name: vine.string().trim().minLength(2),
  slug: vine.string().trim().minLength(2),
})

export const subcategoryValidator = vine.create({
  name: vine.string().trim().minLength(2),
  slug: vine.string().trim().minLength(2),
  categoryId: vine.number().positive(),
})

export const brandValidator = vine.create({
  name: vine.string().trim().minLength(2),
  slug: vine.string().trim().minLength(2),
})

export const productValidator = vine.create({
  name: vine.string().trim().minLength(2),
  sku: vine.string().trim().minLength(2),
  description: vine.string().trim().optional(),
  price: vine.number().positive(),
  stock: vine.number().min(0),
  categoryId: vine.number().positive(),
  subcategoryId: vine.number().positive().optional(),
  brandId: vine.number().positive(),
  isActive: vine.boolean().optional(),
})
