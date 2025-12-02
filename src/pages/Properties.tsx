import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import AdvancedFilterPanel from '@/components/property/AdvancedFilterPanel';
import EnhancedSearchBar from '@/components/property/EnhancedSearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { propertyApi } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { Property, SearchFilters } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import { useToast } from '@/hooks/use-toast';

const Properties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { toast } = useToast();
  const pageSize = 12;

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const distance = searchParams.get('distance');

    const urlFilters: SearchFilters = {};
    if (searchQuery) urlFilters.search_query = searchQuery;
    if (city) urlFilters.city = city;
    if (type) urlFilters.accommodation_type = type as any;
    if (minPrice) urlFilters.min_price = Number(minPrice);
    if (maxPrice) urlFilters.max_price = Number(maxPrice);
    if (lat && lng) {
      urlFilters.latitude = Number(lat);
      urlFilters.longitude = Number(lng);
      urlFilters.max_distance = distance ? Number(distance) : 10;
    }

    setFilters(urlFilters);
  }, [searchParams]);

  useEffect(() => {
    loadProperties();
  }, [filters, currentPage]);

   // Real-time subscription for property changes
  useEffect(() => {
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Property change detected:', payload);
          
          // Show toast notification based on event type
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Property Added',
              description: 'A new property has been added. Refreshing list...',
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Property Updated',
              description: 'A property has been updated. Refreshing list...',
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Property Deleted',
              description: 'A property has been removed. Refreshing list...',
            });
          }
          
          // Reload properties after a short delay
          setTimeout(() => {
            loadProperties();
          }, 500);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters, currentPage]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const data = await propertyApi.getProperties(filters, currentPage, pageSize);
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadProperties();
      toast({
        title: 'Refreshed',
        description: 'Property list has been updated.',
      });
    } catch (error) {
      console.error('Failed to refresh properties:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL to reflect current filters
    const params = new URLSearchParams();
    if (newFilters.search_query) params.set('search', newFilters.search_query);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.accommodation_type) params.set('type', newFilters.accommodation_type);
    if (newFilters.min_price !== undefined) params.set('min_price', newFilters.min_price.toString());
    if (newFilters.max_price !== undefined) params.set('max_price', newFilters.max_price.toString());
    if (newFilters.latitude && newFilters.longitude) {
      params.set('lat', newFilters.latitude.toString());
      params.set('lng', newFilters.longitude.toString());
      if (newFilters.max_distance) params.set('distance', newFilters.max_distance.toString());
    }
    
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageMeta
        title="Browse Properties - CampusNest"
        description="Browse and search student accommodations including PGs, flats, hostels, and rooms"
      />

      <div className="min-h-screen bg-muted/30">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl xl:text-4xl font-bold mb-6">Browse Properties</h1>
            <EnhancedSearchBar showQuickFilters={false} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-1">
              <div className="sticky top-20">
                <AdvancedFilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </div>

            <div className="xl:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <Skeleton className="h-48 w-full bg-muted" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4 bg-muted" />
                        <Skeleton className="h-4 w-full bg-muted" />
                        <Skeleton className="h-4 w-2/3 bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : properties.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-muted-foreground">
                      Showing {properties.length} properties
                    </div>
                    <Button
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {properties.length === pageSize && (
                    <div className="flex justify-center gap-4 mt-8">
                      <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <div className="flex items-center px-4">
                        Page {currentPage}
                      </div>
                      <Button onClick={handleNextPage} variant="outline">
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={handleResetFilters} variant="outline">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Properties;
