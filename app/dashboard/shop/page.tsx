'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function EditShopPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock shop data - would come from Supabase
  const [formData, setFormData] = useState({
    name: 'Wheelers Oyster Bar',
    tagline: "Whitstable's oldest oyster bar",
    description: 'Family-run since 1856, serving the freshest oysters straight from Whitstable Bay.',
    phone: '01227 273311',
    email: 'info@wheelersoysterbar.com',
    website: 'https://wheelersoysterbar.com',
    instagram: '@wheelersoysterbar',
    address_line1: '8 High Street',
    address_line2: '',
    postcode: 'CT5 1BQ',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">edit shop</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        {success && (
          <div className="mb-4 p-3 bg-green-light text-green rounded-button text-sm font-medium">
            Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Shop Name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Tagline"
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="A short description of your shop"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-grey-dark mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-grey-light rounded-button text-ink placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent resize-none"
              placeholder="Tell people about your shop..."
            />
          </div>

          <div className="border-t border-grey-light pt-4 mt-4">
            <h2 className="font-semibold text-ink mb-4">Contact Information</h2>

            <div className="space-y-4">
              <Input
                label="Phone"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Website"
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://"
              />

              <Input
                label="Instagram"
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@yourhandle"
              />
            </div>
          </div>

          <div className="border-t border-grey-light pt-4 mt-4">
            <h2 className="font-semibold text-ink mb-4">Address</h2>

            <div className="space-y-4">
              <Input
                label="Address Line 1"
                id="address1"
                value={formData.address_line1}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              />

              <Input
                label="Address Line 2"
                id="address2"
                value={formData.address_line2}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              />

              <Input
                label="Postcode"
                id="postcode"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              save changes
            </Button>
          </div>
        </form>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
