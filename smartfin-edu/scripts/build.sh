#!/bin/bash

# SmartFin Build Script
# Builds the application for production

set -e

echo "🏗️  Building SmartFin for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check

# Run linting
echo "🧹 Running ESLint..."
npm run lint

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🚀 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"