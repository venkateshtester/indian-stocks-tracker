#!/bin/bash

echo "🚀 Starting Indian Stocks Tracker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp env.example .env
    echo "📝 Please edit .env file and add your SERPAPI_KEY"
    echo "🔑 Get your key from: https://serpapi.com/"
    echo ""
    echo "Press Enter after updating .env file..."
    read
fi

# Check if SERPAPI_KEY is set
if grep -q "YOUR_SERPAPI_KEY_HERE" .env; then
    echo "⚠️  Please update your SERPAPI_KEY in .env file"
    echo "🔑 Get your key from: https://serpapi.com/"
    exit 1
fi

echo "✅ Environment configured"
echo ""

# Start backend server in background
echo "🔧 Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
npm run dev

# Cleanup on exit
trap "echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM
wait
