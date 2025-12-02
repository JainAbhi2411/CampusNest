import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'miaoda-auth-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Star,
  Users,
  Clock,
  Utensils,
  Phone,
  IndianRupee,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Leaf,
} from 'lucide-react';
import { toast } from 'sonner';
import { messFacilityApi, messReviewApi, profileApi } from '@/db/api';
import type { MessFacility, MessReviewWithUser, Profile } from '@/types/types';
import MessBookingForm from '@/components/mess/MessBookingForm';
import ImageGallery from '@/components/property/ImageGallery';

const MessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mess, setMess] = useState<MessFacility | null>(null);
  const [reviews, setReviews] = useState<MessReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      loadMess(id);
      loadReviews(id);
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

  const loadMess = async (messId: string) => {
    try {
      setLoading(true);
      const data = await messFacilityApi.getMessFacilityById(messId);
      if (data) {
        setMess(data);
      } else {
        toast.error('Mess facility not found');
        navigate('/mess');
      }
    } catch (error) {
      console.error('Error loading mess:', error);
      toast.error('Failed to load mess details');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (messId: string) => {
    try {
      setReviewsLoading(true);
      const data = await messReviewApi.getMessReviews(messId);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full mb-6" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="xl:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!mess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/mess')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mess Facilities
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <ImageGallery images={mess.images} title={mess.name} />

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{mess.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{mess.address}, {mess.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg">
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                    <span className="text-xl font-bold">{mess.average_rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({mess.total_reviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {mess.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-muted-foreground">{mess.description}</p>
                  </div>
                )}

                {mess.special_notes && (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <p className="text-sm">{mess.special_notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3">Meal Timings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mess.breakfast_timing && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <div className="font-medium">Breakfast</div>
                          <div className="text-sm text-muted-foreground">{mess.breakfast_timing}</div>
                          <div className="text-sm font-semibold mt-1">₹{mess.breakfast_price}</div>
                        </div>
                      </div>
                    )}
                    {mess.lunch_timing && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <div className="font-medium">Lunch</div>
                          <div className="text-sm text-muted-foreground">{mess.lunch_timing}</div>
                          <div className="text-sm font-semibold mt-1">₹{mess.lunch_price}</div>
                        </div>
                      </div>
                    )}
                    {mess.dinner_timing && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <div className="font-medium">Dinner</div>
                          <div className="text-sm text-muted-foreground">{mess.dinner_timing}</div>
                          <div className="text-sm font-semibold mt-1">₹{mess.dinner_price}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Pricing Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mess.trial_meal_price && (
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Trial Meal</div>
                        <div className="text-2xl font-bold mt-1">₹{mess.trial_meal_price}</div>
                        <div className="text-xs text-muted-foreground mt-1">One-time</div>
                      </div>
                    )}
                    {mess.weekly_price && (
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Weekly Plan</div>
                        <div className="text-2xl font-bold mt-1">₹{mess.weekly_price}</div>
                        <div className="text-xs text-muted-foreground mt-1">All meals for 7 days</div>
                      </div>
                    )}
                    {mess.monthly_price && (
                      <div className="p-4 border rounded-lg bg-secondary/10">
                        <Badge className="mb-2">Best Value</Badge>
                        <div className="text-sm text-muted-foreground">Monthly Plan</div>
                        <div className="text-2xl font-bold mt-1">₹{mess.monthly_price}</div>
                        <div className="text-xs text-muted-foreground mt-1">All meals for 30 days</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Dietary Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {mess.dietary_options?.map((option) => (
                      <Badge key={option} variant="secondary" className="gap-1">
                        <Leaf className="h-3 w-3" />
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Cuisine Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {mess.cuisine_types?.map((cuisine) => (
                      <Badge key={cuisine} variant="outline" className="gap-1">
                        <Utensils className="h-3 w-3" />
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>

                {mess.features && mess.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mess.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mess.capacity && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-secondary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Capacity</div>
                        <div className="font-semibold">{mess.capacity} people</div>
                      </div>
                    </div>
                  )}
                  {mess.hygiene_rating && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Star className="h-5 w-5 text-secondary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Hygiene Rating</div>
                        <div className="font-semibold">{mess.hygiene_rating.toFixed(1)} / 5.0</div>
                      </div>
                    </div>
                  )}
                </div>

                {mess.contact_phone && (
                  <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-secondary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Contact</div>
                      <div className="font-semibold">{mess.contact_phone}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold">
                              {review.user?.full_name || review.user?.username || 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 fill-secondary text-secondary" />
                              <span className="font-semibold">{review.rating}</span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                        {(review.food_quality_rating || review.hygiene_rating || review.service_rating) && (
                          <div className="flex gap-4 mt-2 text-sm">
                            {review.food_quality_rating && (
                              <span>Food: {review.food_quality_rating}/5</span>
                            )}
                            {review.hygiene_rating && (
                              <span>Hygiene: {review.hygiene_rating}/5</span>
                            )}
                            {review.service_rating && (
                              <span>Service: {review.service_rating}/5</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-20">
              {userProfile?.role !== 'admin' && (
                <MessBookingForm
                  messId={mess.id}
                  mess={mess}
                  onSuccess={() => loadMess(mess.id)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessDetails;
