import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import NiftyBenchmark from './components/NiftyBenchmark'
import StockList from './components/StockList'
import AddStockForm from './components/AddStockForm'
import PerformanceChart from './components/PerformanceChart'
import { fetchNiftyData, fetchStockData } from './services/api'

function App() {
  const [niftyData, setNiftyData] = useState(null)
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load saved stocks from localStorage
  useEffect(() => {
    const savedStocks = localStorage.getItem('trackedStocks')
    if (savedStocks) {
      setStocks(JSON.parse(savedStocks))
    }
  }, [])

  // Save stocks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trackedStocks', JSON.stringify(stocks))
  }, [stocks])

  // Fetch initial data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        const nifty = await fetchNiftyData()
        setNiftyData(nifty)
        
        // Fetch data for all tracked stocks
        if (stocks.length > 0) {
          const stockDataPromises = stocks.map(stock => fetchStockData(stock.symbol))
          const stockDataResults = await Promise.all(stockDataPromises)
          
          const updatedStocks = stocks.map((stock, index) => ({
            ...stock,
            ...stockDataResults[index]
          }))
          
          setStocks(updatedStocks)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Refresh Nifty data
        const nifty = await fetchNiftyData()
        setNiftyData(nifty)
        
        // Refresh stock data
        if (stocks.length > 0) {
          const stockDataPromises = stocks.map(stock => fetchStockData(stock.symbol))
          const stockDataResults = await Promise.all(stockDataPromises)
          
          const updatedStocks = stocks.map((stock, index) => ({
            ...stock,
            ...stockDataResults[index]
          }))
          
          setStocks(updatedStocks)
        }
      } catch (err) {
        console.error('Auto-refresh error:', err)
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [stocks])

  const addStock = async (symbol, name) => {
    try {
      const stockData = await fetchStockData(symbol)
      const newStock = {
        id: Date.now(),
        symbol,
        name,
        addedAt: new Date().toISOString(),
        ...stockData
      }
      setStocks(prev => [...prev, newStock])
    } catch (err) {
      setError(`Failed to add stock ${symbol}: ${err.message}`)
    }
  }

  const removeStock = (id) => {
    setStocks(prev => prev.filter(stock => stock.id !== id))
  }

  const refreshStock = async (id) => {
    try {
      const stock = stocks.find(s => s.id === id)
      if (stock) {
        const updatedData = await fetchStockData(stock.symbol)
        setStocks(prev => prev.map(s => 
          s.id === id ? { ...s, ...updatedData } : s
        ))
      }
    } catch (err) {
      setError(`Failed to refresh stock ${stock?.symbol}: ${err.message}`)
    }
  }

  if (loading && !niftyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nifty-blue mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading market data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Nifty Benchmark & Add Stock */}
          <div className="lg:col-span-1 space-y-6">
            <NiftyBenchmark data={niftyData} />
            <AddStockForm onAddStock={addStock} />
          </div>
          
          {/* Right Column - Stock List & Performance Chart */}
          <div className="lg:col-span-2 space-y-6">
            <StockList 
              stocks={stocks} 
              niftyData={niftyData}
              onRemoveStock={removeStock}
              onRefreshStock={refreshStock}
            />
            {stocks.length > 0 && (
              <PerformanceChart stocks={stocks} niftyData={niftyData} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
