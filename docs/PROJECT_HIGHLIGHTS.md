# Project Highlights

## What this project demonstrates

- End-to-end backend architecture using AdonisJS
- Access-token authentication (signup, login, logout, profile)
- Role-based access control (admin, manager, staff)
- Permission enforcement via route middleware
- User management CRUD
- Product ecosystem modules:
  - categories
  - subcategories
  - brands
  - products
- Search, filtering, and pagination
- Product image upload
- AI-driven product summary generation
- Centralized exception handling with consistent JSON error responses

## Production-oriented practices used

- Validation-first request handling using VineJS
- Service layer for external integration (OpenAI)
- Custom exceptions for external-service failures
- Global exception handler for standardized API errors
- Clear DB schema design with pivot tables for RBAC
- Seeder-driven bootstrapping of roles/permissions/admin user
- Lint + typecheck verification

## Suggested proof for portfolio

- Add API testing collection (Postman/Bruno)
- Add 3-5 automated tests (auth, RBAC, products)
- Add deployment URL and health endpoint
- Add CI workflow for lint/typecheck/tests

## Recruiter-friendly summary

This project is a production-style AdonisJS REST API that showcases secure authentication, scalable authorization (RBAC), modular backend design, robust validation and error handling, and practical AI integration.
