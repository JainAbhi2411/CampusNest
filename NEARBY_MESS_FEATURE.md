# Nearby Mess Facilities Feature

## Overview
Added a "Nearby Mess Facilities" section to the property details page that displays mess facilities available in the same city as the property. This helps students find food options near their potential accommodation.

## Implementation Details

### 1. API Function
**File:** `src/db/api.ts`

Added `getNearbyMessFacilities()` function to the `messFacilityApi`:
```typescript
async getNearbyMessFacilities(city: string, limit = 5): Promise<MessFacility[]>
```

**Features:**
- Searches mess facilities by city (case-insensitive)
- Returns up to `limit` results (default: 5)
- Orders by creation date (newest first)
- Returns empty array if no results found

### 2. Property Details Page Updates
**File:** `src/pages/PropertyDetails.tsx`

#### State Management
Added two new state variables:
- `nearbyMess`: Array of nearby mess facilities
- `isLoadingMess`: Loading state for mess data

#### Data Loading
- `loadNearbyMess()`: Fetches nearby mess facilities based on city
- Automatically called when property data is loaded
- Loads 4 mess facilities for display

#### UI Components
New section added after the Contact Information card with:
- Section header with icon and "View All" button
- Loading skeletons during data fetch
- Mess facility cards with hover effects
- Empty state with call-to-action

## User Interface

### Nearby Mess Section Layout

#### Header
- **Icon:** UtensilsCrossed icon
- **Title:** "Nearby Mess Facilities"
- **Action Button:** "View All" (links to /mess page)
  - Only shown when mess facilities are available

#### Mess Facility Cards
Each card displays:

1. **Name & Price**
   - Mess facility name (clickable)
   - Monthly price badge (if available)
   - Format: ₹{price}/mo

2. **Location**
   - MapPin icon
   - Full location address
   - Truncated with ellipsis if too long

3. **Meal Types**
   - Up to 3 meal type badges
   - "+X more" badge if more than 3 types
   - Examples: Breakfast, Lunch, Dinner

4. **Cuisine Types**
   - Comma-separated list
   - Truncated with ellipsis if too long
   - Format: "Cuisine: North Indian, South Indian"

#### Card Interactions
- **Hover Effect:**
  - Border changes to primary color
  - Shadow appears
  - Smooth transition (0.3s ease)
- **Click:** Navigates to mess detail page (`/mess/{id}`)

#### Loading State
- Shows 2 skeleton cards
- Each skeleton has 3 lines of varying widths
- Uses muted background color

#### Empty State
- Large UtensilsCrossed icon (48x48)
- Message: "No mess facilities found in {city}"
- "Browse All Mess Facilities" link button
- Links to /mess page

## Technical Features

### Responsive Design
- Cards stack vertically on all screen sizes
- Flexible layout adapts to content
- Proper spacing and padding

### Performance
- Separate loading state for mess data
- Doesn't block property data loading
- Efficient query with city filter and limit

### Error Handling
- Try-catch blocks for API calls
- Console error logging
- Graceful fallback to empty state

### Data Flow
```
Property Loaded → Extract City → Load Nearby Mess → Display Results
```

### Navigation Links
1. **View All Button:** `/mess` (all mess facilities)
2. **Mess Card Click:** `/mess/{id}` (specific mess details)
3. **Empty State Link:** `/mess` (browse all)

## User Benefits

### For Students
1. **Convenience:** See food options without leaving property page
2. **Decision Making:** Compare accommodation and food costs together
3. **Time Saving:** No need to search separately for mess facilities
4. **Location Context:** Only shows mess in the same city

### For Property Owners
1. **Added Value:** Nearby food options make property more attractive
2. **Complete Information:** Students get full picture of living costs
3. **Competitive Advantage:** Properties near good mess facilities stand out

## Code Quality

### Type Safety
- Full TypeScript typing
- Uses `MessFacility` interface
- Proper null/undefined handling

### Reusability
- `getNearbyMessFacilities()` can be used elsewhere
- Modular component structure
- Clean separation of concerns

### Maintainability
- Clear function names
- Descriptive comments
- Consistent code style
- Follows project conventions

## Future Enhancements

### Potential Improvements
1. **Distance Calculation:**
   - Use latitude/longitude for actual distance
   - Sort by proximity instead of creation date
   - Show distance in meters/kilometers

2. **Advanced Filtering:**
   - Filter by meal types
   - Filter by price range
   - Filter by dietary options

3. **Map Integration:**
   - Show mess locations on map
   - Visual representation of proximity
   - Interactive map markers

4. **Ratings Display:**
   - Show average ratings
   - Display review count
   - Quick rating overview

5. **Price Comparison:**
   - Compare mess prices
   - Show cheapest/most expensive
   - Price range indicators

6. **Availability Status:**
   - Show if accepting new members
   - Display capacity information
   - Real-time availability

## Testing Checklist

- [x] TypeScript compilation passes
- [x] Lint checks pass
- [ ] Section appears on property details page
- [ ] Mess facilities load correctly
- [ ] Loading skeletons display during fetch
- [ ] Empty state shows when no mess found
- [ ] Cards are clickable and navigate correctly
- [ ] "View All" button works
- [ ] Hover effects work smoothly
- [ ] Responsive on mobile devices
- [ ] Works with different city names
- [ ] Handles API errors gracefully

## Related Files

### Modified Files
1. `src/db/api.ts` - Added getNearbyMessFacilities function
2. `src/pages/PropertyDetails.tsx` - Added nearby mess section

### Related Components
- `src/components/ui/card.tsx` - Card component
- `src/components/ui/badge.tsx` - Badge component
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/skeleton.tsx` - Skeleton component

### Related Pages
- `src/pages/Mess.tsx` - Mess listing page
- `src/pages/MessDetails.tsx` - Mess detail page

## Database Schema

### mess_facilities Table
Key fields used:
- `id` - Unique identifier
- `name` - Mess facility name
- `location` - Full address
- `city` - City name (used for filtering)
- `monthly_price` - Monthly subscription price
- `meal_types` - Array of meal types offered
- `cuisine_types` - Array of cuisine types
- `created_at` - Creation timestamp (used for ordering)

## API Reference

### messFacilityApi.getNearbyMessFacilities()

**Parameters:**
- `city` (string, required) - City name to search in
- `limit` (number, optional) - Maximum results to return (default: 5)

**Returns:**
- `Promise<MessFacility[]>` - Array of mess facilities

**Example:**
```typescript
const mess = await messFacilityApi.getNearbyMessFacilities('Mumbai', 4);
```

**Query Details:**
- Uses case-insensitive ILIKE search
- Orders by `created_at DESC`
- Applies limit to results
- Returns empty array on error or no results
