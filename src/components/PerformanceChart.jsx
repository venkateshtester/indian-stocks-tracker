import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const PerformanceChart = ({ stocks, niftyData }) => {
  const chartData = stocks.map(stock => {
    const stockChange = stock.price_movement?.percentage || 0
    const niftyChange = niftyData?.price_movement?.percentage || 0
    const relative = stockChange - niftyChange
    
    return {
      name: stock.symbol,
      stock: stockChange,
      nifty: niftyChange,
      relative: relative,
      color: relative > 0 ? '#10b981' : relative < 0 ? '#ef4444' : '#6b7280'
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const stockData = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Stock: <span className={stockData.stock >= 0 ? 'profit' : 'loss'}>
              {stockData.stock.toFixed(2)}%
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Nifty 50: <span className={stockData.nifty >= 0 ? 'profit' : 'loss'}>
              {stockData.nifty.toFixed(2)}%
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Relative: <span className={stockData.relative >= 0 ? 'profit' : 'loss'}>
              {stockData.relative > 0 ? '+' : ''}{stockData.relative.toFixed(2)}%
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Comparison</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="stock" 
              fill="#1e40af" 
              name="Stock Performance"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="nifty" 
              fill="#6b7280" 
              name="Nifty 50"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-nifty-blue">
            {stocks.filter(s => {
              const stockChange = s.price_movement?.percentage || 0
              const niftyChange = niftyData?.price_movement?.percentage || 0
              return stockChange > niftyChange
            }).length}
          </div>
          <div className="text-sm text-gray-600">Stocks Beating Nifty</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {stocks.filter(s => {
              const stockChange = s.price_movement?.percentage || 0
              const niftyChange = niftyData?.price_movement?.percentage || 0
              return stockChange === niftyChange
            }).length}
          </div>
          <div className="text-sm text-gray-600">Stocks Matching Nifty</div>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-loss-red">
            {stocks.filter(s => {
              const stockChange = s.price_movement?.percentage || 0
              const niftyChange = niftyData?.price_movement?.percentage || 0
              return stockChange < niftyChange
            }).length}
          </div>
          <div className="text-sm text-gray-600">Stocks Underperforming</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600 text-center">
          <strong>Chart Legend:</strong> Blue bars show individual stock performance, 
          Gray bars show Nifty 50 performance. Positive values indicate gains, negative values indicate losses.
        </p>
      </div>
    </div>
  )
}

export default PerformanceChart
