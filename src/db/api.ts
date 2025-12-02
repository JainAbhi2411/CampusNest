import { supabase } from './supabase';
import type {
  Profile,
  Property,
  MessFacility,
  MessBooking,
  MessReview,
  MessReviewWithUser,
  Booking,
  PropertyWithDetails,
  BookingWithDetails,
  SearchFilters,
  AccommodationType,
  BookingType,
  BookingStatus,
  Review,
  ReviewWithUser,
  Favorite,
  PropertyView,
} from '@/types/types';

// Profile API
export const profileApi = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');
    return data;
  },
};

// Property API
export const propertyApi = {
  async getProperties(filters?: SearchFilters, page = 1, pageSize = 12): Promise<Property[]> {
    // If location-based search is requested, use RPC for distance calculation
    if (filters?.latitude !== undefined && filters?.longitude !== undefined && filters?.max_distance) {
      return this.getPropertiesByLocation(filters, page, pageSize);
    }

    let query = supabase.from('properties').select('*');

    // Text search filter
    if (filters?.search_query) {
      const searchTerm = filters.search_query;
      query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Basic filters
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.accommodation_type) {
      query = query.eq('accommodation_type', filters.accommodation_type);
    }
    if (filters?.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }
    if (filters?.available !== undefined) {
      query = query.eq('available', filters.available);
    }

    // New filters
    if (filters?.gender_preference) {
      query = query.eq('gender_preference', filters.gender_preference);
    }
    if (filters?.occupancy_type) {
      query = query.eq('occupancy_type', filters.occupancy_type);
    }
    if (filters?.food_included !== undefined) {
      query = query.eq('food_included', filters.food_included);
    }
    if (filters?.wifi_available !== undefined) {
      query = query.eq('wifi_available', filters.wifi_available);
    }
    if (filters?.ac_available !== undefined) {
      query = query.eq('ac_available', filters.ac_available);
    }
    if (filters?.parking_available !== undefined) {
      query = query.eq('parking_available', filters.parking_available);
    }
    if (filters?.min_rating !== undefined) {
      query = query.gte('average_rating', filters.min_rating);
    }

    // Sorting
    if (filters?.sort_by) {
      switch (filters.sort_by) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await query.range(from, to);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getPropertiesByLocation(filters: SearchFilters, page = 1, pageSize = 12): Promise<Property[]> {
    // Get all properties first
    let query = supabase.from('properties').select('*');

    // Text search filter
    if (filters?.search_query) {
      const searchTerm = filters.search_query;
      query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply non-location filters
    if (filters?.accommodation_type) {
      query = query.eq('accommodation_type', filters.accommodation_type);
    }
    if (filters?.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }
    if (filters?.available !== undefined) {
      query = query.eq('available', filters.available);
    }
    if (filters?.gender_preference) {
      query = query.eq('gender_preference', filters.gender_preference);
    }
    if (filters?.occupancy_type) {
      query = query.eq('occupancy_type', filters.occupancy_type);
    }
    if (filters?.food_included !== undefined) {
      query = query.eq('food_included', filters.food_included);
    }
    if (filters?.wifi_available !== undefined) {
      query = query.eq('wifi_available', filters.wifi_available);
    }
    if (filters?.ac_available !== undefined) {
      query = query.eq('ac_available', filters.ac_available);
    }
    if (filters?.parking_available !== undefined) {
      query = query.eq('parking_available', filters.parking_available);
    }
    if (filters?.min_rating !== undefined) {
      query = query.gte('average_rating', filters.min_rating);
    }

    // Only get properties that have coordinates
    query = query.not('latitude', 'is', null).not('longitude', 'is', null);

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    // Calculate distance for each property
    const propertiesWithDistance = data.map((property: any) => {
      const distance = this.calculateDistance(
        filters.latitude!,
        filters.longitude!,
        property.latitude,
        property.longitude
      );
      return { ...property, distance };
    });

    // Filter by max distance
    const filteredProperties = propertiesWithDistance.filter(
      (p) => p.distance <= (filters.max_distance || 10)
    );

    // Sort by distance or other criteria
    let sortedProperties = filteredProperties;
    if (filters?.sort_by) {
      switch (filters.sort_by) {
        case 'price_low':
          sortedProperties.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          sortedProperties.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedProperties.sort((a, b) => b.average_rating - a.average_rating);
          break;
        case 'newest':
          sortedProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        default:
          sortedProperties.sort((a, b) => a.distance - b.distance);
      }
    } else {
      // Default: sort by distance
      sortedProperties.sort((a, b) => a.distance - b.distance);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    return sortedProperties.slice(from, to);
  },

  // Haversine formula to calculate distance between two coordinates
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  },

  async getPropertiesByType(type: string, limit = 6): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('accommodation_type', type)
      .eq('available', true)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getPropertyById(id: string): Promise<PropertyWithDetails | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*, owner:profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create property');
    return data;
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Property not found');
    return data;
  },

  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  },

  async searchProperties(searchTerm: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Mess Facility API
export const messFacilityApi = {
  async getMessFacilities(city?: string, page = 1, pageSize = 12): Promise<MessFacility[]> {
    let query = supabase.from('mess_facilities').select('*');

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getMessFacilityById(id: string): Promise<MessFacility | null> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createMessFacility(facility: Omit<MessFacility, 'id' | 'created_at' | 'updated_at'>): Promise<MessFacility> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .insert(facility)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create mess facility');
    return data;
  },

  async updateMessFacility(id: string, updates: Partial<MessFacility>): Promise<MessFacility> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Mess facility not found');
    return data;
  },

  async deleteMessFacility(id: string): Promise<void> {
    const { error } = await supabase.from('mess_facilities').delete().eq('id', id);
    if (error) throw error;
  },

  async getNearbyMessFacilities(city: string, limit = 5): Promise<MessFacility[]> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .select('*')
      .ilike('city', `%${city}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Mess Booking API
export const messBookingApi = {
  async createMessBooking(booking: {
    mess_id: string;
    user_id: string;
    booking_type: 'trial' | 'daily' | 'weekly' | 'monthly';
    meal_types: string[];
    start_date: string;
    end_date?: string;
    dietary_preference?: string;
    special_requirements?: string;
    total_amount?: number;
    advance_payment?: number;
    payment_status?: string;
    notes?: string;
  }): Promise<MessBooking> {
    const { data, error } = await supabase
      .from('mess_bookings')
      .insert(booking)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create mess booking');
    return data;
  },

  async getUserMessBookings(userId: string, page = 1, pageSize = 10): Promise<MessBooking[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('mess_bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getMessBookingById(id: string): Promise<MessBooking | null> {
    const { data, error } = await supabase
      .from('mess_bookings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateMessBookingStatus(id: string, status: string): Promise<MessBooking> {
    const { data, error } = await supabase
      .from('mess_bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Mess booking not found');
    return data;
  },

  async cancelMessBooking(id: string): Promise<void> {
    const { error } = await supabase
      .from('mess_bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  },
};

// Mess Review API
export const messReviewApi = {
  async getMessReviews(messId: string, page = 1, pageSize = 10): Promise<MessReviewWithUser[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('mess_reviews')
      .select(`
        *,
        user:profiles(id, username, full_name, avatar_url)
      `)
      .eq('mess_id', messId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createMessReview(review: {
    mess_id: string;
    user_id: string;
    rating: number;
    food_quality_rating?: number;
    hygiene_rating?: number;
    service_rating?: number;
    comment?: string;
  }): Promise<MessReview> {
    const { data, error } = await supabase
      .from('mess_reviews')
      .insert(review)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create review');
    return data;
  },

  async updateMessReview(id: string, updates: {
    rating?: number;
    food_quality_rating?: number;
    hygiene_rating?: number;
    service_rating?: number;
    comment?: string;
  }): Promise<MessReview> {
    const { data, error } = await supabase
      .from('mess_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Review not found');
    return data;
  },

  async deleteMessReview(id: string): Promise<void> {
    const { error } = await supabase.from('mess_reviews').delete().eq('id', id);
    if (error) throw error;
  },

  async getUserMessReview(messId: string, userId: string): Promise<MessReview | null> {
    const { data, error } = await supabase
      .from('mess_reviews')
      .select('*')
      .eq('mess_id', messId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

// Booking API
export const bookingApi = {
  async getUserBookings(userId: string, page = 1, pageSize = 10): Promise<BookingWithDetails[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('bookings')
      .select('*, property:properties(*), user:profiles(*)')
      .eq('user_id', userId)
      .order('booking_date', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getAllBookings(page = 1, pageSize = 20): Promise<BookingWithDetails[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('bookings')
      .select('*, property:properties(*), user:profiles(*)')
      .order('booking_date', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getBookingById(id: string): Promise<BookingWithDetails | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, property:properties(*), user:profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createBooking(booking: {
    property_id: string;
    user_id: string;
    booking_type: BookingType;
    booking_date: string;
    booking_time?: string;
    notes?: string;
    number_of_people?: number;
    preferred_time_slot?: string;
    move_in_date?: string;
    booking_duration?: string;
    advance_payment?: number;
    payment_status?: string;
    special_requests?: string;
  }): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create booking');
    return data;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Booking not found');
    return data;
  },

  async deleteBooking(id: string): Promise<void> {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
  },

  async getAdminBookings(filters?: {
    status?: BookingStatus;
    booking_type?: BookingType;
    search?: string;
    start_date?: string;
    end_date?: string;
    property_id?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ bookings: BookingWithDetails[]; total: number }> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('bookings')
      .select('*, property:properties(*), user:profiles(*)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.booking_type) {
      query = query.eq('booking_type', filters.booking_type);
    }

    if (filters?.property_id) {
      query = query.eq('property_id', filters.property_id);
    }

    if (filters?.start_date) {
      query = query.gte('booking_date', filters.start_date);
    }

    if (filters?.end_date) {
      query = query.lte('booking_date', filters.end_date);
    }

    query = query.order('booking_date', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    let bookings = Array.isArray(data) ? data : [];

    if (filters?.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      bookings = bookings.filter((booking) => {
        const userName = booking.user?.username?.toLowerCase() || '';
        const userFullName = booking.user?.full_name?.toLowerCase() || '';
        const propertyTitle = booking.property?.title?.toLowerCase() || '';
        const propertyLocation = booking.property?.location?.toLowerCase() || '';
        
        return (
          userName.includes(searchLower) ||
          userFullName.includes(searchLower) ||
          propertyTitle.includes(searchLower) ||
          propertyLocation.includes(searchLower)
        );
      });
    }

    return {
      bookings,
      total: count || 0,
    };
  },

  async getBookingStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    visit_requests: number;
    direct_bookings: number;
  }> {
    const { data: allBookings, error } = await supabase
      .from('bookings')
      .select('status, booking_type');

    if (error) throw error;

    const bookings = Array.isArray(allBookings) ? allBookings : [];

    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      visit_requests: bookings.filter((b) => b.booking_type === 'visit').length,
      direct_bookings: bookings.filter((b) => b.booking_type === 'room').length,
    };
  },
};

// Storage API
export const storageApi = {
  async uploadImage(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('app-7xyosp4kpcld_property_images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('app-7xyosp4kpcld_property_images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('app-7xyosp4kpcld_property_images')
      .remove([path]);

    if (error) throw error;
  },

  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from('app-7xyosp4kpcld_property_images')
      .getPublicUrl(path);

    return data.publicUrl;
  },
};

// Review API
export const reviewApi = {
  async getPropertyReviews(propertyId: string): Promise<ReviewWithUser[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create review');
    return data;
  },

  async updateReview(reviewId: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Review not found');
    return data;
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  },

  async getUserReview(propertyId: string, userId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('property_id', propertyId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

// Favorite API
export const favoriteApi = {
  async getUserFavorites(userId: string): Promise<PropertyWithDetails[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        property:properties(
          *,
          owner:profiles(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!Array.isArray(data)) return [];
    
    return data
      .map((item: any) => item.property)
      .filter((property: any) => property !== null) as PropertyWithDetails[];
  },

  async addFavorite(userId: string, propertyId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, property_id: propertyId })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to add favorite');
    return data;
  },

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) throw error;
  },

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  async getFavoriteIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', userId);

    if (error) return [];
    return Array.isArray(data) ? data.map(item => item.property_id) : [];
  },
};

// Property View API
export const propertyViewApi = {
  async recordView(propertyId: string, userId: string | null): Promise<void> {
    const { error } = await supabase
      .from('property_views')
      .insert({ property_id: propertyId, user_id: userId });

    if (error) console.error('Failed to record view:', error);
  },

  async getPropertyViewCount(propertyId: string): Promise<number> {
    const { count, error } = await supabase
      .from('property_views')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (error) return 0;
    return count || 0;
  },
};

// Mess Facility API
export const messApi = {
  async getAllMess(): Promise<MessFacility[]> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getMessById(id: string): Promise<MessFacility | null> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createMess(messData: Omit<MessFacility, 'id' | 'created_at' | 'updated_at'>): Promise<MessFacility> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .insert(messData)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create mess facility');
    return data;
  },

  async updateMess(id: string, messData: Partial<Omit<MessFacility, 'id' | 'created_at' | 'updated_at'>>): Promise<MessFacility> {
    const { data, error } = await supabase
      .from('mess_facilities')
      .update(messData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to update mess facility');
    return data;
  },

  async deleteMess(id: string): Promise<void> {
    const { error } = await supabase
      .from('mess_facilities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async searchMess(filters: {
    city?: string;
    meal_types?: string[];
    dietary_options?: string[];
    min_price?: number;
    max_price?: number;
  }): Promise<MessFacility[]> {
    let query = supabase
      .from('mess_facilities')
      .select('*')
      .eq('available', true);

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.meal_types && filters.meal_types.length > 0) {
      query = query.contains('meal_types', filters.meal_types);
    }

    if (filters.dietary_options && filters.dietary_options.length > 0) {
      query = query.contains('dietary_options', filters.dietary_options);
    }

    if (filters.min_price) {
      query = query.gte('monthly_price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('monthly_price', filters.max_price);
    }

    const { data, error } = await query.order('average_rating', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

