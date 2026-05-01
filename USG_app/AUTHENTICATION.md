# Mobile App Authentication

## Overview
The mobile app uses **token-based authentication** with Laravel Sanctum, while the web app uses **session-based authentication**.

## How It Works

### Login Flow
1. User enters email and password in the mobile app
2. App sends credentials to `/api/mobile/login` endpoint
3. Backend validates credentials and creates a Sanctum token
4. Backend returns:
   - `token`: Bearer token for API requests
   - `user`: User object with profile data
   - `role`: User role (student, officer, admin)
5. App stores token in axios headers for future requests
6. User is authenticated and can access protected endpoints

### Registration Flow
1. Student fills out registration form
2. App sends data to `/api/register-student` endpoint
3. Backend creates:
   - Student record in `students` table
   - User account in `users` table with role='student'
4. User is redirected to login screen
5. User logs in with new credentials

## API Endpoints

### Public Endpoints (No Auth Required)
- `POST /api/mobile/login` - Mobile login (returns token)
- `POST /api/register-student` - Student registration
- `GET /api/announcements/public` - Public announcements
- `GET /api/events/active` - Active events

### Protected Endpoints (Requires Token)
All protected endpoints require the `Authorization: Bearer {token}` header.

**Student Routes:**
- `GET /api/student-dashboard` - Student dashboard data
- `GET /api/student-events` - Student's enrolled events
- `GET /api/student-attendance` - Student's attendance records
- `GET /api/student-profile` - Student profile
- `PUT /api/student-password` - Update password
- `POST /api/student-profile-image` - Upload profile image

**Officer/Admin Routes:**
- `GET /api/dashboard` - Admin dashboard
- `GET /api/events` - All events
- `POST /api/events` - Create event
- `GET /api/students` - All students
- `POST /api/checkin` - Process attendance check-in
- And more...

## Token Storage
Currently, the token is stored in axios default headers:
```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

**Note:** For production, consider using secure storage like:
- `expo-secure-store` for sensitive data
- `@react-native-async-storage/async-storage` for non-sensitive data

## Testing Authentication

### Test with existing account:
1. Create an account on the web app (desktop)
2. Open the mobile app
3. Click "Sign In"
4. Enter the same email and password
5. Should successfully log in

### Test with new account:
1. Open mobile app
2. Click "Register as Student"
3. Fill out the form
4. Submit registration
5. Log in with new credentials

## Troubleshooting

### "Invalid credentials" error
- Check that email and password are correct
- Verify account exists in database
- Check that account is not archived

### "This account has been archived" error
- Account has been archived by admin
- Contact administrator to restore account

### Network errors
- Verify backend is running on `http://192.168.1.15:8000`
- Check that mobile device is on same network
- Update `API_URL` in `App.jsx` if backend IP changed

## Security Notes
- Tokens don't expire by default (set in `config/sanctum.php`)
- Consider adding token expiration for production
- Use HTTPS in production
- Store tokens securely
- Implement logout to revoke tokens
