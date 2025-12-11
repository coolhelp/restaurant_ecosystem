# 🏗️ Restaurant Ecosystem - System Architecture

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   Customer   │   Customer   │    Admin     │   Delivery        │
│   Mobile App │   Website    │    Portal    │   Driver App      │
│  (React      │  (Next.js)   │  (Next.js)   │  (React Native)   │
│   Native)    │              │              │                    │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬───────────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                      │
                      ▼
       ┌──────────────────────────────────────┐
       │         API Gateway / Load Balancer   │
       └──────────────┬───────────────────────┘
                      │
                      ▼
       ┌──────────────────────────────────────┐
       │      Node.js Backend API Server       │
       │      (Express + TypeScript)           │
       │                                        │
       │  ┌────────────────────────────────┐  │
       │  │    Controllers Layer           │  │
       │  │  - Auth, Menu, Order, Payment  │  │
       │  │  - Loyalty, User, Delivery     │  │
       │  └─────────────┬──────────────────┘  │
       │                │                      │
       │  ┌─────────────▼──────────────────┐  │
       │  │    Services Layer              │  │
       │  │  - Business Logic              │  │
       │  │  - Validation                  │  │
       │  │  - External APIs               │  │
       │  └─────────────┬──────────────────┘  │
       │                │                      │
       │  ┌─────────────▼──────────────────┐  │
       │  │    Data Access Layer           │  │
       │  │  - Prisma ORM                  │  │
       │  │  - Repository Pattern          │  │
       │  └─────────────┬──────────────────┘  │
       └────────────────┼────────────────────┘
                        │
       ┌────────────────┼────────────────────┐
       │                │                     │
       ▼                ▼                     ▼
┌─────────────┐  ┌─────────────┐    ┌──────────────┐
│ PostgreSQL  │  │  SQL Server │    │ Redis Cache  │
│   (Dev)     │  │  (POS DB)   │    │  (Sessions)  │
└─────────────┘  └─────────────┘    └──────────────┘

       ┌────────────────┬────────────────────┐
       │                │                     │
       ▼                ▼                     ▼
