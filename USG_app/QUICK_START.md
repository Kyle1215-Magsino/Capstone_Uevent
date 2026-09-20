# Quick Start Guide - After Cloning the Repo

Follow these steps to get the Expo app running on your device.

---

## Prerequisites

Make sure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ npm or yarn installed
- ✅ Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- ✅ Backend server running (Laravel)

---

## Step 1: Install Dependencies

Open terminal in the `USG_app` folder and run:

```bash
cd USG_app
npm install
```

This will install all required packages (React Native, Expo, navigation, etc.)

**Wait time**: 2-5 minutes depending on your internet speed

---

## Step 2: Configure Backend URL

You need to tell the app where your backend server is running.

### Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.15`)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address (e.g., `192.168.1.15`)

### Update the API Configuration

Edit `USG_app/src/config/api.jsx`:

```javascript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api';
```

**Example:**
```javascript
export const API_BASE_URL = 'http://192.168.1.15:8000/api';
```

**Important Notes:**
- ❌ Don't use `localhost` or `127.0.0.1` (won't work on phone)
- ✅ Use your actual IP address
- ✅ Make sure port is `:8000` (Laravel default)
- ✅ Keep `/api` at the end

---

## Step 3: Start Backend Server

Make sure your Laravel backend is running and accessible from your network:

```bash
cd backend
php artisan serve --host=0.0.0.0
```

You should see:
```
Server running on [http://0.0.0.0:8000]
```

**Why `--host=0.0.0.0`?**
This makes the server accessible from other devices on your network (like your phone).

---

## Step 4: Start Expo Development Server

In a new terminal, navigate to the Expo app folder:

```bash
cd USG_app
npm start
```

You'll see a QR code in the terminal and a browser window will open.

---

## Step 5: Run on Your Phone

### Option A: Scan QR Code (Recommended)

1. Open **Expo Go** app on your phone
2. Tap **"Scan QR code"**
3. Point camera at the QR code in your terminal
4. Wait for the app to load (30-60 seconds first time)

### Option B: Manual Connection

If QR code doesn't work:

1. Make sure phone and computer are on **same WiFi network**
2. In Expo Go app, tap **"Enter URL manually"**
3. Type: `exp://YOUR_IP_ADDRESS:8081`
4. Tap **"Connect"**

---

## Step 6: Test the App

Once loaded, you should see:

1. **Home Screen** with announcements
2. **Events tab** with upcoming events
3. **Login button** for students

Try logging in with a test account (if you have seeded data).

---

## Troubleshooting

### ❌ "Network Error" or "Cannot connect to backend"

**Check:**
1. Backend server is running: `php artisan serve --host=0.0.0.0`
2. IP address in `api.jsx` is correct
3. Phone and computer on same WiFi
4. Firewall not blocking port 8000

**Test backend from phone browser:**
Open `http://YOUR_IP_ADDRESS:8000/api/announcements/public` in phone browser
- ✅ Should show JSON data
- ❌ If it doesn't load, backend is not accessible

### ❌ "Unable to resolve module"

```bash
cd USG_app
rm -rf node_modules
npm install
npm start --clear
```

### ❌ QR Code Won't Scan

1. Try manual URL entry in Expo Go
2. Make sure you're scanning the correct QR code
3. Check if Expo Go app is up to date

### ❌ App Loads But Shows Blank Screen

1. Check terminal for error messages
2. Shake phone to open developer menu
3. Tap "Reload"
4. Check API URL is correct

### ❌ "Expo Go is not compatible"

Your Expo SDK version might be too new. Check `package.json`:
```json
"expo": "~54.0.33"
```

Update Expo Go app to latest version from app store.

---

## Development Tips

### Hot Reload
- Save any file in `USG_app/src/` and changes appear automatically
- No need to restart server

### Developer Menu
- **Android**: Shake device or press `Ctrl+M`
- **iOS**: Shake device or press `Cmd+D`

### View Logs
Watch the terminal where you ran `npm start` for console logs and errors.

### Clear Cache
If things get weird:
```bash
npm start --clear
```

---

## Project Structure

```
USG_app/
├── App.jsx                 # Main app entry point
├── index.js                # Expo entry point
├── src/
│   ├── config/
│   │   └── api.jsx         # ⚠️ Configure backend URL here
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state
│   └── screens/
│       ├── HomeScreen.jsx          # Landing page
│       ├── EventsScreen.jsx        # Events list
│       ├── LoginScreen.jsx         # Login form
│       ├── RegisterScreen.jsx      # Registration
│       ├── StudentDashboardScreen.jsx
│       ├── StudentEventsScreen.jsx
│       └── StudentAttendanceScreen.jsx
└── package.json
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Start with cache cleared
npm start --clear

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run in web browser
npm run web
```

---

## Network Requirements

### Both devices must be on the same network:

**Computer:**
- Connected to WiFi: `MyWiFi`
- IP: `192.168.1.15`

**Phone:**
- Connected to WiFi: `MyWiFi` (same network!)
- Can access: `http://192.168.1.15:8000`

### Firewall Settings

If connection fails, you may need to allow port 8000:

**Windows Firewall:**
1. Search "Windows Defender Firewall"
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Enter "8000" → Next
6. Allow the connection → Next
7. Name it "Laravel Dev Server" → Finish

---

## Next Steps

### For Development
- Keep using Expo Go
- Make changes and test instantly
- Share QR code with team members

### For Production/Distribution
See `INSTALLATION_GUIDE.md` for:
- Building standalone APK
- Publishing to Play Store
- Deploying backend to production server

---

## Quick Checklist

Before running the app, make sure:

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Backend server running (`php artisan serve --host=0.0.0.0`)
- [ ] IP address updated in `src/config/api.jsx`
- [ ] Phone and computer on same WiFi
- [ ] Expo Go app installed on phone
- [ ] Firewall allows port 8000

---

## Getting Help

### Check Logs
- **Terminal**: Shows API requests and errors
- **Expo Go**: Shake device → "Show Developer Menu" → "Debug Remote JS"

### Common Issues
1. **Network errors**: Check IP address and WiFi
2. **Module errors**: Clear cache and reinstall
3. **Blank screen**: Check API URL and backend status

### Documentation
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native](https://reactnative.dev)

---

## Summary

**In 5 steps:**

1. `npm install` - Install dependencies
2. Update IP in `src/config/api.jsx`
3. `php artisan serve --host=0.0.0.0` - Start backend
4. `npm start` - Start Expo
5. Scan QR code in Expo Go app

**That's it!** 🎉

The app should now be running on your phone, connected to your local backend server.
