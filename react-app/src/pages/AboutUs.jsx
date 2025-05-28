import React from 'react';
import Layout from '../components/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gold">About Us</h1>
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p>
                <strong>XAUUSD Chart Live</strong> is your trusted source for real-time gold price tracking, advanced charting, and actionable market insights. Our platform is designed for traders, investors, and anyone passionate about the gold market. We combine technology, expertise, and a passion for precious metals to deliver a world-class experience.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p>
                To empower our users with the most accurate, up-to-date gold price data, professional analysis tools, and educational resources—helping you make informed decisions in the fast-moving world of precious metals.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p>
                We envision a transparent, accessible gold market where everyone—from beginners to experts—can trade, analyze, and learn with confidence. Our goal is to be the go-to platform for gold price discovery and market intelligence.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc pl-6">
                <li>Live XAUUSD price charts with technical indicators</li>
                <li>Trading signals and expert market news</li>
                <li>Educational guides and trading strategies</li>
                <li>Historical data and downloadable chart resources</li>
                <li>Community-driven insights and support</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
              <p>
                Our team is made up of experienced traders, analysts, and developers who are passionate about gold and financial markets. We are dedicated to continuous improvement and value feedback from our growing community.
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

export default AboutUs; 