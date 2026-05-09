# WITH ME SHOP — Microservices E-Commerce

**Authors:** Amjahdi Walid & Ahaytar Mohamed

Full-stack e-commerce platform with a React frontend and five Spring Boot microservices behind an API Gateway. Features JWT auth, role-based access (Customer / Seller / Admin), product catalog with deals, cart + orders, and mock payment processing.

---

## Tech Stack & Architecture

| Layer | Components |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router 6, Bootstrap 5, Bootstrap Icons |
| **API Gateway** (port 8085) | Spring Cloud Gateway — all external API calls go here |
| **Auth Service** (port 8081) | Registration, login, JWT issuance |
| **Product Service** (port 8082) | Products, categories, deals |
| **Order Service** (port 8083) | Orders, cart (in-memory) |
| **Payment Service** (port 8084) | Mock payment processing |
| **Database** | SQLite per service (embedded, file-based) |
| **Infra** | Docker Compose, nginx, GitHub Actions CI/CD |

```
User → http://localhost:3000 (React / nginx)
                        ↓
              API Gateway :8085
            ↙    ↓    ↓    ↓    ↘
        Auth  Prod  Order  Pay   (SQLite per service)
```

---

## Getting Started (Run Locally)

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for frontend dev)
- Java 17+ (for backend dev, optional)

### Quick start (full stack)

```bash
./start.sh
```

The script copies `.env.example` → `.env` on first run, then exits so you can edit the secret. Run it again to build and start all containers.

```bash
# One-liner alternative
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
docker compose up --build
```

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8085

### Run services individually

```bash
# Backend services in Docker
docker compose up -d api-gateway auth-service product-service order-service payment-service

# Frontend (Vite dev server with HMR)
cd frontend
npm install
npm run dev       # → http://localhost:5173

# Single backend service locally (e.g. product-service)
cd backend/product-service
mvn spring-boot:run
```

### Run tests

```bash
# Single service
cd backend/product-service && mvn clean test

# All services
for s in api-gateway auth-service order-service payment-service product-service; do
  cd backend/$s && mvn clean test && cd ../..
done
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | — | HMAC-SHA key, min 32 characters |
| `JWT_EXPIRATION` | No | `86400000` | Token lifetime in ms (24h) |
| `VITE_API_URL` | No | `http://localhost:8085` | API base URL for frontend |
| `SQLITE_DB_PATH` | No | `{service}.db` | SQLite file path per service |

---

## Test Credentials

No users are pre-seeded. Register via the UI at http://localhost:3000/register.

Recommended accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `Admin@123456` |
| Customer | `customer@demo.com` | `Customer@123456` |
| Seller | `seller@demo.com` | `Seller@123456` |

---

## System Design Highlights

- **Strategy Pattern** — `DiscountStrategy` in payment-service: swappable discount algorithms (`PercentageDiscountStrategy`, `FixedAmountDiscountStrategy`, `NoDiscountStrategy`).
- **Decorator Pattern** — `OrderCalculator` in order-service: stackable decorators (`TaxDecorator`, `ShippingDecorator`, `DiscountDecorator`) wrap a base calculator to compose order totals.
- **Facade Pattern** — `ProductDetailFacade` in product-service: single method aggregates product info, active deal, and category from three sources into one response.

---

*Built with Spring Boot 3.2, React 19, and Docker Compose.*
