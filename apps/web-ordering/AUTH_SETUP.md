# Authentication Setup

## Overview

The web-ordering app now has a complete authentication system that connects to your backend API.

## Features Implemented

### 1. Sign-In Page (`/login`)
- Modern, responsive design matching the main site
- Form validation using React Hook Form + Zod
- Email and password fields with proper validation
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Social login UI (Google & Facebook placeholders)
- Loading states and error handling
- Redirects based on user role

### 2. Authentication Store (Zustand)
- Global state management for user authentication
- Persisted authentication state (survives page refreshes)
- User profile storage
- Token management

### 3. API Integration
- Axios-based API client with interceptors
- Automatic token attachment to requests
- Automatic token refresh on 401 errors
- Logout functionality
- Error handling

### 4. Protected Routes
- `withAuth` HOC for protecting pages
- Automatic redirect to login for unauthenticated users
- Role-based access control
- Loading states during auth checks

## File Structure

```
src/
├── app/
│   └── login/
│       └── page.tsx          # Sign-in page
├── lib/
│   ├── api.ts                # API client and auth endpoints
│   └── withAuth.tsx          # Protected route HOC
├── store/
│   └── authStore.ts          # Zustand auth state management
└── types/
    └── auth.ts               # TypeScript types for auth
```

## Usage Examples

### 1. Sign In Form
Users can access the sign-in page at `/login`

### 2. Using Auth Store in Components

```tsx
'use client';

import { useAuthStore } from '@/store/authStore';

export default function MyComponent() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### 3. Protecting a Page

```tsx
'use client';

import { withAuth } from '@/lib/withAuth';

function ProfilePage() {
  return <div>Protected Profile Page</div>;
}

export default withAuth(ProfilePage);
```

### 4. Role-Based Protection

```tsx
'use client';

import { withAuth } from '@/lib/withAuth';

function AdminPage() {
  return <div>Admin Dashboard</div>;
}

export default withAuth(AdminPage, {
  allowedRoles: ['ADMIN', 'SUPER_ADMIN']
});
```

### 5. Making Authenticated API Calls

```tsx
import { api } from '@/lib/api';

// Token is automatically attached
const response = await api.get('/orders');
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Backend API Endpoints Expected

The frontend expects these backend endpoints:

- `POST /api/auth/login` - Login with email & password
  - Body: `{ email, password }`
  - Response: `{ user, accessToken, refreshToken }`

- `POST /api/auth/register` - Register new user
  - Body: `{ email, password, firstName, lastName, phone? }`
  - Response: `{ user, accessToken, refreshToken }`

- `POST /api/auth/logout` - Logout user
  - Requires: Bearer token

- `POST /api/auth/refresh` - Refresh access token
  - Body: `{ refreshToken }`
  - Response: `{ accessToken }`

- `GET /api/auth/me` - Get current user
  - Requires: Bearer token
  - Response: `{ user }`

## Security Features

1. **Token Management**
   - Access tokens stored in memory
   - Refresh tokens in localStorage
   - Automatic token refresh on expiry

2. **Form Validation**
   - Client-side validation with Zod
   - Email format validation
   - Password minimum length

3. **Protected Routes**
   - Automatic redirect for unauthenticated users
   - Role-based access control

4. **Error Handling**
   - User-friendly error messages
   - Automatic logout on auth failures

## Next Steps

1. Create a registration page at `/register`
2. Add password reset flow (`/forgot-password`, `/reset-password`)
3. Add email verification
4. Implement social login backends (Google, Facebook)
5. Add user profile page
6. Add account settings page

## Testing

To test the authentication:

1. Ensure your backend is running on `http://localhost:4000`
2. Navigate to `http://localhost:3000/login`
3. Enter valid credentials
4. You should be redirected to `/menu` after successful login

## Troubleshooting

**Issue: "Network Error" on login**
- Check if backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings on backend

**Issue: Page redirects immediately after login**
- Check browser console for errors
- Verify token storage in localStorage
- Check network tab for API responses

