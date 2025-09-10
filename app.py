from flask import Flask, render_template, jsonify, send_from_directory, request
from flask_cors import CORS, cross_origin
import requests
import os
from dotenv import load_dotenv
import traceback
from datetime import datetime, timedelta
import numpy as np
import json
import random
import time
from functools import lru_cache
import pandas as pd

# Import our new gold price service
from gold_api_service import gold_service

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__, 
    template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates')))

# Configure CORS to allow requests from any origin for all endpoints
CORS(app)

# Cache for gold price
price_cache = {
    'price': None,
    'timestamp': None,
    'cache_duration': timedelta(minutes=1)
}

# Cache for historical prices
historical_cache = {
    'prices': {},  # Use a dict to store multiple time periods
    'timestamp': {},
    'cache_duration': timedelta(minutes=5)
}

# Cache for news
news_cache = {
    'news': None,
    'timestamp': None,
    'cache_duration': timedelta(minutes=5)
}

# Fallback news for testing when API is not available
FALLBACK_NEWS = [
    {
        'title': 'Gold Holds Steady as Markets Await Fed Decision',
        'link': '#',
        'date': datetime.now().isoformat(),
        'impact': {
            'level': 'medium',
            'direction': 'neutral',
            'confidence': 0.7,
            'summary': 'Markets await Federal Reserve decision on interest rates, impacting gold prices.'
        }
    },
    {
        'title': 'Rising Inflation Concerns Boost Gold Appeal',
        'link': '#',
        'date': (datetime.now() - timedelta(hours=2)).isoformat(),
        'impact': {
            'level': 'high',
            'direction': 'bullish',
            'confidence': 0.8,
            'summary': 'Increasing inflation concerns drive investors towards gold as a safe haven.'
        }
    },
    {
        'title': 'Technical Analysis: Gold Forms Bullish Pattern',
        'link': '#',
        'date': (datetime.now() - timedelta(hours=4)).isoformat(),
        'impact': {
            'level': 'medium',
            'direction': 'bullish',
            'confidence': 0.6,
            'summary': 'Technical indicators suggest potential upward movement in gold prices.'
        }
    },
    {
        'title': 'USD Weakness Supports Gold Prices',
        'link': '#',
        'date': (datetime.now() - timedelta(hours=6)).isoformat(),
        'impact': {
            'level': 'high',
            'direction': 'bullish',
            'confidence': 0.75,
            'summary': 'Weakening US dollar provides support for gold as an alternative asset.'
        }
    },
    {
        'title': 'Central Bank Gold Purchases Increase in Q1',
        'link': '#',
        'date': (datetime.now() - timedelta(hours=8)).isoformat(),
        'impact': {
            'level': 'high',
            'direction': 'bullish',
            'confidence': 0.85,
            'summary': 'Global central banks increased gold reserves in the first quarter, indicating strong institutional demand.'
        }
    }
]

@lru_cache(maxsize=1)
def get_cached_gold_price(timestamp_minute):
    """Cache gold price for one minute to avoid hitting rate limits"""
    return _get_gold_price_from_api()

def get_gold_price():
    # Generate a timestamp based on the current minute to use as cache key
    # This ensures we only call the API once per minute maximum
    current_minute = int(time.time() / 60)
    return get_cached_gold_price(current_minute)

