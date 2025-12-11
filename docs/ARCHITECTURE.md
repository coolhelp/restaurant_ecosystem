# Restaurant Ecosystem - System Architecture

## Overview

The Restaurant Ecosystem is a comprehensive, full-stack solution that integrates:
- Customer Mobile App (iOS/Android)
- Customer Ordering Website
- Merchant Admin Portal
- Point of Sale (POS) System
- Delivery Driver App

All components communicate through a centralized REST API with real-time updates via WebSockets.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                          │
├──────────────┬─────────────┬─────────────┬─────────────┬───────────┤
│  Mobile App  │  Web Order  │Admin Portal │ POS System  │Delivery App│
│ (React       │  (Next.js)  │  (Next.js)  │  (Next.js)  │(React      │
│  Native)     │             │             │             │ Native)    │
└──────────────┴─────────────┴─────────────┴─────────────┴───────────┘
                                    │
                         ┌──────────┴──────────┐
                         │    API GATEWAY      │
                         │   (Load Balancer)   │
                         └──────────┬──────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
    ┌───────▼────────┐    ┌────────▼──────────┐   ┌───────▼────────┐
    │   REST API     │    │   WebSocket       │   │  Background    │
    │   (Express)    │    │   (Socket.IO)     │   │    Jobs        │
    │   + TypeScript │    │                   │   │  (Node-Cron)   │
    └───────┬────────┘    └────────┬──────────┘   └───────┬────────┘
            │                      │                       │
            └──────────────────────┼───────────────────────┘
                                   │
               ┌───────────────────┴────────────────────┐
               │         SERVICE LAYER                  │
               ├──────────────────────────────────────┬─┤
               │ Loyalty  │ Payment │ Order │ Menu   │...│
               │ Service  │ Service │ Service│Service │...│
               └──────────┴─────────┴────────┴────────┴─┘
                                   │
               ┌───────────────────┴────────────────────┐
               │         DATA ACCESS LAYER              │
               │            (Prisma ORM)                │
               └────────────────────┬───────────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               │                                         │
        ┌──────▼─────────┐                   ┌──────────▼────────┐
        │   SQL Server   │                   │      Redis        │
        │   (Production) │                   │   (Caching +      │
        │       or       │                   │    Sessions)      │
        │  PostgreSQL    │                   └───────────────────┘
        │ (Development)  │
        └────────────────┘

External Integrations:
┌─────────────────────────────────────────────────────────────────────┐
│  Authorize.Net  │  Clover Terminal  │  Ingenico  │  Firebase (Push) │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma (SQL Server / PostgreSQL)
- **Real-time**: Socket.IO
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Joi
- **Logging**: Winston + Morgan
- **Caching**: Redis
- **Scheduling**: Node-Cron

### Frontend Web (Website, Admin, POS)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **State Management**: Zustand / Context API
- **API Client**: Axios
- **Forms**: React Hook Form + Zod

### Frontend Mobile (Customer & Delivery Apps)
- **Framework**: React Native
- **Platform**: Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **API Client**: Axios
- **Push Notifications**: Firebase Cloud Messaging

### Database
- **Production**: SQL Server (existing client DB)
- **Development**: PostgreSQL
- **Schema Management**: Prisma Migrations
- **Seed Data**: TypeScript seed scripts

### Payment Integrations
- **Online Payments**: Authorize.Net API
- **Terminal Payments**: Clover SDK, Ingenico SDK
- **Tokenization**: Accept.js (Authorize.Net)
- **Security**: PCI DSS Level 1 compliant

### DevOps & Infrastructure
- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Deployment**: Docker + Docker Compose
- **Monitoring**: Winston Logs + Error tracking

## Data Flow Architecture

### 1. Customer Order Flow

```
Customer App/Website
    ↓
[Browse Menu]
    ↓
GET /api/v1/menu/categories
GET /api/v1/menu/items
    ↓
[Add to Cart] (Local State)
    ↓
[Checkout]
    ↓
POST /api/v1/orders
    ↓
Backend validates items, calculates totals
    ↓
Order saved to database (PENDING status)
    ↓
POST /api/v1/payments/charge
    ↓
Payment Gateway (Authorize.Net)
    ↓
Payment success → Order status → CONFIRMED
    ↓
Socket.IO: emit('order:update', orderData)
    ↓
[Kitchen Printer] receives order via ESC/POS
    ↓
Customer receives confirmation
```

### 2. Loyalty Points Flow

```
Order Completed
    ↓
POST /api/v1/loyalty/earn
    ↓
LoyaltyService.calculatePointsEarned()
    ↓
Apply active loyalty rules
    ↓
Calculate: floor(orderAmount * rule.value)
    ↓
Create LoyaltyTransaction (EARN)
    ↓
Update account.pointsBalance += points
Update account.lifetimePoints += points
    ↓
Check tier thresholds
    ↓
Update tier if threshold met
    ↓
Return updated account to customer
```

### 3. Real-time Order Updates

```
POS/Admin updates order status
    ↓
PUT /api/v1/orders/:id/status
    ↓
Order status saved to DB
    ↓
OrderStatusHistory record created
    ↓
Socket.IO server emits:
  io.to(`order:${orderId}`).emit('order:update', {
    status: 'READY',
    message: 'Your order is ready for pickup'
  })
    ↓
Customer app receives WebSocket event
    ↓
UI updates automatically (no polling)
```

## Security Architecture

### Authentication Flow

