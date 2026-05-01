# U-EventTrack Mobile App

Mobile application for Mindoro State University - Bongabong Campus event attendance tracking system.

## Features

- 📢 View public announcements
- 📅 Browse upcoming and ongoing events
- 🔐 Student login
- 📊 Real-time event updates
- 🎨 Modern UI matching the web application design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Edit `src/config/api.js` and update the `API_BASE_URL` with your backend server IP address:

```javascript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api';
```

**To find your IP address:**
- **Windows**: Run `ipconfig` in Command Prompt, look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` in Terminal, look for inet address

**Important:** 
- Your phone and computer must be on the same WiFi network
- Your Laravel backend must be running (`php artisan serve --host=0.0.0.0`)

### 3. Start the Development Server

```bash
npm start
```

### 4. Run on Your Device

**Option 1: Expo Go (Recommended)**
1. Install Expo Go app from Play Store (Android) or App Store (iOS)
2. Scan the QR code shown in the terminal
3. The app will load on your phone

**Option 2: Web Browser**
```bash
npm run web
```

## Project Structure

```
USG_app/
├── src/
│   ├── config/
│   │   └── api.js          # API configuration
│   └── screens/
│       ├── HomeScreen.js   # Landing page with announcements
│       ├── EventsScreen.js # Events listing
│       └── LoginScreen.js  # Login form
├── App.js                  # Main navigation setup
└── package.json
```

## API Endpoints Used

- `GET /api/announcements/public` - Fetch public announcements
- `GET /api/events/active` - Fetch active events (upcoming/ongoing)
- `POST /api/login` - User authentication

## Design System

The app follows the same design system as the web application:
- **Primary Color**: Green (#10b981)
- **Secondary Color**: Emerald (#059669)
- **Typography**: System fonts (San Francisco on iOS, Roboto on Android)
- **Spacing**: Consistent 4px grid system

## Troubleshooting

### "Network Error" or "Request Failed"

1. Check that your backend is running:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0
   ```

2. Verify your phone and computer are on the same WiFi network

3. Update the IP address in `src/config/api.js`

4. Check your firewall settings - port 8000 should be accessible

### App Won't Load in Expo Go

1. Make sure Expo CLI is up to date:
   ```bash
   npm install -g expo-cli
   ```

2. Clear the cache:
   ```bash
   npx expo start --clear
   ```

3. Restart the Metro bundler

## Next Steps

- [ ] Add student dashboard
- [ ] Implement attendance history
- [ ] Add QR code scanner for check-in
- [ ] Implement push notifications
- [ ] Add offline support
- [ ] Integrate GPS verification

## License

© 2026 Mindoro State University - Bongabong Campus
