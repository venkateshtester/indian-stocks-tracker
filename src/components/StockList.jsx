import React from 'react'
import { TrendingUp, TrendingDown, Minus, Trash2, RefreshCw, Target } from 'lucide-react'

const StockList = ({ stocks, niftyData, onRemoveStock, onRefreshStock }) => {
  if (stocks.length === 0) {
    return (
      <div className="card text-center py-12">
        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Stocks Added Yet</h3>
        <p className="text-gray-600">
          Add some stocks to start tracking their performance against the Nifty 50 benchmark.
        </p>
      </div>
    )
  }

  const calculatePerformance = (stock) => {
    if (!niftyData?.price_movement?.percentage || !stock.price_movement?.percentage) {
      return { relative: 0, status: 'neutral' }
    }

    const stockChange = stock.price_movement.percentage
    const niftyChange = niftyData.price_movement.percentage
    const relative = stockChange - niftyChange

    let status = 'neutral'
    if (relative > 0) status = 'profit'
    else if (relative < 0) status = 'loss'

    return { relative, status }
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return `₹${parseFloat(price).toLocaleString()}`
  }

  const formatPercentage = (percentage) => {
    if (!percentage) return 'N/A'
    return `${percentage.toFixed(2)}%`
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Tracked Stocks</h3>
        <div className="text-sm text-gray-500">
          {stocks.length} stock{stocks.length !== 1 ? 's' : ''} tracked
        </div>
      </div>

      <div className="space-y-4">
        {stocks.map((stock) => {
          const performance = calculatePerformance(stock)
          const isPositive = stock.price_movement?.movement === 'Up'
          const isNegative = stock.price_movement?.movement === 'Down'

          return (
            <div key={stock.id} className="stock-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRefreshStock(stock.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Refresh data"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemoveStock(stock.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove stock"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Price</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(stock.price)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Change</p>
                  <div className={`flex items-center space-x-1 ${
                    isPositive ? 'profit' : isNegative ? 'loss' : 'neutral'
                  }`}>
                    {isPositive && <TrendingUp className="h-3 w-3" />}
                    {isNegative && <TrendingDown className="h-3 w-3" />}
                    {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
                    <span className="font-semibold">
                      {formatPercentage(stock.price_movement?.percentage)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">vs Nifty 50</p>
                  <div className={`font-semibold ${
                    performance.status === 'profit' ? 'profit' : 
                    performance.status === 'loss' ? 'loss' : 'neutral'
                  }`}>
                    {performance.relative > 0 ? '+' : ''}{performance.relative.toFixed(2)}%
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Volume</p>
                  <p className="font-semibold text-gray-900">
                    {stock.volume ? `${(stock.volume / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
              </div>

              {stock.addedAt && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Added: {new Date(stock.addedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900 mb-2">Performance Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Beating Nifty:</span>
            <span className="ml-2 font-semibold profit">
              {stocks.filter(s => calculatePerformance(s).status === 'profit').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Underperforming:</span>
            <span className="ml-2 font-semibold loss">
              {stocks.filter(s => calculatePerformance(s).status === 'loss').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Neutral:</span>
            <span className="ml-2 font-semibold neutral">
              {stocks.filter(s => calculatePerformance(s).status === 'neutral').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockList
