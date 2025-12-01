/*
# Add Advanced Features to StayNearby

## 1. New Tables
- `reviews`: Property reviews and ratings
  - `id` (uuid, primary key)
  - `property_id` (uuid, references properties)
  - `user_id` (uuid, references profiles)
  - `rating` (integer, 1-5)
  - `comment` (text)
  - `created_at` (timestamptz)

- `favorites`: User's favorite properties
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `property_id` (uuid, references properties)
  - `created_at` (timestamptz)

- `property_views`: Track property views
  - `id` (uuid, primary key)
  - `property_id` (uuid, references properties)
  - `user_id` (uuid, references profiles, nullable)
  - `viewed_at` (timestamptz)

## 2. Enhanced Properties Table
- Add `gender_preference` (text: 'male', 'female', 'any')
- Add `occupancy_type` (text: 'single', 'double', 'triple', 'multiple')
- Add `food_included` (boolean)
- Add `wifi_available` (boolean)
- Add `ac_available` (boolean)
- Add `parking_available` (boolean)
- Add `latitude` (numeric)
- Add `longitude` (numeric)
- Add `average_rating` (numeric, default 0)
- Add `total_reviews` (integer, default 0)

## 3. Security
- Enable RLS on new tables
- Users can create their own reviews and favorites
- Public read access for reviews
- Private favorites (users can only see their own)
*/

-- Add new columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS gender_preference text DEFAULT 'any',
ADD COLUMN IF NOT EXISTS occupancy_type text DEFAULT 'single',
ADD COLUMN IF NOT EXISTS food_included boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS wifi_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ac_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS parking_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS average_rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create property_views table
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Property views policies
CREATE POLICY "Anyone can create property views" ON property_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all property views" ON property_views
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Function to update property rating
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE properties
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE property_id = NEW.property_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE property_id = NEW.property_id
    )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$;

-- Trigger to update rating after review insert/update/delete
DROP TRIGGER IF EXISTS update_rating_on_review_change ON reviews;
CREATE TRIGGER update_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_rating();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_properties_rating ON properties(average_rating DESC);