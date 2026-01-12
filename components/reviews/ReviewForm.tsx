'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { validateUKPostcode } from '@/lib/utils';

interface ReviewFormProps {
  shopId: string;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewForm({
  shopId,
  shopName,
  isOpen,
  onClose,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validateUKPostcode(postcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_id: shopId,
          author_name: name,
          author_postcode: postcode,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      onSuccess?.();

      // Reset form after delay
      setTimeout(() => {
        setRating(0);
        setName('');
        setPostcode('');
        setComment('');
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Thank you!">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-grey-dark">Your review has been submitted!</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review ${shopName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-grey-dark mb-2">
            Your rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={
                    star <= (hoverRating || rating) ? '#f5a623' : 'none'
                  }
                  stroke={
                    star <= (hoverRating || rating) ? '#f5a623' : '#e5e7eb'
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Your name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Sarah"
          required
        />

        <Input
          label="Your postcode"
          id="postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          placeholder="e.g., CT5 1AA"
          required
        />

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-grey-dark mb-1.5"
          >
            Your review (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-grey-light rounded-button text-ink placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent resize-none"
            placeholder="Tell others about your experience..."
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          submit review
        </Button>
      </form>
    </Modal>
  );
}
