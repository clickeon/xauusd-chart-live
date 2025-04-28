# XAUUSD Chart Live - Gold Price Tracker

## Overview
XAUUSD Chart Live is a professional, SEO-optimized gold price tracking web application with real-time market data, interactive charts, and trading signals. It's designed to provide users with a comprehensive gold trading toolkit that includes price visualization, technical analysis, and market insights.

## Features
- **Real-time Gold Price Tracking**: Up-to-date XAUUSD market prices
- **Interactive Price Charts**: Multiple timeframes (1D, 1W, 1M, 3M, 6M, 1Y)
- **Chart Types**: Area and line visualization options
- **Trading Signals**: Automated buy/sell recommendations based on technical analysis
- **Technical Indicators**: RSI, SMA crossovers, and price action analysis
- **Latest Market News**: Gold-related financial news updates
- **Responsive Design**: Optimized for all device sizes
- **Robust Error Handling**: Fallback mechanisms for all data sources

## Tech Stack
- **Frontend**: React with Tailwind CSS and Recharts
- **Backend**: Python Flask API
- **State Management**: React Hooks
- **API Integration**: Axios
- **Data Visualization**: Recharts library

## Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip (Python package manager)

## Setup Instructions

### Backend (Flask)
1. Create a virtual environment:
   ```bash
   cd XAUUSD
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Configure API keys:
   - Create a `.env` file with your API keys for enhanced functionality
   - Supported APIs: Alpha Vantage, FCS API (fallback data is available without keys)

4. Start the Flask server:
   ```bash
   python app.py
   ```
   The server will run on http://localhost:8080

### Frontend (React)
1. Navigate to the React app directory:
   ```bash
   cd react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The React app will run on http://localhost:5173

## Trading Simulator Integration
This project is designed to integrate with a Trading Simulator platform, providing:
- Price chart visualization that matches project requirements
- Technical indicator calculations aligned with educational goals
- Signal generation supporting pattern recognition exercises

## Development Roadmap
- User preference settings
- Enhanced mobile responsiveness
- More sophisticated trading signal algorithms
- Internationalization support
- Advanced risk management tools

## License
This project is licensed under the MIT License - see the LICENSE file for details.
