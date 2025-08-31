// API service for SerpApi Google Finance
// You'll need to get your API key from https://serpapi.com/

const SERPAPI_KEY = process.env.REACT_APP_SERPAPI_KEY || 'YOUR_SERPAPI_KEY_HERE'
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

// Fetch Nifty 50 benchmark data
export const fetchNiftyData = async () => {
  try {
    const data = await makeApiCall({
      engine: 'google_finance',
      q: 'NIFTY50:INDEXNIFTY'
    })

    // Extract relevant data from the response
    const summary = data.summary
    if (!summary) {
      throw new Error('No summary data found for Nifty 50')
    }

    return {
      price: summary.extracted_price || summary.price,
      price_movement: summary.price_movement,
      market_cap: summary.market_cap,
      volume: summary.volume,
      currency: summary.currency || 'INR',
      exchange: summary.exchange,
      last_updated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching Nifty data:', error)
    // Return mock data for development/testing
    return {
      price: 19500.00,
      price_movement: {
        percentage: 0.75,
        movement: 'Up'
      },
      market_cap: 8500000000000, // 8.5T
      volume: 2500000000, // 2.5B
      currency: 'INR',
      exchange: 'NSE',
      last_updated: new Date().toISOString()
    }
  }
}

// Fetch individual stock data
export const fetchStockData = async (symbol) => {
  try {
    // For Indian stocks, we need to append :NSE to get NSE data
    const searchQuery = `${symbol}:NSE`
    
    const data = await makeApiCall({
      engine: 'google_finance',
      q: searchQuery
    })

    // Extract relevant data from the response
    const summary = data.summary
    if (!summary) {
      throw new Error(`No summary data found for ${symbol}`)
    }

    return {
      price: summary.extracted_price || summary.price,
      price_movement: summary.price_movement,
      market_cap: summary.market_cap,
      volume: summary.volume,
      currency: summary.currency || 'INR',
      exchange: summary.exchange || 'NSE',
      last_updated: new Date().toISOString()
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error)
    
    // Return mock data for development/testing
    const mockChange = (Math.random() - 0.5) * 4 // Random change between -2% and +2%
    return {
      price: 1000 + Math.random() * 2000, // Random price between 1000-3000
      price_movement: {
        percentage: mockChange,
        movement: mockChange > 0 ? 'Up' : mockChange < 0 ? 'Down' : 'Neutral'
      },
      market_cap: 100000000000 + Math.random() * 900000000000, // Random market cap
      volume: 1000000 + Math.random() * 9000000, // Random volume
      currency: 'INR',
      exchange: 'NSE',
      last_updated: new Date().toISOString()
    }
  }
}

// Fetch historical data for charts (optional)
export const fetchHistoricalData = async (symbol, window = '1M') => {
  try {
    const data = await makeApiCall({
      engine: 'google_finance',
      q: `${symbol}:NSE`,
      window: window
    })

    return data.graph || []
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error)
    return []
  }
}

// Search for stocks by name
export const searchStocks = async (query) => {
  try {
    const data = await makeApiCall({
      engine: 'google_finance',
      q: query
    })

    // Extract search suggestions or results
    return data.related_searches || []
  } catch (error) {
    console.error('Error searching stocks:', error)
    return []
  }
}

// Get market overview
export const getMarketOverview = async () => {
  try {
    const data = await makeApiCall({
      engine: 'google_finance',
      q: 'Indian stock market'
    })

    return data
  } catch (error) {
    console.error('Error fetching market overview:', error)
    return null
  }
}
