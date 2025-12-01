import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, IndianRupee, Eye } from 'lucide-react';
import type { Property } from '@/types/types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const accommodationTypeLabels = {
    pg: 'PG',
    flat: 'Flat',
    hostel: 'Hostel',
    room: 'Room',
  };

  const mainImage = Array.isArray(property.images) && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-lg transition-smooth group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={property.available ? 'default' : 'secondary'} className="bg-secondary">
            {property.available ? 'Available' : 'Occupied'}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-background/90">
            {accommodationTypeLabels[property.accommodation_type]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{property.location}, {property.city}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {property.description || 'No description available'}
        </p>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-secondary" />
          <span className="text-xl font-bold text-primary">
            {property.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/ {property.price_period}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/property/${property.id}`} className="w-full">
          <Button className="w-full" variant="default">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
