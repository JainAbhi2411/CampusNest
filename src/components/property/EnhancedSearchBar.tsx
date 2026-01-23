import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation, useSearchParams } from 'react-router-dom';
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
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AccommodationType } from '@/types/types';
import { getCurrentLocation, getGeolocationErrorMessage, isGeolocationSupported, isSecureContext } from '@/lib/geolocation';
import { useLocation } from '@/contexts/LocationContext';

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
  const routerLocation = useRouterLocation();
  const [searchParams] = useSearchParams();
  const { location: contextLocation, setLocation: setContextLocation, clearLocation: clearContextLocation, hasLocation: hasContextLocation } = useLocation();
  
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Sync with URL parameters on mount and when they change
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (searchQuery) setQuery(searchQuery);
    if (city) setSelectedCity(city);
    if (type) setSelectedType(type);
    if (minPrice && maxPrice) {
      setSelectedPriceRange(`${minPrice}-${maxPrice}`);
    }
    
    // If lat/lng in URL, set location context
    if (lat && lng) {
      setContextLocation({
        latitude: Number(lat),
        longitude: Number(lng),
        accuracy: undefined,
        timestamp: Date.now(),
      });
    }
  }, [searchParams, setContextLocation]);

  // Sync with context location
  useEffect(() => {
    if (contextLocation) {
      setSelectedCity(''); // Clear city when location is active
    }
  }, [contextLocation]);

  const handleGetCurrentLocation = async () => {
    // Pre-flight checks
    if (!isGeolocationSupported()) {
      toast.error('Location services are not supported by your browser', {
        description: 'Please use a modern browser like Chrome, Firefox, or Safari.',
        duration: 5000,
      });
      return;
    }

    if (!isSecureContext()) {
      toast.error('Secure connection required', {
        description: 'Location services require HTTPS. Please ensure you\'re accessing the site securely.',
        duration: 5000,
      });
      return;
    }

    setIsLoadingLocation(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Getting your location...', {
      description: 'This may take a few seconds',
    });

    try {
      const result = await getCurrentLocation({
        timeout: 15000, // 15 seconds timeout
        enableHighAccuracy: true,
        retryAttempts: 3,
        retryDelay: 1500,
      });

      toast.dismiss(loadingToast);

      if (result.success && result.latitude && result.longitude) {
        // Save to context
        setContextLocation({
          latitude: result.latitude,
          longitude: result.longitude,
          accuracy: result.accuracy,
          timestamp: Date.now(),
        });
        
        setSelectedCity('');
        
        toast.success('Location detected successfully!', {
          description: `Accuracy: ${result.accuracy ? Math.round(result.accuracy) + 'm' : 'Unknown'}`,
          duration: 3000,
        });

        // Auto-navigate to properties page if on homepage
        const isHomePage = routerLocation.pathname === '/';
        if (isHomePage) {
          const searchParams = new URLSearchParams();
          searchParams.set('lat', result.latitude.toString());
          searchParams.set('lng', result.longitude.toString());
          searchParams.set('distance', '10');
          
          // Add other filters if present
          if (query) searchParams.set('search', query);
          if (selectedType && selectedType !== 'all') searchParams.set('type', selectedType);
          if (selectedPriceRange && selectedPriceRange !== 'all') {
            const [min, max] = selectedPriceRange.split('-');
            searchParams.set('min_price', min);
            searchParams.set('max_price', max);
          }
          
          navigate(`/properties?${searchParams.toString()}`);
        } else {
          // On properties page, trigger search
          handleSearch();
        }
      } else {
        const errorMessage = getGeolocationErrorMessage(result.errorCode);
        
        toast.error('Unable to get your location', {
          description: errorMessage,
          duration: 6000,
          action: result.errorCode === 'PERMISSION_DENIED' ? {
            label: 'Help',
            onClick: () => {
              toast.info('How to enable location access', {
                description: 'Click the location icon in your browser\'s address bar and select "Allow".',
                duration: 8000,
              });
            },
          } : undefined,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Unexpected location error:', error);
      toast.error('An unexpected error occurred', {
        description: 'Please try again or search by city name.',
        duration: 5000,
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleClearLocation = () => {
    clearContextLocation();
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params: SearchParams = {
      query: query || undefined,
      city: selectedCity && selectedCity !== 'all' ? selectedCity : undefined,
      accommodationType: selectedType && selectedType !== 'all' ? (selectedType as AccommodationType) : undefined,
      priceRange: selectedPriceRange && selectedPriceRange !== 'all' ? selectedPriceRange : undefined,
    };

    if (hasContextLocation && contextLocation) {
      params.useLocation = true;
      params.latitude = contextLocation.latitude;
      params.longitude = contextLocation.longitude;
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
    
    // Clear URL params as well
    navigate(routerLocation.pathname, { replace: true });
  };

  const handleRemoveFilter = (filterType: 'query' | 'city' | 'type' | 'price' | 'location') => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    switch (filterType) {
      case 'query':
        setQuery('');
        newSearchParams.delete('search');
        break;
      case 'city':
        setSelectedCity('all');
        newSearchParams.delete('city');
        break;
      case 'type':
        setSelectedType('all');
        newSearchParams.delete('type');
        break;
      case 'price':
        setSelectedPriceRange('all');
        newSearchParams.delete('min_price');
        newSearchParams.delete('max_price');
        break;
      case 'location':
        handleClearLocation();
        newSearchParams.delete('lat');
        newSearchParams.delete('lng');
        newSearchParams.delete('distance');
        break;
    }
    
    // Update URL
    const queryString = newSearchParams.toString();
    navigate(queryString ? `${routerLocation.pathname}?${queryString}` : routerLocation.pathname, { replace: true });
  };

  const hasActiveFilters = query || (selectedCity && selectedCity !== 'all') || (selectedType && selectedType !== 'all') || (selectedPriceRange && selectedPriceRange !== 'all') || hasContextLocation;

  return (
    <div className={`space-y-3 xl:space-y-4 ${className}`}>
      <Card className="p-3 xl:p-4 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-3 xl:space-y-4">
          <div className="flex flex-col xl:flex-row gap-2 xl:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 xl:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 xl:h-5 xl:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Try: 'pg in mumbai', 'flat bangalore', 'hostel near delhi'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 xl:pl-10 h-10 xl:h-12 text-sm xl:text-base"
              />
            </div>

            <div className="flex gap-2">
              {hasContextLocation ? (
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
                  disabled={hasContextLocation}
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

      {/* Search Tips - Only show when no active filters */}
      {!hasActiveFilters && (
        <div className="flex items-start gap-2 text-xs xl:text-sm text-muted-foreground bg-muted/30 p-2 xl:p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 xl:h-5 xl:w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium mb-1">Smart Search Tips:</p>
            <ul className="space-y-0.5 text-xs">
              <li>• Use natural language: "pg in mumbai", "flat bangalore", "hostel near delhi"</li>
              <li>• Search by type: pg, flat, hostel, room</li>
              <li>• Search by city or use "Near Me" for location-based results</li>
            </ul>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Card className="p-3 xl:p-4 bg-muted/30 border-muted">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Active Filters</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 text-xs hover:bg-background"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {query && (
              <Badge 
                variant="secondary" 
                className="text-xs xl:text-sm px-3 py-1.5 bg-background hover:bg-background/80 border border-border shadow-sm"
              >
                <Search className="h-3 w-3 mr-1.5" />
                {query}
                <button
                  onClick={() => handleRemoveFilter('query')}
                  className="ml-2 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCity && selectedCity !== 'all' && (
              <Badge 
                variant="secondary" 
                className="text-xs xl:text-sm px-3 py-1.5 bg-background hover:bg-background/80 border border-border shadow-sm"
              >
                <MapPin className="h-3 w-3 mr-1.5" />
                {selectedCity}
                <button
                  onClick={() => handleRemoveFilter('city')}
                  className="ml-2 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedType && selectedType !== 'all' && (
              <Badge 
                variant="secondary" 
                className="text-xs xl:text-sm px-3 py-1.5 bg-background hover:bg-background/80 border border-border shadow-sm"
              >
                <Home className="h-3 w-3 mr-1.5" />
                {selectedType.toUpperCase()}
                <button
                  onClick={() => handleRemoveFilter('type')}
                  className="ml-2 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedPriceRange && selectedPriceRange !== 'all' && (
              <Badge 
                variant="secondary" 
                className="text-xs xl:text-sm px-3 py-1.5 bg-background hover:bg-background/80 border border-border shadow-sm"
              >
                <IndianRupee className="h-3 w-3 mr-1.5" />
                {PRICE_RANGES.find((r) => r.value === selectedPriceRange)?.label}
                <button
                  onClick={() => handleRemoveFilter('price')}
                  className="ml-2 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {hasContextLocation && (
              <Badge 
                variant="secondary" 
                className="text-xs xl:text-sm px-3 py-1.5 bg-background hover:bg-background/80 border border-border shadow-sm"
              >
                <Navigation className="h-3 w-3 mr-1.5" />
                Near Me
                <button
                  onClick={() => handleRemoveFilter('location')}
                  className="ml-2 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
