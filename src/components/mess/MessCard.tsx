import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Utensils, IndianRupee, Navigation, Sparkles, Clock, Zap } from 'lucide-react';
import type { MessFacility } from '@/types/types';
import { cn } from '@/lib/utils';

interface MessCardProps {
  mess: MessFacility;
  showDistance?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  recommendationScore?: number;
}

const MessCard: React.FC<MessCardProps> = ({ mess, showDistance, userLocation, recommendationScore }) => {
  const mainImage = mess.images?.[0] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80';

  // Calculate distance if user location is available
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance =
    showDistance && userLocation && mess.latitude && mess.longitude
      ? calculateDistance(userLocation.lat, userLocation.lng, mess.latitude, mess.longitude)
      : null;

  // Check if currently serving
  const isCurrentlyServing = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const checkTiming = (timing: string | null) => {
      if (!timing) return false;
      const [start, end] = timing.split('-').map((t) => {
        const [h, m] = t.trim().split(':').map(Number);
        return h * 60 + m;
      });
      return currentTime >= start && currentTime <= end;
    };

    return (
      checkTiming(mess.breakfast_timing) ||
      checkTiming(mess.lunch_timing) ||
      checkTiming(mess.dinner_timing)
    );
  };

  const servingNow = isCurrentlyServing();

  return (
    <Link to={`/mess/${mess.id}`}>
      <Card className={cn(
        "overflow-hidden hover:shadow-xl transition-all duration-300 h-full group",
        recommendationScore && recommendationScore > 70 && "ring-2 ring-primary/20"
      )}>
        <div className="relative h-32 xl:h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={mess.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {!mess.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="destructive" className="text-xs xl:text-lg">Not Available</Badge>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {servingNow && mess.available && (
              <Badge className="bg-green-600 hover:bg-green-700 gap-1 text-xs">
                <Zap className="h-3 w-3" />
                Serving Now
              </Badge>
            )}
            {distance !== null && distance < 2 && (
              <Badge className="bg-blue-600 hover:bg-blue-700 gap-1 text-xs">
                <Navigation className="h-3 w-3" />
                Nearby
              </Badge>
            )}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
            <Star className="h-3 w-3 xl:h-4 xl:w-4 fill-secondary text-secondary" />
            <span className="font-semibold text-xs xl:text-base">{mess.average_rating.toFixed(1)}</span>
            <span className="text-[10px] xl:text-xs text-muted-foreground">({mess.total_reviews})</span>
          </div>

          {/* Distance Badge */}
          {distance !== null && (
            <div className="absolute bottom-2 left-2 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <Navigation className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">{distance.toFixed(1)} km</span>
            </div>
          )}

          {/* Recommendation Score */}
          {recommendationScore && recommendationScore > 70 && (
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-secondary to-accent text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">{Math.round(recommendationScore)}% Match</span>
            </div>
          )}
        </div>

        <CardContent className="p-3 xl:p-5 space-y-2 xl:space-y-3">
          <div>
            <h3 className="font-semibold text-sm xl:text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {mess.name}
            </h3>
            <div className="flex items-center gap-1 text-xs xl:text-sm text-muted-foreground mt-0.5 xl:mt-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">{mess.location}, {mess.city}</span>
            </div>
          </div>

          {mess.description && (
            <p className="text-xs xl:text-sm text-muted-foreground line-clamp-2 hidden xl:block">
              {mess.description}
            </p>
          )}

          {/* Meal Timings */}
          <div className="flex flex-wrap gap-1 text-[10px] xl:text-xs text-muted-foreground">
            {mess.breakfast_timing && (
              <div className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                <span>B: {mess.breakfast_timing}</span>
              </div>
            )}
            {mess.lunch_timing && (
              <div className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                <span>L: {mess.lunch_timing}</span>
              </div>
            )}
            {mess.dinner_timing && (
              <div className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                <span>D: {mess.dinner_timing}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 xl:gap-2">
            {mess.dietary_options?.slice(0, 3).map((option) => (
              <Badge key={option} variant="secondary" className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                {option}
              </Badge>
            ))}
            {mess.dietary_options?.length > 3 && (
              <Badge variant="secondary" className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                +{mess.dietary_options.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1 xl:gap-2">
            {mess.cuisine_types?.slice(0, 2).map((cuisine) => (
              <Badge key={cuisine} variant="outline" className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                <Utensils className="h-2.5 w-2.5 xl:h-3 xl:w-3 mr-0.5 xl:mr-1" />
                {cuisine}
              </Badge>
            ))}
            {mess.cuisine_types?.length > 2 && (
              <Badge variant="outline" className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                +{mess.cuisine_types.length - 2}
              </Badge>
            )}
          </div>

          {mess.capacity && (
            <div className="flex items-center gap-1 text-xs xl:text-sm text-muted-foreground">
              <Users className="h-3 w-3 xl:h-4 xl:w-4" />
              <span>Capacity: {mess.capacity}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 xl:p-5 pt-0 flex justify-between items-center border-t bg-muted/30">
          <div>
            <div className="flex items-center gap-0.5 xl:gap-1">
              <IndianRupee className="h-4 w-4 xl:h-5 xl:w-5 text-primary" />
              <span className="text-base xl:text-2xl font-bold text-primary">
                {mess.monthly_price?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs xl:text-sm text-muted-foreground">/mo</span>
            </div>
            {mess.trial_meal_price && (
              <div className="text-[10px] xl:text-xs text-muted-foreground mt-0.5">
                Trial meal: ₹{mess.trial_meal_price}
              </div>
            )}
          </div>
          {mess.hygiene_rating && (
            <Badge variant="outline" className="gap-1 text-[10px] xl:text-xs px-2 py-1 border-green-600/30 bg-green-50 dark:bg-green-950">
              <Star className="h-3 w-3 fill-green-600 text-green-600" />
              <span className="hidden xl:inline text-green-700 dark:text-green-400">Hygiene </span>
              <span className="font-semibold text-green-700 dark:text-green-400">{mess.hygiene_rating.toFixed(1)}</span>
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MessCard;
