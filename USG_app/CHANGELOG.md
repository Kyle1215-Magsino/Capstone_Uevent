# U-EventTrack Mobile App - Changelog

## Version 1.3.3 - Events Banner Fix (Current)

### Fixed
- **Events banner now always visible** on landing page
- Added empty state when no events available
- Added loading state for better UX
- Improved error handling and logging

### Added
- Empty state message: "No active events at the moment"
- Loading indicator while fetching events
- Console logging for debugging (shows event count)
- TROUBLESHOOTING.md guide for common issues

### Changed
- Banner section always renders (not conditional on events.length)
- "Swipe to see more →" only shows when events exist
- Better visual feedback for all states (loading/empty/populated)

---

## Version 1.3.2 - Events Banner

### Added
- **Horizontal Scrolling Events Banner** similar to desktop version
- Swipeable event cards with status indicators
- "Swipe to see more →" hint for better UX
- Animated status dots on event cards
- Compact event information display

### Changed
- Replaced vertical events list with horizontal scrolling banner
- Events now show in card format with better visual hierarchy
- Status badges now have animated dots and colored backgrounds
- All events displayed (not limited to 3)
- Improved spacing and layout for mobile viewing

### Design Features
- **Card Width**: 280px for optimal mobile viewing
- **Status Colors**: Green for ongoing, Blue for upcoming
- **Animated Dots**: White pulsing dots on status badges
- **Horizontal Scroll**: Native smooth scrolling
- **Green Borders**: 2px borders matching brand

### Files Modified
- `USG_app/App.jsx` - Replaced events section with banner
- `USG_app/styles.js` - Added 15+ new banner styles

---

## Version 1.3.1 - Logo Integration

### Added
- **USG Logo** displayed in navbar (36x36px circular)
- **Large Hero Logo** in landing page (200x200px circular with green border and shadow)
- Logo asset copied from web frontend (`usg-logo.png`)

### Changed
- Replaced calendar icon with actual USG logo in navbar
- Enhanced hero section with prominent logo display
- Added logo styles with proper sizing and effects

### Files Modified
- `USG_app/App.jsx` - Added Image component and logo displays
- `USG_app/styles.js` - Added logoImage, heroLogoContainer, and heroLogo styles
- `USG_app/assets/usg-logo.png` - Added logo asset

---

## Version 1.3.0 - Tab Navigation Update

### Added
- **Bottom Tab Navigation** for student dashboard
  - Dashboard tab (home icon) - Main overview
  - Events tab (calendar icon) - Browse available events
  - Attendance tab (clipboard icon) - View attendance history
- **Attendance Filtering** with sub-tabs
  - All records
  - Present only
  - Late only
  - Absent (missed events)
- **Events Tab** with live data fetching
  - Shows all available events
  - Displays check-in status
  - Auto-loads on tab switch
- **Enhanced Dashboard Tab**
  - Next event banner
  - Stats cards (Events, Present, Late, Streak)
  - Attendance rate circle
  - Recent check-ins timeline
  - Upcoming events list

### Changed
- Moved dashboard content into separate tab component
- Improved state management with `activeTab` state
- Enhanced user experience with tab-based navigation

### Fixed
- Fixed `useState` hook placement (moved to component top level)
- Removed duplicate dashboard rendering code
- Added all missing styles for tabs and attendance filtering

### Files Modified
- `USG_app/App.jsx` - Added tab navigation and components
- `USG_app/styles.js` - Added 20+ new styles for tabs

### Files Added
- `USG_app/TAB_NAVIGATION_GUIDE.md` - Complete documentation

---

## Version 1.2.0 - Logout Confirmation

### Added
- Logout confirmation alert with Cancel/Logout options
- Success message after logout

---

## Version 1.1.0 - Complete Green Borders

### Changed
- All cards now have complete 2px green borders (#10b981)
- Enhanced shadow effects for depth
- Consistent border styling across all components

---

## Version 1.0.0 - React Native Icons

### Added
- Ionicons from `@expo/vector-icons` package
- Professional icon set throughout the app

### Changed
- Replaced all emoji icons with Ionicons
- Created separate `styles.js` file for organization

---

## Version 0.9.0 - Full Feature Implementation

### Added
- Complete home screen with all sections
- Student dashboard with stats and attendance
- Login and registration modals
- API integration with backend

---

## Version 0.5.0 - Token-Based Authentication

### Added
- Mobile-specific login endpoint (`/api/mobile/login`)
- Sanctum token authentication
- Token storage in axios headers

### Changed
- Switched from session-based to token-based auth

---

## Version 0.1.0 - Initial Release

### Added
- Basic Expo app setup
- Simple navigation structure
- Initial UI components

---

## Upcoming Features

### Planned for v1.4.0
- Event detail modal
- QR code scanner for check-in
- Push notifications

### Planned for v1.5.0
- Attendance export (CSV)
- Search and filter for events
- Date range filter for attendance

### Planned for v2.0.0
- Offline mode support
- Biometric authentication
- Dark mode theme
