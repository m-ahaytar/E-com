# E-Commerce Microservices Project (WITH ME SHOP)

A **next-generation e-commerce platform** built with microservices architecture, Spring Cloud Gateway, and React. Features a futuristic dark UI, dynamic product catalog, real-time cart synchronization, and multi-role user system.

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Java 17+ (for local backend development)

### Run the Full Stack with Docker

```bash
docker-compose up --build
```

- **Frontend** (React): http://localhost:3000
- **API Gateway**: http://localhost:8085
- **Services** communicate internally via docker network

### Run Individual Services Locally

```bash
# Terminal 1: Start all Docker services
docker-compose up -d api-gateway auth-service product-service order-service payment-service

# Terminal 2: Frontend (React dev server)
cd frontend
npm install
npm run dev

# Terminal 3: Local backend service (e.g., product-service)
cd backend/product-service
mvn spring-boot:run
```

---

## Project Overview

**WITH ME SHOP** is a full-stack e-commerce platform showcasing:

- **Microservices architecture** with API Gateway routing
- **Real-time cart synchronization** via React Context + REST API
- **Dynamic categories & products** fetched from backend
- **Multi-role authentication** (Customer, Seller, Admin)
- **Secure JWT-based auth** with SQLite persistence per service
- **Responsive futuristic UI** with Orbitron fonts, cyan/neon styling
- **Production-ready Docker deployment**

---

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│            Port 3000 (nginx serving dist/)          │
└────────────┬────────────────────────────────────────┘
             │ HTTP/JSON
             ▼
┌─────────────────────────────────────────────────────┐
│          API Gateway (Spring Cloud Gateway)         │
│                  Port 8085 (8080 internal)          │
│         Routes all /auth, /products, /orders,       │
│         /cart, /categories, /payments requests      │
└──┬──────────┬──────────────┬──────────────┬─────────┘
   │          │              │              │
   ▼          ▼              ▼              ▼
Auth      Product       Order/Cart        Payment
Service   Service       Service           Service
8081      8082          8083              8084
│         │             │                 │
└─────────┴─────────────┴─────────────────┘
          ↓
   SQLite Databases
   (per service)
```

### Services

#### 1. **Auth Service** (Port 8081)

- User registration & login
- JWT token generation & validation
- User role management (CUSTOMER, SELLER, ADMIN)
- Endpoints: `/auth/login`, `/auth/register`
- Database: `auth-service.db` (SQLite, users table)

#### 2. **Product Service** (Port 8082)

- Product & category CRUD
- Product search & filtering
- Dynamic category list
- Endpoints: `/products`, `/categories`
- Database: `product-service.db` (SQLite, categories & products tables)

#### 3. **Order Service** (Port 8083)

- **Cart management** (session-based in-memory state)
- Order creation from cart items
- Order history & status tracking
- Endpoints: `/cart`, `/orders`
- Database: `order-service.db` (SQLite, orders & order_items tables)

#### 4. **Payment Service** (Port 8084)

- Payment processing (mock implementation)
- Payment status tracking
- Endpoints: `/payments/process`, `/payments/order/{orderId}`
- Database: `payment-service.db` (SQLite, payments table)

#### 5. **API Gateway** (Port 8085 external / 8080 internal)

- Spring Cloud Gateway routes requests to appropriate services
- CORS enabled for `http://localhost:3000` and `http://127.0.0.1:3000`
- Request/response transformation
- Security filter integration

---

## Frontend Architecture

### Technologies

- **React 19** - UI library
- **React Router 6** - client-side routing
- **Vite** - build tool & dev server
- **Bootstrap 5** - component library (CDN)
- **Bootstrap Icons** - icon library
- **Custom fetch wrapper** - HTTP client

### Key Features (Recent Updates)

#### Dynamic Categories

- Fetches categories from `/categories` API endpoint
- Falls back to product data if no categories in API response
- Category tiles & filters on homepage & catalog show live counts
- Implements `buildCategoryOptions()` utility to merge backend data with product inventory

#### Cart State Management

- **CartContext** manages global cart state
- **API Sync**: When user is authenticated, cart operations sync with `/cart` endpoints
- **Local Fallback**: Anonymous users use localStorage (client-only cart)
- **Dual Persistence**: localStorage mirrors cart state at all times for quick reload
- Cart count badge in navbar shows sum of all item quantities
- `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()` methods handle both API & local storage

#### Navbar & Logo

