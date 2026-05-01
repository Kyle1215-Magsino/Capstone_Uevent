# Logo Implementation Guide

## Overview
The USG logo is now integrated into the mobile app's landing page, matching the web frontend design.

---

## Logo Locations

### 1. Navbar Logo (Small)
**Location**: Top-left corner of the app  
**Size**: 36x36 pixels  
**Style**: Circular with green background  
**Purpose**: Brand identity and navigation

```
┌─────────────────────────────────────┐
│ [🎓] U-EventTrack    [Sign In]     │
│      MinSU Bongabong                │
└─────────────────────────────────────┘
```

**Implementation**:
```jsx
<View style={styles.logo}>
  <Image 
    source={require('./assets/usg-logo.png')} 
    style={styles.logoImage}
    resizeMode="cover"
  />
</View>
```

**Styles**:
- Width: 36px
- Height: 36px
- Border radius: 12px (rounded corners)
- Background: #10b981 (green)
- Overflow: hidden

---

### 2. Hero Logo (Large)
**Location**: Center of hero section (landing page)  
**Size**: 200x200 pixels  
**Style**: Circular with green border and shadow  
**Purpose**: Visual impact and brand prominence

```
┌─────────────────────────────────────┐
│                                     │
│         [Large USG Logo]            │
│            200x200px                │
│                                     │
│         Smart Attendance            │
│         for USG Events              │
│                                     │
└─────────────────────────────────────┘
```

**Implementation**:
```jsx
<View style={styles.heroLogoContainer}>
  <Image 
    source={require('./assets/usg-logo.png')} 
    style={styles.heroLogo}
    resizeMode="cover"
  />
</View>
```

**Styles**:
- Width: 200px
- Height: 200px
- Border radius: 100px (perfect circle)
- Border: 4px solid #10b981 (green)
- Shadow: Green glow effect
- Elevation: 8 (Android shadow)

---

## Logo Asset

### File Details
- **Filename**: `usg-logo.png`
- **Location**: `USG_app/assets/usg-logo.png`
- **Source**: Copied from `frontend/public/usg-logo.png`
- **Format**: PNG with transparency support

### Asset Management
The logo is imported using React Native's `require()` syntax:
```javascript
require('./assets/usg-logo.png')
```

This ensures the logo is bundled with the app and works offline.

---

## Design Specifications

### Colors
- **Border Color**: #10b981 (Primary Green)
- **Shadow Color**: #10b981 (Green glow)
- **Background** (navbar): #10b981

### Spacing
- **Navbar Logo**: 12px margin-right
- **Hero Logo**: 24px vertical margin

### Effects
- **Shadow Opacity**: 0.3
- **Shadow Radius**: 16px
- **Shadow Offset**: (0, 8)
- **Elevation**: 8 (Android)

---

## Responsive Behavior

### Small Screens
- Navbar logo: Always 36x36px
- Hero logo: Scales to 200x200px (may need adjustment for very small screens)

### Large Screens
- Logos maintain fixed sizes
- Hero logo centered in container

---

## Comparison with Web Frontend

### Web Frontend
```jsx
<img
  src="/usg-logo.png"
  alt="USG Logo"
  className="w-96 h-96 object-cover rounded-full drop-shadow-2xl"
/>
```
- Size: 384x384px (w-96 = 24rem)
- Rounded: Full circle
- Shadow: 2xl drop shadow

### Mobile App
```jsx
<Image 
  source={require('./assets/usg-logo.png')} 
  style={styles.heroLogo}
  resizeMode="cover"
/>
```
- Size: 200x200px (smaller for mobile)
- Rounded: Full circle
- Shadow: Custom green glow
- Border: 4px green border

**Differences**:
- Mobile logo is smaller (200px vs 384px) for better mobile UX
- Mobile has explicit green border
- Mobile uses custom shadow with green tint

---

## Image Optimization

### Current Setup
- Using PNG format
- No optimization applied yet

### Recommended Optimizations
1. **Compress PNG**: Reduce file size without quality loss
2. **Multiple Resolutions**: Provide @2x and @3x versions for different screen densities
3. **WebP Format**: Consider WebP for better compression (if supported)

### File Naming Convention
```
usg-logo.png       // 1x resolution
usg-logo@2x.png    // 2x resolution (Retina)
usg-logo@3x.png    // 3x resolution (high-DPI)
```

---

## Troubleshooting

### Logo Not Showing
1. **Check file exists**: Verify `USG_app/assets/usg-logo.png` exists
2. **Restart Metro**: Stop and restart Expo server
3. **Clear cache**: Run `expo start -c`
4. **Check import**: Ensure `Image` is imported from 'react-native'

### Logo Appears Blurry
1. **Provide higher resolution**: Add @2x and @3x versions
2. **Check source image**: Ensure source PNG is high quality
3. **Use correct resizeMode**: Try 'contain' or 'cover'

### Logo Not Circular
1. **Check border radius**: Should be half of width/height
2. **Check overflow**: Ensure `overflow: 'hidden'` is set
3. **Verify dimensions**: Width and height should be equal

### Shadow Not Visible
1. **iOS**: Check shadowColor, shadowOffset, shadowOpacity, shadowRadius
2. **Android**: Check elevation property
3. **Both**: Ensure background is not the same color as shadow

---

## Code References

### App.jsx
- Line ~1: Import Image component
- Line ~550: Navbar logo implementation
- Line ~585: Hero logo implementation

### styles.js
- Line ~30: logoImage style
- Line ~150: heroLogoContainer style
- Line ~155: heroLogo style

---

## Future Enhancements

### Planned Improvements
1. **Animated Logo**: Add subtle animation on load
2. **Logo Variants**: Dark mode version
3. **Splash Screen**: Use logo in app splash screen
4. **App Icon**: Update app icon to match logo
5. **Loading State**: Show logo while app loads

### Animation Ideas
```javascript
// Fade in animation
Animated.timing(opacity, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true,
}).start();

// Scale animation
Animated.spring(scale, {
  toValue: 1,
  friction: 3,
  useNativeDriver: true,
}).start();
```

---

## Related Files
- `USG_app/App.jsx` - Logo implementation
- `USG_app/styles.js` - Logo styles
- `USG_app/assets/usg-logo.png` - Logo asset
- `frontend/public/usg-logo.png` - Original logo source
- `USG_app/CHANGELOG.md` - Version history
