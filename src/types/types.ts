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
  contact_phone: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
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
