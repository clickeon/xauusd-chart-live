import { formatCurrency, getPriceChangeClass, getFormattedPriceChange } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = ({ priceData }) => {
  // Helper function to render price with loading/error states
  const renderPriceDisplay = () => {
    if (priceData.loading) {
      return <div className="animate-pulse bg-gray-200 h-14 w-48 rounded"></div>;
    }
    
    if (priceData.error) {
      return <div className="text-red-500">Unable to load price data</div>;
    }
    
    return (
      <div className="flex items-end">
        <span className="text-5xl md:text-6xl font-bold text-navy">
          {formatCurrency(priceData.price)}
        </span>
        <div className="ml-4 flex flex-col mb-1">
          <span className={`text-lg font-semibold ${getPriceChangeClass(priceData.change)}`}>
            {getFormattedPriceChange(priceData.change)}
          </span>
          <span className={`text-sm ${getPriceChangeClass(priceData.changePercent)}`}>
            {getFormattedPriceChange(priceData.changePercent)}%
          </span>
        </div>
      </div>
    );
  };

  // Market stats section removed as requested

  return (
    <section id="hero" className="pt-16 pb-12 md:pt-24 md:pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              XAUUSD <span className="text-gold">CHART LIVE</span>
            </h1>
            <p className="text-navy-light mb-8 max-w-2xl">
              Get real-time XAUUSD gold price updates, interactive charts, and expert trading signals.
              Track the market with professional tools designed for both novice and experienced traders.
            </p>
            
            {renderPriceDisplay()}
            
            <div className="mt-4 text-sm text-navy-light">
              Last updated: {priceData.timestamp ? new Date(priceData.timestamp).toLocaleString() : 'N/A'}
            </div>
            
            <div className="mt-6">
              <a 
                href="https://lnk.brokerinspect.com/trade-gold" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white gold-gradient rounded-md shadow-lg hover:opacity-90 transition-opacity"
              >
                Trade Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-2 animate-fade-up">
            <Card className="card-gold overflow-hidden">
              <div className="bg-navy p-4">
                <h3 className="text-white text-xl font-semibold">Connect to Trading Simulator</h3>
              </div>
              <CardContent className="p-6">
                <p className="mb-4 text-navy-light">
                  Practice your gold trading strategies in our risk-free simulation environment.
                  Apply what you've learned and test your skills with virtual trades.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Real-time price simulation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Risk-free practice trades</span>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Performance analytics</span>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href="https://lnk.brokerinspect.com/trade-gold" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 gold-gradient text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                  >
                    Open Trading Platform
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
