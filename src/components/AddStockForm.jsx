import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'

const AddStockForm = ({ onAddStock }) => {
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!symbol.trim() || !name.trim()) {
      alert('Please enter both symbol and company name')
      return
    }

    setIsLoading(true)
    try {
      await onAddStock(symbol.trim().toUpperCase(), name.trim())
      setSymbol('')
      setName('')
    } catch (error) {
      console.error('Error adding stock:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Common Indian stock symbols for suggestions
  const commonStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'INFY', name: 'Infosys' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
    { symbol: 'ITC', name: 'ITC Limited' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
    { symbol: 'AXISBANK', name: 'Axis Bank' }
  ]

  const handleSuggestionClick = (suggestion) => {
    setSymbol(suggestion.symbol)
    setName(suggestion.name)
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Stock</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Symbol
          </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., RELIANCE"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nifty-blue focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Reliance Industries"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nifty-blue focus:border-transparent"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Stock</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Popular Stocks</span>
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {commonStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSuggestionClick(stock)}
              className="text-left p-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
            >
              <div className="font-medium text-gray-900">{stock.symbol}</div>
              <div className="text-gray-600">{stock.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> Use NSE stock symbols (e.g., RELIANCE, TCS, HDFCBANK). 
          The app will automatically fetch real-time data and compare performance against Nifty 50.
        </p>
      </div>
    </div>
  )
}

export default AddStockForm
