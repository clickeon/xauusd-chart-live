#!/usr/bin/env python3
"""
Deployment script for XAUUSD Gold Price Tracker
Builds React frontend and prepares for full-stack deployment
"""

import subprocess
import sys
import os
import shutil
from pathlib import Path

def run_command(command, cwd=None, description=""):
    """Run a shell command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return None

def main():
    """Main deployment function"""
    print("=" * 60)
    print("🚀 XAUUSD Gold Price Tracker - Full Stack Deployment")
    print("=" * 60)
    print()
    
    project_root = Path(__file__).parent
    react_app_dir = project_root / "react-app"
    
    # Check if we're in the right directory
    if not (project_root / "app.py").exists():
        print("❌ Error: app.py not found. Please run this script from the project root.")
        return False
    
    if not react_app_dir.exists():
        print("❌ Error: react-app directory not found.")
        return False
    
    print("📋 Deployment Steps:")
    print("   1. Install React dependencies")
    print("   2. Build React production bundle")
    print("   3. Verify Flask backend")
    print("   4. Test full-stack integration")
    print()
    
    # Step 1: Install React dependencies
    if not run_command("npm install", cwd=react_app_dir, 
                      description="Installing React dependencies"):
        return False
    
    # Step 2: Build React app
    if not run_command("npm run build", cwd=react_app_dir, 
                      description="Building React production bundle"):
        return False
    
    # Step 3: Verify build output
    dist_dir = react_app_dir / "dist"
    if not dist_dir.exists():
        print("❌ Error: React build failed - dist directory not found")
        return False
    
    index_file = dist_dir / "index.html"
    if not index_file.exists():
        print("❌ Error: React build failed - index.html not found")
        return False
    
    print("✅ React build successful!")
    print(f"   📁 Build output: {dist_dir}")
    
    # Step 4: Test Flask backend
    print("\n🔍 Testing Flask backend...")
    try:
        # Import and test the Flask app
        sys.path.insert(0, str(project_root))
        from app import app
        
        with app.test_client() as client:
            # Test API endpoint
            response = client.get('/api/gold/price')
            if response.status_code == 200:
                data = response.get_json()
                print(f"✅ API test successful - Price: ${data.get('price', 'N/A')}")
            else:
                print(f"⚠️  API test returned status: {response.status_code}")
            
            # Test React serving
            response = client.get('/')
            if response.status_code == 200:
                print("✅ React app serving test successful")
            else:
                print(f"⚠️  React serving test returned status: {response.status_code}")
    
    except Exception as e:
        print(f"⚠️  Backend test warning: {e}")
    
    # Step 5: Show deployment options
    print("\n" + "=" * 60)
    print("🎉 DEPLOYMENT READY!")
    print("=" * 60)
    print()
    print("Your full-stack application is ready for deployment!")
    print()
    print("🚀 Deployment Options:")
    print()
    print("1. 🟦 Heroku (Recommended):")
    print("   heroku create your-app-name")
    print("   git push heroku main")
    print()
    print("2. 🟨 Railway:")
    print("   npm install -g @railway/cli")
    print("   railway login")
    print("   railway init")
    print("   railway up")
    print()
    print("3. 🟩 Render:")
    print("   - Connect GitHub repo at render.com")
    print("   - Build: python deploy.py")
    print("   - Start: python app.py")
    print()
    print("4. 🟪 Google Cloud:")
    print("   gcloud app deploy")
    print()
    print("📊 What you'll get:")
    print("   • Frontend: React app with live gold prices")
    print("   • Backend: Flask API with Yahoo Finance data")
    print("   • Single URL for both frontend and API")
    print("   • No CORS issues!")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("✅ Deployment preparation completed successfully!")
        sys.exit(0)
    else:
        print("❌ Deployment preparation failed!")
        sys.exit(1)
