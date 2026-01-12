import { OpeningHours } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return minutes === '00' ? `${hour12}${ampm}` : `${hour12}:${minutes}${ampm}`;
}

export function getDayName(date: Date = new Date()): keyof OpeningHours {
  const days: (keyof OpeningHours)[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
}

export function isCurrentlyOpen(hours: OpeningHours | null): {
  isOpen: boolean;
  message: string;
} {
  if (!hours) {
    return { isOpen: false, message: 'Hours not available' };
  }

  const now = new Date();
  const currentDay = getDayName(now);
  const todayHours = hours[currentDay];

  if (!todayHours || todayHours.closed) {
    // Find next open day
    const days: (keyof OpeningHours)[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    const currentIndex = days.indexOf(currentDay);

    for (let i = 1; i <= 7; i++) {
      const nextDay = days[(currentIndex + i) % 7];
      const nextHours = hours[nextDay];
      if (nextHours && !nextHours.closed) {
        const dayName = i === 1 ? 'tomorrow' : nextDay;
        return {
          isOpen: false,
          message: `Closed · opens ${formatTime(nextHours.open)} ${dayName}`,
        };
      }
    }
    return { isOpen: false, message: 'Closed' };
  }

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  if (currentTime >= openTime && currentTime < closeTime) {
    return {
      isOpen: true,
      message: `Open · closes ${formatTime(todayHours.close)}`,
    };
  } else if (currentTime < openTime) {
    return {
      isOpen: false,
      message: `Closed · opens ${formatTime(todayHours.open)} today`,
    };
  } else {
    // After closing, find next open time
    const days: (keyof OpeningHours)[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    const currentIndex = days.indexOf(currentDay);

    for (let i = 1; i <= 7; i++) {
      const nextDay = days[(currentIndex + i) % 7];
      const nextHours = hours[nextDay];
      if (nextHours && !nextHours.closed) {
        const dayName = i === 1 ? 'tomorrow' : nextDay;
        return {
          isOpen: false,
          message: `Closed · opens ${formatTime(nextHours.open)} ${dayName}`,
        };
      }
    }
    return { isOpen: false, message: 'Closed' };
  }
}

export function validateUKPostcode(postcode: string): boolean {
  const regex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  return regex.test(postcode.trim());
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(dateString: string, format?: string): string {
  const date = new Date(dateString);

  if (!format) {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Simple format string handling
  const day = date.getDate();
  const dayPadded = day.toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const monthLong = date.toLocaleDateString('en-GB', { month: 'long' });
  const monthNum = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return format
    .replace('dd', dayPadded)
    .replace('d', day.toString())
    .replace('MMMM', monthLong)
    .replace('MMM', month)
    .replace('MM', monthNum)
    .replace('yyyy', year.toString())
    .replace('yy', year.toString().slice(-2));
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDateShort(dateString);
}

export function hashIP(ip: string): string {
  // Simple hash function for IP anonymization
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Alias for getRelativeTime (used by engagement features)
export const formatRelativeTime = getRelativeTime;

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}

export function getCompetitionMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getRankChangeIcon(change: number): string {
  if (change > 0) return '↑';
  if (change < 0) return '↓';
  return '−';
}

export async function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}
