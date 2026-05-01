# Student Registration Guide

## Overview
Students can now register for U-EventTrack directly from the Expo mobile app using the registration modal with dropdown selectors for course and year level.

## Registration Fields

### Required Information
- **Student ID**: Unique identifier (e.g., 2021-00123)
- **First Name**: Student's first name
- **Last Name**: Student's last name
- **Email**: MinSU email address (e.g., juan.delacruz@minsu.edu.ph)
- **Course**: Select from dropdown
- **Year Level**: Select from dropdown (1-4)
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password

### Course Options (Dropdown)
- BSEED (Bachelor of Secondary Education)
- BSIT (Bachelor of Science in Information Technology)
- BSCPE (Bachelor of Science in Computer Engineering)
- BSFI (Bachelor of Science in Fisheries)
- BSHM (Bachelor of Science in Hospitality Management)
- BSCRIM (Bachelor of Science in Criminology)
- BSPOLSCI (Bachelor of Science in Political Science)

### Year Level Options (Dropdown)
- Year 1
- Year 2
- Year 3
- Year 4

## How to Register

1. Open the U-EventTrack mobile app
2. Tap "Register as Student" button on the home screen
3. Fill in all required fields:
   - Enter your Student ID
   - Enter your First Name
   - Enter your Last Name
   - Enter your MinSU email address
   - **Select your course from the dropdown**
   - **Select your year level from the dropdown**
   - Create a password (at least 6 characters)
   - Confirm your password
4. Tap "Create Account"
5. Upon success, you'll be redirected to sign in

## After Registration

Once registered:
- Your account is immediately created in the database
- You can sign in using your email and password
- Your student record will appear in the desktop admin panel
- You can check in to events using facial recognition (after enrolling your face)
- You can view your attendance history and dashboard

## Validation Rules

- Student ID must be unique
- Email must be unique and valid format
- Password must be at least 6 characters
- Password confirmation must match
- All fields are required

## API Endpoint

**POST** `/api/register-student`

**Request Body:**
```json
{
  "student_id": "2021-00123",
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "email": "juan.delacruz@minsu.edu.ph",
  "course": "BSIT",
  "year_level": 2,
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Success Response (201):**
```json
{
  "user": { ... },
  "message": "Student account created."
}
```

## Technical Implementation

### Components Updated
- `USG_app/App.jsx` - RegisterModal component with Picker dropdowns
- `USG_app/styles.js` - Added pickerContainer and picker styles
- `USG_app/package.json` - Added @react-native-picker/picker dependency

### Key Features
- Dropdown selectors for course and year level (better UX than text input)
- Year level supports 1-4 (undergraduate programs)
- Real-time validation
- Loading states during registration
- Error handling with detailed messages
- Automatic cache clearing on backend for immediate visibility

## Troubleshooting

**Issue**: Picker not showing options
- **Solution**: Make sure you've run `npm install` in the USG_app directory

**Issue**: Registration fails with validation errors
- **Solution**: Check that all fields are filled and passwords match

**Issue**: Student not appearing in desktop admin
- **Solution**: Refresh the students page - cache is automatically cleared on registration

**Issue**: Email already exists error
- **Solution**: Use a different email address or contact admin if you forgot your password
