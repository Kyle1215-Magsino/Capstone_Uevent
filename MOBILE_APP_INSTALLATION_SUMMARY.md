# 📱 Mobile App Installation - Complete Guide

## 🎯 Goal
Install the U-EventTrack mobile app on your phone for testing.

---

## ✅ What's Ready
- ✅ Mobile app structure created
- ✅ Login screen implemented
- ✅ Dashboard screen implemented
- ✅ Navigation setup
- ✅ API client configured
- ✅ Installation guides created

---

## 🚀 EASIEST METHOD: Expo Go (Recommended)

### What is Expo Go?
Expo Go is a free app that lets you run React Native apps on your phone without building an APK. Perfect for development and testing!

### Installation Steps:

#### 1. Install Expo Go on Your Phone (2 min)
- **Android**: [Google Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

#### 2. Get Your Computer's IP Address (1 min)
Open Command Prompt (Windows):
```bash
ipconfig
```
Look for "IPv4 Address" - example: `192.168.1.100`

#### 3. Update Mobile App Configuration (1 min)
Edit `mobile/constants/Config.js`:
```javascript
export const API_BASE_URL = 'http://YOUR_IP_HERE:8000/api';
export const SANCTUM_URL = 'http://YOUR_IP_HERE:8000/sanctum/csrf-cookie';
```
Replace `YOUR_IP_HERE` with your actual IP (e.g., `192.168.1.100`)

#### 4. Install Dependencies (2 min)
```bash
cd mobile
npm install
```

#### 5. Start Backend Server
Open Terminal 1:
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```
**Keep this running!**

#### 6. Start Mobile Development Server
Open Terminal 2:
```bash
cd mobile
npm start
```

#### 7. Scan QR Code
- **Android**: Open Expo Go → Tap "Scan QR Code" → Scan
- **iOS**: Open Camera app → Scan QR code → Tap notification

#### 8. Wait for App to Load
First time takes 1-2 minutes. You'll see the login screen!

---

## 📋 Detailed Guides Available

### Quick Start (5 minutes)
📄 **File**: `mobile/QUICK_START.md`
- Step-by-step with screenshots
- Troubleshooting tips
- Quick commands

### Full Installation Guide
📄 **File**: `mobile/INSTALLATION_GUIDE.md`
- Multiple installation methods
- Detailed troubleshooting
- Building APK instructions
- Production deployment

### Mobile App README
📄 **File**: `mobile/README.md`
- Project structure
- Development guide
- API documentation
- Feature list

---

## 🔧 Requirements

### Your Phone
- ✅ Android 5.0+ or iOS 13+
- ✅ Connected to WiFi
- ✅ Expo Go app installed

### Your Computer
- ✅ Node.js installed
- ✅ Backend server running
- ✅ Connected to same WiFi as phone

### Network
- ⚠️ **CRITICAL**: Phone and computer MUST be on the **same WiFi network**
- ⚠️ Not mobile data, not different WiFi

---

## 🧪 Test Credentials

Once the app loads, test login with:

**Admin Account:**
- Email: `admin@minsu.edu.ph`
- Password: `admin123`

**Officer Account:**
- Email: `officer@minsu.edu.ph`
- Password: `officer123`

---

## ❌ Common Issues & Solutions

### Issue 1: "Unable to connect to server"
**Cause**: Phone can't reach backend API

**Solutions**:
1. ✅ Verify phone and computer on same WiFi
2. ✅ Check IP address in `Config.js` is correct
3. ✅ Confirm backend is running: `php artisan serve --host=0.0.0.0`
4. ✅ Test in phone browser: `http://YOUR_IP:8000/api/user`
5. ✅ Disable Windows Firewall temporarily

### Issue 2: "QR Code won't scan"
**Solutions**:
1. Make terminal window bigger (QR code gets bigger)
2. Take screenshot and scan from Photos
3. Manually type URL shown below QR code in Expo Go

### Issue 3: "Network request failed"
**Solutions**:
1. Update `backend/.env`:
   ```
   SANCTUM_STATEFUL_DOMAINS=localhost:3000,YOUR_IP:8000
   ```
2. Restart backend server
3. Clear Expo Go cache

### Issue 4: "App crashes immediately"
**Solutions**:
1. Check terminal for errors
2. Run `npm install` again
3. Clear cache: `npm start -- --clear`
4. Restart Expo Go app

---

## 📱 What Works Now

### ✅ Implemented
- Login screen with authentication
- Dashboard with welcome message
- Tab navigation (Dashboard, Events, Profile)
- Logout functionality
- API connection
- Session management

### ⏳ Coming Soon
- Barcode scanner
- Face recognition
- Event list and details
- Check-in functionality
- Attendance history
- GPS verification
- Profile management

---

## 🎯 Quick Commands Reference

### Setup
```bash
cd mobile
npm install
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2 - Mobile
cd mobile
npm start
```

### Reload App
- Shake phone
- Tap "Reload"

### Clear Cache
```bash
npm start -- --clear
```

### Stop Servers
- Press `Ctrl + C` in both terminals

---

## 🔄 Development Workflow

1. **Make changes** to code in `mobile/` folder
2. **Save file** - app auto-reloads on phone
3. **Test** on phone immediately
4. **Debug** by shaking phone → "Debug Remote JS"

---

## 📊 Project Structure

```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.jsx          ✅ Login screen
│   │   └── register.jsx       ⏳ Coming soon
│   ├── (tabs)/
│   │   ├── index.jsx          ✅ Dashboard
│   │   ├── events.jsx         ⏳ Coming soon
│   │   └── profile.jsx        ✅ Profile/Logout
│   ├── _layout.jsx            ✅ Root layout
│   └── index.jsx              ✅ Splash screen
├── api/
│   └── axios.js               ✅ API client
├── constants/
│   ├── Colors.js              ✅ Theme colors
│   └── Config.js              ⚠️ UPDATE THIS!
├── package.json               ✅ Dependencies
├── app.json                   ✅ Expo config
├── QUICK_START.md             📖 Quick guide
├── INSTALLATION_GUIDE.md      📖 Full guide
└── README.md                  📖 Project docs
```

---

## 🎓 Learning Resources

### Expo Documentation
- Getting Started: https://docs.expo.dev/get-started/introduction/
- Expo Go: https://docs.expo.dev/get-started/expo-go/
- Building Apps: https://docs.expo.dev/build/introduction/

### React Native
- Documentation: https://reactnative.dev/docs/getting-started
- Components: https://reactnative.dev/docs/components-and-apis

### Tutorials
- Expo Tutorial: https://docs.expo.dev/tutorial/introduction/
- React Native Tutorial: https://reactnative.dev/docs/tutorial

---

## 🚀 Next Steps After Installation

### Immediate (Today)
1. ✅ Install Expo Go on phone
2. ✅ Get computer IP address
3. ✅ Update Config.js
4. ✅ Run `npm install`
5. ✅ Start servers
6. ✅ Test login

### Short Term (This Week)
1. Implement barcode scanner
2. Add event list screen
3. Create check-in flow
4. Test on multiple devices

### Long Term (Next Month)
1. Complete all features
2. Add offline support
3. Implement face recognition
4. Build production APK
5. Deploy to app stores

---

## 💡 Pro Tips

### Development
- Use `console.log()` to debug - shows in terminal
- Shake phone to access developer menu
- Enable "Fast Refresh" for instant updates
- Use React DevTools for debugging

### Performance
- Test on real device, not just emulator
- Check network tab for API calls
- Monitor app size and load time
- Test on slow networks

### Testing
- Test on both Android and iOS if possible
- Test different screen sizes
- Test with poor WiFi connection
- Test offline functionality

---

## ✅ Success Checklist

Before considering installation complete:

- [ ] Expo Go installed on phone
- [ ] Dependencies installed (`npm install`)
- [ ] Config.js updated with correct IP
- [ ] Backend server running
- [ ] Mobile dev server running
- [ ] QR code scanned successfully
- [ ] App loads on phone
- [ ] Login screen appears
- [ ] Can login with test credentials
- [ ] Dashboard displays correctly
- [ ] Navigation works
- [ ] Can logout

---

## 📞 Getting Help

### Check These First
1. Terminal error messages
2. Phone error overlay
3. `mobile/QUICK_START.md`
4. `mobile/INSTALLATION_GUIDE.md`

### Common Solutions
- Restart both servers
- Clear Expo Go cache
- Reinstall dependencies
- Check WiFi connection
- Verify IP address

### Still Stuck?
- Check Expo documentation
- Review error messages carefully
- Ensure all prerequisites met
- Try on different device

---

## 🎉 Congratulations!

Once you see the login screen on your phone, you've successfully installed the mobile app! 

The app is in development mode, so you can continue adding features and see them update in real-time on your phone.

**Estimated Setup Time**: 10-15 minutes
**Difficulty**: Easy
**Cost**: Free (using Expo Go)

---

## 📝 Summary

**What You Did:**
1. ✅ Created mobile app structure
2. ✅ Installed Expo Go on phone
3. ✅ Configured API connection
4. ✅ Started development servers
5. ✅ Loaded app on phone

**What You Can Do Now:**
- Test login/logout
- View dashboard
- Navigate between screens
- See real-time code updates

**What's Next:**
- Add more features
- Implement barcode scanning
- Complete all functionality
- Build production app

---

**Ready to start? Open `mobile/QUICK_START.md` and follow the steps!** 🚀
