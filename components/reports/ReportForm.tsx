'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flag, Store, Clock, Info, MapPin, Calendar, Lightbulb, AlertCircle, Upload, X } from 'lucide-react';
import { Button, Input, Textarea, Select, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { REPORT_TYPES } from '@/types/database';
import type { Shop, Report } from '@/types/database';

type ReportType = Report['report_type'];

interface ReportFormProps {
  shops?: Pick<Shop, 'id' | 'name'>[];
  preselectedShop?: Pick<Shop, 'id' | 'name'>;
  preselectedType?: ReportType;
}

const reportTypeIcons: Record<ReportType, React.ReactNode> = {
  shop_closed: <Store className="h-5 w-5" />,
  wrong_hours: <Clock className="h-5 w-5" />,
  wrong_info: <Info className="h-5 w-5" />,
  new_shop: <MapPin className="h-5 w-5" />,
  event_suggestion: <Calendar className="h-5 w-5" />,
  local_tip: <Lightbulb className="h-5 w-5" />,
  issue: <AlertCircle className="h-5 w-5" />,
  other: <Flag className="h-5 w-5" />,
};

export function ReportForm({ shops = [], preselectedShop, preselectedType }: ReportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    reportType: preselectedType || '',
    shopId: preselectedShop?.id || '',
    title: '',
    description: '',
    imageUrl: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: ReportType) => {
    setFormData((prev) => ({ ...prev, reportType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reportType) {
      setError('Please select a report type');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          user_id: user?.id || null,
          report_type: formData.reportType as ReportType,
          shop_id: formData.shopId || null,
          title: formData.title.trim(),
          description: formData.description.trim(),
          image_url: formData.imageUrl.trim() || null,
          status: 'pending',
        });

      if (insertError) {
        throw new Error('Failed to submit report');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Flag className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-oyster-900 mb-2">
          Thank you for your report!
        </h2>
        <p className="text-oyster-600 mb-6 max-w-md mx-auto">
          Your contribution helps keep Whitstable&apos;s directory accurate and up-to-date.
          We&apos;ll review your report shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setFormData({
                reportType: '',
                shopId: '',
                title: '',
                description: '',
                imageUrl: '',
              });
            }}
          >
            Submit Another
          </Button>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Report Type Selection */}
      <div>
        <label className="block text-sm font-medium text-oyster-700 mb-3">
          What would you like to report? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.entries(REPORT_TYPES) as [ReportType, { label: string; description: string }][]).map(
            ([type, { label }]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeSelect(type)}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  formData.reportType === type
                    ? 'border-ocean-500 bg-ocean-50'
                    : 'border-oyster-200 hover:border-oyster-300'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center mb-2',
                    formData.reportType === type
                      ? 'bg-ocean-500 text-white'
                      : 'bg-oyster-100 text-oyster-600'
                  )}
                >
                  {reportTypeIcons[type]}
                </div>
                <p className="font-medium text-sm text-oyster-900">{label}</p>
              </button>
            )
          )}
        </div>
      </div>

      {/* Shop Selection (for relevant types) */}
      {['shop_closed', 'wrong_hours', 'wrong_info', 'local_tip'].includes(formData.reportType) && (
        <Select
          label="Which shop is this about?"
          name="shopId"
          value={formData.shopId}
          onChange={handleInputChange}
          placeholder="Select a shop"
          options={shops.map((shop) => ({
            value: shop.id,
            label: shop.name,
          }))}
        />
      )}

      {/* Title */}
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder={
          formData.reportType === 'new_shop'
            ? "Name of the new shop"
            : formData.reportType === 'event_suggestion'
            ? "Event name"
            : "Brief summary"
        }
        required
      />

      {/* Description */}
      <Textarea
        label="Details"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder={
          formData.reportType === 'wrong_hours'
            ? "What are the correct opening hours?"
            : formData.reportType === 'new_shop'
            ? "Where is it located? What do they sell?"
            : formData.reportType === 'local_tip'
            ? "Share your insider knowledge..."
            : "Please provide as much detail as possible"
        }
        rows={4}
        required
      />

      {/* Image URL */}
      <Input
        label="Image URL (optional)"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleInputChange}
        placeholder="https://..."
        helperText="Add a photo URL as proof or to help illustrate your report"
      />

      {/* Error */}
      {error && (
        <Card variant="outlined" className="!p-3 border-red-300 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!formData.reportType || !formData.title || !formData.description}
          leftIcon={<Flag className="h-4 w-4" />}
          className="flex-1"
        >
          Submit Report
        </Button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 text-sm text-oyster-500">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Your report will be reviewed by our team. Helpful reports contribute to your
          community score and can earn you badges!
        </p>
      </div>
    </form>
  );
}
