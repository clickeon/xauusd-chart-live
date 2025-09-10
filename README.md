# XAUUSD Chart Live - Gold Price Tracker

## Overview
XAUUSD Chart Live is a professional, SEO-optimized gold price tracking web application with real-time market data, interactive charts, and trading signals. It's designed to provide users with a comprehensive gold trading toolkit that includes price visualization, technical analysis, and market insights.

## Features
- **Live Gold Price Tracking**: Real-time XAUUSD market prices using Yahoo Finance API
- **Interactive Price Charts**: Multiple timeframes (1D, 1W, 1M, 3M, 6M, 1Y)
- **Chart Types**: Area and line visualization options
- **Trading Signals**: Automated buy/sell recommendations based on technical analysis
- **Technical Indicators**: RSI, SMA crossovers, and price action analysis
- **Latest Market News**: Gold-related financial news updates
- **Responsive Design**: Optimized for all device sizes
- **Robust Error Handling**: Fallback mechanisms for all data sources
- **Free API Integration**: No API keys required - uses Yahoo Finance for live data
//

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

## Installation Guide

### Backend (Flask)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/xauusd-chart-live.git
   cd xauusd-chart-live
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Configure API keys:
   - The application now uses Yahoo Finance API by default (no API key required)
   - For enhanced functionality, you can add additional API keys to a `.env` file
   - Supported APIs: Alpha Vantage, FCS API (fallback data is available without keys)

### Frontend (React)
1. Navigate to the React app directory:
   ```bash
   cd react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## How to Run

### Quick Start (Recommended)
Use the startup script to run both servers:
```bash
python start_server.py
```
This will start both the Flask backend and React frontend automatically.

### Manual Start

#### Backend
Start the Flask server:
```bash
python app.py
```
The server will run on http://localhost:8080

#### Frontend
Start the development server:
```bash
cd react-app
npm run dev
```
The React app will run on http://localhost:5173

### Docker (Optional)
You can also run the application using Docker:
```bash
docker build -t xauusd-chart-live .
docker run -p 8080:8080 xauusd-chart-live
```

## How to Use the API

The application provides several API endpoints for gold price data:

### Current Gold Price
```
GET /api/gold/price
```
Returns the current live gold price, change, and percentage change from Yahoo Finance.

**Response Example:**
```json
{
  "price": 2650.50,
  "change": 15.25,
  "change_percent": 0.58,
  "timestamp": "2025-01-10T15:30:00",
  "source": "Yahoo Finance (GC=F)",
  "success": true
}
```

### Historical Gold Prices
```
GET /api/gold/historical?period=1M
```
Parameters:
- `period`: Time period (1D, 1W, 1M, 3M, 6M, 1Y)

Returns historical price data for the specified period.

### Market Statistics
```
GET /api/gold/stats
```
Returns market statistics including day range, year range, and current price.

### Trading Signals
```
GET /api/gold/signals
```
Returns current trading signals with buy/sell recommendations.

### Gold News
```
GET /api/gold/news
```
Returns the latest gold-related market news.

## Contributing & AI Workflow Guidelines

We welcome contributions to the XAUUSD Chart Live project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### AI Workflow Guidelines

This project uses AI-assisted development to enhance productivity:

1. Use AI tools for code generation, refactoring, and documentation
2. Always review AI-generated code for accuracy and quality
3. Follow the project structure and conventions defined in PLANNING.md
4. Track tasks and progress in TASK.md
5. Document all changes in commit messages and update documentation as needed

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
