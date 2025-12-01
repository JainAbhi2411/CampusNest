import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UtensilsCrossed, MapPin, IndianRupee, Phone } from 'lucide-react';
import { messFacilityApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';

const MessFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<MessFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <>
      <PageMeta
        title="Mess Facilities - StayNearby"
        description="Browse nearby mess and dining facilities for students"
      />

      <div className="min-h-screen bg-muted/30">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl xl:text-4xl font-bold mb-2">Mess Facilities</h1>
            <p className="text-lg text-primary-foreground/90">
              Find affordable and quality dining options near your accommodation
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
          ) : facilities.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <Card key={facility.id} className="shadow-card hover:shadow-lg transition-smooth">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={
                        facility.images && facility.images.length > 0
                          ? facility.images[0]
                          : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
                      }
                      alt={facility.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-secondary" />
                      {facility.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">
                        {facility.location}, {facility.city}
                      </span>
                    </div>

                    {facility.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {facility.description}
                      </p>
                    )}

                    {facility.meal_types && facility.meal_types.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {facility.meal_types.map((type, index) => (
                          <Badge key={index} variant="outline">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t">
                      {facility.price_per_meal && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Per Meal</span>
                          <div className="flex items-center gap-1 font-semibold">
                            <IndianRupee className="h-4 w-4" />
                            {facility.price_per_meal}
                          </div>
                        </div>
                      )}
                      {facility.monthly_price && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Monthly</span>
                          <div className="flex items-center gap-1 font-semibold text-secondary">
                            <IndianRupee className="h-4 w-4" />
                            {facility.monthly_price}
                          </div>
                        </div>
                      )}
                    </div>

                    {facility.contact_phone && (
                      <div className="flex items-center gap-2 text-sm pt-2 border-t">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{facility.contact_phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UtensilsCrossed className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No mess facilities found</h3>
              <p className="text-muted-foreground">
                Check back later for dining options near your location
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessFacilities;