```
1. User Registration
   POST /auth/register
   → Hash password (bcrypt, 10 rounds)
   → Create user in database
   → Generate JWT token
   → Return token + user data

2. User Login
   POST /auth/login
   → Validate credentials
   → Compare password hash
   → Generate access token (7 days)
   → Generate refresh token (30 days)
   → Save refresh token to DB
   → Return tokens

3. Protected Routes
   Request with Authorization: Bearer <token>
   → Middleware extracts token
   → Verify JWT signature
   → Decode payload (userId, email, role)
   → Attach user to req.user
   → Continue to route handler

4. Token Refresh
   POST /auth/refresh
   → Validate refresh token
   → Check token in database
   → Generate new access token
   → Return new token
```

### Authorization (RBAC)

```typescript
Roles:
- SUPER_ADMIN (full system access)
- ADMIN (location-level management)
- MANAGER (staff management, reports)
- EMPLOYEE (orders, cashier functions)
- CUSTOMER (ordering only)

Middleware:
authorize('ADMIN', 'MANAGER')
  → Check req.user.role
  → Allow if role in allowed list
  → Deny with 403 if not authorized
```

## Database Schema Overview

### Core Entities

**Users & Auth**
- users (authentication, profile)
- refresh_tokens (JWT refresh tokens)
- customers (customer-specific data)
- employees (staff data)
- addresses (delivery addresses)

**Menu Management**
- categories (menu categories)
- items (menu items)
- modifier_groups (modifier groups)
- item_modifier_groups (item-modifier relationships)
- modifiers (individual modifiers)

**Orders & Transactions**
- orders (order headers)
- order_items (line items)
- order_item_modifiers (selected modifiers)
- order_status_history (audit trail)
- tables (dine-in tables)

**Payments**
- payments (payment transactions)
- refunds (refund records)

**Loyalty Program**
- loyalty_accounts (customer loyalty data)
- loyalty_transactions (earn/redeem history)
- loyalty_rules (points calculation rules)

**Operations**
- locations (restaurant locations)
- inventory (stock levels)
- stock_movements (inventory transactions)
- purchase_orders (supplier orders)
- deliveries (delivery tracking)
- printers (kitchen printer config)

**Communication**
- notifications (user notifications)
- push_tokens (device tokens for push)
- promotions (discount codes)

### Key Relationships

```sql
users 1:1 customers
users 1:1 employees
users 1:1 loyalty_accounts
users 1:many orders
users 1:many addresses

orders 1:many order_items
order_items 1:many order_item_modifiers
orders 1:many payments
orders 1:1 delivery

categories 1:many items
items many:many modifier_groups (through item_modifier_groups)
modifier_groups 1:many modifiers

locations 1:many categories
locations 1:many orders
locations 1:many employees
locations 1:many inventory
locations 1:many printers
```

## API Design Principles

### RESTful Conventions

- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update entire resource
- **PATCH**: Update partial resource
- **DELETE**: Delete resource (soft delete preferred)

### Response Format

```json
{
  "status": "success" | "error",
  "data": { ... },
  "message": "Optional message",
  "errors": [ ... ]  // For validation errors
}
```

### Error Handling

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof AppError) {
    // Known operational error
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  } else {
    // Unknown error
    logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancer in front
- Redis for session storage
- Socket.IO with Redis adapter

### Caching Strategy
- Menu items cached in Redis (TTL: 5 minutes)
- User sessions in Redis
- Invalidate cache on menu updates

### Database Optimization
- Indexes on foreign keys
- Composite indexes for common queries
- Connection pooling
- Query optimization via Prisma

### Performance Targets
- API response time: < 200ms (P95)
- Order creation: < 500ms
- Real-time updates: < 100ms latency
- Menu loading: < 300ms

## Deployment Architecture

### Production Setup

```
┌─────────────────┐
│  Load Balancer  │
│    (Nginx)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ API  │  │ API  │  (Multiple instances)
│ Node │  │ Node │
└───┬──┘  └──┬───┘
    └────┬────┘
         │
┌────────▼────────┐
│   SQL Server    │
│   (Existing)    │
└─────────────────┘
```

## Integration Points

### POS Database Integration

**Method**: Direct SQL Server connection via Prisma

**Tables to Sync**:
- Menu: categories, items, modifiers → POS menu tables
- Orders: orders, order_items → POS order tables
- Payments: payments → POS payment tables
- Loyalty: loyalty_transactions → POS loyalty table

**Sync Frequency**:
- Menu: Every 60 seconds (polling)
- Orders: Real-time (write immediately)
- Payments: Real-time (transaction critical)
- Loyalty: Real-time (both directions)

### Kitchen Printing Integration

**Protocol**: ESC/POS commands over TCP/IP

**Flow**:
```
Order created
  → Generate ESC/POS commands
  → Send to printer IP:PORT
  → Printer prints ticket
  → POS routing handles distribution
```

## Monitoring & Logging

### Logging Levels
- **ERROR**: Critical errors requiring immediate attention
- **WARN**: Warning conditions
- **INFO**: Informational messages (order created, payment processed)
- **DEBUG**: Detailed debugging information

### Log Destinations
- Console (development)
- File (`logs/combined.log`, `logs/error.log`)
- Log aggregation service (production)

### Metrics to Track
- Request rate (requests/second)
- Response time (P50, P95, P99)
- Error rate
- Order completion rate
- Payment success rate
- Active WebSocket connections



