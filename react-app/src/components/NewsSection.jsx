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

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await goldApi.getNews();
<<<<<<< HEAD
        console.log('Received news data:', data); // Debug log
        if (data && data.news && data.news.length > 0) {
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
          console.log('Processed news data:', processedNews); // Debug log
          setNews(processedNews);
=======
        if (data && data.news && data.news.length > 0) {
          setNews(data.news);
>>>>>>> 34ee5c60d49b89439745ac993e9de30c056ff51d
          setError(null);
        } else {
          console.warn('Invalid or empty news data format, using fallback');
          setError("Using sample news data");
        }
      } catch (error) {
        console.error("Error fetching gold news:", error);
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
<<<<<<< HEAD
    // Debug logging
    console.log('Impact value:', impact, 'Type:', typeof impact);
    
    // Handle all possible cases
    if (typeof impact !== 'string') {
      return "bg-blue-100 text-blue-800"; // Default color for non-string values
    }
    
    const impactValue = impact.toLowerCase();
    switch (impactValue) {
=======
    switch (impact?.toLowerCase()) {
>>>>>>> 34ee5c60d49b89439745ac993e9de30c056ff51d
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
                  return (
                    <TableRow key={item.id || Math.random().toString()}>
                      <TableCell className="font-medium">
                        <a 
                          href={item.url || "https://xauusd-chart-live.com"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-navy-light transition-colors"
                        >
                          {item.title}
<<<<<<< HEAD
                          <p className="text-sm text-gray-500 mt-1 font-normal">
                            {item.summary}
                          </p>
=======
                          <p className="text-sm text-gray-500 mt-1 font-normal">{item.summary}</p>
>>>>>>> 34ee5c60d49b89439745ac993e9de30c056ff51d
                        </a>
                      </TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>
                        <span>{date.formatted}</span>
                        <p className="text-xs text-gray-500">{date.relative}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getImpactColor(item.impact)}>
                          {item.impact || "Unknown"}
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
        </CardContent>
      </Card>
    </section>
  );
};

export default NewsSection;
