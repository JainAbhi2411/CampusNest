import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, IndianRupee } from 'lucide-react';
import type { MessFacility } from '@/types/types';

interface MessCardProps {
  mess: MessFacility;
  compact?: boolean;
}

const MessCard: React.FC<MessCardProps> = ({ mess, compact = false }) => {
  const mainImage = mess.images?.[0] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80';

  return (
    <Link to={`/mess/${mess.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full group">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={mainImage}
            alt={mess.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {!mess.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs">Not Available</Badge>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="font-semibold text-xs">{mess.average_rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-3 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {mess.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{mess.location}</span>
          </div>

          {/* Dietary Options */}
          <div className="flex flex-wrap gap-1">
            {mess.dietary_options?.slice(0, 2).map((option) => (
              <Badge key={option} variant="secondary" className="text-[10px] px-1.5 py-0">
                {option}
              </Badge>
            ))}
            {mess.dietary_options && mess.dietary_options.length > 2 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{mess.dietary_options.length - 2}
              </Badge>
            )}
          </div>

          {/* Price Section */}
          <div className="pt-2 border-t flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <IndianRupee className="h-3.5 w-3.5 text-primary" />
              <span className="text-base font-bold text-primary">
                {mess.monthly_price?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-muted-foreground">/mo</span>
            </div>
            
            {mess.hygiene_rating && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-green-600/30 bg-green-50 dark:bg-green-950">
                <Star className="h-2.5 w-2.5 fill-green-600 text-green-600 mr-0.5" />
                <span className="text-green-700 dark:text-green-400">{mess.hygiene_rating.toFixed(1)}</span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MessCard;