- Logo replaced with local asset `frontend/src/assets/wm-logo.png` (WM design)
- Rendered as `<img className="wm-nav__logo" />` instead of text
- "WITH ME SHOP" text + tagline displayed next to logo
- Cart icon badge shows total items (sum of quantities, not cart length)
- Role-based navigation: different links for CUSTOMER, SELLER, ADMIN

#### API Base URL Configuration

- Centralized in `frontend/src/config.js`
- Reads from environment variable `VITE_API_URL` (set in docker-compose or .env)
- Falls back to `http://localhost:8085` for local development
- All API calls route through single gateway (no hardcoded service URLs)

### Pages

| Page             | Route               | Auth            | Purpose                                                 |
| ---------------- | ------------------- | --------------- | ------------------------------------------------------- |
| Landing          | `/`                 | None            | Hero, featured products, category showcase              |
| Catalogue        | `/catalogue`        | None            | Search, filter, sort products; browse by category       |
| Product          | `/product/:id`      | None            | Product detail, add to cart, stock info                 |
| Cart             | `/cart`             | None            | View cart items, adjust quantities, proceed to checkout |
| Payment          | `/payment`          | Auth            | Checkout form, delivery details, payment method         |
| Thank You        | `/thank-you`        | Auth            | Order confirmation, next steps                          |
| Login            | `/login`            | None            | Email + password login                                  |
| Register         | `/register`         | None            | Sign up with role selection                             |
| Dashboard        | `/dashboard`        | Auth (CUSTOMER) | Customer orders & account                               |
| Seller           | `/seller`           | Auth (SELLER)   | Seller product management                               |
| Admin            | `/admin`            | Auth (ADMIN)    | Dashboard with stats                                    |
| Admin Products   | `/admin/products`   | Auth (ADMIN)    | Manage all products                                     |
| Admin Categories | `/admin/categories` | Auth (ADMIN)    | Manage categories                                       |
| Admin Orders     | `/admin/orders`     | Auth (ADMIN)    | View all orders                                         |
| Admin Users      | `/admin/users`      | Auth (ADMIN)    | Manage users                                            |

### Context Providers

#### AuthContext

```javascript
{
  user: { id, email, username, firstName, lastName, role },
  token: "JWT token string",
  role: "CUSTOMER|SELLER|ADMIN",
  login(userData, authToken),
  logout()
}
```

#### CartContext

```javascript
{
  items: [{id, productId, name, price, quantity, stock, imageUrl, categoryId}],
  addToCart(product, quantity),
  removeFromCart(productId),
  updateQuantity(productId, quantity),
  clearCart(),
  getTotal() => number
}
```

### Service Layer

#### config.js

```javascript
// Centralized API config
export const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8085";
```

#### api.js

```javascript
export const request(endpoint, options) // Core fetch wrapper
export const get(endpoint)
export const post(endpoint, body)
export const put(endpoint, body)
export const del(endpoint)
```

- Automatically adds JWT Bearer token from localStorage
- Handles 401 responses (redirects to /login)
- Centralized error handling

#### productService.js

```javascript
getProducts();
getProduct(id);
createProduct(productData);
updateProduct(id, productData);
deleteProduct(id);
getCategories(); // NEW: Dynamic categories from backend
createCategory(categoryData);
updateCategory(id, categoryData);
deleteCategory(id);
```

#### orderService.js

```javascript
// Order endpoints
createOrder(orderData);
getUserOrders(userId);
getOrder(id);

// NEW: Cart endpoints (API sync)
getCart();
addCartItem(itemData);
updateCartItem(productId, quantity);
removeCartItem(productId);
clearCartItems();
```

#### authService.js

```javascript
login(email, password); // Returns { token, user }
register(userData); // Returns { token, user }
```

#### paymentService.js

```javascript
processPayment(paymentData);
getPaymentByOrder(orderId);
```

---

## Backend Architecture

### Setup

Each service is a **Spring Boot microservice** with:

- **Spring Web** - REST controllers
- **Spring Security** - JWT authentication
- **Spring Data JPA** - SQLite ORM
- **SQLite** - Embedded database (per service)
- **Lombok** - Boilerplate reduction
- **JSON Web Token (JJWT)** - JWT handling

### Database Strategy

Each service has its own SQLite database (decoupled storage):

- `auth-service.db` - Users, roles
- `product-service.db` - Categories, products
- `order-service.db` - Orders, order items, (cart session state in-memory)
- `payment-service.db` - Payments

Data shared between services via REST APIs (synchronous calls).

### Service Details

#### Auth Service Structure

```
com.ecommerce.auth/
├── AuthServiceApplication.java      # Spring Boot entry
├── SecurityConfig.java              # JWT filter, CORS
├── controller/AuthController.java   # /auth/login, /auth/register
├── service/AuthService.java         # Business logic
├── entity/User.java                 # @Entity with JPA
├── dto/
│   ├── LoginDTO.java
│   ├── RegisterDTO.java
│   └── UserDTO.java
└── repository/UserRepository.java   # JPA repository
```

#### Product Service Structure

```
com.ecommerce.product/
├── ProductServiceApplication.java
├── SecurityConfig.java
├── controller/
│   ├── ProductController.java       # /products endpoints
│   └── CategoryController.java      # /categories endpoints
├── service/
│   ├── ProductService.java
│   └── CategoryService.java
├── entity/
│   ├── Product.java
│   └── Category.java
├── dto/
│   ├── ProductDTO.java
│   ├── ProductCreateDTO.java
│   └── CategoryDTO.java
└── repository/
    ├── ProductRepository.java
    └── CategoryRepository.java
```

#### Order Service Structure

```
com.ecommerce.order/
├── OrderServiceApplication.java
├── SecurityConfig.java              # JWT filter
├── controller/
│   ├── OrderController.java         # /orders endpoints
│   └── CartController.java          # /cart endpoints (NEW)
├── service/
│   ├── OrderService.java
│   └── CartService.java             # In-memory session carts (ConcurrentHashMap)
├── facade/
│   ├── OrderFacade.java
│   └── OrderProcessingFacade.java
├── entity/
│   ├── Order.java
│   └── OrderItem.java
├── dto/
│   ├── OrderDTO.java
│   ├── CreateOrderDTO.java
│   ├── CartDTO.java                 # NEW
│   └── CartItemDTO.java             # NEW
└── repository/OrderRepository.java
```

#### Payment Service Structure

```
com.ecommerce.payment/
├── PaymentServiceApplication.java
├── SecurityConfig.java
├── controller/PaymentController.java # /payments endpoints
├── service/PaymentService.java
├── entity/Payment.java
├── dto/PaymentDTO.java
└── repository/PaymentRepository.java
```

### API Endpoints

#### Auth Service

```
POST   /auth/login                  # { email, password } → { token, user }
POST   /auth/register               # { email, password, firstName, lastName, role } → { token, user }
```

#### Product Service

```
GET    /products                    # List all products
GET    /products/{id}               # Get product by ID
POST   /products                    # Create product (SELLER/ADMIN)
PUT    /products/{id}               # Update product (SELLER/ADMIN)
DELETE /products/{id}               # Delete product (ADMIN)

GET    /categories                  # List all categories
GET    /categories/{id}             # Get category by ID
POST   /categories                  # Create category
PUT    /categories/{id}             # Update category
DELETE /categories/{id}             # Delete category
```

#### Order Service (via Gateway)

```
POST   /orders                      # Create order from cart (CUSTOMER)
GET    /orders                      # List all orders (ADMIN)
GET    /orders/{id}                 # Get order by ID
GET    /orders/user/{userId}        # Get orders by user (CUSTOMER/ADMIN)
PUT    /orders/{id}                 # Update order status (ADMIN)
DELETE /orders/{id}                 # Cancel order (ADMIN)

GET    /cart                        # Get user's cart
POST   /cart/items                  # Add item to cart
PUT    /cart/items/{productId}      # Update item quantity
DELETE /cart/items/{productId}      # Remove item from cart
DELETE /cart                        # Clear entire cart
```

#### Payment Service

```
POST   /payments/process            # { orderId, method, amount } → { success, transactionId }
GET    /payments/order/{orderId}    # Get payment by order ID
```

### Gateway Routing

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://auth-service:8081
          predicates:
            - Path=/auth/**

        - id: product-service
          uri: http://product-service:8082
          predicates:
            - Path=/products/**

        - id: category-service
          uri: http://product-service:8082
          predicates:
            - Path=/categories/**

        - id: order-service
          uri: http://order-service:8083
          predicates:
            - Path=/orders/**

        - id: cart-service
          uri: http://order-service:8083
          predicates:
            - Path=/cart/**

        - id: payment-service
          uri: http://payment-service:8084
          predicates:
            - Path=/payments/**
```

### Security

- **JWT Format**: Bearer token in `Authorization` header
- **Payload**: { sub: email, role: CUSTOMER|SELLER|ADMIN, iat, exp }
- **Secret Key**: Configurable, defaults to `ecom-secret-key-for-jwt-signing-2024-minimum-256-bits`
- **CORS**: Enabled for `http://localhost:3000` and `http://127.0.0.1:3000`
- **Stateless**: Session-less, JWT-only authentication
- **Auth Validation**: Applied to protected endpoints via `@PreAuthorize` annotations

---

## Docker Compose Setup

### Services Defined

```yaml
api-gateway:
  - Port 8085 → 8080 (internal)
  - Depends on: all services
  - Routes traffic to microservices

auth-service:
  - Port 8081
  - SQLite volume: auth-data:/data/auth-service.db

product-service:
  - Port 8082
  - SQLite volume: product-data:/data/product-service.db

order-service:
  - Port 8083
  - SQLite volume: order-data:/data/order-service.db
  - In-memory carts (lost on restart)

payment-service:
  - Port 8084
  - SQLite volume: payment-data:/data/payment-service.db

frontend:
  - Port 3000 (nginx)
  - Build arg: VITE_API_URL=http://localhost:8085
  - Depends on: api-gateway
```

### Network

- All services connected via `ecom-network` (bridge driver)
- Internal DNS: service name (e.g., `http://auth-service:8081`)
- External: http://localhost:PORT

### Volumes

- `auth-data`, `product-data`, `order-data`, `payment-data` - SQLite data persistence

### Build & Run

```bash
# Build all images & start containers
docker-compose up --build

# Background mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f order-service

# Rebuild specific service
docker-compose up -d --build product-service
```

---

## Building & Deployment

### Frontend Build

```bash
cd frontend
npm install
npm run build
# Output: dist/ (static files)
```

The Dockerfile multistage build:

1. Builds React app with Vite
2. Serves `dist/` via nginx on port 3000

### Backend Build

Each service Dockerfile:

1. Multi-stage Maven build (compile → package)
2. Runs JAR with Spring Boot

### Environment Variables

**Frontend** (`docker-compose.yml`):

```yaml
VITE_API_URL: http://localhost:8085
```

**Services** (defaults in code):

```
SQLITE_DB_PATH: /data/{service}-service.db
jwt.secret: ecom-secret-key-for-jwt-signing-2024-minimum-256-bits
```

---

## Development Workflow

### Local Frontend Development

```bash
cd frontend
npm install
npm run dev
# Starts Vite dev server at http://localhost:5173
# Proxies API calls to http://localhost:8085 (configured in vite.config.js)
```

### Local Backend Development

```bash
# Terminal 1: Start services
docker-compose up api-gateway product-service auth-service order-service payment-service

# Terminal 2: Run a single service with hot reload
cd backend/product-service
mvn spring-boot:run
# Overrides docker container if port is same
```

### Database Inspection

SQLite databases are in volumes. To inspect:

```bash
# Connect to a running container
docker exec -it order-service sh

# Then use sqlite3 CLI
sqlite3 /data/order-service.db
> .tables
> SELECT * FROM orders;
> .quit
```

---

## Testing

### Backend Tests

Each service has `src/test/java/com/ecommerce/{service}/` with:

- `*ControllerTest.java` - REST endpoint tests using MockMvc
- `*ServiceTest.java` - Business logic tests using Mockito

Run tests:

```bash
cd backend/product-service
mvn test

# Specific test
mvn test -Dtest=ProductControllerTest
```

### Frontend Testing

Linting:

```bash
cd frontend
npm run lint
```

Build validation:

```bash
npm run build
```

---

## Key Features & Recent Updates

### ✅ Categories (Updated)

- **Before**: Hardcoded in frontend (Gadgets, Phones, Laptops, Accessories)
- **After**: Fetches from `/categories` API endpoint, merges with product data for live counts

### ✅ Cart (Updated)

- **Before**: localStorage only, no backend sync
- **After**:
  - API endpoints for add/update/remove/clear items
  - CartContext syncs with backend when authenticated
  - Falls back to localStorage when offline or unauthenticated
  - Navbar badge shows sum of quantities (not cart length)

### ✅ Logo (Updated)

- **Before**: Text "WM" in white box
- **After**: Image asset (wm-logo.png) + "WITH ME SHOP" text + tagline

### ✅ API Base URL (Updated)

- **Before**: Scattered hardcoded localhost ports (8085, 8080, etc.)
- **After**: Centralized in `frontend/src/config.js`, reads `VITE_API_URL` env var

### ✅ Dark Futuristic UI

- Maintains existing Orbitron fonts, cyan/neon color scheme
- Grid background, glowing elements, smooth transitions
- Responsive design (desktop, tablet, mobile)

---

## User Roles & Permissions

### VISITOR (Not Logged In)

- Browse products & categories
- View product details
- Add items to cart (client-side only)
- Must log in to checkout

### CUSTOMER

- All visitor permissions
- Persistent cart via API
- Place orders
- View order history
- Track order status

### SELLER

- Manage own products
- View product inventory
- Upload product images & details

### ADMIN

- Manage all products & categories
- Manage all users & orders
- View analytics dashboard
- System-wide control

---

## API Flow: Complete Shopping Journey

### 1. User Registration

```
Frontend: POST /auth/register
  { email, password, firstName, lastName, role: "CUSTOMER" }
Backend: Auth Service
  → Creates user, generates JWT
Response: { token, user: { id, email, role } }
Frontend: Stores token & user in localStorage, updates AuthContext
```

### 2. Product Browse

```
Frontend: GET /products
Backend: Product Service
  → Returns all products with category info
Frontend: Filters/searches locally, displays on Catalogue page
```

### 3. Add to Cart

```
Frontend (Authenticated): POST /cart/items
  { productId, quantity, price, productName, ... }
Backend: Order Service
  → Stores in ConcurrentHashMap by username
Response: { items: [...], total: 1234.56 }
Frontend: Updates CartContext, shows success animation
```

### 4. Place Order

```
Frontend: POST /orders
  { userId, items: [{ productId, quantity, price }] }
Backend: Order Service
  → Creates Order & OrderItem entities
  → Clears user's cart
Response: { id, status: "PENDING", orderDate, items }
Frontend: Displays order confirmation
```

### 5. Process Payment

```
Frontend: POST /payments/process
  { orderId, method: "CARD"|"CASH", amount }
Backend: Payment Service
  → Mock validates payment
  → Sets order status to "CONFIRMED"
Response: { success, transactionId, orderId }
Frontend: Displays "Thank You" page with next steps
```

---

## Common Issues & Solutions

### Issue: Cart not persisting after login

**Solution**: Ensure `CartContext` has `useAuth()` dependency. On login, it should sync with `GET /cart` API. Check browser console for 401 errors.

### Issue: Categories showing as undefined

**Solution**: Verify `/categories` API endpoint returns `[{ id, name }, ...]`. Check backend product service is running (`docker-compose logs product-service`).

### Issue: Logo not displaying

**Solution**: Check `frontend/src/assets/wm-logo.png` exists. Verify image import in `Navbar.jsx` is correct. Check browser DevTools Network tab for 404 on image URL.

### Issue: API calls go to wrong port

**Solution**: Verify `VITE_API_URL` environment variable is set in `docker-compose.yml` or `.env`. Check `frontend/src/config.js` logic.

### Issue: 401 Unauthorized on /cart endpoints

**Solution**: Cart endpoints require authentication (JWT token). Ensure user is logged in before testing cart operations. Check `Authorization` header in requests.

### Issue: Services can't communicate

**Solution**: Verify `docker-compose.yml` network is correct. Use service names (e.g., `http://auth-service:8081`) inside containers. Use `localhost` only from host machine.

---

## Project Structure

```
E-com/
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── config.js          # API base URL config (NEW)
│   │   ├── App.jsx            # Root component
│   │   ├── App.css            # Futuristic dark styling
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Logo + cart badge + auth
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── ProductVisual.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx # Global cart + API sync (UPDATED)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CataloguePage.jsx    # Dynamic categories (UPDATED)
│   │   │   ├── ProductPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ... admin pages
│   │   ├── services/
│   │   │   ├── api.js                # HTTP wrapper (UPDATED: uses config.js)
│   │   │   ├── authService.js
│   │   │   ├── productService.js     # Has getCategories() (UPDATED)
│   │   │   ├── orderService.js       # Cart endpoints (NEW)
│   │   │   └── paymentService.js
│   │   ├── utils/
│   │   │   └── productTech.js        # Category utilities (NEW: buildCategoryOptions)
│   │   └── assets/
│   │       ├── wm-logo.png          # Logo image (NEW)
│   │       └── ... other assets
│   ├── Dockerfile              # Multi-stage build, nginx
│   ├── nginx.conf
│   ├── vite.config.js          # Dev proxy setup
│   └── package.json
│
└── backend/
    ├── api-gateway/            # Spring Cloud Gateway
    │   ├── src/
    │   ├── pom.xml
    │   └── Dockerfile
    │
    ├── auth-service/           # User auth & roles
    │   ├── src/main/java/com/ecommerce/auth/
    │   ├── src/resources/application.yml
    │   ├── pom.xml
    │   └── Dockerfile
    │
    ├── product-service/        # Products & categories
    │   ├── src/main/java/com/ecommerce/product/
    │   ├── src/resources/application.yml
    │   ├── src/resources/data.sql  # Sample data
    │   ├── pom.xml
    │   └── Dockerfile
    │
    ├── order-service/          # Orders & cart
    │   ├── src/main/java/com/ecommerce/order/
    │   │   ├── controller/
    │   │   │   ├── OrderController.java
    │   │   │   └── CartController.java (NEW)
    │   │   ├── service/
    │   │   │   ├── OrderService.java
    │   │   │   └── CartService.java (NEW: in-memory carts)
    │   │   ├── entity/
    │   │   │   ├── Order.java
    │   │   │   └── OrderItem.java
    │   │   ├── dto/
    │   │   │   ├── OrderDTO.java
    │   │   │   ├── CartDTO.java (NEW)
    │   │   │   └── CartItemDTO.java (NEW)
    │   │   └── SecurityConfig.java (JWT filter)
    │   ├── src/resources/application.yml
    │   ├── pom.xml
    │   └── Dockerfile
    │
    └── payment-service/        # Payment processing
        ├── src/main/java/com/ecommerce/payment/
        ├── src/resources/application.yml
        ├── pom.xml
        └── Dockerfile
```

---

## Ports Reference

| Service         | Container Port | Host Port | Purpose                   |
| --------------- | -------------- | --------- | ------------------------- |
| Frontend        | 3000           | 3000      | React app (nginx)         |
| API Gateway     | 8080           | 8085      | Reverse proxy to services |
| Auth Service    | 8081           | 8081      | User authentication       |
| Product Service | 8082           | 8082      | Products & categories     |
| Order Service   | 8083           | 8083      | Orders & cart             |
| Payment Service | 8084           | 8084      | Payment processing        |

---

## Troubleshooting & Support

### Useful Commands

```bash
# View all running containers
docker ps

# View logs of service
docker-compose logs -f service-name

# Enter container shell
docker exec -it service-name /bin/bash

# Rebuild & restart service
docker-compose up -d --build service-name

# Clean build (removes volumes)
docker-compose down -v
docker-compose up --build

# Test API endpoint from host
curl http://localhost:8085/products

# Test from inside container
docker exec api-gateway curl http://product-service:8082/products
```

### Debug Frontend API Issues

1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action (add to cart, login, etc.)
4. Check request URL, headers, response
5. Verify `Authorization: Bearer <token>` header is present for protected routes
6. Look for CORS errors (cross-origin requests to http://localhost:8085)

### Debug Backend Issues

1. Check logs: `docker-compose logs -f service-name`
2. Look for JWT validation errors (401 responses)
3. Verify database file exists: `docker exec service-name ls -la /data/`
4. Check if service is listening: `docker exec api-gateway netstat -tuln`

---

## Future Enhancements

- [ ] Add real payment gateway integration (Stripe, PayPal)
- [ ] Implement product reviews & ratings
- [ ] Add inventory management & stock alerts
- [ ] Implement order tracking with real-time notifications
- [ ] Add seller analytics dashboard
- [ ] Implement product recommendations (ML-based)
- [ ] Add wishlist feature
- [ ] Implement advanced search (Elasticsearch)
- [ ] Add email notifications for orders
- [ ] Implement rate limiting & API key management
- [ ] Add GraphQL API alternative to REST
- [ ] Implement multi-language support (i18n)

---

## License

Educational project for microservices & modern web development.

---

## Contributors

- Architecture & Backend: Java/Spring Boot developers
- Frontend: React developers
- DevOps: Docker & Compose setup

---

## Summary

**WITH ME SHOP** is a production-ready microservices e-commerce platform demonstrating:
✅ Microservices architecture with API Gateway  
✅ JWT authentication & authorization  
✅ Real-time cart sync (API + localStorage)  
✅ Dynamic product categories from backend  
✅ Futuristic React UI with dark theme  
✅ Docker Compose multi-container deployment  
✅ SQLite per-service databases  
✅ Comprehensive role-based access control

Start with `docker-compose up --build` and explore the app at `http://localhost:3000`!
