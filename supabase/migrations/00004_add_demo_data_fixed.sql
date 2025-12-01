/*
# Add Demo Data for StayNearby Platform

This migration adds sample data for testing and demonstration purposes.
*/

-- Insert demo properties with proper JSONB casting
INSERT INTO properties (
  title, description, accommodation_type, price, price_period,
  location, address, city, latitude, longitude,
  available, images, amenities,
  gender_preference, occupancy_type,
  food_included, wifi_available, ac_available, parking_available
) VALUES
-- Mumbai Properties
('Cozy PG near Andheri Station', 'Well-maintained PG with all modern amenities. Close to metro station and shopping areas. Perfect for working professionals.', 'pg', 12000, 'month', 'Andheri West', '123 SV Road, Andheri West', 'Mumbai', 19.1136, 72.8697, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Laundry", "Security", "Power Backup"]'::jsonb, 'any', 'double', true, true, true, false),

('Luxury Flat in Bandra', 'Spacious 2BHK flat with sea view. Fully furnished with modern interiors. Prime location near Bandra station.', 'flat', 45000, 'month', 'Bandra West', '456 Hill Road, Bandra West', 'Mumbai', 19.0596, 72.8295, true, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Gym", "Swimming Pool", "Parking", "Security"]'::jsonb, 'any', 'multiple', false, true, true, true),

('Budget Hostel Powai', 'Affordable hostel for students near IIT Bombay. Clean rooms with basic amenities.', 'hostel', 8000, 'month', 'Powai', '789 Powai Lake Road', 'Mumbai', 19.1197, 72.9078, true, '["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"]'::jsonb, '["WiFi", "Mess", "Study Room", "Security"]'::jsonb, 'male', 'triple', true, true, false, false),

-- Bangalore Properties
('Premium PG for Women', 'Safe and secure PG exclusively for working women. Located in the heart of Koramangala with 24/7 security.', 'pg', 15000, 'month', 'Koramangala', '234 5th Block, Koramangala', 'Bangalore', 12.9352, 77.6245, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Laundry", "Security", "CCTV", "Housekeeping"]'::jsonb, 'female', 'single', true, true, true, false),

('Tech Park Adjacent Flat', '3BHK flat near major IT parks. Perfect for IT professionals. Fully furnished with all amenities.', 'flat', 35000, 'month', 'Whitefield', '567 ITPL Main Road, Whitefield', 'Bangalore', 12.9698, 77.7500, true, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Parking", "Gym", "Security", "Power Backup"]'::jsonb, 'any', 'multiple', false, true, true, true),

('Student Hostel BTM', 'Budget-friendly hostel for students. Near colleges and coaching centers.', 'hostel', 7000, 'month', 'BTM Layout', '890 BTM 2nd Stage', 'Bangalore', 12.9165, 77.6101, true, '["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"]'::jsonb, '["WiFi", "Mess", "Study Room", "Security"]'::jsonb, 'any', 'double', true, true, false, false),

-- Delhi Properties
('Modern PG in Lajpat Nagar', 'Contemporary PG with all modern facilities. Close to metro station and market.', 'pg', 13000, 'month', 'Lajpat Nagar', '123 Ring Road, Lajpat Nagar', 'Delhi', 28.5677, 77.2431, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Laundry", "Security", "Meals"]'::jsonb, 'male', 'double', true, true, true, false),

('Spacious Flat Dwarka', '2BHK flat in Dwarka Sector 10. Well-connected to metro. Family-friendly neighborhood.', 'flat', 25000, 'month', 'Dwarka', '456 Sector 10, Dwarka', 'Delhi', 28.5921, 77.0460, true, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Parking", "Security", "Park"]'::jsonb, 'any', 'multiple', false, true, true, true),

-- Pune Properties
('Coworking PG Hinjewadi', 'PG with dedicated coworking space. Perfect for remote workers and freelancers.', 'pg', 14000, 'month', 'Hinjewadi', '789 Phase 1, Hinjewadi', 'Pune', 18.5912, 73.7389, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Coworking Space", "Parking", "Security"]'::jsonb, 'any', 'single', true, true, true, true),

('Affordable Room Kothrud', 'Single room for rent in shared flat. Ideal for students and young professionals.', 'room', 9000, 'month', 'Kothrud', '234 Paud Road, Kothrud', 'Pune', 18.5074, 73.8077, true, '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]'::jsonb, '["WiFi", "Kitchen Access", "Security"]'::jsonb, 'any', 'single', false, true, false, false),

-- Hyderabad Properties
('Luxury PG Gachibowli', 'Premium PG near HITEC City. All amenities included. Perfect for IT professionals.', 'pg', 16000, 'month', 'Gachibowli', '567 HITEC City Road', 'Hyderabad', 17.4399, 78.3908, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Gym", "Laundry", "Security", "Housekeeping"]'::jsonb, 'any', 'single', true, true, true, true),

('Budget Hostel Kukatpally', 'Economical hostel for students. Near universities and coaching centers.', 'hostel', 6500, 'month', 'Kukatpally', '890 JNTU Road, Kukatpally', 'Hyderabad', 17.4948, 78.3982, true, '["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"]'::jsonb, '["WiFi", "Mess", "Study Room", "Security"]'::jsonb, 'male', 'triple', true, true, false, false),

-- Chennai Properties
('Beach View Flat Besant Nagar', 'Beautiful 2BHK flat with beach view. Peaceful location with all amenities.', 'flat', 30000, 'month', 'Besant Nagar', '123 Beach Road, Besant Nagar', 'Chennai', 13.0006, 80.2668, true, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Parking", "Security", "Sea View"]'::jsonb, 'any', 'multiple', false, true, true, true),

('Student PG Velachery', 'Affordable PG for students near colleges. Clean and well-maintained.', 'pg', 10000, 'month', 'Velachery', '456 Velachery Main Road', 'Chennai', 12.9750, 80.2212, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "Laundry", "Security", "Meals"]'::jsonb, 'female', 'double', true, true, false, false),

-- Kolkata Properties
('Heritage PG Salt Lake', 'Traditional PG with modern amenities in Salt Lake City. Close to IT sector.', 'pg', 11000, 'month', 'Salt Lake', '789 Sector V, Salt Lake', 'Kolkata', 22.5726, 88.3639, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Laundry", "Security", "Meals"]'::jsonb, 'any', 'double', true, true, true, false),

-- Ahmedabad Properties
('Modern Flat Satellite', 'Contemporary 2BHK flat in prime Satellite area. Fully furnished.', 'flat', 22000, 'month', 'Satellite', '234 SG Highway, Satellite', 'Ahmedabad', 23.0258, 72.5873, true, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Parking", "Security", "Gym"]'::jsonb, 'any', 'multiple', false, true, true, true),

-- Jaipur Properties
('Royal PG Malviya Nagar', 'Comfortable PG in the heart of Jaipur. Near colleges and shopping areas.', 'pg', 9500, 'month', 'Malviya Nagar', '567 Malviya Nagar', 'Jaipur', 26.8523, 75.8088, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "Laundry", "Security", "Meals"]'::jsonb, 'any', 'double', true, true, false, false),

-- Lucknow Properties
('Spacious Room Gomti Nagar', 'Large room in shared apartment. Peaceful neighborhood with good connectivity.', 'room', 8500, 'month', 'Gomti Nagar', '890 Gomti Nagar Extension', 'Lucknow', 26.8550, 80.9803, true, '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]'::jsonb, '["WiFi", "Kitchen Access", "Security"]'::jsonb, 'male', 'single', false, true, false, false),

-- Additional Properties
('Executive PG Indiranagar', 'Premium PG for executives in Bangalore. All-inclusive amenities.', 'pg', 17000, 'month', 'Indiranagar', '123 100 Feet Road, Indiranagar', 'Bangalore', 12.9716, 77.6412, true, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb, '["WiFi", "AC", "Gym", "Laundry", "Security", "Housekeeping", "Meals"]'::jsonb, 'any', 'single', true, true, true, true),

('Affordable Hostel Viman Nagar', 'Budget hostel for students in Pune. Clean and safe environment.', 'hostel', 7500, 'month', 'Viman Nagar', '456 Airport Road, Viman Nagar', 'Pune', 18.5679, 73.9143, true, '["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"]'::jsonb, '["WiFi", "Mess", "Study Room", "Security", "Common Room"]'::jsonb, 'any', 'double', true, true, false, false);

-- Insert demo mess facilities
INSERT INTO mess_facilities (
  name, description, location, address, city,
  latitude, longitude, meal_types,
  price_per_meal, monthly_price, contact_phone, images
) VALUES
('Annapurna Mess', 'Authentic South Indian meals with variety of dishes. Hygienic and affordable.', 'Koramangala', '123 Koramangala 4th Block', 'Bangalore', 12.9352, 77.6245, '["Breakfast", "Lunch", "Dinner"]'::jsonb, 80, 4500, '+91-9876543210', '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"]'::jsonb),

('Punjabi Dhaba', 'Delicious North Indian food. Home-style cooking with generous portions.', 'Andheri West', '456 SV Road, Andheri', 'Mumbai', 19.1136, 72.8697, '["Lunch", "Dinner"]'::jsonb, 100, 5500, '+91-9876543211', '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"]'::jsonb),

('Healthy Bites', 'Nutritious meals for health-conscious individuals. Customizable meal plans.', 'Gachibowli', '789 HITEC City', 'Hyderabad', 17.4399, 78.3908, '["Breakfast", "Lunch", "Dinner"]'::jsonb, 90, 5000, '+91-9876543212', '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"]'::jsonb),

('Student Mess', 'Budget-friendly mess for students. Simple and tasty home-cooked food.', 'Velachery', '234 Velachery Main Road', 'Chennai', 12.9750, 80.2212, '["Breakfast", "Lunch", "Dinner"]'::jsonb, 60, 3500, '+91-9876543213', '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"]'::jsonb),

('Gourmet Kitchen', 'Premium mess with multi-cuisine options. Quality ingredients and expert chefs.', 'Satellite', '567 SG Highway', 'Ahmedabad', 23.0258, 72.5873, '["Breakfast", "Lunch", "Dinner"]'::jsonb, 120, 6500, '+91-9876543214', '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"]'::jsonb);