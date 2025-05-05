import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
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

  // Generate fallback news data
  const generateFallbackNews = () => [
    {
      id: 1,
      title: "Fed Minutes Signal Rates to Stay Higher for Longer, Gold Prices React",
      summary: "The Federal Reserve meeting minutes indicated that interest rates may stay elevated longer than expected, putting pressure on non-yielding assets like gold.",
      source: "Financial Times",
      date: new Date().toISOString(),
      impact: "high",
      url: "https://lnk.brokerinspect.com/trade-gold",
      category: "economic"
    },
    {
      id: 2,
      title: "Rising Inflation in Eurozone Boosts Gold's Appeal as Hedge",
      summary: "Higher than expected inflation figures from Europe have increased gold's attractiveness as an inflation hedge, pushing prices higher.",
      source: "Bloomberg",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      impact: "medium",
      url: "https://lnk.brokerinspect.com/trade-gold",
      category: "economic"
    },
    {
      id: 3,
      title: "Central Banks Continue Gold Buying Spree in Q1 2025",
      summary: "Central banks globally have continued their significant gold purchases in the first quarter, supporting prices and reflecting ongoing dedollarization trends.",
      source: "Reuters",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      impact: "medium",
      url: "https://lnk.brokerinspect.com/trade-gold",
      category: "market"
    },
    {
      id: 4,
      title: "Gold Technical Analysis: Breakout Above Key Resistance Level",
      summary: "Gold prices have broken above a significant technical resistance level, suggesting potential for further upside movement in the near term.",
      source: "Trading View",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      impact: "medium",
      url: "https://lnk.brokerinspect.com/trade-gold",
      category: "market"
    },
    {
      id: 5,
      title: "Geopolitical Tensions in Middle East Support Safe Haven Demand",
      summary: "Escalating conflicts in the Middle East have increased demand for gold as investors seek safe haven assets amid rising uncertainty.",
      source: "Wall Street Journal",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      impact: "high",
      url: "https://lnk.brokerinspect.com/trade-gold",
      category: "geopolitical"
    }
  ];

  // Initialize with fallback data
  useEffect(() => {
    setNews(generateFallbackNews());
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await goldApi.getNews();
        if (data && data.news && data.news.length > 0) {
          setNews(data.news);
          setError(null);
        } else {
          console.warn('Invalid or empty news data format, using fallback');
          setError("Using sample news data");
        }
      } catch (error) {
        console.error("Error fetching gold news:", error);
        setError("Failed to load gold-related news, using sample data");
        
        // Try legacy endpoint as fallback
        try {
          const legacyData = await goldApi.tryLegacyEndpoint('get_news');
          if (legacyData && legacyData.news && legacyData.news.length > 0) {
            // Format legacy news to match our expected format
            const formattedNews = legacyData.news.map((item, index) => {
              try {
                // Safely extract title
                const title = item.title || "Gold Market Update";
                
                // Determine impact level
                const impactLevel = item.impact?.level || 'medium';
                
                // Determine category based on title
                let category = 'market';
                const titleLower = title.toLowerCase();
                if (titleLower.includes('fed') || titleLower.includes('inflation') || titleLower.includes('rate')) {
                  category = 'economic';
                } else if (titleLower.includes('war') || titleLower.includes('conflict') || titleLower.includes('tension')) {
                  category = 'geopolitical';
                }
                
                // Ensure date is valid
                let dateStr = item.date;
                if (!dateStr) {
                  dateStr = new Date(Date.now() - index * 86400000).toISOString(); // Create staggered dates
                }
                
                return {
                  id: index + 1,
                  title,
                  summary: item.summary || 'No summary available',
                  source: item.source || 'Financial News',
                  date: dateStr,
                  impact: impactLevel,
                  url: item.link || 'https://lnk.brokerinspect.com/trade-gold',
                  category
                };
              } catch (itemError) {
                console.error('Error processing news item:', itemError);
                // Return a default news item if individual processing fails
                return {
                  id: index + 1,
                  title: "Gold Market Update",
                  summary: "Latest developments in the gold market",
                  source: "Financial News",
                  date: new Date(Date.now() - index * 86400000).toISOString(),
                  impact: "medium",
                  url: "https://lnk.brokerinspect.com/trade-gold",
                  category: "market"
                };
              }
            });
            
            if (formattedNews.length > 0) {
              setNews(formattedNews);
              setError(null);
            }
          }
        } catch (fallbackError) {
          console.error("Fallback news also failed:", fallbackError);
          // Already using fallback data from initial mount
        }
      } finally {
        setLoading(false);
      }
    };

    try {
      fetchNews();
    } catch (criticalError) {
      console.error("Critical error in news fetching:", criticalError);
      setLoading(false);
      // Already using fallback data from initial mount
    }
  }, []);

  // Format date for display
  const formatNewsDate = (dateString) => {
    try {
      if (!dateString) return "Recent";
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting news date:", error);
      return "Recent";
    }
  };