┌─────────────┐  ┌─────────────┐    ┌──────────────┐
│  Socket.IO  │  │  Firebase   │    │   Payment    │
│ (Real-time) │  │    (Push)   │    │  Gateways    │
└─────────────┘  └─────────────┘    └──────────────┘
```

---

## Service/Module Boundaries

### 1. **Authentication & Authorization Service**
**Responsibility:** User identity and access control
- User registration
- Login/logout
- JWT token generation
- Token refresh
- Password management
- Session management
- Role-based access control (RBAC)

**Dependencies:**
- Database (User, RefreshToken tables)
- JWT library
- Bcrypt

**Exposed APIs:**
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password

---

### 2. **Menu Management Service**
**Responsibility:** Menu items, categories, and modifiers
- Category CRUD
- Item CRUD
- Modifier group management
- Pricing management
- Availability toggling
- Menu sync from POS

**Dependencies:**
- Database (Category, Item, Modifier tables)
- POS database (read)

**Exposed APIs:**
- GET /api/v1/menu/categories
- POST /api/v1/menu/categories
- GET /api/v1/menu/items
- POST /api/v1/menu/items
- PUT /api/v1/menu/items/:id
- DELETE /api/v1/menu/items/:id

---

### 3. **Order Processing Service**
**Responsibility:** Order lifecycle management
- Order creation
- Order status tracking
- Order history
- Order modifications
- Kitchen display integration
- POS order posting

**Dependencies:**
- Database (Order, OrderItem tables)
- Menu Service (item prices)
- Payment Service (payment verification)
- Loyalty Service (points calculation)
- POS database (write)
- Socket.IO (real-time updates)

**Exposed APIs:**
- POST /api/v1/orders
- GET /api/v1/orders
- GET /api/v1/orders/:id
- PATCH /api/v1/orders/:id/status
- POST /api/v1/orders/:id/cancel

---

### 4. **Payment Processing Service**
**Responsibility:** Payment transactions
- Payment gateway integration
- Transaction processing
- Refund handling
- Payment method storage
- Receipt generation

**Dependencies:**
- Authorize.Net SDK
- Database (Payment, Refund tables)
- Order Service

**Exposed APIs:**
- POST /api/v1/payments/process
- POST /api/v1/payments/refund
- GET /api/v1/payments/:id

---

### 5. **Loyalty Program Service**
**Responsibility:** Customer rewards and points
- Points calculation
- Points accrual
- Points redemption
- Tier management
- Transaction history
- Loyalty rules engine

**Dependencies:**
- Database (LoyaltyAccount, LoyaltyTransaction, LoyaltyRule tables)
- Order Service (order amount)
- POS database (loyalty sync)

**Exposed APIs:**
- GET /api/v1/loyalty/account
- GET /api/v1/loyalty/transactions
- POST /api/v1/loyalty/redeem
- GET /api/v1/loyalty/rules

---

### 6. **User Management Service**
**Responsibility:** User profiles and preferences
- Profile management
- Address management
- Preference settings
- Customer data

**Dependencies:**
- Database (User, Customer, Address tables)

**Exposed APIs:**
- GET /api/v1/users/profile
- PUT /api/v1/users/profile
- GET /api/v1/users/addresses
- POST /api/v1/users/addresses
- DELETE /api/v1/users/addresses/:id

---

### 7. **Delivery Management Service**
**Responsibility:** Delivery logistics
- Driver assignment
- Route optimization
- Delivery tracking
- Status updates

**Dependencies:**
- Database (Delivery, Employee tables)
- Order Service
- Socket.IO (driver location)

**Exposed APIs:**
- GET /api/v1/delivery/:orderId
- PATCH /api/v1/delivery/:id/status
- POST /api/v1/delivery/assign

---

### 8. **Location Management Service**
**Responsibility:** Multi-location support
- Restaurant locations
- Operating hours
- Delivery zones
- Location-specific settings

**Dependencies:**
- Database (Location table)

**Exposed APIs:**
- GET /api/v1/locations
- GET /api/v1/locations/:id
- GET /api/v1/locations/nearest

---

### 9. **Notification Service**
**Responsibility:** Push notifications and alerts
- Push notification sending
- SMS notifications
- Email notifications
- In-app notifications

**Dependencies:**
- Firebase Cloud Messaging
- Twilio (SMS)
- SendGrid (Email)
- Database (Notification, PushToken tables)

**Exposed APIs:**
- POST /api/v1/notifications/send
- GET /api/v1/notifications
- PATCH /api/v1/notifications/:id/read

---

### 10. **Inventory Management Service**
**Responsibility:** Stock tracking
- Inventory levels
- Stock movements
- Reorder alerts
- Purchase orders

**Dependencies:**
- Database (Inventory, StockMovement tables)
- Menu Service (items)

**Exposed APIs:**
- GET /api/v1/inventory
- POST /api/v1/inventory/movement
- GET /api/v1/inventory/low-stock

---

### 11. **Reporting & Analytics Service**
**Responsibility:** Business intelligence
- Sales reports
- Customer analytics
- Performance metrics
- Export functionality

**Dependencies:**
- Database (all tables)
- Order Service
- User Service

**Exposed APIs:**
- GET /api/v1/reports/sales
- GET /api/v1/reports/customers
- GET /api/v1/reports/performance

---

### 12. **POS Sync Service**
**Responsibility:** POS database synchronization
- Menu sync (POS → App)
- Order posting (App → POS)
- Status sync (POS → App)
- Loyalty sync (bidirectional)
- Kitchen print triggering

**Dependencies:**
- SQL Server connection
- POS database
- All other services
- Scheduled jobs

**Exposed APIs:**
- POST /api/v1/pos/sync/menu
- POST /api/v1/pos/sync/order
- GET /api/v1/pos/sync/status

---

## Technology Stack

### Frontend (Customer Website & Admin Portal)
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts
- **Notifications:** React Hot Toast

### Mobile Apps
- **Framework:** React Native
- **Navigation:** React Navigation
- **State:** Zustand (shared)
- **Maps:** React Native Maps
- **Push:** Firebase Cloud Messaging

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (dev) / SQL Server (prod)
- **Real-time:** Socket.IO
- **Authentication:** JWT + Bcrypt
- **Validation:** Joi
- **Logging:** Winston
- **HTTP Client:** Axios (for external APIs)

### External Services
- **Payment:** Authorize.Net
- **Push Notifications:** Firebase Cloud Messaging
- **SMS:** Twilio (optional)
- **Email:** SendGrid (optional)
- **Maps:** Google Maps API

### DevOps & Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Monorepo:** npm workspaces
- **Task Runner:** Turbo
- **Linting:** ESLint
- **Testing:** Jest (planned)

---

## Security Architecture

### Authentication Flow
```
1. User submits credentials
   ↓
