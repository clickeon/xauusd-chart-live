import React from 'react';

/**
 * SEOLinks component provides static links for search engines
 * This helps address the "Page has no outgoing links" error in Ahrefs
 * These links will be visible to search engines even when JavaScript is disabled
 * 
 * Reason: We're hiding this visually from users while keeping it accessible to search engines
 */
const SEOLinks = () => {
  return (
    <div className="seo-links" aria-hidden="true" style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
      <div className="container mx-auto px-4">
        <div className="text-xs text-gray-500 mb-2">Quick Links:</div>
        <nav aria-label="SEO Navigation">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
            <li><a href="/" title="XAUUSD Chart Live Home" className="hover:text-gold transition-colors">Home</a></li>
            <li><a href="/#price-chart" title="Live Gold Price Chart" className="hover:text-gold transition-colors">Gold Price Chart</a></li>
            <li><a href="/#trading-signals" title="Gold Trading Signals" className="hover:text-gold transition-colors">Trading Signals</a></li>
            <li><a href="/#market-news" title="Gold Market News" className="hover:text-gold transition-colors">Market News</a></li>
            <li><a href="/#about-gold" title="Understanding Gold Trading" className="hover:text-gold transition-colors">About Gold Trading</a></li>
            <li><a href="/about-us" title="About XAUUSD Chart Live" className="hover:text-gold transition-colors">About Us</a></li>
            <li><a href="/privacy-policy" title="Privacy Policy" className="hover:text-gold transition-colors">Privacy Policy</a></li>
            <li><a href="/terms-of-service" title="Terms of Service" className="hover:text-gold transition-colors">Terms of Service</a></li>
            <li><a href="/disclaimer" title="Legal Disclaimer" className="hover:text-gold transition-colors">Disclaimer</a></li>
            <li><a href="https://lnk.brokerinspect.com/trade-gold" rel="noopener noreferrer" target="_blank" title="Trade Gold Online" className="hover:text-gold transition-colors">Trade Gold</a></li>
            <li><a href="https://www.investing.com/commodities/gold" rel="noopener noreferrer" target="_blank" title="Gold on Investing.com" className="hover:text-gold transition-colors">Investing.com Gold</a></li>
            <li><a href="https://www.kitco.com/charts/livegold.html" rel="noopener noreferrer" target="_blank" title="Kitco Gold Charts" className="hover:text-gold transition-colors">Kitco Charts</a></li>
            <li><a href="https://www.reuters.com/markets/commodities/gold/" rel="noopener noreferrer" target="_blank" title="Reuters Gold News" className="hover:text-gold transition-colors">Reuters Gold</a></li>
            <li><a href="https://www.lbma.org.uk/prices-and-data/precious-metal-prices" rel="noopener noreferrer" target="_blank" title="LBMA Gold Prices" className="hover:text-gold transition-colors">LBMA Prices</a></li>
            <li><a href="https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm" rel="noopener noreferrer" target="_blank" title="CFTC Gold Reports" className="hover:text-gold transition-colors">CFTC Reports</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SEOLinks;
