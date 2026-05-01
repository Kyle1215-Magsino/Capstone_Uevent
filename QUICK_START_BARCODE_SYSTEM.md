# Quick Start: Barcode System

## What Changed?
The system now uses **BARCODE SCANNING** instead of RFID tags.

## Database Migration
Run this command to update your database:
```bash
cd backend
php artisan migrate
```

This will:
- Rename `rfid_tag` column to `barcode` in students table
- Update all attendance records from 'rfid' to 'barcode' verification method

## Reseed Demo Data (Optional)
If you want fresh demo data with barcodes:
```bash
php artisan migrate:fresh --seed
```

## Frontend Changes Completed ✅
- ✅ CheckinPage - Barcode scanning tab
- ✅ StudentAddModal - Barcode field
- ✅ StudentEditModal - Barcode field

## Frontend Changes Still Needed
Run these find-and-replace operations in your code editor:

### 1. HomePage.jsx
- Find: `RFID scanning` → Replace: `Barcode scanning`
- Find: `RFID scan` → Replace: `Barcode scan`
- Find: `RFID cards are available` → Replace: `Student ID barcodes are printed on your ID cards`
- Find: `RFID · Face ID · GPS` → Replace: `Barcode · Face ID · GPS`
- Find: `Face & RFID check-in` → Replace: `Face & Barcode check-in`

### 2. StudentDashboardPage.jsx
- Find: `rfid:` → Replace: `barcode:`
- Find: `'rfid'` → Replace: `'barcode'`

### 3. AttendanceLogsPage.jsx
- Find: `verification_method === 'rfid'` → Replace: `verification_method === 'barcode'`
- Update icon/label for barcode method

### 4. StudentAttendancePage.jsx
- Find: `verification_method === 'rfid'` → Replace: `verification_method === 'barcode'`

### 5. ReportsPage.jsx
- Find: `'rfid'` → Replace: `'barcode'`
- Update filter options

## Barcode Scanner Setup

### Hardware Requirements
- Any USB or Bluetooth barcode scanner
- Scanner must be in "keyboard emulation" mode
- Configure scanner to send "Enter" key after each scan

### Recommended Scanners
- Zebra DS2208
- Honeywell Voyager 1200g
- Symbol LS2208
- Any generic USB barcode scanner

### Scanner Configuration
1. Connect scanner via USB or Bluetooth
2. Scan the "Enter key suffix" barcode from scanner manual
3. Test by scanning a barcode - it should type the code and press Enter automatically

## Barcode Format
Student barcodes use this format:
- **Pattern**: `BC-XXXXXX`
- **Example**: `BC-000001`, `BC-000123`, `BC-001234`
- **Type**: Code 128 or Code 39 (most common)

## Generating Student ID Barcodes

### Online Tools
- https://barcode.tec-it.com/
- https://www.barcodesinc.com/generator/
- Select "Code 128" format
- Enter: BC-000001 (or student's barcode)
- Download and print

### Programmatic Generation (PHP)
```php
composer require picqer/php-barcode-generator

use Picqer\Barcode\BarcodeGeneratorPNG;

$generator = new BarcodeGeneratorPNG();
$barcode = $generator->getBarcode('BC-000001', $generator::TYPE_CODE_128);
file_put_contents('barcode.png', $barcode);
```

### Print on Student IDs
1. Generate barcode images for all students
2. Print on adhesive labels or directly on ID cards
3. Laminate for durability

## Testing the System

### 1. Test Manual Entry
- Go to Check-In page
- Select "MANUAL" tab
- Type a student ID
- Click "Check In"

### 2. Test Barcode Scanning
- Go to Check-In page
- Select "BARCODE" tab
- Click in the input field
- Scan a student ID barcode
- Should auto-submit after scan

### 3. Test Face Recognition
- Go to Check-In page
- Select "Face Recognition" tab
- Click "Start Camera"
- Click "Capture & Match"

## Troubleshooting

### Barcode Scanner Not Working
1. Check USB connection
2. Test scanner in Notepad - should type characters
3. Ensure scanner is in keyboard emulation mode
4. Check that "Enter" suffix is enabled

### Barcode Not Recognized
1. Verify barcode format matches database (BC-XXXXXX)
2. Check barcode quality - rescan if blurry
3. Ensure proper lighting when scanning
4. Try manual entry to verify student exists

### Database Errors
If you see "Unknown column 'rfid_tag'":
- Run: `php artisan migrate`
- Or run: `php artisan migrate:fresh --seed` (WARNING: deletes all data)

## Mobile App (Coming Soon)
A React Native mobile app is being developed in the `/mobile` folder with:
- Camera-based barcode scanning
- Face recognition
- GPS check-in
- Same design as web app

## Support
For issues or questions, check:
- BARCODE_MIGRATION_GUIDE.md
- SYSTEM_CHANGES_SUMMARY.md
- Backend logs: `backend/storage/logs/laravel.log`