2. Backend validates (bcrypt hash compare)
   ↓
3. Generate access token (JWT, 7 days)
   ↓
4. Generate refresh token (JWT, 30 days)
   ↓
5. Store refresh token in database
   ↓
6. Return both tokens to client
   ↓
7. Client stores in localStorage/AsyncStorage
   ↓
8. Client includes access token in Authorization header
   ↓
9. Backend validates token on each request
   ↓
10. On 401, client uses refresh token to get new access token
```

### Authorization (RBAC)
```
Roles Hierarchy:
SUPER_ADMIN → Full system access
    ↓
  ADMIN → Location management, reports
    ↓
 MANAGER → Order management, staff
    ↓
EMPLOYEE → Order viewing, delivery
    ↓
CUSTOMER → Ordering, profile
```

---

## Deployment Architecture

### Development Environment
```
Developer Machine
  ↓
localhost:3001 (Backend)
localhost:3000 (Customer Website)
localhost:3002 (Admin Portal)
  ↓
PostgreSQL (Local or Docker)
```

### Production Environment
```
                ┌────────────────┐
                │   Load Balancer │
                │   (Nginx/AWS)   │
                └────────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                 │
        ▼                ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Backend    │ │   Backend    │ │   Backend    │
│  Instance 1  │ │  Instance 2  │ │  Instance 3  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                 │
       └────────────────┼─────────────────┘
                        │
        ┌───────────────┼──────────────┐
        │               │               │
        ▼               ▼               ▼
 ┌────────────┐ ┌────────────┐ ┌────────────┐
 │   SQL      │ │   Redis    │ │  Firebase  │
 │  Server    │ │   Cache    │ │    FCM     │
 │  (POS DB)  │ │            │ │            │
 └────────────┘ └────────────┘ └────────────┘
```

---

## Scalability Strategy

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Load balancer distributes requests
- Shared session store (Redis)
- Database connection pooling

### Vertical Scaling
- Optimize database queries
- Add indexes
- Cache frequently accessed data
- CDN for static assets

### Performance Targets
- API response time: < 200ms (p95)
- Page load time: < 2 seconds
- Real-time latency: < 100ms
- Database queries: < 50ms
- Concurrent users: 1000+

---

## Data Flow Architecture

### Order Processing Flow (Detailed in separate diagram)
```
Customer → Cart → Checkout → Payment → Order Created
                                              ↓
                                    ┌─────────┴─────────┐
                                    │                   │
                            Save to Our DB        Post to POS DB
                                    │                   │
                            Socket.IO Notify      Trigger Print
                                    │                   │
                                Update UI         Kitchen Ticket
```

### Menu Sync Flow
```
POS Database (SQL Server)
          ↓
    Polling Service (60s interval)
          ↓
    Read Categories, Items, Modifiers
          ↓
    Transform to Our Schema
          ↓
    Update Our Database (Prisma)
          ↓
    Broadcast via Socket.IO
          ↓
    Apps/Website Update UI
```

---

## Module Dependencies Graph

```
┌─────────────┐
│    Auth     │──────┐
└─────────────┘      │
                     │
┌─────────────┐      │      ┌──────────────┐
│    Menu     │      ├─────→│    Order     │
└─────────────┘      │      └──────┬───────┘
                     │             │
