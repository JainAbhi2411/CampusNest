import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Search,
  Navigation,
  MapPin,
  Home,
  IndianRupee,
  Filter,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AccommodationType } from '@/types/types';

interface EnhancedSearchBarProps {
  onSearch?: (params: SearchParams) => void;
  showQuickFilters?: boolean;
  className?: string;
}

interface SearchParams {
  query?: string;
  city?: string;
  accommodationType?: AccommodationType;
  priceRange?: string;
  useLocation?: boolean;
  latitude?: number;
  longitude?: number;
}

const POPULAR_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

const PRICE_RANGES = [
  { label: 'Under ₹10,000', value: '0-10000' },
  { label: '₹10,000 - ₹20,000', value: '10000-20000' },
  { label: '₹20,000 - ₹30,000', value: '20000-30000' },
  { label: 'Above ₹30,000', value: '30000-999999' },
];

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  showQuickFilters = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setHasLocation(true);
        setSelectedCity('');
        toast.success('Location detected successfully');
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location. Please enable location services.');
        setIsLoadingLocation(false);
      }
    );
  };

  const handleClearLocation = () => {
    setHasLocation(false);
    setLocationCoords(null);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params: SearchParams = {
      query: query || undefined,
      city: selectedCity && selectedCity !== 'all' ? selectedCity : undefined,
      accommodationType: selectedType && selectedType !== 'all' ? (selectedType as AccommodationType) : undefined,
      priceRange: selectedPriceRange && selectedPriceRange !== 'all' ? selectedPriceRange : undefined,
    };

    if (hasLocation && locationCoords) {
      params.useLocation = true;
      params.latitude = locationCoords.lat;
      params.longitude = locationCoords.lng;
    }

    if (onSearch) {
      onSearch(params);
    } else {
      const searchParams = new URLSearchParams();
      if (params.query) searchParams.set('search', params.query);
      if (params.city) searchParams.set('city', params.city);
      if (params.accommodationType) searchParams.set('type', params.accommodationType);
      if (params.priceRange) {
        const [min, max] = params.priceRange.split('-');
        searchParams.set('min_price', min);
        searchParams.set('max_price', max);
      }
      if (params.useLocation && params.latitude && params.longitude) {
        searchParams.set('lat', params.latitude.toString());
        searchParams.set('lng', params.longitude.toString());
      }

      navigate(`/properties?${searchParams.toString()}`);
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCity('all');
    setSelectedType('all');
    setSelectedPriceRange('all');
    handleClearLocation();
  };

  const hasActiveFilters = query || (selectedCity && selectedCity !== 'all') || (selectedType && selectedType !== 'all') || (selectedPriceRange && selectedPriceRange !== 'all') || hasLocation;

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-4 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col xl:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location, property name, or area..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <div className="flex gap-2">
              {hasLocation ? (
                <Button
                  type="button"
                  onClick={handleClearLocation}
                  variant="secondary"
                  className="h-12 px-4"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Using Location
                  <X className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLoadingLocation}
                  variant="outline"
                  className="h-12 px-4"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isLoadingLocation ? 'Detecting...' : 'Near Me'}
                </Button>
              )}

              <Button type="submit" className="h-12 px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {showQuickFilters && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City
                </label>
                <Select
                  value={selectedCity}
                  onValueChange={setSelectedCity}
                  disabled={hasLocation}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {POPULAR_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pg">PG</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Price Range
                </label>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Actions
                </label>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      onClick={handleClearFilters}
                      variant="outline"
                      className="h-10 flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => navigate('/properties')}
                    variant="secondary"
                    className="h-10 flex-1"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {query && (
              <Badge variant="secondary" className="gap-1">
                Search: {query}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setQuery('')}
                />
              </Badge>
            )}
            {selectedCity && (
              <Badge variant="secondary" className="gap-1">
                City: {selectedCity}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCity('')}
                />
              </Badge>
            )}
            {selectedType && (
              <Badge variant="secondary" className="gap-1">
                Type: {selectedType.toUpperCase()}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedType('')}
                />
              </Badge>
            )}
            {selectedPriceRange && (
              <Badge variant="secondary" className="gap-1">
                Price: {PRICE_RANGES.find(r => r.value === selectedPriceRange)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedPriceRange('')}
                />
              </Badge>
            )}
            {hasLocation && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                Using Current Location
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={handleClearLocation}
                />
              </Badge>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnhancedSearchBar;