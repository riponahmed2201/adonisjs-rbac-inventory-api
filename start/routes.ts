/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AccessTokenController = () => import('#controllers/access_token_controller')
const NewAccountController = () => import('#controllers/new_account_controller')
const ProfileController = () => import('#controllers/profile_controller')
const UsersController = () => import('#controllers/users_controller')
const RolesController = () => import('#controllers/roles_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const BrandsController = () => import('#controllers/brands_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [NewAccountController, 'store'])
        router.post('login', [AccessTokenController, 'store'])
        router.post('logout', [AccessTokenController, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [ProfileController, 'show'])
        router.get('/roles', [RolesController, 'index'])
        router.get('/permissions', [RolesController, 'permissions'])

        router
          .get('/users', [UsersController, 'index'])
          .use(middleware.permission({ permission: 'manage users' }))
        router
          .post('/users', [UsersController, 'store'])
          .use(middleware.permission({ permission: 'manage users' }))
        router
          .patch('/users/:id', [UsersController, 'update'])
          .use(middleware.permission({ permission: 'manage users' }))
        router
          .delete('/users/:id', [UsersController, 'destroy'])
          .use(middleware.permission({ permission: 'manage users' }))

        router.get('/categories', [CategoriesController, 'index'])
        router
          .post('/categories', [CategoriesController, 'store'])
          .use(middleware.permission({ permission: 'edit product' }))
        router
          .patch('/categories/:id', [CategoriesController, 'update'])
          .use(middleware.permission({ permission: 'edit product' }))
        router
          .delete('/categories/:id', [CategoriesController, 'destroy'])
          .use(middleware.permission({ permission: 'delete product' }))
        router
          .post('/subcategories', [CategoriesController, 'storeSubcategory'])
          .use(middleware.permission({ permission: 'edit product' }))

        router.get('/brands', [BrandsController, 'index'])
        router
          .post('/brands', [BrandsController, 'store'])
          .use(middleware.permission({ permission: 'edit product' }))
        router
          .patch('/brands/:id', [BrandsController, 'update'])
          .use(middleware.permission({ permission: 'edit product' }))
        router
          .delete('/brands/:id', [BrandsController, 'destroy'])
          .use(middleware.permission({ permission: 'delete product' }))

        router.get('/products', [ProductsController, 'index'])
        router
          .post('/products', [ProductsController, 'store'])
          .use(middleware.permission({ permission: 'create product' }))
        router
          .patch('/products/:id', [ProductsController, 'update'])
          .use(middleware.permission({ permission: 'edit product' }))
        router
          .delete('/products/:id', [ProductsController, 'destroy'])
          .use(middleware.permission({ permission: 'delete product' }))
        router.get('/products/:id/ai-summary', [ProductsController, 'aiSummary'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
