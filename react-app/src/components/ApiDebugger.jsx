import React, { useState, useEffect } from 'react';
import { goldApi } from '@/api/goldApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ApiDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: '',
    environment: '',
    currentPrice: null,
    historicalData: null,
    errors: [],
    lastUpdate: null
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Always show in production if API is failing, or in development
    const isDev = process.env.NODE_ENV === 'development';
    const hasError = debugInfo.errors.length > 0;
    const usingFallback = debugInfo.currentPrice?.source?.includes('Fallback') || 
                         debugInfo.currentPrice?.source?.includes('Emergency');
    setIsVisible(isDev || hasError || usingFallback);
  }, [debugInfo.errors, debugInfo.currentPrice]);

  const testApi = async () => {
    const errors = [];
    const timestamp = new Date().toISOString();
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? (import.meta.env.VITE_API_URL || 'https://xauusd-api.herokuapp.com')
      : 'http://localhost:8080';

    try {
      // Test current price
      console.log('Testing current price API...');
      const priceData = await goldApi.getCurrentPrice();
      
      // Test if we can reach the API directly
      try {
        const directTest = await fetch(`${apiUrl}/api/gold/price`);
        if (!directTest.ok) {
          errors.push(`Direct API test failed: ${directTest.status} ${directTest.statusText}`);
        }
      } catch (fetchError) {
        errors.push(`Cannot reach API: ${fetchError.message}`);
      }
      
      // Test historical data
      console.log('Testing historical data API...');
      const historicalData = await goldApi.getHistoricalPrices('1M');

      setDebugInfo({
        apiUrl: apiUrl,
        environment: process.env.NODE_ENV,
        currentPrice: priceData,
        historicalData: historicalData,
        errors: errors,
        lastUpdate: timestamp
      });

    } catch (error) {
      errors.push(`API Test Error: ${error.message}`);
      setDebugInfo(prev => ({
        ...prev,
        apiUrl: apiUrl,
        environment: process.env.NODE_ENV,
        errors: errors,
        lastUpdate: timestamp
      }));
    }
  };

  useEffect(() => {
    testApi();
    const interval = setInterval(testApi, 60000); // Test every minute
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-gray-900 text-white border-yellow-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            🔍 API Debug Info
            <button 
              onClick={() => setIsVisible(false)}
              className="ml-auto text-xs bg-red-600 px-2 py-1 rounded"
            >
              Hide
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-xs space-y-2">
          <div>
            <strong>Environment:</strong> {debugInfo.environment}
          </div>
          <div>
            <strong>API URL:</strong> {debugInfo.apiUrl}
          </div>
          <div>
            <strong>Current Price:</strong> 
            {debugInfo.currentPrice ? (
              <span className={debugInfo.currentPrice.source?.includes('Fallback') ? 'text-red-400' : 'text-green-400'}>
                ${debugInfo.currentPrice.price} ({debugInfo.currentPrice.source || 'Unknown source'})
              </span>
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}
          </div>
          <div>
            <strong>Historical Data:</strong> 
            {debugInfo.historicalData ? (
              <span className={debugInfo.historicalData.success === false ? 'text-red-400' : 'text-green-400'}>
                {debugInfo.historicalData.prices?.length || 0} points
                {debugInfo.historicalData.source && ` (${debugInfo.historicalData.source})`}
              </span>
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}
          </div>
          {debugInfo.errors.length > 0 && (
            <div>
              <strong className="text-red-400">Errors:</strong>
              <ul className="text-red-300 text-xs">
                {debugInfo.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-gray-400">
            Last updated: {debugInfo.lastUpdate ? new Date(debugInfo.lastUpdate).toLocaleTimeString() : 'Never'}
          </div>
          <button 
            onClick={testApi}
            className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Refresh Test
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDebugger;
