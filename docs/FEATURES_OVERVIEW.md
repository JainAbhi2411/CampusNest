# CampusNest - Features Overview

## Platform Overview
CampusNest (formerly StayNearby) is a comprehensive student accommodation search platform that helps students find and book nearby accommodations including PGs, flats, hostels, and rooms for rent. The platform also provides information about nearby mess facilities.

---

## Core Features

### 1. User Authentication & Authorization
- **User Registration**: Secure account creation with email/phone verification
- **Login System**: Email and phone-based authentication
- **Role-Based Access**: 
  - Students: Browse, search, book, and review properties
  - Admins: Manage properties, mess facilities, and bookings
- **Profile Management**: Update personal information and preferences

**Documentation**: See authentication implementation in `src/contexts/AuthContext.tsx`

---

### 2. Property Search & Discovery

#### Advanced Search
- **Location-Based Search**: Find accommodations by city and area
- **Filter Options**:
  - Accommodation type (PG, Flat, Hostel, Room)
  - Price range
  - Gender preference
  - Amenities (WiFi, AC, Parking, etc.)
  - Availability status

#### Property Listings
- **Card-Based Layout**: Clean, modern property cards
- **Quick Information**: Price, location, type, and availability at a glance
- **Image Galleries**: Multiple property images
- **Sorting Options**: 
  - Price (Low to High / High to Low)
  - Rating
  - Newest first

**Pages**: `src/pages/Properties.tsx`, `src/pages/PropertyDetails.tsx`

---

### 3. Property Details & Visualization

#### Comprehensive Property Information
- **Basic Details**: Title, description, price, location
- **Amenities List**: WiFi, AC, parking, laundry, security, etc.
- **Property Specifications**:
  - Accommodation type
  - Gender preference
  - Occupancy type (single/double/triple)
  - Food inclusion status

#### Visual Features
- **Image Gallery**: Swipeable photo gallery with lightbox
- **360° Virtual Tours**: Immersive property viewing experience
- **Video Tours**: Property walkthrough videos

#### Interactive Elements
- **Favorite/Wishlist**: Save properties for later
- **Share Property**: Share via social media or copy link
- **View Counter**: Track property popularity
- **Rating & Reviews**: User-generated reviews and ratings

**Components**: 
- `src/components/property/ImageGallery.tsx`
- `src/components/property/FavoriteButton.tsx`
- `src/components/property/ShareButton.tsx`
- `src/components/property/ReviewSection.tsx`

---

### 4. Interactive Map Integration ⭐ NEW

#### Location Visualization
- **Property Location**: Blue marker showing exact property location
- **Nearby Mess Facilities**: Orange markers for nearby mess options
- **User Location**: Green marker showing current location (with permission)

#### Distance Calculations
- **Haversine Formula**: Accurate distance calculations
- **User to Property**: Shows distance from user's location
- **Property to Mess**: Distance from property to each mess facility
- **Smart Formatting**: Displays in meters (<1km) or kilometers (≥1km)

#### Interactive Features
- **Clickable Markers**: View detailed information in popups
- **Zoom & Pan Controls**: Explore the area
- **Direct Links**: Navigate to mess details from map popups
- **Responsive Design**: Works seamlessly on mobile and desktop

**Documentation**: See `docs/MAP_INTEGRATION_FEATURE.md`
**Component**: `src/components/map/PropertyMap.tsx`

---

### 5. Booking System

#### Visit Scheduling
- **Schedule Property Visits**: Book a time to view the property
- **Date & Time Selection**: Flexible scheduling options
- **Contact Information**: Provide contact details for confirmation

#### Online Booking
- **Direct Room Booking**: Reserve accommodation online
- **Booking Management**: View and manage your bookings
- **Status Tracking**: Track booking status (pending, confirmed, cancelled)

#### Admin Features
- **Booking Dashboard**: View all bookings
- **Status Management**: Approve or reject bookings
- **Contact Information**: Access user contact details

**Components**: 
- `src/components/property/BookingForm.tsx`
- `src/pages/Dashboard.tsx`

