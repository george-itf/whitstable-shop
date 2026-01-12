import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | whitstable.shop',
  description: 'Privacy policy for whitstable.shop - how we collect, use, and protect your data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: January 2024</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600 leading-7 mb-4">
            whitstable.shop (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website whitstable.shop.
          </p>
          <p className="text-gray-600 leading-7 mb-4">
            By using our Service, you agree to the collection and use of information in
            accordance with this policy.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">2.1 Information You Provide</h3>
          <p className="text-gray-600 leading-7 mb-4">We may collect information you provide directly to us, such as:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Account Information:</strong> Name, email address, and password when you create an account</li>
            <li className="mb-2"><strong className="text-gray-700">Profile Information:</strong> Username, profile photo, and bio</li>
            <li className="mb-2"><strong className="text-gray-700">User Content:</strong> Reviews, ratings, and comments you post</li>
            <li className="mb-2"><strong className="text-gray-700">Business Information:</strong> If you claim a business listing, we collect business name, address, phone number, opening hours, and other relevant details</li>
            <li className="mb-2"><strong className="text-gray-700">Communications:</strong> Information you provide when contacting us for support</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">2.2 Information Collected Automatically</h3>
          <p className="text-gray-600 leading-7 mb-4">When you visit our website, we automatically collect certain information:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Usage Data:</strong> Pages visited, time spent on pages, links clicked</li>
            <li className="mb-2"><strong className="text-gray-700">Device Information:</strong> Browser type, operating system, device type</li>
            <li className="mb-2"><strong className="text-gray-700">Location Data:</strong> General location based on IP address (country/region level)</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            We use privacy-focused analytics (Plausible/Umami) that do not use cookies or
            track individuals across websites.
          </p>

          <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">2.3 Information from Third Parties</h3>
          <p className="text-gray-600 leading-7 mb-4">We may receive information about you from third parties:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Authentication Providers:</strong> If you sign in with Google or other providers, we receive your name and email</li>
            <li className="mb-2"><strong className="text-gray-700">Publicly Available Information:</strong> Business information from public directories</li>
          </ul>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-7 mb-4">We use the information we collect to:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2">Provide, maintain, and improve our Service</li>
            <li className="mb-2">Create and manage your account</li>
            <li className="mb-2">Process business claims and listing updates</li>
            <li className="mb-2">Display your reviews and contributions</li>
            <li className="mb-2">Send you updates about your account or listings (if opted in)</li>
            <li className="mb-2">Respond to your comments, questions, and support requests</li>
            <li className="mb-2">Monitor and analyse usage patterns and trends</li>
            <li className="mb-2">Detect, investigate, and prevent fraudulent or unauthorised activity</li>
            <li className="mb-2">Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Sharing of Information</h2>
          <p className="text-gray-600 leading-7 mb-4">We may share your information in the following circumstances:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Public Content:</strong> Reviews, ratings, and profile information you choose to make public</li>
            <li className="mb-2"><strong className="text-gray-700">Service Providers:</strong> Third-party companies that help us operate our service (hosting, email, analytics)</li>
            <li className="mb-2"><strong className="text-gray-700">Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li className="mb-2"><strong className="text-gray-700">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
          <p className="text-gray-600 leading-7 mb-4">We use the following third-party services:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Supabase:</strong> Database and authentication (hosted in EU)</li>
            <li className="mb-2"><strong className="text-gray-700">Vercel:</strong> Website hosting and delivery</li>
            <li className="mb-2"><strong className="text-gray-700">Mapbox:</strong> Map display and location services</li>
            <li className="mb-2"><strong className="text-gray-700">Plausible/Umami:</strong> Privacy-focused website analytics</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
          <p className="text-gray-600 leading-7 mb-4">
            We use minimal cookies necessary for the operation of our Service:
          </p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Authentication cookies:</strong> To keep you logged in</li>
            <li className="mb-2"><strong className="text-gray-700">Preference cookies:</strong> To remember your settings (e.g., saved shops)</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            Our analytics solution (Plausible/Umami) does not use cookies and does not track
            you across websites. No cookie consent banner is required for these analytics.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
          <p className="text-gray-600 leading-7 mb-4">We retain your information for as long as necessary to:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2">Provide you with our Service</li>
            <li className="mb-2">Comply with legal obligations</li>
            <li className="mb-2">Resolve disputes and enforce agreements</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            If you delete your account, we will delete or anonymise your personal data within
            30 days, except where we are required to retain it by law.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Your Rights (GDPR)</h2>
          <p className="text-gray-600 leading-7 mb-4">Under the UK GDPR and Data Protection Act 2018, you have the right to:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-gray-700">Access:</strong> Request a copy of your personal data</li>
            <li className="mb-2"><strong className="text-gray-700">Rectification:</strong> Request correction of inaccurate data</li>
            <li className="mb-2"><strong className="text-gray-700">Erasure:</strong> Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li className="mb-2"><strong className="text-gray-700">Portability:</strong> Request transfer of your data to another service</li>
            <li className="mb-2"><strong className="text-gray-700">Object:</strong> Object to processing of your data</li>
            <li className="mb-2"><strong className="text-gray-700">Restrict:</strong> Request restriction of processing</li>
            <li className="mb-2"><strong className="text-gray-700">Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            To exercise these rights, please contact us at privacy@whitstable.shop
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Data Security</h2>
          <p className="text-gray-600 leading-7 mb-4">
            We implement appropriate technical and organisational measures to protect your
            personal data against unauthorised access, alteration, disclosure, or destruction.
            These measures include:
          </p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2">Encryption of data in transit (HTTPS)</li>
            <li className="mb-2">Encryption of sensitive data at rest</li>
            <li className="mb-2">Regular security assessments</li>
            <li className="mb-2">Access controls and authentication</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            However, no method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
          <p className="text-gray-600 leading-7 mb-4">
            Our servers are located in the European Union. If you access our Service from
            outside the EU, your information may be transferred to and processed in the EU.
          </p>
          <p className="text-gray-600 leading-7 mb-4">
            We ensure appropriate safeguards are in place for any international transfers
            of personal data in accordance with applicable data protection laws.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
          <p className="text-gray-600 leading-7 mb-4">
            Our Service is not directed to children under 16. We do not knowingly collect
            personal information from children under 16. If you are a parent or guardian
            and believe your child has provided us with personal information, please contact
            us so we can delete it.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
          <p className="text-gray-600 leading-7 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the
            &ldquo;Last updated&rdquo; date.
          </p>
          <p className="text-gray-600 leading-7 mb-4">
            We encourage you to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
          <p className="text-gray-600 leading-7 mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="text-gray-600 leading-7 mb-4 pl-6 list-disc">
            <li className="mb-2">Email: privacy@whitstable.shop</li>
            <li className="mb-2">Website: https://whitstable.shop/contact</li>
          </ul>
          <p className="text-gray-600 leading-7 mb-4">
            You also have the right to lodge a complaint with the Information Commissioner&apos;s
            Office (ICO) if you believe your data protection rights have been violated.
          </p>
          <p className="text-gray-600 leading-7 mb-4">
            ICO Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://ico.org.uk</a>
          </p>
        </section>
      </div>
    </main>
  );
}