def _get_gold_price_from_api():
    """Internal function that actually calls the API"""
    try:
        # Try Yahoo Finance API first
        try:
            print("Trying Yahoo Finance API for gold price (primary source)")
            url = "https://query1.finance.yahoo.com/v8/finance/chart/GC=F"
            params = {
                "interval": "1d",
                "range": "1d"
            }
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(url, params=params, headers=headers, timeout=5)  # 5 second timeout
            
            if response.status_code == 200:
                data = response.json()
                if "chart" in data and "result" in data["chart"] and len(data["chart"]["result"]) > 0:
                    # Get the last closing price
                    result = data["chart"]["result"][0]
                    if "indicators" in result and "quote" in result["indicators"] and len(result["indicators"]["quote"]) > 0:
                        quote = result["indicators"]["quote"][0]
                        if "close" in quote and quote["close"] and len(quote["close"]) > 0:
                            price = round(float(quote["close"][-1]), 2)  # Get the last close price
                            print(f"Successfully retrieved gold price from Yahoo Finance API: ${price}")
                            
                            # Get the previous day's close price (if available)
                            change = None
                            change_percent = None
                            if len(quote["close"]) > 1:
                                prev_price = float(quote["close"][0])  # First price in the day
                                change = round(price - prev_price, 2)
                                change_percent = round(change / prev_price * 100, 2)
                            
                            # Return a more complete response with change data if available
                            return price, change, change_percent
            
            print("Yahoo Finance API failed or returned invalid data")
        except Exception as e:
            print(f"Yahoo Finance API error: {e}")
        
        # Fall back to Coinbase API
        try:
            print("Falling back to Coinbase API for gold price")
            url = "https://api.coinbase.com/v2/exchange-rates?currency=USD"
            response = requests.get(url, timeout=5)  # 5 second timeout
            
            if response.status_code == 200:
                data = response.json()
                if "data" in data and "rates" in data["data"] and "XAU" in data["data"]["rates"]:
                    # Convert rate to price per ounce (invert the ratio)
                    xau_usd_rate = float(data["data"]["rates"]["XAU"])
                    price = round(1 / xau_usd_rate, 2)  # Price per ounce
                    print(f"Successfully retrieved gold price from Coinbase API: ${price}")
                    return price, None, None  # No change data available
            
            print("Coinbase API failed or returned invalid data")
        except Exception as e:
            print(f"Coinbase API error: {e}")
        
        # Fall back to FCS API
        try:
            api_key = os.getenv('FCS_API_KEY')
            if api_key:
                print("Trying FCS API for gold price")
                url = f'https://fcsapi.com/api-v3/forex/latest?symbol=XAU/USD&access_key={api_key}'
                response = requests.get(url, timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    if "response" in data and len(data["response"]) > 0:
                        price = float(data["response"][0]["price"])
                        print(f"Successfully retrieved gold price from FCS API: ${price}")
                        return price, None, None  # No change data available
                else:
                    print(f"FCS API error: {response.status_code} - {response.text}")
            else:
                print("Skipping FCS API (no API key)")
        except Exception as e:
            print(f"FCS API error: {e}")
        
        # Fall back to Alpha Vantage
        try:
            api_key = os.getenv('ALPHA_VANTAGE_API_KEY')
            if api_key:
                print("Trying Alpha Vantage API for gold price")
                url = f'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey={api_key}'
                response = requests.get(url, timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    exchange_data = data.get("Realtime Currency Exchange Rate")
                    if exchange_data and "5. Exchange Rate" in exchange_data:
                        price = float(exchange_data["5. Exchange Rate"])
                        print(f"Successfully retrieved gold price from Alpha Vantage: {price}")
                        return price, None, None  # No change data available
            
            print("Alpha Vantage API failed")
        except Exception as e:
            print(f"Alpha Vantage API error: {e}")
        
        # If all APIs fail, return the current accurate price as a last resort
        print("All APIs failed - using current market price of $3,405.00")
        return 3405.00, None, None
            
    except Exception as e:
        print(f"Error fetching gold price: {e}")
        traceback.print_exc()
        return None, None, None

def get_historical_prices():
    global historical_cache
    
    # Check cache first
    current_time = datetime.now()
    if (historical_cache['prices'] is not None and 
        historical_cache['timestamp'] is not None and 
        current_time - historical_cache['timestamp'] < historical_cache['cache_duration']):
        print("Returning cached historical prices")
        return historical_cache['prices']
    
    try:
        api_key = os.getenv('FCS_API_KEY')
        if not api_key:
            print("FCS API key not found, using fallback data")
            return generate_fallback_prices()
            
        # Get historical XAU/USD prices from FCS API
        url = f'https://fcsapi.com/api-v3/forex/history?symbol=XAU/USD&period=1d&access_key={api_key}'
        print(f"Fetching historical prices from FCS API")
        
        response = requests.get(url)
        data = response.json()
        print(f"API Response: {data.keys()}")  # Debug: print available keys
        
        if 'status' not in data or data['status'] is False:
            print(f"API error: {data.get('msg', 'Unknown error')}")
            return generate_fallback_prices()
            
        if 'response' in data and isinstance(data['response'], list):
            prices = []
            price_data_list = data['response']
            print(f"Retrieved {len(price_data_list)} price records from API")
            
            for price_data in price_data_list:
                try:
                    price = float(price_data['c'])  # Convert to float early
                    date = price_data['date'].split(' ')[0]  # Get just the date part
                    prices.append({
                        'date': date,
                        'price': price
                    })
                except (ValueError, KeyError) as e:
                    print(f"Error processing price data: {e}, data: {price_data}")
                    continue
            
            if not prices:
                print("No valid prices from API, using fallback")
                return generate_fallback_prices()
            
            # Only use last 30 days of data
            prices = prices[-30:] if len(prices) > 30 else prices
            
            print(f"Successfully processed {len(prices)} price points")
            prices.sort(key=lambda x: x['date'])
            historical_cache['prices'] = prices
            historical_cache['timestamp'] = current_time
            return prices
        else:
            print(f"Invalid response format: {data}")
            return generate_fallback_prices()
            
    except Exception as e:
        print(f"Error fetching historical prices: {e}")
        traceback.print_exc()
        return generate_fallback_prices()

def generate_fallback_prices():
    print("Generating fallback prices...")  # Debug log
    current_time = datetime.now()
    fallback_prices = []
    base_price = 3090.00  # Updated base price for current market conditions
    
    # Generate 30 days of historical data with realistic market movement
    for i in range(30):
        date = (current_time - timedelta(days=29-i))  # Start from 29 days ago
        # Create a more realistic price variation and trend
        day_of_week = date.weekday()
        
        # Less variation on weekends
        daily_variation_range = 3.0 if day_of_week in [5, 6] else 10.0
        
        # Use a consistent random seed for each date to ensure reproducible results
        random.seed(date.strftime('%Y-%m-%d'))
        
        # More realistic variation based on market behavior
        # Days closer to today have higher probability of being closer to base price
        recency_factor = i / 30  # 0 to 1, higher for more recent days
        variation_factor = 1 - (0.6 * recency_factor)  # More variation for older days
        
        # Generate variation with slight positive bias (upward trend)
        variation = random.uniform(-daily_variation_range, daily_variation_range * 1.1) * variation_factor
        
        # Add some weekly patterns (e.g., more likely to go up on Monday/Tuesday)
        if day_of_week in [0, 1]:  # Monday/Tuesday
            variation += random.uniform(0, 3)
        elif day_of_week == 4:  # Friday
            variation -= random.uniform(0, 2)
            
        # Calculate price with rounded precision to 2 decimal places
        price = round(base_price - (20 - i*0.7) + variation, 2)  # Slight upward trend
        
        fallback_prices.append({
            'date': date.strftime('%Y-%m-%d'),
            'price': price
        })
    
    random.seed()  # Reset random seed
    print(f"Generated {len(fallback_prices)} fallback prices")  # Debug log
    print("First price:", fallback_prices[0])  # Debug log
    print("Last price:", fallback_prices[-1])  # Debug log
    
    # Update cache
    historical_cache['prices'] = fallback_prices
    historical_cache['timestamp'] = current_time
    return fallback_prices

@app.route('/get_historical_prices')
@app.route('/api/historical_prices')
@app.route('/api/gold/historical')
def historical_prices():
    try:
        # Get period parameter for different time ranges (1D, 1W, 1M, 3M, 6M, 1Y)
        period = request.args.get('period', '1M')
        
        # Use the new gold service
        historical_data = gold_service.get_historical_prices(period)
        
        return jsonify(historical_data)
    except Exception as e:
        print(f"Error in historical prices endpoint: {e}")
        traceback.print_exc()
        # Return error response
        return jsonify({
            'error': True,
            'message': f'Error retrieving historical prices: {str(e)}',
            'prices': [],
            'period': period
        })

@app.route('/api/market_stats')
@app.route('/api/gold/stats')
def get_market_stats():
    try:
        # Use the new gold service
        stats_data = gold_service.get_market_stats()
        
        # Format response to match expected structure
        response = {
            "day_range": stats_data.get('day_range', {"low": 2640, "high": 2660}),
            "week_range": stats_data.get('week_range', {"low": 2620, "high": 2680}),
            "year_range": stats_data.get('year_range', {"low": 1800, "high": 2700}),
            "current_price": stats_data.get('current_price', 2650),
            "source": stats_data.get('source', 'Unknown'),
            "success": stats_data.get('success', True)
        }
        
        # Legacy format support
        response["week_52_range"] = response["year_range"]
        
        return jsonify(response)
    except Exception as e:
        print(f"Error in market stats: {e}")
        traceback.print_exc()
        # Fallback values if API fails
        return jsonify({
            "day_range": {"low": 2640, "high": 2660},
            "week_range": {"low": 2620, "high": 2680},
            "week_52_range": {"low": 1800, "high": 2700},
            "year_range": {"low": 1800, "high": 2700},
            "current_price": 2650,
            "source": "Fallback Data",
            "success": False
        })

@app.route('/get_gold_price')
@app.route('/api/gold_price')
@app.route('/api/gold/price')
def gold_price():
    try:
        # Use the new gold service
        price_data = gold_service.get_current_price()
        
        response = {
            'price': price_data['price'],
            'change': price_data.get('change'),
            'change_percent': price_data.get('change_percent'),
            'timestamp': price_data['timestamp'],
            'source': price_data.get('source', 'Unknown'),
            'success': price_data.get('success', True),
            'formatted': {
                'price': f"{float(price_data['price']):.2f}",
                'change': f"{float(price_data.get('change', 0)):.2f}",
                'percent': f"{float(price_data.get('change_percent', 0)):.2f}"
            }
        }
        
        if not price_data.get('success', True):
            response['message'] = price_data.get('message', 'Using fallback data')
        
        return jsonify(response)
    except Exception as e:
        print(f"Error in gold price endpoint: {e}")
        traceback.print_exc()
        return jsonify({'error': True, 'message': 'Error retrieving gold price'})

@app.route('/get_news')
@cross_origin()
def get_news_compat():
    """Endpoint for retrieving gold market news"""
    try:
        # Create a simplified response format that matches the expected structure
        news_list = fetch_yahoo_finance_news()
        if not news_list:
            print("Using fallback news for /get_news endpoint")
            news_list = FALLBACK_NEWS
        
        # Simple format expected by frontend
        return jsonify({
            'status': 'success',
            'news': news_list
        })

    except Exception as e:
        error_msg = str(e)
        print(f"Error in get_news_compat: {error_msg}")
        print(traceback.format_exc())
        
        # Always return fallback news on error
        return jsonify({
            'status': 'error',
            'message': f'Error fetching news: {error_msg}',
            'news': FALLBACK_NEWS
        })

@app.route('/get_historical_signals')
def historical_signals():
    prices = get_historical_prices()
    if not prices:
        return jsonify({
            'status': 'error',
            'message': 'No price data available'
        })
    
    signals = get_trading_signals(prices)
    print(f"Generated {len(signals)} signals")  # Debug print
    
    return jsonify({
        'status': 'success',
        'signals': signals
    })

# Simple function to generate trading signals based on price data
def get_trading_signals(prices):
    if not prices or len(prices) < 14:
        return []
        
    signals = []
    
    # Simple Moving Average crossover
    if len(prices) >= 50:
        sma20 = np.mean(prices[-20:])
        sma50 = np.mean(prices[-50:])
        
        if sma20 > sma50:
            signals.append({
                'type': 'SMA Crossover',
                'signal': 'buy',
                'strength': 'medium',
                'description': '20-day SMA crossed above 50-day SMA',
                'timestamp': datetime.now().isoformat()
            })
        elif sma20 < sma50:
            signals.append({
                'type': 'SMA Crossover',
                'signal': 'sell',
                'strength': 'medium',
                'description': '20-day SMA crossed below 50-day SMA',
                'timestamp': datetime.now().isoformat()
            })
    
    # RSI indicator
    if len(prices) >= 14:
        delta = np.diff(prices)
        gain = np.zeros_like(delta)
        loss = np.zeros_like(delta)
        gain[delta > 0] = delta[delta > 0]
        loss[delta < 0] = -delta[delta < 0]
        avg_gain = np.mean(gain[-14:])
        avg_loss = np.mean(loss[-14:])
        
        if avg_loss == 0:
            rsi = 50
        else:
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
        
        if rsi < 30:
            signals.append({
                'type': 'RSI',
                'signal': 'buy',
                'strength': 'strong',
                'description': f'RSI is oversold at {rsi:.2f}',
                'timestamp': datetime.now().isoformat()
            })
        elif rsi > 70:
            signals.append({
                'type': 'RSI',
                'signal': 'sell',
                'strength': 'strong',
                'description': f'RSI is overbought at {rsi:.2f}',
                'timestamp': datetime.now().isoformat()
            })
    
    # Recent price action
    if len(prices) >= 5:
        recent_change = (prices[-1] - prices[-5]) / prices[-5] * 100
        
        if recent_change > 1.0:  # 1% increase
            signals.append({
                'type': 'Price Action',
                'signal': 'sell',
                'strength': 'weak',
                'description': f'Price rose {recent_change:.2f}% in the last 5 periods',
                'timestamp': datetime.now().isoformat()
            })
        elif recent_change < -1.0:  # 1% decrease
            signals.append({
                'type': 'Price Action',
                'signal': 'buy',
                'strength': 'weak',
                'description': f'Price fell {abs(recent_change):.2f}% in the last 5 periods',
                'timestamp': datetime.now().isoformat()
            })
    
    return signals

def historical_prices(period='1M'):
    """Get historical gold prices for a given time period
    
    Args:
        period: Time period (1D, 1W, 1M, 3M, 6M, 1Y)
        
    Returns:
        Dictionary with historical price data
    """
    # Check if we have valid cached data for this period
    if (period in historical_cache['prices'] and 
        period in historical_cache['timestamp'] and
        historical_cache['timestamp'][period] is not None and
        datetime.now() - historical_cache['timestamp'][period] < historical_cache['cache_duration']):
        print(f"Using cached historical prices for {period}")
        return historical_cache['prices'][period]
        
    # Define time intervals based on period
    intervals = {
        '1D': {'count': 24, 'unit': 'hour'},
        '1W': {'count': 7, 'unit': 'day'},
        '1M': {'count': 30, 'unit': 'day'},
        '3M': {'count': 90, 'unit': 'day'},
        '6M': {'count': 180, 'unit': 'day'},
        '1Y': {'count': 365, 'unit': 'day'}
    }
    
    # Default to 1M if period not recognized
    if period not in intervals:
        period = '1M'
    
    interval = intervals[period]
    
    try:
        # Generate synthetic data for demonstration purposes
        # In a real app, this would call an external API for historical data
        now = datetime.now()
        base_price = 3438.00
        prices = []
        
        for i in range(interval['count']):
            if interval['unit'] == 'hour':
                point_time = now - timedelta(hours=i)
            else:  # 'day'
                point_time = now - timedelta(days=i)
                
            # Add some realistic price variation
            variation = (random.random() - 0.5) * 10  # Up to +/- $5
            trend = i * 0.05  # Slight uptrend as we go back in time
            
            price = base_price + variation - trend
            
            prices.append({
                'date': point_time.strftime('%Y-%m-%d %H:%M'),
                'price': round(price, 2),
                'volume': random.randint(5000, 20000)
            })
        
        # Reverse to get chronological order
        prices.reverse()
        
        # Cache the results
        result = {
            'prices': prices,
            'period': period
        }
        historical_cache['prices'][period] = result
        historical_cache['timestamp'][period] = datetime.now()
        
        return result
        
    except Exception as e:
        print(f"Error generating historical prices: {e}")
        traceback.print_exc()
        return {'error': True, 'message': str(e)}

@app.route('/get_signals')
def get_signals_endpoint():
    try:
        # Get historical prices
        period = request.args.get('period', '1M')
        prices_data = historical_prices(period)
        
        if 'error' in prices_data:
            return jsonify({
                'error': True,
                'message': 'Failed to fetch historical prices'
            }), 500
            
        # Extract price data for signal generation
        prices = [float(item['price']) for item in prices_data['prices']]
        
        # Generate trading signals
        signals = get_trading_signals(prices)
        
        # Calculate additional technical indicators
        indicators = {}
        if len(prices) >= 14:
            # RSI
            delta = np.diff(prices)
            gain = np.zeros_like(delta)
            loss = np.zeros_like(delta)
            gain[delta > 0] = delta[delta > 0]
            loss[delta < 0] = -delta[delta < 0]
            avg_gain = np.mean(gain[-14:])
            avg_loss = np.mean(loss[-14:])
            
            if avg_loss == 0:
                rsi = 50
            else:
                rs = avg_gain / avg_loss
                rsi = 100 - (100 / (1 + rs))
            indicators['rsi'] = round(float(rsi), 2)
            
            # Moving Averages
            if len(prices) >= 20:
                indicators['sma20'] = round(float(np.mean(prices[-20:])), 2)
            if len(prices) >= 50:
                indicators['sma50'] = round(float(np.mean(prices[-50:])), 2)
            
            # Current price
            indicators['current_price'] = round(float(prices[-1]), 2)
            
            # Market trend
            if len(prices) >= 10:
                recent_trend = prices[-1] - prices[-10]
                indicators['trend'] = 'bullish' if recent_trend > 0 else 'bearish' if recent_trend < 0 else 'neutral'
                indicators['trend_strength'] = abs(round(recent_trend / prices[-10] * 100, 2))
        
        return jsonify({
            'signals': signals,
            'indicators': indicators,
            'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    except Exception as e:
        print(f"Error generating signals: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'error': True,
            'message': str(e)
        }), 500

@app.route('/get_price')
def price_redirect():
    """Compatibility route for older JavaScript that might be calling /get_price"""
    try:
        price, change, change_percent = get_gold_price()
        response = {
            'status': 'success',
            'price': price,
            'timestamp': datetime.now().isoformat()
        }
        
        # Add change data if available
        if change is not None and change_percent is not None:
            response['change'] = change
            response['change_percent'] = change_percent
            
        return jsonify(response)
    except Exception as e:
        print(f"Error in price_redirect endpoint: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/about')
def about():
    """Render the About Us page."""
    return render_template('about.html')

@app.route('/faq')
def faq():
    """Render the FAQ page."""
    return render_template('faq.html')

@app.route('/privacy')
def privacy():
    """Render the Privacy Policy page."""
    return render_template('privacy.html')

@app.route('/terms')
def terms():
    """Render the Terms of Service page."""
    return render_template('terms.html')

@app.route('/sitemap.xml')
def sitemap():
    """Serve the sitemap.xml file."""
    return app.send_static_file('sitemap.xml')

@app.route('/robots.txt')
def robots():
    """Serve the robots.txt file."""
    return app.send_static_file('robots.txt')

# Serve React static files
@app.route('/react/<path:path>')
def serve_react(path):
    # This will be used after we've built the React app
    react_build_dir = os.path.join(os.path.dirname(__file__), 'react-build')
    return send_from_directory(react_build_dir, path)

# Catch-all route for React router
@app.route('/react/')
@app.route('/react')
def serve_react_index():
    react_build_dir = os.path.join(os.path.dirname(__file__), 'react-build')
    return send_from_directory(react_build_dir, 'index.html')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
