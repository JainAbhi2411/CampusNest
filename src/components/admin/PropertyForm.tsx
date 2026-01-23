import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { propertyApi, storageApi } from '@/db/api';
import type { Property, AccommodationType, GenderPreference, OccupancyType } from '@/types/types';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface PropertyFormProps {
  property?: Property | null;
  onClose: (success?: boolean) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    accommodation_type: 'pg' as AccommodationType,
    price: 0,
    price_period: 'month',
    location: '',
    address: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    owner_id: null as string | null,
    images: [] as string[],
    amenities: [] as string[],
    gender_preference: 'any',
    occupancy_type: 'single',
    available: true,
    virtual_tour_url: '',
    video_url: '',
    food_included: false,
    wifi_available: false,
    ac_available: false,
    parking_available: false,
    average_rating: 0,
    total_reviews: 0,
    verification_status: 'verified' as 'verified' | 'pending' | 'rejected',
    owner_contact: null as string | null,
    owner_name: null as string | null,
    owner_email: null as string | null,
    submitted_at: new Date().toISOString(),
    verified_at: null as string | null,
    verified_by: null as string | null,
    rejection_reason: null as string | null,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        accommodation_type: property.accommodation_type || 'pg',
        price: property.price || 0,
        price_period: property.price_period || 'month',
        location: property.location || '',
        address: property.address || '',
        city: property.city || '',
        latitude: property.latitude || null,
        longitude: property.longitude || null,
        owner_id: property.owner_id || null,
        images: property.images || [],
        amenities: property.amenities || [],
        gender_preference: property.gender_preference || 'any',
        occupancy_type: property.occupancy_type || 'single',
        available: property.available ?? true,
        virtual_tour_url: property.virtual_tour_url || '',
        video_url: property.video_url || '',
        food_included: property.food_included || false,
        wifi_available: property.wifi_available || false,
        ac_available: property.ac_available || false,
        parking_available: property.parking_available || false,
        average_rating: property.average_rating || 0,
        total_reviews: property.total_reviews || 0,
        verification_status: property.verification_status || 'verified',
        owner_contact: property.owner_contact || null,
        owner_name: property.owner_name || null,
        owner_email: property.owner_email || null,
        submitted_at: property.submitted_at || new Date().toISOString(),
        verified_at: property.verified_at || null,
        verified_by: property.verified_by || null,
        rejection_reason: property.rejection_reason || null,
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    try {
      setUploadingImages(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        if (file.size > 1024 * 1024) {
          toast.error(`File ${file.name} is larger than 1MB`);
          return null;
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const url = await storageApi.uploadImage(file, fileName);
        return url;
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validUrls],
      }));

      toast.success(`${validUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (url: string) => {
    try {
      const path = url.split('/').pop();
      if (path) {
        await storageApi.deleteImage(path);
      }
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== url),
      }));
      toast.success('Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.city || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      if (property) {
        await propertyApi.updateProperty(property.id, formData);
        toast.success('Property updated successfully');
      } else {
        await propertyApi.createProperty(formData);
        toast.success('Property created successfully');
      }

      onClose(true);
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const commonAmenities = [
    'WiFi',
    'AC',
    'Parking',
    'Laundry',
    'Kitchen',
    'TV',
    'Gym',
    'Security',
    'Power Backup',
    'Water Supply',
    'Furnished',
    'Balcony',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Property Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Cozy PG near University"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accommodation_type">
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.accommodation_type}
            onValueChange={(value) => handleInputChange('accommodation_type', value)}
          >
            <SelectTrigger id="accommodation_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pg">PG</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">
            Price (₹/month) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
            placeholder="5000"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="e.g., Bangalore"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Koramangala, 5th Block"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender_preference">Gender Preference</Label>
          <Select
            value={formData.gender_preference}
            onValueChange={(value) => handleInputChange('gender_preference', value)}
          >
            <SelectTrigger id="gender_preference">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male Only</SelectItem>
              <SelectItem value="female">Female Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupancy_type">Occupancy Type</Label>
          <Select
            value={formData.occupancy_type}
            onValueChange={(value) => handleInputChange('occupancy_type', value)}
          >
            <SelectTrigger id="occupancy_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="triple">Triple</SelectItem>
              <SelectItem value="multiple">Multiple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the property..."
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Full Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Complete address with landmarks"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
          <Input
            id="virtual_tour_url"
            value={formData.virtual_tour_url}
            onChange={(e) => handleInputChange('virtual_tour_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <label
                htmlFor={amenity}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Images</Label>
        <div className="border-2 border-dashed rounded-lg p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload property images (Max 10, 1MB each)
            </p>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages || formData.images.length >= 10}
              className="max-w-xs"
            />
          </div>

          {uploadingImages && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          )}

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.images.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => handleInputChange('available', checked)}
        />
        <label
          htmlFor="available"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Property is available for booking
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => onClose()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>{property ? 'Update Property' : 'Create Property'}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
