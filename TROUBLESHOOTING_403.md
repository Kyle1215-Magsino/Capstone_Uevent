# Troubleshooting 403 Forbidden Errors

## Problem
Getting 403 Forbidden errors when accessing `/api/events` and `/api/students` endpoints.

## Root Cause
The 403 error occurs when:
1. **Not authenticated** - No valid session exists
2. **Wrong role** - Logged in as a student (these endpoints require officer/admin role)
3. **Session expired** - Session lifetime is 120 minutes by default
4. **Archived account** - The account has been archived

## Solution

### Step 1: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to Application tab → Storage
3. Click "Clear site data"
4. Refresh the page (Ctrl + Shift + R)

### Step 2: Log In with Correct Credentials
Use one of these accounts:

**Admin Account:**
- Email: `admin@minsu.edu.ph`
- Password: `admin123`
- Access: Full system access

**Officer Account:**
- Email: `officer@minsu.edu.ph`
- Password: `officer123`
- Access: Can manage events, students, attendance

**Student Account (Limited Access):**
- Email: Check database for student emails
- Password: Varies per student
- Access: Cannot access `/api/events` or `/api/students` endpoints

### Step 3: Verify Authentication
After logging in, check browser DevTools:

1. **Console tab** - Should show no 401/403 errors
2. **Network tab** - Check API requests:
   - `/api/user` should return 200 with user data
   - `/api/events` should return 200 with events list
   - `/api/students` should return 200 with students list
3. **Application tab** → Cookies:
   - Should see `XSRF-TOKEN` cookie
   - Should see session cookie (e.g., `u-eventtrack-session`)

### Step 4: Check User Role
In browser console, run:
```javascript
// This will show your current user data
fetch('/api/user', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

Expected output should include:
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@minsu.edu.ph",
  "role": "admin",  // or "officer"
  "archived": false
}
```

## Common Issues

### Issue 1: "Already logged in but still getting 403"
**Cause:** Logged in as a student
**Solution:** Log out and log in with officer/admin account

### Issue 2: "Login works but immediately get 403"
**Cause:** Account is archived
**Solution:** Use a non-archived account or restore the account from database

### Issue 3: "403 on some endpoints but not others"
**Cause:** Different endpoints have different role requirements
**Solution:** Check the route protection in `backend/routes/api.php`:
- `/api/events` - Requires `officer` or `admin`
- `/api/students` - Requires `officer` or `admin`
- `/api/audit-logs` - Requires `admin` only
- `/api/student-dashboard` - Requires `student` role

### Issue 4: "Session keeps expiring"
**Cause:** Session lifetime is 120 minutes
**Solution:** 
- Check `backend/.env` → `SESSION_LIFETIME=120` (in minutes)
- Increase if needed: `SESSION_LIFETIME=480` (8 hours)
- Restart backend server after changing

## API Endpoint Access Matrix

| Endpoint | Admin | Officer | Student |
|----------|-------|---------|---------|
| `/api/events` | ✅ | ✅ | ❌ |
| `/api/students` | ✅ | ✅ | ❌ |
| `/api/attendance` | ✅ | ✅ | ❌ |
| `/api/audit-logs` | ✅ | ❌ | ❌ |
| `/api/announcements` | ✅ | ❌ | ❌ |
| `/api/student-dashboard` | ❌ | ❌ | ✅ |
| `/api/student-events` | ❌ | ❌ | ✅ |

## Backend Server Check

Make sure the backend server is running:

```bash
cd backend
php artisan serve
```

Should see:
```
INFO  Server running on [http://127.0.0.1:8000].
```

## Frontend Server Check

Make sure the frontend server is running:

```bash
cd frontend
npm run dev
```

Should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Still Having Issues?

1. **Check backend logs:**
   ```bash
   cd backend
   tail -f storage/logs/laravel.log
   ```

2. **Check browser console** for detailed error messages

3. **Verify database connection:**
   ```bash
   cd backend
   php artisan tinker
   >>> User::where('email', 'admin@minsu.edu.ph')->first()
   ```

4. **Clear all caches:**
   ```bash
   cd backend
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   ```
