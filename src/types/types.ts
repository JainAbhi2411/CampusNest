export type UserRole = 'user' | 'admin';
export type AccommodationType = 'pg' | 'flat' | 'hostel' | 'room';
export type BookingType = 'visit' | 'room';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type GenderPreference = 'male' | 'female' | 'any';
export type OccupancyType = 'single' | 'double' | 'triple' | 'multiple';
export type SortOption = 'price_low' | 'price_high' | 'rating' | 'newest';

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  accommodation_type: AccommodationType;
  price: number;
  price_period: string;
  location: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  available: boolean;
  owner_id: string | null;
  images: string[];
  virtual_tour_url: string | null;
  video_url: string | null;
  amenities: string[];
  gender_preference: string;
  occupancy_type: string;
  food_included: boolean;
  wifi_available: boolean;
  ac_available: boolean;
  parking_available: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface MessFacility {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  meal_types: string[];
  price_per_meal: number | null;
  monthly_price: number | null;
  breakfast_price: number | null;
  lunch_price: number | null;
  dinner_price: number | null;
  weekly_price: number | null;
  trial_meal_price: number | null;
  dietary_options: string[];
  cuisine_types: string[];
  breakfast_timing: string | null;
  lunch_timing: string | null;
  dinner_timing: string | null;
  operating_days: string[];
  capacity: number | null;
  features: string[];
  average_rating: number;
  total_reviews: number;
  hygiene_rating: number | null;
  owner_id: string | null;
  available: boolean;
  special_notes: string | null;
  contact_phone: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface MessBooking {
  id: string;
  mess_id: string;
  user_id: string;
  booking_type: 'trial' | 'daily' | 'weekly' | 'monthly';
  meal_types: string[];
  start_date: string;
  end_date: string | null;
  dietary_preference: string | null;
  special_requirements: string | null;
  total_amount: number | null;
  advance_payment: number | null;
  payment_status: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessReview {
  id: string;
  mess_id: string;
  user_id: string;
  rating: number;
  food_quality_rating: number | null;
  hygiene_rating: number | null;
  service_rating: number | null;
  comment: string | null;
  created_at: string;
}

export interface MessReviewWithUser extends MessReview {
  user?: Profile;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id?: string;
  author_id: string;
  read_time: number;
  views: number;
  reaction_count: number;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: Profile;
  tags?: BlogTag[];
}

export interface BlogReaction {
  id: string;
  blog_post_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'insightful' | 'helpful';
  created_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  booking_type: BookingType;
  booking_date: string;
  booking_time: string | null;
  status: BookingStatus;
  notes: string | null;
  number_of_people: number | null;
  preferred_time_slot: string | null;
  move_in_date: string | null;
  booking_duration: string | null;
  advance_payment: number | null;
  payment_status: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface PropertyView {
  id: string;
  property_id: string;
  user_id: string | null;
  viewed_at: string;
}

export interface PropertyWithDetails extends Property {
  owner?: Profile;
  is_favorite?: boolean;
}

export interface BookingWithDetails extends Booking {
  property?: Property;
  user?: Profile;
}

export interface SearchFilters {
  search_query?: string;
  city?: string;
  accommodation_type?: AccommodationType;
  min_price?: number;
  max_price?: number;
  amenities?: string[];
  available?: boolean;
  gender_preference?: GenderPreference;
  occupancy_type?: OccupancyType;
  food_included?: boolean;
  wifi_available?: boolean;
  ac_available?: boolean;
  parking_available?: boolean;
  min_rating?: number;
  latitude?: number;
  longitude?: number;
  max_distance?: number;
  sort_by?: SortOption;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
}

export interface PropertyComparison {
  id: string;
  user_id: string | null;
  anonymous_id: string | null;
  property_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface ComparisonAnalytics {
  id: string;
  property_a_id: string;
  property_b_id: string;
  comparison_count: number;
  last_compared_at: string;
}

export interface PropertyWithDetails extends Property {
  owner?: Profile;
  distance?: number;
}

export interface ComparisonScore {
  property_id: string;
  total_score: number;
  price_score: number;
  location_score: number;
  amenities_score: number;
  rating_score: number;
}

export interface Feedback {
  id: string;
  name: string;
  contact: string;
  looking_for: string;
  problems_faced: string | null;
  created_at: string;
}
