# 🗄️ POS Database Schema & Integration Mapping

## POS Database Schema (SQL Server)

### Assumed POS Tables (Based on Common Restaurant POS Systems)

#### 1. POS Categories Table
```sql
CREATE TABLE POSCategories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    DisplayOrder INT DEFAULT 0,
    Active BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
```

#### 2. POS Menu Items Table
```sql
CREATE TABLE POSMenuItems (
    ItemID INT PRIMARY KEY IDENTITY(1,1),
    ItemName NVARCHAR(200) NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES POSCategories(CategoryID),
    Description NVARCHAR(500),
    Price DECIMAL(10,2) NOT NULL,
    Cost DECIMAL(10,2),
    SKU NVARCHAR(50),
    Active BIT DEFAULT 1,
    Available BIT DEFAULT 1,
    PrepTime INT, -- minutes
    Calories INT,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
```

#### 3. POS Modifiers Table
```sql
CREATE TABLE POSModifiers (
    ModifierID INT PRIMARY KEY IDENTITY(1,1),
    ModifierGroupID INT,
    ModifierName NVARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) DEFAULT 0,
    Active BIT DEFAULT 1,
    DisplayOrder INT DEFAULT 0
);
```

#### 4. POS Orders Table
```sql
CREATE TABLE POSOrders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    OrderNumber NVARCHAR(50) UNIQUE NOT NULL,
    CustomerID INT,
    OrderType NVARCHAR(20), -- 'Dine-In', 'Takeout', 'Delivery'
    OrderStatus NVARCHAR(20), -- 'Pending', 'Confirmed', 'Completed', etc.
    SubTotal DECIMAL(10,2),
    Tax DECIMAL(10,2),
    Tip DECIMAL(10,2) DEFAULT 0,
    DeliveryFee DECIMAL(10,2) DEFAULT 0,
    Discount DECIMAL(10,2) DEFAULT 0,
    Total DECIMAL(10,2),
    PaymentStatus NVARCHAR(20),
    OrderDate DATETIME DEFAULT GETDATE(),
    CompletedDate DATETIME,
    TableNumber NVARCHAR(20),
    SpecialInstructions NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
```

#### 5. POS Order Items Table
```sql
CREATE TABLE POSOrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES POSOrders(OrderID),
    ItemID INT FOREIGN KEY REFERENCES POSMenuItems(ItemID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2),
    SubTotal DECIMAL(10,2),
    SpecialInstructions NVARCHAR(200)
);
```

#### 6. POS Order Item Modifiers Table
```sql
CREATE TABLE POSOrderItemModifiers (
    OrderItemModifierID INT PRIMARY KEY IDENTITY(1,1),
    OrderItemID INT FOREIGN KEY REFERENCES POSOrderItems(OrderItemID),
    ModifierID INT FOREIGN KEY REFERENCES POSModifiers(ModifierID),
    Quantity INT DEFAULT 1,
    Price DECIMAL(10,2)
);
```

#### 7. POS Customers Table
```sql
CREATE TABLE POSCustomers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Email NVARCHAR(100) UNIQUE,
    Phone NVARCHAR(20),
    LoyaltyPoints INT DEFAULT 0,
    LoyaltyTier NVARCHAR(20) DEFAULT 'Bronze',
    TotalOrders INT DEFAULT 0,
    TotalSpent DECIMAL(10,2) DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    LastOrderDate DATETIME
);
```

#### 8. POS Payments Table
```sql
CREATE TABLE POSPayments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES POSOrders(OrderID),
    PaymentMethod NVARCHAR(20), -- 'Credit', 'Debit', 'Cash', etc.
    Amount DECIMAL(10,2),
    TransactionID NVARCHAR(100),
    AuthCode NVARCHAR(50),
    CardLast4 NVARCHAR(4),
    PaymentStatus NVARCHAR(20),
    ProcessedDate DATETIME DEFAULT GETDATE()
);
```

#### 9. POS Print Queue Table
```sql
CREATE TABLE POSPrintQueue (
    PrintJobID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    PrinterID INT,
    TicketData NVARCHAR(MAX), -- Formatted ticket content
    Priority INT DEFAULT 1, -- 1=High, 2=Normal, 3=Low
    Status NVARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Printed', 'Error'
    CreatedDate DATETIME DEFAULT GETDATE(),
    PrintedDate DATETIME
);
```

#### 10. POS Printers Table
```sql
CREATE TABLE POSPrinters (
    PrinterID INT PRIMARY KEY IDENTITY(1,1),
    PrinterName NVARCHAR(50),
    PrinterType NVARCHAR(20), -- 'Kitchen', 'Bar', 'Receipt', 'Expo'
    IPAddress NVARCHAR(15),
    Port INT DEFAULT 9100,
    Active BIT DEFAULT 1
);
```