---

### 6. Mess Facilities

#### Mess Discovery
- **Browse Mess Facilities**: Explore available mess options
- **Location-Based**: Find mess near your accommodation
- **Detailed Information**:
  - Meal types (Breakfast, Lunch, Dinner)
  - Cuisine types
  - Pricing (per meal and monthly)
  - Operating hours
  - Contact information

#### Mess Details Page
- **Comprehensive Information**: Full mess facility details
- **Image Gallery**: Photos of food and facilities
- **Menu Information**: Available meal types and cuisines
- **Pricing Plans**: Per-meal and monthly subscription options
- **Reviews & Ratings**: User feedback

**Pages**: 
- `src/pages/MessFacilities.tsx`
- `src/pages/MessDetails.tsx`

---

### 7. Reviews & Ratings

#### User Reviews
- **Star Ratings**: 1-5 star rating system
- **Written Reviews**: Detailed feedback
- **Review Display**: Show all reviews for a property
- **Average Rating**: Calculated from all reviews

#### Review Management
- **Add Reviews**: Authenticated users can leave reviews
- **Edit Reviews**: Update your own reviews
- **Delete Reviews**: Remove your reviews
- **Admin Moderation**: Admins can manage inappropriate reviews

**Component**: `src/components/property/ReviewSection.tsx`

---

### 8. Favorites & Wishlist

#### Save Properties
- **Add to Favorites**: Save properties for later viewing
- **Quick Access**: View all saved properties in one place
- **Remove from Favorites**: Manage your wishlist

#### Visual Indicators
- **Heart Icon**: Shows favorite status
- **Toggle Functionality**: Easy add/remove
- **Persistent Storage**: Favorites saved to database

**Component**: `src/components/property/FavoriteButton.tsx`

---

### 9. Property Comparison System ⭐ NEW

#### Compare Properties
- **Side-by-Side Comparison**: Compare up to 4 properties
- **Comparison Bar**: Floating bar showing selected properties
- **Quick Add/Remove**: Manage comparison list easily

#### Comparison Metrics
- **Basic Information**: Price, location, type
- **Amenities**: Compare available facilities
- **Ratings**: See ratings side-by-side
- **Specifications**: Gender preference, occupancy, food inclusion

#### Smart Features
- **Persistent Storage**: Comparison list saved to database
- **Limit Enforcement**: Maximum 4 properties
- **Visual Indicators**: Clear comparison status

**Documentation**: See `docs/PROPERTY_COMPARISON_FEATURE.md`
**Components**: 
- `src/contexts/ComparisonContext.tsx`
- `src/components/comparison/ComparisonBar.tsx`
- `src/pages/Compare.tsx`

---

### 10. Rent Calculator

#### Financial Planning
- **Monthly Rent Calculation**: Base rent display
- **Additional Costs**: Maintenance, security deposit
- **Total Cost Breakdown**: Comprehensive cost analysis
- **Customizable Inputs**: Adjust parameters

**Component**: `src/components/property/RentCalculator.tsx`

---

### 11. Admin Dashboard

#### Property Management
- **Add Properties**: Create new property listings
- **Edit Properties**: Update property information
- **Delete Properties**: Remove listings
- **Manage Availability**: Update property status

#### Mess Management
- **Add Mess Facilities**: Create new mess listings
- **Edit Mess Details**: Update mess information
- **Manage Pricing**: Update meal and monthly prices

#### Booking Management
- **View All Bookings**: Comprehensive booking list
- **Update Status**: Approve or reject bookings
- **Contact Users**: Access user contact information

#### Analytics
- **Property Views**: Track property popularity
- **Booking Statistics**: Monitor booking trends
- **User Activity**: View user engagement

**Page**: `src/pages/Admin.tsx`

---

### 12. Responsive Design

#### Mobile-First Approach
- **Touch-Friendly**: Optimized for mobile interactions
- **Responsive Layouts**: Adapts to all screen sizes
- **Mobile Navigation**: Hamburger menu for small screens

