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
        <title>XAUUSD Chart Live | Real-Time Gold Price Tracking | XAU/USD Analysis</title>
        <meta 
          name="description" 
          content="Track XAUUSD gold prices in real-time with professional interactive charts, expert trading signals, and market analysis on XAUUSD Chart Live." 
        />
        <meta name="keywords" content="XAUUSD chart live, gold price chart, XAU/USD live chart, gold trading signals, precious metals, trading analysis, gold market news" />
        <link rel="canonical" href="https://xauusd-chart-live.com" />
        <meta property="article:publisher" content="https://xauusd-chart-live.com" />
        <meta name="author" content="XAUUSD CHART LIVE" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      </Helmet>

      <main>
        <HeroSection priceData={priceData} />
        <PriceChart />
        <SignalIndicator />
        <NewsSection />
      </main>
    </Layout>
  );
};

export default Home;
