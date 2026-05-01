# Events Banner Guide

## Overview
The mobile app now features a horizontal scrolling events banner, similar to the desktop version, providing an engaging way to browse active events.

---

## Banner Layout

### Visual Structure
```
┌─────────────────────────────────────────────────────┐
│  📅 Active Events                                   │
│     Swipe to see more →                             │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ [Event 1]│  │ [Event 2]│  │ [Event 3]│  ←──→   │
│  │  Card    │  │  Card    │  │  Card    │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
```

### Scrolling Behavior
- **Horizontal scroll**: Swipe left/right to browse events
- **No scroll indicator**: Clean, minimal design
- **Snap scrolling**: Cards align naturally
- **Padding**: 20px on sides for visual breathing room

---

## Event Card Design

### Card Structure
```
┌─────────────────────────────────┐
│ [● ONGOING]                     │  ← Status badge
│                                 │
│ Campus Leadership Summit        │  ← Event name (bold)
│                                 │
│ Join us for an inspiring day    │  ← Description
│ of leadership workshops...      │    (2 lines max)
│                                 │
│ 📅 Apr 5, 2026                  │  ← Date
│ 📍 Main Gymnasium               │  ← Venue
└─────────────────────────────────┘
```

### Card Specifications
- **Width**: 280px (fixed for consistency)
- **Background**: White (#fff)
- **Border**: 2px solid #10b981 (green)
- **Border Radius**: 16px (rounded corners)
- **Padding**: 16px
- **Margin Right**: 16px (spacing between cards)
- **Shadow**: Subtle elevation for depth

---

## Status Badge

### Badge Types

#### Ongoing Events
```
┌──────────────┐
│ ● ONGOING    │  ← Green background (#10b981)
└──────────────┘
```
- **Background**: #10b981 (green)
- **Dot**: White, 6x6px, pulsing
- **Text**: White, bold, uppercase

#### Upcoming Events
```
┌──────────────┐
│ ● UPCOMING   │  ← Blue background (#3b82f6)
└──────────────┘
```
- **Background**: #3b82f6 (blue)
- **Dot**: White, 6x6px, pulsing
- **Text**: White, bold, uppercase

### Badge Styling
- **Padding**: 10px horizontal, 6px vertical
- **Border Radius**: 12px
- **Font Size**: 10px
- **Font Weight**: Bold
- **Alignment**: Left (self-start)

---

## Typography

### Event Name
- **Font Size**: 18px
- **Font Weight**: Bold
- **Color**: #111827 (dark gray)
- **Line Height**: 24px
- **Max Lines**: 2 (with ellipsis)
- **Margin Bottom**: 8px

### Description
- **Font Size**: 13px
- **Font Weight**: Regular
- **Color**: #6b7280 (medium gray)
- **Line Height**: 18px
- **Max Lines**: 2 (with ellipsis)
- **Margin Bottom**: 12px

### Detail Text (Date/Venue)
- **Font Size**: 12px
- **Font Weight**: Regular
- **Color**: #6b7280 (medium gray)
- **Icon Size**: 12px
- **Gap**: 6px between icon and text

---

## Header Section

### Title Row
```
📅 Active Events
   Swipe to see more →
```

### Styling
- **Title Font Size**: 20px
- **Title Font Weight**: Bold
- **Title Color**: #111827
- **Icon Size**: 20px
- **Icon Color**: #10b981 (green)
- **Subtitle Font Size**: 12px
- **Subtitle Color**: #6b7280
- **Padding**: 20px horizontal
- **Margin Bottom**: 16px

---

## Comparison: Desktop vs Mobile

### Desktop Version
- **Layout**: Grid or vertical list
- **Cards**: Full width or multi-column
- **Interaction**: Click to view details
- **Scroll**: Vertical page scroll

### Mobile Version
- **Layout**: Horizontal scrolling banner
- **Cards**: Fixed 280px width
- **Interaction**: Swipe to browse
- **Scroll**: Horizontal card scroll

### Similarities
- Green color scheme (#10b981)
- Status badges with colors
- Event information hierarchy
- Clean, modern design

---

## User Experience

### Interaction Flow
1. User scrolls down to events banner
2. Sees "Swipe to see more →" hint
3. Swipes left to browse events
4. Views event details in cards
5. Can continue swiping to see all events

### Visual Feedback
- **Shadow on cards**: Indicates interactivity
- **Status dots**: Show event state at a glance
- **Color coding**: Green = ongoing, Blue = upcoming
- **Truncated text**: Keeps cards compact

### Accessibility
- **Clear labels**: Event name, date, venue
- **Icon indicators**: Calendar and location icons
- **Status badges**: High contrast colors
- **Touch targets**: Large card area for tapping

---

## Implementation Details

### ScrollView Configuration
```jsx
<ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.eventsBannerScroll}
>
```

### Key Props
- `horizontal`: Enables horizontal scrolling
- `showsHorizontalScrollIndicator={false}`: Hides scroll bar
- `contentContainerStyle`: Adds padding to scroll content

### Card Mapping
```jsx
{events.map((event) => (
  <View key={event.id} style={styles.eventBannerCard}>
    {/* Card content */}
  </View>
))}
```

---

## Styling Reference

### Main Styles
- `eventsBannerSection`: Container background
- `eventsBannerHeader`: Title and subtitle area
- `eventsBannerScroll`: ScrollView content padding
- `eventBannerCard`: Individual event card
- `eventBannerStatus`: Status badge
- `eventBannerName`: Event title
- `eventBannerDescription`: Event description
- `eventBannerDetails`: Date and venue container

### Color Palette
- **Primary Green**: #10b981
- **Blue**: #3b82f6
- **Dark Gray**: #111827
- **Medium Gray**: #6b7280
- **Light Gray**: #f9fafb
- **White**: #fff

---

## Performance Considerations

### Optimization
- **Fixed card width**: Prevents layout recalculation
- **numberOfLines prop**: Limits text rendering
- **Horizontal scroll**: Native performance
- **Shadow caching**: Elevation for Android

### Memory
- **All events loaded**: Consider pagination for 50+ events
- **Image optimization**: If event images added later
- **Scroll position**: Resets on component remount

---

## Future Enhancements

### Planned Features
1. **Tap to view details**: Modal with full event info
2. **Pull to refresh**: Update events list
3. **Event images**: Add event thumbnails
4. **Favorite events**: Star/bookmark functionality
5. **Filter by status**: Show only ongoing or upcoming
6. **Search events**: Quick search bar
7. **Event countdown**: Time until event starts

### Animation Ideas
```javascript
// Card entrance animation
Animated.stagger(100, 
  events.map(() => 
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
    })
  )
).start();

// Status dot pulse
Animated.loop(
  Animated.sequence([
    Animated.timing(scale, { toValue: 1.2, duration: 1000 }),
    Animated.timing(scale, { toValue: 1, duration: 1000 }),
  ])
).start();
```

---

## Troubleshooting

### Cards Not Scrolling
1. Check `horizontal` prop is set
2. Verify card width is fixed (280px)
3. Ensure ScrollView has content

### Cards Overlapping
1. Check `marginRight: 16` on cards
2. Verify `paddingHorizontal: 20` on scroll container
3. Ensure no negative margins

### Status Badge Not Showing
1. Check event.status value
2. Verify backgroundColor is set
3. Ensure text color is white

### Text Truncation Not Working
1. Add `numberOfLines` prop
2. Set fixed width on container
3. Use `ellipsizeMode="tail"`

---

## Testing Checklist

- [ ] Banner displays on home screen
- [ ] Cards scroll horizontally
- [ ] All events are visible
- [ ] Status badges show correct colors
- [ ] Status dots are visible
- [ ] Event names truncate at 2 lines
- [ ] Descriptions truncate at 2 lines
- [ ] Date and venue display correctly
- [ ] Icons render properly
- [ ] Green borders are visible
- [ ] Shadow/elevation works
- [ ] "Swipe to see more" hint shows
- [ ] Scroll is smooth
- [ ] No horizontal scroll indicator
- [ ] Cards have proper spacing
- [ ] Loading state works
- [ ] Empty state handled (no events)

---

## Related Files
- `USG_app/App.jsx` - Banner implementation
- `USG_app/styles.js` - Banner styles
- `USG_app/CHANGELOG.md` - Version history
- `backend/routes/api.php` - Events API endpoint

---

## API Data Structure

### Expected Event Object
```javascript
{
  id: 1,
  event_name: "Campus Leadership Summit",
  description: "Join us for an inspiring day...",
  event_date: "2026-04-05",
  venue: "Main Gymnasium",
  status: "ongoing" // or "upcoming"
}
```

### API Endpoint
- **URL**: `/api/events/active`
- **Method**: GET
- **Auth**: Not required (public)
- **Response**: Array of event objects

---

## Code References

### App.jsx
- Line ~640: Events banner section start
- Line ~645: Banner header
- Line ~650: Horizontal ScrollView
- Line ~655: Event card mapping

### styles.js
- Line ~240: eventsBannerSection
- Line ~245: eventsBannerHeader
- Line ~260: eventBannerCard
- Line ~275: eventBannerStatus
- Line ~285: eventBannerName
