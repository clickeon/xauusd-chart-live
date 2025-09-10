#!/usr/bin/env python3
"""
Test script to verify the gold price API is working correctly
"""

import requests
import json
import time

def test_api_endpoints():
    """Test all the API endpoints"""
    base_url = "http://localhost:8080"
    
    print("Testing Gold Price API Endpoints")
    print("=" * 50)
    
    # Test 1: Current Gold Price
    print("\n1. Testing Current Gold Price...")
    try:
        response = requests.get(f"{base_url}/api/gold/price", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: Gold Price = ${data['price']}")
            print(f"   Change: {data.get('change', 'N/A')}")
            print(f"   Change %: {data.get('change_percent', 'N/A')}%")
            print(f"   Source: {data.get('source', 'Unknown')}")
            print(f"   Success: {data.get('success', False)}")
        else:
            print(f"❌ FAILED: Status code {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 2: Historical Prices
    print("\n2. Testing Historical Prices (1 Week)...")
    try:
        response = requests.get(f"{base_url}/api/gold/historical?period=1W", timeout=10)
        if response.status_code == 200:
            data = response.json()
            prices = data.get('prices', [])
            print(f"✅ SUCCESS: Retrieved {len(prices)} data points")
            if prices:
                print(f"   First price: ${prices[0]['price']} on {prices[0]['date']}")
                print(f"   Last price: ${prices[-1]['price']} on {prices[-1]['date']}")
            print(f"   Source: {data.get('source', 'Unknown')}")
            print(f"   Success: {data.get('success', False)}")
        else:
            print(f"❌ FAILED: Status code {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Market Stats
    print("\n3. Testing Market Stats...")
    try:
        response = requests.get(f"{base_url}/api/gold/stats", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: Market Stats Retrieved")
            print(f"   Day Range: ${data.get('day_range', {}).get('low', 'N/A')} - ${data.get('day_range', {}).get('high', 'N/A')}")
            print(f"   Year Range: ${data.get('year_range', {}).get('low', 'N/A')} - ${data.get('year_range', {}).get('high', 'N/A')}")
            print(f"   Current Price: ${data.get('current_price', 'N/A')}")
            print(f"   Source: {data.get('source', 'Unknown')}")
            print(f"   Success: {data.get('success', False)}")
        else:
            print(f"❌ FAILED: Status code {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")

if __name__ == "__main__":
    test_api_endpoints()
