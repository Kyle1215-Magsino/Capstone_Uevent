# Installation Guide - U-EventTrack Mobile App

## Overview
This guide will help you install the U-EventTrack mobile app on your Android or iOS device.

---

## Option 1: Build APK for Android (Recommended for Production)

### Prerequisites
- Expo account (free)
- EAS CLI installed

### Steps

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
cd USG_app
eas login
```

#### 3. Configure the Project
```bash
eas build:configure
```

#### 4. Build APK
```bash
# For Android APK (can install directly)
eas build -p android --profile preview

# This will take 10-20 minutes
# You'll get a download link when done
```

#### 5. Download and Install
1. Open the link on your Android phone
2. Download the APK file
3. Open the APK file
4. Allow "Install from unknown sources" if prompted
5. Install the app

**Note**: The APK will be about 50-100MB

---

## Option 2: Expo Go (Quick Testing - Current Method)

### What You're Currently Using
You're already using this method with the QR code!

### Limitations
- Requires Expo Go app installed
- Requires development server running
- Phone must be on same network
- Not suitable for production/distribution

### Steps
1. Keep Expo server running: `npm start`
2. Scan QR code with Expo Go app
3. App loads from your computer

---

## Option 3: Build Standalone App (Full Production)

### For Android (APK/AAB)

#### Build APK (Easier to distribute)
```bash
cd USG_app
eas build -p android --profile production
```

#### Build AAB (For Google Play Store)
```bash
eas build -p android --profile production
```

### For iOS (IPA)
```bash
cd USG_app
eas build -p ios --profile production
```

**Note**: iOS requires Apple Developer account ($99/year)

---

## Option 4: Publish to App Stores

### Google Play Store (Android)

#### Prerequisites
- Google Play Developer account ($25 one-time fee)
- App built as AAB format

#### Steps
1. Build AAB:
   ```bash
   eas build -p android --profile production
   ```

2. Go to [Google Play Console](https://play.google.com/console)

3. Create new app

4. Upload AAB file

5. Fill in app details:
   - App name: U-EventTrack
   - Description
   - Screenshots
   - Privacy policy
   - etc.

6. Submit for review (takes 1-3 days)

### Apple App Store (iOS)

#### Prerequisites
- Apple Developer account ($99/year)
- Mac computer (for final submission)

#### Steps
1. Build IPA:
   ```bash
   eas build -p ios --profile production
   ```

2. Go to [App Store Connect](https://appstoreconnect.apple.com)

3. Create new app

4. Upload IPA using Transporter app

5. Fill in app details

6. Submit for review (takes 1-7 days)

---

## Recommended Approach for Your Use Case

### For Testing/Development
**Use Expo Go** (what you're doing now)
- Fast and easy
- No build required
- Good for development

### For Internal Distribution (School Only)
**Build APK and share directly**
```bash
eas build -p android --profile preview
```
- Students download APK from school website
- No app store needed
- Free
- Android only

### For Public Release
**Publish to Google Play Store**
- Professional
- Easy updates
- Trusted source
- Costs $25 one-time

---

## Quick Start: Build Your First APK

### Step-by-Step

#### 1. Update app.json
```bash
cd USG_app
```

Edit `app.json`:
```json
{
  "expo": {
    "name": "U-EventTrack",
    "slug": "u-eventtrack",
    "version": "1.0.0",
    "android": {
      "package": "com.minsu.ueventtrack",
      "versionCode": 1
    }
  }
}
```

#### 2. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 3. Login
```bash
eas login
```
(Create free account if needed)

#### 4. Configure
```bash
eas build:configure
```

#### 5. Build APK
```bash
eas build -p android --profile preview
```

Wait 10-20 minutes...

#### 6. Download
You'll get a link like:
```
https://expo.dev/artifacts/eas/abc123.apk
```

#### 7. Install on Phone
1. Open link on Android phone
2. Download APK
3. Install (allow unknown sources)
4. Done!

---

## Important: Update API URL for Production

Before building, update the API URL in `App.jsx`:

### For Local Network (Current)
```javascript
const API_URL = 'http://192.168.1.15:8000/api';
```

### For Production (After Deployment)
```javascript
const API_URL = 'https://your-domain.com/api';
```

**Important**: The local IP (192.168.1.15) won't work outside your network!

You need to:
1. Deploy backend to a server (e.g., DigitalOcean, AWS, Heroku)
2. Get a domain name
3. Update API_URL to use that domain

---

## File Size Estimates

- **APK (Android)**: 50-100 MB
- **AAB (Android)**: 40-80 MB
- **IPA (iOS)**: 60-120 MB

---

## Build Profiles

Create `eas.json` in USG_app folder:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

---

## Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Build failed"
- Check `app.json` is valid JSON
- Check package name is unique
- Check all dependencies are installed

### "Can't install APK"
- Enable "Install from unknown sources" in Android settings
- Check phone has enough storage (100MB+)

### "App crashes on startup"
- Check API_URL is accessible from phone
- Check backend server is running
- Check phone has internet connection

---

## Distribution Options

### 1. Direct APK Download
**Best for**: Internal use, testing
- Host APK on school website
- Students download directly
- No app store needed
- **Free**

### 2. Google Play Store
**Best for**: Public release, easy updates
- Professional appearance
- Automatic updates
- Trusted source
- **Cost**: $25 one-time

### 3. Firebase App Distribution
**Best for**: Beta testing, internal distribution
- Share via email/link
- Track installs
- Push updates
- **Free** for small teams

### 4. TestFlight (iOS)
**Best for**: iOS beta testing
- Up to 10,000 testers
- Easy distribution
- **Free** (but needs Apple Developer account)

---

## Next Steps

### For Quick Testing
1. Keep using Expo Go (current method)
2. Share QR code with testers

### For School Distribution
1. Build APK: `eas build -p android --profile preview`
2. Upload to school website
3. Share download link with students

### For Public Release
1. Deploy backend to production server
2. Update API_URL in app
3. Build production APK/AAB
4. Submit to Google Play Store

---

## Updating the App

### After Making Changes

#### For Expo Go Users
Just save your code - changes appear automatically!

#### For APK Users
1. Update version in `app.json`:
   ```json
   {
     "version": "1.0.1",
     "android": {
       "versionCode": 2
     }
   }
   ```

2. Build new APK:
   ```bash
   eas build -p android --profile preview
   ```

3. Distribute new APK

#### For Play Store Users
1. Update version
2. Build new AAB
3. Upload to Play Console
4. Users get automatic update

---

## Cost Summary

| Method | Cost | Time | Best For |
|--------|------|------|----------|
| Expo Go | Free | Instant | Development |
| APK Direct | Free | 20 min | Internal use |
| Play Store | $25 | 1-3 days | Public release |
| App Store | $99/year | 1-7 days | iOS users |

---

## Recommended Path

### Phase 1: Development (Now)
✅ Use Expo Go
- Fast iteration
- Easy testing

### Phase 2: Internal Testing
📱 Build APK
- Share with small group
- Test on real devices
- Gather feedback

### Phase 3: School Deployment
🏫 Distribute APK
- Host on school website
- Email download link
- Support students

### Phase 4: Public Release (Optional)
🌐 Publish to Play Store
- Wider reach
- Professional image
- Easy updates

---

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Play Console**: https://play.google.com/console
- **App Store Connect**: https://appstoreconnect.apple.com

---

## Quick Commands Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure

# Build APK (Android)
eas build -p android --profile preview

# Build for Play Store
eas build -p android --profile production

# Build for iOS
eas build -p ios --profile production

# Check build status
eas build:list
```

---

## Need Help?

1. Check build logs in Expo dashboard
2. Read error messages carefully
3. Search Expo forums
4. Ask in Expo Discord
5. Check this guide again

Good luck with your app deployment! 🚀
