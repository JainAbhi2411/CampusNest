# Student Accommodation Search Platform Requirements Document

## 1. Website Overview
### 1.1 Website Name
StayNearby - Student Accommodation Finder

### 1.2 Website Description
An advanced platform designed for students to search, explore, and book nearby accommodations including PGs (Paying Guest), flats, hostels, rooms for rent, and nearby mess facilities. The platform provides detailed property information with immersive viewing experiences, intelligent search capabilities, and convenient booking options.

## 2. Core Features
### 2.1 User Authentication
- User registration and login system
- Secure account management
- User profile with saved searches and favorites
\n### 2.2 Enhanced Search Bar with Advanced Filters
- **Prominent Search Bar Design:**
  + Large, centered search bar on homepage with auto-suggest functionality
  + Multi-field search interface combining location, filters, and quick actions
  + Expandable filter panel integrated within search bar
  + Real-time search results update as filters are applied
  + Search query validation and error handling

- **Location Detection & Selection:**
  + 'Get Current Location' button with GPS auto-detection
  + City dropdown selector with search functionality for manual selection
  + Recent searches quick access\n  + Popular cities quick selection chips
  + Location permission handling with fallback options

- **Integrated Quick Filters in Search Bar:**
  + Accommodation type pills (PG, Flat, Hostel, Room) with multi-select and active state indication
  + Price range quick selector (Budget, Mid-range, Premium) with custom range input
  + Move-in date picker with calendar dropdown and date validation
  + 'More Filters' expandable section revealing:\n    * Gender preference toggle (Male/Female/Co-ed)
    * Room type selector (Single/Double/Triple/Shared)
    * Furnishing status (Fully Furnished/Semi-Furnished/Unfurnished)
    * Essential amenities checkboxes (WiFi, AC, Parking, Laundry, etc.)
    * Food availability options (Included/Available Nearby/Not Available)
\n- **Advanced Search Features:**
  + Radius-based search slider (within 1km, 2km, 5km, 10km) with dynamic map preview
  + Search by specific area, landmark, or university name with autocomplete
  + Sort by: Relevance, Price (low to high/high to low), Distance, Rating, Newest
  + Save search preferences with custom naming
  + Search history with one-click reapply and delete option
  + Real-time availability status indicator with color coding
  + Clear all filters button with confirmation\n  + Filter result count display showing number of matching properties
  + Applied filters tag display with individual remove option
  + Filter persistence across page navigation

### 2.3 Category-Based Accommodation Display
- **Category Section (After Featured Properties):**
  + Dedicated section displaying accommodations organized by categories
  + Four main category tabs: PG Accommodations, Flats & Apartments, Hostels, Rooms for Rent
  + Each category shows:\n    * Category icon and title with property count
    * Grid layout of properties within that category
    * 'View All' button to see complete category listings
    * Quick filter options specific to each category
  + Horizontal scrollable cards on mobile, grid layout on desktop
  + Category-specific sorting options\n  + Empty state messaging when no properties available in category

### 2.4 Enhanced Property Details Display
- **Expanded Media Gallery:**
  + **Extensive Photo Collection:**
    * Minimum 20-30 high-resolution images per property
    * Multiple photos of each room (bedroom, kitchen, bathroom, living area)
    * Exterior shots from different angles
    * Common area and facility photos
    * Neighborhood and surrounding area images
    * Day and night view photos
    * Grid gallery view with category filters (Bedrooms, Bathrooms, Kitchen, Common Areas, Exterior)
    * Lightbox view with zoom functionality and smooth transitions
    * Image carousel with thumbnail navigation strip
    * Full-screen slideshow mode with auto-play option
  + **Video Walkthrough:**
    * Professional video tour of the entire property (3-5 minutes)
    * Embedded video player with standard controls (play, pause, volume, full-screen)
    * Multiple video angles and room-by-room coverage
    * Owner introduction video option
    * Video quality selector (720p, 1080p)\n    * Video thumbnail preview on hover
  + **360-Degree Virtual Tour:**
    * Interactive 360-degree panoramic view of each room
    * Click-and-drag navigation for immersive exploration
    * Hotspot markers for room transitions and feature highlights
    * Minimap showing current viewing position
    * VR headset compatibility option
    * Dollhouse view showing entire property layout in 3D
    * Measurement tool for room dimensions\n  + Floor plan viewer with room dimension labels
  + Full-screen mode for all media types
  + Media type toggle (Photos/Video/360° Tour/Floor Plan)
  + Download option for floor plans\n
