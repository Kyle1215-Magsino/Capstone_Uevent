# RFID to Barcode Migration Guide

## Overview
This system has been updated to use **barcode scanning** instead of RFID tags for student identification. Student IDs now have barcodes that can be scanned using standard barcode scanners.

## Database Changes

### Migration Steps
1. Run the new migration to rename the column:
   ```bash
   cd backend
   php artisan migrate
   ```

2. The migration will:
   - Rename `rfid_tag` column to `barcode` in `students` table
   - Update all existing attendance records from `rfid` to `barcode` verification method

### Schema Changes
- **students table**: `rfid_tag` → `barcode`
- **attendances table**: verification_method enum updated: `['barcode', 'facial', 'manual']`

## Frontend Changes

### Check-In Methods
The system now supports three check-in methods:
1. **Manual Entry** - Type student ID manually
2. **Barcode Scan** - Scan student ID barcode
3. **Face Recognition** - Use facial recognition

### Barcode Scanner Setup
- Use any USB or Bluetooth barcode scanner
- Configure scanner to send "Enter" key after scan
- Scanner should be in keyboard emulation mode
- Focus will automatically be on the barcode input field

## Updated Components
- CheckinPage.jsx - Barcode scanning interface
- StudentAddModal.jsx - Barcode field instead of RFID
- StudentEditModal.jsx - Barcode field instead of RFID
- All dashboard and reporting components updated

## Text and UI Updates
All references to "RFID" have been replaced with "Barcode" throughout:
- Homepage features and descriptions
- Dashboard statistics
- Attendance logs and reports
- Student profiles
- Documentation

## Mobile Responsiveness
- **Web App**: Mobile responsiveness has been removed. The web app is now desktop-only.
- **Mobile App**: A separate React Native mobile application has been created in the `/mobile` folder.

## React Native Mobile App
Location: `/mobile` folder
- Built with React Native and Expo
- Uses the same design system as the web app
- Connects to the same backend API
- Supports barcode scanning via device camera
- Includes face recognition capabilities

### Mobile App Setup
```bash
cd mobile
npm install
npm start
```

## Barcode Format
- Student barcodes follow the format: `BC-XXXXXX`
- Where XXXXXX is a 6-digit zero-padded number
- Example: `BC-000001`, `BC-000123`

## Testing
1. Ensure barcode scanners are properly configured
2. Test all three check-in methods
3. Verify attendance records show correct verification method
4. Check that reports display barcode information correctly

## Rollback
If you need to rollback to RFID:
```bash
cd backend
php artisan migrate:rollback --step=1
```

This will revert the column name and verification method changes.
