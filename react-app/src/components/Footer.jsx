const Footer = () => {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">XAUUSD CHART LIVE</h3>
            <p className="text-gray-300 text-sm">
              The most comprehensive tool for gold price tracking, technical analysis, and market insights.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://twitter.com/xauusdchartlive" aria-label="Twitter" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path>
                </svg>
              </a>
              <a href="https://instagram.com/xauusdchartlive" aria-label="Instagram" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://linkedin.com/company/xauusdchartlive" aria-label="LinkedIn" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Charts Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/charts" className="hover:text-gold transition-colors" title="Live Gold Chart">Gold Chart</a></li>
              <li><a href="/charts/silver" className="hover:text-gold transition-colors" title="Live Silver Chart">Silver Chart</a></li>
              <li><a href="/charts/gold-silver-ratio" className="hover:text-gold transition-colors" title="Gold/Silver Ratio Chart">Gold/Silver Ratio</a></li>
              <li><a href="/historical-data" className="hover:text-gold transition-colors" title="Historical Gold Price Data">Historical Data</a></li>
              <li><a href="/charts/download" className="hover:text-gold transition-colors" title="Download Gold Charts">Download Charts</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://lnk.brokerinspect.com/trade-gold" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" title="Gold Trading Strategies">Trading Strategies</a></li>
              <li><a href="https://lnk.brokerinspect.com/trade-gold" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" title="Gold Trading Guide">Gold Trading Guide</a></li>
              <li><a href="https://lnk.brokerinspect.com/trade-gold" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" title="Trade Gold Now">Trade Gold Now</a></li>
              <li><a href="/analysis" className="hover:text-gold transition-colors" title="Gold Market Analysis">Market Analysis</a></li>
              <li><a href="/tools" className="hover:text-gold transition-colors" title="Gold Trading Tools">Trading Tools</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe to Updates</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get daily gold price updates and market analysis sent directly to your inbox.
            </p>
            <form className="flex mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-navy-light text-white px-4 py-2 rounded-l-md focus:outline-none w-full"
              />
              <button
                type="submit"
                className="gold-gradient px-4 py-2 rounded-r-md font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {new Date().getFullYear()} <strong>XAUUSD CHART LIVE</strong>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy-policy" className="text-gray-400 hover:text-gold text-sm transition-colors" title="Privacy Policy">Privacy Policy</a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-gold text-sm transition-colors" title="Terms of Service">Terms of Service</a>
            <a href="/disclaimer" className="text-gray-400 hover:text-gold text-sm transition-colors" title="Legal Disclaimer">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
