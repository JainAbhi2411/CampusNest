import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Filter, X, MapPin, Navigation, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { SearchFilters, AccommodationType, GenderPreference, OccupancyType, SortOption } from '@/types/types';

interface AdvancedFilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({ filters, onFilterChange, onReset }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 50000
  ]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    setPriceRange([filters.min_price || 0, filters.max_price || 50000]);
  }, [filters.min_price, filters.max_price]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onFilterChange({
          ...filters,
          city: undefined, // Clear city when using location
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          max_distance: filters.max_distance || 10,
        });
        toast.success('Location detected successfully');
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location');
        setIsLoadingLocation(false);
      }
    );
  };

  const handleClearLocation = () => {
    onFilterChange({
      ...filters,
      latitude: undefined,
      longitude: undefined,
      max_distance: undefined,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceRangeCommit = () => {
    onFilterChange({
      ...filters,
      min_price: priceRange[0],
      max_price: priceRange[1],
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select
            value={filters.city || 'all'}
            onValueChange={(value) => {
              const newFilters = { ...filters, city: value === 'all' ? undefined : value };
              // If selecting a city, clear location-based search
              if (value !== 'all') {
                newFilters.latitude = undefined;
                newFilters.longitude = undefined;
                newFilters.max_distance = undefined;
              }
              onFilterChange(newFilters);
            }}
            disabled={!!(filters.latitude && filters.longitude)}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {POPULAR_CITIES.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.latitude && filters.longitude && (
            <p className="text-xs text-muted-foreground">
              Clear location filter to select a city
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Current Location</span>
            {filters.latitude && filters.longitude && (
              <Badge variant="secondary" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </Label>
          <div className="flex gap-2">
            <Button
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isLoadingLocation ? 'Detecting...' : 'Use My Location'}
            </Button>
            {filters.latitude && filters.longitude && (
              <Button onClick={handleClearLocation} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {filters.latitude && filters.longitude && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="distance">Within {filters.max_distance || 10} km</Label>
              <Slider
                id="distance"
                min={1}
                max={50}
                step={1}
                value={[filters.max_distance || 10]}
                onValueChange={(value) => onFilterChange({ ...filters, max_distance: value[0] })}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accommodation-type">Accommodation Type</Label>
          <Select
            value={filters.accommodation_type || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, accommodation_type: value === 'all' ? undefined : (value as AccommodationType) })}
          >
            <SelectTrigger id="accommodation-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pg">Paying Guest (PG)</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="room">Room for Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender Preference</Label>
          <Select
            value={filters.gender_preference || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, gender_preference: value === 'all' ? undefined : (value as GenderPreference) })}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="any">Co-living</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupancy">Occupancy Type</Label>
          <Select
            value={filters.occupancy_type || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, occupancy_type: value === 'all' ? undefined : (value as OccupancyType) })}
          >
            <SelectTrigger id="occupancy">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="triple">Triple</SelectItem>
              <SelectItem value="multiple">Multiple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</Label>
          <Slider
            min={0}
            max={50000}
            step={500}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            onValueCommit={handlePriceRangeCommit}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Star className="h-4 w-4 text-secondary" />
            Minimum Rating
          </Label>
          <Select
            value={filters.min_rating?.toString() || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, min_rating: value === 'all' ? undefined : Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <Label>Amenities</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="food" className="font-normal">Food Included</Label>
              <Switch
                id="food"
                checked={filters.food_included || false}
                onCheckedChange={(checked) => onFilterChange({ ...filters, food_included: checked || undefined })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="wifi" className="font-normal">WiFi Available</Label>
              <Switch
                id="wifi"
                checked={filters.wifi_available || false}
                onCheckedChange={(checked) => onFilterChange({ ...filters, wifi_available: checked || undefined })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ac" className="font-normal">AC Available</Label>
              <Switch
                id="ac"
                checked={filters.ac_available || false}
                onCheckedChange={(checked) => onFilterChange({ ...filters, ac_available: checked || undefined })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="parking" className="font-normal">Parking Available</Label>
              <Switch
                id="parking"
                checked={filters.parking_available || false}
                onCheckedChange={(checked) => onFilterChange({ ...filters, parking_available: checked || undefined })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={filters.sort_by || 'newest'}
            onValueChange={(value) => onFilterChange({ ...filters, sort_by: value as SortOption })}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={filters.available === undefined ? 'all' : filters.available ? 'available' : 'occupied'}
            onValueChange={(value) => onFilterChange({ ...filters, available: value === 'all' ? undefined : value === 'available' })}
          >
            <SelectTrigger id="availability">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available Only</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <X className="h-4 w-4 mr-2" />
          Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilterPanel;