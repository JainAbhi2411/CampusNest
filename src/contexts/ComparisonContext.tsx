import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { comparisonApi } from '@/db/api';
import { useAuth } from 'miaoda-auth-react';
import { toast } from 'sonner';
import type { Property } from '@/types/types';

interface ComparisonContextType {
  comparisonProperties: Property[];
  comparisonCount: number;
  isInComparison: (propertyId: string) => boolean;
  addToComparison: (property: Property) => Promise<void>;
  removeFromComparison: (propertyId: string) => Promise<void>;
  clearComparison: () => Promise<void>;
  refreshComparison: () => Promise<void>;
  isLoading: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const refreshComparison = async () => {
      try {
        setIsLoading(true);
        const properties = await comparisonApi.getComparisonProperties(user?.id);
        setComparisonProperties(properties);
      } catch (error) {
        console.error('Failed to refresh comparison:', error);
      } finally {
        setIsLoading(false);
      }
    };

    refreshComparison();
  }, [user?.id]);

  const refreshComparison = async () => {
    try {
      setIsLoading(true);
      const properties = await comparisonApi.getComparisonProperties(user?.id);
      setComparisonProperties(properties);
    } catch (error) {
      console.error('Failed to refresh comparison:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInComparison = (propertyId: string): boolean => {
    return comparisonProperties.some(p => p.id === propertyId);
  };

  const addToComparison = async (property: Property) => {
    try {
      if (isInComparison(property.id)) {
        toast.info('Already in Comparison', {
          description: 'This property is already in your comparison list.',
        });
        return;
      }

      if (comparisonProperties.length >= 4) {
        toast.error('Comparison Limit Reached', {
          description: 'You can compare up to 4 properties at once. Remove one to add another.',
        });
        return;
      }

      await comparisonApi.addToComparison(property.id, user?.id);
      await refreshComparison();

      toast.success('Added to Comparison', {
        description: `${property.title} has been added to your comparison list.`,
      });
    } catch (error) {
      console.error('Failed to add to comparison:', error);
      toast.error('Error', {
        description: 'Failed to add property to comparison. Please try again.',
      });
    }
  };

  const removeFromComparison = async (propertyId: string) => {
    try {
      await comparisonApi.removeFromComparison(propertyId, user?.id);
      await refreshComparison();

      toast.success('Removed from Comparison', {
        description: 'Property has been removed from your comparison list.',
      });
    } catch (error) {
      console.error('Failed to remove from comparison:', error);
      toast.error('Error', {
        description: 'Failed to remove property from comparison. Please try again.',
      });
    }
  };

  const clearComparison = async () => {
    try {
      await comparisonApi.clearComparison(user?.id);
      setComparisonProperties([]);

      toast.success('Comparison Cleared', {
        description: 'All properties have been removed from comparison.',
      });
    } catch (error) {
      console.error('Failed to clear comparison:', error);
      toast.error('Error', {
        description: 'Failed to clear comparison. Please try again.',
      });
    }
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProperties,
        comparisonCount: comparisonProperties.length,
        isInComparison,
        addToComparison,
        removeFromComparison,
        clearComparison,
        refreshComparison,
        isLoading,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
