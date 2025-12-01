import React, { useEffect, useState } from 'react';
import { Star, User, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from 'miaoda-auth-react';
import { reviewApi } from '@/db/api';
import type { ReviewWithUser } from '@/types/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReviewSectionProps {
  propertyId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ propertyId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [userReview, setUserReview] = useState<ReviewWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithUser | null>(null);

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewApi.getPropertyReviews(propertyId);
      setReviews(data);

      if (user) {
        const myReview = data.find((r) => r.user_id === user.id);
        setUserReview(myReview || null);
        if (myReview) {
          setRating(myReview.rating);
          setComment(myReview.comment || '');
        }
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReview) {
        await reviewApi.updateReview(editingReview.id, { rating, comment });
        toast.success('Review updated successfully');
      } else {
        await reviewApi.createReview({
          property_id: propertyId,
          user_id: user.id,
          rating,
          comment,
        });
        toast.success('Review submitted successfully');
      }

      setIsDialogOpen(false);
      setEditingReview(null);
      setRating(5);
      setComment('');
      loadReviews();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review: ReviewWithUser) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || '');
    setIsDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewApi.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (count: number, interactive = false, onSelect?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= count ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onSelect && onSelect(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{averageRating}</span>
                {renderStars(Math.round(Number(averageRating)))}
              </div>
              <span className="text-muted-foreground">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>

          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    if (userReview) {
                      handleEditReview(userReview);
                    } else {
                      setEditingReview(null);
                      setRating(5);
                      setComment('');
                    }
                  }}
                >
                  {userReview ? 'Edit Review' : 'Write Review'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingReview ? 'Edit Your Review' : 'Write a Review'}
                  </DialogTitle>
                  <DialogDescription>
                    Share your experience with this property
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    {renderStars(rating, true, setRating)}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comment</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this property..."
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 10 characters ({comment.length}/10)
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingReview(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this property!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{review.user?.username || 'Anonymous'}</p>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user && user.id === review.user_id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReview(review)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>

                {review.comment && (
                  <p className="text-muted-foreground ml-13">{review.comment}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
