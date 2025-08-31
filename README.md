# Indian Stocks Tracker 📈

A real-time Indian stocks tracking application that compares individual stock performance against the Nifty 50 benchmark. Built with React, Node.js, and powered by the SerpApi Google Finance API.

## ✨ Features

- **Real-time Nifty 50 Benchmark**: Live tracking of the Nifty 50 index with price movements, market cap, and volume
- **Stock Portfolio Management**: Add, remove, and track multiple Indian stocks
- **Performance Comparison**: Visual comparison of stock performance vs Nifty 50 benchmark
- **Interactive Charts**: Beautiful performance charts using Recharts
- **Auto-refresh**: Data updates every 5 minutes automatically
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- **Local Storage**: Persists your stock portfolio across browser sessions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SerpApi account and API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd indian-stocks-tracker
npm install
```

### 2. Configure API Key

1. Get your SerpApi key from [https://serpapi.com/](https://serpapi.com/)
2. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
3. Edit `.env` and add your API key:
   ```
   SERPAPI_KEY=your_actual_api_key_here
   ```

### 3. Start the Application

#### Option 1: Development Mode (Recommended)
```bash
# Terminal 1: Start backend server
npm start

# Terminal 2: Start frontend
npm run dev
```

#### Option 2: Production Mode
```bash
npm run build
npm run preview
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Architecture

```
indian-stocks-tracker/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── Header.jsx     # Application header
│   │   ├── NiftyBenchmark.jsx # Nifty 50 display
│   │   ├── AddStockForm.jsx   # Stock addition form
│   │   ├── StockList.jsx      # Stock portfolio list
│   │   └── PerformanceChart.jsx # Performance charts
│   ├── services/          # API services
│   │   └── api.js         # SerpApi integration
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind CSS styles
├── server.js              # Node.js backend server
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 📊 API Integration

The application uses the [SerpApi Google Finance API](https://serpapi.com/google-finance-api) to fetch real-time stock data:

- **Nifty 50**: `NIFTY50:INDEXNIFTY`
- **Individual Stocks**: `{SYMBOL}:NSE` (e.g., `RELIANCE:NSE`)

### Supported Data
- Current stock prices
- Price movements and percentages
- Market capitalization
- Trading volume
- Real-time updates

## 🎯 Usage

### Adding Stocks
1. Use the "Add New Stock" form on the left sidebar
2. Enter the NSE stock symbol (e.g., RELIANCE, TCS, HDFCBANK)
3. Enter the company name
4. Click "Add Stock"

### Popular Indian Stocks
The app includes suggestions for popular Indian stocks:
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

### Performance Tracking
- **Green indicators**: Stocks beating Nifty 50 performance
- **Red indicators**: Stocks underperforming vs Nifty 50
- **Real-time updates**: Data refreshes every 5 minutes
- **Performance charts**: Visual comparison of all stocks

## 🔧 Configuration

### Environment Variables
```bash
SERPAPI_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```

### API Endpoints
- `GET /api/nifty` - Get Nifty 50 data
- `GET /api/stock/:symbol` - Get specific stock data
- `POST /api/stock` - Add new stock to tracking
- `DELETE /api/stock/:symbol` - Remove stock from tracking
- `GET /api/stocks` - Get all tracked stocks
- `POST /api/refresh` - Manual data refresh
- `GET /api/health` - Health check

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm start            # Start backend server
```

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: SerpApi Google Finance

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Notes

- API keys are stored in environment variables
- CORS is enabled for development
- Input validation on all forms
- Error handling for API failures

## 🚨 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your SerpApi key is correct
   - Check if you have sufficient API credits
   - Ensure the key is set in your `.env` file

2. **Stocks Not Loading**
   - Check browser console for errors
   - Verify stock symbols are correct NSE symbols
   - Check network connectivity

3. **Data Not Updating**
   - Backend server should be running
   - Check server logs for errors
   - Verify cron job is working

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 📈 Future Enhancements

- [ ] Historical performance tracking
- [ ] Price alerts and notifications
- [ ] Portfolio performance analytics
- [ ] Export data to CSV/Excel
- [ ] Multiple benchmark comparisons
- [ ] Advanced charting options
- [ ] User authentication
- [ ] Multi-user portfolios

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [SerpApi](https://serpapi.com/) for providing the Google Finance API
- [Recharts](https://recharts.org/) for beautiful chart components
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide](https://lucide.dev/) for the icon set

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the API documentation at [SerpApi](https://serpapi.com/google-finance-api)
3. Open an issue in the repository
4. Contact the development team

---

**Happy Trading! 📊💰**
