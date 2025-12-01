/*
# Add Enhanced Mess Facility Data

This migration adds comprehensive sample data for mess facilities with:
- Detailed pricing for different meals
- Dietary options and cuisine types
- Operating hours and capacity
- Features and ratings
- Multiple images

*/

-- Update existing mess facilities with enhanced data
UPDATE mess_facilities
SET
  breakfast_price = 50,
  lunch_price = 80,
  dinner_price = 70,
  weekly_price = 1200,
  monthly_price = 4500,
  trial_meal_price = 100,
  dietary_options = '["vegetarian", "non-vegetarian"]'::jsonb,
  cuisine_types = '["North Indian", "South Indian"]'::jsonb,
  breakfast_timing = '7:00 AM - 10:00 AM',
  lunch_timing = '12:00 PM - 3:00 PM',
  dinner_timing = '7:00 PM - 10:00 PM',
  capacity = 100,
  features = '["AC Dining", "Hygiene Certified", "Filtered Water", "Separate Dining Areas"]'::jsonb,
  average_rating = 4.2,
  total_reviews = 45,
  hygiene_rating = 4.5,
  available = true,
  images = '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80"]'::jsonb,
  special_notes = 'Homely food with variety of dishes. Special menu on weekends.'
WHERE id IN (SELECT id FROM mess_facilities WHERE city = 'Mumbai' ORDER BY created_at LIMIT 1);

UPDATE mess_facilities
SET
  breakfast_price = 40,
  lunch_price = 70,
  dinner_price = 60,
  weekly_price = 1000,
  monthly_price = 3800,
  trial_meal_price = 80,
  dietary_options = '["vegetarian", "vegan"]'::jsonb,
  cuisine_types = '["South Indian", "Continental"]'::jsonb,
  breakfast_timing = '7:30 AM - 10:30 AM',
  lunch_timing = '12:30 PM - 3:00 PM',
  dinner_timing = '7:30 PM - 10:00 PM',
  capacity = 80,
  features = '["Hygiene Certified", "Filtered Water", "Jain Food Available"]'::jsonb,
  average_rating = 4.5,
  total_reviews = 67,
  hygiene_rating = 4.8,
  available = true,
  images = '["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80"]'::jsonb,
  special_notes = 'Pure vegetarian food with Jain options available.'
WHERE id IN (SELECT id FROM mess_facilities WHERE city = 'Bangalore' ORDER BY created_at LIMIT 1);

UPDATE mess_facilities
SET
  breakfast_price = 45,
  lunch_price = 75,
  dinner_price = 65,
  weekly_price = 1100,
  monthly_price = 4200,
  trial_meal_price = 90,
  dietary_options = '["vegetarian", "non-vegetarian", "vegan"]'::jsonb,
  cuisine_types = '["North Indian", "Chinese", "Continental"]'::jsonb,
  breakfast_timing = '7:00 AM - 10:00 AM',
  lunch_timing = '12:00 PM - 3:30 PM',
  dinner_timing = '7:00 PM - 10:30 PM',
  capacity = 120,
  features = '["AC Dining", "Hygiene Certified", "Filtered Water", "WiFi Available", "Separate Dining Areas"]'::jsonb,
  average_rating = 4.3,
  total_reviews = 89,
  hygiene_rating = 4.6,
  available = true,
  images = '["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80", "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80"]'::jsonb,
  special_notes = 'Multi-cuisine mess with variety of options. Special Chinese menu on Fridays.'
WHERE id IN (SELECT id FROM mess_facilities WHERE city = 'Delhi' ORDER BY created_at LIMIT 1);

UPDATE mess_facilities
SET
  breakfast_price = 35,
  lunch_price = 65,
  dinner_price = 55,
  weekly_price = 950,
  monthly_price = 3500,
  trial_meal_price = 70,
  dietary_options = '["vegetarian"]'::jsonb,
  cuisine_types = '["South Indian", "North Indian"]'::jsonb,
  breakfast_timing = '7:00 AM - 10:00 AM',
  lunch_timing = '12:00 PM - 2:30 PM',
  dinner_timing = '7:00 PM - 9:30 PM',
  capacity = 60,
  features = '["Hygiene Certified", "Filtered Water", "Home-style Cooking"]'::jsonb,
  average_rating = 4.0,
  total_reviews = 34,
  hygiene_rating = 4.3,
  available = true,
  images = '["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&q=80", "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200&q=80"]'::jsonb,
  special_notes = 'Budget-friendly mess with homely food.'
WHERE id IN (SELECT id FROM mess_facilities WHERE city = 'Pune' ORDER BY created_at LIMIT 1);