- **Smart Rent Calculator:**
  + **Interactive Calculator Widget:**
    * Positioned prominently in property details sidebar
    * Accommodation type selector (PG/Flat/Hostel/Room)
    * Occupancy selector (Single/Double/Triple/Shared)\n    * Lease duration slider (1 month to 12 months)
    * Move-in date picker\n  + **Dynamic Cost Breakdown:**
    * Base rent calculation based on accommodation type and occupancy
    * Security deposit calculation (typically 1-2 months rent)\n    * Maintenance charges breakdown
    * Utility estimates (electricity, water, gas) with seasonal adjustments
    * Additional service charges (WiFi, housekeeping, laundry)
    * One-time charges (registration fee, brokerage if applicable)
  + **Smart Features:**
    * Automatic discount calculation for longer lease durations
    * Seasonal pricing adjustments display
    * Comparison with average market rates in the area
    * Monthly vs. total cost toggle view
    * Cost per person calculation for shared accommodations
    * Savings indicator when booking longer durations
    * Export calculation as PDF option
    * Share calculation via link\n  + **Visual Representation:**
    * Pie chart showing cost distribution\n    * Bar graph comparing different lease duration costs
    * Savings meter showing potential discounts
    * Color-coded affordability indicator
\n- **Comprehensive Property Information:**
  + Rental pricing with detailed breakdown (rent, deposit, maintenance, electricity, water)\n  + Available from date with calendar view
  + Property size and room configuration
  + Detailed facilities and amenities with icons and descriptions
  + Room-wise amenity breakdown
  + Furnishing details with item list
  + House rules and policies section
  + Pet policy and smoking policy indicators
  + Parking availability with slot details
\n- **Location & Nearby Information:**
  + Interactive location map with the selected accommodation pinned and highlighted at center
  + Map marker showing exact property location with custom icon
  + Zoom and pan controls for map exploration
  + Nearby landmarks display (colleges, hospitals, markets, transport) with distance indicators
  + Distance calculator to user's preferred location
  + **Nearby Mess Display on Map:**
    * All nearby mess facilities shown as markers on the same map
    * Different marker icons/colors to distinguish messes from accommodation
    * Click on mess marker to view quick info popup (name, distance, rating, price range)
    * List view of nearby messes below the map with:\n      - Mess name and thumbnail image
      - Distance from selected accommodation
      - Ratings and review count
      - Pricing information (meal plans, monthly rates)\n      - Cuisine type and meal timings
      - 'View Details' button linking to full mess information
      - Filter messes by distance, rating, cuisine type\n    * Toggle to show/hide mess markers on map\n  + Public transport connectivity details
  + Walkability score and safety rating
  + Neighborhood highlights and local amenities
\n- **Owner & Contact Details:**
  + Property owner/manager profile with verification badge
  + Contact options: Call, WhatsApp, Email, Chat
  + Response time indicator
  + Languages spoken
  + Property management company details (if applicable)
\n- **Reviews & Ratings:**
  + Overall rating with star display
  + Detailed user reviews with photos
  + Review filters (Most Recent, Highest Rated, Verified Tenants)
  + Review helpfulness voting\n  + Owner response to reviews
  + Review submission form for verified tenants
\n- **Additional Features:**
  + Similar properties recommendations carousel
  + Price history graph showing rental trends
  + Availability calendar showing occupied/available dates
  + Share property via social media or link
  + Report listing option\n  + Print-friendly property details view
  + Add to compare functionality
  + Save to wishlist button
\n### 2.5 Booking System
- Schedule visit booking with calendar integration
- Online room booking with payment gateway\n- Instant booking for verified properties
- Booking confirmation via email and SMS
- Booking history and management dashboard
- Cancellation and refund policy display

