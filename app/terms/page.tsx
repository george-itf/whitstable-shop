import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, FileText, Users, AlertTriangle, Scale, Mail } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Terms of Service | whitstable.shop',
  description: 'Terms of Service for whitstable.shop - rules and guidelines for using our platform.',
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <MobileWrapper>
      {/* Header */}
      <header className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Terms of Service</h1>
            <p className="text-white/80 text-sm">Last updated: January 2024</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {/* Quick Overview */}
        <Card className="mb-6 bg-ocean-50 border-ocean-200">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-ocean-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-oyster-900 mb-1">Fair Use Agreement</h3>
              <p className="text-sm text-oyster-600">
                These terms govern your use of whitstable.shop. Please read them carefully
                before using our service.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Points */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="text-center p-4">
            <Users className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">Community First</p>
          </Card>
          <Card className="text-center p-4">
            <AlertTriangle className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">Honest Reviews</p>
          </Card>
          <Card className="text-center p-4">
            <Scale className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">Fair Treatment</p>
          </Card>
          <Card className="text-center p-4">
            <FileText className="h-6 w-6 text-ocean-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-oyster-900">UK Law</p>
          </Card>
        </div>

        {/* Full Terms */}
        <Card>
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              By accessing or using whitstable.shop (&ldquo;the Service&rdquo;), you agree to be bound
              by these Terms of Service. If you do not agree to these Terms, please do not use the Service.
            </p>
            <p className="text-oyster-600 leading-relaxed">
              We reserve the right to update these Terms at any time. Your continued use of
              the Service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">2. Description of Service</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              whitstable.shop is a community-driven platform that provides:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>A directory of local shops and businesses in Whitstable</li>
              <li>User-generated reviews and ratings</li>
              <li>Photo sharing and competition features</li>
              <li>Community Q&A and local tips</li>
              <li>Event listings and charity information</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">3. User Accounts</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              When you create an account, you agree to:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 16 years of age</li>
              <li>Accept responsibility for all activity under your account</li>
              <li>Notify us immediately of any unauthorised use</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">4. User Content</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              You retain ownership of content you submit but grant us a licence to use it.
              You agree not to post content that:
            </p>
            <ul className="text-oyster-600 leading-relaxed mb-4 pl-4 list-disc space-y-1">
              <li>Is false, misleading, or defamatory</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains hate speech or harassment</li>
              <li>Promotes illegal activities</li>
              <li>Contains spam or advertising</li>
              <li>Violates anyone&apos;s privacy</li>
            </ul>
            <p className="text-oyster-600 leading-relaxed text-sm bg-coral-50 p-3 rounded-lg border border-coral/20">
              We reserve the right to remove content that violates these guidelines without notice.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">5. Business Listings</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              Business owners who claim their listing agree to:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>Verify ownership through our verification process</li>
              <li>Keep business information accurate and up-to-date</li>
              <li>Respond professionally to customer reviews</li>
              <li>Not manipulate reviews or ratings</li>
              <li>Not post fake reviews for their own or competitors&apos; businesses</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">6. Reviews & Ratings</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              When writing reviews, you agree to:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>Base reviews on genuine personal experiences</li>
              <li>Be fair, honest, and constructive</li>
              <li>Not accept payment for reviews</li>
              <li>Disclose any personal connections to businesses</li>
              <li>Not submit multiple reviews for the same business</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">7. Prohibited Activities</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="text-oyster-600 leading-relaxed pl-4 list-disc space-y-1">
              <li>Use automated systems to access the Service</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Collect user information without consent</li>
              <li>Impersonate others or create fake accounts</li>
              <li>Use the Service for commercial purposes without permission</li>
            </ul>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">8. Termination</h2>
            <p className="text-oyster-600 leading-relaxed">
              We may suspend or terminate your account at our discretion if you violate these Terms.
              You may delete your account at any time through your profile settings.
              Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">9. Disclaimer</h2>
            <p className="text-oyster-600 leading-relaxed">
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
              the accuracy of business information or user content. We are not responsible for
              any decisions made based on information found on our platform.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">10. Limitation of Liability</h2>
            <p className="text-oyster-600 leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section className="mb-6 pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">11. Governing Law</h2>
            <p className="text-oyster-600 leading-relaxed">
              These Terms are governed by the laws of England and Wales. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section className="pt-4 border-t border-oyster-100">
            <h2 className="text-lg font-semibold text-oyster-900 mb-3">12. Contact Us</h2>
            <p className="text-oyster-600 leading-relaxed mb-3">
              If you have any questions about these Terms:
            </p>
            <div className="flex items-center gap-2 text-ocean-600">
              <Mail className="h-4 w-4" />
              <a href="mailto:hello@whitstable.shop" className="hover:underline">
                hello@whitstable.shop
              </a>
            </div>
          </section>
        </Card>
      </main>

      <BottomNav />
    </MobileWrapper>
  );
}
