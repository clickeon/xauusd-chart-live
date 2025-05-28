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
        <meta property="article:publisher" content="https://xauusd-chart-live.com" />
        <meta name="author" content="XAUUSD CHART LIVE" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://xauusd-chart-live.com/" />
      </Helmet>

      <main>
        <section className="hero-section">
          <h1 className="text-3xl font-bold text-gold mb-4 px-4 pt-6 text-center md:text-left">XAUUSD Chart Live - Real-Time Gold Price Tracking</h1>
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
            
            <h3 className="text-xl font-semibold text-gold mt-6 mb-3">Why Trade Gold (XAUUSD)?</h3>
            <p>Gold has been a valuable asset for centuries, serving as both a store of value and a hedge against economic uncertainty. As a trader or investor, understanding the XAU/USD market can provide significant opportunities:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Safe Haven Asset:</strong> Gold often performs well during times of economic uncertainty or market volatility.</li>
              <li><strong>Inflation Hedge:</strong> Historically, gold has maintained its value against inflation, making it an important portfolio diversification tool.</li>
              <li><strong>Liquidity:</strong> The gold market is highly liquid, allowing for easy entry and exit positions.</li>
              <li><strong>24-Hour Market:</strong> Gold trading is available nearly 24 hours a day, providing flexibility for traders worldwide.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gold mt-6 mb-3">How to Use Our Gold Price Charts</h3>
            <p>Our interactive XAUUSD charts provide powerful tools for technical analysis and market timing:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Multiple Timeframes:</strong> Analyze gold price movements across different time horizons, from 1-minute to monthly charts.</li>
              <li><strong>Technical Indicators:</strong> Apply popular indicators like Moving Averages, RSI, MACD, and Bollinger Bands to identify potential trading opportunities.</li>
              <li><strong>Drawing Tools:</strong> Use trend lines, Fibonacci retracements, and other drawing tools to map out potential support and resistance levels.</li>
              <li><strong>Price Alerts:</strong> Set custom alerts to notify you when gold reaches specific price levels.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gold mt-6 mb-3">Gold Market Fundamentals</h3>
            <p>Several key factors influence gold prices that every trader should monitor:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Central Bank Policies:</strong> Interest rate decisions and monetary policy statements from major central banks like the Federal Reserve.</li>
              <li><strong>Economic Data:</strong> Key economic indicators such as inflation rates, GDP growth, and employment figures.</li>
              <li><strong>Geopolitical Events:</strong> Political instability, conflicts, and trade tensions often drive safe-haven demand for gold.</li>
              <li><strong>US Dollar Strength:</strong> Gold typically has an inverse relationship with the US dollar.</li>
              <li><strong>Market Sentiment:</strong> Overall risk appetite in financial markets can influence gold's performance.</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
