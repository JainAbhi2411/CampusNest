/*
# Add Distance Calculation Function

This migration adds a PostgreSQL function to calculate the distance between two geographic coordinates using the Haversine formula.

## Changes

1. **Function: calculate_distance**
   - Calculates distance in kilometers between two lat/lng points
   - Uses the Haversine formula for accurate distance calculation
   - Returns distance as a numeric value in kilometers

## Usage

```sql
SELECT calculate_distance(lat1, lng1, lat2, lng2) as distance_km;
```

This function will be used to filter properties by distance from user's current location.
*/

-- Create function to calculate distance between two coordinates (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 double precision,
  lng1 double precision,
  lat2 double precision,
  lng2 double precision
)
RETURNS double precision
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  earth_radius double precision := 6371; -- Earth's radius in kilometers
  dlat double precision;
  dlng double precision;
  a double precision;
  c double precision;
BEGIN
  -- Convert degrees to radians
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  
  -- Haversine formula
  a := sin(dlat / 2) * sin(dlat / 2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlng / 2) * sin(dlng / 2);
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  
  -- Return distance in kilometers
  RETURN earth_radius * c;
END;
$$;