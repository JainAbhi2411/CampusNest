import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  IndianRupee,
  Home,
  CheckCircle2,
  ArrowLeft,
  Phone,
  Mail,
} from 'lucide-react';
import ImageGallery from '@/components/property/ImageGallery';
import BookingForm from '@/components/property/BookingForm';
import { propertyApi } from '@/db/api';
import type { PropertyWithDetails } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    setIsLoading(true);
    try {
      const data = await propertyApi.getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const accommodationTypeLabels = {
    pg: 'Paying Guest (PG)',
    flat: 'Flat',
    hostel: 'Hostel',
    room: 'Room for Rent',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-6 bg-muted" />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full bg-muted" />
              <Skeleton className="h-64 w-full bg-muted" />
            </div>
            <div className="xl:col-span-1">
              <Skeleton className="h-96 w-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Property not found</h2>
          <p className="text-muted-foreground mb-4">
            The property you're looking for doesn't exist or has been removed
          </p>
          <Link to="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${property.title} - StayNearby`}
        description={property.description || `${accommodationTypeLabels[property.accommodation_type]} in ${property.city}`}
      />

      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/properties">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.address}, {property.location}, {property.city}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={property.available ? 'default' : 'secondary'} className="bg-secondary">
                        {property.available ? 'Available' : 'Occupied'}
                      </Badge>
                      <Badge variant="outline">
                        {accommodationTypeLabels[property.accommodation_type]}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <IndianRupee className="h-6 w-6 text-secondary" />
                    <span className="text-3xl font-bold text-primary">
                      {property.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/ {property.price_period}</span>
                  </div>

                  <ImageGallery
                    images={property.images || []}
                    virtualTourUrl={property.virtual_tour_url}
                    title={property.title}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || 'No description available for this property.'}
                  </p>
                </CardContent>
              </Card>

              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {property.owner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <span>Owner: {property.owner.full_name || property.owner.username}</span>
                    </div>
                    {property.owner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{property.owner.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="xl:col-span-1">
              <div className="sticky top-20">
                <BookingForm
                  propertyId={property.id}
                  onSuccess={() => loadProperty(property.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
