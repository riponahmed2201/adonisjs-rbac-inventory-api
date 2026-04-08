# AdonisJS RBAC Inventory API

Complete practice project with:

- Auth: register, login, profile, logout
- User Management: list/create/update/delete users
- Role Management: admin, manager, staff
- Permission Management: create/edit/delete product, manage users
- Product Module: categories, subcategories, brands, products
- Extra: search, filter, pagination, image upload, AI summary

## Setup

```bash
npm install
cp .env.example .env
node ace migration:run
node ace db:seed --files="./database/seeders/rbac_seeder.ts"
npm run dev
```

Base URL: `http://localhost:3333/api/v1`

## Default admin

- Email: `admin@example.com`
- Password: `Admin@12345`

## Important routes

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /account/profile`
- `GET /account/users`
- `POST /account/users`
- `PATCH /account/users/:id`
- `DELETE /account/users/:id`
- `GET /account/categories`
- `POST /account/categories`
- `POST /account/subcategories`
- `GET /account/brands`
- `POST /account/brands`
- `GET /account/products?search=shoe&categoryId=1&brandId=1&page=1&limit=10`
- `POST /account/products` (multipart, `image` file supported)
- `GET /account/products/:id/ai-summary`

## Permissions usage

The project uses route middleware:

- `manage users`
- `create product`
- `edit product`
- `delete product`

Assign permissions to roles in `rbac_seeder.ts`.
