import { Helmet } from 'react-helmet-async';
import PriceChart from '../components/PriceChart';

const Chart = () => {
  return (
    <>
      <Helmet>
        <title>XAUUSD Live Chart | Real-Time Gold Price Chart | XAU/USD Technical Analysis</title>
        <meta 
          name="description" 
          content="View real-time XAUUSD live chart with advanced technical indicators, multiple timeframes, and professional trading tools. Analyze gold price movements with precision." 
        />
        <meta name="keywords" content="XAUUSD live chart, gold price chart real time, XAU/USD chart, gold technical analysis, live gold chart, gold price tracker" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-6">Interactive Gold Price Charts</h1>
        <p className="text-navy-light mb-8">
          Analyze gold price movements with our professional charting tools. Our interactive charts 
          provide multiple timeframes, technical indicators, and drawing tools to help you make 
          informed trading decisions.
        </p>
        <PriceChart fullPage={true} />
      </div>
    </>
  );
};

export default Chart;
