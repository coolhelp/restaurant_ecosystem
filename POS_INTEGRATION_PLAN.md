# 🖨️ POS Integration Plan - Delphi + SQL Server

## Critical Component: Restaurant POS Synchronization

**Client Requirement:** "Must integrate directly with existing Delphi-based Restaurant POS (SQL Server database)"

---

## 🎯 Integration Requirements

### 1. Menu Sync (POS → Apps)
**Direction:** POS Database → Your System → Apps/Website

**Data to Sync:**
- Categories
- Menu items
- Prices
- Modifiers
- Sub-modifiers
- Availability status
- Images (if stored in POS)

**Method:** Timed polling every 60 seconds

**Implementation:**
```typescript
// Sync service
setInterval(async () => {
  // 1. Query POS SQL Server tables
  const posCategories = await queryPOSDatabase('SELECT * FROM Categories');
  const posItems = await queryPOSDatabase('SELECT * FROM MenuItems');
  const posModifiers = await queryPOSDatabase('SELECT * FROM Modifiers');

  // 2. Compare with your database
  // 3. Update your Prisma database
  // 4. Broadcast changes via Socket.IO to connected apps
}, 60000); // 60 seconds
```

---

### 2. Order Posting (Apps → POS)
**Direction:** Customer App/Website → Your Backend → POS Database

**Data to Write:**
- Order header (customer, timestamp, type)
- Line items (items ordered)
- Modifiers per item
- Tips
- Payment information
- Delivery address (if applicable)
- Special instructions

**Critical:** Must match POS database schema exactly!

**Implementation:**
```typescript
// When order is placed
async function postOrderToPOS(order) {
  // 1. Transform order to POS format
  const posOrder = transformOrderForPOS(order);

  // 2. Write to POS SQL Server tables
  await writeToPOSDatabase(`
    INSERT INTO Orders (OrderID, CustomerID, OrderType, Total, ...)
    VALUES (...)
  `);

  // 3. Write order items
  await writeToPOSDatabase(`
    INSERT INTO OrderItems (OrderID, ItemID, Quantity, ...)
    VALUES (...)
  `);

  // 4. Write modifiers
  // 5. Write payment
  // 6. Trigger kitchen printing
}
```

---

### 3. Kitchen Printing
**Requirement:** "Order must print automatically using existing printer routing"

**How POS Handles It:**
- POS has printer configuration (Kitchen, Bar, Sushi, etc.)
- POS routes items to correct printers based on category
- POS formats and sends to network printers

**Your Job:**
- Write order correctly to POS database
- POS's existing print service detects new order
- POS routes to correct printers automatically

