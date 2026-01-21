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
        searchParams.set('distance', '10'); // Default 10km
      }

      // Always navigate to properties page, even with empty search
      const queryString = searchParams.toString();
      navigate(queryString ? `/properties?${queryString}` : '/properties');
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
    <div className={`space-y-3 xl:space-y-4 ${className}`}>
      <Card className="p-3 xl:p-4 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-3 xl:space-y-4">
          <div className="flex flex-col xl:flex-row gap-2 xl:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 xl:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 xl:h-5 xl:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search location, property..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 xl:pl-10 h-10 xl:h-12 text-sm xl:text-base"
              />
            </div>

            <div className="flex gap-2">
              {hasLocation ? (
                <Button
                  type="button"
                  onClick={handleClearLocation}
                  variant="secondary"
                  className="h-10 xl:h-12 px-3 xl:px-4 text-xs xl:text-sm flex-1 xl:flex-none"
                >
                  <MapPin className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Using Location</span>
                  <span className="xl:hidden">Location</span>
                  <X className="h-3 w-3 xl:h-4 xl:w-4 ml-1 xl:ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLoadingLocation}
                  variant="outline"
                  className="h-10 xl:h-12 px-3 xl:px-4 text-xs xl:text-sm flex-1 xl:flex-none"
                >
                  <Navigation className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                  {isLoadingLocation ? 'Detecting...' : 'Near Me'}
                </Button>
              )}

              <Button type="submit" className="h-10 xl:h-12 px-4 xl:px-6 text-xs xl:text-sm flex-1 xl:flex-none">
                <Search className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                Search
              </Button>
            </div>
          </div>

          {showQuickFilters && (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 xl:gap-3">
              <div className="space-y-1 xl:space-y-2">
                <label className="text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2">
                  <MapPin className="h-3 w-3 xl:h-4 xl:w-4" />
                  City
                </label>
                <Select
                  value={selectedCity}
                  onValueChange={setSelectedCity}
                  disabled={hasLocation}
                >
                  <SelectTrigger className="h-9 xl:h-10 text-xs xl:text-sm">
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

              <div className="space-y-1 xl:space-y-2">
                <label className="text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2">
                  <Home className="h-3 w-3 xl:h-4 xl:w-4" />
                  Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-9 xl:h-10 text-xs xl:text-sm">
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

              <div className="space-y-1 xl:space-y-2 col-span-2 xl:col-span-1">
                <label className="text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2">
                  <IndianRupee className="h-3 w-3 xl:h-4 xl:w-4" />
                  Price Range
                </label>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="h-9 xl:h-10 text-xs xl:text-sm">
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

              {hasActiveFilters && (
                <div className="space-y-1 xl:space-y-2 col-span-2 xl:col-span-1">
                  <label className="text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2 xl:opacity-0">
                    <Filter className="h-3 w-3 xl:h-4 xl:w-4" />
                    Actions
                  </label>
                  <Button
                    type="button"
                    onClick={handleClearFilters}
                    variant="outline"
                    className="h-9 xl:h-10 w-full text-xs xl:text-sm"
                  >
                    <X className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </form>
      </Card>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <Badge variant="secondary" className="text-xs xl:text-sm px-2 xl:px-3 py-1">
              Search: {query}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setQuery('')}
              />
            </Badge>
          )}
          {selectedCity && selectedCity !== 'all' && (
            <Badge variant="secondary" className="text-xs xl:text-sm px-2 xl:px-3 py-1">
              City: {selectedCity}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setSelectedCity('all')}
              />
            </Badge>
          )}
          {selectedType && selectedType !== 'all' && (
            <Badge variant="secondary" className="text-xs xl:text-sm px-2 xl:px-3 py-1">
              Type: {selectedType.toUpperCase()}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setSelectedType('all')}
              />
            </Badge>
          )}
          {selectedPriceRange && selectedPriceRange !== 'all' && (
            <Badge variant="secondary" className="text-xs xl:text-sm px-2 xl:px-3 py-1">
              Price: {PRICE_RANGES.find((r) => r.value === selectedPriceRange)?.label}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setSelectedPriceRange('all')}
              />
            </Badge>
          )}
          {hasLocation && (
            <Badge variant="secondary" className="text-xs xl:text-sm px-2 xl:px-3 py-1">
              Near Me
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={handleClearLocation}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
