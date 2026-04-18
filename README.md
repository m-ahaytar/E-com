# E-Commerce Microservices Project

A complete full-stack e-commerce website built with microservices architecture.

## Quick Summary

- **Architecture:** React frontend + Spring Boot microservices + API Gateway
- **Services:** auth, product, order, payment
- **Technologies:** React, Spring Boot, Oracle Database, Docker, JUnit, Mockito
- **Run:** `docker-compose up --build`
- **Database note:** Oracle XE must be running locally on `localhost:1521/XE`

---

## 1. PROJECT OVERVIEW

### Project Name
**EcomSite** - Microservices E-Commerce Platform

### Objective
Build a complete e-commerce website using modern microservices architecture where each business function (authentication, products, orders, payments) runs as an independent service.

### Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend UI framework |
| **Spring Boot 3.2** | Backend microservices framework |
| **Spring Cloud Gateway** | API routing and load balancing |
| **Oracle Database** | Shared database for all services |
| **Docker** | Containerization of all services |
| **GitHub Actions** | CI/CD automation |
| **JUnit + Mockito** | Unit testing |

---

## 2. ARCHITECTURE

### Microservices Architecture Explained

Instead of building one large application, we split the system into small, independent services. Each service handles one specific business function and can be developed, deployed, and scaled independently.

### Service Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│                      http://localhost:3000                  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (8080)                       │
│              Routes requests to correct service              │
└──────┬──────────────┬──────────────┬──────────────┬───────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   AUTH   │  │ PRODUCT  │  │  ORDER   │  │ PAYMENT  │
│ SERVICE  │  │ SERVICE  │  │ SERVICE  │  │ SERVICE  │
│  (8081)  │  │  (8082)  │  │  (8083)  │  │  (8084)  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │  ORACLE DATABASE    │
                    │  (Shared instance)  │
                    └─────────────────────┘
