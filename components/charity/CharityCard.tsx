import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Heart } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { getPercentage, formatCurrency } from '@/lib/utils';
import type { Charity } from '@/types/database';

interface CharityCardProps {
  charity: Charity;
  variant?: 'default' | 'featured';
}

export function CharityCard({ charity, variant = 'default' }: CharityCardProps) {
  const hasTarget = charity.target_amount && charity.target_amount > 0;
  const progress = hasTarget
    ? getPercentage(charity.raised_amount, charity.target_amount!)
    : 0;

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
        <div className="flex flex-col sm:flex-row gap-6">
          {charity.logo_url && (
            <div className="sm:w-32 sm:h-32 flex-shrink-0">
              <Image
                src={charity.logo_url}
                alt={charity.name}
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex-1">
            <Badge variant="danger" className="mb-2">
              <Heart className="h-3 w-3 mr-1" />
              Featured Cause
            </Badge>
            <h3 className="text-xl font-bold text-oyster-900 mb-2">
              {charity.name}
            </h3>
            {charity.current_campaign && (
              <p className="font-medium text-rose-700 mb-2">
                {charity.current_campaign}
              </p>
            )}
            <p className="text-oyster-600 mb-4 line-clamp-2">
              {charity.description}
            </p>

            {hasTarget && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-oyster-600">
                    {formatCurrency(charity.raised_amount)} raised
                  </span>
                  <span className="font-medium text-oyster-900">
                    {formatCurrency(charity.target_amount!)} goal
                  </span>
                </div>
                <ProgressBar value={progress} variant="danger" size="md" />
              </div>
            )}

            <div className="flex gap-3">
              {charity.donation_url && (
                <a href={charity.donation_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" leftIcon={<Heart className="h-4 w-4" />}>
                    Donate Now
                  </Button>
                </a>
              )}
              <Link href={`/community/charities/${charity.slug}`}>
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/community/charities/${charity.slug}`}>
      <Card hoverable className="h-full">
        <div className="flex items-start gap-4">
          {charity.logo_url ? (
            <Image
              src={charity.logo_url}
              alt={charity.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-contain"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-oyster-900 truncate">
              {charity.name}
            </h3>
            {charity.current_campaign && (
              <p className="text-sm text-rose-600 truncate">
                {charity.current_campaign}
              </p>
            )}
            <p className="text-sm text-oyster-500 line-clamp-2 mt-1">
              {charity.description}
            </p>
          </div>
        </div>

        {hasTarget && (
          <div className="mt-4">
            <ProgressBar value={progress} variant="danger" size="sm" />
            <p className="text-xs text-oyster-500 mt-1">
              {formatCurrency(charity.raised_amount)} of{' '}
              {formatCurrency(charity.target_amount!)}
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}
