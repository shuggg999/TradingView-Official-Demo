#!/bin/bash

# SmartFin Development Script
# Starts the development environment

set -e

echo "🚀 Starting SmartFin Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL is not running. Please start PostgreSQL first."
    echo "   macOS: brew services start postgresql"
    echo "   Linux: sudo systemctl start postgresql"
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    echo "⚠️  Redis is not running. Please start Redis first."
    echo "   macOS: brew services start redis"
    echo "   Linux: sudo systemctl start redis"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma db push

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Start development server
echo "🌟 Starting Next.js development server..."
npm run dev