---

## OUR Database Schema (Prisma)

### Complete schema in: `apps/backend/prisma/schema.prisma`

**Tables:** 20+ tables covering all business logic
**See:** DATABASE_SCHEMA_DIAGRAM.md for visual representation

---

## Field Mapping: POS ↔ Our System

### Categories Mapping
| POS Field | POS Type | Our Field | Our Type | Transform |
|-----------|----------|-----------|----------|-----------|
| CategoryID | INT | sku | String | toString() |
| CategoryName | NVARCHAR | name | String | direct |
| DisplayOrder | INT | sortOrder | Int | direct |
| Active | BIT | isActive | Boolean | convert |

### Menu Items Mapping
| POS Field | POS Type | Our Field | Our Type | Transform |
|-----------|----------|-----------|----------|-----------|
| ItemID | INT | sku | String | toString() |
| ItemName | NVARCHAR | name | String | direct |
| CategoryID | INT | categoryId | String | toString() |
| Description | NVARCHAR | description | String | direct |
| Price | DECIMAL(10,2) | basePrice | Decimal | direct |
| Active | BIT | isActive | Boolean | convert |
| Available | BIT | isAvailable | Boolean | convert |

### Orders Mapping
| POS Field | POS Type | Our Field | Our Type | Transform |
|-----------|----------|-----------|----------|-----------|
| OrderID | INT | externalId | String | toString() |
| OrderNumber | NVARCHAR | orderNumber | String | direct |
| OrderType | NVARCHAR | orderType | Enum | map enum |
| OrderStatus | NVARCHAR | orderStatus | Enum | map enum |
| SubTotal | DECIMAL | subtotal | Decimal | direct |
| Tax | DECIMAL | taxAmount | Decimal | direct |
| Total | DECIMAL | total | Decimal | direct |

### Customer Mapping
| POS Field | POS Type | Our Field | Our Type | Transform |
|-----------|----------|-----------|----------|-----------|
| CustomerID | INT | externalId | String | toString() |
| Email | NVARCHAR | email | String | direct |
| FirstName | NVARCHAR | firstName | String | direct |
| LastName | NVARCHAR | lastName | String | direct |
| LoyaltyPoints | INT | pointsBalance | Int | direct |

---

## Integration ID Mapping Table

### We need a mapping table to correlate IDs:

```sql
-- In Our Database
CREATE TABLE POSEntityMapping (
    id UUID PRIMARY KEY,
    entityType VARCHAR(50), -- 'category', 'item', 'customer', 'order'
    ourId UUID NOT NULL,
    posId INT NOT NULL,
    lastSynced TIMESTAMP DEFAULT NOW(),
    UNIQUE(entityType, ourId),
    UNIQUE(entityType, posId)
);
```

### Usage Example:
```typescript
// When syncing menu item from POS
const mapping = await findMapping('item', null, posItemId);
if (mapping) {
  // Update existing item
  await updateItem(mapping.ourId, posData);
} else {
  // Create new item
  const newItem = await createItem(posData);
  await createMapping('item', newItem.id, posItemId);
}
```

---

## Sync Strategies

### 1. Menu Sync (POS → Our DB)
**Frequency:** Every 60 seconds
**Method:** Polling

```typescript
async function syncMenuFromPOS() {
  const posItems = await queryPOS(`
    SELECT i.*, c.CategoryName
    FROM POSMenuItems i
    JOIN POSCategories c ON i.CategoryID = c.CategoryID
    WHERE i.ModifiedDate > @lastSync
  `);

  for (const posItem of posItems) {
    const mapping = await getMapping('item', posItem.ItemID);
    
    if (mapping) {
      // Update existing
      await prisma.item.update({
        where: { id: mapping.ourId },
        data: {
          name: posItem.ItemName,
          basePrice: posItem.Price,
          isAvailable: posItem.Available
        }
      });
    } else {
      // Create new
      const newItem = await prisma.item.create({
        data: transformPOSItem(posItem)
      });
      await createMapping('item', newItem.id, posItem.ItemID);
    }
  }
}
```

### 2. Order Posting (Our DB → POS)
**Frequency:** Immediate (on order creation)
**Method:** Direct write