#### Desktop Experience
- **Multi-Column Layouts**: Efficient use of screen space
- **Hover Effects**: Enhanced desktop interactions
- **Keyboard Navigation**: Full keyboard support

#### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1280px

---

### 13. Search & Filter System

#### Smart Search
- **Text Search**: Search by property name or location
- **Auto-Complete**: Suggestions as you type
- **Recent Searches**: Quick access to previous searches

#### Advanced Filters
- **Price Range**: Min and max price sliders
- **Amenities**: Multi-select amenity filters
- **Property Type**: Filter by accommodation type
- **Gender Preference**: Male, Female, or Any
- **Availability**: Show only available properties

#### Filter Persistence
- **URL Parameters**: Filters saved in URL
- **Browser History**: Back/forward navigation support
- **Clear Filters**: Reset all filters with one click

**Page**: `src/pages/Properties.tsx`

---

### 14. User Dashboard

#### Personal Dashboard
- **My Bookings**: View all your bookings
- **Booking Status**: Track booking progress
- **Favorite Properties**: Quick access to saved properties
- **Profile Information**: View and edit profile

#### Booking Actions
- **Cancel Bookings**: Cancel pending bookings
- **View Details**: See full booking information
- **Contact Owner**: Get owner contact details

**Page**: `src/pages/Dashboard.tsx`

---

### 15. Social Features

#### Sharing
- **Share Properties**: Share via social media
- **Copy Link**: Quick link copying
- **Share Button**: Easy sharing interface

#### Reviews & Community
- **User Reviews**: Read experiences from other students
- **Rating System**: See property ratings
- **Community Feedback**: Learn from others' experiences

**Component**: `src/components/property/ShareButton.tsx`

---

## Technical Features

### Performance Optimization
- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Efficient data caching strategies
- **Debouncing**: Optimized search and filter operations

### Security
- **Row Level Security**: Database-level access control
- **Authentication**: Secure user authentication
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs

### Database
- **Supabase**: PostgreSQL database
- **Real-time Updates**: Live data synchronization
- **Efficient Queries**: Optimized database queries
- **Migrations**: Version-controlled schema changes

### UI/UX
- **shadcn/ui**: Modern component library
- **Tailwind CSS**: Utility-first styling
- **Dark Mode**: Theme switching support
- **Animations**: Smooth transitions and effects

---

## Upcoming Features

### Planned Enhancements
1. **Wishlist with Price Tracking**: Track price changes for saved properties
2. **Smart Commute Calculator**: Calculate commute times to colleges
3. **AI-Powered Recommendations**: Personalized property suggestions
4. **Roommate Matching**: Find compatible roommates
5. **Neighborhood Insights**: Area safety and amenities information
6. **Virtual Tour Booking**: Schedule live virtual tours
7. **Student Community Hub**: Forums and discussions
8. **Payment Integration**: Online payment processing

**Documentation**: See `docs/ADVANCED_FEATURES_TODO.md`

---

## Feature Documentation

### Detailed Documentation
- **Map Integration**: `docs/MAP_INTEGRATION_FEATURE.md`
- **Property Comparison**: `docs/PROPERTY_COMPARISON_FEATURE.md`
- **Advanced Features**: `docs/ADVANCED_FEATURES_OVERVIEW.md`
- **Branding Updates**: `docs/BRANDING_UPDATE.md`

### Component Documentation
- All components include inline documentation
- TypeScript interfaces for type safety
- Props documentation in component files

---

## Browser Support

### Desktop Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Mobile Browsers
- ✅ Chrome Mobile
- ✅ Safari iOS
- ✅ Samsung Internet
- ✅ Firefox Mobile

---

## Accessibility

### WCAG Compliance
- Level AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus indicators
- Semantic HTML

### Inclusive Design
- Clear visual hierarchy
- Readable font sizes
- Color contrast ratios
- Alternative text for images
- Descriptive labels

---

**Last Updated**: December 2, 2024
**Version**: 2.0.0
**Platform**: CampusNest Student Accommodation Platform
