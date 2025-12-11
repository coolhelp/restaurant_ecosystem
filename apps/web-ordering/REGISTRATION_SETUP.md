# Registration/Sign-Up Setup

## Overview

The web-ordering app now has a complete user registration system that connects to your backend API.

## Features Implemented

### 1. Registration Page (`/register`)
- ✨ Modern, responsive design matching TastyBites branding
- 📋 Comprehensive form with all required fields
- ✅ Advanced form validation using React Hook Form + Zod
- 🔒 Password strength indicator with real-time feedback
- 👁️ Show/hide password toggle for both password fields
- 📱 Fully responsive mobile-first design
- 🎨 Smooth animations and transitions
- 🔄 Loading states and error handling
- 🌐 Social signup UI (Google & Facebook placeholders)

### 2. Form Fields

#### Required Fields:
- **First Name** - Minimum 2 characters
- **Last Name** - Minimum 2 characters
- **Email** - Valid email format
- **Password** - Minimum 8 characters with strength requirements
- **Confirm Password** - Must match password
- **Terms Agreement** - Must be checked

#### Optional Fields:
- **Phone Number** - For SMS notifications and order updates

### 3. Password Requirements

The registration form enforces strong password requirements:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ Password strength indicator (Weak/Fair/Good/Strong)

### 4. Password Strength Indicator

Real-time visual feedback as user types:
```
Weak   ⬜⬜⬜⬜ - Basic requirements not met
Fair   🟡🟡⬜⬜ - Meets minimum requirements
Good   🔵🔵🔵⬜ - Strong password with variety
Strong 🟢🟢🟢🟢 - Excellent security with special characters
```

### 5. Form Validation

Comprehensive client-side validation:
- Email format validation
- Password strength validation
- Password confirmation matching
- Required field validation
- Terms and conditions checkbox
- Real-time error messages

## Backend API Endpoint

The frontend expects this backend endpoint:

```
POST /api/auth/register

Request Body:
{
  "firstName": string,    // Required, min 2 chars
  "lastName": string,     // Required, min 2 chars
  "email": string,        // Required, valid email
  "password": string,     // Required, min 8 chars with strength requirements
  "phone"?: string        // Optional
}

Response:
{
  "user": {
    "id": string,
    "email": string,
    "firstName": string,
    "lastName": string,
    "role": "CUSTOMER" | "EMPLOYEE" | "MANAGER" | "ADMIN" | "SUPER_ADMIN",
    "phone"?: string,
    "isVerified": boolean
  },
  "accessToken": string,
  "refreshToken": string
}

Error Response:
{
  "message": string,
  "code"?: string
}
```

## User Flow

1. **User Visits Registration Page** (`/register`)
2. **Fills Out Form** with personal information
3. **Password Validation** happens in real-time
4. **Password Strength** is visually displayed
5. **Agrees to Terms** by checking the checkbox
6. **Submits Form** by clicking "Create Account"
7. **Backend Processes** registration request
8. **Success**: User is logged in and redirected to `/menu`
9. **Error**: User sees error message and can retry

## Usage Examples

### 1. Accessing the Registration Page

Direct link:
```
http://localhost:3000/register
```

Or via navigation from login page:
```tsx
<Link href="/register">Sign up now</Link>
```

### 2. Testing Registration

```bash
# Example registration payload
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"  // Optional
}
```

### 3. Handling Registration Success

After successful registration, the user is:
1. Automatically logged in
2. Auth tokens are stored
3. User data is saved in Zustand store
4. Redirected to `/menu` to start ordering

### 4. Handling Registration Errors

Common errors handled:
- **Email already exists** - "User already exists"
- **Invalid email format** - "Please enter a valid email address"
- **Weak password** - Specific requirement not met
- **Passwords don't match** - "Passwords don't match"
- **Network errors** - "Registration failed. Please try again."

## Security Features

### 1. Password Security
- Minimum 8 characters enforced
- Complexity requirements (upper, lower, numbers)
- Client-side validation before sending to server
- Passwords never stored in plain text (handled by backend)

### 2. Input Sanitization
- Email validation
- XSS protection through React
- CSRF protection (handled by backend)

### 3. Privacy Protection
- Terms and conditions agreement required
- Privacy policy link provided
- Optional phone number (not required)

## Customization

### Modify Password Requirements

Edit `/src/app/register/page.tsx`:

```tsx
const registerSchema = z.object({
  // ... other fields
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain special character'), // Add this for special chars
});
```

### Change Redirect After Registration

```tsx
const onSubmit = async (data: RegisterFormData) => {
  // ...
  setAuth(response.user, response.accessToken, response.refreshToken);
  
  // Change this line to redirect elsewhere
  router.push('/welcome'); // Instead of '/menu'
};
```

### Add Additional Fields

```tsx
const registerSchema = z.object({
  // ... existing fields
  dateOfBirth: z.date().optional(),
  favoriteFood: z.string().optional(),
  // ... etc
});
```

## Navigation Links

### From Login to Register:
```tsx
<Link href="/register">Don't have an account? Sign up now</Link>
```

### From Register to Login:
```tsx
<Link href="/login">Already have an account? Sign in</Link>
```

### Back to Home:
```tsx
<Link href="/">← Back to home</Link>
```

## Styling

The registration page uses:
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Gradient backgrounds** matching brand colors
- **Responsive grid layouts**
- **Custom animations** and transitions

## Testing Checklist

- [ ] Form displays correctly on mobile
- [ ] All validations work as expected
- [ ] Password strength indicator updates in real-time
- [ ] Error messages display correctly
- [ ] Success redirects to menu page
- [ ] Backend receives correct data format
- [ ] Tokens are stored correctly
- [ ] User is logged in after registration
- [ ] Social signup buttons are present (even if not functional yet)

## Next Steps

1. ✅ **Email Verification** - Send verification email after registration
2. ✅ **Phone Verification** - OTP verification for phone numbers
3. ✅ **Welcome Email** - Send welcome email to new users
4. ✅ **Onboarding Flow** - Guide new users through first order
5. ✅ **Social Auth** - Implement Google/Facebook OAuth
6. ✅ **Profile Completion** - Add additional profile fields later
7. ✅ **Referral System** - Add referral code during registration

## Troubleshooting

### Issue: "Email already exists"
**Solution**: User should use login page instead or use forgot password if they forgot their credentials.

### Issue: "Password requirements not met"
**Solution**: Check password strength indicator and ensure all requirements are met (8+ chars, uppercase, lowercase, number).

### Issue: "Registration failed"
**Possible Causes**:
- Backend not running
- CORS issues
- Invalid API URL in `.env.local`
- Network connectivity issues

**Debug Steps**:
1. Check browser console for errors
2. Check network tab for API response
3. Verify backend is running on correct port
4. Check `.env.local` configuration

### Issue: Password strength always shows "Weak"
**Solution**: Ensure password includes:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- (Optional) Special characters for "Strong" rating

## File Structure

```
src/
└── app/
    └── register/
        └── page.tsx          # Registration page component
```

## Related Files

- `/src/lib/api.ts` - API client with register method
- `/src/store/authStore.ts` - Authentication state management
- `/src/types/auth.ts` - TypeScript types
- `/src/app/login/page.tsx` - Login page

