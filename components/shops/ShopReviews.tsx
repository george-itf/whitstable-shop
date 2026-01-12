'use client';

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
        <h2 className="font-bold text-ink">reviews</h2>
        <Button variant="outline" size="sm" onClick={onWriteReview}>
          write review
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-grey-light mb-2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <p className="text-grey text-sm">No reviews yet</p>
          <p className="text-grey text-xs mt-1">Be the first to review!</p>
        </div>
      ) : (
        <>
          {/* Rating summary */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-grey-light">
            <div className="text-center">
              <div className="text-3xl font-bold text-ink">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={star <= Math.round(averageRating)}
                    size={14}
                  />
                ))}
              </div>
              <div className="text-xs text-grey mt-1">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-1">
              {ratingDistribution.map(({ rating, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-grey w-3">{rating}</span>
                  <div className="flex-1 h-1.5 bg-grey-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow rounded-full"
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
            <button className="w-full text-center text-sky text-sm font-medium mt-4">
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sky-light flex items-center justify-center">
            <span className="text-sm font-semibold text-sky">
              {review.author_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-ink">
              {review.author_name}
            </div>
            <div className="text-xs text-grey">{review.author_postcode}</div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={star <= review.rating} size={12} />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-grey-dark">{review.comment}</p>
      )}

      <div className="text-xs text-grey">{getRelativeTime(review.created_at)}</div>
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
      stroke={filled ? '#f5a623' : '#e5e7eb'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