### 2.6 Enhanced Mess Facilities Features
- **Comprehensive Mess Search & Discovery:**
  + Dedicated mess search page with advanced filters
  + Search by location, cuisine type, meal plans, and price range
  + Filter by dietary preferences (Vegetarian, Non-Vegetarian, Vegan, Jain, Halal)
  + Sort by distance, rating, price, popularity
  + Map view showing all mess locations with clustering
  + List view with detailed mess cards
  + Featured and verified mess badges
  + 'Open Now' indicator with real-time status
\n- **Detailed Mess Profile Page:**
  + **Media Gallery:**
    * High-resolution photos of mess interior, dining area, kitchen
    * Food photos showcasing daily menu items
    * Video tour of mess facilities
    *360-degree view of dining area
    * Hygiene and cleanliness certification photos
  + **Mess Information:**
    * Mess name, owner details, and contact information
    * Operating hours with breakfast, lunch, dinner timings
    * Seating capacity and current occupancy indicator
    * Hygiene rating and FSSAI license display
    * Years in operation and establishment date
    * Languages spoken by staff
  + **Menu & Pricing:**
    * Daily menu with meal-wise breakdown (breakfast, lunch, snacks, dinner)
    * Weekly menu calendar view
    * Special dishes and weekend menu highlights
    * Detailed pricing for individual meals and combo plans
    * Monthly meal plan packages with cost breakdown
    * Trial meal option with pricing
    * Custom meal plan builder\n    * Nutritional information for health-conscious students
    * Allergen information and ingredient details
  + **Meal Plans & Subscriptions:**
    * Multiple subscription options (Daily, Weekly, Monthly, Quarterly, Yearly)
    * Flexible meal combinations (Breakfast only, Lunch+Dinner, All meals)
    * Weekend meal inclusion/exclusion options
    * Guest meal add-on facility
    * Pause subscription feature for holidays
    * Plan comparison table
    * Discount indicators for longer subscriptions
  + **Facilities & Amenities:**
    * AC/Non-AC dining area
    * Parcel and delivery service availability
    * Advance meal ordering option
    * Special diet accommodation (low-carb, high-protein, etc.)
    * Water purifier and drinking water facility
    * Handwash and sanitization stations
    * Seating arrangements (individual tables, group seating)\n    * Takeaway container provision
  + **Reviews & Ratings:**
    * Overall rating with star display and review count
    * Category-wise ratings (Food Quality, Hygiene, Service, Value for Money, Variety)
    * Verified customer reviews with photos
    * Review filters (Most Recent, Highest Rated, Verified Subscribers)
    * Helpful/Not Helpful voting on reviews
    * Owner response to reviews
    * Review submission form with photo upload
    * Food item-specific ratings
  + **Location & Accessibility:**
    * Interactive map with mess location pinned
    * Distance from nearby accommodations and colleges
    * Directions and navigation link
    * Nearby landmarks and transport options
    * Parking availability information
    * Delivery radius map for parcel service
\n- **Mess Booking & Subscription System:**
  + **Trial Meal Booking:**
    * Book single trial meal to test food quality
    * Select meal type (breakfast/lunch/dinner) and date
    * Advance booking up to 7 days
    * Payment integration for trial meal
    * Booking confirmation with QR code
    * Cancellation option up to 2 hours before meal time
  + **Subscription Booking:**
    * Select meal plan (daily meals, specific meals, custom plan)
    * Choose subscription duration (weekly, monthly, quarterly, yearly)
    * Select start date with calendar picker
    * Add-on options (extra meals, guest meals, special requests)
    * Security deposit requirement display
    * Total cost calculation with breakdown
    * Discount application for longer durations
    * Payment gateway integration (UPI, Cards, Net Banking, Wallets)
    * Subscription confirmation via email and SMS
    * Digital subscription card with QR code
  + **Subscription Management Dashboard:**
    * Active subscription details with remaining days
    * Meal attendance tracking with calendar view
    * Pause subscription for specific dates (holidays, travel)\n    * Extend or renew subscription\n    * Upgrade/downgrade meal plan\n    * Add guest meals on-demand
    * View payment history and invoices
    * Download subscription receipt
    * Feedback and complaint submission
    * Cancellation request with refund calculation
  + **Meal Ordering Features:**
    * Daily menu preview notification
    * Pre-order meals for next day
    * Skip meal option with credit adjustment
    * Special meal requests and customization
    * Parcel/delivery order for subscribers
    * Meal reminder notifications
    * Meal ready notification for pickup
