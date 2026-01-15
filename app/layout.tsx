import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MobileMenuProvider } from '@/components/layout/MobileMenu';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'whitstable.shop | Your local guide to Whitstable',
  description: 'Discover the best shops, cafes, restaurants, and local businesses in Whitstable, Kent. Your complete guide to the seaside town.',
  keywords: 'Whitstable, shops, cafes, restaurants, Kent, local businesses, oysters, harbour',
  icons: {
    icon: '/brand/logo-square.png',
    apple: '/brand/logo-square.png',
  },
  openGraph: {
    title: 'whitstable.shop',
    description: 'Your local guide to Whitstable',
    locale: 'en_GB',
    type: 'website',
    images: ['/brand/logo-square.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Fredoka:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-nunito antialiased bg-paper text-ink">
        <ToastProvider>
          <MobileMenuProvider>
            {children}
          </MobileMenuProvider>
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
