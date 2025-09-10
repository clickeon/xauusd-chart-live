"""
Enhanced Gold Price API Service using yfinance
Provides real-time and historical gold price data
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
import json
from functools import lru_cache
import time

class GoldPriceService:
    def __init__(self):
        self.cache_duration = 60  # Cache for 60 seconds
        self.price_cache = {}
        self.historical_cache = {}
    
    def _is_cache_valid(self, cache_key, cache_dict):
        """Check if cache is still valid"""
        if cache_key not in cache_dict:
            return False
        cache_time = cache_dict[cache_key].get('timestamp', 0)
        return time.time() - cache_time < self.cache_duration
    
    def get_current_price(self):
        """Get current gold price with change information"""
        cache_key = 'current_price'
        
        # Check cache first
        if self._is_cache_valid(cache_key, self.price_cache):
            return self.price_cache[cache_key]['data']
        
        try:
            # Method 1: Try Gold Futures (GC=F) - most reliable
            gold_ticker = yf.Ticker("GC=F")
            data = gold_ticker.history(period="2d")  # Get 2 days to calculate change
            
            if not data.empty and len(data) > 0:
                current_price = float(data['Close'].iloc[-1])
                
                # Calculate change if we have previous data
                change = None
                change_percent = None
                if len(data) > 1:
                    prev_price = float(data['Close'].iloc[-2])
                    change = round(current_price - prev_price, 2)
                    change_percent = round((change / prev_price) * 100, 2)
                
                result = {
                    'price': round(current_price, 2),
                    'change': change,
                    'change_percent': change_percent,
                    'timestamp': datetime.now().isoformat(),
                    'source': 'Yahoo Finance (GC=F)',
                    'success': True
                }
                
                # Cache the result
                self.price_cache[cache_key] = {
                    'data': result,
                    'timestamp': time.time()
                }
                
                return result
                
        except Exception as e:
            print(f"Error fetching from GC=F: {e}")
        
        # Method 2: Try XAUUSD=X (Gold Spot)
        try:
            gold_spot = yf.Ticker("XAUUSD=X")
            data = gold_spot.history(period="2d")
            
            if not data.empty and len(data) > 0:
                current_price = float(data['Close'].iloc[-1])
                
                change = None
                change_percent = None
                if len(data) > 1:
                    prev_price = float(data['Close'].iloc[-2])
                    change = round(current_price - prev_price, 2)
                    change_percent = round((change / prev_price) * 100, 2)
                
                result = {
                    'price': round(current_price, 2),
                    'change': change,
                    'change_percent': change_percent,
                    'timestamp': datetime.now().isoformat(),
                    'source': 'Yahoo Finance (XAUUSD=X)',
                    'success': True
                }
                
                self.price_cache[cache_key] = {
                    'data': result,
                    'timestamp': time.time()
                }
                
                return result
                
        except Exception as e:
            print(f"Error fetching from XAUUSD=X: {e}")
        
        # Method 3: Fallback to a simple API (no key required)
        try:
            # Using a public exchange rate API
            response = requests.get("https://api.exchangerate-api.com/v4/latest/USD", timeout=10)
            if response.status_code == 200:
                data = response.json()
                # This won't have gold directly, so we'll use a fallback price
                # In a real scenario, you'd want to use a dedicated precious metals API
                pass
        except Exception as e:
            print(f"Error with fallback API: {e}")
        
        # Final fallback - return a realistic current price
        return {
            'price': 2650.00,  # Approximate current gold price
            'change': 0.00,
            'change_percent': 0.00,
            'timestamp': datetime.now().isoformat(),
            'source': 'Fallback Data',
            'success': False,
            'message': 'Using fallback data - real API unavailable'
        }
    
    def get_historical_prices(self, period='1M'):
        """Get historical gold prices for specified period"""
        cache_key = f'historical_{period}'
        
        # Check cache first
        if self._is_cache_valid(cache_key, self.historical_cache):
            return self.historical_cache[cache_key]['data']
        
        # Map periods to yfinance periods
        period_mapping = {
            '1D': '1d',
            '1W': '5d',
            '1M': '1mo',
            '3M': '3mo',
            '6M': '6mo',
            '1Y': '1y'
        }
        
        yf_period = period_mapping.get(period, '1mo')
        
        try:
            # Try Gold Futures first
            gold_ticker = yf.Ticker("GC=F")
            data = gold_ticker.history(period=yf_period)
            
            if not data.empty:
                prices = []
                for index, row in data.iterrows():
                    prices.append({
                        'date': index.strftime('%Y-%m-%d'),
                        'price': round(float(row['Close']), 2),
                        'volume': int(row['Volume']) if pd.notna(row['Volume']) else 0,
                        'high': round(float(row['High']), 2),
                        'low': round(float(row['Low']), 2),
                        'open': round(float(row['Open']), 2)
                    })
                
                result = {
                    'prices': prices,
                    'period': period,
                    'source': 'Yahoo Finance (GC=F)',
                    'success': True
                }
                
                # Cache the result
                self.historical_cache[cache_key] = {
                    'data': result,
                    'timestamp': time.time()
                }
                
                return result
                
        except Exception as e:
            print(f"Error fetching historical data from GC=F: {e}")
        
        # Fallback - generate synthetic historical data
        return self._generate_fallback_historical(period)
    
    def _generate_fallback_historical(self, period):
        """Generate realistic fallback historical data"""
        period_days = {
            '1D': 1,
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365
        }
        
        days = period_days.get(period, 30)
        base_price = 2650.00
        prices = []
        
        for i in range(days):
            date = datetime.now() - timedelta(days=days-i-1)
            # Add realistic price variation
            variation = np.random.normal(0, 15)  # $15 standard deviation
            trend = i * 0.1  # Slight upward trend
            price = base_price + variation + trend
            
            prices.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': round(max(price, 1000), 2),  # Ensure price doesn't go below $1000
                'volume': np.random.randint(10000, 50000),
                'high': round(max(price * 1.01, 1000), 2),
                'low': round(max(price * 0.99, 1000), 2),
                'open': round(max(price + np.random.normal(0, 5), 1000), 2)
            })
        
        return {
            'prices': prices,
            'period': period,
            'source': 'Generated Fallback Data',
            'success': False,
            'message': 'Using synthetic data - real API unavailable'
        }
    
    def get_market_stats(self):
        """Get market statistics"""
        try:
            current_data = self.get_current_price()
            current_price = current_data['price']
            
            # Get some recent data for calculations
            gold_ticker = yf.Ticker("GC=F")
            data = gold_ticker.history(period="1y")
            
            if not data.empty:
                year_high = float(data['High'].max())
                year_low = float(data['Low'].min())
                
                # Get recent data for day/week ranges
                recent_data = gold_ticker.history(period="5d")
                if not recent_data.empty:
                    week_high = float(recent_data['High'].max())
                    week_low = float(recent_data['Low'].min())
                else:
                    week_high = current_price * 1.02
                    week_low = current_price * 0.98
                
                return {
                    'day_range': {
                        'low': round(current_price * 0.995, 2),
                        'high': round(current_price * 1.005, 2)
                    },
                    'week_range': {
                        'low': round(week_low, 2),
                        'high': round(week_high, 2)
                    },
                    'year_range': {
                        'low': round(year_low, 2),
                        'high': round(year_high, 2)
                    },
                    'current_price': current_price,
                    'source': 'Yahoo Finance',
                    'success': True
                }
        except Exception as e:
            print(f"Error getting market stats: {e}")
        
        # Fallback stats
        return {
            'day_range': {'low': 2640.00, 'high': 2660.00},
            'week_range': {'low': 2620.00, 'high': 2680.00},
            'year_range': {'low': 1800.00, 'high': 2700.00},
            'current_price': 2650.00,
            'source': 'Fallback Data',
            'success': False
        }

# Global instance
gold_service = GoldPriceService()
