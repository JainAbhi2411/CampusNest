import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  author?: string;
  role?: string;
}

interface Advanced3DSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
  type?: 'testimonial' | 'feature';
}

const Advanced3DSlider: React.FC<Advanced3DSliderProps> = ({
  slides,
  autoPlay = true,
  interval = 5000,
  type = 'testimonial',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex;
    const total = slides.length;
    
    let position = diff;
    if (diff > total / 2) position = diff - total;
    if (diff < -total / 2) position = diff + total;
    
    return position;
  };

  return (
    <div className="relative w-full h-[400px] xl:h-[500px] overflow-hidden">
      {/* 3D Perspective Container */}
      <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
        {/* Slides */}
        {slides.map((slide, index) => {
          const position = getSlidePosition(index);
          const isActive = position === 0;
          const isVisible = Math.abs(position) <= 2;

          if (!isVisible) return null;

          return (
            <div
              key={slide.id}
              className={`absolute top-1/2 left-1/2 w-[85%] xl:w-[60%] transition-all duration-600 ease-out ${
                isActive ? 'z-30' : position === -1 || position === 1 ? 'z-20' : 'z-10'
              }`}
              style={{
                transform: `
                  translate(-50%, -50%)
                  translateX(${position * 100}%)
                  translateZ(${isActive ? '0px' : '-200px'})
                  rotateY(${position * -15}deg)
                  scale(${isActive ? 1 : 0.85})
                `,
                opacity: isActive ? 1 : 0.5,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div
                className={`bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${
                  isActive ? 'hover:shadow-3xl' : ''
                }`}
              >
                {type === 'testimonial' ? (
                  <div className="p-8 xl:p-12">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Quote Icon */}
                      <div className="text-6xl text-secondary opacity-20">"</div>
                      
                      {/* Description */}
                      <p className="text-lg xl:text-xl text-foreground leading-relaxed max-w-2xl">
                        {slide.description}
                      </p>
                      
                      {/* Author */}
                      {slide.author && (
                        <div className="pt-6 border-t border-border w-full">
                          <p className="font-semibold text-lg text-foreground">{slide.author}</p>
                          {slide.role && (
                            <p className="text-sm text-muted-foreground mt-1">{slide.role}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col xl:flex-row">
                    {/* Image */}
                    {slide.image && (
                      <div className="w-full xl:w-1/2 h-48 xl:h-auto">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 p-8 xl:p-12 flex flex-col justify-center">
                      <h3 className="text-2xl xl:text-3xl font-bold mb-4 text-foreground">
                        {slide.title}
                      </h3>
                      <p className="text-base xl:text-lg text-muted-foreground leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 xl:left-8 -translate-y-1/2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={isAnimating}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute top-1/2 right-4 xl:right-8 -translate-y-1/2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={isAnimating}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-secondary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Advanced3DSlider;
