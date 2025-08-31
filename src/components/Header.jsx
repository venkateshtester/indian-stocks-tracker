import React from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-nifty-blue p-2 rounded-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Indian Stocks Tracker</h1>
              <p className="text-gray-600">Monitor performance against Nifty 50 benchmark</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span>Real-time updates every 5 minutes</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
