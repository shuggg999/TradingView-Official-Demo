#!/bin/bash

# SmartFin Setup Script
# Initial project setup for new developers

set -e

echo "🔧 Setting up SmartFin Technology Platform..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration values."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup database
echo "🗄️  Setting up database..."
npx prisma db push

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Seed database with initial data
echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the correct values"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see the application"