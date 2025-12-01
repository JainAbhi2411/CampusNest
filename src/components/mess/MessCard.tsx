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
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={mess.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          {!mess.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">Not Available</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="font-semibold">{mess.average_rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({mess.total_reviews})</span>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{mess.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{mess.location}, {mess.city}</span>
            </div>
          </div>

          {mess.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mess.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {mess.dietary_options?.slice(0, 2).map((option) => (
              <Badge key={option} variant="secondary" className="text-xs">
                {option}
              </Badge>
            ))}
            {mess.dietary_options?.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{mess.dietary_options.length - 2} more
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {mess.cuisine_types?.slice(0, 2).map((cuisine) => (
              <Badge key={cuisine} variant="outline" className="text-xs">
                <Utensils className="h-3 w-3 mr-1" />
                {cuisine}
              </Badge>
            ))}
          </div>

          {mess.capacity && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Capacity: {mess.capacity} people</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              <span className="text-xl font-bold">
                {mess.monthly_price?.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            {mess.trial_meal_price && (
              <div className="text-xs text-muted-foreground">
                Trial: ₹{mess.trial_meal_price}
              </div>
            )}
          </div>
          {mess.hygiene_rating && (
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-secondary text-secondary" />
              Hygiene {mess.hygiene_rating.toFixed(1)}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MessCard;
