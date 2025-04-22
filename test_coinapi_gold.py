import requests
import json
from datetime import datetime

def test_coinapi_gold():
    """Test the CoinAPI service for accurate gold price data."""
    print(f"Testing CoinAPI at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # CoinAPI offers forex data which includes XAU/USD
    api_key = "5BD4-4359-9EAE-9C3A"  # This is a limited demo key for testing
    
    headers = {
        "X-CoinAPI-Key": api_key
    }
    
    try:
        # Endpoint for XAU/USD exchange rate
        url = "https://rest.coinapi.io/v1/exchangerate/XAU/USD"
        print(f"Requesting: {url}")
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response:")
            print(json.dumps(data, indent=2))
            print(f"Current Gold Price: ${data.get('rate', 'N/A')} USD")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")
    
    print("\n" + "-"*50 + "\n")
    
    # Let's also try an alternative approach - Alpha Vantage for precious metals
    try:
        alpha_key = "5X0AZAKZB8KMN0WI"  # Demo key for Alpha Vantage
        url = f"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey={alpha_key}"
        print(f"Requesting Alpha Vantage API: {url}")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response:")
            print(json.dumps(data, indent=2))
            if "Realtime Currency Exchange Rate" in data:
                rate = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
                print(f"Current Gold Price: ${rate} USD")
            else:
                print("Gold price not found in response structure")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_coinapi_gold()
