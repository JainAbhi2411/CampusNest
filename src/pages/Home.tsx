import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search, Calendar, Shield, ArrowRight } from 'lucide-react';
import EnhancedSearchBar from '@/components/property/EnhancedSearchBar';
import PropertyCard from '@/components/property/PropertyCard';
import { propertyApi } from '@/db/api';
import type { Property } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import { Skeleton } from '@/components/ui/skeleton';

const Home: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const properties = await propertyApi.getProperties({ available: true }, 1, 6);
      setFeaturedProperties(properties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find accommodations near your campus with our powerful search filters',
    },
    {
      icon: Building2,
      title: 'Verified Properties',
      description: 'All properties are verified to ensure quality and safety',
    },
    {
      icon: Calendar,
      title: 'Quick Booking',
      description: 'Schedule visits or book rooms instantly with our simple booking system',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with industry-standard security',
    },
  ];

  return (
    <>
      <PageMeta
        title="StayNearby - Find Your Perfect Student Accommodation"
        description="Search and book student accommodations including PGs, flats, hostels, and rooms near your campus"
      />

      <div className="min-h-screen">
        <section className="bg-primary text-primary-foreground py-20 xl:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl xl:text-6xl font-bold mb-6">
                Find Your Perfect Student Accommodation
              </h1>
              <p className="text-lg xl:text-xl mb-8 text-primary-foreground/90">
                Search from thousands of verified PGs, flats, hostels, and rooms near your campus
              </p>
              <div className="max-w-4xl mx-auto">
                <EnhancedSearchBar showQuickFilters={true} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 xl:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">Why Choose StayNearby?</h2>
              <p className="text-muted-foreground text-lg">
                We make finding student accommodation simple and hassle-free
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="shadow-card hover:shadow-lg transition-smooth">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                        <Icon className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 xl:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl xl:text-4xl font-bold mb-2">Featured Properties</h2>
                <p className="text-muted-foreground text-lg">
                  Explore our handpicked accommodations
                </p>
              </div>
              <Link to="/properties">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

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
            ) : featuredProperties.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No properties available at the moment</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 xl:py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl xl:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Stay?
            </h2>
            <p className="text-lg xl:text-xl mb-8 text-primary-foreground/90">
              Join thousands of students who have found their ideal accommodation through StayNearby
            </p>
            <Link to="/properties">
              <Button size="lg" variant="secondary">
                Start Searching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
