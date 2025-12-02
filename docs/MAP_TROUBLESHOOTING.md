# Map Integration Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "render2 is not a function" Error

#### Symptoms
- Error appears in browser console: `Uncaught TypeError: render2 is not a function`
- Map component fails to render
- Application crashes when navigating to property details page

#### Root Causes
1. **Browser Cache**: Old version of the component is cached
2. **React-Leaflet Hook Issues**: Using `useMap` hook incorrectly
3. **Component Export/Import**: Incorrect component export or import

#### Solutions

##### Solution 1: Clear Browser Cache
The most common cause is browser caching. To fix:

1. **Hard Refresh**:
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Cache Manually**:
   - Open DevTools (F12)
   - Right-click on the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Disable Cache in DevTools**:
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Disable cache"
   - Keep DevTools open while developing

##### Solution 2: Component Structure Fix
Ensure the PropertyMap component:
- Does not use `useMap` hook at the top level
- Has proper React component structure
- Returns valid JSX

```tsx
// ✅ CORRECT
export default function PropertyMap({ property, nearbyMess }: PropertyMapProps) {
  return (
    <MapContainer>
      {/* Map content */}
    </MapContainer>
  );
}

// ❌ WRONG - Using useMap at top level
export default function PropertyMap({ property, nearbyMess }: PropertyMapProps) {
  const map = useMap(); // This will cause errors
  return <MapContainer>...</MapContainer>;
}
```

##### Solution 3: Add Key Prop
Force component remount by adding a unique key:

```tsx
<MapContainer
  key={`map-${property.id}`}
  center={propertyLocation}
  zoom={14}
>
  {/* Map content */}
</MapContainer>
```

---

### Issue 2: "MapController is not defined" Error

#### Symptoms
- Error: `Uncaught ReferenceError: MapController is not defined`
- Occurs at line 177 of PropertyMap.tsx

#### Root Cause
- Old cached version of the file is being used
- MapController component was removed but browser still references it

#### Solution
1. **Clear browser cache** (see Solution 1 above)
2. **Restart development server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```
3. **Verify the file doesn't contain MapController**:
   ```bash
   grep -n "MapController" src/components/map/PropertyMap.tsx
   # Should return no results
   ```

---

### Issue 3: Map Not Displaying

#### Symptoms
- Map container is visible but empty
- No tiles or markers appear
- Console shows no errors

#### Possible Causes & Solutions

##### Cause 1: Missing Leaflet CSS
**Solution**: Ensure Leaflet CSS is imported in `index.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

##### Cause 2: Invalid Coordinates
**Solution**: Check that property has valid latitude/longitude:
```tsx
// Add fallback coordinates
const propertyLocation: [number, number] = [
  property.latitude || 28.6139,  // Default to Delhi
  property.longitude || 77.2090,
];
```

##### Cause 3: Container Height Not Set
**Solution**: Ensure map container has explicit height:
```tsx
<div className="w-full h-[500px]">
  <MapContainer className="w-full h-full">
    {/* Map content */}
  </MapContainer>
</div>
```

---

### Issue 4: Markers Not Appearing

#### Symptoms
- Map displays correctly
- Tiles load properly
- But markers are missing

#### Possible Causes & Solutions

##### Cause 1: Icon Initialization Error
**Solution**: Check console for icon errors and ensure proper initialization:
```tsx
if (typeof window !== 'undefined') {
  try {
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
    });
  } catch (error) {
    console.error('Error initializing Leaflet icons:', error);
  }
}
```

##### Cause 2: Invalid Position Data
**Solution**: Add null checks before rendering markers:
```tsx
{nearbyMess.map((mess) => {
  if (!mess.latitude || !mess.longitude) return null;
  
  const messPosition: [number, number] = [mess.latitude, mess.longitude];
  return <Marker key={mess.id} position={messPosition} icon={messIcon} />;
})}
```

