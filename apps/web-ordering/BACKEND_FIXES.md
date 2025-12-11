# Backend Authentication Fixes

## Issues Found & Fixed

### 1. ❌ **API URL Mismatch**

**Problem:**
- Backend running on: `http://localhost:3001/api/v1`
- Frontend expecting: `http://localhost:4000/api`

**Solution:** ✅
Updated frontend API URL in `/src/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
```

### 2. ❌ **Response Format Mismatch**

**Problem:**
Backend was returning:
```json
{
  "status": "success",
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

Frontend expected:
```json
{
  "user": {...},
  "accessToken": "...",
  "refreshToken": "..."
}
```

**Solution:** ✅
Updated both `register` and `login` methods in backend to return:
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "role": "CUSTOMER",
    "phone": "...",
    "isVerified": false
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### 3. ❌ **Missing Refresh Token in Registration**

**Problem:**
- Registration endpoint only returned single token
- No refresh token support

**Solution:** ✅
- Added refresh token generation
- Save refresh token to database
- Return both `accessToken` and `refreshToken`

### 4. ❌ **Missing User Fields**

**Problem:**
- Backend wasn't returning `phone` and `isVerified` fields
- Frontend TypeScript interface expected these fields

**Solution:** ✅
Updated user selection in both endpoints:
```typescript
select: {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  phone: true,      // Added
  isVerified: true  // Added
}
```

### 5. ❌ **Inconsistent Token Naming**

**Problem:**
- Backend used `token` 
- Frontend expected `accessToken`

**Solution:** ✅
Renamed `token` to `accessToken` in all endpoints

## Files Modified

### Frontend:
- ✅ `/apps/web-ordering/src/lib/api.ts`
  - Updated API_URL to `http://localhost:3001/api/v1`

### Backend:
- ✅ `/apps/backend/src/controllers/auth.controller.ts`
  - Fixed `register()` method
  - Fixed `login()` method
  - Fixed `refreshToken()` method
  - Added refresh token support to registration
  - Updated response formats
  - Added missing user fields

## API Endpoints

### Register
```
POST http://localhost:3001/api/v1/auth/register

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"  // optional
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "phone": "+1234567890",
    "isVerified": false
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}

Error (400):
{
  "message": "User already exists"
}
```

### Login
```
POST http://localhost:3001/api/v1/auth/login

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "phone": "+1234567890",
    "isVerified": false
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}

Error (401):
{
  "message": "Invalid credentials"
}
```

### Refresh Token
```
POST http://localhost:3001/api/v1/auth/refresh

Request:
{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "accessToken": "eyJhbGc..."
}

Error (401):
{
  "message": "Invalid or expired refresh token"
}
```

## Environment Variables

Make sure these are set in backend `.env`:
```env
# Required
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key  # or uses JWT_SECRET if not set

# Optional (with defaults)
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
PORT=3001
API_VERSION=v1
```

## Testing the Fix

### 1. Verify Backend is Running
```bash
# Check terminal - should see:
# 🚀 Restaurant Ecosystem API Server running on port 3001
# 🔗 API Base URL: http://localhost:3001/api/v1
```

### 2. Test Registration
Navigate to: `http://localhost:3000/register`
- Fill out the form
- Click "Create Account"
- Should redirect to `/menu` upon success

### 3. Test Login
Navigate to: `http://localhost:3000/login`
- Enter credentials
- Click "Sign In"
- Should redirect to `/menu` upon success

### 4. Check Console
Open browser console (F12) and check:
- No CORS errors
- Successful API responses
- Tokens stored in localStorage

## What Changed in Backend Auth Flow

### Before:
```
Register/Login → Generate single token → Return { status, data: { user, token } }
```

### After:
```
Register/Login → Generate access + refresh tokens → Save refresh token → Return { user, accessToken, refreshToken }
```

## Security Notes

- ✅ Passwords are hashed with bcrypt
- ✅ Refresh tokens stored in database
- ✅ Tokens have expiration times
- ✅ Invalid credentials return generic error
- ✅ Passwords never returned in responses
- ✅ Token refresh mechanism implemented

## Backend Auto-Reload

The backend uses `tsx watch`, so changes are automatically picked up. You should see:
```
info: 🚀 Restaurant Ecosystem API Server running on port 3001
```

No need to manually restart the backend server!

## Troubleshooting

### Still getting signup errors?

1. **Check browser console** - Look for specific error messages
2. **Check network tab** - Verify request is going to correct URL
3. **Check backend terminal** - Look for error logs
4. **Verify database** - Make sure Prisma is configured
5. **Clear localStorage** - Remove old tokens
6. **Hard refresh** - Ctrl+Shift+R to clear cache

### CORS Issues?

Make sure backend `.env` has:
```env
CORS_ORIGIN=http://localhost:3000
```

### Token Issues?

Make sure backend `.env` has:
```env
JWT_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-key-here
```

## Status

| Component | Status |
|-----------|--------|
| API URL | ✅ Fixed |
| Response Format | ✅ Fixed |
| Refresh Tokens | ✅ Fixed |
| User Fields | ✅ Fixed |
| Token Naming | ✅ Fixed |
| Backend Running | ✅ Yes (Port 3001) |
| Frontend Running | ✅ Yes (Port 3000) |

## Next Steps

Everything should work now! Try:
1. Sign up at `/register`
2. Sign in at `/login`
3. Check that you're redirected properly
4. Verify tokens in localStorage

If you encounter any issues, check the troubleshooting section above.

