/*
# Update Video URLs with Working Sources

This migration updates properties with working video URLs from reliable sources.
Using sample videos that are known to work across browsers.

*/

-- Update PG properties with working video URLs
UPDATE properties
SET video_url = 'https://www.w3schools.com/html/mov_bbb.mp4'
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'pg' ORDER BY created_at LIMIT 2
);

-- Update Flat properties with working video URLs
UPDATE properties
SET video_url = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'flat' ORDER BY created_at LIMIT 2
);

-- Update Hostel properties with working video URLs
UPDATE properties
SET video_url = 'https://www.w3schools.com/html/movie.mp4'
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'hostel' ORDER BY created_at LIMIT 1
);

-- Update Room properties with working video URLs
UPDATE properties
SET video_url = 'https://www.w3schools.com/html/mov_bbb.mp4'
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'room' ORDER BY created_at LIMIT 1
);