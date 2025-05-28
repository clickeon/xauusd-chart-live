import { Helmet } from 'react-helmet-async';
import NewsSection from '../components/NewsSection';

const News = () => {
  return (
    <>
      <Helmet>
        <title>Gold Market News | XAUUSD Market Updates | Gold Price Analysis</title>
        <meta 
          name="description" 
          content="Stay updated with the latest gold market news, XAUUSD price analysis, and factors affecting gold prices. Get expert insights on economic events impacting the gold market." 
        />
        <meta name="keywords" content="gold market news, XAUUSD market updates, gold price analysis, gold market factors, precious metals news" />
        <link rel="canonical" href="https://xauusd-chart-live.com/news" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-6">Gold Market News</h1>
        <p className="text-navy-light mb-8">
          Stay informed with the latest gold market news, analysis, and insights. 
          Our expert team provides timely updates on economic events, geopolitical 
          developments, and market trends affecting gold prices.
        </p>
        <NewsSection fullPage={true} />
      </div>
    </>
  );
};

export default News;
