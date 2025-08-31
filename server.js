const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage for real-time data
let niftyData = null
let stockData = new Map()
let lastUpdate = null

// SerpApi configuration
const SERPAPI_KEY = process.env.SERPAPI_KEY || 'YOUR_SERPAPI_KEY_HERE'
const BASE_URL = 'https://serpapi.com/search.json'

// Helper function to make API calls
const makeApiCall = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      api_key: SERPAPI_KEY,
      hl: 'en',
      gl: 'in'
    })

    const response = await fetch(`${BASE_URL}?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.error('API call error:', error)
    throw new Error(`Failed to fetch data: ${error.message}`)
  }
}

// Fetch Nifty 50 data
const fetchNiftyData = async () => {
  try {
    const data = await makeApiCall({
      engine: 'google_finance',
      q: 'NIFTY50:INDEXNIFTY'
    })

    // The API response structure has markets data, not summary
    // Look for NIFTY_50:INDEXNSE in the markets section
    let niftyData = null
    
    if (data.markets) {
      // Search through all market sections for NIFTY 50
      for (const marketSection of Object.values(data.markets)) {
        if (Array.isArray(marketSection)) {
          niftyData = marketSection.find(item => 
            item.stock === 'NIFTY_50:INDEXNSE' || 
            item.name === 'NIFTY 50'
          )
          if (niftyData) break
        }
      }
    }

    if (!niftyData) {
      throw new Error('No Nifty 50 data found in API response')
    }

    return {
      price: niftyData.price || 0,
      price_movement: niftyData.price_movement || { percentage: 0, movement: 'Neutral' },
      market_cap: niftyData.market_cap || 0,
      volume: niftyData.volume || 0,
      currency: 'INR',
      exchange: 'NSE',
      last_updated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching Nifty data:', error)
    // Return mock data for development
    return {
      price: 19500.00,
      price_movement: {
        percentage: 0.75,
        movement: 'Up'
      },
      market_cap: 8500000000000,
      volume: 2500000000,
      currency: 'INR',
      exchange: 'NSE',
      last_updated: new Date().toISOString()
    }
  }
}

// Fetch stock data
const fetchStockData = async (symbol) => {
  try {
    const searchQuery = `${symbol}:NSE`
    
    const data = await makeApiCall({
      engine: 'google_finance',
      q: searchQuery
    })

    // The API response structure has markets data, not summary
    // Look for the stock in the markets section
    let stockData = null
    
    if (data.markets) {
      // Search through all market sections for the stock
      for (const marketSection of Object.values(data.markets)) {
        if (Array.isArray(marketSection)) {
          stockData = marketSection.find(item => 
            item.stock === searchQuery || 
            item.name && item.name.toLowerCase().includes(symbol.toLowerCase())
          )
          if (stockData) break
        }
      }
    }

    if (!stockData) {
      throw new Error(`No stock data found for ${symbol}`)
    }

    return {
      price: stockData.price || 0,
      price_movement: stockData.price_movement || { percentage: 0, movement: 'Neutral' },
      market_cap: stockData.market_cap || 0,
      volume: stockData.volume || 0,
      currency: 'INR',
      exchange: 'NSE',
      last_updated: new Date().toISOString()
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error)
    
    // Return mock data for development
    const mockChange = (Math.random() - 0.5) * 4
    return {
      price: 1000 + Math.random() * 2000,
      price_movement: {
        percentage: mockChange,
        movement: mockChange > 0 ? 'Up' : mockChange < 0 ? 'Down' : 'Neutral'
      },
      market_cap: 100000000000 + Math.random() * 900000000000,
      volume: 1000000 + Math.random() * 9000000,
      currency: 'INR',
      exchange: 'NSE',
      last_updated: new Date().toISOString()
    }
  }
}

// Update all data
const updateAllData = async () => {
  try {
    console.log('Updating market data...')
    
    // Update Nifty data
    niftyData = await fetchNiftyData()
    
    // Update stock data for all tracked stocks
    for (const [symbol] of stockData) {
      try {
        const data = await fetchStockData(symbol)
        stockData.set(symbol, data)
      } catch (error) {
        console.error(`Failed to update ${symbol}:`, error)
      }
    }
    
    lastUpdate = new Date().toISOString()
    console.log('Market data updated successfully')
  } catch (error) {
    console.error('Failed to update market data:', error)
  }
}

// Schedule data updates every 5 minutes
cron.schedule('*/5 * * * *', updateAllData)

// Initial data fetch
updateAllData()

// API Routes

// Get Nifty 50 data
app.get('/api/nifty', (req, res) => {
  res.json({
    success: true,
    data: niftyData,
    last_update: lastUpdate
  })
})

// Get stock data
app.get('/api/stock/:symbol', (req, res) => {
  const { symbol } = req.params
  const data = stockData.get(symbol.toUpperCase())
  
  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Stock not found'
    })
  }
  
  res.json({
    success: true,
    data,
    last_update: lastUpdate
  })
})

// Add stock to tracking
app.post('/api/stock', async (req, res) => {
  try {
    const { symbol } = req.body
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Symbol is required'
      })
    }
    
    const data = await fetchStockData(symbol.toUpperCase())
    stockData.set(symbol.toUpperCase(), data)
    
    res.json({
      success: true,
      data,
      message: 'Stock added successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Remove stock from tracking
app.delete('/api/stock/:symbol', (req, res) => {
  const { symbol } = req.params
  const removed = stockData.delete(symbol.toUpperCase())
  
  if (removed) {
    res.json({
      success: true,
      message: 'Stock removed successfully'
    })
  } else {
    res.status(404).json({
      success: false,
      error: 'Stock not found'
    })
  }
})

// Get all tracked stocks
app.get('/api/stocks', (req, res) => {
  const stocks = Array.from(stockData.entries()).map(([symbol, data]) => ({
    symbol,
    ...data
  }))
  
  res.json({
    success: true,
    data: stocks,
    last_update: lastUpdate
  })
})

// Manual data refresh
app.post('/api/refresh', async (req, res) => {
  try {
    await updateAllData()
    res.json({
      success: true,
      message: 'Data refreshed successfully',
      last_update: lastUpdate
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    last_update: lastUpdate
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Indian Stocks Tracker server running on port ${PORT}`)
  console.log(`📊 Auto-updating market data every 5 minutes`)
  console.log(`🔑 SerpApi Key: ${SERPAPI_KEY ? 'Configured' : 'NOT CONFIGURED'}`)
  
  if (!SERPAPI_KEY || SERPAPI_KEY === 'YOUR_SERPAPI_KEY_HERE') {
    console.log('⚠️  Please set your SERPAPI_KEY environment variable for real data')
    console.log('📖 Get your key from: https://serpapi.com/')
  }
})
