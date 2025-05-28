import { Helmet } from 'react-helmet-async';
import SignalIndicator from '../components/SignalIndicator';

const Signals = () => {
  return (
    <>
      <Helmet>
        <title>Gold Trading Signals | XAUUSD Buy/Sell Indicators | Expert Gold Analysis</title>
        <meta 
          name="description" 
          content="Get professional gold trading signals with precise entry/exit points, stop-loss levels, and profit targets for XAUUSD. Our expert analysis helps maximize your gold trading profits." 
        />
        <meta name="keywords" content="gold trading signals, XAUUSD buy sell indicators, gold market analysis, XAU/USD trading strategy, gold price predictions" />
        <link rel="canonical" href="https://xauusd-chart-live.com/signals" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-6">Gold Trading Signals</h1>
        <p className="text-navy-light mb-8">
          Our professional gold trading signals provide precise entry and exit points, 
          stop-loss levels, and profit targets based on comprehensive technical and 
          fundamental analysis of the XAUUSD market.
        </p>
        <SignalIndicator fullPage={true} />
      </div>
    </>
  );
};

export default Signals;
