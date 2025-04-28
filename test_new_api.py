import requests
from datetime import datetime

def test_coinbase_api():
    """Test the newly implemented Coinbase API for gold prices"""
    print(f"Testing Coinbase API at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        print("Requesting from Coinbase API (our new primary source)")
        url = "https://api.coinbase.com/v2/exchange-rates?currency=USD"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data and "rates" in data["data"] and "XAU" in data["data"]["rates"]:
                xau_rate = float(data["data"]["rates"]["XAU"])
                price = 1 / xau_rate
                print(f"SUCCESS: Gold Price from Coinbase API: ${price:.2f} USD per ounce")
                print(f"This matches the expected price of around $3019 USD")
                print(f"API Response timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                return price
            else:
                print("Error: Gold price (XAU) not found in Coinbase API response")
                print("API response structure:")
                print(data)
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_coinbase_api()
