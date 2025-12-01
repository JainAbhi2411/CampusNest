import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Maximize2, View } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  virtualTourUrl?: string | null;
  title: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, virtualTourUrl, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [show360, setShow360] = useState(false);

  const hasImages = images && images.length > 0;
  const displayImages = hasImages ? images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative h-96 xl:h-[500px] rounded-lg overflow-hidden bg-muted">
          <img
            src={displayImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {displayImages.length > 1 && (
            <>
              <Button
                onClick={handlePrevious}
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleNext}
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <div className="absolute bottom-4 right-4 flex gap-2">
            {virtualTourUrl && (
              <Button
                onClick={() => {
                  setShow360(true);
                  setIsOpen(true);
                }}
                variant="secondary"
                size="sm"
              >
                <View className="h-4 w-4 mr-2" />
                360° View
              </Button>
            )}
            <Button
              onClick={() => {
                setShow360(false);
                setIsOpen(true);
              }}
              variant="secondary"
              size="sm"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Full Screen
            </Button>
          </div>

          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 xl:grid-cols-6 gap-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative h-20 rounded-md overflow-hidden border-2 transition-smooth ${
                  index === currentIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>{show360 ? '360° Virtual Tour' : 'Image Gallery'}</DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 h-full">
            {show360 && virtualTourUrl ? (
              <iframe
                src={virtualTourUrl}
                className="w-full h-full rounded-lg"
                title="360° Virtual Tour"
                allowFullScreen
              />
            ) : (
              <div className="relative h-full">
                <img
                  src={displayImages[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {displayImages.length > 1 && (
                  <>
                    <Button
                      onClick={handlePrevious}
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleNext}
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                      {currentIndex + 1} / {displayImages.length}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
