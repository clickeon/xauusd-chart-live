#!/usr/bin/env python3
"""
Production Environment Checker for XAUUSD Gold Price API
Verifies that all dependencies and APIs are working correctly
"""

import sys
import traceback
from datetime import datetime

def check_dependencies():
    """Check if all required packages are installed"""
    print("🔍 Checking Python Dependencies...")
    
    required_packages = [
        'flask',
        'requests', 
        'flask_cors',
        'yfinance',
        'pandas',
        'numpy',
        'python_dotenv',
        'gunicorn'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - MISSING!")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n🚨 Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    print("✅ All dependencies installed!")
    return True

def check_yfinance_api():
    """Test if yfinance can fetch live gold data"""
    print("\n🔍 Testing yfinance API connection...")
    
    try:
        import yfinance as yf
        
        # Test Gold Futures
        gold_ticker = yf.Ticker("GC=F")
        data = gold_ticker.history(period="1d")
        
        if not data.empty:
            current_price = float(data['Close'].iloc[-1])
            print(f"✅ yfinance working - Current Gold Price: ${current_price:.2f}")
            return True, current_price
        else:
            print("❌ yfinance returned empty data")
            return False, None
            
    except Exception as e:
        print(f"❌ yfinance error: {e}")
        traceback.print_exc()
        return False, None

def check_gold_service():
    """Test the gold price service directly"""
    print("\n🔍 Testing Gold Price Service...")
    
    try:
        from gold_api_service import gold_service
        
        # Test current price
        price_data = gold_service.get_current_price()
        
        if price_data.get('success', False):
            print(f"✅ Gold Service working!")
            print(f"   Price: ${price_data['price']}")
            print(f"   Change: ${price_data.get('change', 'N/A')}")
            print(f"   Source: {price_data.get('source', 'Unknown')}")
            return True
        else:
            print(f"❌ Gold Service returned fallback data")
            print(f"   Message: {price_data.get('message', 'No message')}")
            return False
            
    except Exception as e:
        print(f"❌ Gold Service error: {e}")
        traceback.print_exc()
        return False

def check_flask_app():
    """Test if Flask app can start and serve APIs"""
    print("\n🔍 Testing Flask App...")
    
    try:
        from app import app
        
        with app.test_client() as client:
            # Test gold price endpoint
            response = client.get('/api/gold/price')
            
            if response.status_code == 200:
                data = response.get_json()
                if data and data.get('success', False):
                    print(f"✅ Flask API working!")
                    print(f"   Price: ${data['price']}")
                    print(f"   Source: {data.get('source', 'Unknown')}")
                    return True
                else:
                    print(f"❌ Flask API returned fallback data")
                    return False
            else:
                print(f"❌ Flask API error: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Flask App error: {e}")
        traceback.print_exc()
        return False

def check_internet_connectivity():
    """Check if server can reach external APIs"""
    print("\n🔍 Testing Internet Connectivity...")
    
    try:
        import requests
        
        # Test Yahoo Finance directly
        url = "https://query1.finance.yahoo.com/v8/finance/chart/GC=F"
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; XAUUSD-API/1.0)"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("✅ Can reach Yahoo Finance API")
            return True
        else:
            print(f"❌ Yahoo Finance API returned: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Internet connectivity error: {e}")
        return False

def main():
    """Run all production checks"""
    print("=" * 60)
    print("🏆 XAUUSD Production Environment Checker")
    print("=" * 60)
    print(f"⏰ Check time: {datetime.now().isoformat()}")
    print()
    
    checks = [
        ("Dependencies", check_dependencies),
        ("Internet Connectivity", check_internet_connectivity), 
        ("yfinance API", check_yfinance_api),
        ("Gold Service", check_gold_service),
        ("Flask App", check_flask_app)
    ]
    
    results = []
    
    for check_name, check_func in checks:
        try:
            if check_name == "yfinance API":
                result, price = check_func()
                results.append((check_name, result))
            else:
                result = check_func()
                results.append((check_name, result))
        except Exception as e:
            print(f"❌ {check_name} check failed: {e}")
            results.append((check_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for check_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {check_name}")
    
    print(f"\n🎯 Overall: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All checks passed! Production environment is ready.")
        sys.exit(0)
    else:
        print("🚨 Some checks failed. Fix issues before deploying.")
        sys.exit(1)

if __name__ == "__main__":
    main()