```typescript
async function postOrderToPOS(order) {
  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    // 1. Insert order header
    const result = await transaction.request()
      .input('orderNumber', order.orderNumber)
      .input('total', order.total)
      .input('orderType', order.orderType)
      .query(`
        INSERT INTO POSOrders (OrderNumber, OrderType, Total, ...)
        OUTPUT INSERTED.OrderID
        VALUES (@orderNumber, @orderType, @total, ...)
      `);

    const posOrderId = result.recordset[0].OrderID;

    // 2. Insert order items
    for (const item of order.items) {
      const posItemId = await getPOSItemId(item.itemId);
      
      await transaction.request()
        .input('orderId', posOrderId)
        .input('itemId', posItemId)
        .input('quantity', item.quantity)
        .query(`
          INSERT INTO POSOrderItems (OrderID, ItemID, Quantity, ...)
          VALUES (@orderId, @itemId, @quantity, ...)
        `);
    }

    // 3. Trigger kitchen print
    await transaction.request()
      .input('orderId', posOrderId)
      .input('printerId', 1) // Kitchen printer
      .query(`
        INSERT INTO POSPrintQueue (OrderID, PrinterID, Status)
        VALUES (@orderId, @printerId, 'Pending')
      `);

    await transaction.commit();

    // 4. Store mapping
    await createMapping('order', order.id, posOrderId);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### 3. Status Sync (POS → Our DB)
**Frequency:** Every 5 seconds
**Method:** Polling changed records

```typescript
async function syncOrderStatus() {
  const changedOrders = await queryPOS(`
    SELECT OrderID, OrderStatus, ModifiedDate
    FROM POSOrders
    WHERE ModifiedDate > @lastCheck
  `);

  for (const posOrder of changedOrders) {
    const mapping = await getMapping('order', null, posOrder.OrderID);
    
    if (mapping) {
      // Update our order status
      await prisma.order.update({
        where: { id: mapping.ourId },
        data: {
          orderStatus: mapPOSStatus(posOrder.OrderStatus)
        }
      });

      // Emit Socket.IO event
      io.to(`order:${mapping.ourId}`)
        .emit('order:updated', {
          orderId: mapping.ourId,
          status: posOrder.OrderStatus
        });
    }
  }
}
```

### 4. Loyalty Sync (Bidirectional)
**Frequency:** Immediate on transactions
**Method:** Direct read/write

```typescript
// When awarding points (Our DB → POS)
async function syncLoyaltyPointsEarned(userId, points) {
  const posCustomerId = await getPOSCustomerId(userId);

  await updatePOS(`
    UPDATE POSCustomers
    SET LoyaltyPoints = LoyaltyPoints + @points,
        TotalOrders = TotalOrders + 1,
        TotalSpent = TotalSpent + @orderTotal,
        LastOrderDate = GETDATE()
    WHERE CustomerID = @posCustomerId
  `, { posCustomerId, points, orderTotal });
}

// When redeeming points (Check POS first)
async function syncLoyaltyPointsRedeemed(userId, points) {
  const posCustomerId = await getPOSCustomerId(userId);

  // Verify balance in POS
  const posBalance = await queryPOS(`
    SELECT LoyaltyPoints
    FROM POSCustomers
    WHERE CustomerID = @posCustomerId
  `);

  if (posBalance.LoyaltyPoints < points) {
    throw new Error('Insufficient points in POS');
  }

  // Deduct from POS
  await updatePOS(`
    UPDATE POSCustomers
    SET LoyaltyPoints = LoyaltyPoints - @points
    WHERE CustomerID = @posCustomerId
  `, { posCustomerId, points });
}
```

---

## Kitchen Printing Integration

### Method 1: POS Print Queue (Recommended)
```
Our Backend → Insert into POSPrintQueue → POS Service Detects → Routes to Printer
```

**Advantages:**
- Uses POS's existing routing logic
- POS handles printer configuration
- POS manages print jobs
- Less chance of breaking things

### Method 2: Direct Network Printing
```
Our Backend → Format ESC/POS commands → Send to Printer IP:9100
```

**Advantages:**
- Direct control
- Faster (no POS middleman)
- Can customize ticket format

**Disadvantages:**
- Need to manage printer config
- Need to handle routing logic
- Bypass POS system

**Recommendation: Use Method 1 (POS Print Queue)**

---

## Ticket Format Example

```
╔═══════════════════════════════════╗
║      TASTYBITES RESTAURANT        ║
║         KITCHEN TICKET            ║
╠═══════════════════════════════════╣
║ Order #: ORD-2025-001234          ║
║ Type: DELIVERY                     ║
║ Time: 12:34 PM                    ║
║ Server: Online Order              ║
╠═══════════════════════════════════╣
║                                    ║
║ 1x MARGHERITA PIZZA               ║
║    + Extra Cheese                 ║
║    + Basil                        ║
║                                    ║
║ 2x BEEF BURGER                    ║
║    + No Onions                    ║
║    + Extra Pickles                ║
║                                    ║
║ 1x CAESAR SALAD                   ║
║    - Croutons                     ║
║                                    ║
╠═══════════════════════════════════╣
║ SPECIAL INSTRUCTIONS:             ║
║ Please make burgers well-done     ║
║ Extra napkins please              ║
╠═══════════════════════════════════╣
║ DELIVERY ADDRESS:                 ║
║ 123 Main Street, Apt 4B           ║
║ New York, NY 10001                ║
║ Phone: (555) 123-4567             ║
╠═══════════════════════════════════╣
║ ** RUSH ORDER - 30 MIN **         ║
╚═══════════════════════════════════╝

