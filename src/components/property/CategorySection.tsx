import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Home, Hotel, DoorOpen, ChevronRight } from 'lucide-react';
import { propertyApi } from '@/db/api';
import type { Property } from '@/types/types';

interface CategoryData {
  type: 'pg' | 'flat' | 'hostel' | 'room';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: CategoryData[] = [
  {
    type: 'pg',
    title: 'Paying Guest (PG)',
    description: 'Affordable shared accommodations with meals and amenities',
    icon: <Home className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600',
  },
  {
    type: 'flat',
    title: 'Flats & Apartments',
    description: 'Independent living spaces for individuals or families',
    icon: <Building2 className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600',
  },
  {
    type: 'hostel',
    title: 'Hostels',
    description: 'Budget-friendly dormitory-style accommodations',
    icon: <Hotel className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
  },
  {
    type: 'room',
    title: 'Rooms for Rent',
    description: 'Single rooms available in shared houses',
    icon: <DoorOpen className="h-8 w-8" />,
    color: 'from-orange-500 to-orange-600',
  },
];

const CategorySection: React.FC = () => {
  const [categoriesData, setCategoriesData] = useState<Record<string, Property[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.all(
        CATEGORIES.map(async (category) => {
          const properties = await propertyApi.getPropertiesByType(category.type, 4);
          return { type: category.type, properties };
        })
      );

      const data: Record<string, Property[]> = {};
      results.forEach((result) => {
        data[result.type] = result.properties;
      });

      setCategoriesData(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect accommodation type that suits your needs and budget
          </p>
        </div>

        <div className="space-y-16">
          {CATEGORIES.map((category) => (
            <div key={category.type} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <Link to={`/properties?type=${category.type}`}>
                  <Button variant="outline" className="gap-2">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="flex-shrink-0 w-[85vw] md:w-[calc(50%-0.75rem)] xl:w-[calc(25%-1.125rem)] snap-start">
                      <Skeleton className="h-48 w-full bg-muted" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4 bg-muted" />
                        <Skeleton className="h-4 w-full bg-muted" />
                        <Skeleton className="h-4 w-2/3 bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : categoriesData[category.type]?.length > 0 ? (
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  {categoriesData[category.type].map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-[85vw] md:w-[calc(50%-0.75rem)] xl:w-[calc(25%-1.125rem)] snap-start">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No {category.title.toLowerCase()} available at the moment
                  </p>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
