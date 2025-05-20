import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

// Components
import AhrefsAnalytics from './components/AhrefsAnalytics';
import SEOLinks from './components/SEOLinks';

// Pages
import Home from './pages/Home';
import Disclaimer from './pages/legal/Disclaimer';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import AboutUs from './pages/AboutUs';

// API
import { goldApi } from './api/goldApi';

/**
 * Main App component for XAUUSD Chart Live
 * Updated with additional SEO improvements and external links
 * Version 0.1.1 - May 2025
 */
function App() {
  // Get current location for dynamic canonical URLs
  const location = useLocation();
  
  // State for gold price data
  const [priceData, setPriceData] = useState({
    price: null,
    change: null,
    changePercent: null,
    timestamp: null,
    loading: true,
    error: null
  });

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
        setPriceData(prev => ({ 
          ...prev, 
          price: 2300.00,
          change: 0,
          changePercent: 0,
          timestamp: new Date().toISOString(),
          loading: false, 
          error: 'Failed to load current gold price' 
        }));
        
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

    try {
      fetchGoldPrice();
      const intervalId = setInterval(fetchGoldPrice, 30000);
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('Critical error in useEffect:', error);
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

  // Function to generate page-specific metadata based on the current route
  const getPageMetadata = () => {
    // Default metadata for homepage
    let metadata = {
      title: "XAUUSD Chart Live | Real-Time Gold Price Tracking | XAU/USD Analysis",
      description: "Track XAUUSD gold prices in real-time with professional interactive charts, expert trading signals, and comprehensive market analysis on XAUUSD Chart Live.",
      canonicalPath: ""
    };
    
    // Route-specific metadata
    switch(location.pathname) {
      case "/about-us":
        metadata = {
          title: "About Us | XAUUSD Chart Live | Gold Price Tracking",
          description: "Learn about the team behind XAUUSD Chart Live, our mission to provide the best gold price tracking tools, and our commitment to traders worldwide.",
          canonicalPath: "/about-us"
        };
        break;
      case "/disclaimer":
        metadata = {
          title: "Legal Disclaimer | XAUUSD Chart Live",
          description: "Important legal information and disclaimers regarding the use of XAUUSD Chart Live's gold price tracking tools and trading signals.",
          canonicalPath: "/disclaimer"
        };
        break;
      case "/terms-of-service":
        metadata = {
          title: "Terms of Service | XAUUSD Chart Live",
          description: "Terms and conditions for using XAUUSD Chart Live's gold price tracking platform and related services.",
          canonicalPath: "/terms-of-service"
        };
        break;
      case "/privacy-policy":
        metadata = {
          title: "Privacy Policy | XAUUSD Chart Live",
          description: "Learn how XAUUSD Chart Live collects, uses, and protects your personal information when using our gold price tracking platform.",
          canonicalPath: "/privacy-policy"
        };
        break;
      default:
        // Homepage or unknown routes use default metadata
        break;
    }
    
    return metadata;
  };
  
  const pageMetadata = getPageMetadata();
  
  return (
    <HelmetProvider>
      <AhrefsAnalytics />
      <div className="min-h-screen bg-navy">
        <Helmet>
          <title>{pageMetadata.title}</title>
          <meta name="description" content={pageMetadata.description} />
          <meta name="keywords" content="XAUUSD chart live, gold price chart, XAU/USD live chart, gold trading signals, precious metals, trading analysis, gold market news" />
          <link rel="canonical" href={`https://xauusd-chart-live.com${pageMetadata.canonicalPath}`} />
          <meta property="article:publisher" content="https://xauusd-chart-live.com" />
          <meta name="author" content="XAUUSD CHART LIVE" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        </Helmet>

        <SEOLinks />

        <Routes>
          <Route path="/" element={<Home priceData={priceData} />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}

export default App;
