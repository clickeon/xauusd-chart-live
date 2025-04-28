import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import './index.css';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PriceChart from './components/PriceChart';
import SignalIndicator from './components/SignalIndicator';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';
import AhrefsAnalytics from './components/AhrefsAnalytics';

// API
import { goldApi } from './api/goldApi';

function App() {
  // State for gold price data
  const [priceData, setPriceData] = useState({
    price: null,
    change: null,
    changePercent: null,
    timestamp: null,
    loading: true,
    error: null
  });
  
  // Market stats section has been removed from UI

  // Fetch current gold price on component mount and set interval for updates
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const data = await goldApi.getCurrentPrice();
        if (data && data.price) {
          setPriceData({
            price: parseFloat(data.price),
            change: parseFloat(data.change || 0),
            changePercent: parseFloat(data.change_percent || 0),
            timestamp: data.timestamp || new Date().toISOString(),
            loading: false,
            error: null
          });
        } else {
          // Handle empty but successful response
          setPriceData(prev => ({
            ...prev,
            price: 2300.00, // Fallback price
            change: 0,
            changePercent: 0,
            timestamp: new Date().toISOString(),
            loading: false,
            error: 'Using fallback data'
          }));
        }
      } catch (error) {
        console.error('Failed to fetch gold price:', error);
        // Set fallback data to ensure the app still renders
        setPriceData(prev => ({ 
          ...prev, 
          price: 2300.00, // Fallback price
          change: 0,
          changePercent: 0,
          timestamp: new Date().toISOString(),
          loading: false, 
          error: 'Failed to load current gold price' 
        }));
        
        // Try legacy endpoint as fallback
        try {
          const legacyData = await goldApi.tryLegacyEndpoint('get_gold_price');
          if (legacyData && !legacyData.error && legacyData.price) {
            setPriceData({
              price: parseFloat(legacyData.price),
              change: parseFloat(legacyData.change || 0),
              changePercent: parseFloat(legacyData.change_percent || 0),
              timestamp: legacyData.timestamp || new Date().toISOString(),
              loading: false,
              error: null
            });
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
    };

    // Market stats fetching function removed as the section has been removed from UI

    // Initial fetch - wrapped in try/catch to prevent app crashing
    try {
      fetchGoldPrice();

      // Set interval for price updates (every 30 seconds)
      const intervalId = setInterval(fetchGoldPrice, 30000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('Critical error in useEffect:', error);
      // Even if everything fails, at least set some data so the app renders
      setPriceData({
        price: 2300.00,
        change: 0,
        changePercent: 0,
        timestamp: new Date().toISOString(),
        loading: false,
        error: 'Application error'
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <AhrefsAnalytics />
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>XAUUSD Chart Live | Real-Time Gold Price Tracking | XAU/USD Analysis</title>
          <meta name="description" content="Track XAUUSD gold prices in real-time with professional interactive charts, expert trading signals, and comprehensive market analysis on XAUUSD Chart Live." />
          <meta name="keywords" content="XAUUSD chart live, gold price chart, XAU/USD live chart, gold trading signals, precious metals, trading analysis, gold market news" />
          <link rel="canonical" href="https://xauusd-chart-live.com" />
          {/* Additional SEO metadata */}
          <meta property="article:publisher" content="https://xauusd-chart-live.com" />
          <meta name="author" content="XAUUSD CHART LIVE" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        </Helmet>

        <Navbar />

        <main>
          <HeroSection priceData={priceData} />
          <PriceChart />
          <SignalIndicator />
          <NewsSection />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