┌─────────────┐      │             │
│   Payment   │──────┘             │
└─────────────┘                    │
                                   │
┌─────────────┐                    │
│   Loyalty   │←───────────────────┘
└─────────────┘
                                   
┌─────────────┐      ┌──────────────┐
│  Delivery   │─────→│   Location   │
└─────────────┘      └──────────────┘

┌─────────────┐
│ Notification│ (Called by all services)
└─────────────┘

┌─────────────┐
│  POS Sync   │ (Interacts with all data services)
└─────────────┘
```

---

## Error Handling Strategy

### Error Levels
1. **Validation Errors** (400) - Client input issues
2. **Authentication Errors** (401) - Auth failures
3. **Authorization Errors** (403) - Permission denied
4. **Not Found Errors** (404) - Resource missing
5. **Server Errors** (500) - Internal issues

### Error Response Format
```json
{
  "status": "error",
  "message": "User-friendly error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "email",
    "issue": "Email already exists"
  }
}
```

### Logging Strategy
- All errors logged to Winston
- Structured logging (JSON format)
- Log levels: error, warn, info, debug
- Separate files for different log levels
- Log rotation (daily)

---

## Real-Time Architecture (Socket.IO)

### Event Types
```typescript
// Server → Client
'order:created'      // New order notification
'order:updated'      // Order status change
'order:cancelled'    // Order cancelled
'menu:updated'       // Menu item changed
'delivery:location'  // Driver location update

// Client → Server
'subscribe:orders'   // Subscribe to order updates
'unsubscribe:orders' // Unsubscribe
```

### Rooms Structure
```
- `user:${userId}` - User-specific events
- `order:${orderId}` - Order-specific events
- `location:${locationId}` - Location-specific events
- `admin` - Admin notifications
```

---

## Database Architecture

### Primary Database (Prisma + PostgreSQL/SQL Server)
**See DATABASE_SCHEMA.md for complete schema**

**Key Tables:**
- Users & Authentication
- Menu (Categories, Items, Modifiers)
- Orders & Order Items
- Payments & Refunds
- Loyalty (Accounts, Transactions, Rules)
- Delivery & Drivers
- Locations & Settings
- Inventory
- Notifications

### POS Database (SQL Server - Read/Write)
**See POS_DATABASE_SCHEMA.md for mapping**

---

## API Architecture Patterns

### RESTful Design Principles
- Resource-based URLs
- HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- Stateless operations
- JSON responses
- Standard status codes
- Pagination support
- Filtering & sorting

### API Versioning
- URL-based versioning: `/api/v1/...`
- Backward compatibility maintained
- Deprecation notices

### Request/Response Format
```typescript
// Request
{
  "data": { /* payload */ },
  "metadata": { /* optional */ }
}

// Success Response
{
  "status": "success",
  "data": { /* result */ }
}

// Error Response
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## Monitoring & Observability

### Health Checks
- `/health` - Overall system health
- `/health/db` - Database connectivity
- `/health/pos` - POS database connectivity
- `/health/cache` - Redis connectivity

### Metrics Tracked
- Request count
- Response times
- Error rates
- Active connections
- Database query performance
- Cache hit rate

### Logging
- Request/response logging (Morgan)
- Application logging (Winston)
- Error tracking
- Audit logging (sensitive operations)

---

## Backup & Recovery Strategy

### Data Backup
- Daily database backups
- Transaction logs
- Point-in-time recovery
- Backup retention: 30 days

### Disaster Recovery
- Database replication
- Hot standby server
- Automated failover
- Recovery time objective (RTO): < 1 hour
- Recovery point objective (RPO): < 15 minutes

---

## Performance Optimization

### Database
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas (if needed)

### Caching Strategy
- Redis for session data
- API response caching
- Menu data caching (5 min TTL)
- Static asset CDN

### API Optimization
- Response compression (gzip)
- Pagination (limit 50)
- Field selection (sparse fieldsets)
- Batch operations where possible

---

This architecture supports the entire restaurant ecosystem with scalability, security, and performance in mind! 🚀

