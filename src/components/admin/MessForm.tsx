import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { messApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import { Loader2 } from 'lucide-react';

interface MessFormProps {
  mess?: MessFacility | null;
  onClose: (success?: boolean) => void;
}

const MessForm: React.FC<MessFormProps> = ({ mess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    meal_types: [] as string[],
    monthly_price: null as number | null,
    contact_phone: '',
    dietary_options: [] as string[],
    cuisine_types: [] as string[],
    breakfast_timing: '',
    lunch_timing: '',
    dinner_timing: '',
    operating_days: [] as string[],
    capacity: null as number | null,
    features: [] as string[],
    average_rating: 0,
    total_reviews: 0,
    hygiene_rating: null as number | null,
    owner_id: null as string | null,
    available: true,
    special_notes: '',
    images: [] as string[],
    price_per_meal: null as number | null,
    breakfast_price: null as number | null,
    lunch_price: null as number | null,
    dinner_price: null as number | null,
    weekly_price: null as number | null,
    trial_meal_price: null as number | null,
  });

  useEffect(() => {
    if (mess) {
      setFormData({
        name: mess.name || '',
        description: mess.description || '',
        location: mess.location || '',
        address: mess.address || '',
        city: mess.city || '',
        latitude: mess.latitude || null,
        longitude: mess.longitude || null,
        meal_types: mess.meal_types || [],
        monthly_price: mess.monthly_price || null,
        contact_phone: mess.contact_phone || '',
        dietary_options: mess.dietary_options || [],
        cuisine_types: mess.cuisine_types || [],
        breakfast_timing: mess.breakfast_timing || '',
        lunch_timing: mess.lunch_timing || '',
        dinner_timing: mess.dinner_timing || '',
        operating_days: mess.operating_days || [],
        capacity: mess.capacity || null,
        features: mess.features || [],
        average_rating: mess.average_rating || 0,
        total_reviews: mess.total_reviews || 0,
        hygiene_rating: mess.hygiene_rating || null,
        owner_id: mess.owner_id || null,
        available: mess.available ?? true,
        special_notes: mess.special_notes || '',
        images: mess.images || [],
        price_per_meal: mess.price_per_meal || null,
        breakfast_price: mess.breakfast_price || null,
        lunch_price: mess.lunch_price || null,
        dinner_price: mess.dinner_price || null,
        weekly_price: mess.weekly_price || null,
        trial_meal_price: mess.trial_meal_price || null,
      });
    }
  }, [mess]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMealTypeToggle = (mealType: string) => {
    setFormData((prev) => ({
      ...prev,
      meal_types: prev.meal_types.includes(mealType)
        ? prev.meal_types.filter((t) => t !== mealType)
        : [...prev.meal_types, mealType],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter mess name');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('Please enter city');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please enter location');
      return;
    }

    if (formData.meal_types.length === 0) {
      toast.error('Please select at least one meal type');
      return;
    }

    try {
      setLoading(true);

      if (mess) {
        await messApi.updateMess(mess.id, formData);
        toast.success('Mess facility updated successfully');
      } else {
        await messApi.createMess(formData);
        toast.success('Mess facility added successfully');
      }

      onClose(true);
    } catch (error) {
      console.error('Error saving mess:', error);
      toast.error('Failed to save mess facility');
    } finally {
      setLoading(false);
    }
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'tiffin'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">
            Mess Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Annapurna Mess"
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

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Koramangala"
            required
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the mess facility..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_price">Monthly Price (₹)</Label>
          <Input
            id="monthly_price"
            type="number"
            value={formData.monthly_price || ''}
            onChange={(e) => handleInputChange('monthly_price', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="e.g., 4000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone || ''}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            placeholder="+91 9876543210"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Meal Types <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mealTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`meal-${type}`}
                checked={formData.meal_types.includes(type)}
                onCheckedChange={() => handleMealTypeToggle(type)}
              />
              <label
                htmlFor={`meal-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dietary Options</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['veg', 'non-veg', 'vegan', 'jain'].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${option}`}
                checked={formData.dietary_options.includes(option)}
                onCheckedChange={() => {
                  setFormData((prev) => ({
                    ...prev,
                    dietary_options: prev.dietary_options.includes(option)
                      ? prev.dietary_options.filter((o) => o !== option)
                      : [...prev.dietary_options, option],
                  }));
                }}
              />
              <label
                htmlFor={`dietary-${option}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => onClose()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mess ? 'Update Mess' : 'Add Mess'}
        </Button>
      </div>
    </form>
  );
};

export default MessForm;
