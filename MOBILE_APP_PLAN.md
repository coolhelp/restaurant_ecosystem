# 📱 Mobile Apps Development Plan

## Overview
Two React Native applications needed:
1. **Customer Mobile App** (iOS + Android)
2. **Delivery Driver App** (iOS + Android)

---

## 1. Customer Mobile App

### Tech Stack
- **Framework:** React Native (0.73+)
- **Navigation:** React Navigation 6
- **State:** Zustand (same as web)
- **API:** Axios (reuse web API client)
- **Forms:** React Hook Form + Zod
- **Icons:** React Native Vector Icons
- **Maps:** React Native Maps
- **Notifications:** Firebase Cloud Messaging
- **Auth:** AsyncStorage for tokens
- **Image Picker:** React Native Image Picker
- **Geolocation:** React Native Geolocation

### Screens Required (Matches Web App)

#### Authentication Flow
1. Splash Screen
2. Onboarding (3 screens)
3. Login Screen
4. Register Screen
5. Forgot Password

#### Main App Flow
6. Home/Dashboard
7. Menu Browse
8. Category Filter
9. Item Detail (with modifiers)
10. Cart
11. Checkout
12. Address Management
13. Payment Methods
14. Order Confirmation
15. Order Tracking (Real-time)
16. Order History
17. Order Detail
18. Profile
19. Favorites
20. Loyalty Points
21. Notifications
22. Settings

**Total: 22 Screens**

### Features Implementation

#### Core Features:
```typescript
✅ User Authentication
  - Login with email/password
  - Social login (Google, Facebook)
  - Biometric login (FaceID/TouchID)
  - JWT token management

✅ Menu Browsing
  - Category navigation
  - Item search
  - Filters (price, dietary, etc.)
  - Item images
  - Modifiers selection
  - Sub-modifiers support

✅ Shopping Cart
  - Add/remove items
  - Quantity adjustment
  - Modifiers display
  - Special instructions
  - Price calculations
  - Persistent storage

✅ Checkout Process
  - Order type selection (Pickup/Delivery/Dine-in)
  - Address selection
  - New address (with map picker)
  - Payment method
  - Tip selection
  - Order review
  - Place order

✅ Order Tracking
  - Real-time status updates
  - Push notifications
  - Progress timeline
  - Estimated time
  - Driver location (for delivery)
  - Contact driver/restaurant

✅ Loyalty Program
  - Points balance display
  - Points history
  - Tier status
  - Rewards catalog
  - Redeem points at checkout

✅ Profile Management
  - Edit personal info
  - Change password
  - Manage addresses
  - Payment methods
  - Notification preferences

✅ Push Notifications
  - Order updates
  - Promotional offers
  - Loyalty rewards
  - App updates
```

### Navigation Structure
```
Stack Navigator
├── Auth Stack (not logged in)
│   ├── Splash
│   ├── Onboarding
│   ├── Login
│   └── Register
│
└── App Stack (logged in)
    ├── Tab Navigator
    │   ├── Home
    │   ├── Menu
    │   ├── Orders
    │   ├── Loyalty
    │   └── Profile
    │
    ├── Modal Stack
    │   ├── Item Detail
    │   ├── Cart
    │   ├── Checkout
    │   ├── Address Form
    │   └── Notifications
    │
    └── Screen Stack
        ├── Order Detail
        ├── Order Tracking
        ├── Favorites
        └── Settings
```

### File Structure
```
apps/mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── main/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── OrdersScreen.tsx
│   │   │   ├── LoyaltyScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── cart/
│   │   │   ├── CartScreen.tsx
│   │   │   └── CheckoutScreen.tsx
│   │   └── orders/
│   │       ├── OrderDetailScreen.tsx
│   │       └── OrderTrackingScreen.tsx
│   │
│   ├── components/
│   │   ├── MenuItem.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderCard.tsx
│   │   ├── AddressCard.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   │
│   ├── store/
│   │   ├── authStore.ts (from web)
│   │   ├── cartStore.ts (from web)
│   │   └── favoritesStore.ts (from web)
│   │
│   ├── services/
│   │   ├── api.ts (from web)
│   │   ├── apiServices.ts (from web)
│   │   ├── pushNotifications.ts
│   │   └── geolocation.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── types/ (from web)
│
├── android/
├── ios/
└── package.json
```

### Estimated Timeline
- **Setup & Configuration:** 1 day
- **Authentication Screens:** 2 days
- **Main Screens (Home, Menu, Orders):** 3 days
- **Cart & Checkout:** 2 days
- **Order Tracking:** 2 days
- **Profile & Settings:** 1 day
- **Loyalty System:** 1 day
- **Push Notifications:** 1 day
- **Testing & Polish:** 2 days
- **App Store Submission:** 1 day

**Total: 16 days (2.5 weeks)**

---

## 2. Delivery Driver App

### Tech Stack
- **Framework:** React Native
- **Maps:** React Native Maps + Google Maps API
- **Navigation:** React Navigation
- **State:** Zustand
- **Push:** Firebase Cloud Messaging

### Screens Required

1. Login Screen
2. Dashboard (Assigned Orders)
3. Order Detail
4. Navigation/Map View
5. Delivery Confirmation
6. Delivery History
7. Earnings Summary
8. Profile
9. Settings

**Total: 9 Screens**

### Features

