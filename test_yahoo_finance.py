import requests
import json
from datetime import datetime

def test_yahoo_finance():
    """Test the Yahoo Finance API via RapidAPI for gold price data."""
    print(f"Testing Yahoo Finance API at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # You'll need to sign up for a free RapidAPI account and subscribe to the Yahoo Finance API
    # A free tier is available that provides 500 requests per month
    rapid_api_key = "YOUR_RAPIDAPI_KEY"  # You would need to replace this with your actual key
    
    try:
        # Use a direct public API for gold price first (no API key required)
        # This uses a public gold price data source
        url = "https://www.live-rates.com/rates"
        print(f"Requesting public gold price API: {url}")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response received.")
            
            # Look for gold price data in the response
            gold_data = None
            for item in data:
                if "GOLD" in item.get("title", ""):
                    gold_data = item
                    break
            
            if gold_data:
                price = gold_data.get("rate", "N/A")
                print(f"Current Gold Price: ${price} USD per ounce")
                print("Full gold data entry:")
                print(json.dumps(gold_data, indent=2))
            else:
                print("Gold price not found in the response")
                print("Available items:")
                for item in data[:5]:  # Show first 5 items
                    print(f"- {item.get('title', 'Unknown')}")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")
    
    print("\n" + "-"*50 + "\n")
    
    # Let's also try a simple fallback approach for demonstration
    try:
        print("Trying alternative data source: Frankfurter API for XAU/USD rates")
        url = "https://api.frankfurter.app/latest?from=USD&to=XAU"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response:")
            print(json.dumps(data, indent=2))
            
            if "rates" in data and "XAU" in data["rates"]:
                xau_rate = data["rates"]["XAU"]
                # Convert to price per ounce (inverse of the rate)
                gold_price = 1 / xau_rate
                print(f"Current Gold Price (calculated): ${gold_price:.2f} USD per ounce")
            else:
                print("Gold price not found in response structure")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_yahoo_finance()
