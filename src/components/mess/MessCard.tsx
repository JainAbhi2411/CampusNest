import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Utensils, IndianRupee } from 'lucide-react';
import type { MessFacility } from '@/types/types';

interface MessCardProps {
  mess: MessFacility;
}

const MessCard: React.FC<MessCardProps> = ({ mess }) => {
  const mainImage = mess.images?.[0] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80';

  return (
    <Link to={`/mess/${mess.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative h-32 xl:h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={mess.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          {!mess.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs xl:text-lg">Not Available</Badge>
            </div>
          )}
          <div className="absolute top-1 xl:top-2 right-1 xl:right-2 bg-background/90 backdrop-blur-sm px-1.5 xl:px-2 py-0.5 xl:py-1 rounded-md flex items-center gap-0.5 xl:gap-1">
            <Star className="h-3 w-3 xl:h-4 xl:w-4 fill-secondary text-secondary" />
            <span className="font-semibold text-xs xl:text-base">{mess.average_rating.toFixed(1)}</span>
            <span className="text-[10px] xl:text-xs text-muted-foreground">({mess.total_reviews})</span>
          </div>
        </div>

        <CardContent className="p-2 xl:p-4 space-y-2 xl:space-y-3">
          <div>
            <h3 className="font-semibold text-sm xl:text-lg line-clamp-1">{mess.name}</h3>
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

          <div className="flex flex-wrap gap-1 xl:gap-2">
            {mess.dietary_options?.slice(0, 2).map((option) => (
              <Badge key={option} variant="secondary" className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                {option}
              </Badge>
            ))}
            {mess.dietary_options?.length > 2 && (
              <Badge variant="secondary" className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                +{mess.dietary_options.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1 xl:gap-2 hidden xl:flex">
            {mess.cuisine_types?.slice(0, 2).map((cuisine) => (
              <Badge key={cuisine} variant="outline" className="text-xs">
                <Utensils className="h-3 w-3 mr-1" />
                {cuisine}
              </Badge>
            ))}
          </div>

          {mess.capacity && (
            <div className="flex items-center gap-1 text-xs xl:text-sm text-muted-foreground hidden xl:flex">
              <Users className="h-3 w-3 xl:h-4 xl:w-4" />
              <span>Capacity: {mess.capacity} people</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-2 xl:p-4 xl:pt-0 pt-0 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-0.5 xl:gap-1">
              <IndianRupee className="h-3 w-3 xl:h-4 xl:w-4" />
              <span className="text-sm xl:text-xl font-bold">
                {mess.monthly_price?.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] xl:text-sm text-muted-foreground">/mo</span>
            </div>
            {mess.trial_meal_price && (
              <div className="text-[10px] xl:text-xs text-muted-foreground">
                Trial: ₹{mess.trial_meal_price}
              </div>
            )}
          </div>
          {mess.hygiene_rating && (
            <Badge variant="outline" className="gap-0.5 xl:gap-1 text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
              <Star className="h-2.5 w-2.5 xl:h-3 xl:w-3 fill-secondary text-secondary" />
              <span className="hidden xl:inline">Hygiene </span>{mess.hygiene_rating.toFixed(1)}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MessCard;
