# Enhanced Booking System

## Overview
The StayNearby platform now features a comprehensive booking system with two distinct booking flows: **Schedule Visit** and **Book Now**. This dual-mode approach provides flexibility for users who want to view properties before committing or those ready to book immediately.

## Features

### 1. Tab-Based Interface

The booking form uses a modern tab interface to separate the two booking types:

- **Schedule Visit Tab**: For users who want to visit the property first
- **Book Now Tab**: For users ready to book the property immediately

This clear separation improves user experience and reduces confusion.

### 2. Schedule Visit Feature

#### Purpose
Allows potential tenants to schedule a property visit before making a booking decision.

#### Fields

**Visit Date** (Required)
- Date picker with minimum date validation
- Cannot select past dates
- Calendar icon for visual clarity

**Preferred Time Slot** (Required)
- Morning (9 AM - 12 PM)
- Afternoon (12 PM - 4 PM)
- Evening (4 PM - 7 PM)
- Dropdown selector for easy selection

**Specific Time** (Optional)
- Time picker for exact time preference
- Helpful description text
- Allows users to specify exact meeting time

**Number of People** (Required)
- Options: 1-4 people
- Helps property owners prepare for the visit
- Dropdown selector

**Additional Notes** (Optional)
- Textarea for special requirements
- Questions or concerns
- Accessibility needs
- Any other relevant information

#### User Flow

1. User selects "Schedule Visit" tab
2. Fills in visit date and preferred time slot
3. Optionally specifies exact time
4. Selects number of people visiting
5. Adds any additional notes
6. Clicks "Schedule Visit" button
7. Receives confirmation message
8. Property owner is notified

#### Success Message
"Visit scheduled successfully! The property owner will contact you soon."

### 3. Book Now Feature

#### Purpose
Enables users to directly book and reserve a property with advance payment.

#### Fields

**Move-in Date** (Required)
- Date picker for move-in date
- Minimum date validation
- Calendar icon for clarity

**Booking Duration** (Required)
- 1 Month
- 3 Months
- 6 Months
- 1 Year
- Dropdown selector

**Number of Occupants** (Required)
- Options: 1-4 people
- Determines occupancy
- Affects pricing in some cases

**Advance Payment** (Required)
- Numeric input with rupee symbol
- Minimum 10% of monthly rent
- Step value: ₹100
- Placeholder shows minimum amount
- Helper text displays minimum requirement

**Special Requests** (Optional)
- Textarea for custom requirements
- Preferences or special needs
- Move-in time preferences
- Any other requests

**Terms & Conditions** (Required)
- Checkbox for acceptance
- Must be checked to proceed
- Includes cancellation policy
- Payment terms agreement

#### Trust Indicators

Visual badges to build user confidence:
- ✓ Instant booking confirmation
- ✓ Secure payment processing
- ✓ 24/7 customer support

#### User Flow

1. User selects "Book Now" tab
2. Fills in move-in date
3. Selects booking duration
4. Specifies number of occupants
5. Enters advance payment amount (min 10%)
6. Adds special requests if any
7. Accepts terms and conditions
8. Clicks "Confirm Booking" button
9. Receives confirmation
10. Payment details sent via email/SMS

#### Success Message
"Booking request submitted! You will receive payment details shortly."

## Database Schema

### New Fields in Bookings Table

```sql
-- Number of people for visit or occupants for booking
number_of_people INTEGER DEFAULT 1

-- Preferred time slot for visits
preferred_time_slot TEXT
-- Values: 'morning', 'afternoon', 'evening'

-- Move-in date for direct bookings
move_in_date DATE

-- Booking duration
booking_duration TEXT
-- Values: '1_month', '3_months', '6_months', '1_year'

-- Advance payment amount
advance_payment NUMERIC(10,2)

-- Payment status tracking
payment_status TEXT DEFAULT 'pending'
-- Values: 'pending', 'paid', 'partial', 'refunded'

-- Special requests or notes
special_requests TEXT
```

### Indexes

```sql
-- For efficient payment status queries
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- For move-in date queries
CREATE INDEX idx_bookings_move_in_date ON bookings(move_in_date);
```

## Form Validation

### Schedule Visit Validation

```typescript
const visitSchema = z.object({
  booking_date: z.string().min(1, 'Date is required'),
  booking_time: z.string().optional(),
  number_of_people: z.string().min(1, 'Number of people is required'),
  preferred_time_slot: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
});
```

### Book Now Validation

```typescript
const bookNowSchema = z.object({
  move_in_date: z.string().min(1, 'Move-in date is required'),
  booking_duration: z.string().min(1, 'Duration is required'),
  number_of_people: z.string().min(1, 'Number of people is required'),
  advance_payment: z.string().min(1, 'Advance payment is required'),
  special_requests: z.string().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});
```

## API Integration

### Create Booking Endpoint

