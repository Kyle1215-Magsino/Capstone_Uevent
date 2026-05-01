# Quick Start Guide - Tab Navigation

## What's New?

Your mobile app now has **3 tabs** at the bottom of the student dashboard:

```
┌─────────────────────────────────────┐
│         Student Dashboard           │
│                                     │
│  [Content changes based on tab]    │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  🏠 Dashboard  📅 Events  📋 Attend │
└─────────────────────────────────────┘
```

---

## Tab 1: Dashboard (🏠)
**Your main overview**

Shows:
- Welcome message with your name
- Next upcoming event (green banner)
- 4 stat cards (Events, Present, Late, Streak)
- Attendance rate percentage
- Recent check-ins (last 5)
- Upcoming events list

**When to use**: Check your overall attendance status

---

## Tab 2: Events (📅)
**Browse all events**

Shows:
- All available events (upcoming + ongoing)
- Event details (name, date, venue)
- Status badges (ONGOING/UPCOMING)
- "Checked In" badge if you already checked in

**When to use**: See what events are available

---

## Tab 3: Attendance (📋)
**Your attendance history**

Shows:
- All your attendance records
- Filter by: All / Present / Late / Absent
- Check-in times and methods
- Events you missed (Absent tab)

**When to use**: Review your attendance history

---

## How to Use

### Switching Tabs
1. Tap any tab icon at the bottom
2. Content updates instantly
3. Active tab is highlighted in green

### Filtering Attendance
1. Go to Attendance tab
2. Tap filter buttons: All / Present / Late / Absent
3. View filtered records

### Refreshing Data
1. Pull down on Dashboard tab to refresh
2. Events tab auto-refreshes when opened
3. Attendance uses cached dashboard data

---

## Color Guide

- **Green** (#10b981) = Active, Present, Success
- **Yellow** (#f59e0b) = Late
- **Red** (#ef4444) = Absent
- **Gray** (#6b7280) = Inactive, Neutral
- **Blue** (#3b82f6) = Ongoing events

---

## Tips

✅ **Dashboard tab** is your home - check it daily  
✅ **Events tab** shows what's coming up  
✅ **Attendance tab** tracks your history  
✅ Pull down to refresh on Dashboard  
✅ Green borders = consistent design  
✅ Icons change when tab is active  

---

## Troubleshooting

**Tab not switching?**
- Make sure you're tapping the tab icon/text
- Check your internet connection

**Data not loading?**
- Pull down to refresh
- Check if you're logged in
- Restart the app

**Styles look wrong?**
- Close and reopen the app
- Clear Expo cache: `expo start -c`

---

## Running the App

```bash
# Start the development server
cd USG_app
npm start

# Or use Expo CLI
expo start

# Scan QR code with Expo Go app
```

---

## Need Help?

Check these files:
- `TAB_NAVIGATION_GUIDE.md` - Detailed documentation
- `CHANGELOG.md` - Version history
- `AUTHENTICATION.md` - Login/register info
- `README.md` - General app info
