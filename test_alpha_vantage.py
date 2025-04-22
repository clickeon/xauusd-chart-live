import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_alpha_vantage():
    """Test the Alpha Vantage API using the existing API key from your project."""
    print(f"Testing Alpha Vantage API at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Get the API key from the environment variable
    api_key = os.getenv('ALPHA_VANTAGE_API_KEY')
    
    if not api_key:
        print("No Alpha Vantage API key found in .env file")
        return
    
    print(f"Using API key: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        # Alpha Vantage for gold price (XAU/USD)
        url = f"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey={api_key}"
        print(f"Requesting: {url}")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Response received. Status code:", response.status_code)
            
            if "Realtime Currency Exchange Rate" in data:
                exchange_data = data["Realtime Currency Exchange Rate"]
                rate = exchange_data["5. Exchange Rate"] if "5. Exchange Rate" in exchange_data else "N/A"
                last_refreshed = exchange_data["6. Last Refreshed"] if "6. Last Refreshed" in exchange_data else "N/A"
                
                print("\nGold Price Information:")
                print("-" * 40)
                print(f"Current Gold Price: ${rate} USD per ounce")
                print(f"Last Updated: {last_refreshed}")
                print("-" * 40)
                
                # Show full response for debugging
                print("\nFull Response:")
                print(json.dumps(data, indent=2))
            else:
                print("Gold price data not found in response.")
                print("Response content:")
                print(json.dumps(data, indent=2))
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_alpha_vantage()
