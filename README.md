# WITH ME SHOP

A full-stack e-commerce platform with role-based access, a microservices backend, and a space-themed UI — built as a semester project.

**Built by** Amjahdi Walid & Ahaytar Mohamed  
**Faculté des Sciences Semlalia, Marrakech** — Semestre 6 (2025–2026)  
**Course:** JEE & Advanced Software Engineering (design patterns module)

[![GitHub](https://img.shields.io/badge/GitHub-E--com-181717?logo=github)](https://github.com/m-ahaytar/E-com)
[![Live](https://img.shields.io/badge/Live-withmeshop.tech-6c27c0)](https://withmeshop.tech/)

---

## About the Project

There are three kinds of users. Customers browse a catalogue, add products to a cart, place orders, and pay. Sellers create and manage their own products and create deals. Admins manage everything — users, products, orders, categories, and deals. Every action that changes data requires a valid JWT, and each role can only do what is allowed via `@PreAuthorize` annotations on the controller methods.

The original architecture had five separate Spring Boot services (auth, product, order, payment, and an API Gateway) running behind a Spring Cloud Gateway with Redis rate limiting. It worked well locally with Docker Compose. But when we looked at deploying to Railway.app, we hit the free plan's service limit. Running six containers (the gateway needs Redis) plus a frontend would have been too many. So we merged all four business services into a single Spring Boot application — `merged-backend/` — that runs as one JAR on port 8080. Both versions exist in the repo: the original microservices are in `backend/` and work with `docker-compose up`, and `merged-backend/` is what Railway runs.

The frontend was designed around a space and tech theme. We wanted something that did not look like another Bootstrap default. The landing page has a full-screen looping space video with parallax star layers at three depths (0.02x, 0.05x, 0.08x scroll multipliers). Product pages and the catalogue show the star layers without the video. Auth pages, admin panels, and utility pages use a simpler glassmorphism gradient. The color palette is built around deep space blues, purples, and cyan accents, with Orbitron for headings and Rajdhani for body text.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19.2.4 |
| Build tool | Vite 8.0.4 |
| Routing | React Router DOM 6.20.0 |
| UI | Bootstrap 5.3.0, Bootstrap Icons 1.13.1 |
| Backend framework | Spring Boot 3.2.0 |
| Security | Spring Security, jjwt 0.12.3 (HMAC-SHA256) |
| Persistence | Spring Data JPA, Hibernate (SQLiteDialect) |
| Database | SQLite 3.45.3.0 (via Xerial JDBC + Hibernate Community Dialects) |
| Code generation | Lombok |
| API Gateway | Spring Cloud Gateway + Redis 7-alpine |
| Containerization | Docker, Docker Compose |
| Frontend server | nginx (SPA fallback configuration) |
| CI/CD | GitHub Actions |
| Deployment | Railway.app |
| Languages | Java 17, Node 20, Maven |

---

## Architecture

### Local Development (full Docker Compose)

```
                    ┌──────────────────────────────────────────────────────┐
                    │                   Browser :3000                       │
                    └──────────────────────┬───────────────────────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  frontend    │
                                    │  nginx :80   │
                                    └──────┬──────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │              API Gateway :8085                │
                    └──┬──────────┬──────────┬──────────┬──────────┘
                       │          │          │          │
                 ┌─────▼──────┐ ┌─▼──────┐ ┌─▼────────┐ ┌▼───────────┐
                 │ auth-svc   │ │product │ │order-svc │ │payment-svc │
                 │ :8081      │ │:8082   │ │:8083     │ │:8084       │
                 │ auth.db    │ │prod.db │ │order.db  │ │payment.db  │
                 └────────────┘ └────────┘ └────┬──────┘ └────────────┘
                                                │
                                          ┌─────▼─────┐
                                          │   Redis   │
                                          │   :6379   │
                                          └───────────┘
```

Each service has its own SQLite file. The gateway routes requests by path prefix (`/auth/**` → auth-service:8081, `/products/**` → product-service:8082, etc.) and applies Redis-backed rate limiting on `/auth/**` (10 requests per second replenish, 20 burst).

### Railway (deployed)

```
                    ┌──────────────────────────────────────┐
                    │           Browser                     │
                    └────────────────┬─────────────────────┘
                                     │
                              ┌──────▼──────┐
                              │   frontend   │
                              │ nginx :80    │
                              │ Railway svc  │
                              └──────┬───────┘
                                     │
                              ┌──────▼──────────┐
                              │ merged-backend   │
                              │ :8080 (one JAR)  │
                              │ ecommerce.db     │
                              │ Railway svc      │
                              └─────────────────┘
```

Why merge? Railway's free tier caps the number of running services. Running the original stack (auth, product, order, payment, gateway, Redis, frontend) would have required seven services. By merging the four business services into one JAR, we brought it down to two: `merged-backend` and `frontend`. The original microservices stay in `backend/` for local development and CI testing.

---

## Design Patterns

We implemented 13 distinct pattern applications across three services. Each one solves a concrete problem we actually had while building the application.

### Behavioral

**Strategy** — `payment-service` — `DiscountStrategy`, `PercentageDiscountStrategy`, `FixedAmountDiscountStrategy`, `NoDiscountStrategy`

Order totals need different discount calculations depending on the active promotion. A promotion might give 10% off, or a fixed €5 off, or nothing. Instead of writing an if-else chain in `PaymentService`, we defined a `DiscountStrategy` interface with `calculateDiscount(amount)` and swapped implementations at runtime. The test suite explicitly demonstrates switching from percentage to fixed to no discount without changing the service code.

**Strategy** — `payment-service` — `PaymentStatusStrategy`, `CardPaymentStatusStrategy`, `CashPaymentStatusStrategy`

Payment status depends on the method. Card payments resolve to `COMPLETED` immediately; cash on delivery resolves to `PENDING`. Both strategies share the same `resolveStatus()` interface, and a factory (`PaymentStrategyFactory` in `pattern/factory/`) picks the right one based on the method string. This keeps payment status logic out of the controller and service.

**Observer** — `order-service` — `OrderEventObserver`

When an order changes state — created, paid, shipped — other parts of the system might need to react (send a notification, update inventory, log an analytics event). The `OrderEventObserver` interface with `onOrderEvent(eventType, orderId)` lets listeners register without the order service knowing who they are. We defined the interface; implementations are left as extension points.

### Structural

**Decorator** — `order-service` — `OrderCalculator`, `BaseOrderCalculator`, `OrderCalculatorDecorator`, `TaxDecorator`, `ShippingDecorator`, `DiscountDecorator`

Order totals are not just item prices. Tax, shipping fees, and discounts stack on top. With inheritance you would need a class for every combination (`TaxAndShipping`, `TaxAndShippingAndDiscount`, etc.). With the decorator pattern, you start with a `BaseOrderCalculator(subtotal)` and wrap it with whatever you need: `new DiscountDecorator(new ShippingDecorator(new TaxDecorator(base, 0.10), 5.0), 10.0)`. Order matters — applying discount before tax gives a different result than after, and we tested both paths explicitly.

**Decorator** — `payment-service` — `PaymentProcessor`, `PaymentAuditDecorator`

Every payment processed should leave an audit trail. The `PaymentAuditDecorator` wraps any `PaymentProcessor` and prints `[PAYMENT-AUDIT]` messages before and after processing, with the order ID and timestamp. The core payment logic does not change; the decorator adds the logging at the wrapping point.

**Facade** — `product-service` — `ProductDetailFacade`

The product detail page needs data from three repositories: product, category, and deal. A product belongs to a category (name, ID), and may have an active deal (discount percentage, dates). Without the facade, the controller would orchestrate all three repositories, compute discounted prices, and handle null categories and missing deals. The facade provides one method — `getProductDetails(productId)` — and returns a Java record with 12 fields including computed discount, stock availability, and available regions.

**Facade** — `order-service` — `OrderProcessingFacade`

Creating an order involves validating input, generating a unique order number (`ORD-{epoch}-{UUID-prefix}`), constructing the `Order` entity with its items, computing the total, persisting, and converting back to a DTO. The facade wraps this entire workflow behind `createOrderWithDetails(userId, items)`. The controller calls one method instead of orchestrating five steps.

**Adapter** — `payment-service` — `PaymentRequestAdapterByComposition`, `PaymentRequestAdapterByInheritance`

The incoming `PaymentRequest` DTO and the persisted `Payment` entity have different structures. We implemented both adapter variants: by composition (wraps `PaymentRequest`, exposes `toPayment(status)` that maps fields to a `Payment`) and by inheritance (extends `PaymentRequest`, adds `toSafeMethod()` that defaults null methods to `"CASH"`). Having both variants side by side was deliberate — comparing composition vs inheritance for the same problem was part of the course.

**Proxy** — `payment-service` — `PaymentRepositoryProxy`

Every interaction with payment data goes through `PaymentRepositoryProxy`, which wraps `PaymentRepository` and delegates `save`, `findAll`, `findById`, `findByOrderId`, `existsById`, and `deleteById`. The proxy layer does nothing extra right now — it delegates directly — but the structure is in place to add caching, access logging, or validation later without changing any callers.

### Creational

**Builder** — `order-service` — `OrderBuilder`

An `Order` has a userId, status, date, a list of items, and a computed totalAmount. A constructor with five parameters would be hard to read and easy to mix up. `OrderBuilder` provides fluent methods — `withUserId()`, `withStatus()`, `withCreatedAt()`, `withItems()` — and computes `totalAmount` incrementally as items are added.

**Factory Method** — `order-service` — `OrderStatusFactory`

Order status transitions follow business rules: `PENDING → PROCESSING → SHIPPED → DELIVERED`, with `CANCELLED` as a terminal state. `OrderStatusFactory.createUpdatedStatus(current)` encodes these transitions in one class. If the rules change — for example, adding a `RETURNED` state — only the factory changes. The test does not need to know about individual status strings.

**Factory Method** — `payment-service` — `PaymentStrategyFactory` (in `pattern/factory/`)

The payment service needs to select the right payment status strategy based on the method string. `CARD`, `CREDIT_CARD`, and `DEBIT_CARD` all map to `CardPaymentStatusStrategy`; everything else maps to `CashPaymentStatusStrategy`. The factory centralizes this mapping so the service never sees a switch statement.

**Singleton** — `order-service` — `OrderClockSingleton`

A single `static final INSTANCE` with `getInstance().now()` returning `LocalDateTime.now()`. This is a textbook Singleton — one instance, private constructor, static accessor. It exists alongside Spring's own singleton-scoped beans to show that the pattern is still valid outside of DI containers.

---

## API Endpoints

### Auth Service

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/auth/register` | No | — | Register (CUSTOMER or SELLER only) |
| POST | `/auth/login` | No | — | Login, returns JWT |
| GET | `/users` | Yes | ADMIN | List all users |
| PUT | `/users/{id}` | Yes | ADMIN | Update user (role, first name, last name) |
| DELETE | `/users/{id}` | Yes | ADMIN | Delete user |

### Product Service

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/products` | No | — | List products (optional: `categoryId`, `sellerEmail`) |
| GET | `/products/{id}` | No | — | Get product by ID |
| POST | `/products` | Yes | SELLER, ADMIN | Create product |
| PUT | `/products/{id}` | Yes | SELLER, ADMIN | Update product |
| DELETE | `/products/{id}` | Yes | ADMIN | Delete product |
| PATCH | `/products/{id}/decrease-stock` | Yes | SERVICE, ADMIN | Decrease stock by quantity |
| GET | `/categories` | No | — | List all categories |
| GET | `/categories/{id}` | No | — | Get category by ID |
| POST | `/categories` | No | — | Create category |
| PUT | `/categories/{id}` | No | — | Update category |
| DELETE | `/categories/{id}` | No | — | Delete category |
| GET | `/deals` | No | — | Get active deals only (filtered by date) |
| GET | `/deals/all` | Yes | ADMIN | Get all deals (including expired) |
| GET | `/deals/{id}` | No | — | Get deal by ID |
| POST | `/deals` | Yes | SELLER, ADMIN | Create deal |
| PUT | `/deals/{id}` | Yes | SELLER, ADMIN | Update deal |
| DELETE | `/deals/{id}` | Yes | SELLER, ADMIN | Delete deal |

### Order Service

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/orders` | Yes | CUSTOMER | Create order |
| GET | `/orders` | Yes | ADMIN | Get all orders |
| GET | `/orders/{id}` | Yes | CUSTOMER, ADMIN | Get order by ID |
| GET | `/orders/user/{userId}` | Yes | CUSTOMER, ADMIN | Get orders by user ID |
| GET | `/orders/by-products` | Yes | SELLER, ADMIN | Get orders containing given product IDs |
| PUT | `/orders/{id}` | Yes | ADMIN | Update order |
| DELETE | `/orders/{id}` | Yes | ADMIN | Delete order |
| PATCH | `/orders/{id}/status` | Yes | SERVICE, ADMIN | Update order status |
| GET | `/cart` | Yes | authenticated | Get cart (keyed by user email from JWT) |
| POST | `/cart/items` | Yes | authenticated | Add item to cart |
| PUT | `/cart/items/{productId}` | Yes | authenticated | Update item quantity |
| DELETE | `/cart/items/{productId}` | Yes | authenticated | Remove item from cart |
| DELETE | `/cart` | Yes | authenticated | Clear cart |

Cart endpoints require a valid JWT but do not use `@PreAuthorize` — they use `Authentication.getName()` from `SecurityContextHolder` to key the cart per user.

### Payment Service

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments/process` | No | Process a payment |
| GET | `/payments` | No | List all payments |
| GET | `/payments/{id}` | No | Get payment by ID |
| GET | `/payments/order/{orderId}` | No | Get payment by order ID |
| PUT | `/payments/{id}` | No | Update payment |
| DELETE | `/payments/{id}` | No | Delete payment |

---

## Roles & Access Control

| Role | Capabilities |
|------|-------------|
| Public (unauthenticated) | Browse products, categories, deals; view product detail; register an account |
| CUSTOMER | Everything public + place orders, view own orders, manage cart, checkout and pay |
| SELLER | Everything public + create and edit own products, create and edit deals, view orders containing own products |
| ADMIN | Full access: manage all users, products, orders, categories, and deals; delete any resource |

**JWT flow:**

1. `POST /auth/login` with email + password returns a JWT token in the response body. The token is signed with HMAC-SHA256 and contains `subject=email` and a custom `role` claim.
2. The frontend stores the token in `localStorage` (handled by `AuthContext`).
3. Every API call attaches an `Authorization: Bearer <token>` header (the `api.js` service does this automatically).
4. The `JwtFilter` (inner class of `SecurityConfig`) intercepts every request, validates the HMAC-SHA256 signature using the `JWT_SECRET` (must be at least 32 characters), parses the `role` claim, and sets a `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`. Controller methods use `@PreAuthorize("hasRole('ADMIN')")` etc. to enforce access.

---

## Getting Started

### Prerequisites

- Docker & Docker Compose (for the full local stack)
- Java 17 + Maven (for individual backend development)
- Node 20 + npm (for frontend development)

### Quick Start (Docker Compose — recommended)

```bash
# Clone and enter the project
git clone https://github.com/m-ahaytar/E-com.git
cd E-com

# Create a .env file with a JWT secret (minimum 32 characters)
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env

# Start everything
./start.sh
```

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8085

### Frontend Dev Server (with HMR)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
# Set VITE_API_URL in your environment or edit frontend/src/config.js
```

### Single Backend Service

```bash
# For example, run only the product service
cd backend/product-service
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DJWT_SECRET=your-secret-key-32-chars-long-min"
```

### Run Tests

```bash
# Test one service
cd backend/auth-service && mvn clean test

# Test all five microservices
for s in auth-service product-service order-service payment-service api-gateway; do
  (cd backend/$s && mvn clean test) || echo "$s failed"
done
```

---

## Test Credentials

These accounts are seeded automatically on the first startup by `UserDataSeeder`. All use BCrypt-encoded passwords.

| Role | Email | Password |
|------|-------|----------|
| ADMIN | `admin@demo.com` | `Admin@123456` |
| CUSTOMER | `customer@demo.com` | `Customer@123456` |
| SELLER | `seller@demo.com` | `Seller@123456` |

You can register new accounts via `POST /auth/register`, but self-registration as ADMIN is blocked at the API level (returns 403 Forbidden).

---

## Environment Variables

| Variable | Required | Default | Used by | Description |
|----------|----------|---------|---------|-------------|
| `JWT_SECRET` | Yes | — | All backend services | HMAC-SHA256 signing key, minimum 32 characters |
| `JWT_EXPIRATION` | No | `86400000` | All backend services | Token lifetime in milliseconds (24 hours) |
| `SQLITE_DB_PATH` | No | `{service}.db / ecommerce.db` | Backend services | SQLite database file path |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:3000` | merged-backend | Allowed frontend origin (set to Railway frontend URL in production) |
| `PORT` | No | `8080` | merged-backend | Server port (set automatically by Railway) |
| `VITE_API_URL` | No | `http://localhost:8080` | Frontend build | API base URL (set to Railway merged-backend URL in production) |

---

## CI/CD

The GitHub Actions pipeline (`ci-cd.yml`) runs four jobs:

1. **test-backend** — Matrix strategy across all five microservices (`api-gateway`, `auth-service`, `product-service`, `order-service`, `payment-service`). Each runs `mvn clean test` with a test JWT secret. JaCoCo coverage reports are uploaded as build artifacts (retention: 30 days).
2. **test-frontend** — Installs npm dependencies, runs ESLint, then builds with Vite.
3. **build-merged-backend** — Runs `mvn clean package -DskipTests` in `merged-backend/` to verify the unified JAR compiles.
4. **docker-build** — Only on push to `master` (not on pull requests). Depends on all previous jobs succeeding. Runs `docker compose build` to verify all Docker images build correctly.

---

## Deployment (Railway)

The live app is at **[withmeshop.tech](https://withmeshop.tech/)**.

We deploy two services on Railway, both pointing at the `master` branch of this repo:

- **merged-backend** — Root directory: `merged-backend/`. Railway builds and runs the single Spring Boot JAR. Port is injected via `$PORT`.
- **frontend** — Root directory: `frontend/`. Railway runs the multi-stage Docker build (Node → nginx). The `VITE_API_URL` build arg is set to the merged-backend Railway URL so the frontend knows where to send API calls.

The custom domain `withmeshop.tech` is configured in Railway's settings and points to the frontend service.

**Why merged-backend exists:** The original repo has five Spring Boot services (`auth`, `product`, `order`, `payment`, `api-gateway`) plus Redis — seven containers total. Railway's free tier doesn't allow that many services. We merged the four business services into one JAR (`merged-backend/`) so Railway only needs to run two services. The original microservices in `backend/` still work locally via Docker Compose and are still tested in CI.

**Environment variables to set in Railway:**

| Service | Variable | Value |
|---------|----------|-------|
| merged-backend | `JWT_SECRET` | Any string ≥ 32 characters |
| merged-backend | `CORS_ALLOWED_ORIGINS` | `https://withmeshop.tech` |
| merged-backend | `SQLITE_DB_PATH` | `ecommerce.db` (or any writable path) |
| frontend | `VITE_API_URL` | Railway public URL of merged-backend |

---

## Project Structure

```
E-com/
├── backend/                    # Original microservices (local Docker Compose)
│   ├── api-gateway/            # Spring Cloud Gateway + Redis rate limiting
│   ├── auth-service/           # JWT auth, user management
│   ├── product-service/        # Products, categories, deals
│   ├── order-service/          # Orders, cart, order processing
│   └── payment-service/        # Payment processing (mock)
├── merged-backend/             # Single JAR (all 4 services merged) — Railway deployment
├── frontend/                   # React 19 + Vite, served by nginx in production
├── .github/workflows/          # CI/CD pipeline
├── docker-compose.yml          # Full local stack definition
├── start.sh                    # Startup script with .env validation
└── .env.example                # Environment variable template
```

---

## What We Learned

- The JPA and REST API design taught in the course maps directly to building real backend services. Merging four `@SpringBootApplication` classes into one JAR taught us about component scanning collisions — Spring does not auto-exclude nested applications, so we had to manually delete the extra entry points and resolve duplicate bean definitions.
- SQLite is not natively supported by Hibernate. We had to use `hibernate-community-dialects` with `SQLiteDialect` and the Xerial JDBC driver. Quirks include limited `GenerationType.IDENTITY` support and no constraint enforcement — worth knowing for student projects where PostgreSQL would be overkill.
- Spring Cloud Gateway rate limiting with Redis is well-documented but the `RequestRateLimiter` filter configuration is fragile. The `key-resolver` bean name must match exactly, and the replenish/burst rates are per-second, not per-minute.
- The space/tech UI was the most fun part. We used custom CSS variables, glassmorphism with `backdrop-filter`, and a parallax star layer rendered with CSS transforms driven by `requestAnimationFrame`. The `SpaceBackground` component has three modes depending on the route — immersive (video + stars), functional (stars only), and utility (gradient only) — to keep performance reasonable on the landing page.

---

## Acknowledgments

Built for the JEE and advanced design patterns module at Faculté des Sciences Semlalia, Marrakech. The project gave us a chance to apply patterns we studied (Strategy, Decorator, Facade, Builder, Factory, Observer, Singleton, Adapter, Proxy) to a real codebase with tests, CI, and deployment.
