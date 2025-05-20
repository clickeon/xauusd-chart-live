import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import PriceChart from '../components/PriceChart';
import SignalIndicator from '../components/SignalIndicator';
import NewsSection from '../components/NewsSection';

const Home = ({ priceData }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <Layout>
      <Helmet>
        <title>XAUUSD Chart Live | Real-Time Gold Price Tracking</title>
        <meta 
          name="description" 
          content="Track XAUUSD gold prices in real-time with professional interactive charts and expert trading signals. Get comprehensive market analysis and live gold price updates." 
        />
        <meta name="keywords" content="XAUUSD chart live, gold price chart, XAU/USD live chart, gold trading signals, precious metals, trading analysis, gold market news" />
        <link rel="canonical" href="https://xauusd-chart-live.com" />
        <meta property="article:publisher" content="https://xauusd-chart-live.com" />
        <meta name="author" content="XAUUSD CHART LIVE" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      </Helmet>

      <main>
        <section className="hero-section">
          <h1 className="sr-only">XAUUSD Chart Live - Real-Time Gold Price Tracking</h1>
          <HeroSection priceData={priceData} />
        </section>

        <section className="price-chart-section" id="price-chart">
          <h2 className="section-title">Live Gold Price Chart</h2>
          <PriceChart />
        </section>

        <section className="signals-section" id="trading-signals">
          <h2 className="section-title">Trading Signals & Analysis</h2>
          <SignalIndicator />
        </section>

        <section className="news-section" id="market-news">
          <h2 className="section-title">Latest Gold Market News</h2>
          <NewsSection />
        </section>

        <section className="content-section" id="about-gold">
          <h2 className="section-title">Understanding Gold Trading</h2>
          <div className="content-wrapper">
            <p>XAUUSD Chart Live provides real-time gold price tracking and analysis tools for traders and investors. Our platform offers comprehensive market insights, technical analysis, and trading signals to help you make informed decisions in the gold market.</p>
            <p>Track the XAU/USD pair with our professional-grade charts, monitor market trends, and stay updated with the latest gold market news and analysis.</p>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