##### Cause 3: Custom Icon Creation Error
**Solution**: Add error handling to icon creation:
```tsx
const createCustomIcon = (color: string, iconSvg: string): Icon => {
  try {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgContent)}`,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  } catch (error) {
    console.error('Error creating custom icon:', error);
    return new Icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }
};
```

---

### Issue 5: Geolocation Not Working

#### Symptoms
- User location marker doesn't appear
- Console shows geolocation errors

#### Possible Causes & Solutions

##### Cause 1: HTTPS Required
**Solution**: Geolocation API requires HTTPS in production. For development:
- Use `localhost` (works with HTTP)
- Or set up HTTPS for development

##### Cause 2: Permission Denied
**Solution**: User must grant location permission:
```tsx
navigator.geolocation.getCurrentPosition(
  (pos) => {
    setPosition([pos.coords.latitude, pos.coords.longitude]);
  },
  (err) => {
    console.error('Geolocation error:', err);
    // Show user-friendly message
    if (err.code === 1) {
      console.log('Location permission denied');
    }
  }
);
```

##### Cause 3: Browser Doesn't Support Geolocation
**Solution**: Add feature detection:
```tsx
if (!navigator.geolocation) {
  console.error('Geolocation is not supported by your browser');
  return;
}
```

---

### Issue 6: TypeScript Errors

#### Common TypeScript Errors

##### Error 1: Icon Type Mismatch
```
Type 'Default | Icon<...>' is not assignable to type 'Icon<IconOptions>'
```

**Solution**: Ensure createCustomIcon returns proper Icon type:
```tsx
const createCustomIcon = (color: string, iconSvg: string): Icon => {
  // Return Icon, not Icon.Default
  return new Icon({ /* options */ });
};
```

##### Error 2: Position Type Error
```
Type 'number[]' is not assignable to type '[number, number]'
```

**Solution**: Use tuple type explicitly:
```tsx
const position: [number, number] = [lat, lng];
```

---

## Development Best Practices

### 1. Always Clear Cache When Debugging
- Keep DevTools open with cache disabled
- Use hard refresh frequently
- Clear cache before testing fixes

### 2. Check Console for Errors
- Open browser console (F12)
- Look for red error messages
- Check Network tab for failed requests

### 3. Verify Data Before Rendering
```tsx
// Always validate coordinates
if (!property.latitude || !property.longitude) {
  return <div>Location data not available</div>;
}
```

### 4. Use Error Boundaries
Wrap map component in error boundary to catch rendering errors:
```tsx
<ErrorBoundary fallback={<div>Map failed to load</div>}>
  <PropertyMap property={property} nearbyMess={nearbyMess} />
</ErrorBoundary>
```

### 5. Add Loading States
```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Load map data
  loadMapData().finally(() => setIsLoading(false));
}, []);

if (isLoading) {
  return <div>Loading map...</div>;
}
```

---

## Testing Checklist

Before deploying map feature, verify:

- [ ] Map displays correctly on desktop
- [ ] Map displays correctly on mobile
- [ ] All markers appear (property, mess, user)
- [ ] Popups open when clicking markers
- [ ] Distance calculations are accurate
- [ ] Geolocation permission request works
- [ ] Map works without geolocation permission
- [ ] Map handles missing coordinates gracefully
- [ ] No console errors
- [ ] TypeScript compilation passes
- [ ] Lint checks pass

---

## Quick Fix Commands

### Clear All Caches
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear browser cache (manual step required)
```

### Restart Development Server
```bash
# Stop server (Ctrl+C)
# Start fresh
npm run dev
```

### Verify Component Structure
```bash
# Check for MapController references (should be empty)
grep -r "MapController" src/

# Check for useMap usage
grep -r "useMap" src/components/map/

# Verify imports
grep -r "react-leaflet" src/
```

### Run Tests
```bash
# TypeScript check
npm run lint

# Build check
npm run build
```

---

## Getting Help

If issues persist after trying these solutions:

1. **Check Documentation**:
   - `docs/MAP_INTEGRATION_FEATURE.md` - Feature documentation
   - `docs/FEATURES_OVERVIEW.md` - Complete features list

2. **Verify Installation**:
   ```bash
   npm list react-leaflet leaflet
   # Should show:
   # react-leaflet@4.2.1
   # leaflet@1.9.4
   ```

3. **Check File Integrity**:
   ```bash
   # Verify PropertyMap component exists
   ls -la src/components/map/PropertyMap.tsx
   
   # Check file size (should be ~8-10KB)
   wc -l src/components/map/PropertyMap.tsx
   ```

4. **Review Git History**:
   ```bash
   # See recent changes to map component
   git log --oneline -- src/components/map/PropertyMap.tsx
   
   # View specific commit
   git show <commit-hash>
   ```

---

## Known Limitations

1. **OpenStreetMap Rate Limits**:
   - Free tier has usage limits
   - Consider caching tiles for production

2. **Geolocation Accuracy**:
   - Depends on device GPS/WiFi
   - May be inaccurate indoors

3. **Browser Support**:
   - Requires modern browsers
   - IE11 not supported

4. **Performance**:
   - Large number of markers may slow down map
   - Consider clustering for 50+ markers

---

**Last Updated**: December 2, 2024
**Component Version**: 2.0.0
**React-Leaflet Version**: 4.2.1
**Leaflet Version**: 1.9.4
