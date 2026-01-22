import React, { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
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
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { messFacilityApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import MessCard from '@/components/mess/MessCard';
import { cn } from '@/lib/utils';

type SortBy = 'name' | 'price_low' | 'price_high' | 'rating';

interface FilterState {
  searchQuery: string;
  dietaryOptions: string[];
  cuisineTypes: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: SortBy;
}

const MessFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<MessFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dietaryOptions: [],
    cuisineTypes: [],
    priceRange: [0, 10000],
    minRating: 0,
    sortBy: 'name',
  });

  useEffect(() => {
    loadFacilities();
  }, []);

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

    // Sorting
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
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
    }

    return filtered;
  }, [facilities, filters]);

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
      sortBy: 'name',
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dietaryOptions.length > 0) count++;
    if (filters.cuisineTypes.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  return (
    <>
      <PageMeta
        title="Mess Facilities - Find Quality Dining Options"
        description="Browse and filter mess facilities with comprehensive search and filtering options"
      />

      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-primary text-primary-foreground py-8 xl:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-3">
              <UtensilsCrossed className="h-8 w-8" />
              <h1 className="text-3xl xl:text-4xl font-bold">Mess Facilities</h1>
            </div>
            <p className="text-base xl:text-lg text-primary-foreground/90">
              Find affordable and quality dining options near your accommodation
            </p>
          </div>
        </div>

        {/* Search and Controls Bar */}
        <div className="sticky top-0 z-40 bg-background border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, location, cuisine, or dietary preference..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-10 h-11"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant={showFilters ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>

                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value as SortBy })}
                  >
                    <SelectTrigger className="w-44 h-9">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>

                <span className="text-sm text-muted-foreground">
                  {filteredFacilities.length} {filteredFacilities.length === 1 ? 'result' : 'results'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 xl:py-8">
          <div className="flex gap-6">
            {/* Filter Panel */}
            {showFilters && (
              <Card className="w-72 shrink-0 h-fit sticky top-28">
                <CardContent className="p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">Filters</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Dietary Options */}
                  {availableDietaryOptions.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Dietary Preferences</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableDietaryOptions.map((option) => (
                          <Badge
                            key={option}
                            variant={filters.dietaryOptions.includes(option) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleFilter('dietaryOptions', option)}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cuisine Types */}
                  {availableCuisineTypes.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cuisine Types</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableCuisineTypes.map((cuisine) => (
                          <Badge
                            key={cuisine}
                            variant={filters.cuisineTypes.includes(cuisine) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleFilter('cuisineTypes', cuisine)}
                          >
                            {cuisine}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Monthly Budget</Label>
                    <div className="space-y-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        min={0}
                        max={10000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Rating */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <div className="flex gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <Badge
                          key={rating}
                          variant={filters.minRating === rating ? 'default' : 'outline'}
                          className="cursor-pointer text-xs"
                          onClick={() => setFilters({ ...filters, minRating: rating })}
                        >
                          {rating === 0 ? 'Any' : `${rating}+`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="h-40 w-full bg-muted rounded-t-lg" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-3/4 bg-muted" />
                          <Skeleton className="h-3 w-full bg-muted" />
                          <Skeleton className="h-3 w-2/3 bg-muted" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredFacilities.length > 0 ? (
                <div className={cn(
                  "grid gap-4",
                  showFilters 
                    ? "grid-cols-2 xl:grid-cols-3" 
                    : "grid-cols-2 xl:grid-cols-4"
                )}>
                  {filteredFacilities.map((facility) => (
                    <MessCard key={facility.id} mess={facility} compact />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
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
