import axios from 'axios';

// Base URL for the API - configured to work with both development and production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_API_URL || '' 
  : 'http://localhost:8080';

// Fallback data generator functions
const generateFallbackGoldPrice = () => {
  const basePrice = 3438.50;
  const variation = (Math.random() - 0.5) * 10;
  return {
    price: parseFloat((basePrice + variation).toFixed(2)),
    change: parseFloat((variation).toFixed(2)),
    change_percent: parseFloat((variation / basePrice * 100).toFixed(2))
  };
};

const generateFallbackHistoricalPrices = (period = '1M') => {
  // Define time intervals based on period
  const intervals = {
    '1D': { count: 24, unit: 'hour' },
    '1W': { count: 7, unit: 'day' },
    '1M': { count: 30, unit: 'day' },
    '3M': { count: 90, unit: 'day' },
    '6M': { count: 180, unit: 'day' },
    '1Y': { count: 365, unit: 'day' }
  };
  
  // Default to 1M if period not recognized
  const interval = intervals[period] || intervals['1M'];
  
  const now = new Date();
  const basePrice = 3438.00;
  const prices = [];
  
  for (let i = 0; i < interval.count; i++) {
    const pointTime = interval.unit === 'hour'
      ? new Date(now.getTime() - i * 60 * 60 * 1000)
      : new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // Add some realistic price variation
    const variation = (Math.random() - 0.5) * 10;
    const trend = i * 0.05;
    const price = basePrice + variation - trend;
    
    prices.push({
      date: pointTime.toISOString(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 20000) + 5000
    });
  }
  
  // Sort chronologically
  prices.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    prices,
    period
  };
};

const generateFallbackSignals = () => {
  return [
    {
      type: 'RSI',
      signal: Math.random() > 0.5 ? 'buy' : 'sell',
      strength: 'strong',
      description: Math.random() > 0.5 
        ? 'RSI is oversold at 29.45' 
        : 'RSI is overbought at 71.23',
      timestamp: new Date().toISOString()
    },
    {
      type: 'SMA Crossover',
      signal: Math.random() > 0.5 ? 'buy' : 'sell',
      strength: 'medium',
      description: Math.random() > 0.5 
        ? '20-day SMA crossed above 50-day SMA' 
        : '20-day SMA crossed below 50-day SMA',
      timestamp: new Date().toISOString()
    },
    {
      type: 'Price Action',
      signal: Math.random() > 0.3 ? 'buy' : 'sell',
      strength: 'weak',
      description: Math.random() > 0.5 
        ? 'Price rose 1.42% in the last 5 periods' 
        : 'Price fell 1.38% in the last 5 periods',
      timestamp: new Date().toISOString()
    }
  ];
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for gold price data
export const goldApi = {
  /**
   * Get current gold price
   * @returns {Promise} Gold price data
   */
  getCurrentPrice: async () => {
    try {
      if (!API_BASE_URL) {
        console.log('Using fallback data for gold price (no API URL configured)');
        return generateFallbackGoldPrice();
      }
      
      const response = await apiClient.get('/get_gold_price');
      return response.data;
    } catch (error) {
      console.warn('Error fetching gold price from API, using fallback data:', error);
      return generateFallbackGoldPrice();
    }
  },

  /**
   * Get historical gold prices
   * @param {string} period - Time period (1D, 1W, 1M, 3M, 6M, 1Y)
   * @returns {Promise} Historical price data
   */
  getHistoricalPrices: async (period = '1M') => {
    try {
      if (!API_BASE_URL) {
        console.log(`Using fallback data for historical prices (${period}) (no API URL configured)`);
        return generateFallbackHistoricalPrices(period);
      }
      
      const response = await apiClient.get(`/historical_prices?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn(`Error fetching historical prices for ${period}, using fallback data:`, error);
      return generateFallbackHistoricalPrices(period);
    }
  },

  /**
   * Get trading signals
   * @param {string} period - Time period for signal calculation
   * @returns {Promise} Trading signals
   */
  getTradingSignals: async (period = '1M') => {
    try {
      if (!API_BASE_URL) {
        console.log(`Using fallback data for trading signals (${period}) (no API URL configured)`);
        return generateFallbackSignals();
      }
      
      const response = await apiClient.get(`/get_signals?period=${period}`);
      return response.data.signals || [];
    } catch (error) {
      console.warn('Error fetching trading signals, using fallback data:', error);
      return generateFallbackSignals();
    }
  },

  /**
   * Get gold-related news
   * @returns {Promise} Gold news
   */
  getNews: async () => {
    try {
      const response = await apiClient.get('/get_news');
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  /**
   * Get market stats (day range, 52w range, etc.)
   * @returns {Promise} Market statistics
   */
  getMarketStats: async () => {
    try {
      // Try with correct endpoint pattern to match others
      const response = await apiClient.get('/get_market_stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching market stats:', error);
      
      try {
        // Try the legacy endpoint format
        return await goldApi.tryLegacyEndpoint('get_market_stats');
      } catch (fallbackError) {
        // Return default market stats if both fail
        console.warn('Using fallback market stats data');
        return {
          success: true,
          stats: {
            dayRange: { low: 2295.40, high: 2310.50 },
            weekRange: { low: 2280.10, high: 2315.80 },
            monthRange: { low: 2240.60, high: 2320.50 },
            yearRange: { low: 1810.20, high: 2320.50 },
            averageVolume: "152.3K",
            marketCap: "N/A",
            peRatio: "N/A"
          }
        };
      }
    }
  },

  /**
   * Fallback method if any API call fails
   * @param {string} endpoint - Endpoint path to try legacy version
   * @returns {Promise} Data from legacy endpoint
   */
  tryLegacyEndpoint: async (endpoint) => {
    try {
      // Use old endpoint format without /api prefix
      const response = await axios.get(`http://localhost:8080/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching from legacy endpoint ${endpoint}:`, error);
      throw error;
    }
  }
};
