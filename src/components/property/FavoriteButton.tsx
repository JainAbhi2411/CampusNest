import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from 'miaoda-auth-react';
import { favoriteApi } from '@/db/api';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  propertyId: string;
  variant?: 'default' | 'icon';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  variant = 'default',
  className = '',
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, propertyId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    try {
      const status = await favoriteApi.isFavorite(user.id, propertyId);
      setIsFavorite(status);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(user.id, propertyId);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoriteApi.addFavorite(user.id, propertyId);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={className}
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`gap-2 ${className}`}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`}
      />
      {isFavorite ? 'Saved' : 'Save Property'}
    </Button>
  );
};

export default FavoriteButton;