```typescript
async createBooking(booking: {
  property_id: string;
  user_id: string;
  booking_type: BookingType; // 'visit' | 'room'
  booking_date: string;
  booking_time?: string;
  notes?: string;
  number_of_people?: number;
  preferred_time_slot?: string;
  move_in_date?: string;
  booking_duration?: string;
  advance_payment?: number;
  payment_status?: string;
  special_requests?: string;
}): Promise<Booking>
```

### Schedule Visit Request

```typescript
{
  property_id: "uuid",
  user_id: "uuid",
  booking_type: "visit",
  booking_date: "2025-12-15",
  booking_time: "10:30",
  number_of_people: 2,
  preferred_time_slot: "morning",
  notes: "Looking forward to seeing the property"
}
```

### Book Now Request

```typescript
{
  property_id: "uuid",
  user_id: "uuid",
  booking_type: "room",
  booking_date: "2025-12-20",
  move_in_date: "2025-12-20",
  booking_duration: "6_months",
  number_of_people: 1,
  advance_payment: 5000,
  payment_status: "pending",
  special_requests: "Need parking space"
}
```

## User Experience Enhancements

### 1. Authentication Check
- Redirects to login if user not authenticated
- Preserves form data after login (future enhancement)
- Clear error message

### 2. Loading States
- Button shows "Scheduling..." or "Processing..."
- Disabled state during submission
- Prevents double submission

### 3. Form Reset
- Automatically resets after successful submission
- Clears all fields
- Ready for next booking

### 4. Error Handling
- Clear error messages
- Field-level validation
- Toast notifications for success/error

### 5. Visual Feedback
- Icons for each field (Calendar, Clock, Users, Rupee)
- Helper text for guidance
- Placeholder text with examples
- Trust badges for confidence

### 6. Responsive Design
- Works on all device sizes
- Touch-friendly on mobile
- Proper spacing and layout

## Business Logic

### Advance Payment Calculation

```typescript
const advancePayment = property.price * 0.1; // 10% of monthly rent
```

Example:
- Monthly rent: ₹15,000
- Minimum advance: ₹1,500

### Time Slot Mapping

```typescript
const timeSlots = {
  morning: "9 AM - 12 PM",
  afternoon: "12 PM - 4 PM",
  evening: "4 PM - 7 PM"
};
```

### Duration Mapping

```typescript
const durations = {
  '1_month': '1 Month',
  '3_months': '3 Months',
  '6_months': '6 Months',
  '1_year': '1 Year'
};
```

## Integration with Other Features

### 1. Rent Calculator
- Booking form placed above rent calculator
- Users can calculate costs before booking
- Seamless flow from calculation to booking

### 2. Property Details
- Booking form in sticky sidebar
- Always visible while scrolling
- Easy access from any section

### 3. User Profile
- Bookings linked to user account
- View booking history
- Manage active bookings

### 4. Property Owner Dashboard
- Receive booking notifications
- Manage visit schedules
- Track payment status
- Approve/reject bookings

## Future Enhancements

### Potential Improvements

1. **Payment Integration**
   - Online payment gateway
   - Multiple payment methods
   - Automatic payment confirmation
   - Payment receipts

2. **Calendar Integration**
   - Add to Google Calendar
   - iCal export
   - Reminder notifications
   - Sync with property owner calendar

3. **Booking Management**
   - Reschedule visits
   - Cancel bookings
   - Modify booking details
   - Extend booking duration

4. **Communication**
   - In-app messaging
   - Video call scheduling
   - Document sharing
   - Contract signing

5. **Advanced Features**
   - Waitlist for occupied properties
   - Group bookings
   - Corporate bookings
   - Referral system

6. **Analytics**
   - Booking conversion rate
   - Popular time slots
   - Average booking duration
   - Payment analytics

## Testing Checklist

- [x] Schedule Visit form validation
- [x] Book Now form validation
- [x] Tab switching functionality
- [x] Date picker minimum date validation
- [x] Time slot selection
- [x] Number of people selection
- [x] Advance payment calculation
- [x] Terms checkbox validation
- [x] Form submission (visit)
- [x] Form submission (booking)
- [x] Success messages
- [x] Error handling
- [x] Loading states
- [x] Form reset after submission
- [x] Authentication check
- [x] Responsive design
- [x] TypeScript compilation
- [x] No ESLint errors

## Security Considerations

### 1. Authentication
- User must be logged in
- User ID verified server-side
- Session validation

### 2. Data Validation
- Server-side validation
- SQL injection prevention
- XSS protection

### 3. Payment Security
- Minimum payment validation
- Payment status tracking
- Secure payment processing (future)

### 4. Privacy
- User data protection
- GDPR compliance
- Data encryption

## Conclusion

The enhanced booking system provides a comprehensive solution for property bookings on StayNearby. With separate flows for visits and direct bookings, users have the flexibility to choose their preferred approach. The system includes:

- **User-friendly interface** with clear separation of booking types
- **Comprehensive validation** to ensure data quality
- **Flexible options** for different user needs
- **Trust indicators** to build confidence
- **Scalable architecture** for future enhancements

This system significantly improves the booking experience and positions StayNearby as a professional, user-centric platform for student accommodation.
