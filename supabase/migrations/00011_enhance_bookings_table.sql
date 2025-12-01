/*
# Enhance Bookings Table

This migration adds more fields to support enhanced booking features:
- Number of people for visit
- Preferred time slots
- Move-in date for room bookings
- Booking duration
- Advance payment amount
- Payment status
- Special requests

## Changes
1. Add new columns to bookings table
2. Update booking_type enum if needed
3. Add indexes for better query performance

*/

-- Add new columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS number_of_people integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS preferred_time_slot text,
ADD COLUMN IF NOT EXISTS move_in_date date,
ADD COLUMN IF NOT EXISTS booking_duration text,
ADD COLUMN IF NOT EXISTS advance_payment numeric(10,2),
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS special_requests text;

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Create index for move_in_date queries
CREATE INDEX IF NOT EXISTS idx_bookings_move_in_date ON bookings(move_in_date);