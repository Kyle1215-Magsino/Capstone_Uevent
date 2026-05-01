# 📱 Install Mobile App on Your Phone - START HERE!

## 🎯 What You'll Get
A working mobile app on your phone in **10 minutes**!

---

## 📋 Before You Start

### ✅ Checklist
- [ ] Your phone (Android or iOS)
- [ ] Your computer with this project
- [ ] Both connected to **SAME WiFi network** ⚠️ IMPORTANT!
- [ ] 10 minutes of time

---

## 🚀 Let's Go! (Follow These Steps)

### STEP 1: Download Expo Go (2 minutes)

**On your phone:**

📱 **Android Users:**
1. Open Google Play Store
2. Search "Expo Go"
3. Tap Install
4. Wait for download

📱 **iOS Users:**
1. Open App Store
2. Search "Expo Go"
3. Tap Get
4. Wait for download

✅ **Done? Great! Keep Expo Go closed for now.**

---

### STEP 2: Get Your Computer's IP (1 minute)

**On your computer:**

1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Type `ipconfig` and press Enter
4. Find "IPv4 Address"
5. **WRITE IT DOWN!** 📝

Example:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
                                     ↑ This is your IP!
```

✅ **Got your IP? Write it here: ________________**

---

### STEP 3: Update Configuration (2 minutes)

**On your computer:**

1. Open this file: `mobile/constants/Config.js`
2. Find line 6:
   ```javascript
   ? 'http://192.168.1.100:8000/api'
   ```
3. Replace `192.168.1.100` with YOUR IP from Step 2
4. Find line 7:
   ```javascript
   ? 'http://192.168.1.100:8000/sanctum/csrf-cookie'
   ```
5. Replace `192.168.1.100` with YOUR IP again
6. **Save the file!** 💾

✅ **Saved? Perfect!**

---

### STEP 4: Install App Dependencies (2 minutes)

**On your computer:**

1. Open Command Prompt or Terminal
2. Type these commands:
   ```bash
   cd mobile
   npm install
   ```
3. Wait for installation (shows progress bars)
4. When done, you'll see "added XXX packages"

✅ **Installation complete? Awesome!**

---

### STEP 5: Start Backend Server (1 minute)

**On your computer:**

1. Open a **NEW** Command Prompt window
2. Type:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```
3. You should see: "Server running on http://0.0.0.0:8000"
4. **KEEP THIS WINDOW OPEN!** Don't close it!

✅ **Server running? Great!**

---

### STEP 6: Start Mobile App (1 minute)

**On your computer:**

1. Go back to your first Command Prompt (or open new one)
2. Type:
   ```bash
   cd mobile
   npm start
   ```
3. Wait 10-20 seconds
4. You'll see a **QR CODE** appear! 📱

✅ **See the QR code? Almost there!**

---

### STEP 7: Scan QR Code (1 minute)

**On your phone:**

📱 **Android:**
1. Open **Expo Go** app
2. Tap **"Scan QR Code"** button
3. Point camera at QR code on computer screen
4. Wait...

📱 **iOS:**
1. Open **Camera** app (not Expo Go!)
2. Point at QR code on computer screen
3. Tap the notification that pops up
4. Expo Go will open
5. Wait...

⏳ **First time takes 1-2 minutes to load...**

---

### STEP 8: Success! 🎉

**You should see:**
- U-EventTrack logo
- "Sign In" button
- Email and password fields

**Test it:**
- Email: `admin@minsu.edu.ph`
- Password: `admin123`
- Tap "Sign In"

✅ **Can you login? CONGRATULATIONS! 🎉**

---

## ❌ Something Wrong?

### Problem: "Unable to connect to server"

**Fix:**
1. Check phone and computer are on **SAME WiFi**
2. Check IP address in `Config.js` is correct
3. Make sure backend server is still running
4. Try turning off Windows Firewall

### Problem: "QR Code won't scan"

**Fix:**
1. Make Command Prompt window bigger (QR code gets bigger)
2. Or take a screenshot and scan from Photos
3. Or manually type the URL shown below QR code

### Problem: "App shows error"

**Fix:**
1. Close Expo Go completely
2. In Command Prompt, press `Ctrl + C`
3. Run `npm start` again
4. Scan QR code again

---

## 🎯 Quick Reference

### To Start Everything:
```bash
# Window 1 - Backend
cd backend
php artisan serve --host=0.0.0.0 --port=8000

# Window 2 - Mobile
cd mobile
npm start
```

### To Stop Everything:
- Press `Ctrl + C` in both windows

### To Reload App:
- Shake your phone
- Tap "Reload"

---

## 📚 Need More Help?

**Quick Guide:**
📄 `mobile/QUICK_START.md` - 5-minute guide

**Detailed Guide:**
📄 `mobile/INSTALLATION_GUIDE.md` - Everything explained

**Full Summary:**
📄 `MOBILE_APP_INSTALLATION_SUMMARY.md` - Complete overview

---

## ✅ What's Working

- ✅ Login/Logout
- ✅ Dashboard
- ✅ Navigation
- ✅ Profile

## ⏳ Coming Soon

- ⏳ Barcode Scanner
- ⏳ Face Recognition
- ⏳ Event Check-in
- ⏳ Attendance History

---

## 🎉 You Did It!

The mobile app is now running on your phone!

**What now?**
- Play around with the app
- Try logging in and out
- Check out the different screens
- The app will update automatically when you change code!

**Questions?**
- Check the guides in the `mobile/` folder
- Look at error messages in Command Prompt
- Make sure WiFi is working

---

**Total Time: ~10 minutes**
**Difficulty: Easy**
**Cost: FREE**

**Enjoy your mobile app! 📱✨**
