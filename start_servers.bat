@echo off
echo ============================================================
echo 🏆 XAUUSD Gold Price Tracker - Live Gold Prices
echo ============================================================
echo.
echo This application provides LIVE gold prices using Yahoo Finance API!
echo No API keys required - completely free to use.
echo.
echo 📋 Starting servers...
echo    • Backend (Flask): http://localhost:8080
echo    • Frontend (React): http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo ============================================================
echo.

REM Start Flask backend in background
echo 🚀 Starting Flask backend server...
cd /d "%~dp0"
start /b python app.py

REM Wait a moment for Flask to start
timeout /t 3 /nobreak > nul

REM Start React frontend
echo 🚀 Starting React frontend server...
cd react-app
start /b npm run dev

REM Wait for React to start
timeout /t 5 /nobreak > nul

echo.
echo ✅ Both servers should now be running!
echo    • Backend API: http://localhost:8080/api/gold/price
echo    • Frontend App: http://localhost:5173
echo.
echo Opening the application in your default browser...
start http://localhost:5173

REM Keep the window open
pause
