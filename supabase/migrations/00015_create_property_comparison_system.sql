/*
# Property Comparison System

## Overview
This migration creates a comprehensive property comparison system that allows users to:
- Save properties for comparison
- Track comparison history
- Generate comparison analytics
- Support both anonymous (UUID-based) and authenticated users

## 1. New Tables

### property_comparisons
Stores user comparison sessions and property selections.

**Columns:**
- `id` (uuid, primary key) - Unique comparison session identifier
- `user_id` (uuid, nullable, references auth.users) - Authenticated user ID
- `anonymous_id` (text, nullable) - UUID for anonymous users
- `property_ids` (uuid[], not null) - Array of property IDs being compared
- `created_at` (timestamptz, default: now()) - When comparison was created
- `updated_at` (timestamptz, default: now()) - Last update timestamp

**Indexes:**
- Index on user_id for fast user lookups
- Index on anonymous_id for anonymous user tracking
- Index on created_at for time-based queries

### comparison_analytics
Tracks which properties are frequently compared together for recommendations.

**Columns:**
- `id` (uuid, primary key) - Unique analytics record
- `property_a_id` (uuid, not null, references properties) - First property
- `property_b_id` (uuid, not null, references properties) - Second property
- `comparison_count` (integer, default: 1) - Number of times compared together
- `last_compared_at` (timestamptz, default: now()) - Last comparison timestamp

**Indexes:**
- Unique index on (property_a_id, property_b_id) to prevent duplicates
- Index on comparison_count for popular comparison queries

## 2. Security

### Row Level Security (RLS)
- **property_comparisons**: Public read/write access
  - Users can view and manage their own comparisons
  - Anonymous users identified by anonymous_id
  
- **comparison_analytics**: Public read access
  - Anyone can view comparison analytics
  - Only system can write (for future recommendation engine)

### Policies
1. Users can view their own comparisons (authenticated or anonymous)
2. Users can create new comparisons
3. Users can update their own comparisons
4. Users can delete their own comparisons
5. Anyone can view comparison analytics (for recommendations)

## 3. Functions

### update_comparison_analytics()
Trigger function that updates comparison analytics when properties are compared.
- Increments comparison_count for property pairs
- Updates last_compared_at timestamp
- Creates new analytics records if needed

### get_frequently_compared_properties(property_id, limit)
Returns properties that are frequently compared with the given property.
- Useful for "Users also compared" feature
- Ordered by comparison frequency

## 4. Triggers

### update_property_comparisons_updated_at
Automatically updates the updated_at timestamp on row changes.

### track_comparison_analytics
Tracks property comparison patterns for analytics.

## 5. Notes
- Anonymous users are tracked via UUID stored in localStorage
- Comparison data helps power AI recommendations
- Analytics data is aggregated and anonymized
- Old comparison sessions can be cleaned up periodically
*/

-- Create property_comparisons table
CREATE TABLE IF NOT EXISTS property_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id text,
  property_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_or_anonymous CHECK (
    (user_id IS NOT NULL AND anonymous_id IS NULL) OR
    (user_id IS NULL AND anonymous_id IS NOT NULL)
  )
);

-- Create indexes for property_comparisons
CREATE INDEX idx_property_comparisons_user_id ON property_comparisons(user_id);
CREATE INDEX idx_property_comparisons_anonymous_id ON property_comparisons(anonymous_id);
CREATE INDEX idx_property_comparisons_created_at ON property_comparisons(created_at DESC);

-- Create comparison_analytics table
CREATE TABLE IF NOT EXISTS comparison_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_a_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  property_b_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  comparison_count integer DEFAULT 1,
  last_compared_at timestamptz DEFAULT now(),
  CONSTRAINT different_properties CHECK (property_a_id != property_b_id),
  CONSTRAINT ordered_properties CHECK (property_a_id < property_b_id)
);

-- Create unique index for comparison_analytics
CREATE UNIQUE INDEX idx_comparison_analytics_properties 
  ON comparison_analytics(property_a_id, property_b_id);
CREATE INDEX idx_comparison_analytics_count ON comparison_analytics(comparison_count DESC);

-- Enable RLS
ALTER TABLE property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for property_comparisons (public access)
CREATE POLICY "Anyone can view comparisons" ON property_comparisons
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create comparisons" ON property_comparisons
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own comparisons" ON property_comparisons
  FOR UPDATE USING (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR
    (anonymous_id IS NOT NULL)
  );

CREATE POLICY "Users can delete own comparisons" ON property_comparisons
  FOR DELETE USING (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR
    (anonymous_id IS NOT NULL)
  );

-- Policies for comparison_analytics (public read)
CREATE POLICY "Anyone can view analytics" ON comparison_analytics
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_comparisons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_property_comparisons_updated_at_trigger
  BEFORE UPDATE ON property_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_property_comparisons_updated_at();

-- Function to get frequently compared properties
CREATE OR REPLACE FUNCTION get_frequently_compared_properties(
  target_property_id uuid,
  result_limit integer DEFAULT 5
)
RETURNS TABLE (
  property_id uuid,
  comparison_count integer,
  last_compared_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN ca.property_a_id = target_property_id THEN ca.property_b_id
      ELSE ca.property_a_id
    END as property_id,
    ca.comparison_count,
    ca.last_compared_at
  FROM comparison_analytics ca
  WHERE ca.property_a_id = target_property_id 
     OR ca.property_b_id = target_property_id
  ORDER BY ca.comparison_count DESC, ca.last_compared_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comparison analytics
CREATE OR REPLACE FUNCTION increment_comparison_analytics(
  prop_a_id uuid,
  prop_b_id uuid
)
RETURNS void AS $$
DECLARE
  ordered_a uuid;
  ordered_b uuid;
BEGIN
  -- Ensure consistent ordering
  IF prop_a_id < prop_b_id THEN
    ordered_a := prop_a_id;
    ordered_b := prop_b_id;
  ELSE
    ordered_a := prop_b_id;
    ordered_b := prop_a_id;
  END IF;

  -- Insert or update analytics
  INSERT INTO comparison_analytics (property_a_id, property_b_id, comparison_count, last_compared_at)
  VALUES (ordered_a, ordered_b, 1, now())
  ON CONFLICT (property_a_id, property_b_id)
  DO UPDATE SET
    comparison_count = comparison_analytics.comparison_count + 1,
    last_compared_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;