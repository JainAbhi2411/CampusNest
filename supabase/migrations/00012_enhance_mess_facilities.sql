/*
# Enhance Mess Facilities

This migration enhances the mess_facilities table with comprehensive features:
- Detailed meal information
- Dietary preferences
- Cuisine types
- Operating hours
- Ratings and reviews
- Capacity and features
- Trial meal options

## New Fields
1. Meal Plans & Pricing
   - breakfast_price, lunch_price, dinner_price
   - weekly_price, trial_meal_price
   
2. Dietary & Cuisine
   - dietary_options (veg, non-veg, vegan, jain)
   - cuisine_types (north indian, south indian, chinese, etc.)
   
3. Operating Information
   - breakfast_timing, lunch_timing, dinner_timing
   - operating_days
   - capacity
   
4. Features & Ratings
   - features (AC dining, hygiene certified, etc.)
   - average_rating, total_reviews
   - hygiene_rating
   
5. Additional Info
   - owner_id, available status
   - special_notes

*/

-- Add new columns to mess_facilities table
ALTER TABLE mess_facilities
ADD COLUMN IF NOT EXISTS breakfast_price numeric(10,2),
ADD COLUMN IF NOT EXISTS lunch_price numeric(10,2),
ADD COLUMN IF NOT EXISTS dinner_price numeric(10,2),
ADD COLUMN IF NOT EXISTS weekly_price numeric(10,2),
ADD COLUMN IF NOT EXISTS trial_meal_price numeric(10,2),
ADD COLUMN IF NOT EXISTS dietary_options jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cuisine_types jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS breakfast_timing text,
ADD COLUMN IF NOT EXISTS lunch_timing text,
ADD COLUMN IF NOT EXISTS dinner_timing text,
ADD COLUMN IF NOT EXISTS operating_days jsonb DEFAULT '["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]'::jsonb,
ADD COLUMN IF NOT EXISTS capacity integer,
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS average_rating numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hygiene_rating numeric(3,2),
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS available boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS special_notes text;

-- Create mess_bookings table
CREATE TABLE IF NOT EXISTS mess_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mess_id uuid NOT NULL REFERENCES mess_facilities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_type text NOT NULL, -- 'trial', 'daily', 'weekly', 'monthly'
  meal_types jsonb NOT NULL DEFAULT '[]'::jsonb, -- ['breakfast', 'lunch', 'dinner']
  start_date date NOT NULL,
  end_date date,
  dietary_preference text,
  special_requirements text,
  total_amount numeric(10,2),
  advance_payment numeric(10,2),
  payment_status text DEFAULT 'pending',
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mess_reviews table
CREATE TABLE IF NOT EXISTS mess_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mess_id uuid NOT NULL REFERENCES mess_facilities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  food_quality_rating integer CHECK (food_quality_rating >= 1 AND food_quality_rating <= 5),
  hygiene_rating integer CHECK (hygiene_rating >= 1 AND hygiene_rating <= 5),
  service_rating integer CHECK (service_rating >= 1 AND service_rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(mess_id, user_id)
);

-- Enable RLS
ALTER TABLE mess_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for mess_bookings
CREATE POLICY "Users can view their own mess bookings" ON mess_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create mess bookings" ON mess_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mess bookings" ON mess_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to mess bookings" ON mess_bookings
  FOR ALL USING (is_admin(auth.uid()));

-- Policies for mess_reviews
CREATE POLICY "Anyone can view mess reviews" ON mess_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create mess reviews" ON mess_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mess reviews" ON mess_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mess reviews" ON mess_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mess_bookings_user_id ON mess_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_mess_bookings_mess_id ON mess_bookings(mess_id);
CREATE INDEX IF NOT EXISTS idx_mess_bookings_status ON mess_bookings(status);
CREATE INDEX IF NOT EXISTS idx_mess_bookings_start_date ON mess_bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_mess_reviews_mess_id ON mess_reviews(mess_id);
CREATE INDEX IF NOT EXISTS idx_mess_reviews_user_id ON mess_reviews(user_id);

-- Function to update mess average rating
CREATE OR REPLACE FUNCTION update_mess_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE mess_facilities
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM mess_reviews
      WHERE mess_id = COALESCE(NEW.mess_id, OLD.mess_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM mess_reviews
      WHERE mess_id = COALESCE(NEW.mess_id, OLD.mess_id)
    )
  WHERE id = COALESCE(NEW.mess_id, OLD.mess_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for mess rating updates
DROP TRIGGER IF EXISTS trigger_update_mess_rating ON mess_reviews;
CREATE TRIGGER trigger_update_mess_rating
  AFTER INSERT OR UPDATE OR DELETE ON mess_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_mess_rating();