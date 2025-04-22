import requests
import json
from datetime import datetime

def test_gold_api():
    """Test the Gold-API.com service to see if it provides accurate gold prices."""
    print(f"Testing Gold-API.com at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test endpoint 1 - Main API
    try:
        url = "https://api.gold-api.com/XAU/USD"
        print(f"Requesting: {url}")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response:")
            print(json.dumps(data, indent=2))
            print(f"Current Gold Price: ${data.get('price', 'N/A')} USD")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")
    
    print("\n" + "-"*50 + "\n")
    
    # Test endpoint 2 - Alternative approach
    try:
        url = "https://api.gold-api.com/latest"
        print(f"Requesting: {url}")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response:")
            print(json.dumps(data, indent=2))
            if 'XAU' in data and 'USD' in data['XAU']:
                print(f"Current Gold Price: ${data['XAU']['USD']} USD")
            else:
                print("Gold price not found in response structure")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_gold_api()
