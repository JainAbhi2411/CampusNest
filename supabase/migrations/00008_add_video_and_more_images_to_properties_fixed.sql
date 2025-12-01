/*
# Add Video URLs and More Images to Sample Properties

This migration updates sample properties with:
- Video tour URLs (using sample property tour videos)
- Additional property images (5-8 images per property)
- Enhanced visual content for better user experience

*/

-- Update PG properties with video URLs and more images
UPDATE properties
SET 
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  images = ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80'
  ]
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'pg' ORDER BY created_at LIMIT 2
);

-- Update Flat properties with video URLs and more images
UPDATE properties
SET 
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  images = ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80'
  ]
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'flat' ORDER BY created_at LIMIT 2
);

-- Update Hostel properties with video URLs and more images
UPDATE properties
SET 
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  images = ARRAY[
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'
  ]
WHERE id IN (
  SELECT id FROM properties WHERE accommodation_type = 'hostel' ORDER BY created_at LIMIT 2
);

-- Add more images to remaining properties (those with only 1 image)
UPDATE properties
SET images = ARRAY[
  images[1],
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
  'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80'
]
WHERE array_length(images, 1) = 1;