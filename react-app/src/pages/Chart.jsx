import { Helmet } from 'react-helmet-async';
import PriceChart from '../components/PriceChart';

const Chart = () => {
  return (
    <>
      <Helmet>
        <title>Gold Price Charts | Interactive XAUUSD Technical Analysis | XAU/USD Charts</title>
        <meta 
          name="description" 
          content="Analyze gold price movements with our interactive XAUUSD charts featuring multiple timeframes, technical indicators, and drawing tools for precise gold trading analysis." 
        />
        <meta name="keywords" content="gold price charts, XAUUSD technical analysis, XAU/USD chart patterns, gold price forecasting, interactive gold charts" />
        <link rel="canonical" href="https://xauusd-chart-live.com/chart" />
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
