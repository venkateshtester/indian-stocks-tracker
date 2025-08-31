import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const NiftyBenchmark = ({ data }) => {
  if (!data) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  const { price, price_movement, market_cap, volume } = data
  const isPositive = price_movement?.movement === 'Up'
  const isNegative = price_movement?.movement === 'Down'

  return (
    <div className="card bg-gradient-to-br from-nifty-blue to-blue-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Nifty 50 Benchmark</h2>
        <div className="text-2xl font-bold">₹{price?.toLocaleString()}</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-blue-100">Change</span>
          <div className={`flex items-center space-x-1 ${
            isPositive ? 'text-green-300' : isNegative ? 'text-red-300' : 'text-blue-100'
          }`}>
            {isPositive && <TrendingUp className="h-4 w-4" />}
            {isNegative && <TrendingDown className="h-4 w-4" />}
            {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
            <span className="font-semibold">
              {price_movement?.percentage ? `${price_movement.percentage.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-blue-100">Market Cap</span>
          <span className="font-semibold">
            {market_cap ? `₹${(market_cap / 100000).toFixed(0)}T` : 'N/A'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-blue-100">Volume</span>
          <span className="font-semibold">
            {volume ? `${(volume / 1000000).toFixed(1)}M` : 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-500">
        <div className="text-center">
          <p className="text-blue-100 text-sm">Last Updated</p>
          <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  )
}

export default NiftyBenchmark
