'use client';

import { Star, MessageSquare, PenLine } from 'lucide-react';
import { Review } from '@/types';
import { getRelativeTime } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ShopReviewsProps {
  reviews: Review[];
  shopId: string;
  onWriteReview?: () => void;
}

export default function ShopReviews({
  reviews,
  onWriteReview,
}: ShopReviewsProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
        : 0,
  }));

  return (
    <div className="px-4 py-4 border-b border-grey-light">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky" />
          <h2 className="font-bold text-ink">reviews</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onWriteReview}
          leftIcon={<PenLine className="w-3.5 h-3.5" />}
        >
          write review
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-oyster-50 rounded-2xl">
          <div className="w-14 h-14 bg-yellow-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-7 h-7 text-yellow" />
          </div>
          <p className="text-ink font-medium">No reviews yet</p>
          <p className="text-grey text-sm mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          {/* Rating summary */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-grey-light">
            <div className="text-center">
              <div className="text-4xl font-bold text-ink">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={star <= Math.round(averageRating)}
                    size={16}
                  />
                ))}
              </div>
              <div className="text-xs text-grey mt-1.5 font-medium">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-1.5">
              {ratingDistribution.map(({ rating, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-grey w-3 font-medium">{rating}</span>
                  <div className="flex-1 h-2 bg-oyster-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 3 && (
            <button className="w-full text-center text-sky text-sm font-semibold mt-4 py-2 hover:text-sky-dark transition-colors">
              See all {reviews.length} reviews
            </button>
          )}
        </>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-oyster-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-sky flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {review.author_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">
              {review.author_name}
            </div>
            {review.author_postcode && (
              <div className="text-xs text-grey">{review.author_postcode}</div>
            )}
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={star <= review.rating} size={14} />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-grey-dark leading-relaxed">{review.comment}</p>
      )}

      <div className="text-xs text-grey mt-2">{getRelativeTime(review.created_at)}</div>
    </div>
  );
}

function StarIcon({ filled, size = 16 }: { filled: boolean; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#f5a623' : 'none'}
      stroke={filled ? '#f5a623' : '#d4d4d4'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
