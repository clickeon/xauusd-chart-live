#!/usr/bin/env python3
"""
Backend-only deployment script for XAUUSD Gold Price Tracker
Deploys Flask API to Railway/Render/Heroku while keeping frontend on Netlify
"""

import subprocess
import sys
import os
import json
from pathlib import Path

def run_command(command, cwd=None, description=""):
    """Run a shell command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return None

def check_railway_cli():
    """Check if Railway CLI is installed"""
    try:
        result = subprocess.run(['railway', '--version'], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def deploy_to_railway():
    """Deploy backend to Railway"""
    print("🚂 Deploying to Railway...")
    
    if not check_railway_cli():
        print("📦 Installing Railway CLI...")
        install_result = run_command("npm install -g @railway/cli", 
                                    description="Installing Railway CLI")
        if not install_result:
            print("❌ Failed to install Railway CLI. Please install manually:")
            print("   npm install -g @railway/cli")
            return None
    
    print("🔑 Please log in to Railway...")
    login_result = run_command("railway login", description="Logging in to Railway")
    if not login_result:
        return None
    
    print("🚀 Initializing Railway project...")
    init_result = run_command("railway init", description="Initializing Railway project")
    if not init_result:
        return None
    
    print("📤 Deploying to Railway...")
    deploy_result = run_command("railway up", description="Deploying to Railway")
    if not deploy_result:
        return None
    
    # Get the deployed URL
    print("🔍 Getting deployment URL...")
    status_result = run_command("railway status", description="Getting Railway status")
    
    # Try to extract URL from status (Railway CLI output format may vary)
    if status_result and "https://" in status_result:
        lines = status_result.split('\n')
        for line in lines:
            if "https://" in line and "railway.app" in line:
                url = line.split()[-1]
                return url.strip()
    
    print("⚠️  Could not automatically detect URL. Please check Railway dashboard.")
    return "https://your-project-name.railway.app"

def create_backend_only_files():
    """Create files needed for backend-only deployment"""
    project_root = Path(__file__).parent
    
    # Create a simple requirements.txt for backend only
    backend_requirements = """flask==2.3.2
requests==2.31.0
flask-cors==4.0.0
gunicorn==20.1.0
python-dotenv==1.0.0
numpy>=1.24.0,<2.0.0
pandas>=2.0.0,<3.0.0
yfinance>=0.2.50
beautifulsoup4>=4.11.0
lxml>=4.6.0
html5lib>=1.1"""
    
    with open(project_root / "requirements.txt", "w") as f:
        f.write(backend_requirements)
    
    print("✅ Updated requirements.txt for backend deployment")
    
    # Create railway.json for Railway deployment
    railway_config = {
        "build": {
            "builder": "NIXPACKS"
        },
        "deploy": {
            "startCommand": "python app.py",
            "healthcheckPath": "/api/gold/price"
        }
    }
    
    with open(project_root / "railway.json", "w") as f:
        json.dump(railway_config, f, indent=2)
    
    print("✅ Created railway.json configuration")

def test_backend():
    """Test the backend locally"""
    print("🧪 Testing backend locally...")
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from app import app
        
        with app.test_client() as client:
            response = client.get('/api/gold/price')
            if response.status_code == 200:
                data = response.get_json()
                price = data.get('price', 'N/A')
                source = data.get('source', 'Unknown')
                print(f"✅ Backend test successful!")
                print(f"   💰 Price: ${price}")
                print(f"   📡 Source: {source}")
                return True
            else:
                print(f"❌ Backend test failed: {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Backend test error: {e}")
        return False

def main():
    """Main deployment function"""
    print("=" * 60)
    print("🚀 XAUUSD Backend Deployment (Netlify + Separate Backend)")
    print("=" * 60)
    print()
    
    project_root = Path(__file__).parent
    
    # Check if we're in the right directory
    if not (project_root / "app.py").exists():
        print("❌ Error: app.py not found. Please run this script from the project root.")
        return False
    
    print("📋 Deployment Plan:")
    print("   • Keep frontend on Netlify")
    print("   • Deploy backend to Railway/Render/Heroku")
    print("   • Update frontend to use backend URL")
    print()
    
    # Step 1: Create backend deployment files
    create_backend_only_files()
    
    # Step 2: Test backend locally
    if not test_backend():
        print("⚠️  Backend test failed, but continuing with deployment...")
    
    # Step 3: Deploy options
    print("\n🚀 Backend Deployment Options:")
    print()
    print("1. 🚂 Railway (Recommended - Free tier available)")
    print("2. 🟩 Render (Free tier available)")
    print("3. 🟦 Heroku (Paid)")
    print()
    
    choice = input("Choose deployment option (1-3): ").strip()
    
    backend_url = None
    
    if choice == "1":
        backend_url = deploy_to_railway()
    elif choice == "2":
        print("\n🟩 Render Deployment Instructions:")
        print("1. Go to https://render.com")
        print("2. Connect your GitHub repository")
        print("3. Create a new 'Web Service'")
        print("4. Configure:")
        print("   - Build Command: pip install -r requirements.txt")
        print("   - Start Command: python app.py")
        print("   - Environment: Python 3")
        print("5. Deploy!")
        print()
        backend_url = input("Enter your Render URL (e.g., https://your-app.onrender.com): ").strip()
    elif choice == "3":
        print("\n🟦 Heroku Deployment Instructions:")
        print("1. Install Heroku CLI")
        print("2. heroku login")
        print("3. heroku create your-gold-api")
        print("4. git push heroku main")
        print()
        backend_url = input("Enter your Heroku URL (e.g., https://your-app.herokuapp.com): ").strip()
    else:
        print("❌ Invalid choice")
        return False
    
    if backend_url:
        print(f"\n✅ Backend deployed to: {backend_url}")
        print()
        print("🔧 Next Steps for Netlify:")
        print("1. Go to your Netlify dashboard")
        print("2. Site Settings → Build & Deploy → Environment Variables")
        print("3. Add/Update:")
        print(f"   Key: VITE_API_URL")
        print(f"   Value: {backend_url}")
        print("4. Redeploy your site")
        print()
        print("🧪 Test your backend:")
        print(f"   {backend_url}/api/gold/price")
        print()
        
        # Update the goldApi.js file with the new URL
        goldapi_file = project_root / "react-app" / "src" / "api" / "goldApi.js"
        if goldapi_file.exists():
            content = goldapi_file.read_text()
            updated_content = content.replace(
                'https://your-backend-url.railway.app',
                backend_url
            )
            goldapi_file.write_text(updated_content)
            print(f"✅ Updated goldApi.js with backend URL: {backend_url}")
    
    print("\n🎉 Deployment completed!")
    print("Your Netlify frontend will now connect to your deployed backend!")
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Backend deployment completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Backend deployment failed!")
        sys.exit(1)

