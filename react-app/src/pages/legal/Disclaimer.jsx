import React from 'react';
import Layout from '../../components/Layout';

const Disclaimer = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gold">Legal Disclaimer</h1>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. No Financial Advice</h2>
              <p className="mb-4">
                The information provided on XAUUSD Chart Live is for general informational purposes only and should not be considered as financial advice. We are not financial advisors, and the content on this website does not constitute professional financial advice, investment advice, or any other type of advice.
              </p>
              <p className="mb-4">
                All trading and investment decisions should be made after careful consideration of your personal financial situation, risk tolerance, and investment objectives. We strongly recommend consulting with a qualified financial advisor before making any investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Risk Warning</h2>
              <p className="mb-4">
                Trading in financial markets, including gold and other precious metals, involves substantial risk of loss and is not suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
              </p>
              <p className="mb-4">
                The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Data Accuracy</h2>
              <p className="mb-4">
                While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on our website.
              </p>
              <p className="mb-4">
                Any reliance you place on such information is strictly at your own risk. We recommend verifying all information from multiple sources before making any trading decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Links</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites or services that are not owned or controlled by XAUUSD Chart Live. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p className="mb-4">
                You acknowledge and agree that XAUUSD Chart Live shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall XAUUSD Chart Live, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Changes to Disclaimer</h2>
              <p className="mb-4">
                We reserve the right to modify or replace this Disclaimer at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about this Disclaimer, please contact us through our website's contact form or via email.
              </p>
            </section>

            <div className="mt-12 text-sm text-gray-400">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer; 