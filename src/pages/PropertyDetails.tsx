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
  Eye,
  Star,
  Users,
  Wifi,
  Wind,
  Car,
  UtensilsCrossed,
  Video as VideoIcon,
} from 'lucide-react';
import ImageGallery from '@/components/property/ImageGallery';
import BookingForm from '@/components/property/BookingForm';
import FavoriteButton from '@/components/property/FavoriteButton';
import ShareButton from '@/components/property/ShareButton';
import ReviewSection from '@/components/property/ReviewSection';
import RentCalculator from '@/components/property/RentCalculator';
import Video from '@/components/ui/video';
import { propertyApi, propertyViewApi, profileApi, messFacilityApi } from '@/db/api';
import { useAuth } from 'miaoda-auth-react';
import type { PropertyWithDetails, Profile, MessFacility } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<PropertyWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [nearbyMess, setNearbyMess] = useState<MessFacility[]>([]);
  const [isLoadingMess, setIsLoadingMess] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      loadProperty(id);
      trackView(id);
    }
  }, [id]);

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const profile = await profileApi.getProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadProperty = async (propertyId: string) => {
    setIsLoading(true);
    try {
      const data = await propertyApi.getPropertyById(propertyId);
      setProperty(data);
      const count = await propertyViewApi.getPropertyViewCount(propertyId);
      setViewCount(count);
      
      // Load nearby mess facilities
      if (data?.city) {
        loadNearbyMess(data.city);
      }
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNearbyMess = async (city: string) => {
    setIsLoadingMess(true);
    try {
      const mess = await messFacilityApi.getNearbyMessFacilities(city, 4);
      setNearbyMess(mess);
    } catch (error) {
      console.error('Failed to load nearby mess:', error);
    } finally {
      setIsLoadingMess(false);
    }
  };

  const trackView = async (propertyId: string) => {
    try {
      await propertyViewApi.recordView(propertyId, user?.id);
    } catch (error) {
      console.error('Failed to track view:', error);
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
        title={`${property.title} - CampusNest`}
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
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.address}, {property.location}, {property.city}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        {property.average_rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{property.average_rating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-sm">
                              ({property.total_reviews} reviews)
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Eye className="h-4 w-4" />
                          <span>{viewCount} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={property.available ? 'default' : 'secondary'} className="bg-secondary">
                        {property.available ? 'Available' : 'Occupied'}
                      </Badge>
                      <Badge variant="outline">
                        {accommodationTypeLabels[property.accommodation_type]}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-6 w-6 text-secondary" />
                      <span className="text-3xl font-bold text-primary">
                        {property.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/ {property.price_period}</span>
                    </div>
                    <div className="flex gap-2">
                      <FavoriteButton propertyId={property.id} variant="icon" />
                      <ShareButton
                        propertyId={property.id}
                        propertyTitle={property.title}
                        variant="icon"
                      />
                    </div>
                  </div>

                  <ImageGallery
                    images={property.images || []}
                    virtualTourUrl={property.virtual_tour_url}
                    title={property.title}
                  />
                </CardContent>
              </Card>

              {property.video_url && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5" />
                      Property Video Tour
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden">
                      <Video
                        src={property.video_url}
                        poster={property.images?.[0] || ''}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {property.gender_preference && (
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-medium capitalize">{property.gender_preference}</p>
                        </div>
                      </div>
                    )}
                    {property.occupancy_type && (
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Occupancy</p>
                          <p className="font-medium capitalize">{property.occupancy_type}</p>
                        </div>
                      </div>
                    )}
                    {property.food_included !== undefined && (
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Food</p>
                          <p className="font-medium">{property.food_included ? 'Included' : 'Not Included'}</p>
                        </div>
                      </div>
                    )}
                    {property.wifi_available !== undefined && property.wifi_available && (
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">WiFi</p>
                          <p className="font-medium">Available</p>
                        </div>
                      </div>
                    )}
                    {property.ac_available !== undefined && property.ac_available && (
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">AC</p>
                          <p className="font-medium">Available</p>
                        </div>
                      </div>
                    )}
                    {property.parking_available !== undefined && property.parking_available && (
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Parking</p>
                          <p className="font-medium">Available</p>
                        </div>
                      </div>
                    )}
                  </div>
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

              {/* Nearby Mess Facilities Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5" />
                      Nearby Mess Facilities
                    </CardTitle>
                    {nearbyMess.length > 0 && (
                      <Link to="/mess">
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingMess ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-5 w-3/4 bg-muted" />
                          <Skeleton className="h-4 w-full bg-muted" />
                          <Skeleton className="h-4 w-1/2 bg-muted" />
                        </div>
                      ))}
                    </div>
                  ) : nearbyMess.length > 0 ? (
                    <div className="space-y-4">
                      {nearbyMess.map((mess) => (
                        <Link
                          key={mess.id}
                          to={`/mess/${mess.id}`}
                          className="block p-4 rounded-lg border border-border hover:border-primary transition-smooth hover:shadow-card"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-foreground hover:text-primary transition-smooth">
                                {mess.name}
                              </h4>
                              {mess.monthly_price && (
                                <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
                                  <IndianRupee className="h-3 w-3" />
                                  {mess.monthly_price}/mo
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="line-clamp-1">{mess.location}</span>
                            </div>

                            {mess.meal_types && mess.meal_types.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {mess.meal_types.slice(0, 3).map((type, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {type}
                                  </Badge>
                                ))}
                                {mess.meal_types.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{mess.meal_types.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {mess.cuisine_types && mess.cuisine_types.length > 0 && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                Cuisine: {mess.cuisine_types.join(', ')}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No mess facilities found in {property.city}
                      </p>
                      <Link to="/mess">
                        <Button variant="link" className="mt-2">
                          Browse All Mess Facilities
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-1">
              <div className="sticky top-20 space-y-6">
                {userProfile?.role !== 'admin' && (
                  <BookingForm
                    propertyId={property.id}
                    property={property}
                    onSuccess={() => loadProperty(property.id)}
                  />
                )}
                <RentCalculator property={property} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ReviewSection propertyId={property.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
