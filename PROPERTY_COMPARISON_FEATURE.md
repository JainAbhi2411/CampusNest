# Property Comparison Feature Documentation

## Overview
The Property Comparison feature allows users to compare up to 4 properties side-by-side with intelligent scoring and analytics tracking. This is an advanced feature not commonly found in student accommodation platforms.

## Key Features

### 1. **Smart Comparison System**
- Compare up to 4 properties simultaneously
- Side-by-side visual comparison
- Intelligent scoring algorithm
- Best value recommendation

### 2. **Scoring Algorithm**
Properties are scored based on multiple weighted factors:
- **Price Score (35%)**: Lower prices get higher scores
- **Rating Score (25%)**: Based on user reviews
- **Amenities Score (25%)**: WiFi, AC, parking, food availability
- **Location Score (15%)**: Proximity to campus/facilities

### 3. **Anonymous User Support**
- Works for both logged-in and anonymous users
- UUID-based tracking in localStorage
- Seamless experience without login requirement

### 4. **Analytics Tracking**
- Tracks which properties are frequently compared together
- Powers AI recommendation engine
- Helps identify popular property combinations

### 5. **User Interface Components**

#### Floating Comparison Bar
- Appears when properties are added to comparison
- Shows property thumbnails
- Quick remove functionality
- Direct link to comparison page

#### Compare Button on Property Cards
- One-click add/remove from comparison
- Visual feedback (highlighted when in comparison)
- Limit notification (max 4 properties)

#### Comparison Page
- Side-by-side property cards
- Visual score indicators with progress bars
- Detailed amenity comparison
- "Best Value" badge for top-scored property
- Responsive horizontal scroll for mobile

## Technical Implementation

### Database Schema

#### `property_comparisons` Table
```sql
- id: uuid (primary key)
- user_id: uuid (nullable, for authenticated users)
- anonymous_id: text (nullable, for anonymous users)
- property_ids: text[] (array of property IDs)
- created_at: timestamptz
- updated_at: timestamptz
```

#### `comparison_analytics` Table
```sql
- id: uuid (primary key)
- property_id_1: uuid
- property_id_2: uuid
- comparison_count: integer
- last_compared_at: timestamptz
```

### API Methods

#### `comparisonApi.getComparisonProperties(userId?)`
Retrieves all properties in the user's comparison list.

#### `comparisonApi.addToComparison(propertyId, userId?)`
Adds a property to the comparison list (max 4).

#### `comparisonApi.removeFromComparison(propertyId, userId?)`
Removes a property from the comparison list.

#### `comparisonApi.clearComparison(userId?)`
Removes all properties from the comparison list.

#### `comparisonApi.calculateComparisonScores(properties)`
Calculates weighted scores for each property in the comparison.

#### `comparisonApi.getFrequentlyComparedProperties(propertyId)`
Returns properties that are frequently compared with the given property.

### React Context

#### `ComparisonProvider`
Provides comparison state and methods throughout the app.

**State:**
- `comparisonProperties`: Array of properties in comparison
- `comparisonCount`: Number of properties in comparison
- `isLoading`: Loading state

**Methods:**
- `isInComparison(propertyId)`: Check if property is in comparison
- `addToComparison(property)`: Add property to comparison
- `removeFromComparison(propertyId)`: Remove property from comparison
- `clearComparison()`: Clear all properties
- `refreshComparison()`: Reload comparison data

### Components

#### `ComparisonBar.tsx`
Floating bar that appears at the bottom of the screen when properties are in comparison.

**Features:**
- Shows property count
- Displays property thumbnails (up to 3, then "+N more")
- Quick remove buttons on hover
- "Compare Now" button linking to comparison page

#### `Compare.tsx` (Page)
Full comparison page with side-by-side property cards.

**Features:**
- Responsive grid layout
- Score visualization with progress bars
- Detailed amenity comparison with icons
- Best value highlighting
- Empty state with call-to-action

#### `PropertyCard.tsx` (Updated)
Added compare button to existing property cards.

**Features:**
- Circular compare button with icon
- Visual state (highlighted when in comparison)
- Prevents event bubbling to card link

## User Experience Flow

### Adding Properties to Comparison
1. User browses properties
2. Clicks compare button on property card
3. Property is added to comparison
4. Toast notification confirms addition
5. Floating comparison bar appears
6. User can continue browsing or click "Compare Now"

### Viewing Comparison
1. User clicks "Compare Now" on floating bar
2. Redirected to `/compare` page
3. Properties displayed side-by-side
4. Scores calculated and displayed
5. Best value property highlighted
6. User can remove properties or clear all

### Comparison Limits
- Maximum 4 properties can be compared
- When limit reached, user must remove one to add another
- Clear visual feedback via toast notifications

## Analytics & Recommendations

### Tracking
Every time properties are compared together:
1. Analytics record is created/updated
2. Comparison count incremented
3. Last compared timestamp updated

### Future Use
Analytics data will power:
- "Frequently compared with" recommendations
- Similar property suggestions
- Popular comparison insights
- Market trend analysis

## Security & Privacy

### Row Level Security (RLS)
- Public read access for comparison data
- Users can only modify their own comparisons
- Anonymous users tracked via UUID (not stored in database permanently)

### Data Retention
- Comparison data persists for authenticated users
- Anonymous comparisons stored temporarily
- Analytics data aggregated and anonymized

## Performance Optimizations

### Client-Side
- Comparison state cached in React context
- Minimal re-renders with optimized state updates
- Lazy loading of comparison page

### Server-Side
- Efficient batch queries for multiple properties
- Indexed database queries
- Analytics updates use increment functions

## Future Enhancements

### Planned Features
1. **Export to PDF**: Download comparison as PDF document
2. **Share Comparison**: Generate shareable link for comparison
3. **Save Comparison**: Save comparison for later viewing
4. **Email Comparison**: Send comparison to email
5. **Print Optimization**: Print-friendly comparison layout
6. **Advanced Filters**: Filter comparison by specific criteria
7. **Custom Weights**: Allow users to adjust scoring weights
8. **Comparison History**: View past comparisons

### AI Integration
- Use comparison analytics for personalized recommendations
- Predict which properties users might want to compare
- Suggest optimal property combinations based on preferences

## Testing Checklist

- [x] Add property to comparison
- [x] Remove property from comparison
- [x] Clear all properties
- [x] View comparison page
- [x] Score calculation accuracy
- [x] Best value highlighting
- [x] Floating bar visibility
- [x] Anonymous user support
- [x] Authenticated user support
- [x] Limit enforcement (max 4)
- [x] Toast notifications
- [x] Responsive design
- [x] Empty state handling

## Conclusion

The Property Comparison feature provides a sophisticated, user-friendly way for students to evaluate accommodation options. With intelligent scoring, analytics tracking, and seamless UX, it sets CampusNest apart from competitors in the student housing market.
