import React from 'react';

/**
 * SEOLinks component provides static links for search engines
 * This helps address the "Page has no outgoing links" error in Ahrefs
 * These links will be visible to search engines even when JavaScript is disabled
 */
const SEOLinks = () => {
  const linkStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0'
  };

  return (
    <div className="seo-links" aria-hidden="true">
      <div style={linkStyle}>
        <h1>XAUUSD CHART LIVE | Gold Price Tracker | Real-Time XAU/USD Charts</h1>
        <p>
          Track XAUUSD gold prices in real-time with professional interactive charts, 
          expert trading signals, and comprehensive market analysis on XAUUSD Chart Live.
        </p>
        <nav>
          <ul>
            <li><a href="/" title="XAUUSD Chart Live Home">Home</a></li>
            <li><a href="/charts" title="Live Gold Chart">Gold Charts</a></li>
            <li><a href="/charts/silver" title="Live Silver Chart">Silver Charts</a></li>
            <li><a href="/news" title="Gold Market News">Gold News</a></li>
            <li><a href="/signals" title="Gold Trading Signals">Trading Signals</a></li>
            <li><a href="/analysis" title="Gold Market Analysis">Market Analysis</a></li>
            <li><a href="/historical-data" title="Historical Gold Price Data">Historical Data</a></li>
            <li><a href="/about" title="About XAUUSD Chart Live">About Us</a></li>
            <li><a href="/contact" title="Contact XAUUSD Chart Live">Contact</a></li>
            <li><a href="/privacy-policy" title="Privacy Policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service" title="Terms of Service">Terms of Service</a></li>
            <li><a href="/disclaimer" title="Legal Disclaimer">Disclaimer</a></li>
            <li><a href="https://lnk.brokerinspect.com/trade-gold" rel="noopener noreferrer" title="Trade Gold Online">Trade Gold</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SEOLinks;
