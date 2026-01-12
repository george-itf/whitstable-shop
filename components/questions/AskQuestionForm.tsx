'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, Info } from 'lucide-react';
import { Button, Input, Textarea, Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export function AskQuestionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    context: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      setError('Please enter your question');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error: insertError } = await supabase
        .from('questions')
        .insert({
          user_id: user?.id || null,
          question: formData.question.trim(),
          context: formData.context.trim() || null,
          status: 'open',
        })
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to submit question');
      }

      router.push(`/ask/${data.id}?new=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Your Question"
        name="question"
        value={formData.question}
        onChange={handleInputChange}
        placeholder="What would you like to know about Whitstable?"
        rows={3}
        required
      />

      <Textarea
        label="Context (optional)"
        name="context"
        value={formData.context}
        onChange={handleInputChange}
        placeholder="e.g., 'Visiting for a day with kids' or 'Looking for romantic dinner spots'"
        rows={2}
        helperText="Add context to help locals give you better answers"
      />

      {error && (
        <Card variant="outlined" className="!p-3 border-red-300 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      <div className="flex items-start gap-2 text-sm text-oyster-500">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Be specific! The more detail you provide, the better answers you&apos;ll receive.
          Questions about specific shops, locations, or activities work best.
        </p>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!formData.question.trim()}
        leftIcon={<HelpCircle className="h-4 w-4" />}
        className="w-full"
      >
        Ask the Community
      </Button>
    </form>
  );
}
