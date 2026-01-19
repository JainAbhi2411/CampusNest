import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { UtensilsCrossed } from 'lucide-react';
import { messFacilityApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import MessCard from '@/components/mess/MessCard';

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
        title="Mess Facilities - Roomsaathi"
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
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2 xl:space-y-3">
                  <Skeleton className="h-32 xl:h-48 w-full bg-muted" />
                  <Skeleton className="h-4 xl:h-6 w-3/4 bg-muted" />
                  <Skeleton className="h-3 xl:h-4 w-full bg-muted" />
                  <Skeleton className="h-3 xl:h-4 w-2/3 bg-muted" />
                </div>
              ))}
            </div>
          ) : facilities.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-6">
              {facilities.map((facility) => (
                <MessCard key={facility.id} mess={facility} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UtensilsCrossed className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Mess Facilities Found</h3>
              <p className="text-muted-foreground">
                Check back later for new mess facilities in your area.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessFacilities;
