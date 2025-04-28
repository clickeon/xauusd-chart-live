import requests
import json
from datetime import datetime
import yfinance as yf

def test_gold_price_apis():
    """Test multiple approaches to get reliable gold price data."""
    print(f"Testing Gold Price APIs at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # APPROACH 1: Using yfinance (Yahoo Finance)
    print("\n===== APPROACH 1: Yahoo Finance (yfinance) =====")
    try:
        # Install yfinance if needed with: pip install yfinance
        print("Fetching GC=F (Gold Futures) from Yahoo Finance")
        gold_futures = yf.Ticker("GC=F")
        gold_data = gold_futures.history(period="1d")
        
        if not gold_data.empty:
            latest_price = gold_data['Close'].iloc[-1]
            print(f"Gold Futures Price: ${latest_price:.2f} USD")
            print(f"Data timestamp: {gold_data.index[-1]}")
            
            # Also try getting spot gold (directly as XAU/USD if available)
            print("\nFetching XAUUSD=X (Gold Spot) from Yahoo Finance")
            gold_spot = yf.Ticker("XAUUSD=X")
            spot_data = gold_spot.history(period="1d")
            
            if not spot_data.empty:
                spot_price = spot_data['Close'].iloc[-1]
                print(f"Gold Spot Price: ${spot_price:.2f} USD")
                print(f"Data timestamp: {spot_data.index[-1]}")
            else:
                print("No spot price data available")
        else:
            print("No gold futures data available")
    except Exception as e:
        print(f"Exception with yfinance: {e}")
    
    # APPROACH 2: Using FMP API (Financial Modeling Prep)
    print("\n===== APPROACH 2: Financial Modeling Prep API =====")
    try:
        # FMP offers a free tier with commodity data
        # Get API key at https://financialmodelingprep.com/developer/docs/
        fmp_api_key = "demo"  # Replace with actual key for production
        commodity_url = f"https://financialmodelingprep.com/api/v3/quote/XAUUSD?apikey={fmp_api_key}"
        
        print(f"Requesting: {commodity_url}")
        response = requests.get(commodity_url)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                print("Success! Gold price data received.")
                gold_data = data[0]
                price = gold_data.get("price", "N/A")
                print(f"Current Gold Price: ${price} USD per ounce")
                print(f"Day change: {gold_data.get('change', 'N/A')} ({gold_data.get('changesPercentage', 'N/A')}%)")
                print(f"Data timestamp: {gold_data.get('timestamp', 'N/A')}")
            else:
                print("No gold price data in response")
                print(f"Response: {data}")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception with FMP API: {e}")
    
    # APPROACH 3: Using a specialized gold price data source
    print("\n===== APPROACH 3: WorldGoldCouncil Data =====")
    try:
        # World Gold Council data
        url = "https://www.gold.org/goldhub/data/gold-prices"
        print(f"Checking data from: {url} (web scraping would be required)")
        print("Note: This would require beautiful soup or similar for implementation")
        
        # For a quick public API test
        print("\nTrying alternative data source: Coinbase API for XAU/USD")
        cb_url = "https://api.coinbase.com/v2/exchange-rates?currency=USD"
        response = requests.get(cb_url)
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data and "rates" in data["data"] and "XAU" in data["data"]["rates"]:
                # This gives the rate as USD per XAU, so we need to calculate the inverse
                rate = float(data["data"]["rates"]["XAU"])
                gold_price = 1 / rate
                print(f"Current Gold Price (from Coinbase): ${gold_price:.2f} USD per ounce")
            else:
                print("Gold price not found in Coinbase response")
        else:
            print(f"Error with Coinbase API: Status code {response.status_code}")
    except Exception as e:
        print(f"Exception with World Gold Council approach: {e}")

if __name__ == "__main__":
    test_gold_price_apis()
