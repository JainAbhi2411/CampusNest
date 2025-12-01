/*
# Create Initial Schema for StayNearby Platform

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique, not null)
- `full_name` (text)
- `phone` (text)
- `role` (user_role enum: 'user', 'admin', default: 'user')
- `avatar_url` (text)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### properties
- `id` (uuid, primary key, default: gen_random_uuid())
- `title` (text, not null)
- `description` (text)
- `accommodation_type` (accommodation_type enum: 'pg', 'flat', 'hostel', 'room')
- `price` (numeric, not null)
- `price_period` (text, default: 'month')
- `location` (text, not null)
- `address` (text, not null)
- `city` (text, not null)
- `latitude` (numeric)
- `longitude` (numeric)
- `available` (boolean, default: true)
- `owner_id` (uuid, references profiles(id))
- `images` (jsonb, array of image URLs)
- `virtual_tour_url` (text, 360-degree tour URL)
- `amenities` (jsonb, array of amenities)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### mess_facilities
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, not null)
- `description` (text)
- `location` (text, not null)
- `address` (text, not null)
- `city` (text, not null)
- `latitude` (numeric)
- `longitude` (numeric)
- `meal_types` (jsonb, array of meal types: breakfast, lunch, dinner)
- `price_per_meal` (numeric)
- `monthly_price` (numeric)
- `contact_phone` (text)
- `images` (jsonb, array of image URLs)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### bookings
- `id` (uuid, primary key, default: gen_random_uuid())
- `property_id` (uuid, references properties(id))
- `user_id` (uuid, references profiles(id))
- `booking_type` (booking_type enum: 'visit', 'room')
- `booking_date` (date, not null)
- `booking_time` (time)
- `status` (booking_status enum: 'pending', 'confirmed', 'cancelled', 'completed')
- `notes` (text)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

## 2. Storage Buckets
- `app-7xyosp4kpcld_property_images` - for property photos and virtual tours

## 3. Security
- Enable RLS on all tables
- Create helper function `is_admin` to check user role
- Admins have full access to all tables
- Users can view all properties and mess facilities (public data)
- Users can create and manage their own bookings
- Only admins can create/edit properties and mess facilities

## 4. Notes
- First registered user automatically becomes admin
- Properties and mess facilities are public (no RLS restrictions on SELECT)
- Bookings are private (users can only see their own)
- Image storage bucket allows authenticated users to upload