//
  // Format full date for tooltip/title
  const formatFullDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = parseISO(dateString);
      return format(date, "PPpp");
    } catch (error) {
      console.error("Error formatting full date:", error);
      return "";
    }
  };

  // Get impact variant safely - valid variants are predefined
  const getImpactVariant = (impact) => {
    try {
      const safeImpact = impact?.toLowerCase() || 'medium';
      if (['high', 'medium', 'low'].includes(safeImpact)) {
        return safeImpact;
      }
      return 'medium'; // Default fallback
    } catch (error) {
      console.error("Error getting impact variant:", error);
      return 'medium';
    }
  };

  // Get category variant safely - valid variants are predefined
  const getCategoryVariant = (category) => {
    try {
      const safeCategory = category?.toLowerCase() || 'market';
      if (['economic', 'geopolitical', 'market'].includes(safeCategory)) {
        return safeCategory;
      }
      return 'market'; // Default fallback
    } catch (error) {
      console.error("Error getting category variant:", error);
      return 'market';
    }
  };

  // Apply error boundary at component level
  if (componentError) {
    return (
      <section id="news" className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Latest <span className="text-gold">News</span> Affecting Gold
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">News display temporarily unavailable</p>
          <button 
            onClick={() => {
              setComponentError(false);
              setNews(generateFallbackNews());
              setLoading(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <section id="news" className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Latest <span className="text-gold">News</span> Affecting Gold
        </h2>
        <p className="text-center text-navy-light mb-8">
          Stay updated with the latest news and events impacting gold prices
        </p>
        <Card className="card-gold overflow-hidden animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-40 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Main render with error wrapping
  try {
    return (
      <section id="news" className="container mx-auto py-12 animate-fade-in">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Latest <span className="text-gold">News</span> Affecting Gold
        </h2>
        <p className="text-center text-navy-light mb-8">
          Stay updated with the latest news and events impacting gold prices
        </p>

        {error ? (
          <div className="text-center py-4 text-amber-500 mb-6">
            <p>{error}</p>
          </div>
        ) : null}

        <Card className="card-gold overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Date</TableHead>
                    <TableHead>Headline</TableHead>
                    <TableHead className="w-[100px]">Impact</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[100px]">Source</TableHead>
                    <TableHead className="w-[80px] text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news && news.length > 0 ? (
                    news.map((item) => {
                      try {
                        if (!item) return null;
                        
                        // Safe impact and category values
                        const safeImpact = getImpactVariant(item.impact);
                        const safeCategory = getCategoryVariant(item.category);
                        
                        return (
                          <TableRow key={item.id || Math.random().toString(36)} className="hover:bg-gold/5">
                            <TableCell className="font-medium" title={formatFullDate(item.date)}>
                              {formatNewsDate(item.date)}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{item.title || "Gold Market Update"}</div>
                              <div className="text-sm text-navy-light line-clamp-1">
                                {item.summary || "Recent developments in the gold market"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={safeImpact}>{safeImpact}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={safeCategory}>{safeCategory}</Badge>
                            </TableCell>
                            <TableCell>{item.source || "Financial News"}</TableCell>
                            <TableCell className="text-right">
                              <a
                                href={item.url || "https://lnk.brokerinspect.com/trade-gold"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gold/10 hover:bg-gold/20 text-navy"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                  <polyline points="15 3 21 3 21 9"></polyline>
                                  <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                              </a>
                            </TableCell>
                          </TableRow>
                        );
                      } catch (rowError) {
                        console.error("Error rendering news row:", rowError);
                        return null;
                      }
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No news articles available at this time.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableCaption>
                  Recent news affecting gold prices and market sentiment
                </TableCaption>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  } catch (renderError) {
    console.error('Critical render error in NewsSection:', renderError);
    setComponentError(true);
    return null;
  }
};

export default NewsSection;