\n- **Mess Comparison Tool:**
  + Compare up to 3 mess facilities side-by-side
  + Comparison parameters: Pricing, Menu variety, Ratings, Distance, Facilities, Meal plans
  + Visual comparison with charts and tables
  + Highlight best value option
  + Save comparison for later reference
\n- **Mess Owner Dashboard:**
  + Mess profile management and updates
  + Daily menu upload and editing
  + Subscription management and tracking
  + Customer database with meal preferences
  + Payment and revenue tracking
  + Review management and response
  + Attendance marking system
  + Notification system for subscribers
  + Analytics dashboard (popular dishes, peak hours, revenue trends)

- **Additional Mess Features:**
  + Mess recommendation based on accommodation location
  + Nearby mess widget on accommodation detail page
  + Mess wishlist and favorites
  + Share mess details via social media or link
  + Report mess for hygiene or service issues
  + Mess verification badge system
  + Student community reviews and discussions
  + Mess events and special meal announcements
  + Loyalty program and reward points\n  + Referral bonus for bringing new subscribers
\n### 2.7 Additional Advanced Features
- Wishlist/Favorites for saving properties\n- Compare up to 3 properties side-by-side with detailed comparison table
- Chat system for direct communication with property owners
- Notification system for new listings and price drops
- Property verification badge system
- User review and rating system with photo uploads
- Email alerts for saved searches\n\n### 2.8 Admin Portal - Request Management System
- **Admin Authentication:**
  + Secure admin login with role-based access control
  + Multi-level admin permissions (Super Admin, Property Manager, Support Staff)
  + Two-factor authentication for enhanced security
  + Admin activity logging and audit trail
\n- **Request Dashboard:**
  + **Overview Section:**
    * Total requests count with status breakdown (Pending, Approved, Rejected, Completed)
    * Real-time request counter with auto-refresh
    * Visual statistics with charts (daily requests trend, request type distribution)
    * Quick action buttons for common tasks
    * Notification bell for new incoming requests
  + **Request List View:**
    * Comprehensive table displaying all visit and booking requests
    * Columns: Request ID, User Name, Property Name, Request Type (Visit/Booking), Date & Time, Status, Priority
    * Color-coded status indicators (Pending: Yellow, Approved: Green, Rejected: Red, Completed: Blue)
    * Expandable row details showing full request information
    * Bulk action options (Approve multiple, Reject multiple, Export selected)
    * Pagination with customizable items per page
    * Quick view modal for request details without page navigation
\n- **Advanced Search & Filtering:**
  + **Filter Options:**
    * Request Type filter (Visit Requests, Booking Requests, All)\n    * Status filter (Pending, Approved, Rejected, Completed, All)
    * Date range picker (Today, Last 7 days, Last 30 days, Custom range)
    * Property filter (dropdown with search functionality)
    * User filter (search by user name, email, or phone)\n    * Priority filter (High, Medium, Low)
    * Payment status filter (Paid, Pending, Refunded)
  + **Search Functionality:**
    * Global search bar with real-time suggestions
    * Search by Request ID, User Name, Property Name, Contact Number
    * Advanced search with multiple criteria combination
    * Save frequently used filter combinations
    * Clear all filters button\n  + **Sorting Options:**
    * Sort by Date (Newest first, Oldest first)\n    * Sort by Priority (High to Low, Low to High)
    * Sort by Status\n    * Sort by Property Name (A-Z, Z-A)
    * Sort by User Name (A-Z, Z-A)\n\n- **Request Detail View:**
  + **User Information:**
    * User profile with photo and verification status
    * Contact details (Phone, Email, WhatsApp)\n    * User history (previous bookings, visit requests)
    * User rating and reviews given
  + **Property Information:**
    * Property name with thumbnail image
    * Property type and location
    * Quick link to full property details
    * Current availability status
  + **Request Details:**
    * Request type (Visit/Booking)
    * Requested date and time with calendar view
    * Number of people (for visits)
    * Booking duration (for bookings)
    * Special requests or notes from user
    * Preferred contact method\n  + **Booking-Specific Information:**
    * Selected room type and occupancy
    * Move-in and move-out dates
    * Total booking amount with breakdown
    * Payment status and transaction details
    * Security deposit information
