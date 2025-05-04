import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { goldApi } from "@/api/goldApi";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentError, setComponentError] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // Generate fallback news data
  const generateFallbackNews = () => [
    {
      id: 1,
      title: "Fed Minutes Signal Rates to Stay Higher for Longer, Gold Prices React",
      summary: "The Federal Reserve meeting minutes indicated that interest rates may stay elevated longer than expected, putting pressure on non-yielding assets like gold.",
      source: "Financial Times",
      date: new Date().toISOString(),
      impact: "high",
      url: "https://www.investing.com/commodities/gold-news",
      category: "economic"
    },
    {
      id: 2,
      title: "Rising Inflation in Eurozone Boosts Gold's Appeal as Hedge",
      summary: "Higher than expected inflation figures from Europe have increased gold's attractiveness as an inflation hedge, pushing prices higher.",
      source: "Bloomberg",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      impact: "medium",
      url: "https://www.kitco.com/news/",
      category: "economic"
    },
    {
      id: 3,
      title: "Central Banks Continue Gold Buying Spree in Q1 2025",
      summary: "Central banks globally have continued their significant gold purchases in the first quarter, supporting prices and reflecting ongoing dedollarization trends.",
      source: "Reuters",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      impact: "medium",
      url: "https://goldprice.org/gold-news",
      category: "market"
    },
    {
      id: 4,
      title: "Gold Technical Analysis: Breakout Above Key Resistance Level",
      summary: "Gold prices have broken above a significant technical resistance level, suggesting potential for further upside movement in the near term.",
      source: "Trading View",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      impact: "medium",
      url: "https://www.tradingview.com/ideas/gold/",
      category: "market"
    },
    {
      id: 5,
      title: "Geopolitical Tensions in Middle East Support Safe Haven Demand",
      summary: "Escalating conflicts in the Middle East have increased demand for gold as investors seek safe haven assets amid rising uncertainty.",
      source: "Wall Street Journal",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      impact: "high",
      url: "https://www.gold.org/goldhub/research",
      category: "geopolitical"
    }
  ];

  // Initialize with fallback data
  useEffect(() => {
    setNews(generateFallbackNews());
  }, []);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await goldApi.getNews();
        // Check if data has a status property indicating an error
        if (data && data.status === 'error') {
          console.log('Using fallback news data due to API error:', data.message);
          // Use fallback data but don't show error in console
          setNews(generateFallbackNews());
          setError("Using sample news data");
        } else if (data && data.news && data.news.length > 0) {
          // Ensure all required fields are strings
          const processedNews = data.news.map(item => ({
            ...item,
            title: String(item.title || ''),
            summary: typeof item.summary === 'string' 
              ? item.summary 
              : typeof item.summary === 'object' && item.summary?.summary 
                ? String(item.summary.summary)
                : 'No summary available',
            source: String(item.source || ''),
            impact: String(item.impact || ''),
            category: String(item.category || ''),
            date: item.date || new Date().toISOString()
          }));
          setNews(processedNews);
          setError(null);
        } else {
          // Use fallback data for any other case
          setNews(generateFallbackNews());
          setError("Using sample news data");
        }
      } catch (error) {
        console.error("Error fetching gold news:", error);
        setNews(generateFallbackNews());
        setError("Failed to load gold-related news, using sample data");
      } finally {
        setLoading(false);
      }
    };

    try {
      fetchNews();
    } catch (e) {
      console.error("Component error in NewsSection:", e);
      setComponentError(true);
      setLoading(false);
    }
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return {
        formatted: format(date, "MMM d, yyyy"),
        relative: formatDistanceToNow(date, { addSuffix: true })
      };
    } catch (e) {
      console.error("Date parsing error:", e);
      return {
        formatted: "Recent",
        relative: "recently"
      };
    }
  };

  // Helper function to get badge color based on impact
  const getImpactColor = (impact) => {
    // Extract impact level if it's an object with a level property
    let impactValue = impact;
    
    // Handle object type impact (with level property)
    if (typeof impact === 'object' && impact !== null) {
      impactValue = impact.level || 'medium';
    } else if (typeof impact !== 'string') {
      // For any other non-string type
      impactValue = 'medium';
    }
    
    // Convert to string and lowercase for comparison
    const impactStr = String(impactValue).toLowerCase();
    
    // Return appropriate color class based on impact level
    switch (impactStr) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Render loading state
  if (loading && news.length === 0) {
    return (
      <section id="news" className="container mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-navy">Gold Market News - Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-navy-light">Loading latest news...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Render error state for catastrophic component error
  if (componentError) {
    return (
      <section id="news" className="container mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-navy">Gold Market News - Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center">
              <p className="text-red-500">Something went wrong loading the news component.</p>
              <p className="mt-2 text-navy-light">Please try refreshing the page.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="news" className="container mx-auto py-12 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-navy">Latest Gold Market Updates</CardTitle>
            {error && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                {error}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => {
                  const date = formatDate(item.date);
                  
                  // Extract impact value safely
                  let impactDisplay = "Unknown";
                  if (typeof item.impact === 'object' && item.impact !== null) {
                    impactDisplay = item.impact.level || "Medium";
                  } else if (typeof item.impact === 'string') {
                    impactDisplay = item.impact;
                  }
                  
                  return (
                    <TableRow 
                      key={item.id || Math.random().toString()}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedNews(item)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <p className="text-sm text-gray-500 mt-1 font-normal line-clamp-1">
                            {item.summary}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>
                        <span>{date.formatted}</span>
                        <p className="text-xs text-gray-500">{date.relative}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getImpactColor(item.impact)}>
                          {impactDisplay}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.category || "general"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Related Resources Section with External Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-navy mb-4">Related Gold Market Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-navy mb-2">Market Data</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://www.kitco.com/market/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Kitco Market Data</a></li>
                    <li><a href="https://www.investing.com/commodities/gold-historical-data" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Investing.com Historical Data</a></li>
                    <li><a href="https://www.gold.org/goldhub/data/gold-prices" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">World Gold Council Prices</a></li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-navy mb-2">Analysis & Research</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://www.gold.org/goldhub/research" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">World Gold Council Research</a></li>
                    <li><a href="https://www.tradingview.com/ideas/gold/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TradingView Gold Ideas</a></li>
                    <li><a href="https://www.forexlive.com/tag/gold/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ForexLive Gold Analysis</a></li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-navy mb-2">Trading Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://lnk.brokerinspect.com/trade-gold" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Trade Gold Online</a></li>
                    <li><a href="https://www.babypips.com/learn/forex/gold-trading" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">BabyPips Gold Trading Guide</a></li>
                    <li><a href="https://www.dailyfx.com/gold-price" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DailyFX Gold Trading</a></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-navy">{selectedNews.title}</h3>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                <span>{selectedNews.source}</span>
                <span>•</span>
                <span>{formatDate(selectedNews.date).formatted}</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Badge className={getImpactColor(selectedNews.impact)}>
                  {typeof selectedNews.impact === 'object' ? (selectedNews.impact.level || 'Medium') : selectedNews.impact}
                </Badge>
                <Badge variant="outline">
                  {selectedNews.category || "general"}
                </Badge>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <p className="text-navy-light whitespace-pre-line">
                  {selectedNews.summary}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <a 
                  href={selectedNews.url || "https://lnk.brokerinspect.com/trade-gold"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-navy text-white rounded hover:bg-navy-dark transition-colors"
                >
                  Read Full Article
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
