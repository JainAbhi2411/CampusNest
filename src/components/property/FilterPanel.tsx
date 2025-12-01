import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import type { SearchFilters, AccommodationType } from '@/types/types';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset }) => {
  const handleAccommodationTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      accommodation_type: value === 'all' ? undefined : (value as AccommodationType),
    });
  };

  const handleAvailabilityChange = (value: string) => {
    onFilterChange({
      ...filters,
      available: value === 'all' ? undefined : value === 'available',
    });
  };

  const handleMinPriceChange = (value: string) => {
    const numValue = value ? Number(value) : undefined;
    onFilterChange({
      ...filters,
      min_price: numValue,
    });
  };

  const handleMaxPriceChange = (value: string) => {
    const numValue = value ? Number(value) : undefined;
    onFilterChange({
      ...filters,
      max_price: numValue,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accommodation-type">Accommodation Type</Label>
          <Select
            value={filters.accommodation_type || 'all'}
            onValueChange={handleAccommodationTypeChange}
          >
            <SelectTrigger id="accommodation-type">
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
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={
              filters.available === undefined
                ? 'all'
                : filters.available
                  ? 'available'
                  : 'occupied'
            }
            onValueChange={handleAvailabilityChange}
          >
            <SelectTrigger id="availability">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.min_price || ''}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.max_price || ''}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              min="0"
            />
          </div>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
