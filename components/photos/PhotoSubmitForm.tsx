'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Camera, MapPin, Store, Info } from 'lucide-react';
import { Button, Input, Textarea, Select, Card } from '@/components/ui';
import { cn, compressImage } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Shop } from '@/types/database';

interface PhotoSubmitFormProps {
  shops?: Pick<Shop, 'id' | 'name'>[];
  competitionMonth: string;
}

export function PhotoSubmitForm({
  shops = [],
  competitionMonth,
}: PhotoSubmitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    shopId: '',
    cameraInfo: '',
    agreeToTerms: false,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to submit a photo');
      }

      // Compress image
      const compressedBlob = await compressImage(selectedFile, 1200, 0.8);
      const compressedFile = new File([compressedBlob], selectedFile.name, {
        type: 'image/jpeg',
      });

      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, compressedFile);

      if (uploadError) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Create photo entry
      const { error: insertError } = await supabase
        .from('photo_entries')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          location: formData.location.trim() || null,
          shop_id: formData.shopId || null,
          camera_info: formData.cameraInfo.trim() || null,
          competition_month: competitionMonth,
          status: 'pending',
        });

      if (insertError) {
        throw new Error('Failed to submit photo');
      }

      // Redirect to photos page
      router.push('/photos?submitted=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-oyster-700 mb-2">
          Photo <span className="text-red-500">*</span>
        </label>

        {previewUrl ? (
          <div className="relative rounded-xl overflow-hidden bg-oyster-100">
            <div className="relative aspect-video">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-ocean-500 bg-ocean-50'
                : 'border-oyster-300 hover:border-oyster-400'
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-10 w-10 text-oyster-400 mx-auto mb-3" />
            <p className="text-oyster-600">
              Drag and drop your photo here, or{' '}
              <span className="text-ocean-600 font-medium">browse</span>
            </p>
            <p className="text-sm text-oyster-500 mt-1">
              JPEG, PNG up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Give your photo a title"
        required
      />

      {/* Description */}
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Tell us about your photo (optional)"
        rows={3}
      />

      {/* Location */}
      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="e.g., Tankerton Slopes, The Harbour"
        helperText="Where in Whitstable was this taken?"
      />

      {/* Shop Tag */}
      {shops.length > 0 && (
        <Select
          label="Tag a Shop"
          name="shopId"
          value={formData.shopId}
          onChange={handleInputChange}
          placeholder="Select a shop (optional)"
          options={shops.map((shop) => ({
            value: shop.id,
            label: shop.name,
          }))}
          helperText="If your photo features a local business"
        />
      )}

      {/* Camera Info */}
      <Input
        label="Camera/Device"
        name="cameraInfo"
        value={formData.cameraInfo}
        onChange={handleInputChange}
        placeholder="e.g., iPhone 15, Canon EOS R5"
        helperText="Optional: What did you shoot this with?"
      />

      {/* Terms */}
      <Card variant="outlined" className="!p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 rounded border-oyster-300 text-ocean-600 focus:ring-ocean-500"
          />
          <span className="text-sm text-oyster-600">
            I confirm that I took this photo and grant whitstable.shop permission
            to display it on the website and social media. I understand that by
            entering the competition, my photo may be featured publicly.
          </span>
        </label>
      </Card>

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
          disabled={!selectedFile || !formData.agreeToTerms}
          leftIcon={<Camera className="h-4 w-4" />}
          className="flex-1"
        >
          Submit Photo
        </Button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 text-sm text-oyster-500">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Your photo will be reviewed before appearing in the gallery. This
          usually takes less than 24 hours.
        </p>
      </div>
    </form>
  );
}
