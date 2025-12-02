import React from 'react';
import { Link } from 'react-router-dom';
import { X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/contexts/ComparisonContext';

export default function ComparisonBar() {
  const { comparisonCount, comparisonProperties, removeFromComparison } = useComparison();

  if (comparisonCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          <span className="font-medium">
            {comparisonCount} {comparisonCount === 1 ? 'Property' : 'Properties'} Selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {comparisonProperties.slice(0, 3).map((property) => (
            <div
              key={property.id}
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground/20">
                <img
                  src={property.images?.[0] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeFromComparison(property.id)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from comparison"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {comparisonCount > 3 && (
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-medium">
              +{comparisonCount - 3}
            </div>
          )}
        </div>

        <Link to="/compare">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full"
          >
            Compare Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
