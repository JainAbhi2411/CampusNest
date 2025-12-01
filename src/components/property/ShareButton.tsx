import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShareButtonProps {
  propertyId: string;
  propertyTitle: string;
  variant?: 'default' | 'icon';
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  propertyId,
  propertyTitle,
  variant = 'default',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/properties/${propertyId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: `Check out this property: ${propertyTitle}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleNativeShare}
        className={className}
      >
        <Share2 className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <Share2 className="h-5 w-5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Property</DialogTitle>
          <DialogDescription>
            Share this property with your friends and family
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button onClick={handleCopyLink} variant="outline" size="icon">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {navigator.share && (
            <Button onClick={handleNativeShare} className="w-full gap-2">
              <Share2 className="h-4 w-4" />
              Share via...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
