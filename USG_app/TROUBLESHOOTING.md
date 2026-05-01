# Troubleshooting Guide

## Events Banner Not Showing

### Issue: Banner section is visible but shows "No active events"

**Possible Causes:**
1. No events in the database
2. API endpoint not returning data
3. Network connectivity issues
4. Backend server not running

**Solutions:**

#### 1. Check Backend Server
```bash
# Make sure backend is running
cd backend
php artisan serve
```

#### 2. Check Database for Events
```bash
# Run database seeder to create sample events
cd backend
php artisan db:seed --class=DemoSeeder
```

#### 3. Test API Endpoint
Open in browser or use curl:
```
http://192.168.1.15:8000/api/events/active
```

Expected response:
```json
[
  {
    "id": 1,
    "event_name": "Campus Leadership Summit",
    "description": "Join us for...",
    "event_date": "2026-04-05",
    "venue": "Main Gymnasium",
    "status": "ongoing"
  }
]
```

#### 4. Check Console Logs
In Expo terminal, look for:
```
Events loaded: X events
```

If you see:
```
Error fetching public data: Network Error
```
Then check:
- Backend server is running
- API_URL is correct in App.jsx
- Phone/emulator can reach the backend IP

#### 5. Verify API_URL
In `USG_app/App.jsx`, check:
```javascript
const API_URL = 'http://192.168.1.15:8000/api';
```

Make sure:
- IP address matches your backend server
- Port 8000 is correct
- No typos in the URL

---

## Events Banner Shows Loading Forever

**Cause:** API request is hanging or failing silently

**Solutions:**

1. **Check network connectivity**
   - Ensure phone/emulator is on same network as backend
   - Try pinging the backend IP from your device

2. **Check backend logs**
   ```bash
   cd backend
   tail -f storage/logs/laravel.log
   ```

3. **Add timeout to axios**
   ```javascript
   const eventsRes = await axios.get(`${API_URL}/events/active`, {
     timeout: 5000 // 5 second timeout
   });
   ```

---

## Events Banner Not Visible at All

**Cause:** Banner section might be off-screen or hidden

**Solutions:**

1. **Scroll down on landing page**
   - Banner appears after Stats Strip section
   - Scroll down to see it

2. **Check if logged in**
   - Banner only shows on landing page (not logged in)
   - Logout to see the landing page

3. **Restart Expo**
   ```bash
   # Stop current server
   # Then restart
   expo start -c
   ```

---

## Events Cards Not Scrolling

**Cause:** ScrollView not configured properly

**Solutions:**

1. **Check horizontal prop**
   ```jsx
   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   ```

2. **Verify card width**
   - Cards should have fixed width (280px)
   - Check `eventBannerCard` style

3. **Check content**
   - Need at least 2 cards to scroll
   - Add more events to database

---

## Events Show Wrong Data

**Cause:** API returning incorrect data or old cached data

**Solutions:**

1. **Clear app cache**
   ```bash
   expo start -c
   ```

2. **Pull to refresh**
   - Pull down on landing page to refresh data

3. **Check API response**
   - Verify `/api/events/active` returns correct data
   - Check event status (ongoing/upcoming)

4. **Clear backend cache**
   ```bash
   cd backend
   php artisan cache:clear
   php artisan config:clear
   ```

---

## Common Error Messages

### "Network Error"
- Backend server not running
- Wrong IP address in API_URL
- Firewall blocking connection
- Phone not on same network

**Fix:**
1. Start backend: `php artisan serve`
2. Check IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Update API_URL in App.jsx
4. Restart Expo

### "Error fetching public data"
- API endpoint doesn't exist
- Backend route not defined
- CORS issue

**Fix:**
1. Check `backend/routes/api.php` has:
   ```php
   Route::get('/events/active', [EventController::class, 'getActiveEvents']);
   ```
2. Check CORS config in `backend/config/cors.php`

### "Cannot read property 'map' of undefined"
- Events data is null/undefined
- API returned unexpected format

**Fix:**
1. Add null check:
   ```javascript
   setEvents(eventsRes.data || []);
   ```
2. Verify API returns array

---

## Debug Checklist

- [ ] Backend server is running
- [ ] Database has events (run seeder)
- [ ] API endpoint returns data
- [ ] API_URL is correct
- [ ] Phone/emulator on same network
- [ ] Not logged in (on landing page)
- [ ] Scrolled down to banner section
- [ ] Expo server restarted with cache clear
- [ ] Console shows "Events loaded: X events"
- [ ] No error messages in console

---

## Testing Events Banner

### Create Test Events

```bash
cd backend
php artisan tinker
```

```php
// Create ongoing event
Event::create([
    'event_name' => 'Test Event 1',
    'description' => 'This is a test event',
    'event_date' => now()->format('Y-m-d'),
    'start_time' => '09:00',
    'end_time' => '17:00',
    'venue' => 'Test Venue',
    'status' => 'ongoing'
]);

// Create upcoming event
Event::create([
    'event_name' => 'Test Event 2',
    'description' => 'Another test event',
    'event_date' => now()->addDays(7)->format('Y-m-d'),
    'start_time' => '10:00',
    'end_time' => '16:00',
    'venue' => 'Main Hall',
    'status' => 'upcoming'
]);
```

### Verify in Browser
```
http://192.168.1.15:8000/api/events/active
```

Should return JSON array with events.

---

## Still Not Working?

1. **Check this file for console logs:**
   - Look at Expo terminal output
   - Check for "Events loaded: X events"
   - Check for error messages

2. **Test API directly:**
   ```bash
   curl http://192.168.1.15:8000/api/events/active
   ```

3. **Verify backend route:**
   ```bash
   cd backend
   php artisan route:list | grep events
   ```

4. **Check EventController:**
   - File: `backend/app/Http/Controllers/EventController.php`
   - Method: `getActiveEvents()`
   - Should return events with status 'ongoing' or 'upcoming'

5. **Ask for help:**
   - Provide console logs
   - Provide API response
   - Provide error messages
   - Provide screenshots

---

## Contact & Support

If you're still experiencing issues:
1. Check console logs in Expo terminal
2. Check backend logs in `storage/logs/laravel.log`
3. Verify API endpoint works in browser
4. Restart both backend and Expo servers
5. Clear all caches
