# Tab Navigation Guide

## Overview
The mobile app now features a bottom tab navigation system for the student dashboard, providing easy access to three main sections: Dashboard, Events, and Attendance.

## Tab Structure

### 1. Dashboard Tab (Home Icon)
**Purpose**: Main overview of student's attendance and activities

**Features**:
- Welcome header with profile initials and greeting
- Next upcoming event banner (green gradient)
- 4 stat cards:
  - Events Attended
  - Present count
  - Late count
  - Attendance Streak
- Attendance rate circle with percentage
- Recent check-ins timeline (last 5)
- Upcoming events list

**Data Source**: `/api/student-dashboard` endpoint

---

### 2. Events Tab (Calendar Icon)
**Purpose**: Browse all available events

**Features**:
- List of all available events (upcoming and ongoing)
- Event cards showing:
  - Status badge (ONGOING/UPCOMING)
  - Event name and description
  - Date and venue
  - "Checked In" badge if already checked in
- Auto-refresh on tab switch

**Data Source**: `/api/student-events` endpoint

---

### 3. Attendance Tab (Clipboard Icon)
**Purpose**: View detailed attendance records

**Features**:
- Sub-tabs for filtering:
  - **All**: All attendance records
  - **Present**: Only present records
  - **Late**: Only late records
  - **Absent**: Events missed (not checked in)
- Attendance record cards showing:
  - Event name
  - Check-in date and time
  - Status badge (Present/Late)
  - Verification method (Face/RFID/Manual)
- Special "No absences!" message when absent tab is empty

**Data Source**: Uses `dashboardData.attendanceRecords` and `dashboardData.allPastEvents`

---

## Implementation Details

### State Management
```javascript
const [activeTab, setActiveTab] = useState('dashboard');
```

### Tab Components
Each tab is a separate component:
- `DashboardTab`: Main dashboard view
- `EventsTab`: Events list with API call
- `AttendanceTab`: Attendance records with filtering

### Bottom Tab Bar
- Fixed at bottom of screen
- 3 tabs with icons and labels
- Active tab highlighted in green (#10b981)
- Inactive tabs in gray (#6b7280)
- Icons change between outline and filled based on active state

### Styling
All tab-related styles are in `styles.js`:
- `bottomTabs`: Container for tab bar
- `tab`: Individual tab button
- `tabText`: Tab label text
- `tabTextActive`: Active tab text (green)
- `attendanceTabs`: Sub-tabs for attendance filtering
- `attendanceTab`: Individual attendance filter tab
- `attendanceTabActive`: Active filter (green)
- `attendanceTabActiveRed`: Active absent filter (red)

---

## Design Consistency

### Colors
- **Primary Green**: #10b981 (active states, icons)
- **Gray**: #6b7280 (inactive states)
- **Red**: #ef4444 (absent tab)
- **Yellow**: #f59e0b (late status)

### Icons (Ionicons)
- Dashboard: `home` / `home-outline`
- Events: `calendar` / `calendar-outline`
- Attendance: `clipboard` / `clipboard-outline`

### Borders
All cards maintain the 2px green border (#10b981) for consistency with the web frontend.

---

## User Experience

### Navigation Flow
1. User logs in → Dashboard tab shown by default
2. Tap Events tab → View all available events
3. Tap Attendance tab → View attendance history
4. Tap Dashboard tab → Return to overview

### Loading States
- Events tab shows loading spinner while fetching data
- Dashboard uses pull-to-refresh for updates

### Empty States
- Dashboard: "No check-ins yet" / "No upcoming events"
- Events: "No events available"
- Attendance: "No records found" / "No absences!" (positive message)

---

## API Endpoints Used

### Dashboard Tab
- `GET /api/student-dashboard`
  - Returns: stats, attendance records, upcoming events, next event, streak

### Events Tab
- `GET /api/student-events`
  - Returns: array of events with checked_in status

### Attendance Tab
- Uses data from dashboard endpoint
- Filters locally based on selected sub-tab

---

## Future Enhancements

Potential improvements:
1. Add pull-to-refresh on Events and Attendance tabs
2. Add event detail modal on tap
3. Add attendance export functionality
4. Add search/filter for events
5. Add date range filter for attendance
6. Add push notifications for upcoming events
7. Add QR code scanner for check-in

---

## Testing Checklist

- [ ] Dashboard tab loads correctly
- [ ] Events tab fetches and displays events
- [ ] Attendance tab shows all records
- [ ] Sub-tabs filter attendance correctly
- [ ] Absent tab shows missed events
- [ ] Tab switching is smooth
- [ ] Icons change on active state
- [ ] Colors match design system
- [ ] Empty states display properly
- [ ] Loading states work correctly
- [ ] Pull-to-refresh works on dashboard
- [ ] Logout button works from all tabs
- [ ] Data persists when switching tabs

---

## Troubleshooting

### Tab not switching
- Check `activeTab` state is updating
- Verify `setActiveTab` is called on press

### Data not loading
- Check API endpoints are accessible
- Verify token is set in axios headers
- Check network connectivity

### Styles not applying
- Ensure all styles are imported from `styles.js`
- Check for typos in style names
- Verify StyleSheet.create is used

### Icons not showing
- Ensure `@expo/vector-icons` is installed
- Check icon names are correct
- Verify Ionicons is imported

---

## Related Files
- `USG_app/App.jsx` - Main app component with tab logic
- `USG_app/styles.js` - All styling definitions
- `backend/routes/api.php` - API endpoints
- `backend/app/Http/Controllers/AuthController.php` - Dashboard endpoint
