import { supabase } from './supabase';
import type {
  Profile,
  Property,
  MessFacility,
  Booking,
  PropertyWithDetails,
  BookingWithDetails,
  SearchFilters,
  AccommodationType,
  BookingType,
  BookingStatus,
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
    let query = supabase.from('properties').select('*');

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
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

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

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
