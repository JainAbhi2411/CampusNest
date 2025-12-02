import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, Check, Minus, TrendingUp, MapPin, Star, Wifi, Car, Utensils, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useComparison } from '@/contexts/ComparisonContext';
import { comparisonApi } from '@/db/api';
import type { ComparisonScore } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';

export default function Compare() {
  const { comparisonProperties, removeFromComparison, clearComparison, comparisonCount } = useComparison();
  const [scores, setScores] = useState<ComparisonScore[]>([]);

  useEffect(() => {
    if (comparisonProperties.length > 0) {
      const calculatedScores = comparisonApi.calculateComparisonScores(comparisonProperties);
      setScores(calculatedScores);
    }
  }, [comparisonProperties]);

  const getScoreForProperty = (propertyId: string) => {
    return scores.find(s => s.property_id === propertyId);
  };

  const getBestValue = () => {
    if (scores.length === 0) return null;
    const maxScore = Math.max(...scores.map(s => s.total_score));
    return scores.find(s => s.total_score === maxScore);
  };

  const bestValue = getBestValue();

  if (comparisonCount === 0) {
    return (
      <>
        <PageMeta 
          title="Compare Properties - CampusNest" 
          description="Compare student accommodations side by side to find the perfect place for you"
        />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">No Properties to Compare</h1>
              <p className="text-muted-foreground mb-8">
                Start adding properties to your comparison list to see them side by side.
              </p>
              <Link to="/properties">
                <Button size="lg">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta 
        title="Compare Properties - CampusNest" 
        description="Compare student accommodations side by side to find the perfect place for you"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/properties">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Compare Properties</h1>
              <p className="text-muted-foreground">
                Comparing {comparisonCount} {comparisonCount === 1 ? 'property' : 'properties'}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${comparisonProperties.length}, minmax(300px, 1fr))` }}>
              {comparisonProperties.map((property) => {
                const score = getScoreForProperty(property.id);
                const isBestValue = bestValue?.property_id === property.id;

                return (
                  <Card key={property.id} className={isBestValue ? 'border-primary border-2' : ''}>
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={property.images?.[0] || '/placeholder-property.jpg'}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <button
                          onClick={() => removeFromComparison(property.id)}
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                          aria-label="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {isBestValue && (
                          <Badge className="absolute top-2 left-2 bg-primary">
                            Best Value
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{property.location}</span>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">₹{property.price.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">/{property.price_period}</span>
                        </div>

                        {score && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">Overall Score</span>
                                <span className="text-sm font-bold">{score.total_score}/100</span>
                              </div>
                              <Progress value={score.total_score} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-muted-foreground">Price</span>
                                  <span className="font-medium">{score.price_score}</span>
                                </div>
                                <Progress value={score.price_score} className="h-1" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-muted-foreground">Rating</span>
                                  <span className="font-medium">{score.rating_score}</span>
                                </div>
                                <Progress value={score.rating_score} className="h-1" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-muted-foreground">Amenities</span>
                                  <span className="font-medium">{score.amenities_score}</span>
                                </div>
                                <Progress value={score.amenities_score} className="h-1" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-muted-foreground">Location</span>
                                  <span className="font-medium">{score.location_score}</span>
                                </div>
                                <Progress value={score.location_score} className="h-1" />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Type</span>
                            <Badge variant="secondary">{property.accommodation_type.toUpperCase()}</Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rating</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="font-medium">{property.average_rating.toFixed(1)}</span>
                              <span className="text-muted-foreground">({property.total_reviews})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Gender</span>
                            <span className="font-medium capitalize">{property.gender_preference}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Occupancy</span>
                            <span className="font-medium capitalize">{property.occupancy_type}</span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium text-sm mb-3">Amenities</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Wifi className={`h-4 w-4 ${property.wifi_available ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={property.wifi_available ? '' : 'text-muted-foreground'}>WiFi</span>
                              {property.wifi_available ? <Check className="h-3 w-3 text-primary ml-auto" /> : <Minus className="h-3 w-3 text-muted-foreground ml-auto" />}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Wind className={`h-4 w-4 ${property.ac_available ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={property.ac_available ? '' : 'text-muted-foreground'}>AC</span>
                              {property.ac_available ? <Check className="h-3 w-3 text-primary ml-auto" /> : <Minus className="h-3 w-3 text-muted-foreground ml-auto" />}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Car className={`h-4 w-4 ${property.parking_available ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={property.parking_available ? '' : 'text-muted-foreground'}>Parking</span>
                              {property.parking_available ? <Check className="h-3 w-3 text-primary ml-auto" /> : <Minus className="h-3 w-3 text-muted-foreground ml-auto" />}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Utensils className={`h-4 w-4 ${property.food_included ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={property.food_included ? '' : 'text-muted-foreground'}>Food</span>
                              {property.food_included ? <Check className="h-3 w-3 text-primary ml-auto" /> : <Minus className="h-3 w-3 text-muted-foreground ml-auto" />}
                            </div>
                          </div>
                        </div>

                        <Link to={`/property/${property.id}`}>
                          <Button className="w-full" variant={isBestValue ? 'default' : 'outline'}>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {comparisonCount < 4 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              You can compare up to 4 properties. Add {4 - comparisonCount} more to get better insights.
            </p>
            <Link to="/properties">
              <Button variant="outline">
                Add More Properties
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
