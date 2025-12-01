# StayNearby - Student Accommodation Search Platform

A comprehensive web platform designed for students to search, explore, and book nearby accommodations including PGs (Paying Guest), flats, hostels, rooms for rent, and nearby mess facilities.

## Features

### 🔐 User Authentication
- Secure username/password authentication
- User registration and login
- Role-based access control (User/Admin)
- First registered user automatically becomes admin

### 🏠 Property Management
- Browse properties with advanced search and filters
- Filter by accommodation type (PG, Flat, Hostel, Room)
- Filter by price range and availability
- Location-based search
- Detailed property information with amenities
- Image gallery with multiple photos
- 360° virtual tour support

### 📅 Booking System
- Schedule property visits
- Book rooms online
- Manage bookings from user dashboard
- Booking status tracking (Pending, Confirmed, Cancelled, Completed)
- Cancel pending bookings

### 🍽️ Mess Facilities
- Browse nearby mess and dining facilities
- View meal types and pricing
- Contact information for mess facilities

### 👤 User Dashboard
- View all bookings
- Manage booking status
- Cancel pending bookings
- Quick access to booked properties

### 🛡️ Admin Panel
- View platform statistics
- Manage properties
- Manage bookings
- User management capabilities

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage (for property images)
  - Row Level Security (RLS)

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `miaoda-auth-react` - Authentication wrapper
- `sonner` - Toast notifications
- `@hookform/resolvers` - Form validation

## Database Schema

### Tables

#### profiles
- User profile information
- Role management (user/admin)
- Contact details

#### properties
- Property listings
- Accommodation details
- Pricing and availability
- Images and virtual tour URLs
- Amenities

#### mess_facilities
- Mess facility information
- Meal types and pricing
- Location and contact details

#### bookings
- Booking records
- Visit scheduling
- Room bookings
- Status tracking

## Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Supabase account

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ID=your_app_id
```

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm run dev
```

3. Build for production:
```bash
pnpm run build
```

4. Run linting:
```bash
pnpm run lint
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Header, Footer)
│   ├── property/        # Property-related components
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Properties.tsx
│   ├── PropertyDetails.tsx
│   ├── MessFacilities.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   └── Login.tsx
├── db/
│   ├── supabase.ts      # Supabase client
│   └── api.ts           # Database API functions
├── types/
│   └── types.ts         # TypeScript type definitions
├── lib/
│   ├── utils.ts         # Utility functions
│   └── image-utils.ts   # Image compression utilities
├── routes.tsx           # Route configuration
├── App.tsx              # Main app component
└── index.css            # Global styles and design tokens
```

## Design System

### Color Scheme
- **Primary**: Deep Blue (#2C3E50) - Trust and stability
- **Secondary**: Vibrant Orange (#E67E22) - Call-to-action elements
- **Background**: Clean White (#FFFFFF)
- **Muted**: Light Gray (#F8F9FA)

### Typography
- Primary font: System font stack
- Clear heading hierarchy
- Comfortable line spacing (1.6)

### Layout
- Responsive grid layout
- Desktop-first approach with mobile adaptation
- Card-based design with subtle shadows
- Rounded corners (8px border-radius)
- Smooth transitions (0.3s ease)

## Key Features Implementation

### Image Upload
- Automatic image compression to <1MB
- Client-side validation
- Supabase Storage integration
- Support for multiple images per property

### Search & Filters
- Real-time search
- Multiple filter options
- Pagination support
- URL-based search parameters

### Authentication Flow
- Username-based authentication (no email verification)
- Automatic profile creation on signup
- Protected routes with RequireAuth
- Role-based access control

### Booking Flow
1. User browses properties
2. Views property details
3. Fills booking form (visit or room booking)
4. Booking created with pending status
5. User can manage bookings from dashboard
6. Admin can update booking status

## Security

- Row Level Security (RLS) enabled on sensitive tables
- Public read access for properties and mess facilities
- Private bookings (users can only see their own)
- Admin helper functions for role checking
- Secure image upload with size limits

## Responsive Design

- Mobile-first CSS with desktop enhancements
- Breakpoints:
  - Mobile: < 1280px
  - Desktop: ≥ 1280px (xl breakpoint)
- Touch-friendly UI elements
- Collapsible mobile navigation

## Future Enhancements

- Property owner dashboard
- Advanced search with map integration
- Reviews and ratings system
- Payment integration
- Email notifications
- Chat system between users and property owners
- Wishlist/favorites functionality
- Property comparison feature

## License

This project is proprietary and confidential.

## Support

For support, please contact the development team.

---

Built with ❤️ using React, TypeScript, and Supabase