\n- **Request Action Management:**
  + **Approve Request:**
    * One-click approve button\n    * Option to suggest alternative date/time if requested slot unavailable
    * Automatic confirmation email and SMS to user
    * Calendar integration to block booked dates
    * Generate booking confirmation with QR code
  + **Reject Request:**
    * Reject button with mandatory reason selection
    * Predefined rejection reasons (Property unavailable, Date not available, User verification failed, Other)
    * Custom rejection message field
    * Automatic rejection notification to user
    * Option to suggest alternative properties
  + **Reschedule Request:**
    * Propose new date/time for visit or booking
    * Calendar picker for selecting alternative slots
    * Send rescheduling proposal to user for approval
    * Track rescheduling history
  + **Mark as Completed:**
    * Mark visit or booking as completed after fulfillment
    * Request feedback from user
    * Update property availability status
  + **Contact User:**
    * Quick call button with click-to-call functionality
    * WhatsApp direct message button
    * Email compose option with pre-filled templates
    * In-app chat integration
\n- **Analytics & Reporting:**
  + Request volume trends with line graphs
  + Conversion rate tracking (requests to confirmed bookings)
  + Average response time metrics
  + Property-wise request distribution
  + Peak request hours and days analysis
  + Revenue tracking from confirmed bookings
  + Export reports in PDF and Excel formats
  + Custom date range selection for reports

- **Notification System:**
  + Real-time browser notifications for new requests
  + Email alerts for high-priority requests
  + SMS notifications for urgent actions
  + Daily summary report of pending requests
  + Customizable notification preferences
\n- **Additional Admin Features:**
  + Bulk import/export of requests data
  + Request assignment to specific admin staff
  + Internal notes and comments on requests
  + Request priority tagging
  + Automated follow-up reminders for pending requests
  + Integration with property calendar for availability management
  + User blacklist management for problematic users
  + Refund processing interface for cancelled bookings

