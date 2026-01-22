import React, { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UtensilsCrossed,
  Search,
  MapPin,
  Filter,
  X,
  Sparkles,
  Map,
  LayoutGrid,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Leaf,
  Drumstick,
  Salad,
  ChefHat,
  Navigation,
  Zap,
  Users,
  Calendar,
} from 'lucide-react';
import { messFacilityApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import MessCard from '@/components/mess/MessCard';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'map';
type SortBy = 'recommended' | 'distance' | 'price_low' | 'price_high' | 'rating' | 'popular';

interface FilterState {
  searchQuery: string;
  dietaryOptions: string[];
  cuisineTypes: string[];
  priceRange: [number, number];
  minRating: number;
  mealTypes: string[];
  availableNow: boolean;
  sortBy: SortBy;
}

const MessFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<MessFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dietaryOptions: [],
    cuisineTypes: [],
    priceRange: [0, 10000],
    minRating: 0,
    mealTypes: [],
    availableNow: false,
    sortBy: 'recommended',
  });

  useEffect(() => {
    loadFacilities();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const loadFacilities = async () => {
    setIsLoading(true);
    try {
      const data = await messFacilityApi.getMessFacilities();
      setFacilities(data);
    } catch (error) {
      console.error('Failed to load mess facilities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // AI-powered recommendation score
  const calculateRecommendationScore = (mess: MessFacility): number => {
    let score = 0;

    // Rating weight (40%)
    score += (mess.average_rating / 5) * 40;

    // Hygiene rating weight (30%)
    if (mess.hygiene_rating) {
      score += (mess.hygiene_rating / 5) * 30;
    }

    // Distance weight (20%)
    if (userLocation && mess.latitude && mess.longitude) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        mess.latitude,
        mess.longitude
      );
      score += Math.max(0, (5 - distance) / 5) * 20;
    }

    // Popularity weight (10%)
    score += Math.min((mess.total_reviews / 100) * 10, 10);

    return score;
  };

  // Filter and sort facilities
  const filteredFacilities = useMemo(() => {
    let filtered = [...facilities];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mess) =>
          mess.name.toLowerCase().includes(query) ||
          mess.location.toLowerCase().includes(query) ||
          mess.cuisine_types?.some((c) => c.toLowerCase().includes(query)) ||
          mess.dietary_options?.some((d) => d.toLowerCase().includes(query))
      );
    }

    // Dietary options filter
    if (filters.dietaryOptions.length > 0) {
      filtered = filtered.filter((mess) =>
        filters.dietaryOptions.some((option) => mess.dietary_options?.includes(option))
      );
    }

    // Cuisine types filter
    if (filters.cuisineTypes.length > 0) {
      filtered = filtered.filter((mess) =>
        filters.cuisineTypes.some((cuisine) => mess.cuisine_types?.includes(cuisine))
      );
    }

    // Price range filter
    filtered = filtered.filter((mess) => {
      const price = mess.monthly_price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((mess) => mess.average_rating >= filters.minRating);
    }

    // Meal types filter
    if (filters.mealTypes.length > 0) {
      filtered = filtered.filter((mess) =>
        filters.mealTypes.some((meal) => mess.meal_types?.includes(meal))
      );
    }

    // Available now filter
    if (filters.availableNow) {
      filtered = filtered.filter((mess) => mess.available);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'recommended':
        filtered.sort((a, b) => calculateRecommendationScore(b) - calculateRecommendationScore(a));
        break;
      case 'distance':
        if (userLocation) {
          filtered.sort((a, b) => {
            const distA =
              a.latitude && a.longitude
                ? calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude)
                : Number.POSITIVE_INFINITY;
            const distB =
              b.latitude && b.longitude
                ? calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
                : Number.POSITIVE_INFINITY;
            return distA - distB;
          });
        }
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.monthly_price || 0) - (b.monthly_price || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.monthly_price || 0) - (a.monthly_price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
    }

    return filtered;
  }, [facilities, filters, userLocation]);

  // Get unique dietary options and cuisine types
  const availableDietaryOptions = useMemo(
    () => Array.from(new Set(facilities.flatMap((m) => m.dietary_options || []))),
    [facilities]
  );

  const availableCuisineTypes = useMemo(
    () => Array.from(new Set(facilities.flatMap((m) => m.cuisine_types || []))),
    [facilities]
  );

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[filterType] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [filterType]: newArray };
    });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      dietaryOptions: [],
      cuisineTypes: [],
      priceRange: [0, 10000],
      minRating: 0,
      mealTypes: [],
      availableNow: false,
      sortBy: 'recommended',
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dietaryOptions.length > 0) count++;
    if (filters.cuisineTypes.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.minRating > 0) count++;
    if (filters.mealTypes.length > 0) count++;
    if (filters.availableNow) count++;
    return count;
  }, [filters]);

  return (
    <>
      <PageMeta
        title="Smart Mess Finder - AI-Powered Dining Solutions"
        description="Find the perfect mess with AI recommendations, smart filters, and real-time availability"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Hero Section with Search */}
        <div className="relative bg-gradient-to-r from-primary via-primary-light to-primary text-primary-foreground py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-secondary animate-pulse" />
              <span className="text-sm font-medium text-secondary">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold mb-3">Smart Mess Finder</h1>
            <p className="text-lg xl:text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              Discover the perfect dining experience with intelligent matching, real-time availability, and personalized recommendations
            </p>

            {/* Smart Search Bar */}
            <div className="max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, location, cuisine, or dietary preference..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-12 pr-4 h-14 text-base bg-background/95 backdrop-blur-sm border-0 shadow-lg"
                />
              </div>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Vegetarian', 'Non-Veg', 'Vegan', 'North Indian', 'South Indian'].map((chip) => (
                  <Badge
                    key={chip}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors px-3 py-1.5"
                    onClick={() => {
                      if (availableDietaryOptions.includes(chip)) {
                        toggleFilter('dietaryOptions', chip);
                      } else if (availableCuisineTypes.includes(chip)) {
                        toggleFilter('cuisineTypes', chip);
                      }
                    }}
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters({ ...filters, sortBy: value as SortBy })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Recommended
                      </div>
                    </SelectItem>
                    <SelectItem value="distance">
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4" />
                        Nearest First
                      </div>
                    </SelectItem>
                    <SelectItem value="price_low">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price: Low to High
                      </div>
                    </SelectItem>
                    <SelectItem value="price_high">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price: High to Low
                      </div>
                    </SelectItem>
                    <SelectItem value="rating">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Highest Rated
                      </div>
                    </SelectItem>
                    <SelectItem value="popular">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Most Popular
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredFacilities.length} {filteredFacilities.length === 1 ? 'mess' : 'messes'} found
                </span>
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="h-8 w-8 p-0"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Advanced Filter Panel */}
            {showFilters && (
              <Card className="w-80 shrink-0 h-fit sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Advanced Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Dietary Options */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Dietary Preferences
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {availableDietaryOptions.map((option) => (
                        <Badge
                          key={option}
                          variant={filters.dietaryOptions.includes(option) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleFilter('dietaryOptions', option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine Types */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-secondary" />
                      Cuisine Types
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {availableCuisineTypes.map((cuisine) => (
                        <Badge
                          key={cuisine}
                          variant={filters.cuisineTypes.includes(cuisine) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleFilter('cuisineTypes', cuisine)}
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Meal Types */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 text-primary" />
                      Meal Types
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                        <Badge
                          key={meal}
                          variant={filters.mealTypes.includes(meal) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleFilter('mealTypes', meal)}
                        >
                          {meal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Monthly Budget
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        min={0}
                        max={10000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Rating */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Minimum Rating
                    </Label>
                    <div className="flex gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <Badge
                          key={rating}
                          variant={filters.minRating === rating ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setFilters({ ...filters, minRating: rating })}
                        >
                          {rating === 0 ? 'Any' : `${rating}+`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Available Now */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="available-now" className="flex items-center gap-2 cursor-pointer">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Available Now
                    </Label>
                    <Switch
                      id="available-now"
                      checked={filters.availableNow}
                      onCheckedChange={(checked) => setFilters({ ...filters, availableNow: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-48 w-full bg-muted" />
                        <Skeleton className="h-6 w-3/4 bg-muted" />
                        <Skeleton className="h-4 w-full bg-muted" />
                        <Skeleton className="h-4 w-2/3 bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredFacilities.length > 0 ? (
                <div className="space-y-6">
                  {/* AI Recommendations Banner */}
                  {filters.sortBy === 'recommended' && (
                    <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">AI-Powered Recommendations</p>
                          <p className="text-sm text-muted-foreground">
                            Results ranked by rating, hygiene, distance, and popularity
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className={cn(
                    "grid gap-6",
                    showFilters ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 xl:grid-cols-3"
                  )}>
                    {filteredFacilities.map((facility, index) => (
                      <div key={facility.id} className="relative">
                        {filters.sortBy === 'recommended' && index < 3 && (
                          <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-secondary to-accent">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Top {index + 1}
                          </Badge>
                        )}
                        <MessCard
                          mess={facility}
                          showDistance={userLocation !== null}
                          userLocation={userLocation}
                          recommendationScore={
                            filters.sortBy === 'recommended' ? calculateRecommendationScore(facility) : undefined
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Mess Facilities Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search criteria to find more options.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessFacilities;