```

### Each Service Explained

1. **API Gateway (Port 8080)**
   - Entry point for all frontend requests
   - Routes requests to appropriate microservice
   - Applies JWT token validation

2. **Auth Service (Port 8081)**
   - Handles user registration
   - Handles user login
   - Generates JWT tokens
   - Manages user roles

3. **Product Service (Port 8082)**
   - Manages products (CRUD operations)
   - Manages categories
   - Handles product search and filtering

4. **Order Service (Port 8083)**
   - Creates orders from cart items
   - Tracks order status
   - Retrieves user order history

5. **Payment Service (Port 8084)**
   - Processes payments
   - Handles CARD payments (instant success)
   - Handles CASH payments (pending status)

### How Services Communicate

- **Synchronous**: Services call each other through REST APIs via the API Gateway
- **Database Sharing**: All services connect to the same Oracle database
- **No Direct Service-to-Service Calls**: All communication goes through the API Gateway

---

## 3. PROJECT STRUCTURE

```
ecomsite/
├── docker-compose.yml           # Docker orchestration
├── README.md                   # This file
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD pipeline
│
├── frontend/                   # React Frontend
│   ├── Dockerfile              # Frontend container
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── App.jsx             # Main app with routing
│       ├── main.jsx            # React entry point
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   └── PrivateRoute.jsx
│       ├── context/            # React Context (state management)
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── pages/              # Page components
│       │   ├── LandingPage.jsx
│       │   ├── CataloguePage.jsx
│       │   ├── ProductPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── PaymentPage.jsx
│       │   ├── ThankYouPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── CustomerDashboard.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminProducts.jsx
│       │   ├── AdminCategories.jsx
│       │   ├── AdminOrders.jsx
│       │   └── AdminUsers.jsx
│       └── services/           # API service files
│           ├── api.js          # Axios base configuration
│           ├── authService.js
│           ├── productService.js
│           ├── orderService.js
│           └── paymentService.js
│
└── backend/                    # Backend Microservices
    ├── api-gateway/            # Spring Cloud Gateway
    │   ├── Dockerfile
    │   ├── pom.xml
    │   └── src/main/
    │       ├── java/com/ecommerce/gateway/
    │       │   └── ApiGatewayApplication.java
    │       └── resources/
    │           └── application.yml
    │
    ├── auth-service/           # Authentication Service
    │   ├── Dockerfile
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/ecommerce/auth/
    │       │   ├── AuthServiceApplication.java
    │       │   ├── controller/AuthController.java
    │       │   ├── service/AuthService.java
    │       │   ├── repository/UserRepository.java
    │       │   ├── entity/User.java
    │       │   └── dto/
    │       │       ├── LoginRequest.java
    │       │       ├── RegisterRequest.java
    │       │       └── AuthResponse.java
    │       ├── main/resources/
    │       │   └── application.yml
    │       └── test/java/com/ecommerce/auth/
    │           └── AuthControllerTest.java
    │
    ├── product-service/        # Product & Category Service
    │   ├── Dockerfile
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/ecommerce/product/
    │       │   ├── ProductServiceApplication.java
    │       │   ├── controller/
    │       │   │   ├── ProductController.java
    │       │   │   └── CategoryController.java
    │       │   ├── service/
    │       │   │   ├── ProductService.java
    │       │   │   └── CategoryService.java
    │       │   ├── repository/
    │       │   │   ├── ProductRepository.java
    │       │   │   └── CategoryRepository.java
    │       │   ├── entity/
    │       │   │   ├── Product.java
    │       │   │   └── Category.java
    │       │   └── dto/
    │       │       ├── ProductDTO.java
    │       │       ├── ProductCreateDTO.java
    │       │       └── CategoryDTO.java
    │       ├── main/resources/
    │       │   └── application.yml
    │       └── test/java/com/ecommerce/product/
    │           ├── ProductControllerTest.java
    │           └── CategoryControllerTest.java
    │
    ├── order-service/          # Order Management Service
    │   ├── Dockerfile
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/ecommerce/order/
    │       │   ├── OrderServiceApplication.java
    │       │   ├── controller/OrderController.java
    │       │   ├── service/OrderService.java
    │       │   ├── repository/OrderRepository.java
    │       │   ├── entity/
    │       │   │   ├── Order.java
    │       │   │   └── OrderItem.java
    │       │   └── dto/
    │       │       ├── OrderDTO.java
    │       │       ├── CreateOrderDTO.java
    │       │       └── OrderItemDTO.java
    │       ├── main/resources/
    │       │   └── application.yml
    │       └── test/java/com/ecommerce/order/
    │           └── OrderControllerTest.java
    │
    └── payment-service/         # Payment Processing Service
        ├── Dockerfile
        ├── pom.xml
        └── src/
            ├── main/java/com/ecommerce/payment/
            │   ├── PaymentServiceApplication.java
            │   ├── controller/PaymentController.java
            │   ├── service/PaymentService.java
            │   ├── repository/PaymentRepository.java
            │   ├── entity/Payment.java
            │   └── dto/
            │       ├── PaymentDTO.java
            │       └── PaymentRequest.java
            ├── main/resources/
            │   └── application.yml
            └── test/java/com/ecommerce/payment/
                └── PaymentControllerTest.java
