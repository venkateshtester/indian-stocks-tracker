// API service for Indian Stocks Tracker
// This service calls our backend server which handles the SerpApi integration

const BACKEND_URL = 'http://localhost:3001'

// Helper function to make API calls to our backend
const makeApiCall = async (endpoint) => {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed')
    }

    return data.data
  } catch (error) {
    console.error('API call error:', error)
    throw new Error(`Failed to fetch data: ${error.message}`)
  }
}

// Fetch Nifty 50 benchmark data
export const fetchNiftyData = async () => {
  try {
    return await makeApiCall('/api/nifty')
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
    return await makeApiCall(`/api/stock/${symbol}`)
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

// Add stock to tracking
export const addStock = async (symbol, name) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol, name })
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to add stock')
    }

    return data.data
  } catch (error) {
    console.error('Error adding stock:', error)
    throw new Error(`Failed to add stock: ${error.message}`)
  }
}

// Remove stock from tracking
export const removeStock = async (symbol) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stock/${symbol}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to remove stock')
    }

    return true
  } catch (error) {
    console.error('Error removing stock:', error)
    throw new Error(`Failed to remove stock: ${error.message}`)
  }
}

// Get all tracked stocks
export const getTrackedStocks = async () => {
  try {
    return await makeApiCall('/api/stocks')
  } catch (error) {
    console.error('Error fetching tracked stocks:', error)
    return []
  }
}

// Manual refresh data
export const refreshData = async () => {
  try {
    return await makeApiCall('/api/refresh')
  } catch (error) {
    console.error('Error refreshing data:', error)
    throw new Error(`Failed to refresh data: ${error.message}`)
  }
}
