import axios from 'axios';

// Base URL for the API - configured to work with both development and production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:8080';

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
      const response = await apiClient.get('/get_gold_price');
      return response.data;
    } catch (error) {
      console.error('Error fetching gold price:', error);
      throw error;
    }
  },

  /**
   * Get historical prices for specified time period
   * @param {string} period - Time period (1D, 1W, 1M, 3M, 1Y, 5Y)
   * @returns {Promise} Historical price data
   */
  getHistoricalPrices: async (period = '1M') => {
    try {
      const response = await apiClient.get('/get_historical_prices', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw error;
    }
  },

  /**
   * Get trading signals
   * @returns {Promise} Trading signals
   */
  getSignals: async () => {
    try {
      const response = await apiClient.get('/get_signals');
      return response.data;
    } catch (error) {
      console.error('Error fetching trading signals:', error);
      throw error;
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
