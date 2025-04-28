import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { goldApi } from "@/api/goldApi";
import { formatCurrency } from "@/lib/utils";

const SignalIndicator = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentError, setComponentError] = useState(false);

  // Generate fallback signal data
  const generateFallbackSignals = () => [
    {
      type: "buy",
      strength: 4,
      timeframe: "short-term (1-5 days)",
      reason: "Golden cross on 4H chart, RSI showing oversold conditions",
      price: 2302.45,
      target: 2320.00,
      stopLoss: 2290.00
    },
    {
      type: "hold",
      strength: 3,
      timeframe: "medium-term (1-2 weeks)",
      reason: "Price consolidating near previous resistance, waiting for breakout confirmation",
      price: 2302.45,
      target: 2325.00,
      stopLoss: 2285.00
    },
    {
      type: "sell",
      strength: 2,
      timeframe: "short-term (1-5 days)",
      reason: "Short-term overbought on hourly chart, potential pullback expected",
      price: 2302.45,
      target: 2295.00,
      stopLoss: 2310.00
    }
  ];

  // Initialize with fallback data
  useEffect(() => {
    setSignals(generateFallbackSignals());
  }, []);
  
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const signals = await goldApi.getTradingSignals();
        if (signals && signals.length > 0) {
          setSignals(signals);
          setError(null);
        } else {
          console.warn('Invalid or empty signal data format, using fallback');
          setError("Using sample trading signals");
        }
      } catch (error) {
        console.error("Error fetching trading signals:", error);
        setError("Failed to load trading signals, using sample data");
        
        // Try legacy endpoint as fallback
        try {
          const legacyData = await goldApi.tryLegacyEndpoint('get_signals');
          if (legacyData && legacyData.signals && legacyData.signals.length > 0) {
            // Format legacy signals to match our expected format
            const formattedSignals = legacyData.signals.map(signal => {
              try {
                // Convert signal type
                let signalType = signal.signal?.toLowerCase() || 'hold';
                if (signalType === 'neutral') signalType = 'hold';
                if (!['buy', 'sell', 'hold'].includes(signalType)) signalType = 'hold';
                
                // Convert confidence to strength (1-5)
                const confidenceMap = {
                  'very low': 1,
                  'low': 2,
                  'medium': 3,
                  'high': 4,
                  'very high': 5
                };
                const confidence = signal.confidence?.toLowerCase() || 'medium';
                const strength = confidenceMap[confidence] || 3;
                
                // Format reason
                let reason = "";
                if (Array.isArray(signal.reason)) {
                  reason = signal.reason.join(". ");
                } else if (typeof signal.reason === 'string') {
                  reason = signal.reason;
                } else {
                  reason = "Market analysis based on technical indicators";
                }
                
                // Process price values safely
                const basePrice = parseFloat(signal.price) || 2300.00;
                let targetPrice = 0;
                try {
                  targetPrice = parseFloat(signal.predicted_movement?.target_price || 0);
                } catch (e) {
                  targetPrice = signalType === 'buy' ? basePrice * 1.01 : basePrice * 0.99;
                }
                
                return {
                  type: signalType,
                  strength,
                  timeframe: signal.predicted_movement?.timeframe || "short-term (1-5 days)",
                  reason,
                  price: basePrice,
                  target: targetPrice || (signalType === 'buy' ? basePrice * 1.01 : basePrice * 0.99),
                  stopLoss: basePrice * (signalType === 'buy' ? 0.99 : 1.01)
                };
              } catch (itemError) {
                console.error('Error processing signal item:', itemError);
                // Return a default signal if individual processing fails
                return {
                  type: "hold",
                  strength: 3,
                  timeframe: "short-term (1-5 days)",
                  reason: "Technical analysis suggests caution",
                  price: 2300.00,
                  target: 2310.00,
                  stopLoss: 2290.00
                };
              }
            });
            
            if (formattedSignals.length > 0) {
              setSignals(formattedSignals);
              setError(null);
            }
          }
        } catch (fallbackError) {
          console.error("Fallback signals also failed:", fallbackError);
          // Already using fallback data from initial mount
        }
      } finally {
        setLoading(false);
      }
    };

    try {
      fetchSignals();
    } catch (criticalError) {
      console.error("Critical error in signals fetching:", criticalError);
      setLoading(false);
      // Already using fallback data from initial mount
    }
  }, []);

  // Get appropriate styling for signal type
  const getSignalColor = (type) => {
    try {
      switch (type.toLowerCase()) {
        case 'buy':
          return 'buy';
        case 'sell':
          return 'sell';
        default:
          return 'hold';
      }
    } catch (error) {
      console.error('Error in getSignalColor:', error);
      return 'hold'; // Default fallback
    }
  };

  // Get visual representation of signal strength (1-5)
  const getStrengthIndicator = (strength) => {
    try {
      const safeStrength = Math.min(Math.max(parseInt(strength) || 3, 1), 5);
      
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-5 rounded ${
              i < safeStrength ? "bg-gold" : "bg-gray-200"
            }`}
          />
        ));
    } catch (error) {
      console.error('Error in getStrengthIndicator:', error);
      // Return a default strength indicator
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-5 rounded ${
              i < 3 ? "bg-gold" : "bg-gray-200"
            }`}
          />
        ));
    }
  };

  // Custom formatter for price display with error handling
  const formatPrice = (value) => {
    try {
      if (typeof value === 'number') {
        return value.toFixed(2);
      }
      return parseFloat(value || 0).toFixed(2);
    } catch (e) {
      return '0.00';
    }
  };

  // Apply error boundary at component level
  if (componentError) {
    return (
      <section id="signals" className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Trading <span className="text-gold">Signals</span> & Forecasts
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Signal display temporarily unavailable</p>
          <button 
            onClick={() => {
              setComponentError(false);
              setSignals(generateFallbackSignals());
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
      <section id="signals" className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Trading <span className="text-gold">Signals</span> & Forecasts
        </h2>
        <p className="text-center text-navy-light mb-8">
          Professional trading signals based on technical analysis and market conditions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-gold animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // Main render
  try {
    return (
      <section id="signals" className="container mx-auto py-12 animate-fade-in">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Trading <span className="text-gold">Signals</span> & Forecasts
        </h2>
        <p className="text-center text-navy-light mb-8">
          Professional trading signals based on technical analysis and market conditions
        </p>

        {error ? (
          <div className="text-center py-4 text-amber-500 mb-6">
            <p>{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {signals && signals.length > 0 ? (
            signals.map((signal, index) => {
              try {
                if (!signal) return null;
                
                // Safe signal type display
                const safeType = signal.type ? signal.type.toString().toLowerCase() : 'hold';
                
                return (
                  <Card key={index} className="card-gold overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gold/10">
                      <div>
                        <Badge variant={getSignalColor(safeType)} className="mb-1">
                          {safeType.toUpperCase()}
                        </Badge>
                        <CardTitle className="text-lg text-navy">
                          {signal.timeframe || 'Short-term'} Signal
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        {getStrengthIndicator(signal.strength)}
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <CardDescription className="text-navy-light mb-4">
                        {signal.reason || 'Based on technical analysis'}
                      </CardDescription>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                          <div className="text-navy-light">Entry Price</div>
                          <div className="font-semibold text-navy">
                            {formatCurrency(signal.price)}
                          </div>
                        </div>
                        <div>
                          <div className="text-navy-light">Target Price</div>
                          <div className={`font-semibold ${safeType === 'buy' ? 'text-green-600' : safeType === 'sell' ? 'text-red-600' : 'text-amber-600'}`}>
                            {formatCurrency(signal.target)}
                          </div>
                        </div>
                        <div>
                          <div className="text-navy-light">Potential Gain</div>
                          <div className="font-medium text-green-600">
                            {safeType === 'buy' 
                              ? `+${(((signal.target || 0) - (signal.price || 0)) / (signal.price || 1) * 100).toFixed(2)}%`
                              : safeType === 'sell'
                                ? `+${(((signal.price || 0) - (signal.target || 0)) / (signal.price || 1) * 100).toFixed(2)}%`
                                : '0.00%'}
                          </div>
                        </div>
                        <div>
                          <div className="text-navy-light">Stop Loss</div>
                          <div className="font-medium text-red-600">
                            {formatCurrency(signal.stopLoss)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gold/10">
                        <a 
                          href="https://lnk.brokerinspect.com/trade-gold" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:text-gold-dark transition-colors text-sm flex items-center"
                        >
                          <span>Execute this trade now</span>
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
                            className="ml-1"
                          >
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              } catch (itemError) {
                console.error('Error rendering signal item:', itemError);
                return null; // Skip failed items
              }
            })
          ) : (
            <div className="col-span-3 text-center py-8">
              <p>No trading signals available at this time. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    );
  } catch (renderError) {
    console.error('Critical render error in SignalIndicator:', renderError);
    setComponentError(true);
    return null;
  }
};

export default SignalIndicator;