```typescript
✅ Driver Authentication
  - Login with employee code
  - Biometric login
  - Auto-logout on inactive

✅ Order Management
  - View assigned orders
  - Accept/decline orders
  - Order details view
  - Customer contact info
  - Delivery address

✅ Navigation & Tracking
  - Route to pickup location
  - Route to delivery address
  - Real-time location tracking
  - ETA calculation
  - Turn-by-turn navigation

✅ Status Updates
  - Mark as picked up
  - Mark as on the way
  - Mark as delivered
  - Upload proof of delivery (photo)
  - Customer signature

✅ Communication
  - Call customer
  - Call restaurant
  - In-app messaging

✅ History & Earnings
  - Delivery history
  - Daily earnings
  - Tips received
  - Distance traveled
  - Performance metrics

✅ Push Notifications
  - New order assigned
  - Order cancelled
  - Customer messages
  - Shift reminders
```

### File Structure
```
apps/delivery-app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── OrderDetailScreen.tsx
│   │   ├── NavigationScreen.tsx
│   │   ├── DeliveryHistoryScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── MapView.tsx
│   │   └── StatusButton.tsx
│   │
│   └── services/
│       ├── api.ts
│       ├── geolocation.ts
│       └── pushNotifications.ts
│
├── android/
└── ios/
```

### Estimated Timeline
- **Setup:** 1 day
- **Authentication:** 1 day
- **Order Management:** 2 days
- **Map Integration:** 2 days
- **Status Updates:** 1 day
- **History & Earnings:** 1 day
- **Testing & Polish:** 1 day

**Total: 9 days (1.5 weeks)**

---

## 🔔 Push Notifications Setup

### Firebase Cloud Messaging

**Backend:**
```typescript
// Already in your backend
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send notification
await admin.messaging().send({
  token: deviceToken,
  notification: {
    title: 'Order Update',
    body: 'Your order is being prepared!'
  },
  data: {
    orderId: '123',
    type: 'order_update'
  }
});
```

**Mobile App:**
```typescript
import messaging from '@react-native-firebase/messaging';

// Request permission
const authStatus = await messaging().requestPermission();

// Get FCM token
const token = await messaging().getToken();

// Listen for messages
messaging().onMessage(async remoteMessage => {
  // Show local notification
});
```

---

## 📦 Shared Code Strategy

### Reusable from Web:
- ✅ Type definitions (`types/`)
- ✅ API client (`lib/api.ts`)
- ✅ API services (`lib/apiServices.ts`)
- ✅ Zustand stores (`store/`)
- ✅ Validation schemas
- ✅ Utility functions
- ✅ Constants

### Mobile-Specific:
- Navigation setup
- Native modules
- Push notifications
- Map integration
- Camera/image picker
- Biometric auth
- Deep linking

---

## 🎨 Design Consistency

### Colors (Same as Web)
- Primary: #FF6B6B
- Secondary: #4ECDC4
- Accent: #FFE66D

### Components
- Match web design language
- Adapt for mobile patterns
- Touch-friendly sizes (44pt minimum)
- Native animations
- Platform-specific patterns (iOS vs Android)

---

## 🚀 Development Strategy

### Week 1: Customer Mobile App
- Day 1-2: Setup & Auth
- Day 3-5: Main features
- Day 6-7: Polish & test

### Week 2: Delivery App + Submissions
- Day 1-3: Delivery app
- Day 4-5: Testing both apps
- Day 6-7: App store submissions

### Key Decisions:
- Use Expo or bare React Native?
  **Recommendation: Bare React Native** (for full control)

- Native modules needed?
  - Maps (yes)
  - Push (yes)
  - Biometric (optional)
  - Camera (yes, for driver)

- Code sharing approach?
  - Monorepo with shared packages
  - Import from `@restaurant/shared`

---

## 📊 Estimated Effort

| Task | Hours | Days |
|------|-------|------|
| Customer App Setup | 8 | 1 |
| Customer App Screens | 64 | 8 |
| Customer App Testing | 16 | 2 |
| Delivery App Setup | 4 | 0.5 |
| Delivery App Screens | 32 | 4 |
| Delivery App Testing | 8 | 1 |
| Push Notifications | 16 | 2 |
| App Store Prep | 8 | 1 |
| **TOTAL** | **156** | **19.5** |

**Timeline: ~3 weeks (with buffer)**

---

## ✅ Success Criteria

### Customer App:
- [ ] All features from web app work
- [ ] Smooth 60fps animations
- [ ] Push notifications functional
- [ ] Works offline (cached menu)
- [ ] App size < 50MB
- [ ] Passes App Store review
- [ ] Passes Google Play review

### Delivery App:
- [ ] Drivers can view assigned orders
- [ ] Real-time location tracking
- [ ] Status updates work
- [ ] Navigation integration
- [ ] Photo upload works
- [ ] Earnings tracking accurate

---

## 🎯 Next Actions

1. **Create React Native Projects**
   ```bash
   npx react-native init CustomerApp
   npx react-native init DeliveryApp
   ```

2. **Setup Shared Package**
   ```bash
   mkdir packages/shared
   # Move reusable code
   ```

3. **Configure Firebase**
   - Create Firebase project
   - Add iOS and Android apps
   - Download config files

4. **Setup Navigation**
   - Install React Navigation
   - Configure stack, tab, drawer navigators

5. **Implement Screens** (Systematic approach)
   - Start with Auth
   - Then Home/Menu
   - Then Cart/Checkout
   - Then Orders/Tracking
   - Finally Profile/Settings

---

## 💰 Value Proposition

**Customer Mobile App:**
- **Development:** ~$1,800
- **Features:** All web features + native capabilities
- **Deliverable:** iOS .ipa + Android .aab
- **Timeline:** 2 weeks

**Delivery Driver App:**
- **Development:** ~$800
- **Features:** Order management + navigation
- **Deliverable:** iOS .ipa + Android .aab
- **Timeline:** 1 week

**Total Mobile Development: $2,600 value in 3 weeks**

---

This plan ensures mobile apps match web quality and meet all client requirements! 📱

