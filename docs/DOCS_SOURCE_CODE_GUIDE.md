# AdonisJS Source Code Guide (Basic to Production)

এই guide-এর লক্ষ্য: এই project-এর source code follow করে AdonisJS backend architecture clearভাবে বোঝা।

---

## 1) High-level architecture

Project flow:

1. Route আসে `start/routes.ts` এ
2. Global middleware run হয় `start/kernel.ts` থেকে
3. Controller request handle করে (`app/controllers/*`)
4. Validator input validate করে (`app/validators/*`)
5. Model DB query করে (`app/models/*`)
6. Service external/business logic handle করে (`app/services/*`)
7. Error হলে global exception handler response দেয় (`app/exceptions/handler.ts`)

---

## 2) First files to read (এই order follow করো)

1. `start/routes.ts`
2. `start/kernel.ts`
3. `app/middleware/auth_middleware.ts`
4. `app/middleware/permission_middleware.ts`
5. `app/controllers/access_token_controller.ts`
6. `app/controllers/new_account_controller.ts`
7. `app/controllers/users_controller.ts`
8. `app/controllers/products_controller.ts`
9. `app/models/user.ts`, `app/models/role.ts`, `app/models/permission.ts`
10. `app/exceptions/handler.ts`
11. `database/migrations/*`
12. `database/seeders/rbac_seeder.ts`

---

## 3) Request lifecycle (How AdonisJS works)

এই project-এ একটি request সাধারণত এই path follow করে:

1. **HTTP request আসে**
   - Example: `GET /api/v1/account/products`

2. **Route match হয়** (`start/routes.ts`)
   - Route group, prefix, middleware এবং controller method decide হয়

3. **Server middleware run হয়** (`start/kernel.ts` -> `server.use`)
   - JSON response shaping, container bindings, CORS ইত্যাদি

4. **Router middleware run হয়** (`start/kernel.ts` -> `router.use`)
   - body parser, session, shield, auth initialization, silent auth

5. **Named middleware run হয়** (route-level)
   - `middleware.auth()` -> logged-in user required
   - `middleware.permission({ permission: '...' })` -> RBAC check

6. **Controller execute হয়** (`app/controllers/*`)
   - Request input নেওয়া, validator call, service/model interaction

7. **Validation হয়** (`app/validators/*`)
   - `request.validateUsing(...)`
   - Fail করলে `E_VALIDATION_ERROR` throw

8. **Business logic + DB query হয়**
   - Models (`app/models/*`) via Lucid ORM
   - External integration হলে services (`app/services/*`)

9. **Response serialize হয়ে client-এ যায়**
   - Success হলে controller return value
   - Error হলে global exception handler format করে দেয়

10. **Exception handling** (`app/exceptions/handler.ts`)
    - Validation -> 422
    - Unauthorized -> 401
    - Forbidden -> 403
    - Not found -> 404
    - Unexpected -> 500

### Request lifecycle trace example

`GET /api/v1/account/users?page=1&limit=10`

1. route match -> `UsersController.index`
2. `middleware.auth()` user verify
3. `middleware.permission(manage users)` role/permission verify
4. controller `page`, `limit`, `search` parse করে
5. `User.query().preload('roles').paginate(...)`
6. paginated response return

---

## 4) Auth module বুঝার shortcut

Auth routes:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/account/profile`

Key concepts:

- Signup/login এ validation -> user create/verify -> access token generate
- Protected routes এ `middleware.auth()` ব্যবহার
- Current logged-in user পাওয়া যায় `auth.getUserOrFail()`

---

## 5) RBAC (Role + Permission) flow

Relevant files:

- `app/models/user.ts`
- `app/models/role.ts`
- `app/models/permission.ts`
- `app/middleware/permission_middleware.ts`
- `database/seeders/rbac_seeder.ts`

How it works:

1. User-এর সাথে role assign হয়
2. Role-এর সাথে permission assign হয়
3. Route এ permission middleware check করে
4. Permission না থাকলে `403 Forbidden` response

Example permissions:

- `manage users`
- `create product`
- `edit product`
- `delete product`

---

## 6) Validation pattern

Files:

- `app/validators/user.ts`
- `app/validators/management.ts`

Pattern:

- Controller এ `request.validateUsing(...)`
- Invalid payload হলে validation error throw হয়
- Centralizedভাবে `app/exceptions/handler.ts` থেকে `422` response

---

## 7) Error handling pattern (production style)

Core file: `app/exceptions/handler.ts`

এই project-এ centralizedভাবে handle হচ্ছে:

- Validation error -> 422
- Unauthorized -> 401
- Forbidden -> 403
- Not found -> 404
- Unexpected error -> 500

Note:

- Controller-এ everywhere `try/catch` দেওয়া হয়নি intentionally
- External API call (`app/services/ai_product_service.ts`) এ targeted `try/catch` আছে

---

## 8) Product module deep dive

Files:

- `app/controllers/products_controller.ts`
- `app/models/product.ts`
- migrations: category/subcategory/brand/product tables

Features:

- Product CRUD
- Search (`name`, `sku`)
- Filter (`categoryId`, `brandId`)
- Pagination (`page`, `limit`)
- Image upload (`multipart/form-data`)
- AI summary endpoint

---

## 9) AI feature বুঝার জন্য

Files:

- `app/services/ai_product_service.ts`
- `app/exceptions/ai_service_exception.ts`
- `.env` / `start/env.ts` (`OPENAI_API_KEY`)

Flow:

1. Product fetch
2. OpenAI SDK call
3. Error হলে custom AI exception
4. Global handler safe response দেয়

---

## 10) Database understanding checklist

Read these migrations carefully:

- users
- roles
- permissions
- user_roles (pivot)
- role_permissions (pivot)
- categories
- subcategories
- brands
- products

Then draw ERD manually:

- User <-> Role (many-to-many)
- Role <-> Permission (many-to-many)
- Category -> Subcategory (one-to-many)
- Category/Subcategory/Brand -> Product

---

## 11) Practice tasks (must do)

1. নতুন permission add করো: `view reports`
2. নতুন role add করো: `auditor`
3. `auditor` কে read-only endpoints allow করো
4. `products` এ price range filter add করো
5. `users` list এ `isActive` filter add করো
6. `ai-summary` endpoint-এ fallback message customize করো
7. একটাকে break করে দেখো: invalid payload -> কী error আসে observe করো

---

## 12) Debugging approach

যখন issue হবে, এই order follow করো:

1. Route ঠিক আছে?
2. Middleware block করছে?
3. Validator fail করছে?
4. Controller logic ঠিক?
5. Model relation/table column mismatch?
6. Global exception response কী দিচ্ছে?

---

## 13) Production readiness checklist

- [ ] Env variables properly set
- [ ] Strong app key
- [ ] DB backup strategy
- [ ] Centralized error responses
- [ ] Rate limit plan (especially auth routes)
- [ ] Logging policy
- [ ] Automated tests for auth + RBAC + products
- [ ] CI lint + typecheck

---

## 14) Quick run commands

```bash
npm install
cp .env.example .env
node ace migration:run
node ace db:seed --files="./database/seeders/rbac_seeder.ts"
npm run dev
```

Useful checks:

```bash
npm run lint
npm run typecheck
```

---

এই guide follow করে code trace করলে AdonisJS project structure, request lifecycle, RBAC, validation, এবং production-style error handling খুব clear হয়ে যাবে।
