import React, { useRef, useState, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  size = 'lg',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="relative inline-block">
      {/* Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg blur-xl opacity-50 transition-opacity duration-300"
          style={{
            background: variant === 'secondary' 
              ? 'hsl(var(--secondary))' 
              : 'hsl(var(--primary))',
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        />
      )}

      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        className={`relative transition-transform duration-200 ease-out ${className}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
};

export default MagneticButton;
