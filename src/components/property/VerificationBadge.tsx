import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  className, 
  size = 'md',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium',
        sizeClasses[size],
        className
      )}
    >
      <BadgeCheck className={cn(iconSizes[size], 'fill-primary text-primary-foreground')} />
      {showText && <span>Verified by RoomSaathi</span>}
    </div>
  );
};

export default VerificationBadge;