```

---

## 4. USER ROLES

### Role Overview

| Role | Description | Access Level |
|------|-------------|--------------|
| **VISITOR** | Unauthenticated user | Browse products only |
| **CUSTOMER** | Registered user | Shop, track orders |
| **ADMIN** | Site administrator | Full CRUD access |

### What Each Role Can Do

#### VISITOR (Not Logged In)
- View landing page
- Browse product catalogue
- View product details
- Login / Register

**Cannot do:**
- Add to cart
- Place orders
- View dashboards

---

#### CUSTOMER (Logged In)
- All VISITOR capabilities
- Add products to cart
- Remove items from cart
- Place orders
- Choose payment method (Card/Cash)
- View order history
- Track order status

**Cannot do:**
- Manage products
- Manage other users
- View admin dashboard

---

#### ADMIN
- All CUSTOMER capabilities
- Add new products
- Edit existing products
- Delete products
- Manage categories (add/delete)
- View all orders
- View all users
- Manage order status

---

## 5. FRONTEND DETAILS

### Pages Overview

| Page | Path | Access | Description |
|------|------|--------|-------------|
| Landing Page | `/` | All | Hero section + featured products |
| Catalogue | `/catalogue` | All | Browse/search products |
| Product Detail | `/product/:id` | All | Single product view |
| Cart | `/cart` | Customer+ | Shopping cart |
| Payment | `/payment` | Customer+ | Checkout & payment |
| Thank You | `/thank-you` | All | Order confirmation |
| Login | `/login` | All | User login |
| Register | `/register` | All | User registration |
| Dashboard | `/dashboard` | Customer+ | Order history, profile |
| Admin Dashboard | `/admin` | Admin | Admin home |
| Admin Products | `/admin/products` | Admin | Product management |
| Admin Categories | `/admin/categories` | Admin | Category management |
| Admin Orders | `/admin/orders` | Admin | Order management |
| Admin Users | `/admin/users` | Admin | User management |

### Components Explained

#### Navbar.jsx
- Displays navigation links
- Shows Login/Register when logged out
- Shows Profile/Logout when logged in
- Shows Admin Dashboard link for admins
- Shows cart item count

#### Footer.jsx
- Simple footer with copyright
- Links to main pages

#### ProductCard.jsx
- Displays product image (placeholder)
- Shows product name, price, description
- "Add to Cart" button
- Used in catalogue and landing page

#### PrivateRoute.jsx
- Protects routes that require authentication
- Checks user role (CUSTOMER or ADMIN)
- Redirects to login if not authenticated
- Redirects to home if wrong role

### Context (State Management)

#### AuthContext.jsx
Manages authentication state:
- `user` - Current user object
- `token` - JWT token
- `login()` - Login function
- `logout()` - Logout function
- `register()` - Registration function

#### CartContext.jsx
Manages shopping cart:
- `items` - Array of cart items
- `addToCart(product)` - Add product to cart
- `removeFromCart(productId)` - Remove product
- `clearCart()` - Empty the cart
- `getTotal()` - Calculate total price

### Services (API Calls)

#### api.js
Base Axios configuration:
```javascript
baseURL: 'http://localhost:8080'  // API Gateway
Intercepts requests to add JWT token
```

#### authService.js
- `login(username, password)` - POST /auth/login
- `register(username, password, role)` - POST /auth/register

#### productService.js
- `getProducts()` - GET /products
- `getProduct(id)` - GET /products/{id}
- `createProduct(data)` - POST /products
- `updateProduct(id, data)` - PUT /products/{id}
- `deleteProduct(id)` - DELETE /products/{id}
- `getCategories()` - GET /categories
- `createCategory(name)` - POST /categories

#### orderService.js
- `createOrder(userId, items)` - POST /orders
- `getUserOrders(userId)` - GET /orders/user/{userId}
- `getOrder(id)` - GET /orders/{id}

#### paymentService.js
- `processPayment(orderId, method, amount)` - POST /payments/process
- `getPaymentByOrder(orderId)` - GET /payments/order/{orderId}

### How Frontend Connects to Backend

```
React App ──────► Axios ──────► API Gateway (8080)
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
    /auth/**                    /products/**                /orders/**
         │                           │                           │
         ▼                           ▼                           ▼
    Auth Service               Product Service              Order Service
    (Port 8081)                (Port 8082)                (Port 8083)
```

---

## 6. BACKEND DETAILS

### AUTH SERVICE (Port 8081)

**Package:** `com.ecommerce.auth`

**Purpose:** Handle user registration, login, and JWT token generation.

#### Entity: User
```java
- id: Long (auto-generated)
- username: String (unique)
- password: String (encrypted)
- role: String ("CUSTOMER" or "ADMIN")
```

#### DTOs
- `LoginRequest` - username, password
- `RegisterRequest` - username, password, role
- `AuthResponse` - token, username, role

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |

#### Service Logic
1. **Register**: Save user with encrypted password
2. **Login**: Validate credentials, generate JWT token
3. **JWT**: Simple token containing username and role

---

### PRODUCT SERVICE (Port 8082)

**Package:** `com.ecommerce.product`

**Purpose:** Manage products and categories.

#### Entities

**Category**
```java
- id: Long
- name: String
```

**Product**
```java
- id: Long
- name: String
- description: String
- price: Double
- stock: Integer
- category: Category (ManyToOne)
```

#### DTOs
- `CategoryDTO` - id, name
- `ProductDTO` - id, name, description, price, stock, categoryId, categoryName
- `ProductCreateDTO` - name, description, price, stock, categoryId

#### Endpoints

**CategoryController**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/{id}` | Get category by ID |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

**ProductController**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/{id}` | Get product by ID |
| POST | `/products` | Create product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

---

### ORDER SERVICE (Port 8083)

**Package:** `com.ecommerce.order`

**Purpose:** Create and manage orders.

#### Entities

**Order**
```java
- id: Long
- userId: Long
- status: String ("PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED")
- orderDate: LocalDateTime
- items: List<OrderItem> (OneToMany)
```

**OrderItem**
```java
- id: Long
- productId: Long
- productName: String
- quantity: Integer
- price: Double
- order: Order (ManyToOne)
```

#### DTOs
- `OrderDTO` - id, userId, status, orderDate, items
- `CreateOrderDTO` - userId, items (productId, quantity, price)
- `OrderItemDTO` - productId, productName, quantity, price

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders/{id}` | Get order by ID |
| GET | `/orders/user/{userId}` | Get all orders for user |

---

### PAYMENT SERVICE (Port 8084)

**Package:** `com.ecommerce.payment`

**Purpose:** Process payments for orders.

#### Entity: Payment
```java
- id: Long
- orderId: Long
- method: String ("CARD" or "CASH")
- status: String ("PENDING", "COMPLETED", "FAILED")
- amount: Double
- timestamp: LocalDateTime
```

#### DTOs
- `PaymentRequest` - orderId, method, amount
- `PaymentDTO` - id, orderId, method, status, amount, timestamp

#### Payment Logic

| Method | Behavior |
|--------|----------|
| **CARD** | Instant success, status = COMPLETED |
| **CASH** | Remains pending, status = PENDING |

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/process` | Process a payment |
| GET | `/payments/order/{orderId}` | Get payment by order |

---

### API GATEWAY (Port 8080)

**Package:** `com.ecommerce.gateway`

**Purpose:** Route requests to correct microservice.

#### Routing Configuration
```yaml
routes:
  - /auth/**       → auth-service:8081
  - /products/**   → product-service:8082
  - /categories/** → product-service:8082
  - /orders/**     → order-service:8083
  - /payments/**   → payment-service:8084
```

#### Request Flow
```
Client Request
      │
      ▼
┌─────────────┐
│ API Gateway │ ───► /auth/** ────► Auth Service
└─────────────┘
      │
      ├──► /products/** ────► Product Service
      │
      ├──► /orders/** ──────► Order Service
      │
      └──► /payments/** ────► Payment Service
```

---

## 7. DATABASE DESIGN

### Database: Oracle XE (Shared Instance)

All services share the same Oracle database but access different tables.

### Tables

#### USERS
| Column | Type | Constraints |
|--------|------|-------------|
| ID | NUMBER | PRIMARY KEY |
| USERNAME | VARCHAR2 | UNIQUE, NOT NULL |
| PASSWORD | VARCHAR2 | NOT NULL |
| ROLE | VARCHAR2 | NOT NULL |

#### CATEGORY
| Column | Type | Constraints |
|--------|------|-------------|
| ID | NUMBER | PRIMARY KEY |
| NAME | VARCHAR2 | NOT NULL |

#### PRODUCT
| Column | Type | Constraints |
|--------|------|-------------|
| ID | NUMBER | PRIMARY KEY |
| NAME | VARCHAR2 | NOT NULL |
| DESCRIPTION | VARCHAR2 | |
| PRICE | FLOAT | NOT NULL |
| STOCK | INTEGER | NOT NULL |
| CATEGORY_ID | NUMBER | FOREIGN KEY → CATEGORY(ID) |

#### ORDERS
| Column | Type | Constraints |
|--------|------|-------------|
| ID | NUMBER | PRIMARY KEY |
| USER_ID | NUMBER | NOT NULL |
| STATUS | VARCHAR2 | NOT NULL |
| ORDER_DATE | TIMESTAMP | NOT NULL |

#### ORDER_ITEM
| Column | Type | Constraints |
|--------|------|-------------|
| ID | NUMBER | PRIMARY KEY |
| PRODUCT_ID | NUMBER | NOT NULL |
| PRODUCT_NAME | VARCHAR2 | NOT NULL |
| QUANTITY | INTEGER | NOT NULL |
| PRICE | FLOAT | NOT NULL |
| ORDER_ID | NUMBER | FOREIGN KEY → ORDERS(ID) |

#### PAYMENT
| Column | Type | Constraints |
|--------|------|-------------|
| ID | NUMBER | PRIMARY KEY |
| ORDER_ID | NUMBER | NOT NULL |
| METHOD | VARCHAR2 | NOT NULL |
| STATUS | VARCHAR2 | NOT NULL |
| AMOUNT | FLOAT | NOT NULL |
| TIMESTAMP | TIMESTAMP | NOT NULL |

### Relationships

```
CATEGORY 1 ──────< PRODUCT (One Category has Many Products)

ORDERS 1 ───────< ORDER_ITEM (One Order has Many Items)

PAYMENT 1 ────── 1 ORDERS (One Payment per Order)
```

---

## 8. API FLOW (Step-by-Step)

### Complete Shopping Flow

#### Step 1: User Registration
```
1. User visits /register
2. Fills username, password, role (CUSTOMER)
3. Frontend calls: POST /auth/register
4. Auth Service creates user in USERS table
5. Returns success message
6. Redirects to login page
```

#### Step 2: User Login
```
1. User visits /login
2. Enters username, password
3. Frontend calls: POST /auth/login
4. Auth Service validates credentials
5. Returns JWT token + user info
6. AuthContext stores token
7. Redirects to home page
```

#### Step 3: Browsing Products
```
1. User visits /catalogue
2. Frontend calls: GET /products
3. API Gateway routes to Product Service
4. Product Service queries PRODUCT table
5. Returns list of products
6. Products displayed in grid
```

#### Step 4: Adding to Cart
```
1. User clicks "Add to Cart" on product
2. CartContext.addToCart(product) called
3. Product added to cart array in memory
4. Cart icon updates with count
5. User can view cart at /cart
```

#### Step 5: Placing Order
```
1. User clicks "Checkout" on cart page
2. Frontend calls: POST /orders
   Body: { userId, items: [...] }
3. Order Service creates:
   - New row in ORDERS table
   - Rows in ORDER_ITEM table
4. Returns order ID
5. Redirects to payment page
```

#### Step 6: Payment Processing
```
1. User selects payment method (CARD or CASH)
2. User clicks "Pay Now"
3. Frontend calls: POST /payments/process
   Body: { orderId, method, amount }
4. Payment Service processes:
   - If CARD: status = COMPLETED (instant)
   - If CASH: status = PENDING
5. Payment saved to PAYMENT table
6. Returns payment confirmation
7. Redirects to /thank-you
```

#### Step 7: Order Confirmation
```
1. ThankYou page displays success message
2. User can continue shopping
3. User can view order in Dashboard
```

---

## 9. DOCKER SETUP

### What is Docker?

Docker packages applications with their dependencies into containers. Each container runs in isolation but can communicate with others.

### docker-compose.yml Explained

> Note: this project does not start Oracle inside Docker Compose. Start Oracle XE locally before running the services.

```yaml
services:
  # Frontend Container
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    # Built from frontend/Dockerfile

  # API Gateway Container
  api-gateway:
    build: ./backend/api-gateway
    ports: ["8080:8080"]
    # Routes to other services

  # Auth Service Container
  auth-service:
    build: ./backend/auth-service
    ports: ["8081:8081"]
    environment:
      - Connects to Oracle at host.docker.internal

  # Product Service Container
  product-service:
    build: ./backend/product-service
    ports: ["8082:8082"]
    environment:
      - Connects to Oracle

  # Order Service Container
  order-service:
    build: ./backend/order-service
    ports: ["8083:8083"]
    environment:
      - Connects to Oracle

  # Payment Service Container
  payment-service:
    build: ./backend/payment-service
    ports: ["8084:8084"]
    environment:
      - Connects to Oracle

networks:
  ecom-network:
    # All containers connected to same network
```

### Container Communication

- `host.docker.internal` - Special DNS that points to host machine
- Services use this to connect to Oracle on host
- All containers share the same Docker network

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f auth-service

# Rebuild single service
docker-compose build auth-service
docker-compose up -d auth-service
```

---

## 10. CI/CD PIPELINE

### GitHub Actions Workflow

Located at: `.github/workflows/ci-cd.yml`

#### What Happens on Each Push

```yaml
jobs:
  1. build-backend:
     - Checkout code
     - Setup JDK 17
     - Build API Gateway (mvn package)
     - Build Auth Service
     - Build Product Service
     - Build Order Service
     - Build Payment Service

  2. build-frontend:
     - Checkout code
     - Setup Node.js 18
     - npm ci (install dependencies)
     - npm run build (production build)

  3. docker-build:
     - Runs after both builds succeed
     - Setup Docker Buildx
     - Login to Docker Hub
     - docker-compose build
     - docker-compose push
```

### Pipeline Triggers
- On push to `main` or `master` branch
- On pull request to `main` or `master` branch

---

## 11. HOW TO RUN PROJECT

### Prerequisites

1. **Docker** installed
2. **Oracle Database** running on `localhost:1521/XE`
   - Username: `noker`
   - Password: `123456789`
   - Oracle must be started locally before `docker-compose up --build`

### Step-by-Step Instructions

#### Step 1: Verify Oracle is Running
```bash
sqlplus noker/123456789@localhost:1521/XE
SELECT * FROM v$instance;
EXIT;
```

#### Step 2: Navigate to Project
```bash
cd /path/to/ecomsite
```

#### Step 3: Build and Start Services
```bash
docker-compose up --build
```

This will:
1. Build the React frontend
2. Build all Spring Boot services
3. Create Docker images
4. Start all containers
5. Connect services together

#### Step 4: Wait for Services to Start
Services start in order:
1. API Gateway (8080) - ~30 seconds
2. Auth Service (8081)
3. Product Service (8082)
4. Order Service (8083)
5. Payment Service (8084)
6. Frontend (3000)

#### Step 5: Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost:8080 |
| Auth Service | http://localhost:8081 |
| Product Service | http://localhost:8082 |
| Order Service | http://localhost:8083 |
| Payment Service | http://localhost:8084 |

### Testing the Application

1. Open http://localhost:3000
2. Register a new account (role: CUSTOMER)
3. Login with your credentials
4. Browse products
5. Add items to cart
6. Checkout and pay
7. View order in dashboard

### Creating an Admin User

1. Register at /register
2. Manually update database:
```sql
UPDATE USERS SET ROLE = 'ADMIN' WHERE USERNAME = 'yourusername';
```

---

## 12. TESTING

### Testing Overview

Each service has unit tests using JUnit and MockMvc.

### Test Files

| Service | Test File | Tests |
|---------|-----------|-------|
| Auth Service | AuthControllerTest.java | Register, Login |
| Product Service | ProductControllerTest.java | CRUD operations |
| Category Service | CategoryControllerTest.java | CRUD operations |
| Order Service | OrderControllerTest.java | Create, Get orders |
| Payment Service | PaymentControllerTest.java | Process payment |

### Testing Technologies

#### JUnit
- Java testing framework
- Annotations: @Test, @BeforeEach
- Assertions: assertEquals, assertNotNull

#### Mockito
- Mocking framework
- @MockBean - Create mock dependencies
- when().thenReturn() - Define mock behavior

#### MockMvc
- Testing REST controllers
- Simulates HTTP requests
- mvc.perform() - Execute request
- andExpect() - Verify response

### Example Test Structure

```java
@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @MockBean
    private AuthService authService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void register_Success() throws Exception {
        // Setup mock
        when(authService.register(any()))
            .thenReturn(new AuthResponse("token", "user", "CUSTOMER"));

        // Perform request
        mockMvc.perform(post("/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"test\",\"password\":\"123\"}"))

        // Verify
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists());
    }
}
```

### Running Tests

```bash
# Run all tests in a service
cd backend/auth-service
mvn test

# Run specific test
mvn test -Dtest=AuthControllerTest
```

---

## 13. LIMITATIONS & IMPROVEMENTS

### Current Limitations

1. **Basic JWT Authentication**
   - Simple token structure
   - No refresh tokens
   - No token expiration validation
   - No password reset

2. **No Advanced Security**
   - No rate limiting
   - No HTTPS in development
   - Basic CORS configuration
   - No input sanitization

3. **Simple Payment Logic**
   - CARD payments are instantly approved (no real payment gateway)
   - CASH payments remain pending (no follow-up)
   - No refund handling

4. **Basic UI/UX**
   - No responsive design optimization
   - No loading states
   - Limited error messages
   - No image upload for products

5. **Database Limitations**
   - Single shared database (not true microservices)
   - No database transactions across services
   - No database connection pooling optimization

### Suggested Improvements

#### Security
- [ ] Implement proper JWT with expiration
- [ ] Add refresh token mechanism
- [ ] Implement password encryption (BCrypt)
- [ ] Add rate limiting
- [ ] Add input validation (Spring Validation)
- [ ] Implement HTTPS
- [ ] Add CORS configuration

#### Payment Integration
- [ ] Integrate Stripe/PayPal API
- [ ] Handle payment webhooks
- [ ] Implement refund logic
- [ ] Add payment verification

#### Architecture
- [ ] Add Message Queue (RabbitMQ/Kafka)
- [ ] Implement Circuit Breaker (Resilience4j)
- [ ] Add Service Discovery (Eureka)
- [ ] Implement distributed logging
- [ ] Add API rate limiting

#### Frontend
- [ ] Add product image upload
- [ ] Implement search with filters
- [ ] Add pagination
- [ ] Improve responsive design
- [ ] Add loading skeletons
- [ ] Implement form validation
- [ ] Add toast notifications

#### Testing
- [ ] Add Integration Tests
- [ ] Add E2E tests (Cypress)
- [ ] Increase test coverage
- [ ] Add load testing

---

## Quick Reference

### Default Ports
| Service | Port |
|---------|------|
| Frontend | 3000 |
| API Gateway | 8080 |
| Auth Service | 8081 |
| Product Service | 8082 |
| Order Service | 8083 |
| Payment Service | 8084 |
| Oracle DB | 1521 |

### API Endpoints Summary
```
POST /auth/register     - Register user
POST /auth/login        - Login user

GET  /products         - List products
POST /products          - Create product
GET  /products/{id}     - Get product
PUT  /products/{id}     - Update product
DELETE /products/{id}   - Delete product

GET  /categories        - List categories
POST /categories        - Create category
DELETE /categories/{id} - Delete category

POST /orders            - Create order
GET  /orders/{id}       - Get order
GET  /orders/user/{id}  - Get user orders

POST /payments/process   - Process payment
GET  /payments/order/{id} - Get payment
```

### Database Credentials
- Username: `noker`
- Password: `123456789`
- SID: `XE`

---

**Project completed!** For questions, refer to the code comments or create an issue.
