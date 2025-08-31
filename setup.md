# 🚀 Quick Setup Guide

## 1. Get Your SerpApi Key

1. Visit [https://serpapi.com/](https://serpapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. The free tier includes 100 searches per month

## 2. Configure Environment

```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your API key
nano .env  # or use any text editor
```

Update the `.env` file:
```bash
SERPAPI_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
```

## 3. Start the Application

### Option A: Using the startup script (Recommended)
```bash
./start.sh
```

### Option B: Manual start
```bash
# Terminal 1: Start backend
npm start

# Terminal 2: Start frontend
npm run dev
```

## 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 5. Add Your First Stock

1. Open the application in your browser
2. Use the "Add New Stock" form on the left
3. Enter a stock symbol (e.g., RELIANCE, TCS, HDFCBANK)
4. Enter the company name
5. Click "Add Stock"

## 🎯 Popular Indian Stock Symbols

- **RELIANCE** - Reliance Industries
- **TCS** - Tata Consultancy Services  
- **HDFCBANK** - HDFC Bank
- **INFY** - Infosys
- **ICICIBANK** - ICICI Bank
- **HINDUNILVR** - Hindustan Unilever
- **ITC** - ITC Limited
- **SBIN** - State Bank of India
- **BHARTIARTL** - Bharti Airtel
- **AXISBANK** - Axis Bank

## 🔧 Troubleshooting

### API Key Issues
- Verify your SerpApi key is correct
- Check if you have sufficient API credits
- Ensure the key is set in your `.env` file

### Port Conflicts
- If port 5000 is busy, change it in `.env`
- If port 3000 is busy, Vite will automatically use the next available port

### Data Not Loading
- Check browser console for errors
- Verify stock symbols are correct NSE symbols
- Check if the backend server is running

## 📊 What You'll See

- **Real-time Nifty 50 data** on the left sidebar
- **Stock portfolio** with performance comparison
- **Performance charts** showing relative performance
- **Auto-refresh** every 5 minutes
- **Responsive design** that works on all devices

## 🎉 You're Ready!

Your Indian Stocks Tracker is now running! Monitor your favorite stocks and see how they perform against the Nifty 50 benchmark.
