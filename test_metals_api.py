import requests
import json
from datetime import datetime

def test_metals_api():
    """Test the Metals-API service for accurate gold prices."""
    print(f"Testing Metals-API at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # You can get a free API key by signing up at https://metals-api.com/
    # This is a limited test key that might work for demonstration purposes
    api_key = "gln7ssqrk86d2zdofn2zcxccl6v5ivh1g8vp5r1tbzxa79yt97d1p4fes3qn"
    
    try:
        # Base URL for the metals API
        url = f"https://metals-api.com/api/latest?access_key={api_key}&base=USD&symbols=XAU"
        print(f"Requesting: {url}")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response:")
            print(json.dumps(data, indent=2))
            
            # The API returns rates as USD per ounce, so we need to calculate the inverse
            if 'rates' in data and 'XAU' in data['rates']:
                # Convert to price per ounce (inverse of the rate)
                gold_price = 1 / data['rates']['XAU']
                print(f"Current Gold Price: ${gold_price:.2f} USD per ounce")
            else:
                print("Gold price not found in response structure")
        else:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception occurred: {e}")
    
    print("\n" + "-"*50 + "\n")
    
    # Let's also try an alternative free API
    try:
        url = "https://www.goldapi.io/api/XAU/USD"
        headers = {
            "x-access-token": "goldapi-jcl3d6skltdgf-io",
            "Content-Type": "application/json"
        }
        print(f"Requesting alternative API: {url}")
        response = requests.get(url, headers=headers)
        
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

if __name__ == "__main__":
    test_metals_api()