## 3. Accommodation Categories
- Paying Guest (PG) accommodations
- Flats and apartments\n- Hostels\n- Rooms for rent
\n## 4. Creative UI Design Style
### 4.1 Color Scheme
- Primary gradient: Deep blue to purple (#2C3E50 to #8E44AD) for modern, trustworthy feel
- Accent color: Vibrant coral (#FF6B6B) for call-to-action buttons and highlights
- Background: Soft white (#FAFAFA) with light lavender sections (#F3F0FF)\n- Success indicators: Fresh green (#27AE60)\n- Text: Charcoal gray (#2D3436) for readability

### 4.2 Visual Elements
- **Card Design:** Elevated cards with dynamic shadows (04px 20px rgba(0,0,0,0.08)) that lift on hover (0 8px 30px rgba(0,0,0,0.12))
- **Border Radius:** Generous rounded corners (16px) for friendly, modern aesthetic
- **Glassmorphism Effects:** Frosted glass effect on overlay elements with backdrop blur
- **Micro-interactions:** Smooth animations on all interactive elements (0.4s cubic-bezier ease)
- **Icon System:** Custom-designed duotone icons with gradient fills
- **Image Treatment:** Subtle gradient overlays on property images for text readability
- **Loading States:** Skeleton screens with shimmer effect for better perceived performance

### 4.3 Layout Structure
- **Hero Section:** Full-width with parallax background, centered enhanced search bar with floating effect and integrated filters
- **Featured Properties Section:** Highlighted top properties with premium card styling\n- **Category Section:** Organized tabs with category-specific property grids positioned after featured properties
- **Search Interface:** Sticky filter sidebar on desktop, collapsible drawer on mobile
- **Property Grid:** Masonry layout with staggered animation on scroll
- **Navigation:** Transparent navbar that becomes solid on scroll with smooth transition
- **Admin Dashboard:** Clean, data-focused layout with sidebar navigation and main content area
- **Responsive Breakpoints:** Mobile-first approach with fluid typography scaling
- **Whitespace:** Generous spacing for breathing room and visual hierarchy

### 4.4 Typography
- **Primary Font:** Poppins for headings (bold, modern personality)
- **Secondary Font:** Inter for body text (excellent readability)
- **Font Sizes:** Fluid typography using clamp() for responsive scaling
- **Heading Hierarchy:** Clear size differentiation (H1: 48px, H2: 36px, H3: 28px, H4: 22px)
- **Line Height:** 1.7 for body text, 1.3 for headings
- **Letter Spacing:** Slight tracking on uppercase labels for elegance
\n### 4.5 Interactive Elements
- **Buttons:** Pill-shaped with gradient backgrounds and subtle shadow, scale transform on hover
- **Input Fields:** Floating labels with smooth transition, focus state with colored border glow
- **Toggles & Switches:** Custom-styled with smooth slide animation
- **Dropdowns:** Custom design with smooth expand animation and search functionality
- **Sliders:** Custom range sliders with gradient track and large touch targets
- **Location Button:** Prominent'Get Current Location' button with GPS icon and loading animation
- **Category Tabs:** Underline animation on active tab with smooth transition
- **Calculator Widget:** Floating card design with real-time updates and smooth number transitions
- **Admin Action Buttons:** Color-coded buttons (Approve: Green, Reject: Red, Reschedule: Orange) with confirmation modals

## 5. Technical Implementation Notes
- Frontend: React.js with JSX and TypeScript for type safety
- Backend: Express.js with Node.js\n- Database: MongoDB Atlas with indexing for fast queries
- **Demo Database:** Pre-populated MongoDB demo database with sample accommodation listings, mess facility data, user data, subscription records, booking records, and admin request data for testing and demonstration purposes
- Geolocation API for current location detection
- Google Maps API for location services and map display
- Image optimization with lazy loading and WebP format\n- Video streaming with adaptive bitrate for smooth playback
- 360-degree viewer library integration (e.g., Pannellum or Marzipano)
- Progressive Web App (PWA) capabilities for mobile experience
- Fully responsive design across all devices
- Separate frontend and backend code structure with organized folder hierarchy
- RESTful API architecture for backend services
- Redis caching for improved performance
- JWT authentication for secure user sessions and admin authentication
- Role-based access control (RBAC) for admin portal
- Real-time search and filter implementation with debouncing for performance
- State management for filter persistence and search history
- API endpoints for category-based property retrieval, mess facility data, and admin request management
- Optimized database queries with proper indexing for fast category filtering and request searching
- Map integration with custom markers for accommodations and nearby messes
- Geospatial queries for finding nearby mess facilities based on accommodation coordinates
- Smart rent calculator logic with dynamic pricing algorithms
- CDN integration for fast media delivery
- Image gallery with infinite scroll and lazy loading
- Video compression and optimization for web delivery
- Payment gateway integration (Razorpay/Stripe) for bookings and subscriptions
- QR code generation for booking confirmations and subscription cards
- Email and SMS notification service integration for users and admins
- Subscription management system with automated renewals and reminders
- Refund processing logic for cancellations\n- Analytics integration for tracking user behavior, booking patterns, and admin performance
- Admin dashboard with real-time data updates using WebSocket or Server-Sent Events
- Request management system with status tracking and workflow automation
- Bulk operations support for admin actions
- Export functionality for reports (PDF, Excel)\n- Calendar integration for availability management
- Automated email templates for request confirmations, approvals, and rejections
- Admin activity logging and audit trail for security and compliance