import { Review } from '@/types';
import { getRelativeTime } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
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
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill={star <= review.rating ? '#f5a623' : 'none'}
              stroke={star <= review.rating ? '#f5a623' : '#e5e7eb'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-grey-dark">{review.comment}</p>
      )}

      <div className="text-xs text-grey">
        {getRelativeTime(review.created_at)}
      </div>
    </div>
  );
}