Time: 12:34:56 PM
```

---

## Data Synchronization Rules

### Conflict Resolution

**Menu Data (POS is source of truth):**
- POS price changes → Always update our DB
- Our DB changes → Don't sync back to POS
- Admin portal edits → Only update our DB (availability, images)

**Order Data (Our system is source):**
- Orders created in our system → Post to POS
- Orders from POS register → Import to our system (if applicable)
- Status updates from POS → Sync to our DB

**Loyalty Data (Bidirectional sync):**
- Points earned → Update both systems
- Points redeemed → Check POS first, then update both
- Use POS as tie-breaker if mismatch

### Sync Verification

```typescript
// Periodic audit check (daily)
async function auditLoyaltySync() {
  const customers = await getCustomersWithLoyalty();

  for (const customer of customers) {
    const ourBalance = customer.loyaltyAccount.pointsBalance;
    const posBalance = await getPOSLoyaltyBalance(customer.posCustomerId);

    if (ourBalance !== posBalance) {
      logger.warn(`Loyalty mismatch for customer ${customer.id}`);
      logger.warn(`Our DB: ${ourBalance}, POS: ${posBalance}`);
      
      // Resolution: Use POS as source of truth
      await prisma.loyaltyAccount.update({
        where: { userId: customer.id },
        data: { pointsBalance: posBalance }
      });
    }
  }
}
```

---

## Error Handling for POS Integration

### Connection Errors
```typescript
try {
  const result = await queryPOS(sql);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    logger.error('POS database unreachable');
    // Fallback: Queue operation for retry
    await queuePOSOperation(operation);
  } else if (error.code === 'ETIMEOUT') {
    logger.error('POS database timeout');
    // Retry with exponential backoff
    await retryWithBackoff(() => queryPOS(sql));
  } else {
    throw error;
  }
}
```

### Transaction Failures
- Use database transactions
- Rollback on failure
- Log all errors
- Alert admin if critical
- Queue for manual review

### Sync Lag Handling
- Track last successful sync time
- Alert if sync lag > 5 minutes
- Provide manual sync trigger in admin
- Display sync status in UI

---

## Performance Considerations

### Query Optimization
```sql
-- Add indexes for sync queries
CREATE INDEX idx_modified_date ON POSMenuItems(ModifiedDate);
CREATE INDEX idx_order_date ON POSOrders(OrderDate);
CREATE INDEX idx_customer_email ON POSCustomers(Email);
```

### Connection Pooling
```typescript
const pool = new sql.ConnectionPool({
  ...config,
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000
  }
});
```

### Batch Operations
```typescript
// Instead of individual updates
for (const item of items) {
  await update(item); // ❌ N queries
}

// Use bulk operations
await bulkUpdate(items); // ✅ 1 query
```

---

## Testing Strategy

### Unit Tests
- Test data transformation functions
- Test mapping logic
- Test error handling

### Integration Tests
- Test POS connection
- Test menu sync
- Test order posting
- Test status sync
- Test loyalty sync

### End-to-End Tests
1. Place order in app
2. Verify in POS database
3. Verify kitchen ticket prints
4. Update status in POS
5. Verify app updates

---

## Monitoring & Alerts

### Metrics to Track
- Sync success rate
- Sync latency
- Failed operations count
- POS connection uptime
- Print queue depth

### Alerts to Configure
- POS connection down > 5 minutes
- Sync failed 3 times in a row
- Print queue backing up
- Loyalty points mismatch detected
- Order posting failure

---

## Rollback & Recovery

### If POS Integration Breaks:
1. System continues working (our DB)
2. Queue operations for later sync
3. Manual sync tool in admin portal
4. Alert sent to technical team
5. Customer experience unaffected

### Manual Sync Tools (Admin Portal)
- Force menu sync button
- Retry failed order posts
- Reconcile loyalty points
- View sync logs
- Download error reports

---

This comprehensive mapping ensures seamless POS integration! 🔗

