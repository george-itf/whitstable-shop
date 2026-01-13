import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacy Policy | whitstable.shop',
  description: 'Privacy policy for whitstable.shop - how we collect, use, and protect your data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <MobileWrapper>
      {/* Header */}
      <header className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
            <p className="text-white/80 text-sm">Last updated: January 2024</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {/* Quick Overview */}
        <Card className="mb-6 bg-ocean-50 border-ocean-200">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-ocean-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-oyster-900 mb-1">Your Privacy Matters</h3>
              <p className="text-sm text-oyster-600">
                We&apos;re committed to protecting your data. We use minimal cookies
                and privacy-focused analytics.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Points */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="text-center p-4">
            <Lock className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">Secure & Encrypted</p>
          </Card>
          <Card className="text-center p-4">
            <Eye className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">No Tracking Ads</p>
          </Card>
          <Card className="text-center p-4">
            <Database className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">EU Data Storage</p>
          </Card>
          <Card className="text-center p-4">
            <UserCheck className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">GDPR Compliant</p>
          </Card>
        </div>

        {/* Full Policy */}
        <Card>
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">1. Introduction</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              whitstable.shop (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website.
            </p>
            <p className="text-oyster-600 leading-relaxed">
              By using our Service, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-base font-medium text-oyster-800 mb-2">2.1 Information You Provide</h3>
            <ul className="text-oyster-600 leading-relaxed mb-4 pl-4 list-disc space-y-1">
              <li><strong className="text-oyster-700">Account Information:</strong> Name, email address, and password</li>
              <li><strong className="text-oyster-700">Profile Information:</strong> Username, profile photo, and bio</li>
              <li><strong className="text-oyster-700">User Content:</strong> Reviews, ratings, and comments you post</li>
              <li><strong className="text-oyster-700">Business Information:</strong> If you claim a business listing</li>
            </ul>

            <h3 className="text-base font-medium text-oyster-800 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="text-oyster-600 leading-relaxed mb-4 pl-4 list-disc space-y-1">
              <li><strong className="text-oyster-700">Usage Data:</strong> Pages visited, time spent, links clicked</li>
              <li><strong className="text-oyster-700">Device Information:</strong> Browser type, operating system</li>
              <li><strong className="text-oyster-700">Location Data:</strong> General location based on IP address</li>
            </ul>
            <p className="text-oyster-600 leading-relaxed text-sm bg-oyster-50 p-3 rounded-lg">
              We use privacy-focused analytics (Plausible/Umami) that do not use cookies or
              track individuals across websites.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">3. How We Use Your Information</h2>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>Provide, maintain, and improve our Service</li>
              <li>Create and manage your account</li>
              <li>Process business claims and listing updates</li>
              <li>Display your reviews and contributions</li>
              <li>Send you updates about your account (if opted in)</li>
              <li>Respond to your questions and support requests</li>
              <li>Monitor and analyse usage patterns</li>
              <li>Detect and prevent fraudulent activity</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">4. Sharing of Information</h2>
            <ul className="text-oyster-600 leading-relaxed mb-4 pl-4 list-disc space-y-1">
              <li><strong className="text-oyster-700">Public Content:</strong> Reviews and profile info you make public</li>
              <li><strong className="text-oyster-700">Service Providers:</strong> Third-party companies that help us operate</li>
              <li><strong className="text-oyster-700">Legal Requirements:</strong> When required by law</li>
            </ul>
            <p className="text-oyster-600 leading-relaxed font-medium">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">5. Third-Party Services</h2>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li><strong className="text-oyster-700">Supabase:</strong> Database and authentication (hosted in EU)</li>
              <li><strong className="text-oyster-700">Vercel:</strong> Website hosting and delivery</li>
              <li><strong className="text-oyster-700">Mapbox:</strong> Map display and location services</li>
              <li><strong className="text-oyster-700">Plausible:</strong> Privacy-focused website analytics</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">6. Cookies</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              We use minimal cookies necessary for the operation of our Service:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li><strong className="text-oyster-700">Authentication cookies:</strong> To keep you logged in</li>
              <li><strong className="text-oyster-700">Preference cookies:</strong> To remember your settings</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">7. Your Rights (GDPR)</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              Under the UK GDPR and Data Protection Act 2018, you have the right to:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li><strong className="text-oyster-700">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-oyster-700">Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong className="text-oyster-700">Erasure:</strong> Request deletion of your data</li>
              <li><strong className="text-oyster-700">Portability:</strong> Request transfer of your data</li>
              <li><strong className="text-oyster-700">Object:</strong> Object to processing of your data</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">8. Data Security</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              We implement appropriate technical and organisational measures:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>Encryption of data in transit (HTTPS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">9. Contact Us</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              If you have any questions about this Privacy Policy:
            </p>
            <div className="flex items-center gap-2 text-ocean-600">
              <Mail className="h-4 w-4" />
              <a href="mailto:privacy@whitstable.shop" className="hover:underline">
                privacy@whitstable.shop
              </a>
            </div>
            <p className="text-sm text-oyster-500 mt-4">
              You also have the right to lodge a complaint with the Information Commissioner&apos;s
              Office (ICO) at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-ocean-600 hover:underline">
                ico.org.uk
              </a>
            </p>
          </section>
        </Card>
      </main>

      <BottomNav />
    </MobileWrapper>
  );
}