**OR (if POS doesn't auto-print):**
```typescript
// Trigger POS print via stored procedure
await executePOSStoredProcedure('sp_PrintKitchenTicket', [orderId]);
```

---

### 4. Order Status Sync (POS → Apps)
**Direction:** POS Database → Your System → Apps/Website

**Statuses to Track:**
- Order received
- Preparing
- Ready
- Out for delivery
- Completed
- Cancelled

**Methods:**

**Option A: Polling (Simpler)**
```typescript
setInterval(async () => {
  const updatedOrders = await queryPOSDatabase(`
    SELECT OrderID, Status, UpdatedAt
    FROM Orders
    WHERE UpdatedAt > @lastCheckTime
  `);

  // Update your database
  // Push to clients via Socket.IO
}, 5000); // Every 5 seconds
```

**Option B: Triggers (Better)**
```sql
-- SQL Server Trigger
CREATE TRIGGER trg_OrderStatusUpdate
ON Orders
AFTER UPDATE
AS
BEGIN
  -- Call your API webhook
  EXEC sp_CallWebhook 'http://your-api/webhooks/order-status'
END
```

---

### 5. Loyalty Points Sync

**Bidirectional Sync:**

**Earning Points (Order Placed):**
```
Customer App → Your Backend → Calculate Points → Write to POS → Write to Your DB
```

**Redeeming Points (At Checkout):**
```
Customer App → Your Backend → Deduct Points → Update POS → Update Your DB
```

**Implementation:**
```typescript
// After order completion
async function syncLoyaltyPoints(userId, orderTotal) {
  const points = calculatePoints(orderTotal); // e.g., 1 point per dollar

  // 1. Update your database
  await prisma.loyaltyAccount.update({
    where: { userId },
    data: { pointsBalance: { increment: points } }
  });

  // 2. Update POS database
  await updatePOSDatabase(`
    UPDATE CustomerLoyalty
    SET Points = Points + ${points}
    WHERE CustomerID = ${posCustomerId}
  `);
}
```

---

## 🏗️ Architecture Options

### Option 1: Direct SQL Server Connection (Simpler)
```
Your Backend (Node.js)
  ↓ (mssql package)
SQL Server (POS Database)
  ↓ (read/write)
POS Tables
```

**Pros:**
- Direct access
- Faster
- No additional layer

**Cons:**
- Risk of breaking POS
- Need exact schema knowledge
- Tightly coupled

**Packages:**
```bash
npm install mssql
```

### Option 2: API Middleware Layer (Safer)
```
Your Backend (Node.js)
  ↓ HTTP/REST
.NET Middleware API
  ↓ SQL queries
SQL Server (POS Database)
```

**Pros:**
- Safer (POS protected)
- .NET better for SQL Server
- Business logic in middleware
- Can add validation

**Cons:**
- Extra layer to maintain
- Slightly slower

**Recommended:** Option 2 (safer for production)

---

## 📋 POS Database Schema Discovery

### Steps to Understand POS:

1. **Get Database Access**
   - SQL Server connection string
   - Read-only account (initially)
   - Database name

2. **Explore Schema**
   ```sql
   -- List all tables
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;

   -- Explore key tables
   SELECT * FROM Categories;
   SELECT * FROM MenuItems;
   SELECT * FROM Orders;
   SELECT * FROM OrderItems;
   SELECT * FROM Customers;
   ```

3. **Document Structure**
   - Table names
   - Column names & types
   - Relationships
   - Constraints
   - Triggers/procedures

4. **Map to Your Schema**
   ```
   POS Table         Your Table
   -----------       -----------
   Categories    →   Category
   MenuItems     →   Item
   MenuModifiers →   Modifier
   Orders        →   Order
   OrderItems    →   OrderItem
   Customers     →   User/Customer
   ```

---

## 🔧 Implementation Steps

### Phase 1: Read-Only Integration (Week 1)
1. Connect to SQL Server (read-only)
2. Query menu data
3. Transform to your format
4. Sync to your database
5. Test menu appears in app

### Phase 2: Write Integration (Week 2)
1. Get write permissions
2. Understand order table structure
3. Implement order posting
4. Test order appears in POS
5. Verify kitchen printing

### Phase 3: Real-time Sync (Week 3)
1. Implement status polling/triggers
2. Setup loyalty sync
3. Test bidirectional updates
4. Performance optimization

### Phase 4: Production Hardening
1. Error handling
2. Retry logic
3. Logging
4. Monitoring
5. Backup sync mechanism

---

## 🛡️ Risk Mitigation

### Critical Risks:

**Risk 1: Breaking POS System**
- **Mitigation:** Use read-only account first
- Test all writes in staging
- Have rollback plan
- Keep POS team informed

**Risk 2: Schema Mismatch**
- **Mitigation:** Thorough documentation
- Field-by-field mapping
- Extensive testing
- Validation before writes

**Risk 3: Performance Impact**
- **Mitigation:** Optimize queries
- Use indexing
- Batch operations
- Off-peak sync for heavy operations

**Risk 4: Data Integrity**
- **Mitigation:** Transactions
- Validation
- Checksums
- Audit logging

---

## 📝 Code Examples

### Connect to SQL Server:
```typescript
import sql from 'mssql';

const config = {
  user: process.env.POS_DB_USER,
  password: process.env.POS_DB_PASSWORD,
  server: process.env.POS_DB_SERVER,
  database: process.env.POS_DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const pool = await sql.connect(config);
```

### Query Menu Data:
```typescript
async function syncMenuFromPOS() {
  const result = await pool.request().query(`
    SELECT 
      ItemID,
      Name,
      Description,
      Price,
      CategoryID,
      IsAvailable
    FROM MenuItems
    WHERE IsActive = 1
  `);

  for (const row of result.recordset) {
    await prisma.item.upsert({
      where: { sku: row.ItemID.toString() },
      update: {
        name: row.Name,
        basePrice: row.Price,
        isAvailable: row.IsAvailable
      },
      create: {
        // ...
      }
    });
  }
}
```

### Post Order to POS:
```typescript
async function postOrderToPOS(order) {
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();

    // Insert order header
    await transaction.request()
      .input('orderNumber', sql.VarChar, order.orderNumber)
      .input('total', sql.Decimal(10, 2), order.total)
      .input('orderType', sql.VarChar, order.orderType)
      .query(`
        INSERT INTO Orders (OrderNumber, Total, OrderType, CreatedAt)
        VALUES (@orderNumber, @total, @orderType, GETDATE())
      `);

    // Insert order items
    for (const item of order.items) {
      await transaction.request()
        .input('orderNumber', sql.VarChar, order.orderNumber)
        .input('itemId', sql.Int, item.itemId)
        .input('quantity', sql.Int, item.quantity)
        .query(`
          INSERT INTO OrderItems (OrderNumber, ItemID, Quantity)
          VALUES (@orderNumber, @itemId, @quantity)
        `);
    }

    await transaction.commit();

    // Trigger kitchen print
    await triggerKitchenPrint(order.orderNumber);

  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
```

---

## 🧪 Testing Strategy

### Integration Tests:
1. **Menu Sync Test**
   - Add item in POS
   - Wait 60 seconds
   - Verify appears in app

2. **Order Post Test**
   - Place order in app
   - Verify in POS database
   - Check kitchen printed

3. **Status Sync Test**
   - Update status in POS
   - Verify updates in app

4. **Loyalty Sync Test**
   - Earn points in app
   - Verify in POS
   - Redeem in app
   - Verify deduction in POS

---

## 📊 Timeline & Deliverables

### Week 5: POS Integration
- **Day 1-2:** Database analysis & schema mapping
- **Day 3:** Menu sync implementation
- **Day 4:** Order posting implementation
- **Day 5:** Kitchen printing integration
- **Day 6:** Status sync implementation
- **Day 7:** Loyalty sync implementation
- **Day 8:** Testing & refinement

### Deliverables:
- [ ] Sync service (Node.js or .NET)
- [ ] Database connection layer
- [ ] Menu sync scheduler
- [ ] Order posting service
- [ ] Kitchen print trigger
- [ ] Status polling service
- [ ] Loyalty sync service
- [ ] Integration documentation
- [ ] Testing results
- [ ] Rollback procedures

---

## 🎓 Knowledge Requirements

### You Need:
- POS database schema documentation
- Sample data from POS
- Test environment access
- Kitchen printer configuration
- POS vendor contact (for support)

### Questions for Client:
1. Can you provide POS database schema?
2. Do you have a test/staging POS environment?
3. What version of SQL Server?
4. Can you provide sample data exports?
5. Who manages the POS system?
6. What's the kitchen printer setup?
7. Any existing POS API or just database?

---

## ⚠️ Important Considerations

### Data Mapping Challenges:
- Different ID formats (UUID vs INT)
- Different field names
- Different data types
- Different relationships
- Different business rules

### Solutions:
- **Mapping Table:** Store POS ID ↔ Your ID
- **Transform Layer:** Convert between formats
- **Validation:** Ensure data integrity
- **Logging:** Track all sync operations

### Example Mapping Table:
```sql
CREATE TABLE POSItemMapping (
  ourItemId UUID PRIMARY KEY,
  posItemId INT NOT NULL,
  lastSynced TIMESTAMP,
  UNIQUE(posItemId)
);
```

---

## 🎯 Success Criteria

### Must Work:
✅ Order from app → Appears in POS within 1 second  
✅ Order from app → Prints in kitchen automatically  
✅ Menu edited in admin → Syncs to POS within 60 seconds  
✅ Status updated in POS → Reflects in app within 5 seconds  
✅ Loyalty points sync bidirectionally  
✅ No data corruption  
✅ No POS system disruption  

---

## 💪 Confidence Level

**Given Your Backend:**
- ✅ Data models align with POS concepts
- ✅ API layer ready
- ✅ Real-time infrastructure (Socket.IO)
- ✅ Proper error handling
- ✅ Logging system

**Estimated Success:** High (90%+)

**Timeline:** 8-10 days with POS access

---

This is the most critical part of the project. With proper POS access and documentation, it's very achievable! 🚀

