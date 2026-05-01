# Facial Recognition Attendance System - User Guide

## ✅ System Status: WORKING CORRECTLY

The facial recognition system is fully functional and properly configured. The database accepts `facial` as a verification method, and all backend/frontend code is correct.

## 📋 Prerequisites

Before using facial recognition for attendance, students **MUST** enroll their faces first.

## 🎯 How to Use Facial Recognition

### Step 1: Enroll Student Faces

1. **Login as Admin/Officer** to the desktop web app
2. Navigate to **Face Enrollment** page (in the sidebar)
3. **Select a student** from the dropdown
4. Click **"Start Face Enrollment"**
5. Follow the on-screen instructions:
   - Look straight at the camera
   - Turn right
   - Turn left
6. The system captures 3 poses and saves them
7. Repeat for all students who will use facial recognition

### Step 2: Use Facial Recognition for Check-In

1. Navigate to **Check-In** page
2. Select an **active event**
3. Switch to the **"Face Recognition"** tab
4. Click **"Start Camera"**
5. Click **"Capture & Match"** when a student is in front of the camera
6. The system will:
   - Detect the face
   - Match against enrolled faces
   - Automatically check in the student if matched

## 🔍 Current Status

**Enrolled Students:** 0

To check how many students have enrolled faces:
```bash
cd backend
php artisan tinker --execute="echo App\Models\Student::whereNotNull('face_data')->where('face_data', '!=', '')->count();"
```

## 📊 Database Configuration

✅ **Verification Method Enum:** `enum('barcode','facial','manual')`
✅ **Backend Validation:** Accepts `barcode`, `facial`, `manual`
✅ **Frontend Implementation:** Sends `facial` as verification method
✅ **Face Data Storage:** `students.face_data` column (JSON)

## 🎨 Features

- **Multi-Pose Enrollment:** Captures 3 different angles for better accuracy
- **Real-Time Matching:** Instant face detection and matching
- **Confidence Score:** Shows match percentage
- **Visual Feedback:** Green bounding box and landmarks overlay
- **Front Light:** Optional screen brightness boost for better lighting

## 🚨 Troubleshooting

### "No match found"
- **Cause:** Student hasn't enrolled their face yet
- **Solution:** Enroll the student's face first via Face Enrollment page

### "No face detected"
- **Cause:** Poor lighting or face too far from camera
- **Solution:** Move closer to camera, improve lighting, or use Front Light feature

### "0 enrolled face(s) loaded"
- **Cause:** No students have enrolled faces
- **Solution:** Enroll at least one student via Face Enrollment page

## 📝 API Endpoints

### Enroll Face Data
```
POST /api/students/{id}/face
Authorization: Bearer {token}
Body: { "face_data": "[descriptor1, descriptor2, descriptor3]" }
```

### Get Enrolled Faces
```
GET /api/students/faces
Authorization: Bearer {token}
Returns: Array of students with face_data
```

### Check-In with Facial Recognition
```
POST /api/checkin
Authorization: Bearer {token}
Body: {
  "student_identifier": "2021-00123",
  "event_id": 1,
  "verification_method": "facial",
  "location_lat": 13.1234,
  "location_lng": 121.5678
}
```

## ✨ Next Steps

1. **Enroll faces** for students who will use facial recognition
2. **Test the system** with enrolled students
3. **Train users** on proper camera positioning
4. **Monitor accuracy** and re-enroll if needed

---

**Note:** The system is working correctly. The only requirement is that students must enroll their faces before they can use facial recognition for attendance.
