# Inventory & Distribution Management API

A production-grade REST API for managing rice procurement, production, stock, sales, and delivery operations. Built with **Node.js**, **TypeScript**, **Express.js v5**, **PostgreSQL**, **Prisma**, **Redis**, and **BullMQ**.

> Inspired by 3 years of real-world experience at **UD Barokah** — a rice milling and logistics company partnered with [BULOG](https://www.bulog.co.id/) (Indonesia's national food logistics agency). Every business rule, status workflow, and entity relationship in this API reflects actual operational patterns.

**[Live Swagger Docs](https://inventory-distribution-api-production.up.railway.app/api/docs)** · **[Bull Board Dashboard](https://inventory-distribution-api-production.up.railway.app/admin/queues)**

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Business Logic Highlights](#business-logic-highlights)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Overview

This API digitizes the core operations of a rice milling and distribution business:

1. **Procurement** — Purchase raw materials (unhusked rice) from suppliers across 4 regions
2. **Production** — Process raw materials into finished products (Dua Kurma, Strawberry, ProductBulog)
3. **Stock Management** — Track inventory across multiple warehouses with atomic transactions
4. **Sales & Delivery** — Handle orders from BULOG (contract-based) and non-BULOG customers (Hotel, Retail), then dispatch deliveries with fleet management
5. **Milling Service** — Standalone rice milling service for external customers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v20 (LTS) |
| Language | TypeScript (CommonJS) |
| Framework | Express.js v5 |
| ORM | Prisma v5 |
| Database | PostgreSQL 15 |
| Cache & Queue | Redis 7 (ioredis) + BullMQ |
| Validation | Zod v4 |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Testing | Jest + ts-jest |
| Documentation | Swagger (swagger-jsdoc + swagger-ui-express) |
| Queue Dashboard | Bull Board (@bull-board/api + @bull-board/express) |
| Rate Limiting | express-rate-limit + rate-limit-redis |
| Containerization | Docker + Docker Compose |
| Deployment | Railway |

---

## Architecture

Strict **5-layer architecture** with clear separation of concerns:

```
Request
  → Routes          (endpoint definitions + middleware chain)
  → Controllers     (parse & validate input via Zod)
  → Services        (business logic, orchestration)
  → Repositories    (database queries via Prisma)
  → Prisma/DB
  → Response
```

**Key architectural decisions:**
- Services never call Prisma directly — all DB access goes through repositories
- Centralized error handling with custom error classes (BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError)
- Zod `.parse()` in controllers serves dual purpose: input validation AND unknown field stripping (security layer)
- Express v5 auto-forwards async errors — no try-catch wrappers needed in controllers

---

## Features

### Authentication & Authorization
- JWT-based authentication with Redis token blacklist for logout
- 3-tier role-based access control: `ADMIN`, `WAREHOUSE_STAFF`, `DRIVER`
- Privilege escalation defense: role field stripped from update schemas via Zod parse

### Background Jobs (BullMQ)
- **Event-driven:** Contract fulfillment auto-updates when deliveries complete (BULOG orders)
- **Scheduled (Cron):** Expired contract auto-completion runs daily at 00:00 WIB (17:00 UTC)
- Bull Board dashboard at `/admin/queues` for visual job monitoring

### Advanced API Features
- **Cursor-based pagination** on all 12 list endpoints (constant performance, no offset scanning)
- **Redis-backed rate limiting** — global (100 req/15min) + auth-specific (10 req/15min for login)
- **API versioning** via `/api/v1` prefix with grouped router
- **Swagger/OpenAPI 3.0** documentation for all 48 endpoints

### Data Integrity
- Prisma interactive transactions (`$transaction`) for atomic multi-table operations
- Stock upsert with `@@unique([warehouseId, productId])` and `increment` operator
- Final-state guards preventing invalid status transitions
- P2002 race condition handling for unique constraint violations

---

## Database Schema

**15 entities** with complex relationships:

```
BULOG Flow:
Contract → ProcurementOrder → RawMaterial (auto) → ProductionOrder → Stock (auto) → SalesOrder → Delivery

Non-BULOG Flow:
SalesOrder (stock decrement via transaction) → Delivery

Milling Service:
MillingJob (standalone — no relations to other entities)
```

### Key Entities

| Entity | Description |
|---|---|
| User | System users with role-based access (ADMIN, WAREHOUSE_STAFF, DRIVER) |
| Supplier | Rice suppliers from 4 designated regions |
| Contract | BULOG procurement contracts with fulfillment tracking |
| ProcurementOrder | Raw material purchases from suppliers |
| RawMaterial | Auto-generated when procurement is received |
| Warehouse | Storage facilities with capacity tracking |
| Product | Finished goods (Dua Kurma, Strawberry, ProductBulog) |
| ProductionOrder | Transforms raw materials into products |
| Stock | Auto-managed inventory per warehouse per product |
| SalesOrder | Customer orders (BULOG / Hotel / Retail) |
| Vehicle | Fleet management (Fuso, Colt Diesel, Pickup) |
| Delivery | Shipment tracking with auto-timestamps |
| MillingJob | External milling service with output classification |

### Auto-Generated Data
- **RawMaterial** — created automatically when ProcurementOrder status → `RECEIVED`
- **Stock** — upserted automatically when ProductionOrder status → `COMPLETED`
- **SalesOrder DELIVERED** — set automatically when Delivery status → `DELIVERED`

---

## API Endpoints

**48 endpoints** across **14 modules**. Full interactive documentation at [`/api/docs`](https://inventory-distribution-api-production.up.railway.app/api/docs).

| Module | Endpoints | Operations |
|---|---|---|
| Auth | 3 | Register (admin-only), Login, Logout |
| Profiles | 3 | Get, Update, Delete (self or admin) |
| Suppliers | 5 | Full CRUD with phone uniqueness |
| Products | 5 | Full CRUD with stock existence check |
| Warehouses | 5 | Full CRUD with relation guards |
| Contracts | 4 | Create, Update status, List, Detail |
| Procurement Orders | 4 | Create, Update status (→ auto RawMaterial), List, Detail |
| Raw Materials | 2 | Read-only (auto-generated) |
| Production Orders | 4 | Create (→ decrement raw material), Update status (→ auto Stock), List, Detail |
| Stocks | 2 | Read-only (auto-managed) |
| Vehicles | 5 | Full CRUD with delivery history guards |
| Milling Jobs | 4 | Create (auto-status), Update status, List, Detail |
| Sales Orders | 4 | Create (→ atomic stock decrement), Update status, List, Detail |
| Deliveries | 4 | Create (→ capacity validation), Update status (→ auto timestamps), List, Detail |

---

## Business Logic Highlights

These decisions are grounded in real UD Barokah operations:

- **No cancellation on Sales Orders** — In the rice distribution business, once an order is placed, it will be fulfilled. The `CANCELLED` status was intentionally removed from the enum.
- **Auto-status on Production/Milling create** — Only one machine exists. If no job is active, the new order starts immediately (`IN_PROGRESS`). Otherwise, it queues (`PENDING`).
- **Milling Job CANCELLED only from PENDING** — Once rice is in the machine (`IN_PROGRESS`), it cannot be cancelled. The material is already being processed.
- **Delivery PENDING state** — 30% of deliveries at UD Barokah are loaded at night for early morning dispatch. `PENDING` represents "loaded, not yet departed."
- **4 supplier regions (enum)** — Kebumen, Ponorogo, Demak, Wonogiri. The company exclusively sources from these regions for quality control.
- **Contract fulfillment tracking** — `fulfilledWeightKg` uses `increment` (not `set`) because one contract spans multiple deliveries over time.

---

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js v20](https://nodejs.org/) (if running outside Docker)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/adinovaindra/inventory-distribution-api.git
cd inventory-distribution-api

# 2. Create environment file
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# 3. Start all services (app + PostgreSQL + Redis)
docker-compose up -d

# 4. Enter the app container
docker-compose exec app sh

# 5. Install dependencies (inside container)
npm install

# 6. Generate Prisma Client
npx prisma generate

# 7. Run database migrations
npx prisma migrate dev

# 8. Build TypeScript
npm run build

# 9. Seed admin user
npx prisma db seed

# 10. Restart to apply changes
exit
docker-compose restart app
```

The API is now running at `http://localhost:3000`. Swagger docs at `http://localhost:3000/api/docs`.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@db:5432/dbname` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379` |
| `JWT_SECRET` | JWT signing secret (min 10 chars) | `your-secret-key-here` |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |

---

## Project Structure

```
src/
├── index.ts                 # Entry point (app.listen + worker import)
├── app.ts                   # Express setup (middleware, routes, error handler)
├── seed.ts                  # Database seed script (admin user)
├── config/
│   ├── database.ts          # Prisma client singleton
│   ├── redis.ts             # ioredis client + BullMQ connection
│   ├── env.ts               # Zod-validated environment variables
│   ├── swagger.ts           # OpenAPI specification
│   └── bullboard.ts         # Bull Board dashboard setup
├── routes/
│   ├── v1.routes.ts         # v1 router (groups all 14 module routers)
│   ├── auth.routes.ts       # Auth endpoints with @openapi annotations
│   └── ...                  # 14 module route files
├── controllers/             # Request parsing + Zod validation
├── services/                # Business logic + orchestration
├── repositories/            # Database queries via Prisma
├── validators/              # Zod schemas per module
├── middlewares/
│   ├── auth.middleware.ts   # JWT verification + Redis blacklist
│   ├── role.middleware.ts   # authorize() HOF + authorizeSelfOrAdmin
│   ├── ratelimiter.middleware.ts  # Global + auth rate limiters
│   └── error.middleware.ts  # Centralized error handler
├── jobs/
│   ├── queues/              # BullMQ queue definitions
│   ├── workers/             # Queue listeners
│   └── processors/          # Job business logic
├── utils/
│   ├── response.ts          # Standardized response helper
│   ├── error.ts             # Custom error classes
│   ├── jwt.ts               # Token sign/verify utilities
│   ├── pagination.ts        # Cursor-based pagination utilities
│   └── logger.ts            # Logging utility
└── types/
    └── express.d.ts         # Declaration merging for req.user
```

---

## Live URLs

| Service | URL |
|---|---|
| API Base | https://inventory-distribution-api-production.up.railway.app |
| Health Check | https://inventory-distribution-api-production.up.railway.app/health |
| Swagger UI | https://inventory-distribution-api-production.up.railway.app/api/docs |
| Bull Board | https://inventory-distribution-api-production.up.railway.app/admin/queues |

---

## Author

**Adinova Indra Permana**

- GitHub: [@adinovaindra](https://github.com/adinovaindra)
- LinkedIn: [adinova-indra-permana](https://www.linkedin.com/in/adinova-indra-permana)
