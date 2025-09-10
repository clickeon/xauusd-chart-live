#!/usr/bin/env python3
"""
Startup script for the XAUUSD Gold Price Tracker
This script will start both the Flask backend and React frontend
"""

import subprocess
import sys
import os
import time
import threading
import webbrowser
from pathlib import Path

def start_flask_server():
    """Start the Flask backend server"""
    print("🚀 Starting Flask backend server...")
    try:
        # Change to the project directory
        os.chdir(Path(__file__).parent)
        
        # Start Flask server
        subprocess.run([sys.executable, "app.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Flask server stopped")
    except Exception as e:
        print(f"❌ Error starting Flask server: {e}")

def start_react_frontend():
    """Start the React frontend development server"""
    print("🚀 Starting React frontend server...")
    try:
        # Change to the react-app directory
        react_dir = Path(__file__).parent / "react-app"
        os.chdir(react_dir)
        
        # Start React development server
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 React server stopped")
    except Exception as e:
        print(f"❌ Error starting React server: {e}")

def main():
    """Main function to start both servers"""
    print("=" * 60)
    print("🏆 XAUUSD Gold Price Tracker - Live Gold Prices")
    print("=" * 60)
    print()
    print("This application now provides LIVE gold prices using Yahoo Finance API!")
    print("No API keys required - completely free to use.")
    print()
    
    # Check if we're in the right directory
    if not os.path.exists("app.py"):
        print("❌ Error: app.py not found. Please run this script from the project root directory.")
        return
    
    # Check if react-app directory exists
    if not os.path.exists("react-app"):
        print("❌ Error: react-app directory not found.")
        return
    
    print("📋 Starting servers...")
    print("   • Backend (Flask): http://localhost:8080")
    print("   • Frontend (React): http://localhost:5173")
    print()
    print("Press Ctrl+C to stop both servers")
    print("=" * 60)
    
    # Start Flask server in a separate thread
    flask_thread = threading.Thread(target=start_flask_server, daemon=True)
    flask_thread.start()
    
    # Wait a moment for Flask to start
    time.sleep(3)
    
    # Start React server in the main thread
    try:
        start_react_frontend()
    except KeyboardInterrupt:
        print("\n🛑 All servers stopped")

if __name__ == "__main__":
    main()
