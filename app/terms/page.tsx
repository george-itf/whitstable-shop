import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | whitstable.shop',
  description: 'Terms of Service for whitstable.shop - rules and guidelines for using our platform.',
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: January 2024</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-7 mb-4">
            By accessing or using whitstable.shop (&ldquo;the Service&rdquo;), you agree to be bound
            by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms,
            please do not use the Service.
          </p>
          <p className="text-gray-600 leading-7 mb-4">
            We reserve the right to update these Terms at any time. Your continued use of
            the Service after any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-600 leading-7 mb-4">
            whitstable.shop is a local business directory and community platform for Whitstable, Kent. We provide:
          </p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2">A directory of local shops, restaurants, and businesses</li>
            <li className="mb-2">User reviews and ratings</li>
            <li className="mb-2">Local events calendar</li>
            <li className="mb-2">Local information (tide times, parking, etc.)</li>
            <li className="mb-2">Business listing management for owners</li>
          </ul>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">3.1 Registration</h3>
          <p className="text-gray-600 leading-7 mb-4">
            To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration.
          </p>
          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">3.2 Account Security</h3>
          <p className="text-gray-600 leading-7 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
          </p>
          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">3.3 Account Termination</h3>
          <p className="text-gray-600 leading-7 mb-4">
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Content</h2>
          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">4.1 Your Content</h3>
          <p className="text-gray-600 leading-7 mb-4">
            You retain ownership of content you submit, but grant us a licence to use, display, reproduce, and distribute such content.
          </p>
          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">4.2 Content Guidelines</h3>
          <p className="text-gray-600 leading-7 mb-4">You agree that your content will not:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2">Be false, misleading, or fraudulent</li>
            <li className="mb-2">Infringe on intellectual property rights</li>
            <li className="mb-2">Contain personal attacks, harassment, or hate speech</li>
            <li className="mb-2">Include spam, advertising, or promotional material</li>
            <li className="mb-2">Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
          <p className="text-gray-600 leading-7 mb-4">
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-600 leading-7 mb-4">
            To the fullest extent permitted by law, whitstable.shop shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
          <p className="text-gray-600 leading-7 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of England and Wales.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
          <p className="text-gray-600 leading-7 mb-4">
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:hello@whitstable.shop" className="text-blue-500 hover:underline">hello@whitstable.shop</a>
          </p>
        </section>
      </div>
    </main>
  );
}
