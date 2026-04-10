# Event Announcements System

## Overview
This system automatically creates announcements on the landing page for upcoming events based on their proximity to the event date.

## How It Works

### Automatic Announcement Creation
When an event is created or updated, the system automatically checks if it should create an announcement based on these rules:

- **Today (0 days)**: Creates an "Alert" announcement with highest priority
  - Example: "🎯 Today: Tech Workshop at Main Hall - 2:00 PM"
  
- **Tomorrow (1 day)**: Creates a "Reminder" announcement
  - Example: "📍 Tomorrow: Tech Workshop at Main Hall"
  
- **Within 3 days**: Creates an "Event" announcement
  - Example: "📅 In 2 days: Tech Workshop at Main Hall"
  
- **Within 7 days**: Creates an "Event" announcement with date
  - Example: "📅 Upcoming: Tech Workshop on Apr 10 at Main Hall"

### Announcement Tags & Colors
- **Alert** (Red) - Events happening today
- **Reminder** (Yellow) - Events happening tomorrow
- **Event** (Blue) - Upcoming events within a week

### Automatic Updates
- When an event is updated, its announcement is automatically updated
- When an event is marked as "completed" or "cancelled", its announcement is deactivated
- Duplicate announcements are prevented

### Scheduled Sync
The system runs a daily check at 6:00 AM to:
- Create announcements for newly upcoming events
- Update existing announcements
- Remove announcements for past events

## Manual Sync

### Via Command Line
```bash
php artisan events:sync-announcements
```

### Via API (Admin only)
```bash
POST /api/announcements/sync-events
```

## Setup

### Enable Scheduled Tasks
To enable the daily automatic sync, add this to your cron:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Or run the scheduler manually:
```bash
php artisan schedule:work
```

## Features on Landing Page
- Announcements appear at the top of the landing page
- Color-coded by urgency/type
- Dismissible by users (saved in localStorage)
- Responsive design with dark mode support
- Sorted by priority (today's events first)

## Database
Announcements are stored in the `announcements` table with:
- `tag`: Event type (Event, Reminder, Alert)
- `text`: Announcement message
- `active`: Whether the announcement is visible
- `sort_order`: Display priority (0 = highest)
- `created_by`: User who created the event
